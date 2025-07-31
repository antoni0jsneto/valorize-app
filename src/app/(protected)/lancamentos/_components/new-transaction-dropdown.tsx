"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowLeftRight,
} from "lucide-react";
import { ExpenseModal } from "./expense-modal";
import { IncomeModal } from "./income-modal";

export function NewTransactionDropdown() {
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  const handleOpenExpenseModal = () => {
    setModalKey((key) => key + 1);
    setExpenseModalOpen(true);
  };

  const handleOpenIncomeModal = () => {
    setModalKey((key) => key + 1);
    setIncomeModalOpen(true);
  };

  return (
    <>
      <ExpenseModal
        key={`expense-${modalKey}`}
        open={expenseModalOpen}
        onOpenChange={setExpenseModalOpen}
      />
      <IncomeModal
        key={`income-${modalKey}`}
        open={incomeModalOpen}
        onOpenChange={setIncomeModalOpen}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="blue">
            <Plus className="h-4 w-4 mr-2" />
            Novo Lançamento
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleOpenExpenseModal}>
            <ArrowDownCircle className="h-4 w-4 mr-2 text-red-500" />
            Nova Despesa
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenIncomeModal}>
            <ArrowUpCircle className="h-4 w-4 mr-2 text-green-500" />
            Nova Receita
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ArrowLeftRight className="h-4 w-4 mr-2 text-blue-500" />
            Nova Transferência
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
