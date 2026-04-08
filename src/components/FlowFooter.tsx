import { LockIcon } from "@/components/icons";

export default function FlowFooter() {
  return (
    <footer className="py-6 px-4">
      <div className="max-w-2xl mx-auto flex items-center justify-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <LockIcon size={12} />
          <span>Ambiente seguro</span>
        </div>
        <span className="text-gray-300">|</span>
        <span>CNPJ 85.557.385/0001-45</span>
      </div>
    </footer>
  );
}
