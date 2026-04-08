import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-auth";

export async function GET(request: Request) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (search) {
      where.OR = [
        { nome: { contains: search } },
        { cpfCnpj: { contains: search } },
      ];
    }

    if (status === "aceita") {
      where.proposals = { some: { status: "aceita" } };
    } else if (status === "pago") {
      where.proposals = { some: { payment: { status: "pago" } } };
    }

    const leads = await prisma.lead.findMany({
      where,
      include: {
        proposals: {
          include: {
            card: true,
            payment: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error("Error fetching admin leads:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
