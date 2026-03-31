import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PeriodProvider } from "@/context/PeriodContext";
import ToastProvider from "@/components/Toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fintrack",
  description: "Controle financeiro pessoal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-zinc-50`}>
        <PeriodProvider>
          <ToastProvider>{children}</ToastProvider>
        </PeriodProvider>
      </body>
    </html>
  );
}
