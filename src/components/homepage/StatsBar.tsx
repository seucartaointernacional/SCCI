export default function StatsBar() {
  const stats = [
    { highlight: "+5.000", label: "cartoes emitidos" },
    { highlight: "98%", label: "de aprovacao" },
    { highlight: "Sem consulta", label: "ao SPC/Serasa" },
  ];

  return (
    <section className="border-y border-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-around gap-6 sm:gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-gray-900">
              {stat.highlight}
            </p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
