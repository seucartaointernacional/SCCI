"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useFlowStore } from "@/lib/store";

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

export default function ConfirmacaoPage() {
  const router = useRouter();
  const { paymentId, reset } = useFlowStore();

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
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4 py-8">
      <div className="card-container w-full">
        {/* Animated checkmark */}
        <motion.div
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, duration: 0.8 }}
        >
          <motion.svg
            className="h-10 w-10 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
            />
          </motion.svg>
        </motion.div>

        {/* Header */}
        <motion.h1
          className="text-center text-2xl font-bold text-green-600 mb-2"
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
          O processo de importa&ccedil;&atilde;o e envio do seu cart&atilde;o foi iniciado com
          sucesso.
        </motion.p>

        {/* Delivery estimate box */}
        <motion.div
          className="bg-gray-50 rounded-xl p-4 mb-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <svg
              className="h-5 w-5 text-gray-500 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
            <span className="text-sm text-gray-600">
              Prazo estimado de entrega
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900 ml-8">
            22 a 36 dias &uacute;teis
          </p>
          <p className="text-xs text-gray-400 ml-8 mt-1">
            Entre {dateMin} e {dateMax}
          </p>
        </motion.div>

        {/* Email confirmation box */}
        <motion.div
          className="bg-blue-50 rounded-xl p-4 mb-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
        >
          <div className="flex items-center gap-3">
            <svg
              className="h-5 w-5 text-blue-500 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
            <span className="text-sm text-blue-700">
              Confirma&ccedil;&atilde;o enviada por e-mail
            </span>
          </div>
        </motion.div>

        {/* Back to home button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.4 }}
        >
          <button onClick={handleBackHome} className="btn-primary w-full">
            Voltar ao In&iacute;cio
          </button>
        </motion.div>
      </div>
    </main>
  );
}
