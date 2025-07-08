"use client";

import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

interface SummaryData {
  saldoAnterior: number;
  receitaRealizada: number;
  receitaPrevista: number;
  despesaRealizada: number;
  despesaPrevista: number;
  saldo: number;
  previsto: number;
}

const mockSummaryData: SummaryData = {
  saldoAnterior: 15133.66,
  receitaRealizada: 0.0,
  receitaPrevista: 25350.0,
  despesaRealizada: 0.0,
  despesaPrevista: -25056.49,
  saldo: 15133.66,
  previsto: 6861.07,
};

export function TransactionsSummary() {
  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border mb-4">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-green-600 font-medium">
              Entenda seu saldo
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 text-gray-400"
            >
              <HelpCircle className="h-3 w-3" />
            </Button>
          </div>

          <div className="space-y-2 text-right min-w-[200px]">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">saldo anterior</span>
              <span className="font-medium">
                {formatCurrency(mockSummaryData.saldoAnterior)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">receita realizada</span>
              <span className="text-green-600 font-medium">
                {formatCurrency(mockSummaryData.receitaRealizada)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">receita prevista</span>
              <span className="text-gray-400">
                {formatCurrency(mockSummaryData.receitaPrevista)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">despesa realizada</span>
              <span className="text-red-600 font-medium">
                {formatCurrency(mockSummaryData.despesaRealizada)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">despesa prevista</span>
              <span className="text-gray-400">
                {formatCurrency(mockSummaryData.despesaPrevista)}
              </span>
            </div>

            <div className="border-t pt-2 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm font-medium">saldo</span>
                <span className="text-blue-600 font-bold text-lg">
                  {formatCurrency(mockSummaryData.saldo)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">previsto</span>
                <span className="text-gray-400">
                  {formatCurrency(mockSummaryData.previsto)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
