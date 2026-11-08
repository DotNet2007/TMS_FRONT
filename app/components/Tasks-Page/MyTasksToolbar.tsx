import { Search } from "lucide-react";

import type { TaskStatistics } from "./MyTasksStatistics";
import { SupervisorTaskView, TaskFilter, TaskTranslations } from "@/app/interfaces/tasks-interface";

const filters: TaskFilter[] = ["all", "progress", "completed", "needsReview", "rework"];

export default function MyTasksToolbar({
  query, onQueryChange, status, onStatusChange, supervisorTaskView,
  onSupervisorViewChange, isSupervisorMode, isRTL, isDark, t, stats,
}: {
  query: string; onQueryChange: (value: string) => void;
  status: TaskFilter; onStatusChange: (value: TaskFilter) => void;
  supervisorTaskView: SupervisorTaskView; onSupervisorViewChange: (value: SupervisorTaskView) => void;
  isSupervisorMode: boolean; isRTL: boolean; isDark: boolean;
  t: TaskTranslations; stats: TaskStatistics;
}) {
  const mutedText = isDark ? "text-gray-400" : "text-gray-500";
  const headingText = isDark ? "text-gray-100" : "text-gray-900";
  const tabBase = "inline-flex w-full min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-[11px] font-medium leading-4 transition sm:w-auto sm:px-3 sm:py-2 sm:text-sm";
  const tabInactive = isDark ? "text-gray-400 hover:bg-gray-700 hover:text-gray-100" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900";
  const counts: Record<TaskFilter, number> = { all: stats.total, progress: stats.inProgress, completed: stats.completed, needsReview: stats.needsReview, rework: stats.rework };
  const labels: Record<TaskFilter, string> = { all: t.allTasks, progress: t.inProgress, completed: t.completed, needsReview: t.needsReview, rework: t.rework };
  return (
    <div className={`border-b p-3 sm:p-5 ${isDark ? "border-gray-700" : "border-gray-200"}`}>
      <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="shrink-0 text-start">
          <h2 className={`whitespace-nowrap text-base font-bold ${headingText}`}>{t.taskList}</h2>
          <p className={`mt-1 whitespace-nowrap text-xs ${mutedText}`}>{stats.total} {t.visibleTasks}</p>
        </div>
        <div className="flex w-full min-w-0 flex-1 flex-col gap-3 xl:max-w-5xl">
          <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center">
            <label className="relative block w-full min-w-0 flex-1 lg:min-w-70 xl:min-w-90">
              <span className="sr-only">{isRTL ? "البحث في المهام" : "Search tasks"}</span>
              <Search aria-hidden="true" size={18} className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${isRTL ? "right-3" : "left-3"} ${mutedText}`} />
              <input type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder={t.searchPlaceholder}
                className={`h-11 w-full rounded-xl border ${isRTL ? "pr-10 pl-3" : "pl-10 pr-3"} text-sm outline-none transition focus:border-[#238e94] focus:ring-2 focus:ring-[#238e94]/15 ${isDark ? "border-gray-700 bg-gray-900 text-gray-100 placeholder:text-gray-500" : "border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400"}`} />
            </label>
            {isSupervisorMode && (
              <div className={`grid grid-cols-2 gap-1 rounded-xl p-1 ${isDark ? "bg-slate-700" : "bg-slate-100"}`}>
                <button type="button" aria-pressed={supervisorTaskView === "myTasks"} onClick={() => onSupervisorViewChange("myTasks")}
                  className={`min-w-0 whitespace-normal rounded-lg px-2 py-2.5 text-[11px] leading-4 font-semibold transition sm:px-3 sm:text-sm ${supervisorTaskView === "myTasks" ? "bg-teal-500 text-white shadow-sm" : `${isDark ? "text-slate-300" : "text-slate-600"} hover:text-teal-500`}`}>{t.myTasksButton}</button>
                <button type="button" aria-pressed={supervisorTaskView === "assignedByMe"} onClick={() => onSupervisorViewChange("assignedByMe")}
                  className={`min-w-0 whitespace-normal rounded-lg px-2 py-2.5 text-[11px] leading-4 font-semibold transition sm:px-3 sm:text-sm ${supervisorTaskView === "assignedByMe" ? "bg-teal-500 text-white shadow-sm" : `${isDark ? "text-slate-300" : "text-slate-600"} hover:text-teal-500`}`}>{t.assignedByMeButton}</button>
              </div>
            )}
          </div>
          <div className="w-full min-w-0">
            <div className={`grid w-full min-w-0 grid-cols-2 gap-1.5 rounded-xl border p-1.5 sm:flex sm:flex-wrap sm:items-center ${isDark ? "border-gray-700 bg-gray-900/70" : "border-gray-200 bg-gray-50"}`} aria-label={t.status}>
              {filters.map((filter) => {
                const activeTone = filter === "needsReview"
                  ? isDark ? "bg-violet-500/15 text-violet-300" : "bg-violet-50 text-violet-700"
                  : filter === "rework"
                    ? isDark ? "bg-rose-500/15 text-rose-300" : "bg-rose-50 text-rose-700"
                    : isDark ? "bg-teal-500/15 text-teal-300" : "bg-teal-50 text-[#238e94]";
                return <button key={filter} type="button" aria-pressed={status === filter} onClick={() => onStatusChange(filter)}
                  className={`${tabBase} ${filter === "rework" ? "col-span-2 sm:col-span-1" : ""} whitespace-normal sm:whitespace-nowrap ${status === filter ? activeTone : tabInactive}`}>
                  {labels[filter]}<span className="ms-1 text-[10px]">{counts[filter]}</span>
                </button>;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
