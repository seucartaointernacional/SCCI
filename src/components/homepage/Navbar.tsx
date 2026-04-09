"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MenuIcon, XIcon } from "@/components/icons";

const navLinks = [
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Beneficios", href: "#beneficios" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Duvidas", href: "#duvidas" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 bg-white/80 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-lg font-bold text-gray-900 tracking-tight">
            Seu Cartao{" "}
            <span className="text-brand-600">Internacional</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <Link
          href="/solicitar"
          className="hidden md:inline-flex btn-primary text-sm py-2.5 px-6"
        >
          Solicitar Cartao
        </Link>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Abrir menu"
        >
          <MenuIcon size={24} />
        </button>
      </nav>

      {/* Mobile slide-in panel */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Panel */}
          <div className="absolute top-0 right-0 w-72 h-full bg-white shadow-elevated flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="text-lg font-bold text-gray-900 tracking-tight">
                Menu
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Fechar menu"
              >
                <XIcon size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-1 p-4 flex-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-brand-50 px-4 py-3 rounded-xl transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100">
              <Link
                href="/solicitar"
                className="btn-primary w-full text-sm py-3"
                onClick={() => setMobileOpen(false)}
              >
                Solicitar Cartao
              </Link>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </header>
  );
}
