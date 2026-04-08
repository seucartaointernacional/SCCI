"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useFlowStore } from "@/lib/store";
import { formatBRL, TAXA_IMPORTACAO } from "@/lib/proposal-utils";

const DISCLAIMERS = [
  "Ao receber o cartão físico, apresente um documento de identificação com foto.",
  "Para ativação, envie uma foto segurando seu documento de identificação.",
  "Após ativação, o cartão estará liberado para uso imediato.",
];

export default function AceitaPage() {
  const router = useRouter();
  const { paymentId } = useFlowStore();

  // Guard: redirect to home if no paymentId
  useEffect(() => {
    if (!paymentId) {
      router.replace("/");
    }
  }, [paymentId, router]);

  // Don't render anything while redirecting
  if (!paymentId) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-8">
      <motion.div
        className="card-container w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Success icon */}
        <motion.div
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 180, damping: 12 }}
        >
          <motion.svg
            className="h-10 w-10 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
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
          className="text-2xl font-bold text-green-600 text-center mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Proposta Efetivada!
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-gray-500 text-sm text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Para finalizar, pague a taxa de importa&ccedil;&atilde;o e envio.
        </motion.p>

        {/* Fee display */}
        <motion.div
          className="bg-blue-600 rounded-2xl p-6 text-center mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <p className="text-3xl font-bold text-white">
            {formatBRL(TAXA_IMPORTACAO)}
          </p>
          <p className="text-blue-200 text-sm mt-1">
            Taxa de importa&ccedil;&atilde;o + frete internacional
          </p>
        </motion.div>

        {/* Disclaimers */}
        <motion.div
          className="space-y-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {DISCLAIMERS.map((text, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <div className="flex-shrink-0 h-7 w-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed pt-0.5">
                {text}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.button
          onClick={() => router.push("/pagamento")}
          className="btn-primary w-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          OK, Pagar Taxa
        </motion.button>
      </motion.div>
    </main>
  );
}
