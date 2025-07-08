"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, HandCoins } from "lucide-react";
import { useRouter } from "next/navigation";
import { FaChartPie } from "react-icons/fa";

export default function Home() {
  const router = useRouter();

  function handleRegister() {
    router.push("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="container mx-auto py-6 px-4">
        <div className="flex items-center">
          <div className="flex items-center text-green-500 font-bold text-xl">
            <FaChartPie className="text-emerald-500 flex-shrink-0 text-3xl mr-2" />
            <h1 className="text-xl font-bold tracking-tight text-emerald-600 whitespace-nowrap">
              Valorize
              <span className="text-emerald-500 font-extrabold">App</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="max-w-3xl mx-auto">
            <div className="text-center space-y-6">
              <div className="inline-block bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-medium mb-2">
                Plataforma para gerenciar suas finanças
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
                Gerencie suas finanças com facilidade e rapidez
              </h1>

              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Acompanhe suas finanças, contas a pagar, contas a receber e
                investimentos de qualquer lugar.
              </p>

              <div className="pt-4">
                <form action={handleRegister}>
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-green-500 hover:bg-green-600 text-white font-medium px-8 h-12 cursor-pointer"
                  >
                    Começar agora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
