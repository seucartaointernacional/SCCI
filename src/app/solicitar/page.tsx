"use client";

import { motion } from "framer-motion";
import FlowHeader from "@/components/FlowHeader";
import FlowFooter from "@/components/FlowFooter";
import FlowProgress from "@/components/FlowProgress";
import LeadForm from "@/components/LeadForm";
import { CheckCircleIcon } from "@/components/icons";

export default function SolicitarPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <FlowHeader />
      <FlowProgress
        currentStep={1}
        totalSteps={5}
        labels={["Dados", "Análise", "Proposta", "Etapa Final", "Confirmação"]}
      />

      <section className="px-4 pt-10 pb-4">
        <div className="max-w-lg mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 tracking-tight"
          >
            Descubra se você tem crédito aprovado
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-gray-600 text-base font-bold mb-3"
          >
            Preencha com seus dados, ambiente seguro.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col items-center gap-1.5 mb-6"
          >
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
              <CheckCircleIcon size={16} />
              <span>Simulação gratuita e sem compromisso</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
              <CheckCircleIcon size={16} />
              <span>Resposta em 3 minutos após preencher</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="card-container max-w-lg mx-auto">
          <LeadForm />
        </div>
      </section>

      <FlowFooter />
    </main>
  );
}
