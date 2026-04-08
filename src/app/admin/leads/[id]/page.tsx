"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { formatCpfCnpj } from "@/lib/formatters";

interface LeadDetail {
  id: string;
  nome: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
  cep: string;
  cidade: string;
  estado: string;
  renda: number;
  limiteDesejado: number;
  negativado: boolean;
  createdAt: string;
  proposals: Array<{
    id: string;
    moeda: string;
    limiteEstrangeiro: number;
    limiteBrl: number;
    status: string;
    card: {
      id: string;
      nome: string;
      bandeira: string;
    };
    payment: {
      id: string;
      valor: number;
      status: string;
      paidAt: string | null;
    } | null;
  }>;
}

export default function AdminLeadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    fetch(`/api/admin/leads/${id}`)
      .then((res) => res.json())
      .then(setLead)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleResendEmail = async () => {
    setResending(true);
    setResendMessage("");

    try {
      const res = await fetch(`/api/admin/leads/${id}/resend-email`, {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok) {
        setResendMessage("E-mail reenviado com sucesso!");
      } else {
        setResendMessage(data.error || "Erro ao reenviar e-mail");
      }
    } catch {
      setResendMessage("Erro de conexao");
    } finally {
      setResending(false);
    }
  };

  const formatBrl = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-red-500">Lead nao encontrado</p>
      </div>
    );
  }

  const proposal = lead.proposals[0] || null;
  const payment = proposal?.payment || null;
  const isPaid = payment?.status === "pago";

  return (
    <div>
      <button
        onClick={() => router.push("/admin/leads")}
        className="text-sm text-blue-600 hover:text-blue-800 font-medium mb-4 inline-block"
      >
        &larr; Voltar para Leads
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">{lead.nome}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Data */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Dados Pessoais
          </h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Nome</dt>
              <dd className="text-sm text-gray-900 font-medium">{lead.nome}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">CPF/CNPJ</dt>
              <dd className="text-sm text-gray-900 font-medium">
                {formatCpfCnpj(lead.cpfCnpj)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">E-mail</dt>
              <dd className="text-sm text-gray-900 font-medium">
                {lead.email}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Telefone</dt>
              <dd className="text-sm text-gray-900 font-medium">
                {lead.telefone}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">CEP</dt>
              <dd className="text-sm text-gray-900 font-medium">{lead.cep}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Cidade/Estado</dt>
              <dd className="text-sm text-gray-900 font-medium">
                {lead.cidade} / {lead.estado}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Renda</dt>
              <dd className="text-sm text-gray-900 font-medium">
                {formatBrl(lead.renda)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Limite Desejado</dt>
              <dd className="text-sm text-gray-900 font-medium">
                {formatBrl(lead.limiteDesejado)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Negativado</dt>
              <dd className="text-sm text-gray-900 font-medium">
                {lead.negativado ? "Sim" : "Nao"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Data de Cadastro</dt>
              <dd className="text-sm text-gray-900 font-medium">
                {formatDate(lead.createdAt)}
              </dd>
            </div>
          </dl>
        </div>

        {/* Proposal & Payment */}
        <div className="space-y-6">
          {/* Proposal */}
          {proposal ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Proposta
              </h2>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Cartao</dt>
                  <dd className="text-sm text-gray-900 font-medium">
                    {proposal.card.nome}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Bandeira</dt>
                  <dd className="text-sm text-gray-900 font-medium">
                    {proposal.card.bandeira}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Limite (BRL)</dt>
                  <dd className="text-sm text-gray-900 font-medium">
                    {formatBrl(proposal.limiteBrl)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">
                    Limite ({proposal.moeda})
                  </dt>
                  <dd className="text-sm text-gray-900 font-medium">
                    {proposal.limiteEstrangeiro.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: proposal.moeda,
                    })}
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-sm text-gray-500">Status</dt>
                  <dd>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        proposal.status === "aceita"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {proposal.status === "aceita" ? "Aceita" : "Pendente"}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Proposta
              </h2>
              <p className="text-sm text-gray-500">Nenhuma proposta gerada</p>
            </div>
          )}

          {/* Payment */}
          {payment ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Pagamento
              </h2>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Valor</dt>
                  <dd className="text-sm text-gray-900 font-medium">
                    {formatBrl(payment.valor)}
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-sm text-gray-500">Status</dt>
                  <dd>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        isPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {isPaid ? "Pago" : "Aguardando"}
                    </span>
                  </dd>
                </div>
                {isPaid && payment.paidAt && (
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Data do Pagamento</dt>
                    <dd className="text-sm text-gray-900 font-medium">
                      {formatDate(payment.paidAt)}
                    </dd>
                  </div>
                )}
              </dl>

              {isPaid && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={handleResendEmail}
                    disabled={resending}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resending ? "Enviando..." : "Reenviar E-mail"}
                  </button>
                  {resendMessage && (
                    <p
                      className={`text-sm mt-2 text-center ${
                        resendMessage.includes("sucesso")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {resendMessage}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Pagamento
              </h2>
              <p className="text-sm text-gray-500">Nenhum pagamento registrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
