import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    });

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
