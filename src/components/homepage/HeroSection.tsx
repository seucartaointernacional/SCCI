"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightIcon, ShieldCheckIcon, CheckCircleIcon } from "@/components/icons";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-emerald-50/30" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
          >
            <motion.div variants={fadeUpVariants}>
              <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm font-semibold px-4 py-1.5 rounded-full border border-emerald-100">
                <CheckCircleIcon size={14} />
                Negativado? Você também pode solicitar
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUpVariants}
              className="text-4xl lg:text-[3.25rem] font-extrabold tracking-tight text-gray-900 leading-[1.15]"
            >
              Seu cartão de crédito{" "}
              <span className="text-brand-600">internacional</span>, sem
              burocracia
            </motion.h1>

            <motion.p
              variants={fadeUpVariants}
              className="text-lg text-gray-500 leading-relaxed max-w-lg"
            >
              Conectamos você às melhores ofertas de cartões internacionais de
              bancos parceiros. Processo 100% online, resposta em minutos e
              entrega em todo o Brasil.
            </motion.p>

            <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row gap-3">
              <Link href="/solicitar" className="btn-primary text-base py-4 px-8">
                Solicitar meu cartão
                <ArrowRightIcon size={18} />
              </Link>
              <a href="#como-funciona" className="btn-secondary text-base py-4 px-8">
                Como funciona
              </a>
            </motion.div>

            <motion.div
              variants={fadeUpVariants}
              className="flex items-center gap-2 text-emerald-600"
            >
              <ShieldCheckIcon size={18} />
              <span className="text-sm font-medium">
                Seus dados protegidos com criptografia de ponta a ponta
              </span>
            </motion.div>
          </motion.div>

          {/* Right column - hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const, delay: 0.2 }}
            className="flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-lg">
              {/* Glow behind image */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-400/20 to-emerald-400/20 rounded-3xl blur-2xl scale-95" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-gray-300/40 border border-white/60">
                <Image
                  src="/images/hero.jpg"
                  alt="Mulher segurando cartão de crédito internacional"
                  width={600}
                  height={600}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl shadow-gray-200/80 border border-gray-100 px-5 py-3 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircleIcon size={20} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">98% aprovação</p>
                  <p className="text-xs text-gray-400">+5.000 cartões emitidos</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
