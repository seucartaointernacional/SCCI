import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-auth";
import { sendConfirmationEmail } from "@/lib/email";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { id } = params;

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        proposals: {
          include: {
            card: true,
            payment: true,
          },
        },
      },
    });

    if (!lead) {
      return NextResponse.json(
        { error: "Lead não encontrado" },
        { status: 404 }
      );
    }

    const proposal = lead.proposals[0];
    if (!proposal) {
      return NextResponse.json(
        { error: "Lead não possui proposta" },
        { status: 400 }
      );
    }

    if (!proposal.payment || proposal.payment.status !== "pago") {
      return NextResponse.json(
        { error: "Pagamento ainda não foi confirmado" },
        { status: 400 }
      );
    }

    const result = await sendConfirmationEmail(lead.email, {
      nome: lead.nome,
      cardName: proposal.card.nome,
      cardBandeira: proposal.card.bandeira,
      limiteBrl: proposal.limiteBrl,
      moeda: proposal.moeda,
      limiteEstrangeiro: proposal.limiteEstrangeiro,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Erro ao enviar e-mail" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error resending email:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
