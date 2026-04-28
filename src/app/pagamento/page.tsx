"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useFlowStore } from "@/lib/store";
import { formatBRL } from "@/lib/proposal-utils";
import FlowHeader from "@/components/FlowHeader";
import FlowFooter from "@/components/FlowFooter";
import FlowProgress from "@/components/FlowProgress";
import { CopyIcon, CheckIcon, ClockIcon, ShieldCheckIcon } from "@/components/icons";

const TIMER_SECONDS = 30 * 60; // 30 minutes
const POLL_INTERVAL_MS = 3000;

const PROGRESS_LABELS = ["Dados", "Análise", "Proposta", "Etapa Final", "Confirmação"];

interface PaymentData {
  id: string;
  valor: number;
  status: string;
  pixCopyPaste: string | null;
  pixQrCode: string | null;
}

export default function PagamentoPage() {
  const router = useRouter();
  const { paymentId } = useFlowStore();
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS);
  const [confirming, setConfirming] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Guard: redirect to home if no paymentId.
  useEffect(() => {
    if (!paymentId) {
      router.replace("/");
    }
  }, [paymentId, router]);

  // Initial load + polling.
  useEffect(() => {
    if (!paymentId) return;
    let cancelled = false;

    async function fetchPayment() {
      try {
        const res = await fetch(`/api/payments/${paymentId}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data: PaymentData = await res.json();
        if (cancelled) return;
        setPayment(data);
        setLoadError(false);
        if (data.status === "pago") {
          if (pollingRef.current) clearInterval(pollingRef.current);
          router.push("/confirmacao");
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Error fetching payment:", err);
        // Only show the error UI if we have nothing to display yet.
        setPayment((current) => {
          if (!current) setLoadError(true);
          return current;
        });
      }
    }

    fetchPayment();
    pollingRef.current = setInterval(fetchPayment, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [paymentId, router]);

  // Countdown.
  useEffect(() => {
    if (!paymentId) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (pollingRef.current) clearInterval(pollingRef.current);
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
    if (!payment?.pixCopyPaste) return;
    try {
      await navigator.clipboard.writeText(payment.pixCopyPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = payment.pixCopyPaste;
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
      const res = await fetch(`/api/payments/${paymentId}/confirm`, { method: "POST" });
      if (!res.ok) throw new Error("Falha ao confirmar pagamento");
      // Confirmation email is sent server-side; polling will pick up the status flip.
      // Forcing a navigation for snappier UX.
      router.push("/confirmacao");
    } catch (err) {
      console.error("Error confirming payment:", err);
      setConfirming(false);
    }
  }

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
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Pagamento via PIX</h1>
            <p className="text-gray-500 text-sm">Escaneie o QR Code ou copie o código PIX</p>
          </div>

          {loadError && !payment && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-sm text-red-700 mb-3">
                Não foi possível carregar o pagamento. Tente novamente.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary text-sm"
              >
                Recarregar
              </button>
            </div>
          )}

          {!payment && !loadError && (
            <div className="flex flex-col items-center py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />
              <p className="mt-4 text-sm text-gray-500">Gerando QR Code...</p>
            </div>
          )}

          {payment && payment.pixQrCode && (
            <>
              <div className="flex justify-center mb-6">
                <div className="bg-white p-4 rounded-2xl shadow-card border border-gray-100 inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={payment.pixQrCode} alt="QR Code PIX" width={220} height={220} />
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-center mb-6">
                <p className="text-2xl font-bold text-gray-900">{formatBRL(payment.valor)}</p>
                <p className="text-sm text-gray-500 mt-1">Importação + Frete</p>
              </div>

              <div className="mb-4">
                <button
                  onClick={handleCopy}
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                  disabled={!payment.pixCopyPaste}
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
              </div>

              <div className="flex items-center justify-center gap-2 mb-4">
                <ClockIcon size={16} className={secondsLeft <= 300 ? "text-red-500" : "text-gray-400"} />
                <p
                  className={`text-lg font-mono font-bold ${
                    secondsLeft <= 300 ? "text-red-500" : "text-gray-700"
                  }`}
                >
                  {formatTime(secondsLeft)}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 mb-6">
                <ShieldCheckIcon size={14} className="text-emerald-600" />
                <p className="text-xs text-emerald-600">Pagamento processado em ambiente seguro</p>
              </div>

              <div className="border-t border-gray-100 pt-6">
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
              </div>
            </>
          )}
        </motion.div>
      </main>

      <FlowFooter />
    </div>
  );
}
