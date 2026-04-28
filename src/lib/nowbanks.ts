import crypto from "node:crypto";

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

export function verifyWebhookSignature(rawBody: string, signatureHeader: string): boolean {
  try {
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
  } catch {
    return false;
  }
}
