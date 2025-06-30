import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ToasterProvider } from "@/components/providers/toaster-provider";

export const metadata: Metadata = {
  title: "Valorize: Controle suas finanças pessoais e empresariais",
  description:
    "Valorize é um sistema completo de gestão financeira pessoal e empresarial. Controle receitas, despesas, cartões, limites por categoria, contas a pagar e a receber, com relatórios e dashboard inteligente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={GeistSans.className}>
      <body className="antialiased bg-gray-50">
        <AuthProvider>
          {children}
          <ToasterProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
