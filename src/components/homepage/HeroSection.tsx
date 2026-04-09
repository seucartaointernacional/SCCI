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

          {/* Right column - Credit Card with floating badges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-sm lg:max-w-md">
              {/* Card */}
              <div className="relative z-10">
                <CreditCard
                  nome="Cartão Internacional"
                  bandeira="visa"
                  corPrimaria="#0F172A"
                  corSecundaria="#334155"
                  corTexto="#ffffff"
                  holderName="SEU NOME AQUI"
                />
              </div>

              {/* Floating badges around the card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute -left-4 top-2 z-20 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 flex items-center gap-2"
              >
                <CheckCircleIcon size={16} className="text-emerald-500 shrink-0" />
                <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">Aceita Negativados</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="absolute -right-4 top-0 z-20 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 flex items-center gap-2"
              >
                <CheckCircleIcon size={16} className="text-emerald-500 shrink-0" />
                <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">+93% de Aprovação</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="absolute -left-6 bottom-[45%] z-20 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 flex items-center gap-2"
              >
                <CheckCircleIcon size={16} className="text-brand-500 shrink-0" />
                <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">Simulação Grátis em 3 min</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3, duration: 0.5 }}
                className="absolute -right-6 bottom-[40%] z-20 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 flex items-center gap-2"
              >
                <CheckCircleIcon size={16} className="text-emerald-500 shrink-0" />
                <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">Sem Anuidade</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="absolute left-1/2 -translate-x-1/2 -bottom-5 z-20 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 flex items-center gap-2"
              >
                <CheckCircleIcon size={16} className="text-brand-500 shrink-0" />
                <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">Compras Online e Presenciais</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
