import { TaskTranslations } from "@/app/interfaces/tasks-interface";
import { Check, CheckCircle2, Clock3, Sparkles, XCircle } from "lucide-react";


export type TaskStatistics = { total: number; inProgress: number; completed: number; needsReview: number; rework: number; completionRate: number };

export default function MyTasksStatistics({ stats, t, isDark }: {
  stats: TaskStatistics; t: TaskTranslations; isDark: boolean;
}) {
  const surface = isDark ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-white";
  const heading = isDark ? "text-gray-100" : "text-gray-900";
  const muted = isDark ? "text-gray-400" : "text-gray-500";
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
      <article className={`flex items-center gap-3 rounded-xl border p-4 sm:p-5 ${surface}`}>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500"><Check size={19} /></span>
        <div className="min-w-0"><strong className={`block text-xl font-bold tabular-nums ${heading}`}>{stats.total}</strong><small className={`text-xs ${muted}`}>{t.allTasks}</small></div>
      </article>
      <article className={`flex items-center gap-3 rounded-xl border p-4 sm:p-5 ${surface}`}>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500"><Clock3 size={19} /></span>
        <div className="min-w-0 flex-1"><strong className={`block text-xl font-bold tabular-nums ${heading}`}>{stats.inProgress}</strong><small className={`text-xs ${muted}`}>{t.inProgress}</small></div>
        <span className={`text-[10px] sm:text-xs ${muted}`}>{t.thisWeek}</span>
      </article>
      <article className={`flex items-center gap-3 rounded-xl border p-4 sm:p-5 ${surface}`}>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500"><Sparkles size={19} /></span>
        <div className="min-w-0 flex-1"><strong className={`block text-xl font-bold tabular-nums ${heading}`}>{stats.completed}</strong><small className={`text-xs ${muted}`}>{t.completed}</small></div>
        <span className="whitespace-nowrap text-[10px] font-semibold text-emerald-500 sm:text-xs">{stats.completionRate}% {t.progress}</span>
      </article>
      <article className={`flex min-w-0 items-center gap-3 rounded-xl border p-3 sm:p-5 ${surface}`}>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isDark ? "bg-violet-500/15 text-violet-300" : "bg-violet-500/10 text-violet-600"}`}><CheckCircle2 size={19} /></span>
        <div className="min-w-0"><strong className={`block text-xl font-bold tabular-nums ${heading}`}>{stats.needsReview}</strong><small className={`block text-xs leading-5 ${muted}`}>{t.needsReview}</small></div>
      </article>
      <article className={`flex min-w-0 items-center gap-3 rounded-xl border p-3 sm:p-5 ${surface}`}>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isDark ? "bg-rose-500/15 text-rose-300" : "bg-rose-500/10 text-rose-600"}`}><XCircle size={19} /></span>
        <div className="min-w-0"><strong className={`block text-xl font-bold tabular-nums ${heading}`}>{stats.rework}</strong><small className={`block text-xs leading-5 ${muted}`}>{t.rework}</small></div>
      </article>
    </div>
  );
}
