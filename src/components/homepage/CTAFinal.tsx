"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@/components/icons";

export default function CTAFinal() {
  return (
    <section className="bg-brand-700 text-white py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-extrabold mb-4"
        >
          Solicite seu cartão internacional agora
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-brand-200 mb-8 leading-relaxed"
        >
          Processo rápido, seguro e sem burocracia. Mesmo negativado, você pode
          ser aprovado.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Link
            href="/solicitar"
            className="inline-flex items-center justify-center gap-2 bg-white text-brand-800 font-bold rounded-xl px-8 py-4 hover:bg-gray-100 transition-colors"
          >
            Quero meu cartão
            <ArrowRightIcon size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
