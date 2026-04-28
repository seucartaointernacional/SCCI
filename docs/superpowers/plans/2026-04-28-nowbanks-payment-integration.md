# NowBanks Payment Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hardcoded fake PIX on `/pagamento` with a real PIX charge generated through the NowBanks API, confirmed automatically when the customer pays via webhook (HMAC-SHA256 + `external_id` lookup) plus frontend polling for UX feedback.

**Architecture:** When the customer accepts a proposal, the accept route creates a local `Payment` row and calls NowBanks `POST /v1/payments/deposit` with `external_id = Payment.id`, persisting the returned `transaction_id`, `pix_copy_paste`, and `pix_qr_code`. The `/pagamento` page reads from the local DB and polls every 3s. NowBanks calls `POST /api/webhooks/nowbanks` when payment lands; the route validates the HMAC signature, looks up the Payment by `external_id`, and marks it as paid (idempotent). The "Simular Pagamento" button stays — both it and the webhook share a single `payment-finalize` helper.

**Tech Stack:** Next.js 14 (App Router) · Prisma 7 · PostgreSQL (Supabase) · TypeScript · Zustand · Resend (email) · Vitest (added by this plan) · Node `crypto` (HMAC)

**Spec:** [docs/superpowers/specs/2026-04-28-nowbanks-payment-integration-design.md](../specs/2026-04-28-nowbanks-payment-integration-design.md)

---

## Task 1: Set up Vitest

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `tsconfig.test.json`

- [ ] **Step 1: Install Vitest**

Run:
```bash
npm install -D vitest @vitest/ui
```

Expected: package.json gains `vitest` and `@vitest/ui` under `devDependencies`.

- [ ] **Step 2: Create `vitest.config.ts`**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 3: Add test scripts to package.json**

Modify `package.json` — add to `scripts`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Verify Vitest runs (with no tests)**

Run: `npm test`
Expected: Vitest reports "No test files found" and exits with code 0 or 1 (either is fine — we just confirm it executes).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "chore: configurar Vitest para testes unitários"
```

---

## Task 2: Add NowBanks fields to Payment schema

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Update the Payment model**

Replace the `Payment` model block in `prisma/schema.prisma` with:

```prisma
model Payment {
  id                    String    @id @default(cuid())
  proposalId            String    @unique
  proposal              Proposal  @relation(fields: [proposalId], references: [id])
  valor                 Float
  status                String    @default("aguardando")
  paidAt                DateTime?
  nowbanksTransactionId String?   @unique
  pixCopyPaste          String?
  pixQrCode             String?
  createdAt             DateTime  @default(now())
}
```

- [ ] **Step 2: Push schema to dev DB**

Run: `npx prisma db push`
Expected: "Your database is now in sync with your Prisma schema." Prisma client is regenerated.

- [ ] **Step 3: Verify the generated Prisma client has the new fields**

Run:
```bash
node -e "const { PrismaClient } = require('./src/generated/prisma/client'); const p = new PrismaClient(); console.log(Object.keys(p.payment.fields));"
```

Expected: output includes `nowbanksTransactionId`, `pixCopyPaste`, `pixQrCode`.

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma src/generated/prisma
git commit -m "feat(prisma): adicionar campos do NowBanks no Payment"
```

> **Note for the engineer:** The user must also run `npx prisma db push` against the production Supabase database before this code goes live. This will be reminded in the final task.

---

## Task 3: Create NowBanks client — types and error class

**Files:**
- Create: `src/lib/nowbanks.ts`

- [ ] **Step 1: Create the file with shared types and error class**

Create `src/lib/nowbanks.ts`:

```ts
const DEFAULT_BASE_URL = "https://api.nowbanks.com.br";

export class NowBanksError extends Error {
  constructor(
    public readonly status: number,
    public readonly detail: string,
    public readonly endpoint: string
  ) {
    super(`NowBanks ${endpoint} returned ${status}: ${detail}`);
    this.name = "NowBanksError";
  }
}

export interface CreateDepositParams {
  amount: number;
  externalId: string;
  payer?: {
    name: string;
    document: string;
  };
  callbackUrl?: string;
}

export interface CreateDepositResult {
  transactionId: string;
  status: string;
  pixCopyPaste: string;
  pixQrCode: string;
  amount: number;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface DepositResponse {
  transaction_id: string;
  status: string;
  pix_copy_paste: string;
  pix_qr_code: string;
  amount: number;
}

function getBaseUrl(): string {
  return process.env.NOWBANKS_BASE_URL || DEFAULT_BASE_URL;
}

function getCredentials(): { clientId: string; clientSecret: string } {
  const clientId = process.env.NOWBANKS_CLIENT_ID;
  const clientSecret = process.env.NOWBANKS_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new NowBanksError(
      500,
      "NOWBANKS_CLIENT_ID or NOWBANKS_CLIENT_SECRET env var is missing",
      "config"
    );
  }
  return { clientId, clientSecret };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/nowbanks.ts
git commit -m "feat(nowbanks): tipos e classe de erro do cliente"
```

---

## Task 4: NowBanks client — `getAccessToken` with in-memory cache

**Files:**
- Modify: `src/lib/nowbanks.ts`

- [ ] **Step 1: Append the token cache and `getAccessToken` function**

Append to `src/lib/nowbanks.ts`:

```ts
let cachedToken: { value: string; expiresAt: number } | null = null;
const REFRESH_BUFFER_MS = 60_000;

export async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt - REFRESH_BUFFER_MS > Date.now()) {
    return cachedToken.value;
  }

  const { clientId, clientSecret } = getCredentials();

  const response = await fetch(`${getBaseUrl()}/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new NowBanksError(response.status, text || "auth failed", "/v1/auth/login");
  }

  const data = (await response.json()) as AuthResponse;
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return data.access_token;
}

// Exposed for tests only — resets the in-memory token cache.
export function __resetTokenCacheForTests(): void {
  cachedToken = null;
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/nowbanks.ts
git commit -m "feat(nowbanks): getAccessToken com cache em memória"
```

---

## Task 5: NowBanks client — `createDeposit`

**Files:**
- Modify: `src/lib/nowbanks.ts`

- [ ] **Step 1: Append `createDeposit`**

Append to `src/lib/nowbanks.ts`:

```ts
export async function createDeposit(params: CreateDepositParams): Promise<CreateDepositResult> {
  const token = await getAccessToken();

  const body: Record<string, unknown> = {
    amount: params.amount,
    external_id: params.externalId,
  };
  if (params.payer) {
    body.payer = { name: params.payer.name, document: params.payer.document };
  }
  if (params.callbackUrl) {
    body.clientCallbackUrl = params.callbackUrl;
  }

  const response = await fetch(`${getBaseUrl()}/v1/payments/deposit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new NowBanksError(response.status, text || "deposit failed", "/v1/payments/deposit");
  }

  const data = (await response.json()) as DepositResponse;
  return {
    transactionId: data.transaction_id,
    status: data.status,
    pixCopyPaste: data.pix_copy_paste,
    pixQrCode: data.pix_qr_code,
    amount: data.amount,
  };
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/nowbanks.ts
git commit -m "feat(nowbanks): função createDeposit"
```

---

## Task 6: NowBanks client — `verifyWebhookSignature` (with tests)

**Files:**
- Modify: `src/lib/nowbanks.ts`
- Create: `src/lib/nowbanks.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/nowbanks.test.ts`:

```ts
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import crypto from "node:crypto";
import { verifyWebhookSignature } from "./nowbanks";

const SECRET = "test-secret-1234567890abcdef";

function sign(body: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(body).digest("hex");
}

describe("verifyWebhookSignature", () => {
  const originalEnv = process.env.NOWBANKS_WEBHOOK_SECRET;

  beforeEach(() => {
    process.env.NOWBANKS_WEBHOOK_SECRET = SECRET;
  });

  afterEach(() => {
    process.env.NOWBANKS_WEBHOOK_SECRET = originalEnv;
  });

  it("returns true for a valid signature", () => {
    const body = '{"id":"evt_1","type":"deposit.updated"}';
    const sig = sign(body, SECRET);
    expect(verifyWebhookSignature(body, sig)).toBe(true);
  });

  it("returns false for an invalid signature", () => {
    const body = '{"id":"evt_1","type":"deposit.updated"}';
    const wrong = sign(body, "different-secret");
    expect(verifyWebhookSignature(body, wrong)).toBe(false);
  });

  it("returns false when the signature header is empty", () => {
    const body = '{"id":"evt_1"}';
    expect(verifyWebhookSignature(body, "")).toBe(false);
  });

  it("returns false when NOWBANKS_WEBHOOK_SECRET is missing", () => {
    delete process.env.NOWBANKS_WEBHOOK_SECRET;
    const body = '{"id":"evt_1"}';
    const sig = sign(body, SECRET);
    expect(verifyWebhookSignature(body, sig)).toBe(false);
  });

  it("returns false when the signature has wrong length (no timing leak)", () => {
    const body = '{"id":"evt_1"}';
    expect(verifyWebhookSignature(body, "abc123")).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test — verify it fails**

Run: `npm test`
Expected: FAIL — `verifyWebhookSignature is not exported from "./nowbanks"`.

- [ ] **Step 3: Add the import for `crypto` at the top of `src/lib/nowbanks.ts`**

Add this line at the very top of `src/lib/nowbanks.ts` (above `const DEFAULT_BASE_URL`):

```ts
import crypto from "node:crypto";
```

- [ ] **Step 4: Append `verifyWebhookSignature`**

Append to `src/lib/nowbanks.ts`:

```ts
export function verifyWebhookSignature(rawBody: string, signatureHeader: string): boolean {
  const secret = process.env.NOWBANKS_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) {
    return false;
  }

  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const expectedBuf = Buffer.from(expected, "hex");
  const givenBuf = Buffer.from(signatureHeader, "hex");

  if (expectedBuf.length !== givenBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuf, givenBuf);
}
```

- [ ] **Step 5: Run tests — verify they pass**

Run: `npm test`
Expected: all 5 tests in `nowbanks.test.ts` PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/nowbanks.ts src/lib/nowbanks.test.ts
git commit -m "feat(nowbanks): verifyWebhookSignature com testes HMAC"
```

---

## Task 7: Create `payment-finalize` helper (with idempotency test)

**Files:**
- Create: `src/lib/payment-finalize.ts`
- Create: `src/lib/payment-finalize.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/payment-finalize.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";

vi.mock("./prisma", () => {
  const updateMock = vi.fn();
  const findUniqueMock = vi.fn();
  return {
    prisma: {
      payment: {
        update: updateMock,
        findUnique: findUniqueMock,
      },
    },
    __mocks: { updateMock, findUniqueMock },
  };
});

vi.mock("./email", () => ({
  sendConfirmationEmail: vi.fn().mockResolvedValue({ success: true }),
}));

import { finalizePayment } from "./payment-finalize";
import { sendConfirmationEmail } from "./email";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prismaModule = (await import("./prisma")) as any;
const { updateMock, findUniqueMock } = prismaModule.__mocks;

const fakePayment = {
  id: "pay_1",
  status: "aguardando",
  paidAt: null,
  proposal: {
    lead: { email: "test@example.com", nome: "Maria" },
    card: { nome: "Cartão Teste", bandeira: "visa" },
    moeda: "USD",
    limiteEstrangeiro: 200,
    limiteBrl: 1000,
  },
};

describe("finalizePayment", () => {
  it("marks payment as paid and sends email on first call", async () => {
    findUniqueMock.mockResolvedValueOnce({ ...fakePayment });
    updateMock.mockResolvedValueOnce({ ...fakePayment, status: "pago", paidAt: new Date() });

    const result = await finalizePayment("pay_1");

    expect(result.alreadyPaid).toBe(false);
    expect(updateMock).toHaveBeenCalledOnce();
    expect(sendConfirmationEmail).toHaveBeenCalledWith("test@example.com", expect.any(Object));
  });

  it("is idempotent — second call returns alreadyPaid, no email", async () => {
    vi.mocked(sendConfirmationEmail).mockClear();
    findUniqueMock.mockResolvedValueOnce({ ...fakePayment, status: "pago", paidAt: new Date() });

    const result = await finalizePayment("pay_1");

    expect(result.alreadyPaid).toBe(true);
    expect(updateMock).toHaveBeenCalledTimes(1); // not called again
    expect(sendConfirmationEmail).not.toHaveBeenCalled();
  });

  it("returns notFound when payment does not exist", async () => {
    findUniqueMock.mockResolvedValueOnce(null);
    const result = await finalizePayment("missing");
    expect(result.notFound).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

Run: `npm test`
Expected: FAIL — module `./payment-finalize` not found.

- [ ] **Step 3: Create the helper**

Create `src/lib/payment-finalize.ts`:

```ts
import { prisma } from "./prisma";
import { sendConfirmationEmail } from "./email";

export interface FinalizeResult {
  paymentId?: string;
  alreadyPaid?: boolean;
  notFound?: boolean;
  status?: string;
}

export async function finalizePayment(paymentId: string): Promise<FinalizeResult> {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      proposal: {
        include: { lead: true, card: true },
      },
    },
  });

  if (!payment) {
    return { notFound: true };
  }

  if (payment.status === "pago") {
    return { paymentId: payment.id, alreadyPaid: true, status: "pago" };
  }

  const updated = await prisma.payment.update({
    where: { id: paymentId },
    data: { status: "pago", paidAt: new Date() },
    include: {
      proposal: {
        include: { lead: true, card: true },
      },
    },
  });

  // Send confirmation email — non-blocking failure (log only).
  try {
    const { proposal } = updated;
    await sendConfirmationEmail(proposal.lead.email, {
      nome: proposal.lead.nome,
      cardName: proposal.card.nome,
      cardBandeira: proposal.card.bandeira,
      limiteBrl: proposal.limiteBrl,
      moeda: proposal.moeda,
      limiteEstrangeiro: proposal.limiteEstrangeiro,
    });
  } catch (err) {
    console.error("Failed to send confirmation email:", err);
  }

  return { paymentId: updated.id, alreadyPaid: false, status: "pago" };
}

export async function markPaymentFailed(paymentId: string, providerStatus: string): Promise<void> {
  await prisma.payment.update({
    where: { id: paymentId },
    data: { status: "falhou" },
  });
  console.warn(`Payment ${paymentId} marked failed (NowBanks status: ${providerStatus})`);
}
```

- [ ] **Step 4: Run tests — verify they pass**

Run: `npm test`
Expected: all tests in `payment-finalize.test.ts` PASS, plus existing nowbanks tests still pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/payment-finalize.ts src/lib/payment-finalize.test.ts
git commit -m "feat(payment): helper finalizePayment idempotente"
```

---

## Task 8: Refactor `confirm` route to use `finalizePayment`

**Files:**
- Modify: `src/app/api/payments/[id]/confirm/route.ts`

- [ ] **Step 1: Replace the route file**

Replace the entire contents of `src/app/api/payments/[id]/confirm/route.ts` with:

```ts
import { NextResponse } from "next/server";
import { finalizePayment } from "@/lib/payment-finalize";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await finalizePayment(params.id);

    if (result.notFound) {
      return NextResponse.json({ error: "Pagamento não encontrado" }, { status: 404 });
    }

    if (result.alreadyPaid) {
      return NextResponse.json({ alreadyPaid: true });
    }

    return NextResponse.json({ paymentId: result.paymentId, status: result.status });
  } catch (error) {
    console.error("Error confirming payment:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Verify the dev server compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/payments/[id]/confirm/route.ts
git commit -m "refactor(payments): rota confirm usa finalizePayment"
```

---

## Task 9: Create `GET /api/payments/[id]` route

**Files:**
- Create: `src/app/api/payments/[id]/route.ts`

- [ ] **Step 1: Create the route**

Create `src/app/api/payments/[id]/route.ts`:

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        valor: true,
        status: true,
        paidAt: true,
        pixCopyPaste: true,
        pixQrCode: true,
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Pagamento não encontrado" }, { status: 404 });
    }

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Error fetching payment:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/payments/[id]/route.ts
git commit -m "feat(api): GET /api/payments/[id] retorna PIX e status"
```

---

## Task 10: Create webhook route `POST /api/webhooks/nowbanks`

**Files:**
- Create: `src/app/api/webhooks/nowbanks/route.ts`

- [ ] **Step 1: Create the route**

Create `src/app/api/webhooks/nowbanks/route.ts`:

```ts
import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/nowbanks";
import { finalizePayment, markPaymentFailed } from "@/lib/payment-finalize";

interface DepositUpdatedEvent {
  id: string;
  type: "deposit.updated";
  data: {
    transaction_id: string;
    status: string;
    amount: number;
    external_id: string;
    provider?: string;
    updated_at?: string;
  };
  created_at: string;
}

const FAILURE_STATUSES = new Set(["FAILED", "CANCELED", "REJECTED"]);

export async function POST(request: Request) {
  // 1. Read raw body — HMAC must run on exact bytes.
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature") || "";

  // 2. Fail-closed if env is missing.
  if (!process.env.NOWBANKS_WEBHOOK_SECRET) {
    console.error("[nowbanks-webhook] NOWBANKS_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 503 });
  }

  // 3. Verify signature.
  if (!verifyWebhookSignature(rawBody, signature)) {
    console.warn("[nowbanks-webhook] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // 4. Parse JSON.
  let event: DepositUpdatedEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // 5. Ignore events we do not handle.
  if (event.type !== "deposit.updated") {
    return NextResponse.json({ ok: true, ignored: event.type });
  }

  const { external_id, status, transaction_id } = event.data;

  if (!external_id) {
    console.warn(`[nowbanks-webhook] Event ${event.id} missing external_id`);
    return NextResponse.json({ ok: true, warning: "missing external_id" });
  }

  // 6. Process based on provider status.
  try {
    if (status === "COMPLETED") {
      const result = await finalizePayment(external_id);
      if (result.notFound) {
        console.warn(`[nowbanks-webhook] Payment ${external_id} not found (txn ${transaction_id})`);
      }
    } else if (FAILURE_STATUSES.has(status)) {
      await markPaymentFailed(external_id, status);
    }
    // Other statuses (PENDING, PROCESSING, WAITING_PAYMENT, RETIDO) — no action, log only.
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[nowbanks-webhook] Processing error:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/webhooks/nowbanks/route.ts
git commit -m "feat(webhook): POST /api/webhooks/nowbanks com validação HMAC"
```

---

## Task 11: Update `accept` route to create the NowBanks deposit

**Files:**
- Modify: `src/app/api/proposals/[id]/accept/route.ts`

- [ ] **Step 1: Replace the route file**

Replace the entire contents of `src/app/api/proposals/[id]/accept/route.ts` with:

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TAXA_IMPORTACAO } from "@/lib/proposal-utils";
import { createDeposit, NowBanksError } from "@/lib/nowbanks";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: { lead: true },
    });

    if (!proposal) {
      return NextResponse.json({ error: "Proposta não encontrada" }, { status: 404 });
    }

    if (proposal.status !== "pendente") {
      return NextResponse.json({ error: "Proposta já foi processada" }, { status: 400 });
    }

    // Step A: create local Payment + flip Proposal in a single transaction.
    const [, payment] = await prisma.$transaction([
      prisma.proposal.update({
        where: { id },
        data: { status: "aceita" },
      }),
      prisma.payment.create({
        data: {
          proposalId: id,
          valor: TAXA_IMPORTACAO,
          status: "aguardando",
        },
      }),
    ]);

    // Step B: ask NowBanks to create the PIX. If this fails, roll back step A.
    try {
      const appBaseUrl = process.env.APP_BASE_URL || "https://seucartaointernacional.com";
      const deposit = await createDeposit({
        amount: TAXA_IMPORTACAO,
        externalId: payment.id,
        payer: {
          name: proposal.lead.nome,
          document: proposal.lead.cpfCnpj.replace(/\D/g, ""),
        },
        callbackUrl: `${appBaseUrl}/api/webhooks/nowbanks`,
      });

      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          nowbanksTransactionId: deposit.transactionId,
          pixCopyPaste: deposit.pixCopyPaste,
          pixQrCode: deposit.pixQrCode,
        },
      });

      return NextResponse.json({
        proposalId: proposal.id,
        paymentId: payment.id,
      });
    } catch (depositError) {
      // Roll back: delete the payment row, revert proposal status.
      await prisma.$transaction([
        prisma.payment.delete({ where: { id: payment.id } }),
        prisma.proposal.update({ where: { id }, data: { status: "pendente" } }),
      ]).catch((rollbackErr) => {
        console.error("Rollback failed after NowBanks error:", rollbackErr);
      });

      console.error("NowBanks createDeposit failed:", depositError);
      const status = depositError instanceof NowBanksError ? 502 : 500;
      return NextResponse.json(
        { error: "Não foi possível processar o pagamento. Tente novamente." },
        { status }
      );
    }
  } catch (error) {
    console.error("Error accepting proposal:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Run all tests**

Run: `npm test`
Expected: all tests still pass.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/proposals/[id]/accept/route.ts
git commit -m "feat(payments): aceitar proposta cria depósito NowBanks com rollback"
```

---

## Task 12: Update `/pagamento` page — real PIX + polling

**Files:**
- Modify: `src/app/pagamento/page.tsx`

- [ ] **Step 1: Replace the page with the real-PIX version**

Replace the entire contents of `src/app/pagamento/page.tsx` with:

```tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useFlowStore } from "@/lib/store";
import { formatBRL } from "@/lib/proposal-utils";
import FlowHeader from "@/components/FlowHeader";
import FlowFooter from "@/components/FlowFooter";
import FlowProgress from "@/components/FlowProgress";
import { CopyIcon, CheckIcon, ClockIcon, ShieldCheckIcon } from "@/components/icons";

const TIMER_SECONDS = 30 * 60; // 30 minutes
const POLL_INTERVAL_MS = 3000;

const PROGRESS_LABELS = ["Dados", "Análise", "Proposta", "Etapa Final", "Confirmação"];

interface PaymentData {
  id: string;
  valor: number;
  status: string;
  pixCopyPaste: string | null;
  pixQrCode: string | null;
}

export default function PagamentoPage() {
  const router = useRouter();
  const { paymentId } = useFlowStore();
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS);
  const [confirming, setConfirming] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Guard: redirect to home if no paymentId.
  useEffect(() => {
    if (!paymentId) {
      router.replace("/");
    }
  }, [paymentId, router]);

  // Initial load + polling.
  useEffect(() => {
    if (!paymentId) return;
    let cancelled = false;

    async function fetchPayment() {
      try {
        const res = await fetch(`/api/payments/${paymentId}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data: PaymentData = await res.json();
        if (cancelled) return;
        setPayment(data);
        setLoadError(false);
        if (data.status === "pago") {
          if (pollingRef.current) clearInterval(pollingRef.current);
          router.push("/confirmacao");
        }
      } catch (err) {
        console.error("Error fetching payment:", err);
        if (cancelled && payment) return;
        if (!payment) setLoadError(true);
      }
    }

    fetchPayment();
    pollingRef.current = setInterval(fetchPayment, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [paymentId, router, payment]);

  // Countdown.
  useEffect(() => {
    if (!paymentId) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (pollingRef.current) clearInterval(pollingRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [paymentId]);

  const formatTime = useCallback((totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, []);

  async function handleCopy() {
    if (!payment?.pixCopyPaste) return;
    try {
      await navigator.clipboard.writeText(payment.pixCopyPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = payment.pixCopyPaste;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleSimulatePayment() {
    if (!paymentId || confirming) return;
    setConfirming(true);
    try {
      const res = await fetch(`/api/payments/${paymentId}/confirm`, { method: "POST" });
      if (!res.ok) throw new Error("Falha ao confirmar pagamento");
      // Confirmation email is sent server-side; polling will pick up the status flip.
      // Forcing a navigation for snappier UX.
      router.push("/confirmacao");
    } catch (err) {
      console.error("Error confirming payment:", err);
      setConfirming(false);
    }
  }

  if (!paymentId) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <FlowHeader backHref="/aceita" />
      <FlowProgress currentStep={4} totalSteps={5} labels={PROGRESS_LABELS} />

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          className="max-w-lg mx-auto w-full card-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Pagamento via PIX</h1>
            <p className="text-gray-500 text-sm">Escaneie o QR Code ou copie o código PIX</p>
          </div>

          {loadError && !payment && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-sm text-red-700 mb-3">
                Não foi possível carregar o pagamento. Tente novamente.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary text-sm"
              >
                Recarregar
              </button>
            </div>
          )}

          {!payment && !loadError && (
            <div className="flex flex-col items-center py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />
              <p className="mt-4 text-sm text-gray-500">Gerando QR Code...</p>
            </div>
          )}

          {payment && payment.pixQrCode && (
            <>
              <div className="flex justify-center mb-6">
                <div className="bg-white p-4 rounded-2xl shadow-card border border-gray-100 inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={payment.pixQrCode} alt="QR Code PIX" width={220} height={220} />
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-center mb-6">
                <p className="text-2xl font-bold text-gray-900">{formatBRL(payment.valor)}</p>
                <p className="text-sm text-gray-500 mt-1">Importação + Frete</p>
              </div>

              <div className="mb-4">
                <button
                  onClick={handleCopy}
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                  disabled={!payment.pixCopyPaste}
                >
                  {copied ? (
                    <>
                      <CheckIcon size={18} className="text-emerald-600" />
                      <span className="text-emerald-600">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon size={18} />
                      Copiar código PIX
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 mb-4">
                <ClockIcon size={16} className={secondsLeft <= 300 ? "text-red-500" : "text-gray-400"} />
                <p
                  className={`text-lg font-mono font-bold ${
                    secondsLeft <= 300 ? "text-red-500" : "text-gray-700"
                  }`}
                >
                  {formatTime(secondsLeft)}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 mb-6">
                <ShieldCheckIcon size={14} className="text-emerald-600" />
                <p className="text-xs text-emerald-600">Pagamento processado em ambiente seguro</p>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <button
                  onClick={handleSimulatePayment}
                  disabled={confirming}
                  className="w-full py-2.5 text-xs text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-60"
                >
                  {confirming ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                      Confirmando...
                    </span>
                  ) : (
                    "Simular Pagamento"
                  )}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </main>

      <FlowFooter />
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Remove the now-unused `qrcode.react` dependency**

Run:
```bash
npm uninstall qrcode.react
```

Expected: dependency removed from `package.json`.

- [ ] **Step 4: Verify nothing else imports `qrcode.react`**

Run grep:
```bash
git grep "qrcode.react" -- "src/**" || echo "no remaining usages"
```

Expected: "no remaining usages".

- [ ] **Step 5: Run dev server smoke test**

Run: `npm run dev` in one terminal, then visit `http://localhost:3000` and walk through the flow up to `/pagamento`.

Expected: with `NOWBANKS_CLIENT_ID` and `NOWBANKS_CLIENT_SECRET` set in `.env.local`, the page shows a real QR Code and a real `pix_copy_paste` string. Without those envs set, the `/aceita` button will return a 502 — which is the correct behavior.

> **If you do not yet have valid NowBanks credentials in `.env.local`**, skip Step 5 and rely on Task 13 for the production smoke test.

- [ ] **Step 6: Commit**

```bash
git add src/app/pagamento/page.tsx package.json package-lock.json
git commit -m "feat(pagamento): renderizar PIX real do NowBanks com polling"
```

---

## Task 13: Final verification and deployment notes

**Files:** none — this is operational.

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 2: Run the build locally**

Run: `npm run build`
Expected: build succeeds with no TypeScript or lint errors.

- [ ] **Step 3: Deployment checklist (for the user, not the engineer)**

Document the following in the final assistant message to the user:

**Required Vercel environment variables (Settings → Environment Variables → Production):**
- `NOWBANKS_CLIENT_ID` — from NowBanks panel → Chaves API
- `NOWBANKS_CLIENT_SECRET` — **the rotated value**, not the one shared in chat
- `NOWBANKS_WEBHOOK_SECRET` — **the rotated value** from NowBanks panel → Webhooks
- `APP_BASE_URL` = `https://seucartaointernacional.com`

**Optional:**
- `NOWBANKS_BASE_URL` (defaults to `https://api.nowbanks.com.br` if unset)

**Database:** the user must run `npx prisma db push` against the production Supabase database (or trigger it via the Vercel build) before the new code goes live, so the new `Payment` columns exist.

**NowBanks dashboard:** the webhook URL `https://seucartaointernacional.com/api/webhooks/nowbanks` is already registered. After rotating secrets, paste the new webhook secret into Vercel.

**First production test:** make one R$ 1,00 transaction end-to-end:
1. Open `https://seucartaointernacional.com`, fill the form, accept the proposal.
2. On `/pagamento`, scan or copy the QR with a real bank app and pay R$ 1,00.
3. Within ~10 seconds, the page should redirect to `/confirmacao` automatically.
4. Check Vercel logs for the webhook hit (`[nowbanks-webhook] Invalid signature` would indicate the env var mismatch).
5. Check the Supabase `Payment` table — the row should have `status = "pago"`, `paidAt` set, and `nowbanksTransactionId` populated.

If something fails, the NowBanks dashboard has a "Testar" button on each webhook URL that sends a sample event — useful for isolating webhook delivery vs application logic.

- [ ] **Step 4: Commit any final docs (none expected)**

If no further changes, skip. Otherwise commit.

---

## Self-Review

After writing this plan, the writer ran the following self-review:

- **Spec coverage:** every component listed in the spec maps to a task: `nowbanks.ts` → Tasks 3-6, schema → Task 2, accept route → Task 11, GET payment → Task 9, webhook → Task 10, confirm refactor → Tasks 7-8, pagamento page → Task 12. Rollout plan → Task 13.
- **Placeholder scan:** no TBD/TODO/"add appropriate error handling" found. Code blocks complete in every step.
- **Type consistency:** `CreateDepositResult` (Task 5) properties match the destructuring in Task 11. `FinalizeResult` (Task 7) properties match the route response in Task 8. Webhook event interface (Task 10) matches the doc payload.
- **Open spec items deferred to manual test:** sandbox question and PIX expiration behavior — both noted in the spec's "Open questions" section and exercised in Task 13's first production test.
