"use client";

import { motion } from "framer-motion";
import { ClipboardIcon, CreditCardIcon, TruckIcon } from "@/components/icons";

const steps = [
  {
    number: "1",
    icon: ClipboardIcon,
    title: "Preencha seus dados",
    description:
      "Informe seus dados pessoais e financeiros. O formulário leva menos de 2 minutos.",
  },
  {
    number: "2",
    icon: CreditCardIcon,
    title: "Receba sua proposta",
    description:
      "Analisamos seu perfil e apresentamos a melhor oferta de cartão internacional disponível.",
  },
  {
    number: "3",
    icon: TruckIcon,
    title: "Receba em casa",
    description:
      "Após a confirmação, seu cartão é enviado para o endereço informado em todo o Brasil.",
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title">Como funciona</h2>
          <p className="section-subtitle mx-auto">
            Três passos simples para ter seu cartão internacional
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
                className="text-center p-8 rounded-2xl border border-gray-200 bg-white"
              >
                <div className="w-14 h-14 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center mx-auto mb-5">
                  <IconComponent size={24} />
                </div>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-600 text-white text-sm font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
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
