"use client";

import { motion } from "framer-motion";
import { ClipboardIcon, CreditCardIcon, TruckIcon } from "@/components/icons";

const steps = [
  {
    number: "01",
    icon: ClipboardIcon,
    title: "Preencha seus dados",
    description:
      "Informe seus dados pessoais e financeiros no nosso formulário rápido e seguro. Leva menos de 2 minutos.",
    color: "from-brand-500 to-brand-600",
    bg: "bg-brand-50",
  },
  {
    number: "02",
    icon: CreditCardIcon,
    title: "Receba sua proposta",
    description:
      "Nosso sistema analisa seu perfil e apresenta a melhor oferta de cartão internacional para você.",
    color: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    number: "03",
    icon: TruckIcon,
    title: "Cartão na sua porta",
    description:
      "Após a confirmação, seu cartão é enviado para o endereço informado em todo o Brasil.",
    color: "from-violet-500 to-violet-600",
    bg: "bg-violet-50",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: i * 0.15,
    },
  }),
};

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">Como funciona</h2>
          <p className="section-subtitle mx-auto">
            Três passos simples para ter seu cartão internacional em mãos
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
                className="relative bg-white rounded-2xl p-8 shadow-lg shadow-gray-100/80 border border-gray-100 group hover:shadow-xl hover:shadow-gray-200/60 transition-all duration-300"
              >
                {/* Step number */}
                <span className="text-5xl font-extrabold text-gray-100 absolute top-4 right-6 select-none group-hover:text-brand-50 transition-colors duration-300">
                  {step.number}
                </span>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 shadow-md`}>
                  <IconComponent size={24} className="text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
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
