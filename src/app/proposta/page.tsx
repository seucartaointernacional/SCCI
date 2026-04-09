"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useFlowStore } from "@/lib/store";
import CreditCard from "@/components/CreditCard";
import { formatBRL, formatForeignCurrency } from "@/lib/proposal-utils";
import FlowHeader from "@/components/FlowHeader";
import FlowFooter from "@/components/FlowFooter";
import FlowProgress from "@/components/FlowProgress";
import { ClockIcon } from "@/components/icons";

type View = "loading" | "proposal" | "recusa";

const PROGRESS_LABELS = ["Dados", "Análise", "Proposta", "Pagamento", "Confirmação"];

export default function PropostaPage() {
  const router = useRouter();
  const { proposalId, setPaymentId, setProposalData, proposalData } =
    useFlowStore();
  const [view, setView] = useState<View>("loading");
  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);

  // Guard: redirect to home if no proposalId
  useEffect(() => {
    if (!proposalId) {
      router.replace("/");
    }
  }, [proposalId, router]);

  // Fetch proposal data on mount
  useEffect(() => {
    if (!proposalId) return;

    async function fetchProposal() {
      try {
        const res = await fetch(`/api/proposals/${proposalId}`);
        if (!res.ok) throw new Error("Falha ao buscar proposta");
        const data = await res.json();
        setProposalData(data);
        setView("proposal");
      } catch (err) {
        console.error("Error fetching proposal:", err);
        router.replace("/");
      }
    }

    fetchProposal();
  }, [proposalId, setProposalData, router]);

  // Accept handler
  async function handleAccept() {
    if (!proposalId || accepting) return;
    setAccepting(true);
    try {
      const res = await fetch(`/api/proposals/${proposalId}/accept`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Falha ao aceitar proposta");
      const data = await res.json();
      setPaymentId(data.paymentId);
      router.push("/processando");
    } catch (err) {
      console.error("Error accepting proposal:", err);
      setAccepting(false);
    }
  }

  // Decline handler
  async function handleDecline() {
    if (!proposalId || declining) return;
    setDeclining(true);
    try {
      const res = await fetch(`/api/proposals/${proposalId}/reject`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Falha ao recusar proposta");
      setView("recusa");
    } catch (err) {
      console.error("Error declining proposal:", err);
    } finally {
      setDeclining(false);
    }
  }

  // Don't render anything while redirecting
  if (!proposalId) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <FlowHeader backHref="/analise" />
      <FlowProgress currentStep={3} totalSteps={5} labels={PROGRESS_LABELS} />

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <AnimatePresence mode="wait">
          {view === "loading" && (
            <motion.div
              key="loading"
              className="max-w-lg mx-auto w-full card-container flex flex-col items-center justify-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />
              <p className="mt-4 text-sm text-gray-500">
                Carregando proposta...
              </p>
            </motion.div>
          )}

          {view === "proposal" && proposalData && (
            <motion.div
              key="proposal"
              className="max-w-lg mx-auto w-full card-container"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <motion.h1
                  className="text-2xl font-bold text-emerald-600 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Conseguimos uma proposta para você!
                </motion.h1>
                <motion.p
                  className="text-gray-500 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Confira os detalhes do seu cartão internacional
                </motion.p>
              </div>

              {/* Credit Card */}
              <motion.div
                className="mb-6 flex justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <CreditCard
                  nome={proposalData.card.nome}
                  bandeira={proposalData.card.bandeira}
                  corPrimaria={proposalData.card.corPrimaria}
                  corSecundaria={proposalData.card.corSecundaria}
                  corTexto={proposalData.card.corTexto}
                  holderName={proposalData.lead.nome}
                />
              </motion.div>

              {/* Proposal details 2x2 grid */}
              <motion.div
                className="grid grid-cols-2 gap-3 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Bandeira</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">
                    {proposalData.card.bandeira}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Moeda</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">
                    {proposalData.moeda}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Limite estrangeiro</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">
                    {formatForeignCurrency(
                      proposalData.limiteEstrangeiro,
                      proposalData.moeda
                    )}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Limite BRL</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">
                    {formatBRL(proposalData.limiteBrl)}
                  </p>
                </div>
              </motion.div>

              {/* Badge */}
              <motion.div
                className="flex justify-center mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 rounded-full px-3 py-1">
                  <ClockIcon size={14} />
                  <span>Proposta válida por 24h</span>
                </div>
              </motion.div>

              {/* Buttons */}
              <motion.div
                className="flex flex-col gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <button
                  onClick={handleAccept}
                  disabled={accepting}
                  className="btn-success w-full disabled:opacity-60"
                >
                  {accepting ? "Processando..." : "Aceitar Proposta"}
                </button>
                <button
                  onClick={handleDecline}
                  disabled={declining}
                  className="w-full py-2.5 text-sm text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-60"
                >
                  {declining ? "Processando..." : "Deixar para próxima"}
                </button>
              </motion.div>
            </motion.div>
          )}

          {view === "recusa" && (
            <motion.div
              key="recusa"
              className="max-w-lg mx-auto w-full card-container text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Sad icon */}
              <motion.div
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <svg
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                  />
                </svg>
              </motion.div>

              <motion.h2
                className="text-xl font-bold text-gray-900 mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Proposta recusada
              </motion.h2>
              <motion.p
                className="text-gray-500 text-sm mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Não temos mais propostas para você neste momento.
              </motion.p>

              <motion.div
                className="flex flex-col gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  onClick={() => setView("proposal")}
                  className="btn-primary w-full"
                >
                  Voltar a Proposta Anterior
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="btn-secondary w-full"
                >
                  Finalizar Atendimento
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <FlowFooter />
    </div>
  );
}
