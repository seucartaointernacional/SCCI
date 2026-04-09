import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const cards = [
  {
    id: "card-atlas-blue",
    nome: "Atlas Blue",
    bandeira: "Visa",
    corPrimaria: "#1e3a8a",
    corSecundaria: "#3b82f6",
    corTexto: "#ffffff",
    moedas: JSON.stringify(["USD", "EUR"]),
  },
  {
    id: "card-nova-gold",
    nome: "Nova Gold",
    bandeira: "Mastercard",
    corPrimaria: "#92400e",
    corSecundaria: "#f59e0b",
    corTexto: "#ffffff",
    moedas: JSON.stringify(["USD", "EUR"]),
  },
  {
    id: "card-emerald",
    nome: "Emerald",
    bandeira: "Visa",
    corPrimaria: "#064e3b",
    corSecundaria: "#10b981",
    corTexto: "#ffffff",
    moedas: JSON.stringify(["EUR", "THB"]),
  },
  {
    id: "card-arctic",
    nome: "Arctic",
    bandeira: "Mastercard",
    corPrimaria: "#1e293b",
    corSecundaria: "#94a3b8",
    corTexto: "#ffffff",
    moedas: JSON.stringify(["USD", "THB"]),
  },
  {
    id: "card-sunset",
    nome: "Sunset",
    bandeira: "Visa",
    corPrimaria: "#7c2d12",
    corSecundaria: "#f97316",
    corTexto: "#ffffff",
    moedas: JSON.stringify(["USD", "EUR", "THB"]),
  },
];

async function main() {
  console.log("Seeding cards...");
  for (const card of cards) {
    await prisma.card.upsert({
      where: { id: card.id },
      update: card,
      create: card,
    });
  }
  console.log(`Seeded ${cards.length} cards.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
