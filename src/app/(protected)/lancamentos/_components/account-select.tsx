"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
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

interface AccountSelectProps {
  control: Control<any>;
}

export function AccountSelect({ control }: AccountSelectProps) {
  const { data: accounts, isLoading: isLoadingAccounts } = useAccounts();

  return (
    <FormField
      control={control}
      name="account"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Conta/Cartão</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma conta ou cartão" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {isLoadingAccounts ? (
                <SelectItem value="loading">Carregando...</SelectItem>
              ) : (
                <>
                  <SelectGroup>
                    <SelectLabel className="px-2 py-1.5 text-sm font-semibold">
                      Contas
                    </SelectLabel>
                    {accounts?.map((account) => (
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
                    ))}
                  </SelectGroup>
                  <SelectSeparator className="my-2" />
                  <SelectGroup>
                    <SelectLabel className="px-2 py-1.5 text-sm font-semibold">
                      Cartões de Crédito
                    </SelectLabel>
                    {accounts?.flatMap((account) =>
                      account.creditCards?.map((card) => (
                        <SelectItem key={card.id} value={card.id}>
                          <div className="flex items-center gap-2">
                            <AccountIcon
                              icon={card.icon}
                              iconColor={card.iconColor}
                              name={card.name}
                              className="h-4 w-4"
                            />
                            {card.name}
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectGroup>
                </>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
