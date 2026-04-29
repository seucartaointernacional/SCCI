"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GlobeIcon, ShieldCheckIcon } from "@/components/icons";

const banks = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  src: `/images/banks/banco-${i + 1}.png`,
}));

export default function BankPartners() {
  return (
    <section
      id="bancos-parceiros"
      className="relative bg-white py-20 px-4 border-y border-gray-100 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(51,91,255,0.05),_transparent_60%)]"
      />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
            <GlobeIcon size={14} />
            Bancos parceiros
          </span>

          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight max-w-3xl mx-auto">
            20+ bancos no exterior.{" "}
            <span className="text-brand-600">Uma proposta pronta para você.</span>
          </h2>

          <p className="text-base md:text-lg text-gray-500 mt-4 max-w-2xl mx-auto leading-relaxed">
            Eles não consultam SPC ou Serasa — estar negativado no Brasil não
            impede sua aprovação lá fora.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 bg-gray-50/60 rounded-2xl p-6 md:p-8 ring-1 ring-gray-100"
        >
          {banks.map((bank, i) => (
            <motion.div
              key={bank.id}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.04, duration: 0.35 }}
              className="group relative aspect-[3/2] bg-white rounded-xl border border-gray-100 flex items-center justify-center p-4 hover:border-brand-200 hover:shadow-md transition-all duration-300"
            >
              <Image
                src={bank.src}
                alt="Logo de banco parceiro internacional"
                fill
                sizes="(min-width: 1024px) 200px, (min-width: 640px) 25vw, 33vw"
                className="object-contain p-3 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-center gap-y-2 sm:gap-x-6 mt-8 text-sm text-gray-500"
        >
          <div className="flex items-start sm:items-center gap-2">
            <ShieldCheckIcon size={16} className="text-emerald-500 shrink-0 mt-0.5 sm:mt-0" />
            <span>Sua solicitação é enviada para todos os bancos parceiros</span>
          </div>
          <span className="hidden sm:inline text-gray-300">·</span>
          <div className="flex items-start sm:items-center gap-2">
            <GlobeIcon size={16} className="text-brand-600 shrink-0 mt-0.5 sm:mt-0" />
            <span>Operam em mais de 150 países</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
