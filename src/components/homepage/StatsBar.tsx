"use client";

import { motion } from "framer-motion";
import { CreditCardIcon, CheckCircleIcon, ShieldCheckIcon } from "@/components/icons";

const stats = [
  {
    icon: CreditCardIcon,
    value: "+5.000",
    label: "cartões emitidos",
  },
  {
    icon: CheckCircleIcon,
    value: "98%",
    label: "taxa de aprovação",
  },
  {
    icon: ShieldCheckIcon,
    value: "100%",
    label: "online e seguro",
  },
];

export default function StatsBar() {
  return (
    <section className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
          {stats.map((stat, i) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
                className="flex items-center gap-4 justify-center py-4 sm:py-0"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <IconComponent size={24} className="text-brand-600 shrink-0" />
                </motion.div>
                <div>
                  <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
