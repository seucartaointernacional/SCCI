// Reproduz fluxo completo: cria lead → pega proposalId → aceita proposta.
// Roda 3 vezes pra detectar se VELANA falha consistente ou intermitente.

const BASE = "https://seucartaointernacional.com";

function genCpf() {
  const rand = (n) => Math.floor(Math.random() * n);
  const d = Array.from({ length: 9 }, () => rand(10));
  const dv = (digits, weights) => {
    const sum = digits.reduce((acc, x, i) => acc + x * weights[i], 0);
    const r = sum % 11;
    return r < 2 ? 0 : 11 - r;
  };
  const dv1 = dv(d, [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  const dv2 = dv([...d, dv1], [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
  return [...d, dv1, dv2].join("");
}

async function runOnce(attempt) {
  const cpf = genCpf();
  const lead = {
    nome: `Teste Auto ${attempt}`,
    cpfCnpj: cpf,
    email: `teste${Date.now()}_${attempt}@example.com`,
    telefone: "11999999999",
    cep: "05056023",
    cidade: "São Paulo",
    estado: "SP",
    renda: 3000,
    limiteDesejado: 1500,
    negativado: true,
  };

  console.log(`\n=== Tentativa ${attempt} (CPF ${cpf}) ===`);

  const t0 = Date.now();
  const leadRes = await fetch(`${BASE}/api/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
  });
  const leadBody = await leadRes.json();
  console.log(`[lead] ${leadRes.status} (${Date.now() - t0}ms)`, JSON.stringify(leadBody));
  if (!leadRes.ok) return { ok: false, step: "lead", body: leadBody };

  const { proposalId } = leadBody;

  // Pequena pausa pra simular comportamento de UI
  await new Promise((r) => setTimeout(r, 300));

  const t1 = Date.now();
  const acceptRes = await fetch(`${BASE}/api/proposals/${proposalId}/accept`, {
    method: "POST",
  });
  const acceptBody = await acceptRes.json().catch(() => ({}));
  console.log(
    `[accept] ${acceptRes.status} (${Date.now() - t1}ms)`,
    JSON.stringify(acceptBody)
  );

  return { ok: acceptRes.ok, status: acceptRes.status, body: acceptBody };
}

(async () => {
  const results = [];
  for (let i = 1; i <= 3; i++) {
    try {
      results.push(await runOnce(i));
    } catch (err) {
      console.log(`[${i}] threw:`, err.message);
      results.push({ ok: false, threw: err.message });
    }
    if (i < 3) await new Promise((r) => setTimeout(r, 1500));
  }
  console.log("\n=== RESUMO ===");
  results.forEach((r, i) => {
    console.log(`Tentativa ${i + 1}:`, r.ok ? "✅ OK" : `❌ ${r.status || "ERR"} - ${JSON.stringify(r.body || r.threw)}`);
  });
  process.exit(0);
})();
