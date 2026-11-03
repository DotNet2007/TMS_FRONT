"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileText,
  RefreshCw,
  Search,
  Server,
  ShieldAlert,
  X,
} from "lucide-react";
import { useDashboardLayout } from "@/app/components/DashboardLayout";

type LogEntry = {
  timestamp: string | null;
  level: string;
  message: string;
  requestId: string | null;
  method: string | null;
  endpoint: string | null;
  statusCode: number | null;
  durationMs: number | null;
  userId: string | null;
  stack: string | null;
  raw: Record<string, unknown>;
};

type LogsResponse = {
  logs: LogEntry[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};

type Lang = "ar" | "en";

const translations = {
  en: {
    title: "System Logs",
    subtitle: "Inspect API activity, investigate errors, and trace requests.",
    refresh: "Refresh",
    search: "Search logs",
    searchPlaceholder: "Message, endpoint, user ID...",
    level: "Severity",
    allLevels: "All levels",
    info: "Info",
    warn: "Warning",
    error: "Error",
    requestId: "Request ID",
    requestIdPlaceholder: "Paste a request ID",
    from: "From",
    to: "To",
    apply: "Apply filters",
    clear: "Clear",
    total: "Matching logs",
    errors: "Errors on this page",
    warnings: "Warnings on this page",
    infoCount: "Info on this page",
    latest: "Log entries",
    timestamp: "Timestamp",
    severity: "Level",
    message: "Message",
    endpoint: "Endpoint",
    status: "Status",
    duration: "Duration",
    user: "User ID",
    actions: "Details",
    view: "View details",
    noLogs: "No log entries match these filters.",
    loading: "Loading logs...",
    loadError: "Unable to load logs.",
    page: "Page",
    of: "of",
    previous: "Previous",
    next: "Next",
    details: "Log details",
    requestDetails: "Request details",
    metadata: "Full metadata",
    stack: "Stack trace",
    close: "Close",
    noStack: "No stack trace was recorded.",
    noValue: "—",
    copyId: "Request ID",
    copied: "Copy",
    statusCode: "Status code",
    method: "Method",
    unknown: "Unknown",
  },
  ar: {
    title: "سجلات النظام",
    subtitle: "راجع نشاط الواجهات البرمجية، وافحص الأخطاء، وتتبع الطلبات.",
    refresh: "تحديث",
    search: "البحث في السجلات",
    searchPlaceholder: "الرسالة أو المسار أو معرف المستخدم...",
    level: "مستوى الخطورة",
    allLevels: "كل المستويات",
    info: "معلومات",
    warn: "تحذير",
    error: "خطأ",
    requestId: "معرف الطلب",
    requestIdPlaceholder: "أدخل معرف الطلب",
    from: "من",
    to: "إلى",
    apply: "تطبيق الفلاتر",
    clear: "مسح",
    total: "السجلات المطابقة",
    errors: "الأخطاء في الصفحة",
    warnings: "التحذيرات في الصفحة",
    infoCount: "المعلومات في الصفحة",
    latest: "السجلات",
    timestamp: "التوقيت",
    severity: "المستوى",
    message: "الرسالة",
    endpoint: "المسار",
    status: "الحالة",
    duration: "المدة",
    user: "معرف المستخدم",
    actions: "التفاصيل",
    view: "عرض التفاصيل",
    noLogs: "لا توجد سجلات تطابق عوامل التصفية.",
    loading: "جارٍ تحميل السجلات...",
    loadError: "تعذر تحميل السجلات.",
    page: "صفحة",
    of: "من",
    previous: "السابق",
    next: "التالي",
    details: "تفاصيل السجل",
    requestDetails: "تفاصيل الطلب",
    metadata: "البيانات الكاملة",
    stack: "تتبع الخطأ",
    close: "إغلاق",
    noStack: "لا يوجد تتبع خطأ مسجل.",
    noValue: "—",
    copyId: "معرف الطلب",
    copied: "نسخ",
    statusCode: "رمز الحالة",
    method: "الطريقة",
    unknown: "غير معروف",
  },
} as const;

function formatNumber(value: number | null | undefined) {
  return new Intl.NumberFormat("en-US").format(value ?? 0);
}

function formatDate(value: string | null, lang: Lang) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-US", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(date);
}

function levelStyle(level: string, dark: boolean) {
  const value = level.toLowerCase();
  if (value === "error")
    return dark
      ? "bg-red-950/60 text-red-300 ring-red-900"
      : "bg-red-50 text-red-700 ring-red-200";
  if (value === "warn" || value === "warning")
    return dark
      ? "bg-amber-950/60 text-amber-300 ring-amber-900"
      : "bg-amber-50 text-amber-700 ring-amber-200";
  return dark
    ? "bg-sky-950/60 text-sky-300 ring-sky-900"
    : "bg-sky-50 text-sky-700 ring-sky-200";
}

export default function LogsPage() {
  const { lang, isArabic, darkMode } = useDashboardLayout();
  const t = translations[lang as Lang] ?? translations.en;
  const [data, setData] = useState<LogsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [requestIdInput, setRequestIdInput] = useState("");
  const [levelInput, setLevelInput] = useState("");
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    requestId: "",
    level: "",
    from: "",
    to: "",
  });
  const [page, setPage] = useState(1);
  const limit = 50;

  const isDark = darkMode;
  const panel = isDark
    ? "border-slate-800 bg-slate-900"
    : "border-slate-100 bg-white";
  const muted = isDark ? "text-slate-400" : "text-slate-500";
  const heading = isDark ? "text-slate-100" : "text-slate-800";
  const tableLine = isDark ? "border-slate-800" : "border-slate-100";
  const field = isDark
    ? "border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500"
    : "border-slate-200 bg-white text-slate-800 placeholder:text-slate-400";

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("userToken");
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (filters.level) params.set("level", filters.level);
      if (filters.requestId) params.set("requestId", filters.requestId);
      if (filters.search) params.set("search", filters.search);
      if (filters.from) {
        params.set("from", new Date(`${filters.from}T00:00:00`).toISOString());
      }
      if (filters.to) {
        params.set("to", new Date(`${filters.to}T23:59:59.999`).toISOString());
      }

      const response = await fetch(
        `${API_BASE_URL}/ai-usage/logs?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        },
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          typeof result.message === "string"
            ? result.message
            : typeof result.error === "string"
              ? result.error
              : t.loadError,
        );
      }
      setData(result as LogsResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.loadError);
    } finally {
      setLoading(false);
    }
  }, [filters, page, t.loadError]);

  useEffect(() => {
    void loadLogs();
  }, [loadLogs]);

  const counts = useMemo(() => {
    const logs = data?.logs ?? [];
    return {
      errors: logs.filter((log) => log.level.toLowerCase() === "error").length,
      warnings: logs.filter((log) =>
        ["warn", "warning"].includes(log.level.toLowerCase()),
      ).length,
      info: logs.filter((log) => log.level.toLowerCase() === "info").length,
    };
  }, [data]);

  function applyFilters(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setFilters({
      search: searchInput.trim(),
      requestId: requestIdInput.trim(),
      level: levelInput,
      from: fromInput,
      to: toInput,
    });
  }

  function clearFilters() {
    setSearchInput("");
    setRequestIdInput("");
    setLevelInput("");
    setFromInput("");
    setToInput("");
    setFilters({ search: "", requestId: "", level: "", from: "", to: "" });
    setPage(1);
  }

  const cards = [
    {
      label: t.total,
      value: formatNumber(data?.pagination.totalItems),
      detail: `${t.page} ${data?.pagination.page ?? 1} ${t.of} ${data?.pagination.totalPages ?? 1}`,
      icon: FileText,
      tone: "text-[#47759c]",
      iconBg: "bg-[#edf3f7]",
    },
    {
      label: t.errors,
      value: formatNumber(counts.errors),
      detail: t.latest,
      icon: ShieldAlert,
      tone: "text-red-500",
      iconBg: isDark ? "bg-red-950/50" : "bg-red-50",
    },
    {
      label: t.warnings,
      value: formatNumber(counts.warnings),
      detail: t.latest,
      icon: AlertTriangle,
      tone: "text-amber-500",
      iconBg: isDark ? "bg-amber-950/50" : "bg-amber-50",
    },
    {
      label: t.infoCount,
      value: formatNumber(counts.info),
      detail: t.latest,
      icon: CheckCircle2,
      tone: "text-[#219da5]",
      iconBg: isDark ? "bg-teal-950/50" : "bg-teal-50",
    },
  ];

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className={`min-h-full space-y-6 ${heading}`}
    >
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div
            className={`mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide ${muted}`}
          >
            <Server size={15} className="text-[#2eb5bc]" /> NTRA · SYSTEM
            MONITORING
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-[28px]">
            {t.title}
          </h1>
          <p className={`mt-2 text-sm ${muted}`}>{t.subtitle}</p>
        </div>
        <button
          onClick={() => void loadLogs()}
          disabled={loading}
          className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl bg-[#47759c] px-4 text-sm font-semibold text-white transition hover:bg-[#3e688b] disabled:opacity-60 sm:self-auto"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          {t.refresh}
        </button>
      </header>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, detail, icon: Icon, tone, iconBg }) => (
          <article
            key={label}
            className={`rounded-2xl border p-5 shadow-sm shadow-slate-900/[0.02] ${panel}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className={`grid h-11 w-11 place-items-center rounded-xl ${iconBg} ${tone}`}
              >
                <Icon size={20} />
              </div>
              <Activity size={16} className={muted} />
            </div>
            <p className={`mt-5 text-sm ${muted}`}>{label}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight tabular-nums">
              {loading && !data ? "—" : value}
            </p>
            <p className={`mt-2 text-xs ${muted}`}>{detail}</p>
          </article>
        ))}
      </section>

      <section
        className={`rounded-2xl border p-5 shadow-sm shadow-slate-900/[0.02] ${panel}`}
      >
        <div className="mb-4">
          <h2 className="font-bold">{t.search}</h2>
          <p className={`mt-1 text-xs ${muted}`}>
            Filter by severity, request, date, or matching text.
          </p>
        </div>
        <form
          onSubmit={applyFilters}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6"
        >
          <label className="space-y-1.5 xl:col-span-2">
            <span className={`block text-xs font-medium ${muted}`}>
              {t.search}
            </span>
            <div className="relative">
              <Search
                size={16}
                className={`pointer-events-none absolute top-3 ${isArabic ? "right-3" : "left-3"} ${muted}`}
              />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t.searchPlaceholder}
                className={`h-10 w-full rounded-xl border ${isArabic ? "pr-9 pl-3" : "pl-9 pr-3"} text-sm outline-none focus:border-[#47759c] ${field}`}
              />
            </div>
          </label>
          <label className="space-y-1.5">
            <span className={`block text-xs font-medium ${muted}`}>
              {t.level}
            </span>
            <select
              value={levelInput}
              onChange={(e) => setLevelInput(e.target.value)}
              className={`h-10 w-full rounded-xl border px-3 text-sm outline-none focus:border-[#47759c] ${field}`}
            >
              <option value="">{t.allLevels}</option>
              <option value="info">{t.info}</option>
              <option value="warn">{t.warn}</option>
              <option value="error">{t.error}</option>
            </select>
          </label>
          <label className="space-y-1.5 xl:col-span-2">
            <span className={`block text-xs font-medium ${muted}`}>
              {t.requestId}
            </span>
            <input
              value={requestIdInput}
              onChange={(e) => setRequestIdInput(e.target.value)}
              placeholder={t.requestIdPlaceholder}
              className={`h-10 w-full rounded-xl border px-3 text-sm outline-none focus:border-[#47759c] ${field}`}
            />
          </label>
          <label className="space-y-1.5">
            <span className={`block text-xs font-medium ${muted}`}>
              {t.from}
            </span>
            <input
              type="date"
              value={fromInput}
              onChange={(e) => setFromInput(e.target.value)}
              className={`h-10 w-full rounded-xl border px-3 text-sm outline-none focus:border-[#47759c] ${field}`}
            />
          </label>
          <label className="space-y-1.5">
            <span className={`block text-xs font-medium ${muted}`}>{t.to}</span>
            <input
              type="date"
              value={toInput}
              onChange={(e) => setToInput(e.target.value)}
              min={fromInput || undefined}
              className={`h-10 w-full rounded-xl border px-3 text-sm outline-none focus:border-[#47759c] ${field}`}
            />
          </label>
          <div className="flex items-end gap-2 xl:col-span-6">
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#47759c] px-4 text-sm font-semibold text-white transition hover:bg-[#3e688b]"
            >
              <Search size={15} /> {t.apply}
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className={`h-10 rounded-xl border px-4 text-sm font-semibold transition hover:bg-slate-500/[0.06] ${tableLine} ${muted}`}
            >
              {t.clear}
            </button>
          </div>
        </form>
      </section>

      <section
        className={`overflow-hidden rounded-2xl border shadow-sm shadow-slate-900/[0.02] ${panel}`}
      >
        <div
          className={`flex flex-col justify-between gap-2 border-b px-5 py-4 sm:flex-row sm:items-center ${tableLine}`}
        >
          <div>
            <h2 className="font-bold">{t.latest}</h2>
            <p className={`mt-1 text-xs ${muted}`}>
              {formatNumber(data?.pagination.totalItems)}{" "}
              {t.total.toLowerCase()}
            </p>
          </div>
          <span className={`text-xs ${muted}`}>
            {t.page} {data?.pagination.page ?? page} {t.of}{" "}
            {data?.pagination.totalPages ?? 1}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-start text-sm">
            <thead
              className={
                isDark
                  ? "bg-slate-950/60 text-slate-400"
                  : "bg-slate-50 text-slate-500"
              }
            >
              <tr>
                {[
                  t.timestamp,
                  t.severity,
                  t.message,
                  t.endpoint,
                  t.status,
                  t.duration,
                  t.user,
                  t.actions,
                ].map((item) => (
                  <th
                    key={item}
                    className="px-4 py-3 text-start text-xs font-semibold"
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.logs.map((log, index) => (
                <tr
                  key={`${log.requestId ?? "log"}-${log.timestamp ?? index}-${index}`}
                  className={`border-t ${tableLine} transition hover:bg-slate-500/[0.04]`}
                >
                  <td
                    className={`whitespace-nowrap px-4 py-3 text-xs ${muted}`}
                  >
                    {formatDate(log.timestamp, lang as Lang)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ring-1 ring-inset ${levelStyle(log.level, isDark)}`}
                    >
                      {log.level}
                    </span>
                  </td>
                  <td className="max-w-[280px] px-4 py-3">
                    <div className="truncate font-medium" title={log.message}>
                      {log.message || t.noValue}
                    </div>
                    {log.requestId && (
                      <div
                        className={`mt-1 max-w-[260px] truncate font-mono text-[10px] ${muted}`}
                        title={log.requestId}
                      >
                        {log.requestId}
                      </div>
                    )}
                  </td>
                  <td className="max-w-[220px] px-4 py-3">
                    <div className="truncate font-medium">
                      {log.method ?? ""} {log.endpoint ?? t.noValue}
                    </div>
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {log.statusCode == null ? (
                      t.noValue
                    ) : (
                      <span
                        className={`font-semibold ${log.statusCode >= 500 ? "text-red-500" : log.statusCode >= 400 ? "text-amber-500" : "text-emerald-500"}`}
                      >
                        {log.statusCode}
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 tabular-nums">
                    {log.durationMs == null
                      ? t.noValue
                      : `${formatNumber(log.durationMs)} ms`}
                  </td>
                  <td
                    className="max-w-[150px] truncate px-4 py-3 font-mono text-xs"
                    title={log.userId ?? ""}
                  >
                    {log.userId ?? t.noValue}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="whitespace-nowrap rounded-lg border border-[#47759c]/30 px-3 py-1.5 text-xs font-semibold text-[#47759c] transition hover:bg-[#47759c]/10"
                    >
                      {t.view}
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && !error && data?.logs.length === 0 && (
                <tr>
                  <td colSpan={8} className={`px-5 py-14 text-center ${muted}`}>
                    {t.noLogs}
                  </td>
                </tr>
              )}
              {loading && !data && (
                <tr>
                  <td colSpan={8} className={`px-5 py-14 text-center ${muted}`}>
                    {t.loading}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div
          className={`flex flex-col items-center justify-between gap-3 border-t px-5 py-4 sm:flex-row ${tableLine}`}
        >
          <p className={`text-xs ${muted}`}>
            {t.page} {data?.pagination.page ?? page} {t.of}{" "}
            {Math.max(1, data?.pagination.totalPages ?? 1)}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className={`h-9 rounded-lg border px-3 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${tableLine} ${muted}`}
            >
              {t.previous}
            </button>
            <button
              disabled={page >= (data?.pagination.totalPages ?? 1) || loading}
              onClick={() => setPage((current) => current + 1)}
              className={`h-9 rounded-lg border px-3 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${tableLine} ${muted}`}
            >
              {t.next}
            </button>
          </div>
        </div>
      </section>

      {selectedLog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedLog(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="log-details-title"
            className={`max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl border shadow-2xl ${panel}`}
          >
            <div
              className={`flex items-center justify-between border-b px-5 py-4 ${tableLine}`}
            >
              <div>
                <h2 id="log-details-title" className="font-bold">
                  {t.details}
                </h2>
                <p className={`mt-1 text-xs ${muted}`}>
                  {formatDate(selectedLog.timestamp, lang as Lang)}
                </p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                aria-label={t.close}
                className={`grid h-9 w-9 place-items-center rounded-lg transition hover:bg-slate-500/10 ${muted}`}
              >
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[calc(90vh-72px)] space-y-5 overflow-y-auto p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize ring-1 ring-inset ${levelStyle(selectedLog.level, isDark)}`}
                >
                  {selectedLog.level}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs ${isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}
                >
                  {selectedLog.statusCode ?? t.noValue}
                </span>
                {selectedLog.durationMs != null && (
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}
                  >
                    {selectedLog.durationMs} ms
                  </span>
                )}
              </div>

              <div>
                <p className={`mb-1 text-xs font-semibold ${muted}`}>
                  {t.message}
                </p>
                <p className="break-words text-sm font-medium">
                  {selectedLog.message || t.noValue}
                </p>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-bold">{t.requestDetails}</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    [t.requestId, selectedLog.requestId],
                    [t.method, selectedLog.method],
                    [t.endpoint, selectedLog.endpoint],
                    [t.statusCode, selectedLog.statusCode?.toString() ?? null],
                    [
                      t.duration,
                      selectedLog.durationMs == null
                        ? null
                        : `${selectedLog.durationMs} ms`,
                    ],
                    [t.user, selectedLog.userId],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className={`rounded-xl border p-3 ${tableLine}`}
                    >
                      <p className={`text-[11px] ${muted}`}>{label}</p>
                      <p className="mt-1 break-all text-sm font-medium">
                        {value || t.noValue}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedLog.stack && (
                <div>
                  <h3 className="mb-2 text-sm font-bold">{t.stack}</h3>
                  <pre
                    className={`max-h-72 overflow-auto rounded-xl p-4 text-xs leading-6 ${isDark ? "bg-slate-950 text-red-300" : "bg-slate-950 text-red-200"}`}
                  >
                    {selectedLog.stack}
                  </pre>
                </div>
              )}

              <div>
                <h3 className="mb-2 text-sm font-bold">{t.metadata}</h3>
                <pre
                  className={`max-h-80 overflow-auto rounded-xl p-4 text-xs leading-6 ${isDark ? "bg-slate-950 text-slate-300" : "bg-slate-900 text-slate-200"}`}
                >
                  {JSON.stringify(selectedLog.raw, null, 2)}
                </pre>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
