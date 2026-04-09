"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useFlowStore } from "@/lib/store";
import FlowHeader from "@/components/FlowHeader";
import FlowFooter from "@/components/FlowFooter";
import FlowProgress from "@/components/FlowProgress";
import {
  BuildingIcon,
  DocumentIcon,
  CheckCircleIcon,
  SpinnerIcon,
} from "@/components/icons";

const STEP_ICONS = [BuildingIcon, DocumentIcon, CheckCircleIcon];

const STEPS = [
  "Entrando em contato com o banco",
  "Finalizando proposta",
  "Gerando documentos",
];

const STEP_DURATION = 3000; // ~3s per step, ~9s total

const PROGRESS_LABELS = ["Dados", "Analise", "Proposta", "Pagamento", "Confirmacao"];

export default function ProcessandoPage() {
  const router = useRouter();
  const { paymentId } = useFlowStore();
  const [currentStep, setCurrentStep] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Guard: redirect to home if no paymentId
  useEffect(() => {
    if (!paymentId) {
      router.replace("/");
    }
  }, [paymentId, router]);

  // Step progression
  useEffect(() => {
    if (!paymentId) return;

    intervalRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next > STEPS.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return prev;
        }
        return next;
      });
    }, STEP_DURATION);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paymentId]);

  // Auto-navigate after all steps complete
  useEffect(() => {
    if (currentStep === STEPS.length) {
      const timeout = setTimeout(() => {
        router.push("/aceita");
      }, 600); // small delay after last check completes
      return () => clearTimeout(timeout);
    }
  }, [currentStep, router]);

  // Don't render anything while redirecting
  if (!paymentId) return null;

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <FlowHeader backHref="/proposta" />
      <FlowProgress currentStep={3} totalSteps={5} labels={PROGRESS_LABELS} />

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          className="max-w-lg mx-auto w-full card-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              className="text-2xl font-bold text-gray-900 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Processando sua proposta
            </motion.h1>
            <motion.p
              className="text-gray-500 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Estamos finalizando tudo para voce
            </motion.p>
          </div>

          {/* Steps list */}
          <div className="space-y-1 mb-8">
            {STEPS.map((label, index) => {
              const IconComponent = STEP_ICONS[index];
              const isComplete = index < currentStep;
              const isActive = index === currentStep;

              return (
                <motion.div
                  key={label}
                  className="flex items-center gap-4 py-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
                >
                  {/* Icon circle */}
                  <div className="flex-shrink-0 relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                        isComplete
                          ? "bg-emerald-50 text-emerald-600"
                          : isActive
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-gray-50 text-gray-300"
                      }`}
                    >
                      <IconComponent size={20} />
                    </div>
                    {isActive && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <SpinnerIcon size={40} className="text-emerald-600 opacity-30" />
                      </div>
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`text-sm flex-1 transition-colors duration-300 ${
                      isComplete
                        ? "text-gray-900"
                        : isActive
                        ? "text-emerald-600 font-medium"
                        : "text-gray-400"
                    }`}
                  >
                    {label}
                  </span>

                  {/* Complete check */}
                  {isComplete && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <CheckCircleIcon size={20} className="text-emerald-500" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-emerald-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* Bottom text */}
          <p className="text-xs text-gray-400 text-center mt-6">
            Preparando tudo para a sua melhor experiencia
          </p>
        </motion.div>
      </main>

      <FlowFooter />
    </div>
  );
}
