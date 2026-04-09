"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightIcon, ShieldCheckIcon } from "@/components/icons";

export default function HeroSection() {
  return (
    <section className="bg-brand-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Cartão de crédito internacional aprovado{" "}
              <span className="bg-emerald-500 text-white px-3 py-1 rounded-lg inline-block mt-1">
                mesmo com nome negativado
              </span>
            </h1>

            <p className="text-lg text-brand-200 leading-relaxed max-w-lg">
              Um cartão aprovado por bancos internacionais que funciona como
              qualquer cartão brasileiro. Use em real, dólar, euro ou qualquer
              moeda. Processo 100% online e sem consulta ao SPC/Serasa.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/solicitar"
                className="bg-white text-brand-800 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
              >
                Solicitar cartão
                <ArrowRightIcon size={18} />
              </Link>
              <a
                href="#como-funciona"
                className="border border-white/30 text-white font-semibold py-4 px-8 rounded-xl hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
              >
                Saiba mais
              </a>
            </div>

            <div className="flex items-center gap-6 pt-2 text-sm text-brand-300">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon size={16} />
                <span>Dados protegidos</span>
              </div>
              <span>|</span>
              <span>CNPJ 85.557.385/0001-45</span>
            </div>
          </motion.div>

          {/* Right column - hero image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md">
              <div className="rounded-2xl overflow-hidden">
                <Image
                  src="/images/hero.jpg"
                  alt="Cliente com cartão de crédito internacional"
                  width={500}
                  height={500}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
