import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const updatedProposal = await prisma.proposal.update({
      where: { id },
      data: { status: "recusada" },
    });

    return NextResponse.json({
      proposalId: updatedProposal.id,
      status: "recusada",
    });
  } catch (error) {
    console.error("Error rejecting proposal:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
