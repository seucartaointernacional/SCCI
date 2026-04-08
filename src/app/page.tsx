import LeadForm from "@/components/LeadForm";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="py-6 px-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">
            Seu Cartão <span className="text-blue-600">Internacional</span>
          </h1>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 pt-8 pb-4">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Seu Cartão Internacional
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Preencha seus dados e receba uma proposta personalizada em segundos.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="px-4 pb-16">
        <div className="card-container">
          <LeadForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-400">
        <p>&copy; 2026 Seu Cartão Internacional. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}
