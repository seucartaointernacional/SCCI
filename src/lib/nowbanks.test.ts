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
