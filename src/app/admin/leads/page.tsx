"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { formatCpfCnpj } from "@/lib/formatters";
import { SearchIcon } from "@/components/icons";

interface LeadProposal {
  id: string;
  status: string;
  card: { nome: string };
  payment: { status: string } | null;
}

interface Lead {
  id: string;
  nome: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
  renda: number;
  proposals: LeadProposal[];
  createdAt: string;
}

function getStatusBadge(lead: Lead) {
  const proposal = lead.proposals[0];
  if (!proposal) {
    return <span className="badge-gray">Sem proposta</span>;
  }

  if (proposal.payment?.status === "pago") {
    return <span className="badge-green">Pago</span>;
  }

  if (proposal.status === "aceita") {
    return <span className="badge-blue">Proposta Aceita</span>;
  }

  if (proposal.status === "pendente") {
    return <span className="badge-yellow">Pendente</span>;
  }

  return <span className="badge-gray">{proposal.status}</span>;
}

export default function AdminLeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (status) params.set("status", status);

      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch {
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Leads</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <SearchIcon size={16} />
          </div>
          <input
            type="text"
            placeholder="Buscar por nome ou CPF/CNPJ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="input-field w-full sm:w-48"
        >
          <option value="">Todos</option>
          <option value="aceita">Proposta Aceita</option>
          <option value="pago">Pagamento Feito</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500">Carregando...</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500">Nenhum lead encontrado</p>
        </div>
      ) : (
        <div className="card-container !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    CPF/CNPJ
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => router.push(`/admin/leads/${lead.id}`)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-3 text-sm text-gray-900 font-medium whitespace-nowrap">
                      {lead.nome}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500 whitespace-nowrap">
                      {formatCpfCnpj(lead.cpfCnpj)}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500 whitespace-nowrap">
                      {lead.email}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {getStatusBadge(lead)}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(lead.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
