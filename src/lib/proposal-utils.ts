export const TAXA_IMPORTACAO = 36.40;

const EXCHANGE_RATES: Record<string, number> = {
  USD: 5.0,   // 1 USD = 5 BRL
  EUR: 5.5,   // 1 EUR = 5.5 BRL
  THB: 0.15,  // 1 THB = 0.15 BRL
};

function hashString(str: string): number {
  let hash = 0;
  const cleaned = str.replace(/\D/g, "");
  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}

export function generateDeterministicIndex(cpfCnpj: string, max: number): number {
  return hashString(cpfCnpj) % max;
}

/**
 * Gera um limite "próximo do desejado, mas sempre abaixo" — entre 70% e 95% do
 * limite que o usuário pediu, arredondado para múltiplo de R$ 50.
 *
 * Se o desejado não for informado (compatibilidade), usa o range histórico de
 * R$ 1.100 a R$ 2.400.
 */
export function generateLimiteBrl(cpfCnpj: string, limiteDesejado?: number): number {
  const hash = hashString(cpfCnpj);

  if (limiteDesejado && limiteDesejado > 0) {
    const minPct = 70;
    const maxPct = 95;
    const pctRange = maxPct - minPct;
    const pct = minPct + (hash % (pctRange + 1));
    const raw = (limiteDesejado * pct) / 100;
    const rounded = Math.round(raw / 50) * 50;
    // Garantia: nunca igualar nem ultrapassar o desejado
    return Math.min(rounded, Math.max(50, limiteDesejado - 50));
  }

  const range = 2400 - 1100;
  const raw = 1100 + (hash % (range + 1));
  return Math.round(raw / 50) * 50;
}

export function convertToCurrency(brl: number, currency: string): number {
  const rate = EXCHANGE_RATES[currency];
  if (!rate) throw new Error(`Unsupported currency: ${currency}`);
  if (currency === "THB") {
    return Math.round((brl / rate) * 100) / 100;
  }
  return Math.round((brl / rate) * 100) / 100;
}

export function pickCurrency(cpfCnpj: string, moedas: string[]): string {
  const idx = generateDeterministicIndex(cpfCnpj, moedas.length);
  return moedas[idx];
}

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatForeignCurrency(value: number, currency: string): string {
  const symbols: Record<string, string> = { USD: "$", EUR: "€", THB: "฿" };
  const symbol = symbols[currency] || currency;
  return `${symbol} ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
}
