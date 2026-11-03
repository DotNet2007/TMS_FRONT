"use client";

import { FormEvent, useCallback, useEffect, useState, type ReactNode } from "react";
import { AlertCircle, ArrowLeft, CheckCircle2, Globe2, Plus, RefreshCw, Settings2 } from "lucide-react";
import Link from "next/link";
import { useDashboardLayout } from "@/app/components/DashboardLayout";
import { socialGrowthApi, SOCIAL_PLATFORMS, type CollectionMethod, type MetricDefinition, type SocialAccount, type SocialPlatform } from "@/app/services/social-growth-api";

export default function SocialGrowthManagementPage() {
  const { isArabic, darkMode } = useDashboardLayout();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [metrics, setMetrics] = useState<MetricDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [accountForm, setAccountForm] = useState({ platform: "INSTAGRAM" as SocialPlatform, displayName: "", accountUrl: "", externalAccountId: "" });
  const [metricForm, setMetricForm] = useState({ platform: "INSTAGRAM" as SocialPlatform, key: "followers", name: "Followers", description: "", unit: "count", collectionMethod: "MANUAL" as CollectionMethod });
  const [metricPlatform, setMetricPlatform] = useState<SocialPlatform | "">("");
  const [editingAccount, setEditingAccount] = useState<string | null>(null);
  const [editingMetric, setEditingMetric] = useState<string | null>(null);
  const [accountEdit, setAccountEdit] = useState({ displayName: "", accountUrl: "", externalAccountId: "" });
  const [metricEdit, setMetricEdit] = useState({ name: "", description: "", unit: "count", collectionMethod: "MANUAL" as CollectionMethod });

  const isDark = darkMode;
  const panel = isDark ? "border-slate-800 bg-slate-900" : "border-slate-100 bg-white";
  const muted = isDark ? "text-slate-400" : "text-slate-500";
  const heading = isDark ? "text-slate-100" : "text-slate-800";
  const line = isDark ? "border-slate-800" : "border-slate-100";
  const input = `w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-[#2eb5bc] ${isDark ? "border-slate-700 bg-slate-950 text-slate-100" : "border-slate-200 bg-white text-slate-800"}`;
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [accountRows, metricRows] = await Promise.all([socialGrowthApi.listAccounts(), socialGrowthApi.listMetrics(metricPlatform)]);
      setAccounts(accountRows); setMetrics(metricRows);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to load accounts and metrics."); }
    finally { setLoading(false); }
  }, [metricPlatform]);
  useEffect(() => { void load(); }, [load]);

  async function createAccount(event: FormEvent) {
    event.preventDefault(); setSaving(true); setError(""); setNotice("");
    try {
      await socialGrowthApi.createAccount({ ...accountForm, externalAccountId: accountForm.externalAccountId.trim() || undefined });
      setAccountForm((v) => ({ ...v, displayName: "", accountUrl: "", externalAccountId: "" }));
      setNotice("Account record created successfully."); await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to create account."); }
    finally { setSaving(false); }
  }
  async function createMetric(event: FormEvent) {
    event.preventDefault(); setSaving(true); setError(""); setNotice("");
    try {
      await socialGrowthApi.createMetric({ ...metricForm, description: metricForm.description.trim() || undefined, unit: metricForm.unit.trim() || "count" });
      setNotice("Metric definition created successfully."); setMetricForm((v) => ({ ...v, key: "", name: "", description: "" })); await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to create metric."); }
    finally { setSaving(false); }
  }
  async function saveAccount(id: string) {
    setSaving(true); setError(""); setNotice("");
    try { await socialGrowthApi.updateAccount(id, { displayName: accountEdit.displayName, accountUrl: accountEdit.accountUrl, externalAccountId: accountEdit.externalAccountId || null }); setEditingAccount(null); setNotice("Account updated."); await load(); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to update account."); }
    finally { setSaving(false); }
  }
  async function toggleAccount(account: SocialAccount) {
    setSaving(true); setError(""); setNotice("");
    try { await socialGrowthApi.updateAccount(account.id, { isActive: !account.isActive }); setNotice(`Account ${!account.isActive ? "activated" : "deactivated"}.`); await load(); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to update account status."); }
    finally { setSaving(false); }
  }
  async function saveMetric(id: string) {
    setSaving(true); setError(""); setNotice("");
    try { await socialGrowthApi.updateMetric(id, { name: metricEdit.name, description: metricEdit.description || null, unit: metricEdit.unit, collectionMethod: metricEdit.collectionMethod }); setEditingMetric(null); setNotice("Metric updated."); await load(); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to update metric."); }
    finally { setSaving(false); }
  }
  async function toggleMetric(metric: MetricDefinition) {
    setSaving(true); setError(""); setNotice("");
    try { await socialGrowthApi.updateMetric(metric.id, { isActive: !metric.isActive }); setNotice(`Metric ${!metric.isActive ? "activated" : "deactivated"}.`); await load(); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to update metric status."); }
    finally { setSaving(false); }
  }

  const fieldLabel = (label: string, child: ReactNode) => <label className="block space-y-1.5"><span className={`text-xs font-semibold ${muted}`}>{label}</span>{child}</label>;
  const platformSelect = (value: SocialPlatform, onChange: (v: SocialPlatform) => void) => <select className={input} value={value} onChange={(e) => onChange(e.target.value as SocialPlatform)}>{SOCIAL_PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}</select>;

  return <main dir={isArabic ? "rtl" : "ltr"} className={`min-h-full space-y-6 ${heading}`}>
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><div className={`mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide ${muted}`}><Settings2 size={15} className="text-[#2eb5bc]" /> NTRA · CONFIGURATION</div><h1 className="text-2xl font-bold tracking-tight sm:text-[28px]">{isArabic ? "إدارة الحسابات والمقاييس" : "Accounts & Metrics Management"}</h1><p className={`mt-2 text-sm ${muted}`}>{isArabic ? "أنشئ سجلات الحسابات ومقاييس الأداء وعدّلها." : "Register social account records and configure the metrics you want to track."}</p></div><div className="flex gap-2"><Link href="/social-growth" className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold"><ArrowLeft size={15} />Dashboard</Link><button onClick={() => void load()} disabled={loading} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#47759c] px-4 text-sm font-semibold text-white disabled:opacity-60"><RefreshCw size={15} className={loading ? "animate-spin" : ""} />Refresh</button></div></header>
    {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={18} className="shrink-0" />{error}</div>}
    {notice && <div role="status" className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"><CheckCircle2 size={18} className="shrink-0" />{notice}</div>}
    <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <form onSubmit={createAccount} className={`space-y-4 rounded-2xl border p-5 shadow-sm shadow-slate-900/[0.02] ${panel}`}><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#edf3f7] text-[#47759c]"><Globe2 size={19} /></div><div><h2 className="font-bold">Create account record</h2><p className={`mt-1 text-xs ${muted}`}>This does not connect to the social platform.</p></div></div><div className="grid gap-4 sm:grid-cols-2">{fieldLabel("Platform", platformSelect(accountForm.platform, (platform) => setAccountForm((v) => ({ ...v, platform }))))}{fieldLabel("Display name", <input required maxLength={160} className={input} placeholder="Test Instagram Account" value={accountForm.displayName} onChange={(e) => setAccountForm((v) => ({ ...v, displayName: e.target.value }))} />)}{fieldLabel("Account URL", <input required type="url" className={input} placeholder="https://example.com/test-account" value={accountForm.accountUrl} onChange={(e) => setAccountForm((v) => ({ ...v, accountUrl: e.target.value }))} />)}{fieldLabel("External account ID (optional)", <input className={input} placeholder="TEST-001" value={accountForm.externalAccountId} onChange={(e) => setAccountForm((v) => ({ ...v, externalAccountId: e.target.value }))} />)}</div><button disabled={saving} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#47759c] px-4 text-sm font-semibold text-white disabled:opacity-60"><Plus size={16} />Create account</button></form>
      <form onSubmit={createMetric} className={`space-y-4 rounded-2xl border p-5 shadow-sm shadow-slate-900/[0.02] ${panel}`}><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#e8f8f8] text-[#219da5]"><Settings2 size={19} /></div><div><h2 className="font-bold">Create metric definition</h2><p className={`mt-1 text-xs ${muted}`}>Use MANUAL to enter test snapshots.</p></div></div><div className="grid gap-4 sm:grid-cols-2">{fieldLabel("Platform", platformSelect(metricForm.platform, (platform) => setMetricForm((v) => ({ ...v, platform }))))}{fieldLabel("Metric key", <input required pattern="[a-zA-Z0-9_]{1,80}" className={input} placeholder="followers" value={metricForm.key} onChange={(e) => setMetricForm((v) => ({ ...v, key: e.target.value.toLowerCase() }))} />)}{fieldLabel("Metric name", <input required maxLength={120} className={input} placeholder="Followers" value={metricForm.name} onChange={(e) => setMetricForm((v) => ({ ...v, name: e.target.value }))} />)}{fieldLabel("Unit", <input maxLength={30} className={input} placeholder="count" value={metricForm.unit} onChange={(e) => setMetricForm((v) => ({ ...v, unit: e.target.value }))} />)}{fieldLabel("Collection method", <select className={input} value={metricForm.collectionMethod} onChange={(e) => setMetricForm((v) => ({ ...v, collectionMethod: e.target.value as CollectionMethod }))}><option value="MANUAL">MANUAL</option><option value="API">API</option><option value="UNAVAILABLE">UNAVAILABLE</option></select>)}{fieldLabel("Description (optional)", <input className={input} placeholder="Follower count" value={metricForm.description} onChange={(e) => setMetricForm((v) => ({ ...v, description: e.target.value }))} />)}</div><button disabled={saving} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#47759c] px-4 text-sm font-semibold text-white disabled:opacity-60"><Plus size={16} />Create metric</button></form>
    </section>
    <section className={`overflow-hidden rounded-2xl border shadow-sm shadow-slate-900/[0.02] ${panel}`}><div className={`flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${line}`}><div><h2 className="font-bold">Social accounts</h2><p className={`mt-1 text-xs ${muted}`}>Edit account details or change active status.</p></div><span className={`text-xs ${muted}`}>{accounts.length} records</span></div><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-start text-sm"><thead className={isDark ? "bg-slate-950/60 text-slate-400" : "bg-slate-50 text-slate-500"}><tr>{["Platform", "Account", "External ID", "Status", "Actions"].map((h) => <th key={h} className="px-5 py-3 text-start text-xs font-semibold">{h}</th>)}</tr></thead><tbody>{accounts.map((account) => <tr key={account.id} className={`border-t ${line}`}><td className="px-5 py-4"><span className="rounded-lg bg-[#edf3f7] px-2 py-1 text-xs font-semibold text-[#47759c]">{account.platform}</span></td><td className="px-5 py-4">{editingAccount === account.id ? <div className="space-y-2"><input aria-label="Account display name" className={input} value={accountEdit.displayName} onChange={(e) => setAccountEdit((v) => ({ ...v, displayName: e.target.value }))} /><input aria-label="Account URL" className={input} value={accountEdit.accountUrl} onChange={(e) => setAccountEdit((v) => ({ ...v, accountUrl: e.target.value }))} /><input aria-label="External account ID" className={input} value={accountEdit.externalAccountId} onChange={(e) => setAccountEdit((v) => ({ ...v, externalAccountId: e.target.value }))} /></div> : <><div className="font-semibold">{account.displayName}</div><a href={account.accountUrl} target="_blank" rel="noreferrer" className="mt-1 block max-w-xs truncate text-xs text-[#47759c]">{account.accountUrl}</a></>}</td><td className={`px-5 py-4 text-xs ${muted}`}>{account.externalAccountId || "—"}</td><td className="px-5 py-4"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${account.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{account.isActive ? "Active" : "Inactive"}</span></td><td className="px-5 py-4"><div className="flex flex-wrap gap-2">{editingAccount === account.id ? <><button onClick={() => void saveAccount(account.id)} disabled={saving} className="rounded-lg bg-[#47759c] px-3 py-2 text-xs font-semibold text-white">Save</button><button onClick={() => setEditingAccount(null)} className="rounded-lg border px-3 py-2 text-xs">Cancel</button></> : <button onClick={() => { setEditingAccount(account.id); setAccountEdit({ displayName: account.displayName, accountUrl: account.accountUrl, externalAccountId: account.externalAccountId || "" }); }} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold">Edit</button>}<button onClick={() => void toggleAccount(account)} disabled={saving} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold">{account.isActive ? "Deactivate" : "Activate"}</button></div></td></tr>)}{!loading && accounts.length === 0 && <tr><td colSpan={5} className={`px-5 py-10 text-center ${muted}`}>No account records yet.</td></tr>}</tbody></table></div></section>
    <section className={`overflow-hidden rounded-2xl border shadow-sm shadow-slate-900/[0.02] ${panel}`}><div className={`flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${line}`}><div><h2 className="font-bold">Metric definitions</h2><p className={`mt-1 text-xs ${muted}`}>Only active MANUAL metrics can receive manual snapshots.</p></div><select aria-label="Filter metrics by platform" className={`${input} sm:max-w-xs`} value={metricPlatform} onChange={(e) => setMetricPlatform(e.target.value as SocialPlatform | "")}><option value="">All platforms</option>{SOCIAL_PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}</select></div><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-start text-sm"><thead className={isDark ? "bg-slate-950/60 text-slate-400" : "bg-slate-50 text-slate-500"}><tr>{["Platform", "Key", "Metric", "Method", "Status", "Actions"].map((h) => <th key={h} className="px-5 py-3 text-start text-xs font-semibold">{h}</th>)}</tr></thead><tbody>{metrics.map((metric) => <tr key={metric.id} className={`border-t ${line}`}><td className="px-5 py-4 text-xs font-semibold text-[#47759c]">{metric.platform}</td><td className={`px-5 py-4 font-mono text-xs ${muted}`}>{metric.key}</td><td className="px-5 py-4">{editingMetric === metric.id ? <div className="space-y-2"><input aria-label="Metric name" className={input} value={metricEdit.name} onChange={(e) => setMetricEdit((v) => ({ ...v, name: e.target.value }))} /><input aria-label="Metric description" className={input} value={metricEdit.description} onChange={(e) => setMetricEdit((v) => ({ ...v, description: e.target.value }))} /><input aria-label="Metric unit" className={input} value={metricEdit.unit} onChange={(e) => setMetricEdit((v) => ({ ...v, unit: e.target.value }))} /><select aria-label="Metric collection method" className={input} value={metricEdit.collectionMethod} onChange={(e) => setMetricEdit((v) => ({ ...v, collectionMethod: e.target.value as CollectionMethod }))}><option value="MANUAL">MANUAL</option><option value="API">API</option><option value="UNAVAILABLE">UNAVAILABLE</option></select></div> : <><div className="font-semibold">{metric.name}</div><div className={`mt-1 text-xs ${muted}`}>{metric.description || "No description"} · {metric.unit}</div></>}</td><td className="px-5 py-4"><span className="rounded-full bg-[#e8f8f8] px-2 py-1 text-xs font-semibold text-[#167f85]">{metric.collectionMethod}</span></td><td className="px-5 py-4"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${metric.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{metric.isActive ? "Active" : "Inactive"}</span></td><td className="px-5 py-4"><div className="flex flex-wrap gap-2">{editingMetric === metric.id ? <><button onClick={() => void saveMetric(metric.id)} disabled={saving} className="rounded-lg bg-[#47759c] px-3 py-2 text-xs font-semibold text-white">Save</button><button onClick={() => setEditingMetric(null)} className="rounded-lg border px-3 py-2 text-xs">Cancel</button></> : <button onClick={() => { setEditingMetric(metric.id); setMetricEdit({ name: metric.name, description: metric.description || "", unit: metric.unit, collectionMethod: metric.collectionMethod }); }} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold">Edit</button>}<button onClick={() => void toggleMetric(metric)} disabled={saving} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold">{metric.isActive ? "Deactivate" : "Activate"}</button></div></td></tr>)}{!loading && metrics.length === 0 && <tr><td colSpan={6} className={`px-5 py-10 text-center ${muted}`}>No metric definitions found.</td></tr>}</tbody></table></div></section>
    <p className={`text-xs ${muted}`}>API access is enforced by the backend. This page requires Social Media Growth administrator permission for create/update operations.</p>
  </main>;
}
