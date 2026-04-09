"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useFlowStore } from "@/lib/store";
import { formatBRL, TAXA_IMPORTACAO } from "@/lib/proposal-utils";
import FlowHeader from "@/components/FlowHeader";
import FlowFooter from "@/components/FlowFooter";
import FlowProgress from "@/components/FlowProgress";
import { CheckCircleIcon } from "@/components/icons";

const NEXT_STEPS = [
  "Apresente um documento com foto ao receber o cartão",
  "Envie uma foto com o documento para ativação",
  "Cartão pronto para uso imediato após ativação",
];

const PROGRESS_LABELS = ["Dados", "Análise", "Proposta", "Etapa Final", "Confirmação"];

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
    <div className="min-h-screen bg-white flex flex-col">
      <FlowHeader backHref="/proposta" />
      <FlowProgress currentStep={4} totalSteps={5} labels={PROGRESS_LABELS} />

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          className="max-w-lg mx-auto w-full card-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Large animated green check */}
          <motion.div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 180, damping: 12 }}
          >
            <CheckCircleIcon size={32} className="text-emerald-600" />
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-2xl font-bold text-gray-900 text-center mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Proposta Efetivada!
          </motion.h1>

          {/* Fee box */}
          <motion.div
            className="bg-brand-50 rounded-2xl p-6 text-center mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <p className="text-sm text-gray-500 mb-1">
              Taxa única de importação e envio
            </p>
            <p className="text-3xl font-bold text-brand-800">
              {formatBRL(TAXA_IMPORTACAO)}
            </p>
          </motion.div>

          {/* 3 numbered steps */}
          <motion.div
            className="space-y-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {NEXT_STEPS.map((text, index) => (
              <motion.div
                key={index}
                className="flex gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold">
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
            transition={{ delay: 1.0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Pagar Taxa via PIX
          </motion.button>
        </motion.div>
      </main>

      <FlowFooter />
    </div>
  );
}
