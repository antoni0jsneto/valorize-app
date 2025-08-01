"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAccounts } from "./use-accounts";
import { AccountIcon } from "@/components/bank-accounts/account-icon";
import { Control } from "react-hook-form";

interface TransferAccountSelectProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
}

export function TransferAccountSelect({
  control,
  name,
  label,
  placeholder,
}: TransferAccountSelectProps) {
  const { data: accounts, isLoading: isLoadingAccounts } = useAccounts();

  // Filtra apenas contas bancárias (não inclui cartões de crédito)
  const bankAccounts = accounts?.filter((account) => {
    // Considera como conta bancária se a conta existe e tem um ID
    const isValid = !!account && !!account.id;
    return isValid;
  });

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {isLoadingAccounts ? (
                <SelectItem value="loading">Carregando...</SelectItem>
              ) : bankAccounts && bankAccounts.length > 0 ? (
                bankAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center gap-2">
                      <AccountIcon
                        icon={account.icon}
                        iconColor={account.iconColor}
                        name={account.name}
                        className="h-4 w-4"
                      />
                      {account.name}
                    </div>
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="empty" disabled>
                  Nenhuma conta disponível
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
