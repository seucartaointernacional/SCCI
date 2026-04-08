import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: {
        card: true,
        lead: true,
      },
    });

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposta não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: proposal.id,
      moeda: proposal.moeda,
      limiteEstrangeiro: proposal.limiteEstrangeiro,
      limiteBrl: proposal.limiteBrl,
      status: proposal.status,
      card: {
        id: proposal.card.id,
        nome: proposal.card.nome,
        bandeira: proposal.card.bandeira,
        corPrimaria: proposal.card.corPrimaria,
        corSecundaria: proposal.card.corSecundaria,
        corTexto: proposal.card.corTexto,
      },
      lead: {
        nome: proposal.lead.nome,
        cpfCnpj: proposal.lead.cpfCnpj,
        email: proposal.lead.email,
      },
    });
  } catch (error) {
    console.error("Error fetching proposal:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
