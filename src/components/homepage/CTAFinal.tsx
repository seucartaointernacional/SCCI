import Link from "next/link";

export default function CTAFinal() {
  return (
    <section className="bg-gradient-to-br from-brand-600 to-brand-700 text-white py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">
          Solicite seu cartão internacional agora
        </h2>
        <p className="text-brand-100 mb-8 leading-relaxed">
          Processo rápido, seguro e sem burocracia. Seu cartão pode estar a
          caminho em minutos.
        </p>
        <Link
          href="/solicitar"
          className="inline-flex items-center justify-center bg-white text-brand-700 font-semibold rounded-2xl px-8 py-4 hover:bg-brand-50 transition-colors duration-200"
        >
          Quero meu cartão
        </Link>
      </div>
    </section>
  );
}
