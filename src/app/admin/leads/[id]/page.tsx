"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { formatCpfCnpj } from "@/lib/formatters";
import {
  ChevronRightIcon,
  MailIcon,
  TrashIcon,
} from "@/components/icons";

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
  const [deleting, setDeleting] = useState(false);

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
      setResendMessage("Erro de conexão");
    } finally {
      setResending(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este lead? Esta ação não pode ser desfeita.")) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/admin/leads");
      } else {
        const data = await res.json();
        alert(data.error || "Erro ao excluir lead");
      }
    } catch {
      alert("Erro de conexão");
    } finally {
      setDeleting(false);
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
        <p className="text-red-500">Lead não encontrado</p>
      </div>
    );
  }

  const proposal = lead.proposals[0] || null;
  const payment = proposal?.payment || null;
  const isPaid = payment?.status === "pago";

  function getLeadStatusBadge() {
    if (!proposal) return <span className="badge-gray">Sem proposta</span>;
    if (isPaid) return <span className="badge-green">Pago</span>;
    if (proposal.status === "aceita") return <span className="badge-blue">Proposta Aceita</span>;
    if (proposal.status === "pendente") return <span className="badge-yellow">Pendente</span>;
    return <span className="badge-gray">{proposal.status}</span>;
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-4">
        <Link href="/admin" className="hover:text-gray-600 transition-colors">
          Dashboard
        </Link>
        <ChevronRightIcon size={14} />
        <Link href="/admin/leads" className="hover:text-gray-600 transition-colors">
          Leads
        </Link>
        <ChevronRightIcon size={14} />
        <span className="text-gray-700 font-medium">{lead.nome}</span>
      </nav>

      {/* Title + Badge */}
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{lead.nome}</h1>
        {getLeadStatusBadge()}
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Dados Pessoais */}
        <div className="lg:col-span-2 card-container">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Dados Pessoais
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Nome</p>
              <p className="text-sm font-semibold text-gray-900">{lead.nome}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">CPF/CNPJ</p>
              <p className="text-sm font-semibold text-gray-900">{formatCpfCnpj(lead.cpfCnpj)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email</p>
              <p className="text-sm font-semibold text-gray-900">{lead.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Telefone</p>
              <p className="text-sm font-semibold text-gray-900">{lead.telefone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">CEP</p>
              <p className="text-sm font-semibold text-gray-900">{lead.cep}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Cidade</p>
              <p className="text-sm font-semibold text-gray-900">{lead.cidade}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Estado</p>
              <p className="text-sm font-semibold text-gray-900">{lead.estado}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Renda</p>
              <p className="text-sm font-semibold text-gray-900">{formatBrl(lead.renda)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Limite Desejado</p>
              <p className="text-sm font-semibold text-gray-900">{formatBrl(lead.limiteDesejado)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Negativado</p>
              <p className="text-sm font-semibold text-gray-900">{lead.negativado ? "Sim" : "Não"}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Data de Cadastro</p>
              <p className="text-sm font-semibold text-gray-900">{formatDate(lead.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Right: Proposta + Pagamento */}
        <div className="lg:col-span-1 space-y-6">
          {/* Proposta */}
          <div className="card-container">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Proposta
            </h2>
            {proposal ? (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Cartão</p>
                  <p className="text-sm font-semibold text-gray-900">{proposal.card.nome}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Bandeira</p>
                  <p className="text-sm font-semibold text-gray-900">{proposal.card.bandeira}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Limite (BRL)</p>
                  <p className="text-sm font-semibold text-gray-900">{formatBrl(proposal.limiteBrl)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Limite ({proposal.moeda})</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {proposal.limiteEstrangeiro.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: proposal.moeda,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Status</p>
                  <span
                    className={
                      proposal.status === "aceita" ? "badge-green" : "badge-yellow"
                    }
                  >
                    {proposal.status === "aceita" ? "Aceita" : "Pendente"}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Nenhuma proposta gerada</p>
            )}
          </div>

          {/* Pagamento */}
          <div className="card-container">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Pagamento
            </h2>
            {payment ? (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Valor</p>
                  <p className="text-sm font-semibold text-gray-900">{formatBrl(payment.valor)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Status</p>
                  <span className={isPaid ? "badge-green" : "badge-yellow"}>
                    {isPaid ? "Pago" : "Aguardando"}
                  </span>
                </div>
                {isPaid && payment.paidAt && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Data do Pagamento</p>
                    <p className="text-sm font-semibold text-gray-900">{formatDate(payment.paidAt)}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Nenhum pagamento registrado</p>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        {isPaid && (
          <div>
            <button
              onClick={handleResendEmail}
              disabled={resending}
              className="btn-primary flex items-center gap-2"
            >
              <MailIcon size={16} />
              {resending ? "Enviando..." : "Reenviar E-mail"}
            </button>
            {resendMessage && (
              <p
                className={`text-sm mt-2 ${
                  resendMessage.includes("sucesso")
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {resendMessage}
              </p>
            )}
          </div>
        )}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="btn-ghost text-red-500 hover:text-red-600 flex items-center gap-2"
        >
          <TrashIcon size={16} />
          {deleting ? "Excluindo..." : "Excluir Lead"}
        </button>
      </div>
    </div>
  );
}
