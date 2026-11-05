"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  CalendarDays,
  Check,
  Clock3,
  Sparkles,
  Search,
  X,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useDashboardLayout } from "@/app/components/DashboardLayout";

import { useAuth } from "@/app/context/AuthContext";

import {
  useGetAssignedByMeQuery,
  useGetMyTasksQuery,
  useGetTaskSubmissionsQuery,
  useLazyGetTaskSubmissionsQuery,
  useReviewTaskSubmissionMutation,
  type TaskStatus,
  type TaskSubmission,
} from "@/app/services/tasks-api";


import DynamicReportTable, { TableColumn } from "@/app/components/DynamicTable";
import LoadingPage from "./loading";
import { useDebounce } from "@/app/hooks/useDebounce";

type Language = "ar" | "en";

// --------------------------------------------------
// Date helpers
// --------------------------------------------------

function getLocalDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function displayDate(
  value: string | null | undefined,
  language: Language,
) {
  if (!value) return "—";

  // Parse date-only values as local dates to avoid timezone day shifts.
  const dateOnlyMatch = value.match(/^(\\d{4})-(\\d{2})-(\\d{2})$/);
  const date = dateOnlyMatch
    ? new Date(
        Number(dateOnlyMatch[1]),
        Number(dateOnlyMatch[2]) - 1,
        Number(dateOnlyMatch[3]),
      )
    : new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString(
    language === "ar" ? "ar-EG" : "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );
}

type Task = {
  id: string;
  title: string;
  // description?: string | null;
  project: string;
  assigneeName: string;
  checked: boolean;
  date: string;
  apiStatus: TaskStatus;
};

export default function MyTasksPage() {
  const router = useRouter();
  const { lang, isArabic, darkMode } = useDashboardLayout();
  const { user, isLoading: authLoading } = useAuth();
  const isRTL = isArabic || lang === "ar";
  const isDark = darkMode;
  const language: Language = isRTL ? "ar" : "en";

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const [status, setStatus] = useState<"all" | "progress" | "completed" | "needsReview" | "rework">("all");
  const [reviewTaskId, setReviewTaskId] = useState<string | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [supervisorTaskView, setSupervisorTaskView] = useState<"myTasks" | "assignedByMe">("assignedByMe");
  const pageSize = 10;

  // Normalize role whether the /me endpoint returns a string or a role object.
  const roleValue: unknown = user?.role;
  const roleFromObject =
    typeof roleValue === "object" && roleValue !== null
      ? [
          (roleValue as { name?: unknown }).name,
          (roleValue as { code?: unknown }).code,
        ].find((value): value is string => typeof value === "string" && value.trim().length > 0) ?? ""
      : "";
  const userRole = (typeof roleValue === "string" ? roleValue : roleFromObject)
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ");

  const isEmployee = ["employee"].includes(userRole);
  const isSupervisor = userRole === "supervisor";
  const isSuperSupervisor = ["super supervisor", "supersupervisor"].includes(userRole);
  // Explicit employee/supervisor roles take precedence over stale admin flags.
  
  // Admin / Super Supervisor: assigned-by-me only.
  // Supervisor: load both endpoints, but display one list at a time.
  // Employee: my-tasks only.
  const shouldLoadAssignedByMe = isSuperSupervisor || isSupervisor;
  const shouldLoadMyTasks = isSupervisor || isEmployee;
  const isSupervisorMode = isSupervisor;

  // Use backend pagination and filtering. The API already supports page,
  // limit, search and status, so never download the entire task collection.
  const apiStatusFilter: Record<typeof status, string | undefined> = {
    all: undefined,
    progress: "DISPATCHED",
    completed: "COMPLETED",
    needsReview: "SUBMITTED",
    rework: "REWORK",
  };

  const requestArgs = {
    page: currentPage,
    limit: pageSize,
    search: debouncedQuery.trim() || undefined,
    status: apiStatusFilter[status],
  };

  const assignedQuery = useGetAssignedByMeQuery(requestArgs, {
    skip: authLoading || !shouldLoadAssignedByMe,
  });
  const myTasksQuery = useGetMyTasksQuery(requestArgs, {
    skip: authLoading || !shouldLoadMyTasks,
  });

  const assignedResponse = assignedQuery.data;
  const myResponse = myTasksQuery.data;
  const isLoading = authLoading ||
    (shouldLoadAssignedByMe && assignedQuery.isLoading) ||
    (shouldLoadMyTasks && myTasksQuery.isLoading);
  const isError =
    (!authLoading && shouldLoadAssignedByMe && assignedQuery.isError) ||
    (!authLoading && shouldLoadMyTasks && myTasksQuery.isError) ||
    (!authLoading && !shouldLoadAssignedByMe && !shouldLoadMyTasks);
  const refetch = () => {
    if (shouldLoadAssignedByMe) void assignedQuery.refetch();
    if (shouldLoadMyTasks) void myTasksQuery.refetch();
  };

  // Supervisor switches between the two datasets; they are never combined.
  const responseTasks = useMemo(() => {
    if (isSupervisorMode) {
      return supervisorTaskView === "assignedByMe"
        ? assignedResponse?.tasks ?? []
        : myResponse?.tasks ?? [];
    }
    if (shouldLoadAssignedByMe) return assignedResponse?.tasks ?? [];
    if (shouldLoadMyTasks) return myResponse?.tasks ?? [];
    return [];
  }, [
    isSupervisorMode,
    supervisorTaskView,
    assignedResponse?.tasks,
    myResponse?.tasks,
    shouldLoadAssignedByMe,
    shouldLoadMyTasks,
  ]);

  // Use the total reported by the backend statistics when available.
  // This stays accurate even when the task table is paginated.
  const activeResponse = isSupervisorMode
    ? supervisorTaskView === "assignedByMe" ? assignedResponse : myResponse
    : shouldLoadAssignedByMe ? assignedResponse : myResponse;

  const serverTotalCount =
    activeResponse?.statistics?.total ??
    activeResponse?.pagination?.total ??
    activeResponse?.count ??
    activeResponse?.tasks.length ??
    responseTasks.length;

  const [reviewTaskSubmission, { isLoading: isReviewSubmitting }] = useReviewTaskSubmissionMutation();
  const { currentData: reviewSubmissionsData, isFetching: isLoadingReviewSubmissions } =
    useGetTaskSubmissionsQuery(reviewTaskId ?? "", { skip: !reviewTaskId });
  const [fetchTaskSubmissions, { isFetching: isFetchingApprovalSubmissions }] =
    useLazyGetTaskSubmissionsQuery();

  // RTK Query exposes the normalized submissions array. Prefer the newest
  // submission by createdAt; if timestamps are missing, use the last valid item.
  const getLatestSubmissionId = (
    submissions: TaskSubmission[] = reviewSubmissionsData?.submissions ?? [],
  ): string | undefined => {
    const validSubmissions = submissions.filter(
      (submission) => typeof submission?.id === "string" && submission.id.trim().length > 0,
    );

    if (validSubmissions.length === 0) return undefined;

    const submissionsWithDates = validSubmissions.filter(
      (submission) =>
        typeof submission.createdAt === "string" &&
        !Number.isNaN(Date.parse(submission.createdAt)),
    );

    if (submissionsWithDates.length > 0) {
      return [...submissionsWithDates].sort(
        (a, b) => Date.parse(a.createdAt!) - Date.parse(b.createdAt!),
      )[submissionsWithDates.length - 1].id;
    }

    return validSubmissions[validSubmissions.length - 1].id;
  };

  const handleApproveTask = async (taskId: string) => {
    try {
      const result = await fetchTaskSubmissions(taskId).unwrap();
      const submissionId = getLatestSubmissionId(result.submissions ?? []);
      if (!submissionId) {
        window.alert(isRTL ? "لا يوجد تسليم متاح لمراجعته." : "No submission is available to review.");
        return;
      }
      await reviewTaskSubmission({ taskId, submissionId, decision: "APPROVE" }).unwrap();
      setReviewError(null);
    } catch (error) {
      const message = typeof error === "object" && error !== null && "data" in error &&
        typeof (error as { data?: { message?: unknown } }).data?.message === "string"
        ? (error as { data: { message: string } }).data.message
        : (isRTL ? "تعذرت الموافقة على المهمة." : "Could not approve this task.");
      window.alert(message);
    }
  };

  const t = isRTL
    ? {
        kicker: "مساحة مهامك",
        title: "مهامي",
        description: "نظّم أولوياتك وتابع تقدّم مهامك من مكان واحد.",
        searchPlaceholder: "ابحث بعنوان المهمة أو الوصف...",
        myTasksButton: "المهام المسندة إليّ",
        assignedByMeButton: "المهام التي أسندتها للموظفين",
        addTask: "إضافة مهمة",
        allTasks: "كل المهام",
        inProgress: "قيد التنفيذ",
        completed: "مكتملة",
        thisWeek: "هذا الأسبوع",
        progress: "إنجاز",
        taskList: "قائمة المهام",
        visibleTasks: "مهام ظاهرة",
        task: "المهمة",
        dueDate: "تاريخ الاستحقاق",
        responsibleSector: "القطاع المسؤول",
        assignedEmployee: "الموظف المسؤول",
        status: "الحالة",
        reopen: "إعادة فتح",
        completeTask: "إكمال",
        moreOptions: "خيارات إضافية للمهمة",
        emptyTitle: "لا توجد مهام هنا",
        noResults: "لا توجد نتائج تطابق",
        emptyDescription: "ستظهر المهام التي تحمل هذه الحالة هنا.",
        noTeam: "بدون فريق",
        noSector: "غير محدد",
        loadingTasks: "جارٍ تحميل المهام...",
        failedLoad: "تعذر تحميل المهام من الخادم.",
        retry: "إعادة المحاولة",
        completionNotePrompt: "اكتب ملاحظة توضح ما تم إنجازه:",
        submissionNotAllowed: "لا يمكن إرسال المهمة إلا عندما تكون قيد التنفيذ أو معادة للتعديل.",
        needsReview: "تحتاج إلى مراجعة",
        rework: "مطلوب تعديل",
        reviewFeedbackTitle: "إرجاع المهمة للتعديل",
        reviewFeedbackPlaceholder: "اكتب الملاحظات المطلوبة من الموظف...",
        sendFeedback: "إرسال الملاحظات",
        cancel: "إلغاء",
        feedbackRequired: "يرجى كتابة الملاحظات قبل الإرسال.",
      }
    : {
        kicker: "YOUR TASK SPACE",
        title: "My Tasks",
        description: "Organize your priorities and track your progress in one place.",
        searchPlaceholder: "Search by task title or description...",
        myTasksButton: "Tasks Assigned to Me",
        assignedByMeButton: "Tasks I Assigned to Employees",
        addTask: "Add Task",
        allTasks: "All Tasks",
        inProgress: "In Progress",
        completed: "Completed",
        thisWeek: "This week",
        progress: "complete",
        taskList: "Task List",
        visibleTasks: "tasks shown",
        task: "Task",
        dueDate: "Due Date",
        responsibleSector: "Responsible Sector",
        assignedEmployee: "Assigned Employee",
        status: "Status",
        reopen: "Reopen",
        completeTask: "Complete",
        moreOptions: "More options for task",
        emptyTitle: "No tasks here",
        noResults: "No results matching",
        emptyDescription: "Tasks with this status will appear here.",
        noTeam: "No team",
        noSector: "Not set",
        loadingTasks: "Loading tasks...",
        failedLoad: "Could not load tasks from the server.",
        retry: "Retry",
        completionNotePrompt: "Enter a note describing the completed work:",
        submissionNotAllowed: "A task can only be submitted when it is dispatched or returned for rework.",
        needsReview: "Needs Review",
        rework: "Requires Changes",
        reviewFeedbackTitle: "Request changes",
        reviewFeedbackPlaceholder: "Explain what the employee needs to fix...",
        sendFeedback: "Send feedback",
        cancel: "Cancel",
        feedbackRequired: "Please enter feedback before submitting.",
      };

  const mutedText = isDark ? "text-gray-400" : "text-gray-500";
  // Admin and Super Supervisor see the responsible sector; Supervisors see
  // the responsible employee. In a Supervisor's "My Tasks" view, hide reviews.
  // In Supervisor "My Tasks", show the responsible sector, not the employee.
  // Only the "Tasks I Assigned" view identifies the responsible employee.
  const showAssignedEmployee = isSupervisorMode && supervisorTaskView === "assignedByMe";
  // Employees cannot review submissions, so hide the entire Review column for them.
  // Supervisors also hide it in their own-task view; reviewers see it in review-capable views.
  const canReviewTasks = isSuperSupervisor || (isSupervisorMode && supervisorTaskView === "assignedByMe");
  const showReviewColumn = canReviewTasks;
  const getResponsibleDisplay = (task: Task) =>
    showAssignedEmployee ? task.assigneeName : task.project;
  const responsibleColumnLabel = showAssignedEmployee ? t.assignedEmployee : t.responsibleSector;

  // Map the backend response to the fields used by this page.
  const taskList: Task[] = responseTasks.map((task) => {
    const apiStatus = task.status;
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      project: task.team?.name ?? t.noTeam,
      assigneeName: task.assignee?.fullName?.trim() || (isRTL ? "غير محدد" : "Unassigned"),
      checked: apiStatus === "COMPLETED",
      date: task.deadline
        ? getLocalDateString(
            new Date(`${task.deadline.slice(0, 10)}T00:00:00`),
          )
        : "",
      apiStatus,
    };
  });






  // The backend has already applied the selected status, search and page.
  // Do not filter or paginate this page again on the client.
  const filteredTasks = taskList;
  const totalCount =
    activeResponse?.pagination?.total ??
    activeResponse?.count ??
    activeResponse?.statistics?.total ??
    taskList.length;
  const totalPages =
    activeResponse?.pagination?.totalPages ??
    Math.max(1, Math.ceil(totalCount / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const paginatedTasks = filteredTasks;

  const borderColor = isDark ? "border-gray-700" : "border-gray-200";

  // Cards and filter counters use the API aggregate statistics, not the
  // current page's task rows. Local counts are only a fallback for older APIs
  // that do not return the `statistics` object.
  const apiStatistics = activeResponse?.statistics;

  const completed =
    apiStatistics?.completed ??
    taskList.filter((task) => task.apiStatus === "COMPLETED").length;

  const inProgress =
    apiStatistics?.dispatched ??
    taskList.filter((task) =>
      task.apiStatus === "IN_PROGRESS" ||
      task.apiStatus === "DISPATCHED" ||
      task.apiStatus === "READY_TO_DISPATCH"
    ).length;

  const needsReviewCount =
    apiStatistics?.needReview ??
    taskList.filter((task) => task.apiStatus === "SUBMITTED").length;

  const reworkCount =
    apiStatistics?.rework ??
    taskList.filter((task) => task.apiStatus === "REWORK").length;

  const completionRate =
    serverTotalCount > 0
      ? Math.round((completed / serverTotalCount) * 100)
      : 0;

  const surface = isDark
    ? "border-slate-700 bg-slate-800"
    : "border-gray-200 bg-white";
  const headingText = isDark ? "text-gray-100" : "text-gray-900";
  const tabBase =
    "inline-flex w-full min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-[11px] font-medium leading-4 transition sm:w-auto sm:px-3 sm:py-2 sm:text-sm";
  const tabActive = isDark
    ? "bg-teal-500/15 text-teal-300"
    : "bg-teal-50 text-[#238e94]";
  const tabInactive = isDark
    ? "text-gray-400 hover:bg-gray-700 hover:text-gray-100"
    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900";


  // Dynamic columns: the Review column is only included for roles/views
  // that are allowed to review submitted tasks.
  const taskColumns: TableColumn<Task>[] = [
    {
      key: "title",
      header: t.task,
      width: showReviewColumn ? "32%" : "38%",
      render: (task) => (
        <div className="min-w-0">
          <strong
            className={`block wrap-break-word text-xs font-semibold leading-5 sm:text-sm ${
              task.checked ? `line-through ${mutedText}` : headingText
            }`}
          >
            {task.title}
          </strong>
          {/* {task.description && (
            <p className={`mt-1 line-clamp-2 text-xs ${mutedText}`}>
              {task.description}
            </p>
          )} */}
          <div className="mt-2 flex items-center gap-2 md:hidden">
            <CalendarDays size={13} />
            <span className={`text-[11px] ${mutedText}`}>{displayDate(task.date, language)}</span>
          </div>
        </div>
      ),
    },
    {
      key: "date",
      header: t.dueDate,
      width: "16%",
      render: (task) => (
        <span className={`hidden items-center gap-2 text-xs md:inline-flex ${mutedText}`}>
          <CalendarDays size={14} />
          {displayDate(task.date, language)}
        </span>
      ),
    },
    {
      key: "responsible",
      header: responsibleColumnLabel,
      width: showReviewColumn ? "20%" : "24%",
      render: (task) => (
        <span className={`block min-w-0 truncate text-xs ${mutedText}`}>
          {getResponsibleDisplay(task) || t.noSector}
        </span>
      ),
    },
    {
      key: "status",
      header: t.status,
      width: "16%",
      render: (task) => (
        <span
          className={`inline-flex w-fit items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-medium ${
            task.checked
              ? isDark
                ? "bg-emerald-500/10 text-emerald-300"
                : "bg-emerald-50 text-emerald-700"
              : task.apiStatus === "SUBMITTED"
                ? isDark
                  ? "bg-violet-500/15 text-violet-300"
                  : "bg-violet-50 text-violet-700"
                : task.apiStatus === "REWORK"
                  ? isDark
                    ? "bg-rose-500/10 text-rose-300"
                    : "bg-rose-50 text-rose-700"
                  : isDark
                    ? "bg-amber-500/10 text-amber-300"
                    : "bg-amber-50 text-amber-700"
          }`}
        >
          <i
            className={`h-1.5 w-1.5 rounded-full ${
              task.checked
                ? "bg-emerald-500"
                : task.apiStatus === "SUBMITTED"
                  ? "bg-violet-500"
                  : task.apiStatus === "REWORK"
                    ? "bg-rose-500"
                    : "bg-amber-500"
            }`}
          />
          {task.checked
            ? t.completed
            : task.apiStatus === "SUBMITTED"
              ? isRTL
                ? "بانتظار المراجعة"
                : "Awaiting review"
              : task.apiStatus === "READY_TO_DISPATCH"
                ? isRTL
                  ? "بانتظار الإرسال"
                  : "Awaiting dispatch"
                : task.apiStatus === "REWORK"
                  ? isRTL
                    ? "مطلوب تعديل"
                    : "Rework requested"
                  : task.apiStatus === "CANCELLED"
                    ? isRTL
                      ? "ملغاة"
                      : "Cancelled"
                    : t.inProgress}
        </span>
      ),
    },
    ...(showReviewColumn
      ? [
          {
            key: "review",
            header: isRTL ? "المراجعة" : "Review",
            width: "16%",
            render: (task: Task) => (
              <div className="flex items-center gap-2">
                {task.apiStatus === "SUBMITTED" &&
                (isSupervisor || isSuperSupervisor) ? (
                  <>
                    <button
                      type="button"
                      aria-label={isRTL ? "اعتماد المهمة" : "Approve task"}
                      title={isRTL ? "اعتماد المهمة" : "Approve task"}
                      disabled={isReviewSubmitting || isFetchingApprovalSubmissions}
                      onClick={(event) => {
                        event.stopPropagation();
                        void handleApproveTask(task.id);
                      }}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:text-emerald-300"
                    >
                      <CheckCircle2 size={18} />
                    </button>
                    <button
                      type="button"
                      aria-label={isRTL ? "إرجاع المهمة للتعديل" : "Request task changes"}
                      title={isRTL ? "إرجاع المهمة للتعديل" : "Request changes"}
                      onClick={(event) => {
                        event.stopPropagation();
                        setReviewTaskId(task.id);
                        setReviewFeedback("");
                        setReviewError(null);
                        setIsReviewModalOpen(true);
                      }}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-600 transition hover:bg-rose-500/20 dark:text-rose-300"
                    >
                      <XCircle size={18} />
                    </button>
                  </>
                ) : (
                  <span className={`text-xs ${mutedText}`}>—</span>
                )}
              </div>
            ),
          } satisfies TableColumn<Task>,
        ]
      : []),
  ];

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      lang={isRTL ? "ar" : "en"}
      className={`min-w-0 space-y-6 transition-colors duration-300 ${
        isDark ? "text-gray-100" : "text-gray-900"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <span className="mb-2 inline-flex items-center gap-2 text-xs font-semibold text-teal-500 sm:text-sm">
            <Check size={14} />
            {t.kicker}
          </span>
          <h1 className={`text-xl font-bold tracking-tight sm:text-2xl ${headingText}`}>
            {t.title}
          </h1>
          <p className={`mt-2 text-xs leading-6 sm:text-sm ${mutedText}`}>
            {t.description}
          </p>
        </div>

      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        <article className={`flex items-center gap-3 rounded-xl border p-4 sm:p-5 ${surface}`}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <Check size={19} />
          </span>
          <div className="min-w-0">
            <strong className={`block text-xl font-bold tabular-nums ${headingText}`}>
              {serverTotalCount}
            </strong>
            <small className={`text-xs ${mutedText}`}>{t.allTasks}</small>
          </div>
        </article>

        <article className={`flex items-center gap-3 rounded-xl border p-4 sm:p-5 ${surface}`}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <Clock3 size={19} />
          </span>
          <div className="min-w-0 flex-1">
            <strong className={`block text-xl font-bold tabular-nums ${headingText}`}>
              {inProgress}
            </strong>
            <small className={`text-xs ${mutedText}`}>{t.inProgress}</small>
          </div>
          <span className={`text-[10px] sm:text-xs ${mutedText}`}>{t.thisWeek}</span>
        </article>

        <article className={`flex items-center gap-3 rounded-xl border p-4 sm:p-5 ${surface}`}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <Sparkles size={19} />
          </span>
          <div className="min-w-0 flex-1">
            <strong className={`block text-xl font-bold tabular-nums ${headingText}`}>
              {completed}
            </strong>
            <small className={`text-xs ${mutedText}`}>{t.completed}</small>
          </div>
          <span className="whitespace-nowrap text-[10px] font-semibold text-emerald-500 sm:text-xs">
            {completionRate}% {t.progress}
          </span>
        </article>

        <article className={`flex min-w-0 items-center gap-3 rounded-xl border p-3 sm:p-5 ${surface}`}>
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isDark ? "bg-violet-500/15 text-violet-300" : "bg-violet-500/10 text-violet-600"
          }`}>
            <CheckCircle2 size={19} />
          </span>
          <div className="min-w-0">
            <strong className={`block text-xl font-bold tabular-nums ${headingText}`}>
              {needsReviewCount}
            </strong>
            <small className={`block text-xs leading-5 ${mutedText}`}>{t.needsReview}</small>
          </div>
        </article>

        <article className={`flex min-w-0 items-center gap-3 rounded-xl border p-3 sm:p-5 ${surface}`}>
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isDark ? "bg-rose-500/15 text-rose-300" : "bg-rose-500/10 text-rose-600"
          }`}>
            <XCircle size={19} />
          </span>
          <div className="min-w-0">
            <strong className={`block text-xl font-bold tabular-nums ${headingText}`}>
              {reworkCount}
            </strong>
            <small className={`block text-xs leading-5 ${mutedText}`}>{t.rework}</small>
          </div>
        </article>
      </div>

      <div className={`min-w-0 overflow-hidden rounded-xl border shadow-sm ${surface}`}>
  
        <div className={`border-b p-3 sm:p-5 ${isDark ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            {/* Title — Right on desktop */}
            <div
              className="shrink-0 text-start "
              
            >
              <h2 className={`whitespace-nowrap text-base font-bold ${headingText}`}>
                {t.taskList}
              </h2>

              <p className={`mt-1 whitespace-nowrap text-xs ${mutedText}`}>
                {totalCount} {t.visibleTasks}
              </p>
            </div>

            {/* Responsive search and filters */}
            <div className="flex w-full min-w-0 flex-1 flex-col gap-3 xl:max-w-5xl">
              <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center">
                {/* Wide search input with a directional search icon */}
                <label className="relative block w-full min-w-0 flex-1 lg:min-w-70 xl:min-w-90">
                  <span className="sr-only">
                    {isRTL ? "البحث في المهام" : "Search tasks"}
                  </span>
                  <Search
                    aria-hidden="true"
                    size={18}
                    className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${
                      isRTL ? "right-3" : "left-3"
                    } ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder={t.searchPlaceholder}
                    className={`h-11 w-full rounded-xl border ${
                      isRTL ? "pr-10 pl-3" : "pl-10 pr-3"
                    } text-sm outline-none transition focus:border-[#238e94] focus:ring-2 focus:ring-[#238e94]/15 ${
                      isDark
                        ? "border-gray-700 bg-gray-900 text-gray-100 placeholder:text-gray-500"
                        : "border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400"
                    }`}
                  />
                </label>

                
                {isSupervisorMode && (
                  <div
                    className={`grid grid-cols-2 gap-1 rounded-xl p-1 ${
                      isDark ? "bg-slate-700" : "bg-slate-100"
                    }`}
                  >
                    <button
                      type="button"
                      aria-pressed={supervisorTaskView === "myTasks"}
                      onClick={() => {
                        setSupervisorTaskView("myTasks");
                        setCurrentPage(1);
                        setStatus("all");
                      }}
                      className={`min-w-0 whitespace-normal rounded-lg px-2 py-2.5 text-[11px] leading-4 font-semibold transition sm:px-3 sm:text-sm ${
                        supervisorTaskView === "myTasks"
                          ? "bg-teal-500 text-white shadow-sm"
                          : `${isDark ? "text-slate-300" : "text-slate-600"} hover:text-teal-500`
                      }`}
                    >
                      {t.myTasksButton}
                    </button>

                    <button
                      type="button"
                      aria-pressed={supervisorTaskView === "assignedByMe"}
                      onClick={() => {
                        setSupervisorTaskView("assignedByMe");
                        setCurrentPage(1);
                        setStatus("all");
                      }}
                      className={`min-w-0 whitespace-normal rounded-lg px-2 py-2.5 text-[11px] leading-4 font-semibold transition sm:px-3 sm:text-sm ${
                        supervisorTaskView === "assignedByMe"
                          ? "bg-teal-500 text-white shadow-sm"
                          : `${isDark ? "text-slate-300" : "text-slate-600"} hover:text-teal-500`
                      }`}
                    >
                      {t.assignedByMeButton}
                    </button>
                  </div>
                )}

              </div>

              {/* Filters wrap naturally on small screens; no forced horizontal overflow */}
              <div className="w-full min-w-0">
                <div
                  className={`grid w-full min-w-0 grid-cols-2 gap-1.5 rounded-xl border p-1.5 sm:flex sm:flex-wrap sm:items-center ${
                    isDark
                      ? "border-gray-700 bg-gray-900/70"
                      : "border-gray-200 bg-gray-50"
                  }`}
                  role="tablist"
                  aria-label={t.status}
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={status === "all"}
                    onClick={() => { setStatus("all"); setCurrentPage(1); }}
                    className={`${tabBase} whitespace-normal sm:whitespace-nowrap ${
                      status === "all" ? tabActive : tabInactive
                    }`}
                  >
                    {t.allTasks}
                    <span className="ms-1 text-[10px]">{totalCount}</span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={status === "progress"}
                    onClick={() => { setStatus("progress"); setCurrentPage(1); }}
                    className={`${tabBase} whitespace-normal sm:whitespace-nowrap ${
                      status === "progress" ? tabActive : tabInactive
                    }`}
                  >
                    {t.inProgress}
                    <span className="ms-1 text-[10px]">{inProgress}</span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={status === "completed"}
                    onClick={() => { setStatus("completed"); setCurrentPage(1); }}
                    className={`${tabBase} whitespace-normal sm:whitespace-nowrap ${
                      status === "completed" ? tabActive : tabInactive
                    }`}
                  >
                    {t.completed}
                    <span className="ms-1 text-[10px]">{completed}</span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={status === "needsReview"}
                    onClick={() => { setStatus("needsReview"); setCurrentPage(1); }}
                    className={`${tabBase} whitespace-normal sm:whitespace-nowrap ${
                      status === "needsReview"
                        ? (isDark ? "bg-violet-500/15 text-violet-300" : "bg-violet-50 text-violet-700")
                        : tabInactive
                    }`}
                  >
                    {t.needsReview}
                    <span className="ms-1 text-[10px]">{needsReviewCount}</span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={status === "rework"}
                    onClick={() => { setStatus("rework"); setCurrentPage(1); }}
                    className={`${tabBase} col-span-2 whitespace-normal sm:col-span-1 sm:whitespace-nowrap ${
                      status === "rework"
                        ? (isDark ? "bg-rose-500/15 text-rose-300" : "bg-rose-50 text-rose-700")
                        : tabInactive
                    }`}
                  >
                    {t.rework}
                    <span className="ms-1 text-[10px]">{reworkCount}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          {isLoading ? (
            <LoadingPage lang={language} message={t.loadingTasks} isDark={isDark} />
          ) : isError ? (
            <div className="flex min-h-40 flex-col items-center justify-center gap-3 px-5 py-10 text-center">
              <p className={`text-sm ${mutedText}`}>{t.failedLoad}</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="rounded-lg bg-[#238e94] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1d777c]"
              >
                {t.retry}
              </button>
            </div>
          ) : (
            <DynamicReportTable<Task>
              data={paginatedTasks}
              columns={taskColumns}
              getRowKey={(task) => task.id}
              getRowLabel={(task) =>
                `${isRTL ? "عرض تفاصيل المهمة" : "View task details"}: ${task.title}`
              }
              onRowClick={(task) => router.push(`/tasks/${task.id}`)}
              rowClassName={(task) => (task.checked ? "opacity-75" : "")}
              isDark={isDark}
              isRTL={isRTL}
              surface={surface}
              mutedText={mutedText}
              noResults={
                query.trim()
                  ? `${t.noResults} “${query}”.`
                  : t.emptyTitle
              }
              changeFilters={t.emptyDescription}
              mobileCards
              emptyIcon={
                <span
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
                    isDark
                      ? "bg-teal-500/10 text-teal-300"
                      : "bg-teal-50 text-[#238e94]"
                  }`}
                >
                  <Check size={24} />
                </span>
              }
            />
          )}
        </div>

      {totalPages > 1 && !isLoading && !isError && (
        <nav
          className={`flex min-w-0 flex-col gap-3 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 ${isDark ? "border-gray-700" : "border-gray-200"}`}
          aria-label={isRTL ? "ترقيم الصفحات" : "Pagination"}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <p className={`text-sm ${mutedText}`} aria-live="polite">
            {isRTL
              ? `عرض ${(activePage - 1) * pageSize + 1}–${Math.min(activePage * pageSize, totalCount)} من ${totalCount}`
              : `Showing ${(activePage - 1) * pageSize + 1}–${Math.min(activePage * pageSize, totalCount)} of ${totalCount}`}
          </p>

          <div className="flex items-center justify-between gap-2 sm:justify-end">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, Math.min(page, totalPages) - 1))}
              disabled={activePage <= 1}
              className={`min-h-9 rounded-lg border px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${borderColor} ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            >
              {isRTL ? "السابق" : "Previous"}
            </button>

            <span className={`min-w-20 text-center text-sm ${mutedText}`} aria-live="polite">
              {isRTL
                ? `صفحة ${activePage} من ${totalPages}`
                : `Page ${activePage} of ${totalPages}`}
            </span>

            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, Math.max(1, page) + 1))}
              disabled={activePage >= totalPages}
              className={`min-h-9 rounded-lg border px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${borderColor} ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            >
              {isRTL ? "التالي" : "Next"}
            </button>
          </div>
        </nav>
      )}
      </div>

      {isReviewModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isReviewSubmitting) setIsReviewModalOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-feedback-title"
            dir={isRTL ? "rtl" : "ltr"}
            className={`w-full max-w-lg rounded-2xl border p-5 shadow-2xl ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"}`}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 id="review-feedback-title" className={`text-lg font-bold ${headingText}`}>{t.reviewFeedbackTitle}</h3>
              <button type="button" onClick={() => setIsReviewModalOpen(false)} disabled={isReviewSubmitting} aria-label={t.cancel} className={`rounded-lg p-2 ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}><X size={18} /></button>
            </div>
            <p className={`mb-3 text-sm ${mutedText}`}>{isRTL ? "اكتب ملاحظات واضحة للموظف قبل إعادة المهمة." : "Provide clear feedback before returning this task to the employee."}</p>
            <textarea
              value={reviewFeedback}
              onChange={(event) => setReviewFeedback(event.target.value)}
              rows={5}
              autoFocus
              placeholder={t.reviewFeedbackPlaceholder}
              className={`w-full resize-y rounded-xl border p-3 text-sm outline-none focus:border-[#238e94] focus:ring-2 focus:ring-[#238e94]/20 ${isDark ? "border-gray-700 bg-gray-950 text-gray-100 placeholder:text-gray-500" : "border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400"}`}
            />
            {reviewError && <p role="alert" className="mt-2 text-sm text-rose-500">{reviewError}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setIsReviewModalOpen(false)} disabled={isReviewSubmitting} className={`rounded-lg border px-4 py-2 text-sm font-medium ${borderColor} ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}>{t.cancel}</button>
              <button
                type="button"
                disabled={isReviewSubmitting || isLoadingReviewSubmissions || !reviewFeedback.trim() || !getLatestSubmissionId()}
                onClick={async () => {
                  const taskId = reviewTaskId;
                  const submissionId = getLatestSubmissionId();
                  if (!taskId || !submissionId) {
                    setReviewError(isRTL ? "لا يوجد تسليم متاح لمراجعته." : "No submission is available to review.");
                    return;
                  }
                  if (!reviewFeedback.trim()) {
                    setReviewError(t.feedbackRequired);
                    return;
                  }
                  setReviewError(null);
                  try {
                    await reviewTaskSubmission({ taskId, submissionId, decision: "REWORK", feedback: reviewFeedback.trim() }).unwrap();
                    setIsReviewModalOpen(false);
                    setReviewTaskId(null);
                    setReviewFeedback("");
                  } catch (error) {
                    const message = typeof error === "object" && error !== null && "data" in error &&
                      typeof (error as { data?: { message?: unknown } }).data?.message === "string"
                      ? (error as { data: { message: string } }).data.message
                      : (isRTL ? "تعذر إرسال الملاحظات." : "Could not send feedback.");
                    setReviewError(message);
                  }
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isReviewSubmitting ? (isRTL ? "جارٍ الإرسال..." : "Sending...") : t.sendFeedback}
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}