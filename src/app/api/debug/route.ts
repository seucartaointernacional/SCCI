import { NextResponse } from "next/server";

export async function GET() {
  const results: Record<string, string> = {};

  // Check env
  results.hasDbUrl = process.env.DATABASE_URL ? "yes" : "no";
  results.dbUrlPrefix = process.env.DATABASE_URL?.substring(0, 30) + "..." || "missing";

  // Test pg connection
  try {
    const pg = await import("pg");
    const pool = new pg.default.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
    const res = await pool.query("SELECT COUNT(*) as count FROM \"Card\"");
    results.pgConnection = "ok";
    results.cardCount = res.rows[0].count;
    await pool.end();
  } catch (e) {
    results.pgConnection = "failed";
    results.pgError = e instanceof Error ? e.message : String(e);
  }

  // Test prisma
  try {
    const { prisma } = await import("@/lib/prisma");
    const cards = await prisma.card.findMany();
    results.prismaConnection = "ok";
    results.prismaCardCount = String(cards.length);
  } catch (e) {
    results.prismaConnection = "failed";
    results.prismaError = e instanceof Error ? e.message : String(e);
    results.prismaStack = e instanceof Error ? (e.stack?.substring(0, 500) || "") : "";
  }

  return NextResponse.json(results);
}
