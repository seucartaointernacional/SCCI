export default function CredibilityNumbers() {
  const metrics = [
    { value: "+5.000", label: "cartoes emitidos" },
    { value: "98%", label: "de aprovacao" },
    { value: "4.8/5.0", label: "avaliacao dos clientes" },
    { value: "27 estados", label: "do Brasil" },
  ];

  return (
    <section className="bg-brand-800 text-white py-16 px-4 bg-noise overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
          {metrics.map((metric, i) => (
            <div
              key={i}
              className={`text-center ${
                i < metrics.length - 1
                  ? "md:border-r md:border-brand-700"
                  : ""
              }`}
            >
              <p className="text-3xl font-bold">{metric.value}</p>
              <p className="text-brand-200 text-sm mt-1">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
