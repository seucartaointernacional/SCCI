"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "@/components/icons";

const faqs = [
  {
    question: "O que e o Seu Cartao Internacional?",
    answer:
      "Somos uma plataforma que conecta voce as melhores ofertas de cartoes de credito internacionais de bancos parceiros. Facilitamos todo o processo para que voce receba seu cartao sem burocracia.",
  },
  {
    question: "Como funciona o processo?",
    answer:
      "Voce preenche seus dados no formulario, nosso sistema analisa seu perfil e apresenta a melhor proposta disponivel. Se voce aceitar, o cartao e enviado para o endereco informado.",
  },
  {
    question: "Preciso ter o nome limpo para solicitar?",
    answer:
      "Nao. Mesmo com restricoes no SPC ou Serasa, voce pode fazer a solicitacao. A analise e feita de forma independente com base no seu perfil completo.",
  },
  {
    question: "Quanto tempo leva para receber o cartao?",
    answer:
      "O prazo de entrega e de 22 a 36 dias uteis apos a confirmacao, dependendo da sua regiao.",
  },
  {
    question: "Meus dados estao seguros?",
    answer:
      "Sim. Utilizamos criptografia de ponta a ponta e nao compartilhamos suas informacoes com terceiros. Nossa plataforma segue as melhores praticas de seguranca digital.",
  },
  {
    question: "Quais bandeiras estao disponiveis?",
    answer:
      "Trabalhamos com as principais bandeiras do mercado, incluindo Visa e Mastercard, aceitas em milhoes de estabelecimentos ao redor do mundo.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggleIndex(i: number) {
    setOpenIndex((prev) => (prev === i ? null : i));
  }

  return (
    <section id="duvidas" className="py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title">Duvidas frequentes</h2>
        </div>

        <div className="divide-y divide-gray-100">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="py-4">
                <button
                  onClick={() => toggleIndex(i)}
                  className="w-full flex items-center justify-between text-left gap-4 group"
                >
                  <span className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 text-gray-400"
                  >
                    <ChevronDownIcon size={20} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-gray-500 text-sm leading-relaxed pt-3 pb-1">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
