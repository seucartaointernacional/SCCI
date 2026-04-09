"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import FormInput from "@/components/ui/FormInput";
import { formatCpfCnpj, formatPhone, formatCEP } from "@/lib/formatters";
import { leadFormSchema } from "@/lib/validations";
import { useFlowStore } from "@/lib/store";
import { ArrowRightIcon, LockIcon } from "@/components/icons";

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

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
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {serverError}
        </div>
      )}

      {/* Dados Pessoais */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Dados Pessoais
        </p>
        <div className="space-y-4">
          <FormInput
            label="Nome completo"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Seu nome"
            error={errors.nome}
          />

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

          <FormInput
            label="E-mail"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            error={errors.email}
          />
        </div>
      </div>

      {/* Endereco */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Endereco
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
            <label className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className={`input-field ${errors.estado ? "border-red-400 focus:ring-red-400" : ""}`}
            >
              <option value="">Selecione...</option>
              {ESTADOS.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
            {errors.estado && <p className="text-sm text-red-500">{errors.estado}</p>}
          </div>
        </div>
      </div>

      {/* Dados Financeiros */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Dados Financeiros
        </p>
        <div className="space-y-4">
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

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="negativado"
              name="negativado"
              checked={form.negativado}
              onChange={handleChange}
              className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
            />
            <label htmlFor="negativado" className="text-sm text-gray-700">
              Estou com nome negativado
            </label>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Enviando...
          </>
        ) : (
          <>
            Solicitar Proposta
            <ArrowRightIcon size={18} />
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
        <LockIcon size={14} />
        <span>Seus dados estao protegidos e nao serao compartilhados</span>
      </div>
    </motion.form>
  );
}
