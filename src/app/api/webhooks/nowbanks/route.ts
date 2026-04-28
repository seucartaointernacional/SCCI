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
