"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface TransactionsSummaryProps {
  currentBalance: number;
  expectedBalance: number;
  actualIncome: number;
  expectedIncome: number;
  actualExpenses: number;
  expectedExpenses: number;
}

export function TransactionsSummary({
  currentBalance,
  expectedBalance,
  actualIncome,
  expectedIncome,
  actualExpenses,
  expectedExpenses,
}: TransactionsSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    }).format(value);
  };

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Resumo:</CardTitle>
      </CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Saldo Atual</p>
          <p className="text-xl font-medium">
            {formatCurrency(currentBalance)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Saldo Previsto</p>
          <p className="text-xl font-medium">
            {formatCurrency(expectedBalance)}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="mb-2">
              <p className="text-sm text-muted-foreground">Receita Realizada</p>
              <p className="text-lg font-medium text-green-500">
                {formatCurrency(actualIncome)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Receita Prevista</p>
              <p className="text-lg font-medium text-green-500/70">
                {formatCurrency(expectedIncome)}
              </p>
            </div>
          </div>
          <div>
            <div className="mb-2">
              <p className="text-sm text-muted-foreground">Despesa Realizada</p>
              <p className="text-lg font-medium text-red-500">
                {formatCurrency(actualExpenses)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Despesa Prevista</p>
              <p className="text-lg font-medium text-red-500/70">
                {formatCurrency(expectedExpenses)}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
