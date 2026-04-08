import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TAXA_IMPORTACAO } from "@/lib/proposal-utils";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const proposal = await prisma.proposal.findUnique({
      where: { id },
    });

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposta não encontrada" },
        { status: 404 }
      );
    }

    if (proposal.status !== "pendente") {
      return NextResponse.json(
        { error: "Proposta já foi processada" },
        { status: 400 }
      );
    }

    const [updatedProposal, payment] = await prisma.$transaction([
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

    return NextResponse.json({
      proposalId: updatedProposal.id,
      paymentId: payment.id,
    });
  } catch (error) {
    console.error("Error accepting proposal:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
