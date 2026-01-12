import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function getColorByStatus(status: string) {
  if(["success", "positive", "approved", "resolved"].includes(status)) {
    return {light: "var(--color-success-light)", base: "var(--color-success)", foreground: "var(--color-success-foreground)"};
  } else if(["warning", "caution", "medium", "in-review", "pending"].includes(status)) {
    return {light: "var(--color-warning-light)", base: "var(--color-warning)", foreground: "var(--color-warning-foreground)"};
  } else if(["negative", "error", "rejected", "high"].includes(status)) {
    return {light: "var(--color-negative-light)", base: "var(--color-negative)", foreground: "var(--color-negative-foreground)"};
  } else if(["critical"].includes(status)) {
    return {light: "var(--color-critical-light)", base: "var(--color-critical)", foreground: "var(--color-critical-foreground)"};
  } else if(["info", "information", "new"].includes(status)) {
    return {light: "var(--color-info-light)", base: "var(--color-info)", foreground: "var(--color-info-foreground)"};
  } else if(["neutral", "low"].includes(status)) {
    return {light: "var(--color-neutral-light)", base: "var(--color-neutral)", foreground: "var(--color-neutral-foreground)"};
  }
  return {light: "var(--color-neutral-light)", base: "var(--color-neutral)", foreground: "var(--color-neutral-foreground)"};
}

export function formatMoney(value: number, currency: string) {
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}

export function isoToDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function dateToISO(date: Date): string {
  return toISODateLocal(date);
}

function toISODateLocal(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function startOfCurrentMonthISO() {
  const now = new Date();
  return toISODateLocal(new Date(now.getFullYear(), now.getMonth(), 1));
}

export function todayISO() {
  return toISODateLocal(new Date());
}

export function formatDate(isoDate: string) {
  const dt = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(dt.getTime())) return "-";
  return new Intl.DateTimeFormat("pt-BR").format(dt);
}

export function formatDateTime(iso: string) {
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return "-";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(dt);
}