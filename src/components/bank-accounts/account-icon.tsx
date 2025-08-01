"use client";

import { Wallet, PiggyBank, Building2 } from "lucide-react";
import Image from "next/image";

// Generic icons that should have background color
export const GENERIC_ICONS = {
  wallet: {
    icon: Wallet,
    name: "Carteira",
    color: "#64748b",
  },
  piggybank: {
    icon: PiggyBank,
    name: "Cofrinho",
    color: "#9C27B0",
  },
  bank: {
    icon: Building2,
    name: "Banco",
    color: "#1976D2",
  },
} as const;

interface AccountIconProps {
  icon: string;
  iconColor?: string;
  name: string;
  className?: string;
}

export function AccountIcon({
  icon,
  iconColor,
  name,
  className = "h-4 w-4",
}: AccountIconProps) {
  // Check if it's a generic icon
  const genericIcon = GENERIC_ICONS[icon as keyof typeof GENERIC_ICONS];

  if (genericIcon) {
    const Icon = genericIcon.icon;
    return (
      <div
        className={`rounded-full flex items-center justify-center ${className}`}
        style={{ backgroundColor: iconColor || genericIcon.color }}
      >
        <Icon className="h-[60%] w-[60%] text-white" />
      </div>
    );
  }

  // If not a generic icon, try to render a bank image
  return (
    <div className={`relative rounded-full overflow-hidden ${className}`}>
      <Image
        src={`/banks/${icon}.png`}
        alt={name}
        fill
        className="object-contain"
      />
    </div>
  );
}
