"use client";

import { motion } from "framer-motion";
import { StarIcon } from "@/components/icons";

const testimonials = [
  {
    name: "Maria S.",
    location: "São Paulo, SP",
    initials: "MS",
    quote:
      "Recebi meu cartão em 25 dias. O processo foi rápido e transparente, sem nenhuma surpresa. Já usei pra comprar em sites internacionais e funcionou perfeitamente.",
  },
  {
    name: "Carlos R.",
    location: "Belo Horizonte, MG",
    initials: "CR",
    quote:
      "Estava com o nome negativado e achei que não conseguiria. Fiz a solicitação sem muita esperança e fui aprovado. Cartão chegou certinho no prazo.",
  },
  {
    name: "Ana L.",
    location: "Recife, PE",
    initials: "AL",
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
      ease: "easeOut" as const,
      delay: i * 0.15,
    },
  }),
};

export default function Testimonials() {
  return (
    <section id="depoimentos" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title">O que nossos clientes dizem</h2>
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
              className="bg-white rounded-2xl p-6 shadow-card border border-gray-100"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <StarIcon key={j} size={16} className="text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-600 italic leading-relaxed mb-6 text-sm">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Divider */}
              <div className="border-t border-gray-100 pt-4 flex items-center gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-sm font-bold shrink-0">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
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
