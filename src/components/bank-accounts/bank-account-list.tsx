"use client";

import { Card } from "@/components/ui/card";
import { bankIcons } from "./icon-map";
import { Wallet, PiggyBank, Building2 } from "lucide-react";
import { Separator } from "../ui/separator";

interface BankAccount {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
}

interface BankAccountListProps {
  accounts: BankAccount[];
}

// Generic icons that should have background color
const GENERIC_ICONS = {
  wallet: Wallet,
  piggybank: PiggyBank,
  bank: Building2,
};

export function BankAccountList({ accounts }: BankAccountListProps) {
  return (
    <div className="grid grid-cols-1 gap-1 bg-white rounded-lg px-2">
      {accounts.map((account, index) => {
        const iconConfig = bankIcons[account.icon as keyof typeof bankIcons];
        const Icon = iconConfig.icon;
        const isGenericIcon = account.icon in GENERIC_ICONS;
        const isLastItem = index === accounts.length - 1;

        return (
          <div key={account.id}>
            <Card className="px-4 flex flex-row items-center gap-4 cursor-pointer transition-colors border-none shadow-none">
              <div
                className="h-12 w-12 rounded-full flex items-center justify-center border ring-1 ring-gray-100"
                style={
                  isGenericIcon
                    ? { backgroundColor: account.iconColor }
                    : undefined
                }
              >
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-medium">{account.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {iconConfig.name}
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
