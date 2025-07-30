"use client";

import { PageContainer } from "@/components/page-container";
import { TransactionsHeader } from "./_components/transactions-header";
import { TransactionsList } from "./_components/transactions-list";
import { TransactionsSummary } from "./_components/transactions-summary";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { ExpenseModal } from "./_components/expense-modal";

export default function LancamentosPage() {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  return (
    <div className="flex-1 w-full">
      <TransactionsHeader />
      <PageContainer>
        <div className="space-y-6">
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className=" h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setIsExpenseModalOpen(true)}>
                  Nova despesa
                </DropdownMenuItem>
                <DropdownMenuItem>Nova receita</DropdownMenuItem>
                <DropdownMenuItem>Nova transferência</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <TransactionsList />
          <TransactionsSummary />
        </div>
      </PageContainer>

      <ExpenseModal
        open={isExpenseModalOpen}
        onOpenChange={setIsExpenseModalOpen}
      />
    </div>
  );
}
