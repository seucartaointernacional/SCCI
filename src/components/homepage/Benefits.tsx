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
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100",
  },
  {
    icon: DollarSignIcon,
    title: "Compras em dólar, euro e libra",
    description:
      "Pague em moeda estrangeira direto no cartão, sem precisar abrir conta no exterior.",
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-100",
  },
  {
    icon: CalendarIcon,
    title: "Sem anuidade no primeiro ano",
    description:
      "Comece a usar sem custo de manutenção. Sem surpresas na fatura.",
    iconColor: "text-violet-600",
    iconBg: "bg-violet-100",
  },
  {
    icon: ClockIcon,
    title: "Aprovação em minutos",
    description:
      "Nada de esperar dias por uma resposta. Nosso sistema analisa seu perfil e retorna uma proposta na hora.",
    iconColor: "text-amber-600",
    iconBg: "bg-amber-100",
  },
  {
    icon: TruckIcon,
    title: "Entrega em todo o Brasil",
    description:
      "De capitais a cidades do interior, seu cartão chega no endereço que você informar.",
    iconColor: "text-rose-600",
    iconBg: "bg-rose-100",
  },
  {
    icon: ShieldCheckIcon,
    title: "Negativado também pode solicitar",
    description:
      "Seu nome no SPC ou Serasa não impede a solicitação. Analisamos seu perfil de forma independente.",
    iconColor: "text-teal-600",
    iconBg: "bg-teal-100",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: i * 0.08,
    },
  }),
};

export default function Benefits() {
  return (
    <section id="beneficios" className="py-24 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">
            Por que escolher o Seu Cartão Internacional
          </h2>
          <p className="section-subtitle mx-auto">
            Vantagens pensadas para quem quer praticidade e acesso ao mercado
            global
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="bg-white rounded-2xl p-7 border border-gray-100 shadow-md shadow-gray-100/60 hover:shadow-lg hover:shadow-gray-200/60 hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${benefit.iconBg} flex items-center justify-center mb-5`}>
                  <IconComponent size={22} className={benefit.iconColor} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
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
