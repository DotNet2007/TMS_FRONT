import { TaskDetail } from "@/app/interfaces/task-details-interface";
import { CalendarDays, Clock3, Folder, UserRound } from "lucide-react";
import TaskStatusBadge from "./TaskStatusBadge";

type TaskInformationCardProps = { task: TaskDetail; title: string; labels: { owner: string; due: string; status: string; project: string; completed: string; inProgress: string }; isArabic: boolean; darkMode: boolean };

export default function TaskInformationCard({ task, title, labels, isArabic, darkMode }: TaskInformationCardProps) {

    const muted = darkMode ? "text-slate-400" : "text-slate-500";
    const border = darkMode ? "border-slate-700" : "border-slate-100";

    return (
        <article className={`rounded-2xl border p-5 shadow-sm ${ darkMode ? "border-slate-700 bg-slate-800 shadow-black/10" : "border-slate-200 bg-white shadow-slate-200/50" }`} >
            <h2 className="mb-5 font-bold">{title}</h2>

            {/* "Task Information Card" With Rounded Borders, Border Color, Padding, Shadow, and Dark Mode Styling */}
            <div className={`flex items-center justify-between gap-3 border-b py-4 first:pt-0 ${border}`}>
                <span className={`flex items-center gap-2 text-sm ${muted}`}><UserRound size={15} aria-hidden="true" />{labels.owner}</span>
                <strong className="text-end text-sm">{task.assignee || (isArabic ? "غير محدد" : "Unassigned")}</strong>
            </div>

            {/* "Task Information Card" With Rounded Borders, Border Color, Padding, Shadow, and Dark Mode Styling */}
            <div className={`flex items-center justify-between gap-3 border-b py-4 ${border}`}>
                <span className={`flex items-center gap-2 text-sm ${muted}`}><CalendarDays size={15} aria-hidden="true" />{labels.due}</span>
                <strong className="text-end text-sm text-amber-500">{task.date || "—"}</strong>
            </div>

            {/* "Task Information Card" With Rounded Borders, Border Color, Padding, Shadow, and Dark Mode Styling */}
            <div className={`flex items-center justify-between gap-3 border-b py-4 ${border}`}>
                <span className={`flex items-center gap-2 text-sm ${muted}`}><Clock3 size={15} aria-hidden="true" />{labels.status}</span>
                <TaskStatusBadge status={task.status} isArabic={isArabic} darkMode={darkMode} completedLabel={labels.completed} inProgressLabel={labels.inProgress} />
            </div>

            {/* "Task Information Card" With Rounded Borders, Border Color, Padding, Shadow, and Dark Mode Styling */}
            <div className="flex items-center justify-between gap-3 pt-4">
                <span className={`flex items-center gap-2 text-sm ${muted}`}><Folder size={15} aria-hidden="true" />{labels.project}</span>
                <strong className="flex min-w-0 items-center gap-2 text-sm"><i className="h-2 w-2 shrink-0 rounded-full bg-blue-500" /><span className="truncate">{task.project || "—"}</span></strong>
            </div>

        </article>
    );
}
