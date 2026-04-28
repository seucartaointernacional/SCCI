import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        valor: true,
        status: true,
        paidAt: true,
        pixCopyPaste: true,
        pixQrCode: true,
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Pagamento não encontrado" }, { status: 404 });
    }

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Error fetching payment:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
