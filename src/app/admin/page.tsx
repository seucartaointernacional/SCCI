"use client";

import { useEffect, useState } from "react";

interface Stats {
  totalLeads: number;
  totalProposalsAceitas: number;
  totalPayments: number;
  valorArrecadado: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-red-500">Erro ao carregar estatisticas</p>
      </div>
    );
  }

  const formatBrl = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const cards = [
    {
      label: "Total de Leads",
      value: stats.totalLeads.toString(),
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      label: "Propostas Aceitas",
      value: stats.totalProposalsAceitas.toString(),
      color: "bg-green-50 text-green-700 border-green-200",
    },
    {
      label: "Pagamentos",
      value: stats.totalPayments.toString(),
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      label: "Valor Arrecadado",
      value: formatBrl(stats.valorArrecadado),
      color: "bg-amber-50 text-amber-700 border-amber-200",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`rounded-xl border p-6 ${card.color}`}
          >
            <p className="text-sm font-medium opacity-80">{card.label}</p>
            <p className="text-3xl font-bold mt-2">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
