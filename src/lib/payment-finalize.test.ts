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
import * as prismaModule from "./prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { updateMock, findUniqueMock } = (prismaModule as any).__mocks;

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
