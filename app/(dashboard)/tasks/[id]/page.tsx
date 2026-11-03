"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, CalendarDays, Clock3, MessageSquare, MoreHorizontal, UserRound, Folder, ArrowRight } from "lucide-react";
import { useDashboardLayout } from "@/app/components/DashboardLayout";
import { useGetTaskByIdQuery, useSubmitTaskCompletionMutation } from "@/app/services/tasks-api";
import { useAuth } from "@/app/context/AuthContext";
import { TaskActivityEvent, TaskDetail } from "@/app/interfaces/task-details-interface";
import { getTaskDetailTranslations } from "@/app/translations/dashboard/tasks/task-details-tran";
import SubmitTaskReviewModal from "@/app/components/SubmitTaskModal";




type TaskDetailPageProps = {
  task?: TaskDetail;
  onBack?: () => void;
  onToggle?: (title: string) => void;
};

export default function TaskDetailPage({ task, onBack }: TaskDetailPageProps) {
  const router = useRouter();
  const { isArabic, darkMode } = useDashboardLayout();
  const { user } = useAuth();
  const rtl = isArabic;
  const dark = darkMode;
  const params = useParams<{ id: string | string[] }>();
  const routeId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { data: taskResponse, isLoading, isError } = useGetTaskByIdQuery(routeId ?? "", { skip: !routeId });
  const apiTask = taskResponse?.task;
  const [submitTaskCompletion, { isLoading: isSubmittingTask }] =
    useSubmitTaskCompletionMutation();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const normalizeRole = (value: unknown): string => {
    const rawValue =
      typeof value === "string"
        ? value
        : value && typeof value === "object"
          ? ((value as { name?: unknown; code?: unknown }).name ??
            (value as { name?: unknown; code?: unknown }).code)
          : "";

    return typeof rawValue === "string"
      ? rawValue.trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ")
      : "";
  };

  const userRole = normalizeRole(user?.role);
  const isEmployee = ["employee"].includes(userRole);
  const isSupervisor = userRole === "supervisor";
  const isSuperSupervisor = ["super supervisor", "supersupervisor", "supervisor supervisor"].includes(userRole.replace(/\s+/g, " "));
  const currentUserId = typeof user?.id === "string" ? user.id : "";

  // The detailed API response includes createdBy.role and assignee.
  // A supervisor may submit only when the task was created by a Super Supervisor
  // and the task is assigned to the current supervisor.
  const creator = apiTask?.createdBy as
    | { id?: unknown; role?: unknown; roleName?: unknown; name?: unknown; code?: unknown }
    | null
    | undefined;
  const creatorRole = normalizeRole(
    creator?.role ?? creator?.roleName ?? creator?.code,
  );
  const createdBySuperSupervisor = ["super supervisor", "supersupervisor", "supervisor supervisor"].includes(creatorRole.replace(/\s+/g, " "));

  const assignedToCurrentUser =
    !!currentUserId &&
    (apiTask?.assignee?.id === currentUserId ||
      (apiTask as { assigneeId?: unknown } | undefined)?.assigneeId === currentUserId);

  const supervisorCanSubmit =
    isSupervisor && assignedToCurrentUser && createdBySuperSupervisor;
  const currentStatus = String(apiTask?.status ?? task?.status ?? "").toUpperCase();
  const canSubmitForReview =
    !isSuperSupervisor &&
    (isEmployee || supervisorCanSubmit) &&
    ["DISPATCHED", "REWORK"].includes(currentStatus);
  // The API response is currently typed loosely in the RTK Query service.
  const taskEvents = (taskResponse?.events ?? []) as TaskActivityEvent[];
  const resolvedTask: TaskDetail | undefined = task ?? (apiTask ? {
    id: apiTask.id,
    title: apiTask.title,
    // The provided API response has no priority field, so don't invent one.
    priority: "—",
    priorityClass: "",
    project: apiTask.team?.name ?? "—",
    checked: apiTask.status === "COMPLETED",
    date: apiTask.deadline ? new Date(apiTask.deadline).toLocaleDateString(
      isArabic ? "ar-EG" : "en-US",
      { year: "numeric", month: "short", day: "numeric" },
    ) : "—",
    description: apiTask.description ?? "",
    assignee: apiTask.assignee?.fullName ?? "",
    createdBy: apiTask.createdBy?.fullName ?? "",
    status: apiTask.status ?? "",
  } : undefined);

  const t = getTaskDetailTranslations(rtl);

  const pageHeader = {
    kicker: t.pageKicker,
    title: t.pageTitle,
    description: t.pageDescription,
  };

  const mainText = dark ? "text-slate-100" : "text-slate-900";
  const muted = dark ? "text-slate-400" : "text-slate-500";
  const card = dark ? "border-slate-700 bg-slate-800 shadow-black/10" : "border-slate-200 bg-white shadow-slate-200/50";
  const soft = dark ? "bg-slate-900/70" : "bg-slate-50";
  const border = dark ? "border-slate-700" : "border-slate-100";

  // Load the task by the dynamic route ID when no parent-provided task exists.
  if (!resolvedTask) {
    return (
      <section
        dir={rtl ? "rtl" : "ltr"}
        lang={rtl ? "ar" : "en"}
        className={`min-w-0 space-y-5 rounded-2xl border p-6 sm:p-8 ${mainText} ${card}`}
      >
        <button
          type="button"
          onClick={() => (onBack ? onBack() : router.back())}
          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${card} ${dark ? "hover:bg-slate-700" : "hover:bg-slate-50"}`}
        >
          <ArrowLeft size={16} className={rtl ? "rotate-180" : ""} />
          {rtl ? "العودة" : "Go back"}
        </button>
        <h1 className="text-xl font-bold">
          {isLoading
            ? (rtl ? "جاري تحميل المهمة..." : "Loading task...")
            : (rtl ? "المهمة غير متاحة" : "Task unavailable")}
        </h1>
        <p className={`text-sm leading-6 ${muted}`}>
          {isLoading
            ? (rtl ? "يتم جلب تفاصيل المهمة من الخادم." : "Fetching task details from the server.")
            : isError
              ? (rtl ? "تعذر تحميل المهمة. تأكد من المعرّف وصلاحيات الوصول ثم حاول مرة أخرى." : "Could not load this task. Check the task ID and your access, then try again.")
              : !routeId
                ? (rtl ? "لم يتم العثور على معرّف المهمة في رابط الصفحة." : "The task ID was not found in the page URL.")
                : (rtl ? "لم يتم العثور على المهمة المطلوبة." : "The requested task was not found.")}
        </p>
      </section>
    );
  }


  return (
    <section dir={rtl ? "rtl" : "ltr"} lang={rtl ? "ar" : "en"} className={`min-w-0 space-y-6 pb-8 ${mainText}`}>
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0 flex-1 text-start">
            <span className="mb-2 inline-flex items-center gap-2 text-xs font-semibold text-[#238e94] sm:text-sm">
            <Check size={14} />
            {pageHeader.kicker}
            </span>

            <h1 className={`text-xl font-bold tracking-tight sm:text-2xl ${mainText}`}>
            {pageHeader.title}
            </h1>

            <p className={`mt-2 max-w-2xl text-xs leading-6 sm:text-sm ${muted}`}>
            {pageHeader.description}
            </p>
        </div>

        <button
            type="button"
            onClick={() => (onBack ? onBack() : router.back())}
            className="inline-flex shrink-0 items-center gap-2 pt-1 text-sm font-semibold text-[#238e94] transition-colors hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 dark:hover:text-teal-300"
        >
            <span>{t.back}</span>
            <ArrowRight size={16} className={rtl ? "rotate-180" : ""}/>
        </button>
      </div>

      <header className={`relative flex min-w-0 flex-row items-center justify-between gap-4 overflow-hidden rounded-2xl border p-4 shadow-sm sm:min-h-30 sm:px-6 sm:py-5 ${dark ? "border-slate-700 bg-linear-to-l from-slate-800 to-slate-900" : "border-[#d7e9ed] bg-linear-to-l from-[#edf8fa] via-[#f8fcfc] to-white"}`}>
        <div className="pointer-events-none absolute -top-10 right-0 h-24 w-24 rounded-full border border-teal-500/10" />
        
        <div className={`relative z-10 flex min-w-0 flex-1 items-center gap-3 `}>
          
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#4a8ca6] to-[#27aeb8] text-white shadow-lg shadow-teal-900/10 sm:h-12 sm:w-12">
            <Check size={21} />
          </span>
          
          <div className="min-w-0 flex-1">
            <h1 className="wrap-break-word text-base font-semibold tracking-tight sm:text-lg">{resolvedTask.title}</h1>
            <p className={`mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px] sm:text-xs ${muted}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-sky-700/70" />
              <span>{resolvedTask.project}</span>
              <span>·</span>
              <span>{t.updated}</span>
            </p>
          </div>
          
        </div>

        {canSubmitForReview && currentStatus !== "SUBMITTED" && currentStatus !== "COMPLETED" && (
          <div className="relative z-10 flex shrink-0 flex-col items-end gap-1">
            <button
              type="button"
              disabled={isSubmittingTask}
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
            >
              <span>{isSubmittingTask ? t.sending : t.markDone}</span>
              <Check size={16} />
            </button>
          </div>
        )}
      </header>

      <div className="grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
        <div className="min-w-0 space-y-5">
          <article className={`rounded-2xl border p-5 shadow-sm sm:p-6 ${card}`}>
            <div className="mb-5 flex items-center justify-between gap-3"><div className="flex items-center gap-3"><span className={`flex h-9 w-9 items-center justify-center rounded-xl ${soft} text-teal-500`}><MessageSquare size={17} /></span><h2 className="font-bold">{t.description}</h2></div><button type="button" aria-label={rtl ? "خيارات" : "Options"} className={`rounded-lg p-2 ${muted} ${dark ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}><MoreHorizontal size={19} /></button></div>
            <p className={`text-sm leading-7 ${muted}`}>{resolvedTask.description || t.descriptionText}</p>
          </article>

          <article className={`rounded-2xl border p-5 shadow-sm sm:p-6 ${card}`}>
            <div className="mb-5 flex items-center gap-3"><span className={`flex h-9 w-9 items-center justify-center rounded-xl ${soft} text-teal-500`}><Clock3 size={17} /></span><h2 className="font-bold">{t.activity}</h2></div>
            <div className="space-y-5">
              {taskEvents.length > 0 ? (
                [...taskEvents]
                  .sort(
                    (a, b) =>
                      new Date(b.occurredAt ?? 0).getTime() -
                      new Date(a.occurredAt ?? 0).getTime(),
                  )
                  .map((event) => {
                    const actorName =
                      (event.actorId === apiTask?.assigneeId
                        ? apiTask?.assignee?.fullName
                        : event.actorId === apiTask?.createdById
                          ? apiTask?.createdBy?.fullName
                          : null) ??
                      (rtl ? "مستخدم" : "User");
                    const eventLabel: Record<string, string> = rtl
                      ? {
                          TASK_APPROVED: "تمت الموافقة على المهمة",
                          TASK_SUBMITTED: "تم تسليم المهمة للمراجعة",
                          EMAIL_DISPATCH_CONFIRMED: "تم تأكيد إرسال التكليف",
                          TASK_CREATED: "تم إنشاء المهمة",
                          TASK_REWORK_REQUESTED: "طُلب إجراء تعديلات على المهمة",
                          TASK_UPDATED: "تم تحديث المهمة",
                        }
                      : {
                          TASK_APPROVED: "Task approved",
                          TASK_SUBMITTED: "Task submitted for review",
                          EMAIL_DISPATCH_CONFIRMED: "Task dispatch confirmed",
                          TASK_CREATED: "Task created",
                          TASK_REWORK_REQUESTED: "Changes requested",
                          TASK_UPDATED: "Task updated",
                        };
                    const eventDate = event.occurredAt
                      ? new Date(event.occurredAt).toLocaleString(
                          rtl ? "ar-EG" : "en-US",
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          },
                        )
                      : "—";
                    const initials = actorName
                      .split(/\\s+/)
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")
                      .toLocaleUpperCase();

                    return (
                      <div key={event.id} className="flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-500/15 text-xs font-bold text-teal-600">
                          {initials || <UserRound size={16} />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <strong className="text-sm">{actorName}</strong>
                          <p className={`mt-1 text-sm ${mainText}`}>
                            {eventLabel[event.eventType] ??
                              event.eventType.replaceAll("_", " ")}
                          </p>
                          <small className={`mt-1 block text-xs ${muted}`}>
                            {eventDate}
                          </small>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <p className={`text-sm ${muted}`}>
                  {rtl ? "لا يوجد نشاط مسجل لهذه المهمة حتى الآن." : "No activity has been recorded for this task yet."}
                </p>
              )}
            </div>
          </article>
        </div>

        <aside className="min-w-0 space-y-5">
          <article className={`rounded-2xl border p-5 shadow-sm ${card}`}>
            <h2 className="mb-5 font-bold">{t.details}</h2>
            <div className={`flex items-center justify-between gap-3 border-b py-4 first:pt-0 ${border}`}><span className={`flex items-center gap-2 text-sm ${muted}`}><UserRound size={15} />{t.owner}</span><strong className="flex items-center gap-2 text-sm">{resolvedTask.assignee || (rtl ? "غير محدد" : "Unassigned")}</strong></div>
            <div className={`flex items-center justify-between gap-3 border-b py-4 ${border}`}><span className={`flex items-center gap-2 text-sm ${muted}`}><CalendarDays size={15} />{t.due}</span><strong className="text-sm text-amber-500">{resolvedTask.date}</strong></div>
            <div className={`flex items-center justify-between gap-3 border-b py-4 ${border}`}><span className={`flex items-center gap-2 text-sm ${muted}`}><Clock3 size={15} />{t.status}</span><strong className={`inline-flex items-center gap-2 text-sm ${resolvedTask.checked ? "text-emerald-500" : "text-amber-500"}`}><i className={`h-2 w-2 rounded-full ${ resolvedTask.checked ? "bg-emerald-500" : "bg-amber-500" }`} />{resolvedTask.status === "COMPLETED" ? t.completed : resolvedTask.status === "SUBMITTED" ? (rtl ? "قيد المراجعة" : "Under review") : resolvedTask.status === "DISPATCHED" ? (rtl ? "قيد التنفيذ" : "In Progress") : resolvedTask.status === "REWORK" ? (rtl ? "مطلوب تعديل" : "Requires changes") : resolvedTask.status ? resolvedTask.status.replaceAll("_", " ") : (resolvedTask.checked ? t.completed : t.inProgress)} </strong></div>
            <div className="flex items-center justify-between gap-3 pt-4"><span className={`flex items-center gap-2 text-sm ${muted}`}><Folder size={15} />{t.project}</span><strong className="flex min-w-0 items-center gap-2 text-sm"><i className="h-2 w-2 shrink-0 rounded-full bg-blue-500" /><span className="truncate">{resolvedTask.project}</span></strong></div>
          </article>

          {/* <article className={`rounded-2xl border p-5 shadow-sm ${card}`}>
            <div className="mb-4 flex items-center justify-between gap-3"><div className="flex items-center gap-3"><span className={`flex h-9 w-9 items-center justify-center rounded-xl ${soft} text-teal-500`}><Paperclip size={16} /></span><h2 className="font-bold">{t.attachments}</h2></div><button type="button" aria-label={t.addSubtask} className={`rounded-lg p-2 ${muted} ${dark ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}><Plus size={17} /></button></div>
            <div className={`flex min-w-0 items-center gap-3 rounded-xl border p-3 ${border} ${soft}`}><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-xs font-bold text-violet-500">FIG</span><div className="min-w-0 flex-1"><strong className="block truncate text-xs">homepage-wireframes.fig</strong><small className={`mt-1 block text-xs ${muted}`}>8.4 MB · {rtl ? "منذ ساعتين" : "2 hours ago"}</small></div><MoreHorizontal size={17} className={muted} /></div>
            <div className={`mt-2 flex min-w-0 items-center gap-3 rounded-xl border p-3 ${border} ${soft}`}><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-xs font-bold text-rose-500">PDF</span><div className="min-w-0 flex-1"><strong className="block truncate text-xs">content-brief.pdf</strong><small className={`mt-1 block text-xs ${muted}`}>1.2 MB · {rtl ? "أمس" : "Yesterday"}</small></div><MoreHorizontal size={17} className={muted} /></div>
          </article> */}
        </aside>
      </div>
      <SubmitTaskReviewModal
        open={isReviewModalOpen}
        isArabic={rtl}
        darkMode={dark}
        isSubmitting={isSubmittingTask}
        translations={t}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={async (completionNote) => {
          if (!routeId) {
            toast.error(t.sendError);
            return;
          }

          try {
            await submitTaskCompletion({
              taskId: routeId,
              completionNote,
            }).unwrap();
            toast.success(t.sendSuccess);
            setIsReviewModalOpen(false);
          } catch (error) {
            const message =
              typeof error === "object" &&
              error !== null &&
              "data" in error &&
              typeof (error as { data?: { message?: unknown } }).data?.message === "string"
                ? (error as { data: { message: string } }).data.message
                : t.sendError;
            toast.error(message);
          }
        }}
      />
    </section>
  );
}
