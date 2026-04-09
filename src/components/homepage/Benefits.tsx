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
      "Use seu cartão para compras online e presenciais em qualquer estabelecimento que aceite as principais bandeiras.",
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
      "Nada de esperar dias por uma resposta. Nosso sistema analisa seu perfil e retorna uma proposta na hora.",
  },
  {
    icon: TruckIcon,
    title: "Entrega em todo o Brasil",
    description:
      "De capitais a cidades do interior, seu cartão chega no endereço que você informar.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Negativado também pode solicitar",
    description:
      "Seu nome no SPC ou Serasa não impede a solicitação. Analisamos seu perfil de forma independente.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
      delay: i * 0.1,
    },
  }),
};

export default function Benefits() {
  return (
    <section id="beneficios" className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title">
            Por que escolher o Seu Cartão Internacional
          </h2>
          <p className="section-subtitle mx-auto">
            Vantagens pensadas para quem quer praticidade e acesso ao mercado
            global
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, i) => {
            const IconComponent = benefit.icon;
            return (
              <motion.div
                key={i}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                  <IconComponent size={20} className="text-brand-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
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
