"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightIcon, ShieldCheckIcon, CreditCardIcon } from "@/components/icons";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function HeroSection() {
  return (
    <section className="pt-16 pb-20 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left column */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6"
        >
          <motion.h1
            variants={fadeUpVariants}
            className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight"
          >
            Seu cartao de credito internacional, sem burocracia e sem complicacao
          </motion.h1>

          <motion.p
            variants={fadeUpVariants}
            className="text-lg text-gray-500 leading-relaxed"
          >
            Conectamos voce as melhores ofertas de cartoes internacionais de
            bancos parceiros. Processo 100% online, resposta em minutos e
            entrega em todo o Brasil.
          </motion.p>

          <motion.div variants={fadeUpVariants}>
            <Link href="/solicitar" className="btn-primary text-base py-4 px-8">
              Solicitar meu cartao
              <ArrowRightIcon size={18} />
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUpVariants}
            className="flex items-center gap-2 text-gray-400"
          >
            <ShieldCheckIcon size={16} />
            <span className="text-sm">
              Seus dados estao protegidos com criptografia de ponta a ponta
            </span>
          </motion.div>
        </motion.div>

        {/* Right column - hero image placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
          className="flex items-center justify-center"
        >
          <div className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-3xl aspect-square w-full max-w-md flex items-center justify-center">
            <CreditCardIcon size={120} className="text-brand-300" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
