"use client";

import { motion } from "framer-motion";
import { StarIcon } from "@/components/icons";

const testimonials = [
  {
    name: "Maria S.",
    location: "São Paulo, SP",
    initial: "M",
    quote:
      "Recebi meu cartão em 25 dias. O processo foi rápido e transparente. Já usei para comprar em sites internacionais e funcionou perfeitamente.",
  },
  {
    name: "Carlos R.",
    location: "Belo Horizonte, MG",
    initial: "C",
    quote:
      "Estava com o nome negativado e achei que não conseguiria. Fiz a solicitação e fui aprovado. Cartão chegou certinho no prazo.",
  },
  {
    name: "Ana L.",
    location: "Recife, PE",
    initial: "A",
    quote:
      "Precisava de um cartão internacional para uma viagem e consegui o meu em menos de um mês. Processo bem organizado.",
  },
];

export default function Testimonials() {
  return (
    <section id="depoimentos" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title">Depoimentos de clientes</h2>
          <p className="section-subtitle mx-auto">
            Veja o que dizem quem já recebeu o cartão
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <StarIcon key={j} size={16} className="text-amber-400" />
                ))}
              </div>

              <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="border-t border-gray-100 pt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-700 text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {t.initial}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
