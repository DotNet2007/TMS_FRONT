import { Language } from "@/app/interfaces/tasks-interface";


export function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function displayDate(value: string | null | undefined, language: Language): string {
  if (!value) return "—";
  const dateOnlyMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const date = dateOnlyMatch
    ? new Date(Number(dateOnlyMatch[1]), Number(dateOnlyMatch[2]) - 1, Number(dateOnlyMatch[3]))
    : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export function toTaskDate(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? "" : getLocalDateString(date);
}
