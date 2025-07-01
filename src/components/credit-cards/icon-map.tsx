import { CreditCard, Wallet } from "lucide-react";
import Image, { ImageProps } from "next/image";

// Generic icons that should have background color
export const GENERIC_ICONS = {
  creditcard: CreditCard,
  wallet: Wallet,
};

export const creditCardIcons = {
  // Generic icons
  creditcard: {
    name: "Cartão Genérico",
    icon: CreditCard,
  },
  wallet: {
    name: "Carteira",
    icon: Wallet,
  },

  // Bank specific credit cards
  nubank: {
    name: "Nubank",
    icon: (props: Omit<ImageProps, "src" | "alt" | "width" | "height">) => (
      <Image
        src="/banks/nubank.png"
        alt="Nubank"
        width={24}
        height={24}
        {...props}
      />
    ),
  },
  itau: {
    name: "Itaú",
    icon: (props: Omit<ImageProps, "src" | "alt" | "width" | "height">) => (
      <Image
        src="/banks/itau.png"
        alt="Itaú"
        width={24}
        height={24}
        {...props}
      />
    ),
  },
  bradesco: {
    name: "Bradesco",
    icon: (props: Omit<ImageProps, "src" | "alt" | "width" | "height">) => (
      <Image
        src="/banks/bradesco.png"
        alt="Bradesco"
        width={24}
        height={24}
        {...props}
      />
    ),
  },
  santander: {
    name: "Santander",
    icon: (props: Omit<ImageProps, "src" | "alt" | "width" | "height">) => (
      <Image
        src="/banks/santander.png"
        alt="Santander"
        width={24}
        height={24}
        {...props}
      />
    ),
  },
  "banco-do-brasil": {
    name: "Banco do Brasil",
    icon: (props: Omit<ImageProps, "src" | "alt" | "width" | "height">) => (
      <Image
        src="/banks/bb.png"
        alt="Banco do Brasil"
        width={24}
        height={24}
        {...props}
      />
    ),
  },
  caixa: {
    name: "Caixa",
    icon: (props: Omit<ImageProps, "src" | "alt" | "width" | "height">) => (
      <Image
        src="/banks/caixa.png"
        alt="Caixa"
        width={24}
        height={24}
        {...props}
      />
    ),
  },
  inter: {
    name: "Inter",
    icon: (props: Omit<ImageProps, "src" | "alt" | "width" | "height">) => (
      <Image
        src="/banks/intermedium.png"
        alt="Inter"
        width={24}
        height={24}
        {...props}
      />
    ),
  },
  c6bank: {
    name: "C6 Bank",
    icon: (props: Omit<ImageProps, "src" | "alt" | "width" | "height">) => (
      <Image
        src="/banks/c6bank.png"
        alt="C6 Bank"
        width={24}
        height={24}
        {...props}
      />
    ),
  },
  pan: {
    name: "Pan",
    icon: (props: Omit<ImageProps, "src" | "alt" | "width" | "height">) => (
      <Image src="/banks/pan.png" alt="Pan" width={24} height={24} {...props} />
    ),
  },
  next: {
    name: "Next",
    icon: (props: Omit<ImageProps, "src" | "alt" | "width" | "height">) => (
      <Image
        src="/banks/next.png"
        alt="Next"
        width={24}
        height={24}
        {...props}
      />
    ),
  },
};
