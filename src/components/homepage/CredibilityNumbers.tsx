"use client";

import { motion } from "framer-motion";

const metrics = [
  { value: "+5.000", label: "cartões emitidos" },
  { value: "98%", label: "taxa de aprovação" },
  { value: "4.8/5.0", label: "avaliação dos clientes" },
  { value: "27", label: "estados atendidos" },
];

export default function CredibilityNumbers() {
  return (
    <section className="bg-brand-800 text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="text-center"
            >
              <p className="text-3xl md:text-4xl font-extrabold">{metric.value}</p>
              <p className="text-brand-300 text-sm mt-1">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
