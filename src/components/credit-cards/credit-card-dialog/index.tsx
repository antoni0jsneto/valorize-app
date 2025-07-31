"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { accountsQueryKey } from "@/app/(protected)/lancamentos/_components/use-accounts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconSelector } from "./icon-selector";
import { FormFields } from "./form-fields";
import { Plus } from "lucide-react";

interface BankAccount {
  id: string;
  name: string;
}

interface CreditCardDialogProps {
  bankAccounts: BankAccount[];
}

export function CreditCardDialog({ bankAccounts }: CreditCardDialogProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string>("creditcard");
  const [iconColor, setIconColor] = useState<string>("#000000");
  const [name, setName] = useState("");
  const [limit, setLimit] = useState("");
  const [closingDay, setClosingDay] = useState("");
  const [dueDay, setDueDay] = useState("");
  const [bankAccountId, setBankAccountId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      const response = await fetch("/api/credit-cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          icon: selectedIcon,
          iconColor,
          limit: parseFloat(limit),
          closingDay: parseInt(closingDay),
          dueDay: parseInt(dueDay),
          bankAccountId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create credit card");
      }

      await queryClient.invalidateQueries({ queryKey: accountsQueryKey });
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="blue">
          <Plus className="h-4 w-4" />
          Adicionar Cartão
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Cartão de Crédito</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Ícone</label>
            <IconSelector
              selectedIcon={selectedIcon}
              iconColor={iconColor}
              onSelectIcon={setSelectedIcon}
            />
          </div>

          <FormFields
            selectedIcon={selectedIcon}
            iconColor={iconColor}
            name={name}
            limit={limit}
            closingDay={closingDay}
            dueDay={dueDay}
            bankAccountId={bankAccountId}
            bankAccounts={bankAccounts}
            onIconColorChange={setIconColor}
            onNameChange={setName}
            onLimitChange={setLimit}
            onClosingDayChange={setClosingDay}
            onDueDayChange={setDueDay}
            onBankAccountChange={setBankAccountId}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Criando..." : "Criar Cartão"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
