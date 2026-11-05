import { UsageFilters, Lang, UsageQueryParams } from "../interfaces/ai-usage-interface";


export const EMPTY_USAGE_FILTERS: UsageFilters = {
  userId: "",
  model: "",
  operation: "",
  status: "",
  from: "",
  to: "",
};

export function formatNumber(value: number | null | undefined): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value ?? 0);
}

export function formatUsd(value: number | null | undefined): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 4,
  }).format(value ?? 0);
}

export function formatDuration(
  value: number | null | undefined,
  lang: Lang,
): string {
  if (value == null) return "—";
  return lang === "ar"
    ? `${formatNumber(value)} ث`
    : `${formatNumber(value)} s`;
}

export function formatDateTime(value: string, lang: Lang): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function buildUsageQueryString(params: UsageQueryParams): string {
  const query = new URLSearchParams({
    days: params.days,
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.userId) query.set("userId", params.userId);
  if (params.model) query.set("model", params.model);
  if (params.operation) query.set("operation", params.operation);
  if (params.status) query.set("status", params.status);

  if (params.from) {
    query.set("from", params.from);
  }

  if (params.to) {
    query.set("to", params.to)
  }

  return query.toString();
}

export function getUsageErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (!error || typeof error !== "object") return fallback;

  const apiError = error as {
    data?: { error?: string; message?: string };
    error?: string;
  };

  return (
    apiError.data?.error ||
    apiError.data?.message ||
    apiError.error ||
    fallback
  );
}
