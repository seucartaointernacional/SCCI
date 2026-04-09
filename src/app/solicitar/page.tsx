import FlowHeader from "@/components/FlowHeader";
import FlowFooter from "@/components/FlowFooter";
import FlowProgress from "@/components/FlowProgress";
import LeadForm from "@/components/LeadForm";


export default function SolicitarPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <FlowHeader />
      <FlowProgress
        currentStep={1}
        totalSteps={5}
        labels={["Dados", "Análise", "Proposta", "Pagamento", "Confirmação"]}
      />

      <section className="px-4 pt-10 pb-4">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Solicite seu cartão
          </h2>
          <p className="text-gray-500 text-base mb-8">
            Preencha seus dados e receba uma proposta personalizada em segundos.
          </p>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="card-container max-w-lg mx-auto">
          <LeadForm />
        </div>
      </section>

      <FlowFooter />
    </main>
  );
}
