"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  ExternalLink,
  RefreshCw,
  Users,
  Globe2,
} from "lucide-react";
import Link from "next/link";
import { useDashboardLayout } from "@/app/components/DashboardLayout";
import {
  socialGrowthApi,
  type SocialAccount,
  type SocialDashboard,
} from "@/app/services/social-growth-api";

function number(value: number | null | undefined) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(
    value ?? 0,
  );
}
function date(value?: string | null) {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? value
    : new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(parsed);
}

export default function SocialGrowthDashboardPage() {
  const { isArabic, darkMode } = useDashboardLayout();
  const [data, setData] = useState<SocialDashboard | null>(null);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [snapshotLoading, setSnapshotLoading] = useState(false);

  const isDark = darkMode;
  const panel = isDark
    ? "border-slate-800 bg-slate-900"
    : "border-slate-100 bg-white";
  const muted = isDark ? "text-slate-400" : "text-slate-500";
  const heading = isDark ? "text-slate-100" : "text-slate-800";
  const line = isDark ? "border-slate-800" : "border-slate-100";
  const input = `w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-[#2eb5bc] ${isDark ? "border-slate-700 bg-slate-950 text-slate-100" : "border-slate-200 bg-white text-slate-800"}`;

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [dashboard, accountRows] = await Promise.all([
        socialGrowthApi.getDashboard(),
        socialGrowthApi.listAccounts(),
      ]);

      // Keep dashboard data from /dashboard intact. It already contains the
      // active accounts and their computed metric values. /accounts is used
      // only for the snapshot-history selector below.
      setData({
        ...dashboard,
        generatedAt: dashboard.generatedAt ?? new Date().toISOString(),
        accounts: Array.isArray(dashboard.accounts) ? dashboard.accounts : [],
      });
      setAccounts(accountRows);
      setSelectedAccount((current) =>
        current && accountRows.some((account) => account.id === current)
          ? current
          : (accountRows[0]?.id ?? ""),
      );
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to load Social Growth data.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSnapshots = useCallback(async (id: string) => {
    if (!id) {
      setSnapshots([]);
      return;
    }
    setSnapshotLoading(true);
    try {
      setSnapshots(await socialGrowthApi.listSnapshots(id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load snapshots.");
    } finally {
      setSnapshotLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);
  useEffect(() => {
    void loadSnapshots(selectedAccount);
  }, [selectedAccount, loadSnapshots]);

  const metricsCount = useMemo(
    () =>
      data?.accounts.reduce(
        (sum, account) => sum + account.metrics.length,
        0,
      ) ?? 0,
    [data],
  );
  const cards = [
    {
      label: isArabic ? "الحسابات النشطة" : "Active accounts",
      value: number(data?.accounts.length),
      detail: isArabic ? "منصات مسجلة" : "Registered platforms",
      icon: Globe2,
      tone: "text-[#47759c] bg-[#edf3f7]",
    },
    {
      label: isArabic ? "المقاييس المعروضة" : "Tracked metrics",
      value: number(metricsCount),
      detail: isArabic
        ? "قيم محفوظة في أحدث اللقطات"
        : "Metrics with saved snapshots",
      icon: BarChart3,
      tone: "text-[#219da5] bg-[#e8f8f8]",
    },
    {
      label: isArabic ? "اللقطات المحفوظة" : "Snapshot history",
      value: number(snapshots.length),
      detail: isArabic ? "للحساب المحدد" : "For selected account",
      icon: Activity,
      tone: "text-[#47759c] bg-[#edf3f7]",
    },
    {
      label: isArabic ? "آخر تحديث" : "Last dashboard refresh",
      value: data ? date(data.generatedAt) : "—",
      detail: isArabic ? "وقت إنشاء البيانات" : "Dashboard generated at",
      icon: Users,
      tone: "text-[#219da5] bg-[#e8f8f8]",
    },
  ];
  const selected = accounts.find((a) => a.id === selectedAccount);

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
            <Activity size={15} className="text-[#2eb5bc]" /> NTRA · SOCIAL
            ANALYTICS
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-[28px]">
            {isArabic ? "نمو وسائل التواصل الاجتماعي" : "Social Media Growth"}
          </h1>
          <p className={`mt-2 text-sm ${muted}`}>
            {isArabic
              ? "تابع الحسابات ومؤشرات الأداء والبيانات الشهرية المسجلة."
              : "Review registered accounts, tracked metrics, and saved monthly performance data."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/social-growth/management"
            className="inline-flex h-10 items-center rounded-xl border border-[#47759c]/20 px-4 text-sm font-semibold text-[#47759c]"
          >
            {isArabic
              ? "إدارة الحسابات والمقاييس"
              : "Manage accounts & metrics"}
          </Link>
          <button
            onClick={() => void load()}
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#47759c] px-4 text-sm font-semibold text-white hover:bg-[#3e688b] disabled:opacity-60"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            {isArabic ? "تحديث" : "Refresh"}
          </button>
        </div>
      </header>
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, detail, icon: Icon, tone }) => (
          <article
            key={label}
            className={`rounded-2xl border p-5 shadow-sm shadow-slate-900/[0.02] ${panel}`}
          >
            <div className="flex items-start justify-between">
              <div
                className={`grid h-11 w-11 place-items-center rounded-xl ${tone}`}
              >
                <Icon size={20} />
              </div>
              <span className={`text-[11px] ${muted}`}>
                {isArabic ? "نظرة عامة" : "Overview"}
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
          className={`flex items-center justify-between border-b px-5 py-4 ${line}`}
        >
          <div>
            <h2 className="font-bold">
              {isArabic ? "الحسابات والمؤشرات" : "Accounts & performance"}
            </h2>
            <p className={`mt-1 text-xs ${muted}`}>
              {isArabic
                ? "آخر قيمة محفوظة لكل مقياس"
                : "Latest saved value for each metric"}
            </p>
          </div>
          <Globe2 size={19} className="text-[#2eb5bc]" />
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
                  "Platform",
                  "Account",
                  "Metric",
                  "Latest value",
                  "Change",
                  "Collected",
                  "Source",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-start text-xs font-semibold"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data?.accounts ?? []).flatMap((account) =>
                account.metrics.length
                  ? account.metrics.map((metric) => (
                      <tr
                        key={`${account.id}-${metric.metric.id}`}
                        className={`border-t ${line} transition hover:bg-slate-500/[0.04]`}
                      >
                        <td className="px-5 py-4">
                          <span className="rounded-lg bg-[#edf3f7] px-2 py-1 text-xs font-semibold text-[#47759c]">
                            {account.platform}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-semibold">
                            {account.displayName}
                          </div>
                          <a
                            className="mt-1 inline-flex items-center gap-1 text-xs text-[#47759c]"
                            href={account.accountUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open account <ExternalLink size={11} />
                          </a>
                        </td>
                        <td className="px-5 py-4 font-medium">
                          {metric.metric.name}
                          <div className={`mt-1 text-xs ${muted}`}>
                            {metric.metric.key}
                          </div>
                        </td>
                        <td className="px-5 py-4 font-semibold tabular-nums">
                          {number(metric.currentValue)}{" "}
                          <span className={`text-xs font-normal ${muted}`}>
                            {metric.metric.unit}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {metric.change === null ? (
                            <span className={muted}>No previous value</span>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1 text-xs font-semibold ${metric.change >= 0 ? "text-emerald-600" : "text-red-600"}`}
                            >
                              {metric.change >= 0 ? (
                                <ArrowUpRight size={14} />
                              ) : (
                                <ArrowDownRight size={14} />
                              )}
                              {number(metric.change)}
                              {metric.changePercent === null
                                ? ""
                                : ` (${number(metric.changePercent)}%)`}
                            </span>
                          )}
                        </td>
                        <td
                          className={`whitespace-nowrap px-5 py-4 text-xs ${muted}`}
                        >
                          {date(metric.collectedAt)}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${metric.source === "MANUAL" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}
                          >
                            {metric.source}
                          </span>
                        </td>
                      </tr>
                    ))
                  : [
                      <tr
                        key={`${account.id}-empty`}
                        className={`border-t ${line}`}
                      >
                        <td className="px-5 py-4">
                          <span className="rounded-lg bg-[#edf3f7] px-2 py-1 text-xs font-semibold text-[#47759c]">
                            {account.platform}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-semibold">
                          {account.displayName}
                        </td>
                        <td colSpan={5} className={`px-5 py-4 ${muted}`}>
                          No snapshots yet. Add a manual snapshot from the
                          Access & Data Entry page.
                        </td>
                      </tr>,
                    ],
              )}
              {!loading && (data?.accounts.length ?? 0) === 0 && (
                <tr>
                  <td colSpan={7} className={`px-5 py-12 text-center ${muted}`}>
                    No active accounts found.{" "}
                    <Link
                      href="/social-growth/management"
                      className="font-semibold text-[#47759c]"
                    >
                      Create an account
                    </Link>
                    .
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
          className={`flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${line}`}
        >
          <div>
            <h2 className="font-bold">
              {isArabic ? "سجل اللقطات" : "Snapshot history"}
            </h2>
            <p className={`mt-1 text-xs ${muted}`}>
              {isArabic
                ? "اختر حسابًا لعرض القيم السابقة"
                : "Choose an account to inspect saved values"}
            </p>
          </div>
          <select
            aria-label="Select account"
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className={`${input} sm:max-w-xs`}
          >
            <option value="">Select account</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.platform} · {a.displayName}
              </option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-start text-sm">
            <thead
              className={
                isDark
                  ? "bg-slate-950/60 text-slate-400"
                  : "bg-slate-50 text-slate-500"
              }
            >
              <tr>
                {["Metric", "Value", "Collected at", "Source"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-start text-xs font-semibold"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {snapshots.map((snapshot) => (
                <tr key={snapshot.id} className={`border-t ${line}`}>
                  <td className="px-5 py-4 font-semibold">
                    {snapshot.metricDefinition?.name ??
                      snapshot.metricDefinitionId}
                  </td>
                  <td className="px-5 py-4 tabular-nums">
                    {number(Number(snapshot.value))}
                  </td>
                  <td className={`px-5 py-4 text-xs ${muted}`}>
                    {date(snapshot.collectedAt)}
                  </td>
                  <td className="px-5 py-4">{snapshot.source}</td>
                </tr>
              ))}
              {!snapshotLoading && snapshots.length === 0 && (
                <tr>
                  <td colSpan={4} className={`px-5 py-10 text-center ${muted}`}>
                    {selected
                      ? "No snapshots for this account yet."
                      : "Select an account to view snapshot history."}
                  </td>
                </tr>
              )}
              {snapshotLoading && (
                <tr>
                  <td colSpan={4} className={`px-5 py-8 text-center ${muted}`}>
                    Loading snapshots…
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      <p className={`text-xs ${muted}`}>
        Note: “API” is currently a collection-method label. This page displays
        saved data; external platform synchronization is not implemented by
        these endpoints.
      </p>
    </main>
  );
}
