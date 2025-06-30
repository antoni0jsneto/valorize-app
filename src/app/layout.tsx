import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { AppSidebar } from "@/components/app-sidebar";
import "./globals.css";

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
        <div className="flex min-h-screen">
          <AppSidebar />
          <main className="flex-1">
            <div className="container mx-auto p-4 pt-20 md:pt-3">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
