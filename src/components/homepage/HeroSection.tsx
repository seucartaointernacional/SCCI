"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  DollarSignIcon,
} from "@/components/icons";
import CreditCard from "@/components/CreditCard";
import { TiltCard } from "@/components/TiltCard";

const floatingBadges = [
  { label: "Aceita Negativados", x: "-10%", y: "5%" },
  { label: "+93% de Aprovação", x: "75%", y: "-8%" },
  { label: "Simulação Grátis", x: "-15%", y: "50%" },
  { label: "Sem Anuidade", x: "80%", y: "55%" },
  { label: "Compras Online e Presenciais", x: "15%", y: "95%" },
];

const mobileBadges = [
  "Aceita Negativados",
  "+93% de Aprovação",
  "Sem Anuidade",
];

export default function HeroSection() {
  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-10 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left column (texto + cartão mobile inline) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4 lg:gap-6"
          >
            <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.15]">
              Cartão de crédito internacional{" "}
              <span className="text-brand-600">mesmo com nome negativado</span>
            </h1>

            <p className="text-base lg:text-lg text-gray-500 leading-relaxed">
              Aprovado por bancos internacionais, funciona como qualquer cartão
              brasileiro. Use em real, dólar, euro ou qualquer moeda do mundo.
            </p>

            {/* Cartão mobile - APARECE entre subhead e CTA no mobile */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:hidden -mx-2 my-1"
            >
              <div className="w-full max-w-xs mx-auto mb-4">
                <TiltCard
                  className="rounded-2xl"
                  tiltLimit={10}
                  scale={1.03}
                  effect="evade"
                  spotlight
                >
                  <CreditCard
                    nome="Cartão Internacional"
                    bandeira="visa"
                    corPrimaria="#0F172A"
                    corSecundaria="#334155"
                    corTexto="#ffffff"
                    holderName="SEU NOME AQUI"
                  />
                </TiltCard>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5">
                {mobileBadges.map((label) => (
                  <span
                    key={label}
                    className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full px-3 py-1 text-[11px] font-semibold flex items-center gap-1"
                  >
                    <CheckCircleIcon size={11} className="text-emerald-600 shrink-0" />
                    {label}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Destaques - só desktop */}
            <div className="hidden lg:flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5">
                <DollarSignIcon size={18} className="text-emerald-600 shrink-0" />
                <span className="text-sm font-bold text-emerald-800">Sem anuidade</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5">
                <CheckCircleIcon size={18} className="text-emerald-600 shrink-0" />
                <span className="text-sm font-bold text-emerald-800">Sem cobranças extras</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
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
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs lg:text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheckIcon size={14} className="text-emerald-500" />
                Dados protegidos
              </span>
              <span className="text-gray-300">·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircleIcon size={14} className="text-emerald-500" />
                +5.000 cartões emitidos
              </span>
              <span className="text-gray-300 hidden sm:inline">·</span>
              <span className="basis-full sm:basis-auto">
                CNPJ 85.557.385/0001-45
              </span>
            </div>
          </motion.div>

          {/* Right column DESKTOP - Card + 5 floating badges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative" style={{ width: 420, height: 420 }}>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px]">
                <TiltCard
                  className="rounded-2xl"
                  tiltLimit={12}
                  scale={1.04}
                  effect="evade"
                  spotlight
                >
                  <CreditCard
                    nome="Cartão Internacional"
                    bandeira="visa"
                    corPrimaria="#0F172A"
                    corSecundaria="#334155"
                    corTexto="#ffffff"
                    holderName="SEU NOME AQUI"
                  />
                </TiltCard>
              </div>

              {floatingBadges.map((badge, i) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.15, duration: 0.4 }}
                  className="absolute z-20"
                  style={{ left: badge.x, top: badge.y }}
                >
                  <div className="bg-white/80 backdrop-blur-md border border-gray-200/80 shadow-lg rounded-full px-3.5 py-2 flex items-center gap-2">
                    <CheckCircleIcon size={14} className="text-emerald-500 shrink-0" />
                    <span className="text-xs font-semibold text-gray-800 whitespace-nowrap">
                      {badge.label}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
