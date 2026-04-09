"use client";

import { motion } from "framer-motion";
import { StarIcon } from "@/components/icons";

const testimonials = [
  {
    name: "Maria S.",
    location: "São Paulo, SP",
    gradient: "from-brand-500 to-brand-700",
    quote:
      "Recebi meu cartão em 25 dias. O processo foi rápido e transparente, sem nenhuma surpresa. Já usei pra comprar em sites internacionais e funcionou perfeitamente.",
  },
  {
    name: "Carlos R.",
    location: "Belo Horizonte, MG",
    gradient: "from-emerald-500 to-emerald-700",
    quote:
      "Estava com o nome negativado e achei que não conseguiria. Fiz a solicitação sem muita esperança e fui aprovado. Cartão chegou certinho no prazo.",
  },
  {
    name: "Ana L.",
    location: "Recife, PE",
    gradient: "from-violet-500 to-violet-700",
    quote:
      "Precisava de um cartão internacional pra uma viagem e consegui o meu em menos de um mês. Atendimento sério e processo bem organizado.",
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
      delay: i * 0.15,
    },
  }),
};

export default function Testimonials() {
  return (
    <section id="depoimentos" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">O que nossos clientes dizem</h2>
          <p className="section-subtitle mx-auto">
            Milhares de brasileiros já receberam seu cartão internacional
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="bg-white rounded-2xl p-7 shadow-md shadow-gray-100/60 border border-gray-100 hover:shadow-lg hover:shadow-gray-200/60 transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <StarIcon key={j} size={18} className="text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-600 leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="border-t border-gray-100 pt-5 flex items-center gap-3">
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center shrink-0 shadow-md`}>
                  <span className="text-white text-sm font-bold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-gray-400 text-xs">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
