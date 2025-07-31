"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, ArrowDownCircle, ArrowUpCircle, ArrowLeftRight } from "lucide-react";
import { ExpenseModal } from "./expense-modal";

export function NewTransactionDropdown() {
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);

  return (
    <>
      <ExpenseModal open={expenseModalOpen} onOpenChange={setExpenseModalOpen} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="blue">
            <Plus className="h-4 w-4 mr-2" />
            Novo Lançamento
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setExpenseModalOpen(true)}>
            <ArrowDownCircle className="h-4 w-4 mr-2 text-red-500" />
            Nova Despesa
          </DropdownMenuItem>
          <DropdownMenuItem>
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