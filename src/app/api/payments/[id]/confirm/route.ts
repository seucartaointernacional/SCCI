import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendConfirmationEmail } from "@/lib/email";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const payment = await prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Pagamento não encontrado" },
        { status: 404 }
      );
    }

    if (payment.status === "pago") {
      return NextResponse.json({ alreadyPaid: true });
    }

    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        status: "pago",
        paidAt: new Date(),
      },
      include: {
        proposal: {
          include: {
            lead: true,
            card: true,
          },
        },
      },
    });

    // Send confirmation email (non-blocking)
    try {
      const { proposal } = updatedPayment;
      await sendConfirmationEmail(proposal.lead.email, {
        nome: proposal.lead.nome,
        cardName: proposal.card.nome,
        cardBandeira: proposal.card.bandeira,
        limiteBrl: proposal.limiteBrl,
        moeda: proposal.moeda,
        limiteEstrangeiro: proposal.limiteEstrangeiro,
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
    }

    return NextResponse.json({
      paymentId: updatedPayment.id,
      status: "pago",
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
