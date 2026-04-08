"use client";

import { motion } from "framer-motion";

interface CreditCardProps {
  nome: string;
  bandeira: string;
  corPrimaria: string;
  corSecundaria: string;
  corTexto: string;
  holderName?: string;
}

function VisaLogo({ color }: { color: string }) {
  return (
    <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
      <text
        x="0"
        y="17"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        fontStyle="italic"
        fontSize="22"
        fill={color}
      >
        VISA
      </text>
    </svg>
  );
}

function MastercardLogo() {
  return (
    <svg width="48" height="30" viewBox="0 0 48 30">
      <circle cx="16" cy="15" r="14" fill="#eb001b" />
      <circle cx="32" cy="15" r="14" fill="#f79e1b" />
      <path
        d="M24 3.6a13.93 13.93 0 0 0-5.2 11.4A13.93 13.93 0 0 0 24 26.4a13.93 13.93 0 0 0 5.2-11.4A13.93 13.93 0 0 0 24 3.6z"
        fill="#ff5f00"
      />
    </svg>
  );
}

function Chip() {
  return (
    <svg width="46" height="34" viewBox="0 0 46 34">
      <rect
        x="1"
        y="1"
        width="44"
        height="32"
        rx="5"
        ry="5"
        fill="url(#chipGrad)"
        stroke="#b8860b"
        strokeWidth="1"
      />
      <defs>
        <linearGradient id="chipGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e6c84f" />
          <stop offset="40%" stopColor="#f5e27a" />
          <stop offset="60%" stopColor="#d4a928" />
          <stop offset="100%" stopColor="#e6c84f" />
        </linearGradient>
      </defs>
      {/* Horizontal lines */}
      <line x1="1" y1="12" x2="45" y2="12" stroke="#b8860b" strokeWidth="0.5" />
      <line x1="1" y1="22" x2="45" y2="22" stroke="#b8860b" strokeWidth="0.5" />
      {/* Vertical lines */}
      <line x1="15" y1="1" x2="15" y2="33" stroke="#b8860b" strokeWidth="0.5" />
      <line x1="31" y1="1" x2="31" y2="33" stroke="#b8860b" strokeWidth="0.5" />
      {/* Center rectangle */}
      <rect
        x="15"
        y="12"
        width="16"
        height="10"
        fill="none"
        stroke="#b8860b"
        strokeWidth="0.5"
      />
    </svg>
  );
}

export default function CreditCard({
  nome,
  bandeira,
  corPrimaria,
  corSecundaria,
  corTexto,
  holderName = "SEU NOME AQUI",
}: CreditCardProps) {
  const isVisa = bandeira.toLowerCase() === "visa";

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -15 }}
      animate={{ opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      style={{ perspective: 1000 }}
    >
      <div
        className="relative w-full overflow-hidden rounded-2xl select-none"
        style={{
          aspectRatio: "1.586 / 1",
          background: `linear-gradient(135deg, ${corPrimaria} 0%, ${corSecundaria} 100%)`,
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 12px 24px -8px rgba(0, 0, 0, 0.3)",
          color: corTexto,
          maxWidth: 420,
        }}
      >
        {/* Decorative background circles */}
        <div
          className="absolute rounded-full"
          style={{
            width: "70%",
            height: "140%",
            top: "-40%",
            right: "-20%",
            background: `radial-gradient(circle, ${corSecundaria}33 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "50%",
            height: "100%",
            bottom: "-30%",
            left: "-10%",
            background: `radial-gradient(circle, ${corPrimaria}44 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "30%",
            height: "60%",
            top: "10%",
            right: "30%",
            background: `radial-gradient(circle, ${corTexto}08 0%, transparent 60%)`,
          }}
        />

        {/* Card content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-6">
          {/* Top row: product name + bandeira */}
          <div className="flex items-start justify-between">
            <span
              className="text-sm font-semibold tracking-wide"
              style={{ color: corTexto, opacity: 0.9 }}
            >
              {nome}
            </span>
            <div className="flex items-center">
              {isVisa ? <VisaLogo color={corTexto} /> : <MastercardLogo />}
            </div>
          </div>

          {/* Chip */}
          <div className="mt-1">
            <Chip />
          </div>

          {/* Card number */}
          <div
            className="mt-3 font-mono text-lg tracking-[0.25em]"
            style={{ color: corTexto }}
          >
            &bull;&bull;&bull;&bull;&ensp;&bull;&bull;&bull;&bull;&ensp;&bull;&bull;&bull;&bull;&ensp;&bull;&bull;&bull;&bull;
          </div>

          {/* Bottom row: holder name + international label */}
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p
                className="text-[10px] uppercase tracking-wider"
                style={{ color: corTexto, opacity: 0.6 }}
              >
                Titular
              </p>
              <p
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: corTexto }}
              >
                {holderName.toUpperCase()}
              </p>
            </div>
            <span
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: corTexto, opacity: 0.7 }}
            >
              International
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
