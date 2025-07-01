import { Building2, Wallet, PiggyBank } from "lucide-react";
import Image from "next/image";

// Custom bank logo component
const BankLogo = ({ src, alt }: { src: string; alt: string }) => (
  <div className="relative w-10 h-10">
    <Image src={src} alt={alt} fill className="rounded-full object-contain" />
  </div>
);

export const bankIcons = {
  // Generic icons
  wallet: {
    icon: Wallet,
    name: "Carteira",
    color: "#2E7D32", // Dark green
  },
  piggybank: {
    icon: PiggyBank,
    name: "Cofrinho",
    color: "#9C27B0", // Purple
  },
  bank: {
    icon: Building2,
    name: "Banco",
    color: "#1976D2", // Blue
  },

  // Digital Banks
  nubank: {
    icon: () => <BankLogo src="/banks/nubank.pj.png" alt="Nubank" />,
    name: "Nubank",
    color: "#820ad1",
  },
  neon: {
    icon: () => <BankLogo src="/banks/neon.png" alt="Neon" />,
    name: "Neon",
    color: "#00A5F0",
  },
  next: {
    icon: () => <BankLogo src="/banks/next.png" alt="Next" />,
    name: "Next",
    color: "#00FF5F",
  },
  c6: {
    icon: () => <BankLogo src="/banks/c-a.png" alt="C6 Bank" />,
    name: "C6 Bank",
    color: "#242424",
  },
  digio: {
    icon: () => <BankLogo src="/banks/digio.png" alt="Digio" />,
    name: "Digio",
    color: "#0E2579",
  },
  original: {
    icon: () => <BankLogo src="/banks/original.png" alt="Banco Original" />,
    name: "Banco Original",
    color: "#003C7E",
  },
  pan: {
    icon: () => <BankLogo src="/banks/pag.png" alt="Banco Pan" />,
    name: "Banco Pan",
    color: "#0070CE",
  },
  nuconta: {
    icon: () => <BankLogo src="/banks/nuconta.png" alt="NuConta" />,
    name: "NuConta",
    color: "#820ad1",
  },
  rappibank: {
    icon: () => <BankLogo src="/banks/rappi-bank.png" alt="RappiBank" />,
    name: "RappiBank",
    color: "#FF441F",
  },

  // Traditional Banks
  itau: {
    icon: () => <BankLogo src="/banks/itau-uniclass.png" alt="Itaú" />,
    name: "Itaú",
    color: "#EC7000",
  },
  santander: {
    icon: () => <BankLogo src="/banks/santander-private.png" alt="Santander" />,
    name: "Santander",
    color: "#EC0000",
  },
  caixa: {
    icon: () => <BankLogo src="/banks/caixabank.png" alt="Caixa" />,
    name: "Caixa",
    color: "#1B4EA0",
  },
  daycoval: {
    icon: () => <BankLogo src="/banks/daycoval.png" alt="Daycoval" />,
    name: "Daycoval",
    color: "#001E62",
  },
  sicoob: {
    icon: () => <BankLogo src="/banks/sicoob.png" alt="Sicoob" />,
    name: "Sicoob",
    color: "#003641",
  },
  sicredi: {
    icon: () => <BankLogo src="/banks/sicredi.png" alt="Sicredi" />,
    name: "Sicredi",
    color: "#0F2B40",
  },
  mercantilbrasil: {
    icon: () => (
      <BankLogo src="/banks/mercantilbrasil.png" alt="Mercantil do Brasil" />
    ),
    name: "Mercantil do Brasil",
    color: "#00458E",
  },

  // Payment Services
  picpay: {
    icon: () => <BankLogo src="/banks/picpay.png" alt="PicPay" />,
    name: "PicPay",
    color: "#21C25E",
  },
  mercadopago: {
    icon: () => <BankLogo src="/banks/mercadopago.png" alt="Mercado Pago" />,
    name: "Mercado Pago",
    color: "#00B1EA",
  },
  pagbank: {
    icon: () => <BankLogo src="/banks/pagbank.png" alt="PagBank" />,
    name: "PagBank",
    color: "#469E42",
  },
  pagseguro: {
    icon: () => <BankLogo src="/banks/pagseguro.png" alt="PagSeguro" />,
    name: "PagSeguro",
    color: "#469E42",
  },
  paypal: {
    icon: () => <BankLogo src="/banks/paypal.png" alt="PayPal" />,
    name: "PayPal",
    color: "#003087",
  },
  recargapay: {
    icon: () => <BankLogo src="/banks/recargapay.png" alt="RecargaPay" />,
    name: "RecargaPay",
    color: "#FF0000",
  },
  stone: {
    icon: () => <BankLogo src="/banks/stone.png" alt="Stone" />,
    name: "Stone",
    color: "#00B03C",
  },
  sumup: {
    icon: () => <BankLogo src="/banks/sumup.png" alt="SumUp" />,
    name: "SumUp",
    color: "#0B2138",
  },
  wise: {
    icon: () => <BankLogo src="/banks/wise.png" alt="Wise" />,
    name: "Wise",
    color: "#00B9FF",
  },
  celcoin: {
    icon: () => <BankLogo src="/banks/celcoin.png" alt="Celcoin" />,
    name: "Celcoin",
    color: "#00A5EF",
  },

  // Credit Cards & Benefits
  alelo: {
    icon: () => <BankLogo src="/banks/alelo.png" alt="Alelo" />,
    name: "Alelo",
    color: "#009CD7",
  },
  sodexo: {
    icon: () => <BankLogo src="/banks/sodexo.png" alt="Sodexo" />,
    name: "Sodexo",
    color: "#FF585D",
  },
  ticket: {
    icon: () => <BankLogo src="/banks/ticket.png" alt="Ticket" />,
    name: "Ticket",
    color: "#F58220",
  },
  vr: {
    icon: () => <BankLogo src="/banks/vr.png" alt="VR" />,
    name: "VR",
    color: "#00ABC8",
  },
  caju: {
    icon: () => <BankLogo src="/banks/caju.png" alt="Caju" />,
    name: "Caju",
    color: "#FF7A00",
  },

  // Investment & Crypto
  xp: {
    icon: () => <BankLogo src="/banks/xp.png" alt="XP Investimentos" />,
    name: "XP Investimentos",
    color: "#F7B600",
  },
  rico: {
    icon: () => <BankLogo src="/banks/rico.png" alt="Rico" />,
    name: "Rico",
    color: "#00D1B2",
  },
  nuinvest: {
    icon: () => <BankLogo src="/banks/nu-invest.png" alt="Nu Invest" />,
    name: "Nu Invest",
    color: "#820AD1",
  },
  toroinvestimentos: {
    icon: () => (
      <BankLogo src="/banks/toroinvestimentos.png" alt="Toro Investimentos" />
    ),
    name: "Toro Investimentos",
    color: "#0A2238",
  },
  cryptocom: {
    icon: () => <BankLogo src="/banks/crypto-com.png" alt="Crypto.com" />,
    name: "Crypto.com",
    color: "#002D74",
  },

  // Retail & Services
  magalupay: {
    icon: () => <BankLogo src="/banks/magalu-pay.png" alt="MagaluPay" />,
    name: "MagaluPay",
    color: "#0086FF",
  },
  carrefour: {
    icon: () => <BankLogo src="/banks/carrefour.png" alt="Carrefour" />,
    name: "Carrefour",
    color: "#004EA8",
  },
  renner: {
    icon: () => <BankLogo src="/banks/renner.png" alt="Renner" />,
    name: "Renner",
    color: "#CF2B1F",
  },
  riachuelo: {
    icon: () => <BankLogo src="/banks/riachuelo.png" alt="Riachuelo" />,
    name: "Riachuelo",
    color: "#0046BE",
  },
  ca: {
    icon: () => <BankLogo src="/banks/c-a.png" alt="C&A" />,
    name: "C&A",
    color: "#E62E39",
  },
  capay: {
    icon: () => <BankLogo src="/banks/c-a-pay.png" alt="C&A Pay" />,
    name: "C&A Pay",
    color: "#E62E39",
  },
  ifoodcard: {
    icon: () => <BankLogo src="/banks/ifood-beneficios.png" alt="iFood Card" />,
    name: "iFood Card",
    color: "#EA1D2C",
  },
  ifoodconta: {
    icon: () => (
      <BankLogo src="/banks/ifood-conta-digital.png" alt="iFood Conta" />
    ),
    name: "iFood Conta",
    color: "#EA1D2C",
  },
} as const;

export type BankIconType = keyof typeof bankIcons;
