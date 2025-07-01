"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { creditCardIcons, GENERIC_ICONS } from "../icon-map";

interface IconSelectorProps {
  selectedIcon: string;
  iconColor: string;
  onSelectIcon: (icon: string) => void;
}

export function IconSelector({
  selectedIcon,
  iconColor,
  onSelectIcon,
}: IconSelectorProps) {
  return (
    <ScrollArea className="h-72 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">
          Ícones Genéricos
        </h4>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(GENERIC_ICONS).map(([key]) => {
            const iconConfig =
              creditCardIcons[key as keyof typeof creditCardIcons];
            const Icon = iconConfig.icon;
            const isSelected = selectedIcon === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelectIcon(key)}
                className={`p-2 rounded-lg flex flex-col items-center gap-1 hover:bg-muted transition-colors ${
                  isSelected ? "bg-muted" : ""
                }`}
              >
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: iconColor }}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs text-center">{iconConfig.name}</span>
              </button>
            );
          })}
        </div>

        <h4 className="mb-4 mt-6 text-sm font-medium leading-none">
          Cartões de Bancos
        </h4>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(creditCardIcons)
            .filter(([key]) => !(key in GENERIC_ICONS))
            .map(([key]) => {
              const iconConfig =
                creditCardIcons[key as keyof typeof creditCardIcons];
              const Icon = iconConfig.icon;
              const isSelected = selectedIcon === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onSelectIcon(key)}
                  className={`p-2 rounded-lg flex flex-col items-center gap-1 hover:bg-muted transition-colors ${
                    isSelected ? "bg-muted" : ""
                  }`}
                >
                  <div className="h-10 w-10 rounded-full flex items-center justify-center bg-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs text-center">{iconConfig.name}</span>
                </button>
              );
            })}
        </div>
      </div>
    </ScrollArea>
  );
}
