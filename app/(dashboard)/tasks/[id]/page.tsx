"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useDashboardLayout } from "@/app/components/DashboardLayout";
import { useGetTaskByIdQuery, useSubmitTaskCompletionMutation } from "@/app/services/tasks-api";
import { useAuth } from "@/app/context/AuthContext";
import type { TaskActivityEvent, TaskApiDetails, TaskDetail, TaskDetailsResponse } from "@/app/interfaces/task-details-interface";
import { getTaskDetailTranslations } from "@/app/translations/dashboard/tasks/task-details-tran";
import SubmitTaskReviewModal from "@/app/components/SubmitTaskModal";
import normalizeRole from "@/app/utils/normalize-role-helper";
import { useTaskPermissions } from "@/app/hooks/useTaskPermissions";
import TaskDetailHeader from "@/app/components/Task-Details/TaskDetailHeader";
import TaskDescriptionCard from "@/app/components/Task-Details/TaskDescriptionCard";
import TaskActivityTimeline from "@/app/components/Task-Details/TaskActivityTimeline";
import TaskInformationCard from "@/app/components/Task-Details/TaskInformationCard";
import TaskDetailSkeleton from "@/app/components/Task-Details/TaskDetailSkeleton";
import PageHeader from "@/app/components/PageHeader";

type TaskDetailPageProps = { task?: TaskDetail; onBack?: () => void };

export default function TaskDetailPage({ task, onBack }: TaskDetailPageProps) {
    const router = useRouter();
    const { isArabic, darkMode } = useDashboardLayout();
    const { user } = useAuth();
    const rtl = isArabic;
    const dark = darkMode;
    const params = useParams<{ id: string | string[] }>();
    const routeId = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const { data: rawTaskResponse, isLoading, isFetching, isError, refetch } = useGetTaskByIdQuery(routeId ?? "", { skip: !routeId });
    const taskResponse = rawTaskResponse as TaskDetailsResponse | undefined;
    const apiTask = taskResponse?.task;
    const [submitTaskCompletion, { isLoading: isSubmittingTask }] = useSubmitTaskCompletionMutation();
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const t = getTaskDetailTranslations(rtl);
    const { canSubmitForReview } = useTaskPermissions({userRole: normalizeRole(user?.role), currentUserId: typeof user?.id === "string" ? user.id : "", task: apiTask });
    const resolvedTask: TaskDetail | undefined = apiTask ? mapApiTaskToTaskDetail(apiTask, task, rtl) : task;
    const taskEvents: TaskActivityEvent[] = taskResponse?.events ?? [];

    // "Sending Review Request" Function to Handle Task Submission for Review with Error Handling and Toast Notifications
    async function sendForReview(completionNote: string) {
      if (!routeId) {
        toast.error(t.sendError);
        return;
      }
      try {
        await submitTaskCompletion({ taskId: routeId, completionNote }).unwrap();
        toast.success(t.sendSuccess);
        setIsReviewModalOpen(false);
      } catch (error: unknown) {
        const serverMessage = typeof error === "object" && error !== null && "data" in error && typeof (error as { data?: { message?: unknown } }).data?.message === "string" ? (error as { data: { message: string } }).data.message : undefined;
        toast.error(serverMessage || t.sendError);
      }
    }

    const mainText = dark ? "text-slate-100" : "text-slate-900";
    const muted = dark ? "text-slate-400" : "text-slate-500";
    const card = dark ? "border-slate-700 bg-slate-800 shadow-black/10" : "border-slate-200 bg-white shadow-slate-200/50";

    function goBack() {
      if (onBack) onBack();
      else router.back();
    }

    // "Loading State" Handling: If the task is loading and not yet available, display a loading message with appropriate styling based on the language direction (RTL or LTR) and dark mode settings.
    if (isLoading && !task) {

      return ( <TaskDetailSkeleton isArabic={rtl} darkMode={dark}/> );

    }

    // "Error State" Handling: If the task is not found or there is an error fetching it, display an error message with appropriate styling based on the language direction (RTL or LTR) and dark mode settings.
    if (!resolvedTask) {

      return (
        <section dir={rtl ? "rtl" : "ltr"} lang={rtl ? "ar" : "en"} className={`min-w-0 space-y-5 rounded-2xl border p-6 sm:p-8 ${mainText} ${card}`} >
          <button type="button" onClick={goBack} className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${ dark ? "border-slate-700 hover:bg-slate-700" : "border-slate-200 hover:bg-slate-50" }`} ><ArrowRight size={16} className={rtl ? "" : "rotate-180"} aria-hidden="true" />{rtl ? "العودة" : "Go back"}</button>
          <h1 className="text-xl font-bold">{rtl ? "المهمة غير متاحة" : "Task unavailable"}</h1>
          <p className={`text-sm leading-6 ${muted}`}>
            {isError ? 
            rtl ? "تعذر تحميل المهمة. تأكد من المعرّف وصلاحيات الوصول ثم حاول مرة أخرى." : "Could not load this task. Check the task ID and your access, then try again." : 
            !routeId ?
            rtl ?  "لم يتم العثور على معرّف المهمة في رابط الصفحة." : "The task ID was not found in the page URL." : 
            rtl ?  "لم يتم العثور على المهمة المطلوبة." : "The requested task was not found."}
          </p>

          {routeId && isError && (
            <button type="button" onClick={() => void refetch()} className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700" >{rtl ? "إعادة المحاولة" : "Try again"}</button>
          )}
        </section>
      );
    }

    // "Main Render" of the Task Detail Page: Display the task details, including the header, description, activity timeline, and information card, with appropriate styling based on the language direction (RTL or LTR) and dark mode settings. Also includes a modal for submitting the task for review.
    return (
      
      <section dir={rtl ? "rtl" : "ltr"} lang={rtl ? "ar" : "en"} className={`min-w-0 space-y-6 pb-8 ${mainText}`} aria-busy={isFetching}>
        
        {/* "Component Header" With Title, Description, And back Button */}
        <div className="flex min-w-0 items-start justify-between gap-4">
          
          <PageHeader
            isRTL={rtl}
            isDark={dark}
            kicker={t.details}
            title={t.details}
            description={t.pageDescription}
          />

          <button type="button" onClick={goBack} className="inline-flex shrink-0 items-center gap-2 pt-1 text-sm font-semibold text-[#238e94] transition-colors hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 dark:hover:text-teal-300">
            <span>{t.back}</span>
            <ArrowLeft size={16} className={rtl ? "" : "rotate-180"} aria-hidden="true"/>
          </button>
        
        </div>

        {/* "Task Detail Header" With Title, Project, Updated Label, Submit Button, and Submit Modal */}
        <TaskDetailHeader title={resolvedTask.title} project={resolvedTask.project} canSubmit={canSubmitForReview} isSubmitting={isSubmittingTask} submitLabel={t.markDone} submittingLabel={t.sending} onSubmit={() => setIsReviewModalOpen(true)} isArabic={rtl} darkMode={dark}/>

        {/* "Task Detail Body" With Description Card, Activity Timeline, and Information Card */}
        <div className="grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
          
          <div className="min-w-0 space-y-5">
            {/* "Task Description Card" With Description, Title, Empty Text, and Dark Mode */}
            <TaskDescriptionCard description={resolvedTask.description} title={t.description} emptyText={t.descriptionText} darkMode={dark}/>
            {/* "Task Activity Timeline" With Events, Task, Empty Text, and Dark Mode */}
            <TaskActivityTimeline events={taskEvents} task={apiTask} isArabic={rtl} darkMode={dark} title={t.activity}/>
          </div>

          <aside className="min-w-0">
            {/* "Task Information Card" With Task, Title, Labels, Dark Mode, and Arabic Mode */}
            <TaskInformationCard task={resolvedTask} title={t.details} labels={{ owner: t.owner, due: t.due, status: t.status, project: t.project, completed: t.completed, inProgress: t.inProgress, }} isArabic={rtl} darkMode={dark}/>
          </aside>
        </div>

        {/* "Submit Task Review Modal" With Open State, Arabic Mode, Dark Mode, Submitting State, Translations, Close Handler, and Submit Handler */}
        <SubmitTaskReviewModal open={isReviewModalOpen} isArabic={rtl} darkMode={dark} isSubmitting={isSubmittingTask} translations={t} onClose={() => setIsReviewModalOpen(false)} onSubmit={sendForReview} />
      </section>
    );
  }

  // "Mapping Task API Response to Task Detail" Function: Converts the API response for a task into the internal TaskDetail format, applying fallback values and formatting the deadline date based on the language direction (RTL or LTR).
  function mapApiTaskToTaskDetail( apiTask: TaskApiDetails, fallback: TaskDetail | undefined, isArabic: boolean ): TaskDetail {
    
    const deadline = apiTask.deadline ? new Date(apiTask.deadline) : undefined;

    const formattedDate = deadline && !Number.isNaN(deadline.getTime()) ? deadline.toLocaleDateString(isArabic ? "ar-EG" : "en-US", { year: "numeric", month: "short", day: "numeric" }) : fallback?.date ?? "—";

    return {
      ...fallback,
      id: apiTask.id ?? fallback?.id ?? "",
      title: apiTask.title ?? fallback?.title ?? "",
      project: apiTask.team?.name ?? fallback?.project ?? "—",
      checked: String(apiTask.status ?? fallback?.status ?? "").toUpperCase() === "COMPLETED",
      date: formattedDate,
      description: apiTask.description ?? fallback?.description ?? "",
      assignee: apiTask.assignee?.fullName ?? fallback?.assignee ?? "",
      createdBy: apiTask.createdBy?.fullName ?? fallback?.createdBy ?? "",
      status: apiTask.status ?? fallback?.status ?? "",
    };
}
