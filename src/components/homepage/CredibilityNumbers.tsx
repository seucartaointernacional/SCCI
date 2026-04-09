"use client";

import { motion } from "framer-motion";

const metrics = [
  { value: "+5.000", label: "cartões emitidos" },
  { value: "98%", label: "de aprovação" },
  { value: "4.8/5.0", label: "avaliação dos clientes" },
  { value: "27 estados", label: "do Brasil" },
];

export default function CredibilityNumbers() {
  return (
    <section className="relative bg-gradient-to-r from-brand-800 via-brand-700 to-brand-800 text-white py-20 px-4 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-0">
          {metrics.map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`text-center ${
                i < metrics.length - 1
                  ? "md:border-r md:border-white/10"
                  : ""
              }`}
            >
              <p className="text-4xl md:text-5xl font-extrabold tracking-tight">{metric.value}</p>
              <p className="text-brand-200 text-sm mt-2 font-medium">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
