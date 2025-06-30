import type { Metadata } from "next";
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
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
