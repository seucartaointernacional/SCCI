import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TAXA_IMPORTACAO } from "@/lib/proposal-utils";
import { createDeposit, NowBanksError } from "@/lib/nowbanks";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: { lead: true },
    });

    if (!proposal) {
      return NextResponse.json({ error: "Proposta não encontrada" }, { status: 404 });
    }

    if (proposal.status !== "pendente") {
      return NextResponse.json({ error: "Proposta já foi processada" }, { status: 400 });
    }

    // Step A: create local Payment + flip Proposal in a single transaction.
    const [, payment] = await prisma.$transaction([
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

    // Step B: ask NowBanks to create the PIX. If this fails, roll back step A.
    try {
      const appBaseUrl = process.env.APP_BASE_URL || "https://seucartaointernacional.com";
      const deposit = await createDeposit({
        amount: TAXA_IMPORTACAO,
        externalId: payment.id,
        payer: {
          name: proposal.lead.nome,
          document: proposal.lead.cpfCnpj.replace(/\D/g, ""),
        },
        callbackUrl: `${appBaseUrl}/api/webhooks/nowbanks`,
      });

      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          nowbanksTransactionId: deposit.transactionId,
          pixCopyPaste: deposit.pixCopyPaste,
          pixQrCode: deposit.pixQrCode,
        },
      });

      return NextResponse.json({
        proposalId: proposal.id,
        paymentId: payment.id,
      });
    } catch (depositError) {
      // Roll back: delete the payment row, revert proposal status.
      await prisma.$transaction([
        prisma.payment.delete({ where: { id: payment.id } }),
        prisma.proposal.update({ where: { id }, data: { status: "pendente" } }),
      ]).catch((rollbackErr) => {
        console.error("Rollback failed after NowBanks error:", rollbackErr);
      });

      console.error("NowBanks createDeposit failed:", depositError);
      const status = depositError instanceof NowBanksError ? 502 : 500;
      return NextResponse.json(
        { error: "Não foi possível processar o pagamento. Tente novamente." },
        { status }
      );
    }
  } catch (error) {
    console.error("Error accepting proposal:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
