import { NextResponse } from "next/server";
import { finalizePayment } from "@/lib/payment-finalize";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await finalizePayment(params.id);

    if (result.notFound) {
      return NextResponse.json({ error: "Pagamento não encontrado" }, { status: 404 });
    }

    if (result.alreadyPaid) {
      return NextResponse.json({ alreadyPaid: true });
    }

    return NextResponse.json({ paymentId: result.paymentId, status: result.status });
  } catch (error) {
    console.error("Error confirming payment:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
