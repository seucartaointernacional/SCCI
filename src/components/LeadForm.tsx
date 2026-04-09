"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import FormInput from "@/components/ui/FormInput";
import { formatCpfCnpj, formatPhone, formatCEP } from "@/lib/formatters";
import { leadFormSchema } from "@/lib/validations";
import { useFlowStore } from "@/lib/store";
import { ArrowRightIcon, LockIcon } from "@/components/icons";

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

const fadeIn = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.35 },
};

export default function LeadForm() {
  const router = useRouter();
  const { setLeadId, setProposalId } = useFlowStore();

  const [form, setForm] = useState({
    nome: "",
    cpfCnpj: "",
    email: "",
    telefone: "",
    cep: "",
    cidade: "",
    estado: "",
    renda: "",
    limiteDesejado: "",
    negativado: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // Progressive reveal logic
  const showCpfTel = form.nome.length >= 3;
  const showEmail = showCpfTel && form.cpfCnpj.length >= 11;
  const showEndereco = showEmail && form.email.includes("@");
  const showFinanceiro = showEndereco && form.cep.length >= 8 && form.cidade.length >= 2 && form.estado.length > 0;
  const showSubmit = showFinanceiro && Number(form.renda) > 0;

  // Progress percentage
  const steps = [true, showCpfTel, showEmail, showEndereco, showFinanceiro, showSubmit];
  const progress = Math.round((steps.filter(Boolean).length / steps.length) * 100);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    let formatted = value;
    if (name === "cpfCnpj") formatted = formatCpfCnpj(value);
    else if (name === "telefone") formatted = formatPhone(value);
    else if (name === "cep") formatted = formatCEP(value);

    setForm((prev) => ({ ...prev, [name]: formatted }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError("");
    setErrors({});

    const payload = {
      ...form,
      cpfCnpj: form.cpfCnpj.replace(/\D/g, ""),
      telefone: form.telefone.replace(/\D/g, ""),
      cep: form.cep.replace(/\D/g, ""),
      renda: Number(form.renda),
      limiteDesejado: Number(form.limiteDesejado),
    };

    const result = leadFormSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Erro ao enviar os dados. Tente novamente.");
      }

      const data = await res.json();
      setLeadId(data.leadId);
      setProposalId(data.proposalId);
      router.push("/analise");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Progresso do cadastro</span>
          <span className="font-semibold text-brand-600">{progress}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-brand-600 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {serverError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm"
        >
          {serverError}
        </motion.div>
      )}

      {/* Nome - sempre visível */}
      <div>
        <FormInput
          label="Nome completo"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          placeholder="Digite seu nome completo"
          error={errors.nome}
        />
      </div>

      {/* CPF + Telefone */}
      <AnimatePresence>
        {showCpfTel && (
          <motion.div {...fadeIn} className="overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="CPF ou CNPJ"
                name="cpfCnpj"
                value={form.cpfCnpj}
                onChange={handleChange}
                placeholder="000.000.000-00"
                error={errors.cpfCnpj}
              />
              <FormInput
                label="Telefone"
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                error={errors.telefone}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email */}
      <AnimatePresence>
        {showEmail && (
          <motion.div {...fadeIn} className="overflow-hidden">
            <FormInput
              label="E-mail"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              error={errors.email}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Endereço */}
      <AnimatePresence>
        {showEndereco && (
          <motion.div {...fadeIn} className="overflow-hidden">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-2">
              Endereço
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="CEP"
                  name="cep"
                  value={form.cep}
                  onChange={handleChange}
                  placeholder="00000-000"
                  error={errors.cep}
                />
                <FormInput
                  label="Cidade"
                  name="cidade"
                  value={form.cidade}
                  onChange={handleChange}
                  placeholder="Sua cidade"
                  error={errors.cidade}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">
                  Estado
                </label>
                <select
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                  className={`input-field ${errors.estado ? "!border-red-400 focus:!ring-red-400" : ""}`}
                >
                  <option value="">Selecione...</option>
                  {ESTADOS.map((uf) => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
                {errors.estado && <p className="text-sm text-red-500 mt-1">{errors.estado}</p>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dados Financeiros */}
      <AnimatePresence>
        {showFinanceiro && (
          <motion.div {...fadeIn} className="overflow-hidden">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-2">
              Dados Financeiros
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Renda mensal (R$)"
                name="renda"
                type="number"
                value={form.renda}
                onChange={handleChange}
                placeholder="5000"
                min="0"
                step="0.01"
                error={errors.renda}
              />
              <FormInput
                label="Limite desejado (R$)"
                name="limiteDesejado"
                type="number"
                value={form.limiteDesejado}
                onChange={handleChange}
                placeholder="10000"
                min="0"
                step="0.01"
                error={errors.limiteDesejado}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <AnimatePresence>
        {showSubmit && (
          <motion.div {...fadeIn} className="overflow-hidden pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analisando...
                </>
              ) : (
                <>
                  Verificar meu crédito
                  <ArrowRightIcon size={18} />
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
        <LockIcon size={14} />
        <span>Seus dados estão protegidos e não serão compartilhados</span>
      </div>
    </form>
  );
}
