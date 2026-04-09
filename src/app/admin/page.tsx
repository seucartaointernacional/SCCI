"use client";

import { useEffect, useState } from "react";
import {
  UsersIcon,
  CheckCircleIcon,
  CreditCardIcon,
  DollarSignIcon,
} from "@/components/icons";

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

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const cards = [
    {
      label: "Total de Leads",
      value: stats.totalLeads.toString(),
      icon: UsersIcon,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Propostas Aceitas",
      value: stats.totalProposalsAceitas.toString(),
      icon: CheckCircleIcon,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Pagamentos",
      value: stats.totalPayments.toString(),
      icon: CreditCardIcon,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      label: "Valor Arrecadado",
      value: formatBrl(stats.valorArrecadado),
      icon: DollarSignIcon,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1 capitalize">{today}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div key={card.label} className="card-container flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.iconBg} ${card.iconColor}`}
              >
                <IconComponent size={20} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
