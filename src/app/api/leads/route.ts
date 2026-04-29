import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { leadFormSchema } from "@/lib/validations";
import { cleanCpfCnpj } from "@/lib/formatters";
import {
  generateDeterministicIndex,
  generateLimiteBrl,
  convertToCurrency,
  pickCurrency,
} from "@/lib/proposal-utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = leadFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const cpfCnpjClean = cleanCpfCnpj(data.cpfCnpj);

    // Check if lead already exists with a proposal
    const existingLead = await prisma.lead.findUnique({
      where: { cpfCnpj: cpfCnpjClean },
      include: { proposals: { take: 1 } },
    });

    if (existingLead && existingLead.proposals.length > 0) {
      return NextResponse.json(
        {
          leadId: existingLead.id,
          proposalId: existingLead.proposals[0].id,
        },
        { status: 200 }
      );
    }

    // Upsert lead
    const lead = await prisma.lead.upsert({
      where: { cpfCnpj: cpfCnpjClean },
      update: {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        cep: data.cep,
        rua: data.rua,
        numero: data.numero,
        complemento: data.complemento || null,
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado,
        renda: data.renda,
        limiteDesejado: data.limiteDesejado,
        negativado: data.negativado,
      },
      create: {
        nome: data.nome,
        cpfCnpj: cpfCnpjClean,
        email: data.email,
        telefone: data.telefone,
        cep: data.cep,
        rua: data.rua,
        numero: data.numero,
        complemento: data.complemento || null,
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado,
        renda: data.renda,
        limiteDesejado: data.limiteDesejado,
        negativado: data.negativado,
      },
    });

    // Pick a card deterministically
    const cards = await prisma.card.findMany();
    if (cards.length === 0) {
      return NextResponse.json(
        { error: "Nenhum cartão disponível" },
        { status: 500 }
      );
    }

    const cardIndex = generateDeterministicIndex(cpfCnpjClean, cards.length);
    const card = cards[cardIndex];

    // Generate limits and currency
    const limiteBrl = generateLimiteBrl(cpfCnpjClean, data.limiteDesejado);
    const moedas: string[] = JSON.parse(card.moedas);
    const moeda = pickCurrency(cpfCnpjClean, moedas);
    const limiteEstrangeiro = convertToCurrency(limiteBrl, moeda);

    // Create proposal
    const proposal = await prisma.proposal.create({
      data: {
        leadId: lead.id,
        cardId: card.id,
        moeda,
        limiteEstrangeiro,
        limiteBrl,
      },
    });

    return NextResponse.json(
      { leadId: lead.id, proposalId: proposal.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating lead:", error instanceof Error ? error.message : error);
    console.error("Stack:", error instanceof Error ? error.stack : "no stack");
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
