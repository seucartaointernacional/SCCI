"use client";

import { motion } from "framer-motion";
import {
  GlobeIcon,
  DollarSignIcon,
  CalendarIcon,
  ClockIcon,
  TruckIcon,
  ShieldCheckIcon,
} from "@/components/icons";

interface Benefit {
  icon: typeof GlobeIcon;
  title: string;
  description: string;
  highlight?: boolean;
}

const benefits: Benefit[] = [
  {
    icon: ShieldCheckIcon,
    title: "Negativado pode solicitar e tem grandes chances de aprovação",
    description:
      "Restrições no SPC ou Serasa não impedem a solicitação. A análise é feita de forma independente por bancos internacionais parceiros, com taxa de aprovação acima de 93%.",
    highlight: true,
  },
  {
    icon: GlobeIcon,
    title: "Aprovado por bancos internacionais",
    description:
      "Cartão emitido por bancos parceiros no exterior, com a mesma praticidade de um cartão brasileiro. Aceito em mais de 150 países.",
  },
  {
    icon: DollarSignIcon,
    title: "Funciona em qualquer moeda",
    description:
      "Use em real, dólar, euro, libra ou qualquer outra moeda. Funciona como um cartão brasileiro comum, mas aceito no mundo todo.",
  },
  {
    icon: CalendarIcon,
    title: "Custo zero de manutenção",
    description:
      "Sem anuidade, sem taxa de manutenção e sem cobranças extras. O cartão não tem nenhum custo recorrente.",
  },
  {
    icon: ClockIcon,
    title: "Aprovação em minutos",
    description:
      "Nosso sistema analisa seu perfil e retorna uma proposta na hora, sem espera.",
  },
  {
    icon: TruckIcon,
    title: "Entrega em todo o Brasil",
    description:
      "De capitais a cidades do interior, seu cartão chega no endereço informado.",
  },
];

export default function Benefits() {
  return (
    <section id="beneficios" className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title">Benefícios do cartão</h2>
          <p className="section-subtitle mx-auto">
            Vantagens para quem quer acesso ao mercado internacional
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => {
            const IconComponent = benefit.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                whileHover={{ y: benefit.highlight ? 0 : -4 }}
                className={`rounded-xl p-6 border transition-shadow duration-300 ${
                  benefit.highlight
                    ? "bg-brand-700 border-brand-700"
                    : "bg-white border-gray-200 hover:shadow-lg"
                }`}
              >
                <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
                  <IconComponent
                    size={24}
                    className={`mb-4 ${benefit.highlight ? "text-emerald-400" : "text-brand-600"}`}
                  />
                </motion.div>
                <h3 className={`font-bold mb-1.5 ${
                  benefit.highlight ? "text-xl text-white" : "text-base text-gray-900"
                }`}>
                  {benefit.title}
                </h3>
                <p className={`text-sm leading-relaxed ${
                  benefit.highlight ? "text-brand-200" : "text-gray-500"
                }`}>
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
