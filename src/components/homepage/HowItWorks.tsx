"use client";

import { motion } from "framer-motion";
import { ClipboardIcon, CreditCardIcon, TruckIcon } from "@/components/icons";

const steps = [
  {
    number: "1",
    icon: ClipboardIcon,
    title: "Preencha seus dados",
    description:
      "Informe seus dados pessoais e financeiros no nosso formulario rapido e seguro.",
  },
  {
    number: "2",
    icon: CreditCardIcon,
    title: "Receba sua proposta",
    description:
      "Nosso sistema analisa seu perfil e apresenta a melhor oferta de cartao internacional para voce.",
  },
  {
    number: "3",
    icon: TruckIcon,
    title: "Cartao na sua porta",
    description:
      "Apos a confirmacao, seu cartao e enviado para o endereco informado em todo o Brasil.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
      delay: i * 0.15,
    },
  }),
};

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title">Como funciona</h2>
          <p className="section-subtitle mx-auto">
            Tres passos simples para ter seu cartao internacional em maos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={i}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 font-bold text-lg flex items-center justify-center mb-4">
                  {step.number}
                </div>
                <IconComponent size={32} className="text-brand-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
