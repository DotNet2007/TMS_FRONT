"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Bot,
  Coins,
  RefreshCw,
  Clock3,
  Users,
  Zap,
  AlertCircle,
  CalendarRange,
  ChevronDown,
} from "lucide-react";
import { useDashboardLayout } from "@/app/components/DashboardLayout";

type UsageUser = {
  user_id: string;
  user_email?: string | null;
  requests: number;
  prompt_tokens: number;
  response_tokens: number;
  total_tokens: number;
  estimated_cost_usd: number;
  average_duration_seconds: number | null;
};
type UsageEvent = {
  timestamp: string;
  request_id?: string | null;
  user_id: string;
  user_email?: string | null;
  endpoint?: string | null;
  stage: string;
  model: string;
  duration_seconds: number;
  prompt_tokens?: number | null;
  response_tokens?: number | null;
  thoughts_tokens?: number | null;
  cached_tokens?: number | null;
  total_tokens?: number | null;
  estimated_cost_usd?: number | null;
  usage_available: boolean;
  status: string;
};
type UsageResponse = {
  period_days: number;
  generated_at: string;
  summary: {
    api_calls: number;
    users: number;
    total_tokens: number;
    estimated_cost_usd: number;
    average_duration_seconds: number | null;
    pricing_configured: boolean;
  };
  users: UsageUser[];
  events: UsageEvent[];
  pagination?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};
type Lang = "ar" | "en";

const translations = {
  en: {
    title: "AI Usage & Cost",
    subtitle: "Monitor model consumption, response time, and estimated spend.",
    refresh: "Refresh",
    last7: "Last 7 days",
    last30: "Last 30 days",
    last90: "Last 90 days",
    calls: "Model calls",
    users: "Active users",
    tokens: "Tokens consumed",
    cost: "Estimated cost",
    avgLatency: "Average model time",
    userUsage: "Usage by user",
    recent: "Recent model activity",
    user: "User",
    requests: "Calls",
    inputTokens: "Input tokens",
    outputTokens: "Output tokens",
    totalTokens: "Total tokens",
    avgTime: "Avg. time",
    estimatedCost: "Est. cost (USD)",
    time: "Time",
    model: "Model / stage",
    status: "Status",
    noData: "No usage records found for this period.",
    loading: "Loading AI usage…",
    error: "Unable to load usage data.",
    pricingWarning:
      "Token usage is being recorded, but prices are not configured. Estimated costs will show $0 until you set the Gemini pricing environment variables.",
    noUser: "Unattributed user",
    success: "Success",
    failed: "Failed",
    unavailable: "Usage metadata unavailable",
    total: "Total",
    events: "events",
    filters: "Filters",
    applyFilters: "Apply filters",
    clearFilters: "Clear",
    page: "Page",
    limit: "Rows per page",
    userId: "User ID",
    operation: "Operation",
    allStatuses: "All statuses",
    from: "From",
    to: "To",
    previous: "Previous",
    next: "Next",
    pageOf: "of",
  },
  ar: {
    title: "استهلاك الذكاء الاصطناعي والتكلفة",
    subtitle: "تابع استهلاك النماذج ووقت الاستجابة والتكلفة التقديرية.",
    refresh: "تحديث",
    last7: "آخر 7 أيام",
    last30: "آخر 30 يومًا",
    last90: "آخر 90 يومًا",
    calls: "عدد استدعاءات النموذج",
    users: "المستخدمون النشطون",
    tokens: "إجمالي التوكنز",
    cost: "التكلفة التقديرية",
    avgLatency: "متوسط وقت الاستجابة",
    userUsage: "الاستهلاك حسب المستخدم",
    recent: "أحدث عمليات النموذج",
    user: "المستخدم",
    requests: "الاستدعاءات",
    inputTokens: "توكنز الإدخال",
    outputTokens: "توكنز الإخراج",
    totalTokens: "إجمالي التوكنز",
    avgTime: "متوسط الوقت",
    estimatedCost: "التكلفة المقدرة (دولار)",
    time: "الوقت",
    model: "النموذج / المرحلة",
    status: "الحالة",
    noData: "لا توجد سجلات استخدام في الفترة المحددة.",
    loading: "جارٍ تحميل بيانات الاستخدام…",
    error: "تعذر تحميل بيانات الاستخدام.",
    pricingWarning:
      "يتم تسجيل التوكنز، لكن أسعار النموذج غير مضبوطة. ستظهر التكلفة بصفر حتى تضبط متغيرات أسعار Gemini.",
    noUser: "مستخدم غير محدد",
    success: "ناجح",
    failed: "فشل",
    unavailable: "بيانات التوكنز غير متاحة",
    total: "الإجمالي",
    events: "عملية",
    filters: "عوامل التصفية",
    applyFilters: "تطبيق التصفية",
    clearFilters: "مسح",
    page: "الصفحة",
    limit: "عدد السجلات",
    userId: "معرف المستخدم",
    operation: "العملية",
    allStatuses: "كل الحالات",
    from: "من",
    to: "إلى",
    previous: "السابق",
    next: "التالي",
    pageOf: "من",
  },
} as const;

function number(value: number | null | undefined) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(
    value ?? 0,
  );
}
function usd(value: number | null | undefined) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 4,
  }).format(value ?? 0);
}
function duration(value: number | null | undefined, lang: Lang) {
  if (value == null) return "—";
  return lang === "ar" ? `${number(value)} ث` : `${number(value)} s`;
}
function dateTime(value: string, lang: Lang) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function AiUsagePage() {
  const { lang, isArabic, darkMode } = useDashboardLayout();
  const t = translations[lang as Lang] ?? translations.en;
  const [days, setDays] = useState("30");
  const [activityPage, setActivityPage] = useState(1);
  const activityLimit = 50;
  const [filterInputs, setFilterInputs] = useState({
    userId: "",
    model: "",
    operation: "",
    status: "",
    from: "",
    to: "",
  });
  const [filters, setFilters] = useState({
    userId: "",
    model: "",
    operation: "",
    status: "",
    from: "",
    to: "",
  });
  const [data, setData] = useState<UsageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsage = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("userToken");
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

      const params = new URLSearchParams({ days });
      params.set("page", String(activityPage));
      params.set("limit", String(activityLimit));

      if (filters.userId) params.set("userId", filters.userId);
      if (filters.model) params.set("model", filters.model);
      if (filters.operation) params.set("operation", filters.operation);
      if (filters.status) params.set("status", filters.status);
      if (filters.from) {
        params.set("from", new Date(`${filters.from}T00:00:00`).toISOString());
      }
      if (filters.to) {
        params.set("to", new Date(`${filters.to}T23:59:59.999`).toISOString());
      }

      const response = await fetch(
        `${API_BASE_URL}/ai-usage?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        },
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || t.error);
      setData(result as UsageResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.error);
    } finally {
      setLoading(false);
    }
  }, [days, filters, activityPage, t.error]);

  useEffect(() => {
    void loadUsage();
  }, [loadUsage]);

  const isDark = darkMode;
  const panel = isDark
    ? "border-slate-800 bg-slate-900"
    : "border-slate-100 bg-white";
  const muted = isDark ? "text-slate-400" : "text-slate-500";
  const heading = isDark ? "text-slate-100" : "text-slate-800";
  const tableLine = isDark ? "border-slate-800" : "border-slate-100";
  const totalUserCost = useMemo(
    () =>
      data?.users.reduce((sum, user) => sum + user.estimated_cost_usd, 0) ?? 0,
    [data],
  );

  const cards = [
    {
      label: t.calls,
      value: number(data?.summary.api_calls),
      detail: `${number(data?.summary.users)} ${t.users.toLowerCase()}`,
      icon: Activity,
      color: "text-[#47759c]",
      bg: "bg-[#edf3f7]",
    },
    {
      label: t.tokens,
      value: number(data?.summary.total_tokens),
      detail: `${number(data?.summary.api_calls)} ${t.events}`,
      icon: Zap,
      color: "text-[#219da5]",
      bg: "bg-[#e8f8f8]",
    },
    {
      label: t.cost,
      value: usd(data?.summary.estimated_cost_usd),
      detail: data?.summary.pricing_configured
        ? t.estimatedCost
        : "Pricing not configured",
      icon: Coins,
      color: "text-[#47759c]",
      bg: "bg-[#edf3f7]",
    },
    {
      label: t.avgLatency,
      value: duration(data?.summary.average_duration_seconds, lang as Lang),
      detail: "Gemini API duration",
      icon: Clock3,
      color: "text-[#219da5]",
      bg: "bg-[#e8f8f8]",
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
            <Bot size={15} className="text-[#2eb5bc]" /> NTRA · AI ANALYTICS
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-[28px]">
            {t.title}
          </h1>
          <p className={`mt-2 text-sm ${muted}`}>{t.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label
            className={`flex h-10 items-center gap-2 rounded-xl border px-3 text-sm ${panel} ${muted}`}
          >
            <CalendarRange size={16} />
            <select
              aria-label="Usage period"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className={`max-w-36 bg-transparent outline-none ${heading}`}
            >
              <option value="7">{t.last7}</option>
              <option value="30">{t.last30}</option>
              <option value="90">{t.last90}</option>
            </select>
            <ChevronDown size={14} />
          </label>
          <button
            onClick={() => void loadUsage()}
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#47759c] px-4 text-sm font-semibold text-white transition hover:bg-[#3e688b] disabled:opacity-60"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />{" "}
            {t.refresh}
          </button>
        </div>
      </header>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" /> {error}
        </div>
      )}

      {data && !data.summary.pricing_configured && (
        <div
          className={`rounded-xl border p-4 text-sm ${isDark ? "border-amber-900 bg-amber-950/40 text-amber-200" : "border-amber-200 bg-amber-50 text-amber-900"}`}
        >
          {t.pricingWarning}
        </div>
      )}

      <section
        className={`rounded-2xl border p-5 shadow-sm shadow-slate-900/[0.02] ${panel}`}
      >
        <div className="mb-4">
          <h2 className="font-bold">{t.filters}</h2>
          <p className={`mt-1 text-xs ${muted}`}>
            Filter AI usage records using the parameters supported by the API.
          </p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            setActivityPage(1);
            setFilters({ ...filterInputs });
          }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
        >
          <label className="space-y-1.5">
            <span className={`block text-xs font-medium ${muted}`}>
              {t.userId}
            </span>
            <input
              value={filterInputs.userId}
              onChange={(event) =>
                setFilterInputs((current) => ({
                  ...current,
                  userId: event.target.value,
                }))
              }
              placeholder="User ID"
              className={`h-10 w-full rounded-xl border px-3 text-sm outline-none focus:border-[#47759c] ${isDark ? "border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500" : "border-slate-200 bg-white text-slate-800 placeholder:text-slate-400"}`}
            />
          </label>

          <label className="space-y-1.5">
            <span className={`block text-xs font-medium ${muted}`}>
              {t.model}
            </span>
            <input
              value={filterInputs.model}
              onChange={(event) =>
                setFilterInputs((current) => ({
                  ...current,
                  model: event.target.value,
                }))
              }
              placeholder="e.g. gemini-2.5-flash"
              className={`h-10 w-full rounded-xl border px-3 text-sm outline-none focus:border-[#47759c] ${isDark ? "border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500" : "border-slate-200 bg-white text-slate-800 placeholder:text-slate-400"}`}
            />
          </label>

          <label className="space-y-1.5">
            <span className={`block text-xs font-medium ${muted}`}>
              {t.operation}
            </span>
            <input
              value={filterInputs.operation}
              onChange={(event) =>
                setFilterInputs((current) => ({
                  ...current,
                  operation: event.target.value,
                }))
              }
              placeholder="e.g. task_matching"
              className={`h-10 w-full rounded-xl border px-3 text-sm outline-none focus:border-[#47759c] ${isDark ? "border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500" : "border-slate-200 bg-white text-slate-800 placeholder:text-slate-400"}`}
            />
          </label>

          <label className="space-y-1.5">
            <span className={`block text-xs font-medium ${muted}`}>
              {t.status}
            </span>
            <select
              value={filterInputs.status}
              onChange={(event) =>
                setFilterInputs((current) => ({
                  ...current,
                  status: event.target.value,
                }))
              }
              className={`h-10 w-full rounded-xl border px-3 text-sm outline-none focus:border-[#47759c] ${isDark ? "border-slate-700 bg-slate-950 text-slate-100" : "border-slate-200 bg-white text-slate-800"}`}
            >
              <option value="">{t.allStatuses}</option>
              <option value="success">{t.success}</option>
              <option value="failed">{t.failed}</option>
            </select>
          </label>

          <label className="space-y-1.5">
            <span className={`block text-xs font-medium ${muted}`}>
              {t.from}
            </span>
            <input
              type="date"
              value={filterInputs.from}
              onChange={(event) =>
                setFilterInputs((current) => ({
                  ...current,
                  from: event.target.value,
                }))
              }
              className={`h-10 w-full rounded-xl border px-3 text-sm outline-none focus:border-[#47759c] ${isDark ? "border-slate-700 bg-slate-950 text-slate-100" : "border-slate-200 bg-white text-slate-800"}`}
            />
          </label>

          <label className="space-y-1.5">
            <span className={`block text-xs font-medium ${muted}`}>{t.to}</span>
            <input
              type="date"
              min={filterInputs.from || undefined}
              value={filterInputs.to}
              onChange={(event) =>
                setFilterInputs((current) => ({
                  ...current,
                  to: event.target.value,
                }))
              }
              className={`h-10 w-full rounded-xl border px-3 text-sm outline-none focus:border-[#47759c] ${isDark ? "border-slate-700 bg-slate-950 text-slate-100" : "border-slate-200 bg-white text-slate-800"}`}
            />
          </label>

          <div className="flex items-end gap-2 sm:col-span-2 xl:col-span-4">
            <button
              type="submit"
              className="h-10 rounded-xl bg-[#47759c] px-4 text-sm font-semibold text-white transition hover:bg-[#3e688b]"
            >
              {t.applyFilters}
            </button>
            <button
              type="button"
              onClick={() => {
                const empty = {
                  userId: "",
                  model: "",
                  operation: "",
                  status: "",
                  from: "",
                  to: "",
                };
                setFilterInputs(empty);
                setActivityPage(1);
                setFilters(empty);
              }}
              className={`h-10 rounded-xl border px-4 text-sm font-semibold transition hover:bg-slate-500/[0.06] ${tableLine} ${muted}`}
            >
              {t.clearFilters}
            </button>
          </div>
        </form>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, detail, icon: Icon, color, bg }) => (
          <article
            key={label}
            className={`rounded-2xl border p-5 shadow-sm shadow-slate-900/[0.02] ${panel}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className={`grid h-11 w-11 place-items-center rounded-xl ${bg} ${color}`}
              >
                <Icon size={20} />
              </div>
              <span className={`mt-1 text-[11px] ${muted}`}>
                {days === "7" ? t.last7 : days === "90" ? t.last90 : t.last30}
              </span>
            </div>
            <p className={`mt-5 text-sm ${muted}`}>{label}</p>
            <p className="mt-1 break-words text-2xl font-bold tracking-tight">
              {loading && !data ? "—" : value}
            </p>
            <p className={`mt-2 text-xs ${muted}`}>{detail}</p>
          </article>
        ))}
      </section>

      <section
        className={`overflow-hidden rounded-2xl border shadow-sm shadow-slate-900/[0.02] ${panel}`}
      >
        <div
          className={`flex items-center justify-between border-b px-5 py-4 ${tableLine}`}
        >
          <div>
            <h2 className="font-bold">{t.userUsage}</h2>
            <p className={`mt-1 text-xs ${muted}`}>
              {t.total}: {usd(totalUserCost)}
            </p>
          </div>
          <Users size={19} className="text-[#2eb5bc]" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-start text-sm">
            <thead
              className={
                isDark
                  ? "bg-slate-950/60 text-slate-400"
                  : "bg-slate-50 text-slate-500"
              }
            >
              <tr>
                {[
                  t.user,
                  t.requests,
                  t.inputTokens,
                  t.outputTokens,
                  t.totalTokens,
                  t.avgTime,
                  t.estimatedCost,
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-3 text-start text-xs font-semibold"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.users.map((user) => (
                <tr
                  key={user.user_id}
                  className={`border-t ${tableLine} transition hover:bg-slate-500/[0.04]`}
                >
                  <td className="px-5 py-4">
                    <div className="font-semibold">
                      {user.user_email ||
                        (user.user_id === "unattributed"
                          ? t.noUser
                          : user.user_id)}
                    </div>
                    {user.user_email && (
                      <div className={`mt-1 text-xs ${muted}`}>
                        {user.user_id}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 tabular-nums">
                    {number(user.requests)}
                  </td>
                  <td className="px-5 py-4 tabular-nums">
                    {number(user.prompt_tokens)}
                  </td>
                  <td className="px-5 py-4 tabular-nums">
                    {number(user.response_tokens)}
                  </td>
                  <td className="px-5 py-4 font-semibold tabular-nums">
                    {number(user.total_tokens)}
                  </td>
                  <td className="px-5 py-4 tabular-nums">
                    {duration(user.average_duration_seconds, lang as Lang)}
                  </td>
                  <td className="px-5 py-4 font-semibold tabular-nums">
                    {usd(user.estimated_cost_usd)}
                  </td>
                </tr>
              ))}
              {!loading && !error && data?.users.length === 0 && (
                <tr>
                  <td colSpan={7} className={`px-5 py-12 text-center ${muted}`}>
                    {t.noData}
                  </td>
                </tr>
              )}
              {loading && !data && (
                <tr>
                  <td colSpan={7} className={`px-5 py-12 text-center ${muted}`}>
                    {t.loading}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section
        className={`overflow-hidden rounded-2xl border shadow-sm shadow-slate-900/[0.02] ${panel}`}
      >
        <div
          className={`flex items-center justify-between border-b px-5 py-4 ${tableLine}`}
        >
          <div>
            <h2 className="font-bold">{t.recent}</h2>
            <p className={`mt-1 text-xs ${muted}`}>
              {number(data?.events.length)} {t.events} · {t.page} {activityPage}
            </p>
          </div>
          <Activity size={19} className="text-[#2eb5bc]" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-start text-sm">
            <thead
              className={
                isDark
                  ? "bg-slate-950/60 text-slate-400"
                  : "bg-slate-50 text-slate-500"
              }
            >
              <tr>
                {[
                  t.time,
                  t.user,
                  t.model,
                  t.inputTokens,
                  t.outputTokens,
                  t.totalTokens,
                  t.avgTime,
                  t.estimatedCost,
                  t.status,
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-start text-xs font-semibold"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.events.map((event, index) => (
                <tr
                  key={`${event.request_id ?? "request"}-${event.timestamp}-${index}`}
                  className={`border-t ${tableLine}`}
                >
                  <td
                    className={`whitespace-nowrap px-4 py-3 text-xs ${muted}`}
                  >
                    {dateTime(event.timestamp, lang as Lang)}
                  </td>
                  <td className="max-w-40 truncate px-4 py-3">
                    {event.user_email ||
                      (event.user_id === "unattributed"
                        ? t.noUser
                        : event.user_id)}
                  </td>
                  <td className="px-4 py-3">
                    <div
                      className="max-w-48 truncate font-medium"
                      title={event.model}
                    >
                      {event.model}
                    </div>
                    <div
                      className={`mt-1 max-w-48 truncate text-xs ${muted}`}
                      title={event.stage}
                    >
                      {event.stage}
                    </div>
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {event.prompt_tokens == null
                      ? "—"
                      : number(event.prompt_tokens)}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {event.response_tokens == null
                      ? "—"
                      : number(event.response_tokens)}
                  </td>
                  <td className="px-4 py-3 font-medium tabular-nums">
                    {event.total_tokens == null
                      ? "—"
                      : number(event.total_tokens)}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {duration(event.duration_seconds, lang as Lang)}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {event.estimated_cost_usd == null
                      ? "—"
                      : usd(event.estimated_cost_usd)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${event.status === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
                    >
                      {event.status === "success" ? t.success : t.failed}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && !error && data?.events.length === 0 && (
                <tr>
                  <td colSpan={9} className={`px-5 py-12 text-center ${muted}`}>
                    {t.noData}
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
            {t.page} {activityPage}
            {data?.pagination?.totalPages
              ? ` ${t.pageOf} ${data.pagination.totalPages}`
              : ""}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={activityPage <= 1 || loading}
              onClick={() =>
                setActivityPage((current) => Math.max(1, current - 1))
              }
              className={`h-9 rounded-lg border px-3 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${tableLine} ${muted}`}
            >
              {t.previous}
            </button>
            <button
              type="button"
              disabled={
                loading ||
                (data?.pagination?.totalPages != null
                  ? activityPage >= data.pagination.totalPages
                  : (data?.events.length ?? 0) < activityLimit)
              }
              onClick={() => setActivityPage((current) => current + 1)}
              className={`h-9 rounded-lg border px-3 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${tableLine} ${muted}`}
            >
              {t.next}
            </button>
          </div>
        </div>
      </section>
      <p className={`text-xs ${muted}`}>
        Usage is recorded per Gemini API attempt. Total costs are estimates and
        depend on the pricing variables configured on the Python AI service.
      </p>
    </main>
  );
}
