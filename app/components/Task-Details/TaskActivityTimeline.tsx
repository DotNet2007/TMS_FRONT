import { Clock3, UserRound } from "lucide-react";
import { formatTaskDateTime, getInitials } from "../../utils/task-formatters";
import { TaskActivityEvent, TaskApiDetails } from "@/app/interfaces/task-details-interface";

type TaskActivityTimelineProps = { events: TaskActivityEvent[]; task?: TaskApiDetails; isArabic: boolean; darkMode: boolean; title: string };

const EVENT_LABELS: Record<string, { ar: string; en: string }> = {
  TASK_APPROVED: { ar: "تمت الموافقة على المهمة", en: "Task approved" },
  TASK_SUBMITTED: { ar: "تم تسليم المهمة للمراجعة", en: "Task submitted for review" },
  EMAIL_DISPATCH_CONFIRMED: { ar: "تم تأكيد إرسال التكليف", en: "Task dispatch confirmed" },
  TASK_CREATED: { ar: "تم إنشاء المهمة", en: "Task created" },
  TASK_REWORK_REQUESTED: { ar: "طُلب إجراء تعديلات على المهمة", en: "Changes requested" },
  TASK_UPDATED: { ar: "تم تحديث المهمة", en: "Task updated" },
};

export default function TaskActivityTimeline({ events, task, isArabic, darkMode, title }: TaskActivityTimelineProps) {
  
    const sortedEvents = [...events].sort((a, b) => new Date(b.occurredAt ?? 0).getTime() - new Date(a.occurredAt ?? 0).getTime());

    const muted = darkMode ? "text-slate-400" : "text-slate-500";
    const mainText = darkMode ? "text-slate-100" : "text-slate-900";

    return (
        <article className={`rounded-2xl border p-5 shadow-sm sm:p-6 ${ darkMode ? "border-slate-700 bg-slate-800 shadow-black/10" : "border-slate-200 bg-white shadow-slate-200/50" }`} >
            {/* "Task Activity Timeline" With Rounded Borders, Border Color, Padding, Shadow, and Dark Mode Styling */}
            <div className="mb-5 flex items-center gap-3">
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${ darkMode ? "bg-slate-900/70" : "bg-slate-50" } text-teal-500`} > <Clock3 size={17} aria-hidden="true" /> </span>
                <h2 className="font-bold">{title}</h2>
            </div>

            {/* "Task Activity Timeline" With Conditional Rendering Based on the Presence of Sorted Events */}
            {sortedEvents.length > 0 ? (
                <ol className="space-y-5">
                {sortedEvents.map((event, index) => {
                    const actorName =
                    (event.actorId === task?.assigneeId
                        ? task?.assignee?.fullName
                        : event.actorId === task?.createdById
                        ? task?.createdBy?.fullName
                        : null) || (isArabic ? "مستخدم" : "User");

                    const eventType = String(event.eventType ?? "");
                    const eventLabel =
                    EVENT_LABELS[eventType]?.[isArabic ? "ar" : "en"] ??
                    (eventType.replaceAll("_", " ") ||
                        (isArabic ? "تحديث على المهمة" : "Task update"));

                    return (
                    <li key={event.id ?? `${eventType}-${index}`} className="flex items-start gap-3">
                        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-500/15 text-xs font-bold text-teal-600">
                        {getInitials(actorName) || <UserRound size={16} />}
                        {index < sortedEvents.length - 1 && (
                            <span
                            className={`absolute inset-s-1/2 top-11 h-5 w-px -translate-x-1/2 ${
                                darkMode ? "bg-slate-700" : "bg-slate-200"
                            }`}
                            aria-hidden="true"
                            />
                        )}
                        </span>

                        <div className="min-w-0 flex-1">
                        <strong className="text-sm">{actorName}</strong>
                        <p className={`mt-1 text-sm ${mainText}`}>{eventLabel}</p>
                        <small className={`mt-1 block text-xs ${muted}`}>
                            {formatTaskDateTime(event.occurredAt, isArabic)}
                        </small>
                        </div>
                    </li>
                    );
                })}
                </ol>
            ) : (
                <p className={`text-sm ${muted}`}>
                {isArabic
                    ? "لا يوجد نشاط مسجل لهذه المهمة حتى الآن."
                    : "No activity has been recorded for this task yet."}
                </p>
            )}
        </article>
    );
}
