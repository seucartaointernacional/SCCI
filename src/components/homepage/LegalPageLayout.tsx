import Link from "next/link";
import Navbar from "@/components/homepage/Navbar";
import Footer from "@/components/homepage/Footer";
import { ArrowLeftIcon } from "@/components/icons";

interface LegalPageLayoutProps {
  title: string;
  intro: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function LegalPageLayout({
  title,
  intro,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  return (
    <main>
      <Navbar />
      <section className="bg-gradient-to-b from-brand-50/40 to-white border-b border-gray-100 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-brand-700 hover:text-brand-800 font-medium mb-6"
          >
            <ArrowLeftIcon size={16} />
            Voltar para a home
          </Link>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight mb-3">
            {title}
          </h1>
          <p className="text-gray-600 text-base lg:text-lg leading-relaxed max-w-2xl">
            {intro}
          </p>
          <p className="mt-4 text-xs text-gray-400 uppercase tracking-wider font-semibold">
            Última atualização: {lastUpdated}
          </p>
        </div>
      </section>

      <article className="py-14 px-4 bg-white">
        <div className="max-w-3xl mx-auto legal-content">{children}</div>
      </article>

      <Footer />
    </main>
  );
}
