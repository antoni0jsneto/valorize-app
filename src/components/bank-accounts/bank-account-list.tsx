"use client";

import { Card } from "@/components/ui/card";
import { Separator } from "../ui/separator";
import { AccountIcon } from "./account-icon";

interface BankAccount {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  type?: string;
}

interface BankAccountListProps {
  accounts: BankAccount[];
}

export function BankAccountList({ accounts }: BankAccountListProps) {
  return (
    <div className="grid grid-cols-1 gap-1 bg-white rounded-lg px-2">
      {accounts.map((account, index) => {
        const isLastItem = index === accounts.length - 1;

        return (
          <div key={account.id}>
            <Card className="px-4 py-3 flex flex-row items-center gap-4 cursor-pointer transition-colors border-none shadow-none hover:bg-gray-50">
              <AccountIcon
                icon={account.icon}
                iconColor={account.iconColor}
                name={account.name}
                className="h-12 w-12"
              />
              <div>
                <h3 className="font-medium">{account.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {account.type === "WALLET" ? "Carteira" : "Conta"}
                </p>
              </div>
            </Card>
            {!isLastItem && <Separator className="my-2" />}
          </div>
        );
      })}
    </div>
  );
}
