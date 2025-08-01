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
import { IncomeModal } from "./income-modal-new";
import { TransferModal } from "./transfer-modal-new";

export function NewTransactionDropdown() {
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  const handleOpenExpenseModal = () => {
    setModalKey((key) => key + 1);
    setExpenseModalOpen(true);
  };

  const handleOpenIncomeModal = () => {
    setModalKey((key) => key + 1);
    setIncomeModalOpen(true);
  };

  const handleOpenTransferModal = () => {
    setModalKey((key) => key + 1);
    setTransferModalOpen(true);
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
      <TransferModal
        key={`transfer-${modalKey}`}
        open={transferModalOpen}
        onOpenChange={setTransferModalOpen}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="blue">
            <Plus className="h-4 w-4" />
            Novo Lançamento
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleOpenExpenseModal}>
            <ArrowDownCircle className="h-4 w-4 text-red-500" />
            Nova Despesa
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenIncomeModal}>
            <ArrowUpCircle className="h-4 w-4 text-green-500" />
            Nova Receita
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenTransferModal}>
            <ArrowLeftRight className="h-4 w-4 text-blue-500" />
            Nova Transferência
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
