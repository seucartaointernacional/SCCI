"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useFlowStore } from "@/lib/store";
import { formatBRL, TAXA_IMPORTACAO } from "@/lib/proposal-utils";
import FlowHeader from "@/components/FlowHeader";
import FlowFooter from "@/components/FlowFooter";
import FlowProgress from "@/components/FlowProgress";
import { CheckCircleIcon, TruckIcon, CreditCardIcon, ShieldCheckIcon } from "@/components/icons";

const NEXT_STEPS = [
  {
    icon: TruckIcon,
    title: "Emissão e envio",
    description: "O banco parceiro emite seu cartão e envia para o endereço cadastrado via correio.",
  },
  {
    icon: CreditCardIcon,
    title: "Receba em casa",
    description: "Seu cartão chega em 22 a 36 dias úteis. Apresente um documento com foto ao receber.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Ative e use",
    description: "Envie uma foto com seu documento para ativação. Pronto, seu cartão está liberado para uso.",
  },
];

const PROGRESS_LABELS = ["Dados", "Análise", "Proposta", "Etapa Final", "Confirmação"];

export default function AceitaPage() {
  const router = useRouter();
  const { paymentId } = useFlowStore();

  useEffect(() => {
    if (!paymentId) {
      router.replace("/");
    }
  }, [paymentId, router]);

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
          {/* Check */}
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
            className="text-2xl font-bold text-gray-900 text-center mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Proposta Efetivada!
          </motion.h1>

          <motion.p
            className="text-gray-500 text-sm text-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            Para finalizar, pague a tarifa única de frete para envio do cartão até sua residência.
          </motion.p>

          {/* Fee box */}
          <motion.div
            className="bg-brand-50 rounded-2xl p-6 text-center mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <p className="text-sm text-gray-500 mb-1">
              Tarifa única de frete (envio do cartão)
            </p>
            <p className="text-3xl font-bold text-brand-800">
              {formatBRL(TAXA_IMPORTACAO)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Sem cobranças adicionais. Pagamento único via PIX.
            </p>
          </motion.div>

          {/* Steps - what happens after payment */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
              O que acontece após o pagamento
            </p>
            <div className="space-y-4 mb-8">
              {NEXT_STEPS.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <motion.div
                    key={index}
                    className="flex gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center">
                      <IconComponent size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{step.title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.button
            onClick={() => router.push("/pagamento")}
            className="btn-primary w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            Pagar Frete via PIX
          </motion.button>
        </motion.div>
      </main>

      <FlowFooter />
    </div>
  );
}
