"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  LockIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  ShieldCheckIcon,
} from "@/components/icons";

const navColumns = [
  {
    title: "Produto",
    links: [
      { label: "Como Funciona", href: "/#como-funciona" },
      { label: "Benefícios", href: "/#beneficios" },
      { label: "Depoimentos", href: "/#depoimentos" },
      { label: "Equipe", href: "/#equipe" },
      { label: "Dúvidas Frequentes", href: "/#duvidas" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Termos de Uso", href: "/termos" },
      { label: "Política de Privacidade", href: "/privacidade" },
      { label: "LGPD — Direitos do Titular", href: "/lgpd" },
    ],
  },
];

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-gray-900 text-white py-14 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-10">
          <div className="md:col-span-6">
            <h3 className="text-lg font-extrabold tracking-tight mb-3">
              Seu Cartão{" "}
              <span className="text-brand-300">Internacional</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Plataforma intermediária que conecta você às melhores ofertas de
              cartões de crédito internacionais de bancos parceiros. Não somos um
              banco ou instituição financeira.
            </p>

            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2.5 text-gray-300">
                <MapPinIcon size={16} className="text-brand-300 shrink-0 mt-0.5" />
                <span>
                  Travessa Henrique Maine, 1138 — Sala 1001, 10º andar
                  <br />
                  <span className="text-gray-400">
                    Vila Ipojuca · São Paulo/SP · CEP 05056-023
                  </span>
                </span>
              </li>
              <li>
                <a
                  href="mailto:contato@seucartaointernacional.com.br"
                  className="flex items-center gap-2.5 text-gray-300 hover:text-white transition-colors"
                >
                  <MailIcon size={16} className="text-brand-300 shrink-0" />
                  <span>contato@seucartaointernacional.com.br</span>
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-gray-300">
                <PhoneIcon size={16} className="text-brand-300 shrink-0" />
                <span>+55 21 98873-9888</span>
              </li>
            </ul>
          </div>

          {navColumns.map((col) => (
            <div key={col.title} className="md:col-span-3">
              <span className="font-semibold text-gray-200 text-sm mb-3 block">
                {col.title}
              </span>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-6 space-y-3 md:space-y-0">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheckIcon size={13} className="text-emerald-400" />
              <span>Conexão SSL</span>
            </div>
            <div className="flex items-center gap-1.5">
              <LockIcon size={13} className="text-emerald-400" />
              <span>LGPD-Compliant</span>
            </div>
            <span className="font-medium text-gray-500">
              CNPJ: 85.557.385/0001-45
            </span>
          </div>
          <p className="text-xs text-gray-500">
            &copy; 2026 Seu Cartão Internacional. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
