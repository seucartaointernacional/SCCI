"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightIcon, ShieldCheckIcon, CheckCircleIcon } from "@/components/icons";
import CreditCard from "@/components/CreditCard";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-gray-900 via-brand-900 to-brand-800 text-white overflow-hidden">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-7"
          >
            {/* Trust pill */}
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
              <CheckCircleIcon size={16} />
              <span>Aprovação sem consulta ao SPC/Serasa</span>
            </div>

            <h1 className="text-4xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.1]">
              Cartão de crédito internacional
              <br />
              <span className="text-emerald-400">mesmo com nome negativado</span>
            </h1>

            <p className="text-lg text-gray-300 leading-relaxed max-w-lg">
              Aprovado por bancos internacionais, funciona como qualquer cartão
              brasileiro. Use em real, dólar, euro ou qualquer moeda do mundo.
              Sem anuidade e sem cobranças extras.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link
                href="/solicitar"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-8 rounded-xl transition-colors inline-flex items-center justify-center gap-2 text-base"
              >
                Solicitar meu cartão
                <ArrowRightIcon size={18} />
              </Link>
              <a
                href="#como-funciona"
                className="border border-gray-600 text-gray-300 font-semibold py-4 px-8 rounded-xl hover:bg-white/5 hover:border-gray-500 transition-all inline-flex items-center justify-center gap-2 text-base"
              >
                Como funciona
              </a>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon size={15} />
                <span>Dados protegidos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon size={15} />
                <span>+5.000 cartões emitidos</span>
              </div>
              <span className="hidden sm:inline text-gray-600">|</span>
              <span className="text-gray-500">CNPJ 85.557.385/0001-45</span>
            </div>
          </motion.div>

          {/* Right column - Credit Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotateY: -10 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center justify-center lg:justify-end"
          >
            <div className="w-full max-w-sm lg:max-w-md" style={{ perspective: 1000 }}>
              <div className="transform hover:scale-105 transition-transform duration-500">
                <CreditCard
                  nome="Cartão Internacional"
                  bandeira="visa"
                  corPrimaria="#1E40AF"
                  corSecundaria="#3B82F6"
                  corTexto="#ffffff"
                  holderName="SEU NOME AQUI"
                />
              </div>
              {/* Card shadow reflection */}
              <div className="mt-6 mx-auto w-4/5 h-4 bg-brand-500/10 rounded-full blur-xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
