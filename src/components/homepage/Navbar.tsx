"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MenuIcon, XIcon } from "@/components/icons";

const navLinks = [
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Benefícios", href: "#beneficios" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Equipe", href: "#equipe" },
  { label: "Dúvidas", href: "#duvidas" },
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
      className={`sticky top-0 z-50 bg-white border-b transition-shadow duration-300 ${
        scrolled ? "shadow-sm border-gray-200" : "border-gray-100"
      }`}
    >
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between"
      >
        <Link href="/" className="shrink-0">
          <span className="text-lg font-extrabold text-gray-900 tracking-tight">
            Seu Cartão{" "}
            <span className="text-brand-600">Internacional</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <Link
          href="/solicitar"
          className="hidden md:inline-flex btn-primary text-sm py-2.5 px-6"
        >
          Solicitar Cartão
        </Link>

        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 text-gray-600"
          aria-label="Abrir menu"
        >
          <MenuIcon size={24} />
        </button>
      </motion.nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 right-0 w-72 h-full bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="font-bold text-gray-900">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-gray-400"
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
                  className="text-base font-medium text-gray-700 hover:text-brand-600 px-4 py-3 rounded-lg transition-colors"
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
                Solicitar Cartão
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
