import { getTaskStatusMeta } from "@/app/utils/task-status.helper";

type TaskStatusBadgeProps = { status?: string | null; isArabic: boolean; darkMode: boolean; completedLabel: string; inProgressLabel: string; };

export default function TaskStatusBadge({ status, isArabic, darkMode, completedLabel, inProgressLabel }: TaskStatusBadgeProps) {
    
    const meta = getTaskStatusMeta(status, isArabic, { completed: completedLabel, inProgress: inProgressLabel });

    const colorClasses: Record<string, string> = {
        emerald: darkMode ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-700",
        blue: darkMode ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-700",
        amber: darkMode ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-700",
        rose: darkMode ? "bg-rose-500/10 text-rose-400" : "bg-rose-50 text-rose-700",
        slate: darkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600",
    };

    return (
        <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ${ colorClasses[meta.color] ?? colorClasses.slate }`} >
            <i className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />{meta.label}
        </span>
    );
}
