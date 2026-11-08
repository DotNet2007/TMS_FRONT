import { Check } from "lucide-react";

type TaskDetailHeaderProps = { title: string; project: string; canSubmit: boolean; isSubmitting: boolean; submitLabel: string; submittingLabel: string; onSubmit: () => void; isArabic: boolean; darkMode: boolean; };

export default function TaskDetailHeader({ title, project, canSubmit, isSubmitting, submitLabel, submittingLabel, onSubmit, darkMode }: TaskDetailHeaderProps) {

    return (
        <header className={`relative flex min-w-0 flex-col items-stretch justify-between gap-4 overflow-hidden rounded-2xl border p-4 shadow-sm sm:min-h-30 sm:flex-row sm:items-center sm:px-6 sm:py-5 ${ darkMode ? "border-slate-700 bg-linear-to-l from-slate-800 to-slate-900" : "border-[#d7e9ed] bg-linear-to-l from-[#edf8fa] via-[#f8fcfc] to-white" }`}>
            {/* "Background Circle" With Absolute Positioning, Top Offset, Right Offset, Height, Width, Rounded Borders, and Border Color */}
            <div className="pointer-events-none absolute -top-10 right-0 h-24 w-24 rounded-full border border-teal-500/10" />
            
            {/* "Title and Project" With Relative Positioning, Z-Index, Flexbox, Minimum Width, Flex Grow, and Gap */}
            <div className="relative z-10 flex min-w-0 flex-1 items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#4a8ca6] to-[#27aeb8] text-white shadow-lg shadow-teal-900/10 sm:h-12 sm:w-12"> <Check size={21} aria-hidden="true" /> </span>
                <div className="min-w-0 flex-1">
                    <h2 className="wrap-break-word text-base font-semibold tracking-tight sm:text-lg"> {title}</h2>
                    <p className={`mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px] sm:text-xs ${ darkMode ? "text-slate-400" : "text-slate-500" }`} ><span className="h-1.5 w-1.5 rounded-full bg-sky-700/70" /><span>{project}</span></p>
                </div>
            </div>

            {/* "Submit Button" With Relative Positioning, Z-Index, Flexbox, and Gap */}
            {canSubmit && (
                <div className="relative z-10 flex shrink-0 flex-col items-stretch gap-1 sm:items-end">
                    <button type="button" disabled={isSubmitting} onClick={onSubmit} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4" ><span>{isSubmitting ? submittingLabel : submitLabel}</span><Check size={16} aria-hidden="true" /></button>
                </div>
            )}
        </header>
    );
}
