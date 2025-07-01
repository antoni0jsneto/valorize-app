"use client";

import { Input } from "@/components/ui/input";
import { GENERIC_ICONS } from "../icon-map";

interface BankAccount {
  id: string;
  name: string;
}

interface FormFieldsProps {
  selectedIcon: string;
  iconColor: string;
  name: string;
  limit: string;
  closingDay: string;
  dueDay: string;
  bankAccountId: string;
  bankAccounts: BankAccount[];
  onIconColorChange: (color: string) => void;
  onNameChange: (name: string) => void;
  onLimitChange: (limit: string) => void;
  onClosingDayChange: (day: string) => void;
  onDueDayChange: (day: string) => void;
  onBankAccountChange: (accountId: string) => void;
}

export function FormFields({
  selectedIcon,
  iconColor,
  name,
  limit,
  closingDay,
  dueDay,
  bankAccountId,
  bankAccounts,
  onIconColorChange,
  onNameChange,
  onLimitChange,
  onClosingDayChange,
  onDueDayChange,
  onBankAccountChange,
}: FormFieldsProps) {
  return (
    <>
      {selectedIcon in GENERIC_ICONS && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Cor do Ícone</label>
          <Input
            type="color"
            value={iconColor}
            onChange={(e) => onIconColorChange(e.target.value)}
          />
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Nome do Cartão</label>
        <Input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Ex: Nubank Platinum"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Limite</label>
        <Input
          type="number"
          value={limit}
          onChange={(e) => onLimitChange(e.target.value)}
          placeholder="Ex: 5000"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Fecha dia</label>
          <Input
            type="number"
            min="1"
            max="31"
            value={closingDay}
            onChange={(e) => onClosingDayChange(e.target.value)}
            placeholder="Ex: 3"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Vence dia</label>
          <Input
            type="number"
            min="1"
            max="31"
            value={dueDay}
            onChange={(e) => onDueDayChange(e.target.value)}
            placeholder="Ex: 10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Conta para Débito</label>
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={bankAccountId}
          onChange={(e) => onBankAccountChange(e.target.value)}
        >
          <option value="">Selecione uma conta</option>
          {bankAccounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
