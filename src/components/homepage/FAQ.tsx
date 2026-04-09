"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "@/components/icons";

const faqs = [
  {
    question: "O que é o Seu Cartão Internacional?",
    answer:
      "Somos uma plataforma que conecta você a bancos parceiros internacionais para emissão de cartões de crédito. O cartão funciona como qualquer cartão brasileiro — você usa em real, dólar, euro ou qualquer moeda — mas é aprovado por bancos do mundo todo, o que facilita a aprovação mesmo para quem tem restrições no nome.",
  },
  {
    question: "Como funciona o processo?",
    answer:
      "Você preenche seus dados no formulário, nosso sistema analisa seu perfil e apresenta a melhor proposta disponível. Se você aceitar, o cartão é enviado para o endereço informado.",
  },
  {
    question: "Preciso ter o nome limpo para solicitar?",
    answer:
      "Não. Mesmo com restrições no SPC ou Serasa, você pode fazer a solicitação. A análise é feita de forma independente com base no seu perfil completo.",
  },
  {
    question: "O cartão tem anuidade ou custos de manutenção?",
    answer:
      "Não. O cartão tem custo zero de manutenção: sem anuidade, sem taxa mensal e sem cobranças extras. Você só paga pelo que usar.",
  },
  {
    question: "Quanto tempo leva para receber o cartão?",
    answer:
      "O prazo de entrega é de 22 a 36 dias úteis após a confirmação, dependendo da sua região.",
  },
  {
    question: "Meus dados estão seguros?",
    answer:
      "Sim. Utilizamos criptografia de ponta a ponta e não compartilhamos suas informações com terceiros. Nossa plataforma segue as melhores práticas de segurança digital.",
  },
  {
    question: "Quais bandeiras estão disponíveis?",
    answer:
      "Trabalhamos com as principais bandeiras do mercado, incluindo Visa e Mastercard, aceitas em milhões de estabelecimentos ao redor do mundo.",
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
          <h2 className="section-title">Dúvidas frequentes</h2>
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
