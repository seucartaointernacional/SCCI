"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircleIcon, ShieldCheckIcon } from "@/components/icons";

interface Testimonial {
  photo: string;
  city: string;
  state: string;
  receivedAt: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    photo: "/images/cliente1.jpg",
    city: "São Paulo",
    state: "SP",
    receivedAt: "jan/2026",
    quote:
      "Eu tava sem cartão fazia muito tempo, por causa do meu nome no Serasa. Tinha tentado nas Lojas Americanas, no banco onde recebo o INSS, e era sempre não. Minha filha que viu esse na internet e me mandou tentar. Fui aprovada e o cartão chegou certinho. Tô usando com cuidado.",
  },
  {
    photo: "/images/cliente2.jpg",
    city: "Recife",
    state: "PE",
    receivedAt: "fev/2026",
    quote:
      "Tava negativado fazia uns 3 anos. Já tinha tentado em uns 4 bancos e numa financeira tbm, ninguém aprovava. Vi esse site, fiz mais sem esperança e fui aprovado mesmo. Cartão chegou em casa numa boa.",
  },
  {
    photo: "/images/cliente3.jpg",
    city: "Belo Horizonte",
    state: "MG",
    receivedAt: "mar/2026",
    quote:
      "Já tinha tentado em uns 3 bancos e em 2 app de crédito tbm, era sempre negado por causa do nome sujo. Tentei aqui sem muita fé e olha, fui aprovada. Pra quem ta negativada e ja tentou em tudo quanto é lugar, vale a pena tentar viu.",
  },
];

export default function Testimonials() {
  return (
    <section id="depoimentos" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title">Depoimentos de clientes</h2>
          <p className="section-subtitle mx-auto">
            Veja o que dizem quem já recebeu o cartão
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-brand-50 shrink-0">
                  <Image
                    src={t.photo}
                    alt="Imagem ilustrativa de cliente"
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <CheckCircleIcon size={14} className="text-emerald-500 shrink-0" />
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                      Cliente verificado
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {t.city}, {t.state} · Recebido em {t.receivedAt}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed text-[15px] mb-4 flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="border-t border-gray-100 pt-3 flex items-center gap-1.5 text-[11px] text-gray-400">
                <ShieldCheckIcon size={11} className="shrink-0" />
                <span>Coletado via WhatsApp · identidade preservada (LGPD)</span>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8 max-w-2xl mx-auto leading-relaxed">
          Imagens meramente ilustrativas. Nomes e identidades dos titulares
          preservados em conformidade com a Lei Geral de Proteção de Dados
          (Lei nº 13.709/2018).
        </p>
      </div>
    </section>
  );
}
