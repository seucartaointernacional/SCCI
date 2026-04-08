"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useFlowStore } from "@/lib/store";
import ProgressStep from "@/components/ProgressStep";

const STEPS = [
  "Verificando CPF...",
  "Analisando renda compatível...",
  "Buscando melhor localidade...",
  "Consultando bancos parceiros...",
  "Negociando melhores limites...",
];

const STEP_DURATION = 2800; // ~2.8s per step, ~14s total

export default function AnalisePage() {
  const router = useRouter();
  const { proposalId } = useFlowStore();
  const [currentStep, setCurrentStep] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Guard: redirect to home if no proposalId
  useEffect(() => {
    if (!proposalId) {
      router.replace("/");
    }
  }, [proposalId, router]);

  // Step progression
  useEffect(() => {
    if (!proposalId) return;

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
  }, [proposalId]);

  // Auto-navigate after all steps complete
  useEffect(() => {
    if (currentStep === STEPS.length) {
      const timeout = setTimeout(() => {
        router.push("/proposta");
      }, 600); // small delay after last check completes
      return () => clearTimeout(timeout);
    }
  }, [currentStep, router]);

  // Don't render anything while redirecting
  if (!proposalId) return null;

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <motion.div
        className="card-container w-full"
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
            Analisando seu perfil
          </motion.h1>
          <motion.p
            className="text-gray-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Aguarde enquanto processamos sua solicitação
          </motion.p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
          <p className="text-right text-xs text-gray-400 mt-1">
            {Math.round(progress)}%
          </p>
        </div>

        {/* Steps list */}
        <div className="space-y-1">
          {STEPS.map((label, index) => (
            <ProgressStep
              key={label}
              label={label}
              index={index}
              isComplete={index < currentStep}
              isActive={index === currentStep}
            />
          ))}
        </div>
      </motion.div>
    </main>
  );
}
