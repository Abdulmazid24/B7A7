import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

export function formatDate(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return "N/A";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function getStatusBadgeClasses(status: string): string {
  const normalized = status.toUpperCase();
  switch (normalized) {
    case "ACTIVE":
    case "COMPLETED":
    case "PAID":
    case "ENROLLED":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400";
    case "PENDING":
    case "PARTIALLY_PAID":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400";
    case "BLOCKED":
    case "SUSPENDED":
    case "FAILED":
    case "OVERDUE":
    case "DROPPED":
    case "WITHDRAWN":
      return "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400";
    default:
      return "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400";
  }
}

export function getGradeBadgeClasses(grade: string): string {
  if (["A+", "A", "A-"].includes(grade)) {
    return "bg-emerald-500/15 text-emerald-600 font-semibold";
  }
  if (["B+", "B", "B-"].includes(grade)) {
    return "bg-blue-500/15 text-blue-600 font-semibold";
  }
  if (["C+", "C", "D"].includes(grade)) {
    return "bg-amber-500/15 text-amber-600 font-semibold";
  }
  return "bg-rose-500/15 text-rose-600 font-semibold";
}
