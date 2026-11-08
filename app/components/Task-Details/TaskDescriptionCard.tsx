import { MessageSquare } from "lucide-react";

type TaskDescriptionCardProps = { description?: string | null; title: string; emptyText: string; darkMode: boolean };

export default function TaskDescriptionCard({ description, title, emptyText, darkMode }: TaskDescriptionCardProps) {

    return (
        <article className={`rounded-2xl border p-5 shadow-sm sm:p-6 ${ darkMode ? "border-slate-700 bg-slate-800 shadow-black/10" : "border-slate-200 bg-white shadow-slate-200/50" }`} >
            {/* "Task Description Card" With Rounded Borders, Border Color, Padding, Shadow, and Dark Mode Styling */}
            <div className="mb-5 flex items-center gap-3">
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${ darkMode ? "bg-slate-900/70" : "bg-slate-50" } text-teal-500`} ><MessageSquare size={17} aria-hidden="true" /></span>
                <h2 className="font-bold">{title}</h2>
            </div>

            {/* "Task Description" With Pre-Wrap, Word Wrap, Text Size, Line Height, and Dark Mode Styling */}
            <p className={`whitespace-pre-wrap wrap-break-word text-sm leading-7 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{description?.trim() || emptyText}</p>
        
        </article>
    );
}
