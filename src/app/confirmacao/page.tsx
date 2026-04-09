"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useFlowStore } from "@/lib/store";
import FlowHeader from "@/components/FlowHeader";
import FlowFooter from "@/components/FlowFooter";
import FlowProgress from "@/components/FlowProgress";
import { CheckCircleIcon, CalendarIcon, MailIcon } from "@/components/icons";

function addBusinessDays(start: Date, days: number): Date {
  const result = new Date(start);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const dow = result.getDay();
    if (dow !== 0 && dow !== 6) {
      added++;
    }
  }
  return result;
}

function formatDateBR(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const PROGRESS_LABELS = ["Dados", "Análise", "Proposta", "Pagamento", "Confirmação"];

export default function ConfirmacaoPage() {
  const router = useRouter();
  const { paymentId, reset, proposalData } = useFlowStore();

  // Guard: redirect to home if no paymentId
  useEffect(() => {
    if (!paymentId) {
      router.replace("/");
    }
  }, [paymentId, router]);

  const { dateMin, dateMax } = useMemo(() => {
    const today = new Date();
    return {
      dateMin: formatDateBR(addBusinessDays(today, 22)),
      dateMax: formatDateBR(addBusinessDays(today, 36)),
    };
  }, []);

  function handleBackHome() {
    reset();
    router.push("/");
  }

  // Don't render anything while redirecting
  if (!paymentId) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <FlowHeader showBack={false} />
      <FlowProgress currentStep={5} totalSteps={5} labels={PROGRESS_LABELS} />

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-lg mx-auto w-full card-container">
          {/* Large animated green check with rotation */}
          <motion.div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, duration: 0.8 }}
          >
            <CheckCircleIcon size={40} className="text-emerald-600" />
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-center text-2xl font-bold text-gray-900 mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            Tudo certo!
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-center text-gray-500 text-sm mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            Seu cartão está a caminho
          </motion.p>

          {/* Delivery box */}
          <motion.div
            className="bg-gray-50 rounded-2xl p-5 mb-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <CalendarIcon size={20} className="text-gray-500 flex-shrink-0" />
              <span className="text-sm text-gray-600">
                Prazo de entrega
              </span>
            </div>
            <p className="text-lg font-bold text-gray-900 ml-8">
              22 a 36 dias úteis
            </p>
            <p className="text-xs text-gray-400 ml-8 mt-1">
              Entre {dateMin} e {dateMax}
            </p>
          </motion.div>

          {/* Email box */}
          <motion.div
            className="bg-brand-50 rounded-2xl p-5 mb-8"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.4 }}
          >
            <div className="flex items-center gap-3">
              <MailIcon size={20} className="text-brand-600 flex-shrink-0" />
              <div>
                <span className="text-sm text-brand-700 block">
                  Confirmação enviada por e-mail
                </span>
                {proposalData?.lead?.email && (
                  <span className="text-xs text-brand-500">
                    {proposalData.lead.email}
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Back to home button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.4 }}
          >
            <button onClick={handleBackHome} className="btn-secondary w-full">
              Voltar ao Início
            </button>
          </motion.div>
        </div>
      </main>

      <FlowFooter />
    </div>
  );
}
