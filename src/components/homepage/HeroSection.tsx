"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  DollarSignIcon,
  GlobeIcon,
} from "@/components/icons";
import CreditCard from "@/components/CreditCard";

export default function HeroSection() {
  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.15]">
              Cartão de crédito internacional{" "}
              <span className="text-brand-600">mesmo com nome negativado</span>
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed max-w-lg">
              Aprovado por bancos internacionais, funciona como qualquer cartão
              brasileiro. Use em real, dólar, euro ou qualquer moeda do mundo.
            </p>

            {/* Destaques com ícones */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5">
                <DollarSignIcon size={18} className="text-emerald-600 shrink-0" />
                <span className="text-sm font-bold text-emerald-800">Sem anuidade</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5">
                <CheckCircleIcon size={18} className="text-emerald-600 shrink-0" />
                <span className="text-sm font-bold text-emerald-800">Sem cobranças extras</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5">
                <GlobeIcon size={18} className="text-brand-600 shrink-0" />
                <span className="text-sm font-bold text-brand-800">Qualquer moeda</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/solicitar"
                className="btn-primary text-base py-4 px-8"
              >
                Solicitar meu cartão
                <ArrowRightIcon size={18} />
              </Link>
              <a
                href="#como-funciona"
                className="btn-secondary text-base py-4 px-8"
              >
                Como funciona
              </a>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheckIcon size={15} className="text-emerald-500" />
                <span>Dados protegidos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircleIcon size={15} className="text-emerald-500" />
                <span>+5.000 cartões emitidos</span>
              </div>
              <span className="text-gray-300">|</span>
              <span>CNPJ 85.557.385/0001-45</span>
            </div>
          </motion.div>

          {/* Right column - Credit Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center justify-center lg:justify-end"
          >
            <div className="w-full max-w-sm lg:max-w-md">
              <div className="transform hover:scale-[1.03] transition-transform duration-500">
                <CreditCard
                  nome="Cartão Internacional"
                  bandeira="visa"
                  corPrimaria="#0F172A"
                  corSecundaria="#334155"
                  corTexto="#ffffff"
                  holderName="SEU NOME AQUI"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
