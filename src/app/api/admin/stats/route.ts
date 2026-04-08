import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-auth";

export async function GET() {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const [totalLeads, totalProposalsAceitas, payments] = await Promise.all([
      prisma.lead.count(),
      prisma.proposal.count({ where: { status: "aceita" } }),
      prisma.payment.findMany({ where: { status: "pago" } }),
    ]);

    const totalPayments = payments.length;
    const valorArrecadado = payments.reduce((sum, p) => sum + p.valor, 0);

    return NextResponse.json({
      totalLeads,
      totalProposalsAceitas,
      totalPayments,
      valorArrecadado,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
