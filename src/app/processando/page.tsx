"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useFlowStore } from "@/lib/store";
import ProgressStep from "@/components/ProgressStep";

const STEPS = [
  "Entrando em contato com o banco...",
  "Finalizando proposta...",
  "Gerando documentos...",
];

const STEP_DURATION = 3000; // ~3s per step, ~9s total

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
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
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
            Processando sua proposta
          </motion.h1>
          <motion.p
            className="text-gray-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Estamos finalizando tudo para você
          </motion.p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-500"
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
