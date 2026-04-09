import { LockIcon } from "@/components/icons";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Top */}
        <div className="mb-8">
          <h3 className="text-lg font-bold tracking-tight mb-3">
            Seu Cartão{" "}
            <span className="text-brand-400">Internacional</span>
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
            Seu Cartão Internacional é uma plataforma intermediária que conecta
            você às melhores ofertas de cartões de crédito internacionais de
            bancos parceiros. Não somos um banco ou instituição financeira.
          </p>
        </div>

        {/* Middle - links */}
        <div className="flex flex-wrap gap-6 mb-8 text-sm">
          <a
            href="#como-funciona"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Como Funciona
          </a>
          <a
            href="#beneficios"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Benefícios
          </a>
          <a
            href="#depoimentos"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Depoimentos
          </a>
          <a
            href="#duvidas"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Dúvidas
          </a>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <span>
              &copy; 2026 Seu Cartão Internacional. Todos os direitos
              reservados.
            </span>
            <span>CNPJ: 85.557.385/0001-45</span>
            <div className="flex items-center gap-1.5">
              <LockIcon size={12} />
              <span>Dados protegidos</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
