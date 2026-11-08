export function formatTaskDateTime(
  value: string | Date | null | undefined,
  isArabic: boolean,
): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString(isArabic ? "ar-EG" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase();
}
