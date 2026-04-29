"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { UsersIcon, MapPinIcon, MailIcon } from "@/components/icons";

const stats = [
  { value: "+50", label: "profissionais dedicados" },
  { value: "27", label: "estados atendidos" },
  { value: "100%", label: "atendimento humano" },
];

export default function TeamSection() {
  return (
    <section id="equipe" className="bg-white py-20 px-4 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
            <UsersIcon size={14} />
            Quem está por trás
          </span>
          <h2 className="section-title">Conheça nossa equipe</h2>
          <p className="section-subtitle mx-auto">
            Um time real, em um escritório real, atendendo clientes reais — todos os
            dias, em todo o Brasil.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative rounded-2xl overflow-hidden shadow-elevated mb-10 ring-1 ring-gray-100"
        >
          <Image
            src="/images/equipe.jpg"
            alt="Equipe do Seu Cartão Internacional reunida no escritório de São Paulo"
            width={2000}
            height={1125}
            className="w-full h-auto object-cover"
            priority={false}
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3.5 py-2 shadow-md">
            <MapPinIcon size={14} className="text-brand-600 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-gray-800">
              Sede São Paulo · Vila Ipojuca
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-3 md:gap-6 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-4 md:px-6 md:py-5 text-center"
            >
              <p className="text-xl md:text-3xl font-extrabold text-brand-700">{stat.value}</p>
              <p className="text-[11px] md:text-sm text-gray-500 mt-1 leading-tight">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-brand-50 to-white border border-brand-100 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0">
            <MailIcon size={20} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-base mb-1">
              Tem alguma dúvida antes de solicitar?
            </p>
            <p className="text-sm text-gray-600">
              Fale direto com nosso time pelo e-mail oficial.
            </p>
          </div>
          <a
            href="mailto:contato@seucartaointernacional.com.br"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 transition-colors text-white font-semibold text-sm rounded-lg px-5 py-3 whitespace-nowrap"
          >
            contato@seucartaointernacional.com.br
          </a>
        </div>
      </div>
    </section>
  );
}
