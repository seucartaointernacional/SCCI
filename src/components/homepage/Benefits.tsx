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

const benefits = [
  {
    icon: GlobeIcon,
    title: "Aceito em mais de 150 países",
    description:
      "Use seu cartão em qualquer estabelecimento que aceite Visa ou Mastercard no mundo.",
  },
  {
    icon: DollarSignIcon,
    title: "Compras em dólar, euro e libra",
    description:
      "Pague em moeda estrangeira direto no cartão, sem precisar abrir conta no exterior.",
  },
  {
    icon: CalendarIcon,
    title: "Sem anuidade no primeiro ano",
    description:
      "Comece a usar sem custo de manutenção. Sem surpresas na fatura.",
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
  {
    icon: ShieldCheckIcon,
    title: "Negativado pode solicitar",
    description:
      "Restrições no SPC ou Serasa não impedem a solicitação. Análise independente.",
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
                className="bg-white rounded-xl p-6 border border-gray-200"
              >
                <IconComponent size={24} className="text-brand-600 mb-4" />
                <h3 className="text-base font-bold text-gray-900 mb-1.5">
                  {benefit.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
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
