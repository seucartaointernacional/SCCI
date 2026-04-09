import { CreditCardIcon, CheckCircleIcon, ShieldCheckIcon } from "@/components/icons";

const stats = [
  {
    icon: CreditCardIcon,
    value: "+5.000",
    label: "cartões emitidos",
  },
  {
    icon: CheckCircleIcon,
    value: "98%",
    label: "taxa de aprovação",
  },
  {
    icon: ShieldCheckIcon,
    value: "100%",
    label: "online e seguro",
  },
];

export default function StatsBar() {
  return (
    <section className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
          {stats.map((stat, i) => {
            const IconComponent = stat.icon;
            return (
              <div key={i} className="flex items-center gap-4 justify-center py-4 sm:py-0">
                <IconComponent size={24} className="text-brand-600 shrink-0" />
                <div>
                  <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
