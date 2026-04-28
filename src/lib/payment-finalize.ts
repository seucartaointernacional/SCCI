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
  // Don't overwrite a paid status — a late FAILED webhook arriving after a successful
  // COMPLETED would otherwise destroy the paid record.
  const existing = await prisma.payment.findUnique({
    where: { id: paymentId },
    select: { status: true },
  });
  if (!existing || existing.status === "pago" || existing.status === "falhou") {
    return;
  }
  await prisma.payment.update({
    where: { id: paymentId },
    data: { status: "falhou" },
  });
  console.warn(`Payment ${paymentId} marked failed (NowBanks status: ${providerStatus})`);
}
