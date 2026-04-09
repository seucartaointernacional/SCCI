import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Seu Cartão Internacional | Cartão de Crédito Internacional sem Burocracia",
  description:
    "Solicite seu cartão de crédito internacional em minutos. Aceitamos negativados. Processo 100% online com entrega em todo o Brasil. CNPJ 85.557.385/0001-45.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={plusJakarta.variable}>
      <body className={`${plusJakarta.className} min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
