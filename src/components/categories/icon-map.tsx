"use client";

import * as Icons from "lucide-react";

export const ICON_MAP = {
  // Finance
  wallet: Icons.Wallet,
  "credit-card": Icons.CreditCard,
  "piggy-bank": Icons.PiggyBank,
  "dollar-sign": Icons.DollarSign,
  bank: Icons.Building2,
  receipt: Icons.Receipt,
  "trending-up": Icons.TrendingUp,
  "trending-down": Icons.TrendingDown,

  // Shopping & Entertainment
  "shopping-cart": Icons.ShoppingCart,
  "shopping-bag": Icons.ShoppingBag,
  gift: Icons.Gift,
  tv: Icons.Tv,
  music: Icons.Music,
  film: Icons.Film,
  gamepad: Icons.Gamepad2,

  // Food & Dining
  utensils: Icons.Utensils,
  coffee: Icons.Coffee,
  wine: Icons.Wine,
  pizza: Icons.Pizza,

  // Transportation
  car: Icons.Car,
  bus: Icons.Bus,
  plane: Icons.Plane,
  train: Icons.Train,

  // Home & Utilities
  home: Icons.Home,
  phone: Icons.Phone,
  wifi: Icons.Wifi,
  plug: Icons.Plug,
  lightbulb: Icons.Lightbulb,

  // Health & Wellness
  heart: Icons.Heart,
  activity: Icons.Activity,
  pill: Icons.Pill,
  stethoscope: Icons.Stethoscope,

  // Education
  book: Icons.Book,
  "graduation-cap": Icons.GraduationCap,
  pencil: Icons.Pencil,
  library: Icons.Library,

  // Work & Business
  briefcase: Icons.Briefcase,
  building: Icons.Building,
  mail: Icons.Mail,
  printer: Icons.Printer,

  // Miscellaneous
  star: Icons.Star,
  settings: Icons.Settings,
  tag: Icons.Tag,
  calendar: Icons.Calendar,
  clock: Icons.Clock,
  "alert-circle": Icons.AlertCircle,
  "help-circle": Icons.HelpCircle,
} as const;

export type IconName = keyof typeof ICON_MAP;

interface IconProps {
  name: IconName;
  className?: string;
  style?: React.CSSProperties;
}

export function Icon({ name, ...props }: IconProps) {
  const IconComponent = ICON_MAP[name];
  return IconComponent ? <IconComponent {...props} /> : null;
}
