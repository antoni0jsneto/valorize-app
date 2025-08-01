"use client";

// ... (mantenha os imports existentes)
import { AccountIcon } from "@/components/bank-accounts/account-icon";

// ... (mantenha o código até o FormField de fromAccount)

<FormField
  control={form.control}
  name="fromAccount"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Saiu da conta</FormLabel>
      <Select
        onValueChange={field.onChange}
        defaultValue={field.value}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a conta de origem" />
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

<FormField
  control={form.control}
  name="toAccount"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Entrou na conta</FormLabel>
      <Select
        onValueChange={field.onChange}
        defaultValue={field.value}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a conta de destino" />
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

// ... (mantenha o resto do código igual)