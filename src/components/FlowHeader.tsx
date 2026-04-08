"use client";

import Link from "next/link";
import { ArrowLeftIcon, ShieldCheckIcon } from "@/components/icons";

interface FlowHeaderProps {
  showBack?: boolean;
  backHref?: string;
}

export default function FlowHeader({ showBack = true, backHref = "/" }: FlowHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <Link
              href={backHref}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 -ml-1"
            >
              <ArrowLeftIcon size={20} />
            </Link>
          )}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              Seu Cartao{" "}
              <span className="text-brand-600">Internacional</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-600">
          <ShieldCheckIcon size={16} />
          <span className="text-xs font-medium hidden sm:inline">Ambiente seguro</span>
        </div>
      </div>
    </header>
  );
}
