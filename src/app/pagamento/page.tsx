"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { useFlowStore } from "@/lib/store";
import { formatBRL, TAXA_IMPORTACAO } from "@/lib/proposal-utils";
import FlowHeader from "@/components/FlowHeader";
import FlowFooter from "@/components/FlowFooter";
import FlowProgress from "@/components/FlowProgress";
import { CopyIcon, CheckIcon, ClockIcon, ShieldCheckIcon } from "@/components/icons";

const PIX_PAYLOAD =
  "00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540536.405802BR5925KARDBANK PAGAMENTOS LTDA6009SAO PAULO62070503***6304ABCD";

const TIMER_SECONDS = 30 * 60; // 30 minutes

const PROGRESS_LABELS = ["Dados", "Análise", "Proposta", "Pagamento", "Confirmação"];

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
    <div className="min-h-screen bg-white flex flex-col">
      <FlowHeader backHref="/aceita" />
      <FlowProgress currentStep={4} totalSteps={5} labels={PROGRESS_LABELS} />

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          className="max-w-lg mx-auto w-full card-container"
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
              Escaneie o QR Code ou copie o código PIX
            </motion.p>
          </div>

          {/* QR Code */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="bg-white p-4 rounded-2xl shadow-card border border-gray-100 inline-block">
              <QRCodeSVG value={PIX_PAYLOAD} size={200} />
            </div>
          </motion.div>

          {/* Amount box */}
          <motion.div
            className="bg-gray-50 rounded-xl p-4 text-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-2xl font-bold text-gray-900">
              {formatBRL(TAXA_IMPORTACAO)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Importação + Frete
            </p>
          </motion.div>

          {/* Copy PIX button */}
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={handleCopy}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <CheckIcon size={18} className="text-emerald-600" />
                  <span className="text-emerald-600">Copiado!</span>
                </>
              ) : (
                <>
                  <CopyIcon size={18} />
                  Copiar código PIX
                </>
              )}
            </button>
          </motion.div>

          {/* Timer */}
          <motion.div
            className="flex items-center justify-center gap-2 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <ClockIcon size={16} className={secondsLeft <= 300 ? "text-red-500" : "text-gray-400"} />
            <p
              className={`text-lg font-mono font-bold ${
                secondsLeft <= 300 ? "text-red-500" : "text-gray-700"
              }`}
            >
              {formatTime(secondsLeft)}
            </p>
          </motion.div>

          {/* Security */}
          <motion.div
            className="flex items-center justify-center gap-2 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <ShieldCheckIcon size={14} className="text-emerald-600" />
            <p className="text-xs text-emerald-600">
              Pagamento processado em ambiente seguro
            </p>
          </motion.div>

          {/* Simulate payment section */}
          <motion.div
            className="border-t border-gray-100 pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <button
              onClick={handleSimulatePayment}
              disabled={confirming}
              className="w-full py-2.5 text-xs text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-60"
            >
              {confirming ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                  Confirmando...
                </span>
              ) : (
                "Simular Pagamento"
              )}
            </button>
          </motion.div>
        </motion.div>
      </main>

      <FlowFooter />
    </div>
  );
}
