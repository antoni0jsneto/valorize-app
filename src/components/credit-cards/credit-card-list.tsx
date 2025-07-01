"use client";

import { Card } from "@/components/ui/card";
import { creditCardIcons, GENERIC_ICONS } from "./icon-map";
import { Separator } from "../ui/separator";

interface CreditCard {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  limit: number;
  closingDay: number;
  dueDay: number;
  bankAccount: {
    name: string;
  };
}

interface CreditCardListProps {
  cards: CreditCard[];
}

export function CreditCardList({ cards }: CreditCardListProps) {
  return (
    <div className="grid grid-cols-1 gap-1 bg-white rounded-lg px-2">
      {cards.map((card, index) => {
        const iconConfig =
          creditCardIcons[card.icon as keyof typeof creditCardIcons];
        const Icon = iconConfig.icon;
        const isGenericIcon = card.icon in GENERIC_ICONS;
        const isLastItem = index === cards.length - 1;

        return (
          <div key={card.id}>
            <Card className="px-4 flex flex-row items-center gap-4 cursor-pointer transition-colors border-none shadow-none">
              <div
                className="h-12 w-12 rounded-full flex items-center justify-center"
                style={
                  isGenericIcon
                    ? { backgroundColor: card.iconColor }
                    : undefined
                }
              >
                <Icon className="w-8 h-8 rounded-full" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{card.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {iconConfig.name}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(card.limit)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Fecha dia {card.closingDay}, vence dia {card.dueDay}
                </p>
                <p className="text-sm text-muted-foreground">
                  Débito em {card.bankAccount.name}
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
