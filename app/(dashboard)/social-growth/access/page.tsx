"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  RefreshCw,
  ShieldCheck,
  UserCog,
  Database,
} from "lucide-react";
import Link from "next/link";
import { useDashboardLayout } from "@/app/components/DashboardLayout";
import {
  socialGrowthApi,
  type AccessRecord,
  type MetricDefinition,
  type MyAccess,
  type SocialAccount,
  type SocialPlatform,
} from "@/app/services/social-growth-api";

export default function SocialGrowthAccessPage() {
  const { isArabic, darkMode } = useDashboardLayout();
  const [myAccess, setMyAccess] = useState<MyAccess | null>(null);
  const [accessRows, setAccessRows] = useState<AccessRecord[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [metrics, setMetrics] = useState<MetricDefinition[]>([]);
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [targetUserId, setTargetUserId] = useState("");
  const [canAccess, setCanAccess] = useState(true);
  const [isAdministrator, setIsAdministrator] = useState(false);
  const [accountId, setAccountId] = useState("");
  const [metricDefinitionId, setMetricDefinitionId] = useState("");
  const [snapshotValue, setSnapshotValue] = useState("");
  const [collectedAt, setCollectedAt] = useState("");
  const [snapshotAccountFilter, setSnapshotAccountFilter] = useState("");

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
      const mine = await socialGrowthApi.getMyAccess();
      setMyAccess(mine);
      if (mine.canAccess) {
        const [accountRows, metricRows] = await Promise.all([
          socialGrowthApi.listAccounts(),
          socialGrowthApi.listMetrics(),
        ]);
        setAccounts(accountRows);
        setMetrics(metricRows);
        setAccountId(
          (current) => current || accountRows.find((a) => a.isActive)?.id || "",
        );
      } else {
        setAccounts([]);
        setMetrics([]);
      }
      if (mine.isSuperSupervisor || (mine.canAccess && mine.isAdministrator)) {
        try {
          setAccessRows(await socialGrowthApi.listAccess());
        } catch (e) {
          setAccessRows([]);
          setError(
            e instanceof Error ? e.message : "Unable to load access records.",
          );
        }
      } else {
        setAccessRows([]);
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to load access and data entry tools.",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);

  const loadSnapshots = useCallback(async (id: string) => {
    if (!id) {
      setSnapshots([]);
      return;
    }
    try {
      setSnapshots(await socialGrowthApi.listSnapshots(id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load snapshots.");
    }
  }, []);
  useEffect(() => {
    void loadSnapshots(snapshotAccountFilter);
  }, [snapshotAccountFilter, loadSnapshots]);

  const eligibleMetrics = useMemo(
    () =>
      metrics.filter(
        (metric) =>
          metric.platform ===
            accounts.find((a) => a.id === accountId)?.platform &&
          metric.isActive &&
          metric.collectionMethod === "MANUAL",
      ),
    [metrics, accounts, accountId],
  );
  useEffect(() => {
    if (!eligibleMetrics.some((m) => m.id === metricDefinitionId))
      setMetricDefinitionId(eligibleMetrics[0]?.id ?? "");
  }, [accountId, eligibleMetrics, metricDefinitionId]);

  async function submitAccess(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const body: { canAccess: boolean; isAdministrator?: boolean } = {
        canAccess,
      };
      // Only Super Supervisors can change administrator permission.
      if (myAccess?.isSuperSupervisor) body.isAdministrator = isAdministrator;
      await socialGrowthApi.setAccess(targetUserId.trim(), body);
      setNotice("User access updated successfully.");
      setTargetUserId("");
      await load();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to update user access.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function submitSnapshot(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await socialGrowthApi.createSnapshot(accountId, {
        metricDefinitionId,
        value: Number(snapshotValue),
        ...(collectedAt
          ? { collectedAt: new Date(collectedAt).toISOString() }
          : {}),
      });
      setNotice("Manual snapshot saved.");
      setSnapshotValue("");
      await Promise.all([loadSnapshots(snapshotAccountFilter), load()]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save snapshot.");
    } finally {
      setSaving(false);
    }
  }

  const canManageAccess = Boolean(
    myAccess?.isSuperSupervisor ||
    (myAccess?.canAccess && myAccess?.isAdministrator),
  );
  const canSetAdmin = Boolean(myAccess?.isSuperSupervisor);
  const canEnterSnapshots = Boolean(
    myAccess?.canAccess && myAccess?.isAdministrator,
  );
  const fieldLabel = (label: string, child: ReactNode) => (
    <label className="block space-y-1.5">
      <span className={`text-xs font-semibold ${muted}`}>{label}</span>
      {child}
    </label>
  );

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
            <ShieldCheck size={15} className="text-[#2eb5bc]" /> NTRA · ACCESS &
            DATA
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-[28px]">
            {isArabic ? "الصلاحيات وإدخال البيانات" : "Access & Data Entry"}
          </h1>
          <p className={`mt-2 text-sm ${muted}`}>
            {isArabic
              ? "تحقق من صلاحياتك، وأدر وصول المستخدمين، وسجّل لقطات المقاييس."
              : "Check your permissions, manage module access, and enter monthly metric snapshots."}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/social-growth"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold"
          >
            <ArrowLeft size={15} />
            Dashboard
          </Link>
          <button
            onClick={() => void load()}
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#47759c] px-4 text-sm font-semibold text-white disabled:opacity-60"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </header>
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle size={18} className="shrink-0" />
          {error}
        </div>
      )}
      {notice && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
        >
          <CheckCircle2 size={18} className="shrink-0" />
          {notice}
        </div>
      )}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className={`rounded-2xl border p-5 ${panel}`}>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#edf3f7] text-[#47759c]">
            <KeyRound size={19} />
          </div>
          <p className={`mt-4 text-sm ${muted}`}>Your module access</p>
          <p className="mt-1 text-xl font-bold">
            {loading ? "—" : myAccess?.canAccess ? "Granted" : "Not granted"}
          </p>
          <p className={`mt-1 text-xs ${muted}`}>From GET /access/me</p>
        </article>
        <article className={`rounded-2xl border p-5 ${panel}`}>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#e8f8f8] text-[#219da5]">
            <UserCog size={19} />
          </div>
          <p className={`mt-4 text-sm ${muted}`}>Administrator</p>
          <p className="mt-1 text-xl font-bold">
            {loading ? "—" : myAccess?.isAdministrator ? "Yes" : "No"}
          </p>
          <p className={`mt-1 text-xs ${muted}`}>
            {myAccess?.isSuperSupervisor
              ? "Super Supervisor"
              : myAccess?.role || "Current role"}
          </p>
        </article>
        <article className={`rounded-2xl border p-5 ${panel}`}>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#edf3f7] text-[#47759c]">
            <Database size={19} />
          </div>
          <p className={`mt-4 text-sm ${muted}`}>Accounts available</p>
          <p className="mt-1 text-xl font-bold">{accounts.length}</p>
          <p className={`mt-1 text-xs ${muted}`}>Registered account records</p>
        </article>
        <article className={`rounded-2xl border p-5 ${panel}`}>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#e8f8f8] text-[#219da5]">
            <ShieldCheck size={19} />
          </div>
          <p className={`mt-4 text-sm ${muted}`}>Access records</p>
          <p className="mt-1 text-xl font-bold">
            {canManageAccess ? accessRows.length : "—"}
          </p>
          <p className={`mt-1 text-xs ${muted}`}>Visible to access managers</p>
        </article>
      </section>
      {!myAccess?.canAccess && !myAccess?.isSuperSupervisor && (
        <div className={`rounded-2xl border p-5 ${panel}`}>
          <h2 className="font-bold">Access is required</h2>
          <p className={`mt-2 text-sm ${muted}`}>
            Your account has not been granted Social Media Growth access. Ask a
            Super Supervisor to grant access before using the dashboard or
            data-entry features.
          </p>
        </div>
      )}
      {canManageAccess && (
        <section
          className={`overflow-hidden rounded-2xl border shadow-sm shadow-slate-900/[0.02] ${panel}`}
        >
          <div className={`flex items-center gap-3 border-b px-5 py-4 ${line}`}>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#edf3f7] text-[#47759c]">
              <UserCog size={19} />
            </div>
            <div>
              <h2 className="font-bold">Manage user access</h2>
              <p className={`mt-1 text-xs ${muted}`}>
                Enter the target user's application ID.
              </p>
            </div>
          </div>
          <form
            onSubmit={submitAccess}
            className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto]"
          >
            <div>
              {fieldLabel(
                "Target user ID",
                <input
                  required
                  className={input}
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  placeholder="Paste user ID"
                />,
              )}
            </div>
            <label
              className={`flex items-center gap-2 self-end pb-3 text-sm ${heading}`}
            >
              <input
                type="checkbox"
                checked={canAccess}
                onChange={(e) => {
                  setCanAccess(e.target.checked);
                  if (!e.target.checked) setIsAdministrator(false);
                }}
              />{" "}
              Grant module access
            </label>
            {canSetAdmin && (
              <label
                className={`flex items-center gap-2 self-end pb-3 text-sm ${heading}`}
              >
                <input
                  type="checkbox"
                  checked={isAdministrator}
                  disabled={!canAccess}
                  onChange={(e) => setIsAdministrator(e.target.checked)}
                />{" "}
                Administrator
              </label>
            )}
            <button
              disabled={saving || !targetUserId.trim()}
              className="inline-flex h-10 items-center justify-center gap-2 self-end rounded-xl bg-[#47759c] px-4 text-sm font-semibold text-white disabled:opacity-60"
            >
              Save access
            </button>
          </form>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-start text-sm">
              <thead
                className={
                  isDark
                    ? "bg-slate-950/60 text-slate-400"
                    : "bg-slate-50 text-slate-500"
                }
              >
                <tr>
                  {[
                    "User",
                    "Role",
                    "Module access",
                    "Administrator",
                    "Granted by",
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
                {accessRows.map((row) => (
                  <tr key={row.id} className={`border-t ${line}`}>
                    <td className="px-5 py-4">
                      <div className="font-semibold">
                        {row.user?.fullName || row.userId}
                      </div>
                      <div className={`mt-1 text-xs ${muted}`}>
                        {row.user?.email || row.userId}
                      </div>
                    </td>
                    <td className={`px-5 py-4 text-xs ${muted}`}>
                      {row.user?.role?.name || row.user?.role?.code || "—"}
                    </td>
                    <td className="px-5 py-4">
                      {row.canAccess ? (
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                          Granted
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">
                          Denied
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {row.isAdministrator ? "Yes" : "No"}
                    </td>
                    <td className={`px-5 py-4 text-xs ${muted}`}>
                      {row.grantedBy?.fullName || "—"}
                    </td>
                  </tr>
                ))}
                {!loading && accessRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className={`px-5 py-10 text-center ${muted}`}
                    >
                      No access records found, or the API did not allow access
                      listing.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
      {canEnterSnapshots && (
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)]">
          <form
            onSubmit={submitSnapshot}
            className={`space-y-4 rounded-2xl border p-5 shadow-sm shadow-slate-900/[0.02] ${panel}`}
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#e8f8f8] text-[#219da5]">
                <Database size={19} />
              </div>
              <div>
                <h2 className="font-bold">Add manual snapshot</h2>
                <p className={`mt-1 text-xs ${muted}`}>
                  One snapshot per metric per account per month.
                </p>
              </div>
            </div>
            {fieldLabel(
              "Account",
              <select
                required
                className={input}
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
              >
                <option value="">Select account</option>
                {accounts
                  .filter((a) => a.isActive)
                  .map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.platform} · {a.displayName}
                    </option>
                  ))}
              </select>,
            )}
            {fieldLabel(
              "Metric",
              <select
                required
                className={input}
                value={metricDefinitionId}
                onChange={(e) => setMetricDefinitionId(e.target.value)}
              >
                <option value="">Select manual metric</option>
                {eligibleMetrics.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.unit})
                  </option>
                ))}
              </select>,
            )}
            {fieldLabel(
              "Value",
              <input
                required
                min="0"
                step="any"
                type="number"
                className={input}
                value={snapshotValue}
                onChange={(e) => setSnapshotValue(e.target.value)}
                placeholder="1250"
              />,
            )}
            {fieldLabel(
              "Collected at (optional)",
              <input
                type="datetime-local"
                className={input}
                value={collectedAt}
                onChange={(e) => setCollectedAt(e.target.value)}
              />,
            )}
            <button
              disabled={
                saving ||
                !accountId ||
                !metricDefinitionId ||
                snapshotValue === "" ||
                !eligibleMetrics.length
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#47759c] px-4 text-sm font-semibold text-white disabled:opacity-60"
            >
              Save snapshot
            </button>
            {eligibleMetrics.length === 0 && (
              <p className="text-xs text-amber-600">
                No active MANUAL metric matches the selected account platform.
                Create one in Accounts & Metrics Management.
              </p>
            )}
          </form>
          <div
            className={`overflow-hidden rounded-2xl border shadow-sm shadow-slate-900/[0.02] ${panel}`}
          >
            <div
              className={`flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${line}`}
            >
              <div>
                <h2 className="font-bold">Snapshot history</h2>
                <p className={`mt-1 text-xs ${muted}`}>
                  Inspect previously entered data.
                </p>
              </div>
              <select
                className={`${input} sm:max-w-xs`}
                aria-label="Filter snapshot history by account"
                value={snapshotAccountFilter}
                onChange={(e) => setSnapshotAccountFilter(e.target.value)}
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
              <table className="w-full min-w-[550px] text-start text-sm">
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
                  {snapshots.map((s) => (
                    <tr key={s.id} className={`border-t ${line}`}>
                      <td className="px-5 py-4 font-semibold">
                        {s.metricDefinition?.name || s.metricDefinitionId}
                      </td>
                      <td className="px-5 py-4 tabular-nums">
                        {Number(s.value).toLocaleString()}
                      </td>
                      <td className={`px-5 py-4 text-xs ${muted}`}>
                        {new Date(s.collectedAt).toLocaleString()}
                      </td>
                      <td className="px-5 py-4">{s.source}</td>
                    </tr>
                  ))}
                  {snapshots.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className={`px-5 py-10 text-center ${muted}`}
                      >
                        Choose an account to load snapshot history.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
      <p className={`text-xs ${muted}`}>
        Permission rules are enforced by the backend. Super Supervisors can
        manage access even without module access; only Super Supervisors can
        change administrator permissions. Manual snapshot entry requires module
        administrator permission.
      </p>
    </main>
  );
}
