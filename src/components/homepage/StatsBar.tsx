"use client";

import { motion } from "framer-motion";
import { CreditCardIcon, CheckCircleIcon, ShieldCheckIcon } from "@/components/icons";

const stats = [
  {
    icon: CreditCardIcon,
    highlight: "+5.000",
    label: "cartões emitidos",
    color: "text-brand-600 bg-brand-50",
  },
  {
    icon: CheckCircleIcon,
    highlight: "98%",
    label: "de aprovação",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    icon: ShieldCheckIcon,
    highlight: "Sem consulta",
    label: "ao SPC/Serasa",
    color: "text-violet-600 bg-violet-50",
  },
];

export default function StatsBar() {
  return (
    <section className="py-10 px-4 bg-gray-50 border-y border-gray-100">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, i) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="flex items-center gap-4 justify-center sm:justify-start"
            >
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center shrink-0`}>
                <IconComponent size={22} />
              </div>
              <div>
                <p className="text-xl font-extrabold text-gray-900">{stat.highlight}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
