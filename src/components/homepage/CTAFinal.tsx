"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@/components/icons";

export default function CTAFinal() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

      <div className="relative z-10 max-w-2xl mx-auto text-center text-white">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-extrabold mb-5 tracking-tight"
        >
          Solicite seu cartão internacional agora
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-brand-100/90 text-lg mb-10 leading-relaxed"
        >
          Processo rápido, seguro e sem burocracia. Seu cartão pode estar a
          caminho em minutos.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            href="/solicitar"
            className="inline-flex items-center justify-center gap-2 bg-white text-brand-700 font-bold rounded-2xl px-10 py-4 text-lg hover:bg-brand-50 transition-all duration-200 shadow-xl shadow-black/10"
          >
            Quero meu cartão
            <ArrowRightIcon size={20} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
