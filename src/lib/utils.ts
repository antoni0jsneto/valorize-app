import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toLocalDate(date: string | Date) {
  const d = new Date(date);
  return new Date(d.getTime() + d.getTimezoneOffset() * 60000);
}

export function toUTCDate(date: string | Date) {
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  const utcDate = new Date(d.getTime() - offset * 60000);
  return utcDate;
}