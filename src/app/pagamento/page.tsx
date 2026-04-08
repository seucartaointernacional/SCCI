"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { useFlowStore } from "@/lib/store";
import { formatBRL, TAXA_IMPORTACAO } from "@/lib/proposal-utils";

const PIX_PAYLOAD =
  "00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540536.405802BR5925KARDBANK PAGAMENTOS LTDA6009SAO PAULO62070503***6304ABCD";

const TIMER_SECONDS = 30 * 60; // 30 minutes

export default function PagamentoPage() {
  const router = useRouter();
  const { paymentId } = useFlowStore();
  const [copied, setCopied] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS);
  const [confirming, setConfirming] = useState(false);

  // Guard: redirect to home if no paymentId
  useEffect(() => {
    if (!paymentId) {
      router.replace("/");
    }
  }, [paymentId, router]);

  // Countdown timer
  useEffect(() => {
    if (!paymentId) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [paymentId]);

  const formatTime = useCallback((totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(PIX_PAYLOAD);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = PIX_PAYLOAD;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleSimulatePayment() {
    if (!paymentId || confirming) return;
    setConfirming(true);
    try {
      const res = await fetch(`/api/payments/${paymentId}/confirm`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Falha ao confirmar pagamento");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push("/confirmacao");
    } catch (err) {
      console.error("Error confirming payment:", err);
      setConfirming(false);
    }
  }

  // Don't render anything while redirecting
  if (!paymentId) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-8">
      <motion.div
        className="card-container w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.h1
            className="text-2xl font-bold text-gray-900 mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Pagamento via PIX
          </motion.h1>
          <motion.p
            className="text-gray-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Escaneie o QR Code ou copie o c&oacute;digo PIX
          </motion.p>
        </div>

        {/* QR Code */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
            <QRCodeSVG value={PIX_PAYLOAD} size={200} />
          </div>
        </motion.div>

        {/* Amount display */}
        <motion.div
          className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-2xl font-bold text-blue-700">
            {formatBRL(TAXA_IMPORTACAO)}
          </p>
          <p className="text-sm text-blue-500 mt-1">
            Importa&ccedil;&atilde;o + Frete
          </p>
        </motion.div>

        {/* Countdown timer */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            Expira em
          </p>
          <p
            className={`text-xl font-mono font-bold ${
              secondsLeft <= 300 ? "text-red-500" : "text-gray-700"
            }`}
          >
            {formatTime(secondsLeft)}
          </p>
        </motion.div>

        {/* Copy PIX button */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={handleCopy}
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <svg
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-green-600">Copiado!</span>
              </>
            ) : (
              <>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copiar c&oacute;digo PIX
              </>
            )}
          </button>
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          className="text-xs text-gray-400 text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          O nome do recebedor pode variar conforme o banco processador.
        </motion.p>

        {/* Simulate payment section */}
        <motion.div
          className="border-t border-gray-200 pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-xs text-gray-400 text-center uppercase tracking-wide mb-4">
            Ambiente de demonstra&ccedil;&atilde;o
          </p>
          <button
            onClick={handleSimulatePayment}
            disabled={confirming}
            className="btn-primary w-full disabled:opacity-60"
          >
            {confirming ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Confirmando...
              </span>
            ) : (
              "Simular Pagamento Confirmado"
            )}
          </button>
        </motion.div>
      </motion.div>
    </main>
  );
}
