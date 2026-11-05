"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  Activity,
  AlertCircle,
  Bot,
  CalendarRange,
  Clock3,
  Coins,
  RefreshCw,
  Users,
  Zap,
} from "lucide-react";
import { useDashboardLayout } from "@/app/components/DashboardLayout";
import { getAiUsageTranslations } from "@/app/translations/dashboard/aiUsage/ai-usage-trans";
import { Lang, UsageFilters } from "@/app/interfaces/ai-usage-interface";
import { useGetAiUsageQuery } from "@/app/services/ai-usage-api";
import { EMPTY_USAGE_FILTERS, formatDateTime, formatDuration, formatNumber, formatUsd, getUsageErrorMessage } from "@/app/utils/ai-usage-helper";



const ACTIVITY_LIMIT = 50;

function SelectArrow({ isArabic }: { isArabic: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 ${
        isArabic ? "left-3" : "right-3"
      }`}
    >
      <path
        d="m5 7.5 5 5 5-5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AiUsagePage() {
  const { lang, isArabic, darkMode } = useDashboardLayout();
  const currentLang = (lang === "ar" ? "ar" : "en") as Lang;
  const t = getAiUsageTranslations(currentLang);
  const isDark = darkMode;

  const [days, setDays] = useState("30");
  const [activityPage, setActivityPage] = useState(1);
  const [filterInputs, setFilterInputs] =
    useState<UsageFilters>(EMPTY_USAGE_FILTERS);
  const [filters, setFilters] = useState<UsageFilters>(EMPTY_USAGE_FILTERS);

  const {
    data,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetAiUsageQuery({
    days,
    page: activityPage,
    limit: ACTIVITY_LIMIT,
    ...filters,
  });

  const loading = isLoading || isFetching;
  const errorMessage = error
    ? getUsageErrorMessage(error, t.error)
    : "";

  const panel = isDark
    ? "border-slate-800 bg-slate-900"
    : "border-slate-100 bg-white";
  const muted = isDark ? "text-slate-400" : "text-slate-500";
  const heading = isDark ? "text-slate-100" : "text-slate-800";
  const tableLine = isDark ? "border-slate-800" : "border-slate-100";
  const fieldStyle = isDark
    ? "border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500"
    : "border-slate-200 bg-white text-slate-800 placeholder:text-slate-400";

  const totalUserCost = useMemo(
    () =>
      data?.users.reduce(
        (sum, user) => sum + user.estimated_cost_usd,
        0,
      ) ?? 0,
    [data?.users],
  );

  const cards = [
    {
      label: t.calls,
      value: formatNumber(data?.summary.api_calls),
      detail: `${formatNumber(data?.summary.users)} ${t.users.toLowerCase()}`,
      icon: Activity,
      color: "text-[#47759c]",
      bg: "bg-[#edf3f7]",
    },
    {
      label: t.tokens,
      value: formatNumber(data?.summary.total_tokens),
      detail: `${formatNumber(data?.summary.api_calls)} ${t.events}`,
      icon: Zap,
      color: "text-[#219da5]",
      bg: "bg-[#e8f8f8]",
    },
    {
      label: t.cost,
      value: formatUsd(data?.summary.estimated_cost_usd),
      detail: data?.summary.pricing_configured
        ? t.estimatedCost
        : t.pricingNotConfigured,
      icon: Coins,
      color: "text-[#47759c]",
      bg: "bg-[#edf3f7]",
    },
    {
      label: t.avgLatency,
      value: formatDuration(
        data?.summary.average_duration_seconds,
        currentLang,
      ),
      detail: t.geminiDuration,
      icon: Clock3,
      color: "text-[#219da5]",
      bg: "bg-[#e8f8f8]",
    },
  ];

  const updateFilterInput = (key: keyof UsageFilters, value: string) => {
    setFilterInputs((current) => ({ ...current, [key]: value }));
  };

  const handleApplyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActivityPage(1);
    setFilters({ ...filterInputs });
  };

  const handleClearFilters = () => {
    setFilterInputs({ ...EMPTY_USAGE_FILTERS });
    setFilters({ ...EMPTY_USAGE_FILTERS });
    setActivityPage(1);
  };

  const periodLabel =
    days === "7" ? t.last7 : days === "90" ? t.last90 : t.last30;

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className={`min-h-full space-y-6 ${heading}`}
    >
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className={`mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide ${muted}`}>
            <Bot size={15} className="text-[#2eb5bc]" />
            NTRA · AI ANALYTICS
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-[28px]">
            {t.title}
          </h1>
          <p className={`mt-2 text-sm ${muted}`}>{t.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label
            className={`relative flex h-10 items-center gap-2 rounded-xl border px-3 text-sm ${panel} ${muted}`}
          >
            <CalendarRange size={16} />
            <span className="sr-only">{t.period}</span>
            <select
              aria-label={t.period}
              value={days}
              onChange={(event) => {
                setDays(event.target.value);
                setActivityPage(1);
              }}
              className={`h-full max-w-36 appearance-none bg-transparent outline-none ${
                isArabic ? "pl-6" : "pr-6"
              } ${heading}`}
            >
              <option value="7">{t.last7}</option>
              <option value="30">{t.last30}</option>
              <option value="90">{t.last90}</option>
            </select>
            <SelectArrow isArabic={isArabic} />
          </label>

          <button
            type="button"
            onClick={() => void refetch()}
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#47759c] px-4 text-sm font-semibold text-white transition hover:bg-[#3e688b] disabled:opacity-60"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            {t.refresh}
          </button>
        </div>
      </header>

      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          {errorMessage}
        </div>
      )}

      {data && !data.summary.pricing_configured && (
        <div
          className={`rounded-xl border p-4 text-sm ${
            isDark
              ? "border-amber-900 bg-amber-950/40 text-amber-200"
              : "border-amber-200 bg-amber-50 text-amber-900"
          }`}
        >
          {t.pricingWarning}
        </div>
      )}

      <section className={`rounded-2xl border p-5 shadow-sm shadow-slate-900/2 ${panel}`}>
        <div className="mb-4">
          <h2 className="font-bold">{t.filters}</h2>
          <p className={`mt-1 text-xs ${muted}`}>{t.filterDescription}</p>
        </div>

        <form
          onSubmit={handleApplyFilters}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
        >
          <label className="space-y-1.5">
            <span className={`block text-xs font-medium ${muted}`}>{t.userId}</span>
            <input
              value={filterInputs.userId}
              onChange={(event) => updateFilterInput("userId", event.target.value)}
              placeholder="User ID"
              className={`h-10 w-full rounded-xl border px-3 text-sm outline-none focus:border-[#47759c] ${fieldStyle}`}
            />
          </label>

          <label className="space-y-1.5">
            <span className={`block text-xs font-medium ${muted}`}>{t.model}</span>
            <input
              value={filterInputs.model}
              onChange={(event) => updateFilterInput("model", event.target.value)}
              placeholder="e.g. gemini-2.5-flash"
              className={`h-10 w-full rounded-xl border px-3 text-sm outline-none focus:border-[#47759c] ${fieldStyle}`}
            />
          </label>

          <label className="space-y-1.5">
            <span className={`block text-xs font-medium ${muted}`}>{t.operation}</span>
            <input
              value={filterInputs.operation}
              onChange={(event) => updateFilterInput("operation", event.target.value)}
              placeholder="e.g. task_matching"
              className={`h-10 w-full rounded-xl border px-3 text-sm outline-none focus:border-[#47759c] ${fieldStyle}`}
            />
          </label>

          <label className="space-y-1.5">
            <span className={`block text-xs font-medium ${muted}`}>{t.status}</span>
            <div className="relative">
              <select
                value={filterInputs.status}
                onChange={(event) => updateFilterInput("status", event.target.value)}
                className={`h-10 w-full appearance-none rounded-xl border px-3 text-sm outline-none focus:border-[#47759c] ${
                  isArabic ? "pl-9" : "pr-9"
                } ${fieldStyle}`}
              >
                <option value="">{t.allStatuses}</option>
                <option value="success">{t.success}</option>
                <option value="failed">{t.failed}</option>
              </select>
              <SelectArrow isArabic={isArabic} />
            </div>
          </label>

          <label className="space-y-1.5">
            <span className={`block text-xs font-medium ${muted}`}>{t.from}</span>
            <input
              type="date"
              value={filterInputs.from}
              onChange={(event) => updateFilterInput("from", event.target.value)}
              className={`h-10 w-full rounded-xl border px-3 text-sm outline-none focus:border-[#47759c] ${fieldStyle}`}
            />
          </label>

          <label className="space-y-1.5">
            <span className={`block text-xs font-medium ${muted}`}>{t.to}</span>
            <input
              type="date"
              min={filterInputs.from || undefined}
              value={filterInputs.to}
              onChange={(event) => updateFilterInput("to", event.target.value)}
              className={`h-10 w-full rounded-xl border px-3 text-sm outline-none focus:border-[#47759c] ${fieldStyle}`}
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
              onClick={handleClearFilters}
              className={`h-10 rounded-xl border px-4 text-sm font-semibold transition hover:bg-slate-500/6 ${tableLine} ${muted}`}
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
            className={`rounded-2xl border p-5 shadow-sm shadow-slate-900/2 ${panel}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className={`grid h-11 w-11 place-items-center rounded-xl ${bg} ${color}`}>
                <Icon size={20} />
              </div>
              <span className={`mt-1 text-[11px] ${muted}`}>{periodLabel}</span>
            </div>
            <p className={`mt-5 text-sm ${muted}`}>{label}</p>
            <p className="mt-1 wrap-break-word text-2xl font-bold tracking-tight">
              {loading && !data ? "—" : value}
            </p>
            <p className={`mt-2 text-xs ${muted}`}>{detail}</p>
          </article>
        ))}
      </section>

      <section className={`overflow-hidden rounded-2xl border shadow-sm shadow-slate-900/2 ${panel}`}>
        <div className={`flex items-center justify-between border-b px-5 py-4 ${tableLine}`}>
          <div>
            <h2 className="font-bold">{t.userUsage}</h2>
            <p className={`mt-1 text-xs ${muted}`}>
              {t.total}: {formatUsd(totalUserCost)}
            </p>
          </div>
          <Users size={19} className="text-[#2eb5bc]" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-212.5 text-start text-sm">
            <thead className={isDark ? "bg-slate-950/60 text-slate-400" : "bg-slate-50 text-slate-500"}>
              <tr>
                {[t.user, t.requests, t.inputTokens, t.outputTokens, t.totalTokens, t.avgTime, t.estimatedCost].map((label) => (
                  <th key={label} className="px-5 py-3 text-start text-xs font-semibold">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.users.map((user) => (
                <tr key={user.user_id} className={`border-t ${tableLine} transition hover:bg-slate-500/4`}>
                  <td className="px-5 py-4">
                    <div className="font-semibold">
                      {user.user_email || (user.user_id === "unattributed" ? t.noUser : user.user_id)}
                    </div>
                    {user.user_email && <div className={`mt-1 text-xs ${muted}`}>{user.user_id}</div>}
                  </td>
                  <td className="px-5 py-4 tabular-nums">{formatNumber(user.requests)}</td>
                  <td className="px-5 py-4 tabular-nums">{formatNumber(user.prompt_tokens)}</td>
                  <td className="px-5 py-4 tabular-nums">{formatNumber(user.response_tokens)}</td>
                  <td className="px-5 py-4 font-semibold tabular-nums">{formatNumber(user.total_tokens)}</td>
                  <td className="px-5 py-4 tabular-nums">{formatDuration(user.average_duration_seconds, currentLang)}</td>
                  <td className="px-5 py-4 font-semibold tabular-nums">{formatUsd(user.estimated_cost_usd)}</td>
                </tr>
              ))}
              {!loading && !errorMessage && data?.users.length === 0 && (
                <tr><td colSpan={7} className={`px-5 py-12 text-center ${muted}`}>{t.noData}</td></tr>
              )}
              {loading && !data && (
                <tr><td colSpan={7} className={`px-5 py-12 text-center ${muted}`}>{t.loading}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className={`overflow-hidden rounded-2xl border shadow-sm shadow-slate-900/2 ${panel}`}>
        <div className={`flex items-center justify-between border-b px-5 py-4 ${tableLine}`}>
          <div>
            <h2 className="font-bold">{t.recent}</h2>
            <p className={`mt-1 text-xs ${muted}`}>
              {formatNumber(data?.events.length)} {t.events} · {t.page} {activityPage}
            </p>
          </div>
          <Activity size={19} className="text-[#2eb5bc]" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-262.5 text-start text-sm">
            <thead className={isDark ? "bg-slate-950/60 text-slate-400" : "bg-slate-50 text-slate-500"}>
              <tr>
                {[t.time, t.user, t.model, t.inputTokens, t.outputTokens, t.totalTokens, t.avgTime, t.estimatedCost, t.status].map((label) => (
                  <th key={label} className="px-4 py-3 text-start text-xs font-semibold">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.events.map((event, index) => (
                <tr key={`${event.request_id ?? "request"}-${event.timestamp}-${index}`} className={`border-t ${tableLine}`}>
                  <td className={`whitespace-nowrap px-4 py-3 text-xs ${muted}`}>{formatDateTime(event.timestamp, currentLang)}</td>
                  <td className="max-w-40 truncate px-4 py-3">
                    {event.user_email || (event.user_id === "unattributed" ? t.noUser : event.user_id)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="max-w-48 truncate font-medium" title={event.model}>{event.model}</div>
                    <div className={`mt-1 max-w-48 truncate text-xs ${muted}`} title={event.stage}>{event.stage}</div>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{event.prompt_tokens == null ? "—" : formatNumber(event.prompt_tokens)}</td>
                  <td className="px-4 py-3 tabular-nums">{event.response_tokens == null ? "—" : formatNumber(event.response_tokens)}</td>
                  <td className="px-4 py-3 font-medium tabular-nums">{event.total_tokens == null ? "—" : formatNumber(event.total_tokens)}</td>
                  <td className="px-4 py-3 tabular-nums">{formatDuration(event.duration_seconds, currentLang)}</td>
                  <td className="px-4 py-3 tabular-nums">{event.estimated_cost_usd == null ? "—" : formatUsd(event.estimated_cost_usd)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      event.status === "success"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}>
                      {event.status === "success" ? t.success : t.failed}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && !errorMessage && data?.events.length === 0 && (
                <tr><td colSpan={9} className={`px-5 py-12 text-center ${muted}`}>{t.noData}</td></tr>
              )}
              {loading && !data && (
                <tr><td colSpan={9} className={`px-5 py-12 text-center ${muted}`}>{t.loading}</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={`flex flex-col items-center justify-between gap-3 border-t px-5 py-4 sm:flex-row ${tableLine}`}>
          <p className={`text-xs ${muted}`}>
            {t.page} {activityPage}
            {data?.pagination?.totalPages ? ` ${t.pageOf} ${data.pagination.totalPages}` : ""}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={activityPage <= 1 || loading}
              onClick={() => setActivityPage((current) => Math.max(1, current - 1))}
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
                  : (data?.events.length ?? 0) < ACTIVITY_LIMIT)
              }
              onClick={() => setActivityPage((current) => current + 1)}
              className={`h-9 rounded-lg border px-3 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${tableLine} ${muted}`}
            >
              {t.next}
            </button>
          </div>
        </div>
      </section>

      <p className={`text-xs ${muted}`}>{t.usageFooter}</p>
    </main>
  );
}
