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
    // Retry up to 2 times for transient 5xx (VELANA gateway instability).
    try {
      const appBaseUrl = process.env.APP_BASE_URL || "https://seucartaointernacional.com";
      const depositPayload = {
        amount: TAXA_IMPORTACAO,
        externalId: payment.id,
        payer: {
          name: proposal.lead.nome,
          document: proposal.lead.cpfCnpj.replace(/\D/g, ""),
        },
        callbackUrl: `${appBaseUrl}/api/webhooks/nowbanks`,
      };

      let deposit;
      let lastErr: unknown;
      const maxAttempts = 3;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          deposit = await createDeposit(depositPayload);
          if (attempt > 1) {
            console.log(
              `NowBanks createDeposit succeeded on attempt ${attempt} for payment ${payment.id}`
            );
          }
          break;
        } catch (err) {
          lastErr = err;
          // Only retry on 5xx (transient provider errors). 4xx = our payload, no point retrying.
          const isRetryable =
            err instanceof NowBanksError && err.status >= 500 && err.status < 600;
          if (!isRetryable || attempt === maxAttempts) {
            throw err;
          }
          const backoffMs = 800 * attempt; // 800ms, 1600ms
          console.warn(
            `NowBanks attempt ${attempt}/${maxAttempts} failed (${err.status}). Retrying in ${backoffMs}ms...`,
            err.detail.slice(0, 200)
          );
          await new Promise((r) => setTimeout(r, backoffMs));
        }
      }

      if (!deposit) {
        throw lastErr ?? new Error("createDeposit failed without throwing");
      }

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

      // Server-side log keeps full technical detail for ops/debug.
      console.error("NowBanks createDeposit failed (after retries):", depositError);

      const isNowBanksErr = depositError instanceof NowBanksError;
      const status = isNowBanksErr ? 502 : 500;

      // Friendly message shown to end users; technical detail is logged but not exposed.
      const friendly =
        "Nosso sistema de pagamento está temporariamente instável. Por favor, tente novamente em alguns minutos.";

      return NextResponse.json({ error: friendly }, { status });
    }
  } catch (error) {
    console.error("Error accepting proposal:", error);
    const detail =
      error instanceof Error
        ? `Erro interno: ${error.message.slice(0, 200)}`
        : "Erro interno do servidor";
    return NextResponse.json({ error: detail }, { status: 500 });
  }
}
