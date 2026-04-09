import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";

export default function CTAFinal() {
  return (
    <section className="bg-brand-700 text-white py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold mb-4">
          Solicite seu cartão internacional agora
        </h2>
        <p className="text-brand-200 mb-8 leading-relaxed">
          Processo rápido, seguro e sem burocracia. Mesmo negativado, você pode
          ser aprovado.
        </p>
        <Link
          href="/solicitar"
          className="inline-flex items-center justify-center gap-2 bg-white text-brand-800 font-bold rounded-xl px-8 py-4 hover:bg-gray-100 transition-colors"
        >
          Quero meu cartão
          <ArrowRightIcon size={18} />
        </Link>
      </div>
    </section>
  );
}
