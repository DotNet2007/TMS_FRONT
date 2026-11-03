// "use client";

// import { useState } from "react";

// import {
//   CalendarDays,
//   Check,
//   Clock3,
//   Sparkles,
// } from "lucide-react";
// import { useDashboardLayout } from "@/app/components/DashboardLayout";
// import {
//   useGetMyTasksQuery,
//   useSubmitTaskCompletionMutation,
//   type TaskStatus,
// } from "@/app/services/tasks-api";

// type Task = {
//   id: string;
//   title: string;
//   project: string;
//   checked: boolean;
//   date: string;
//   apiStatus: TaskStatus;
// };

// export default function MyTasksPage() {
//   const { lang, isArabic, darkMode } = useDashboardLayout();
//   const isRTL = isArabic || lang === "ar";
//   const isDark = darkMode;

//   const [query, setQuery] = useState("");
//   const [status, setStatus] = useState<"all" | "progress" | "completed">("all");
//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 10;

//   const {
//     data: tasksResponse,
//     isLoading,
//     isError,
//     refetch,
//   } = useGetMyTasksQuery({
//     page: currentPage,
//     limit: pageSize,
//     search: query.trim() || undefined,
//     // Completed can be filtered directly by the API. The progress tab remains
//     // a client-side grouped status filter because it includes multiple statuses.
//     status: status === "completed" ? "COMPLETED" : undefined,
//   });

//   const [
//     submitTaskCompletion,
//     { isLoading: isSubmitting },
//   ] = useSubmitTaskCompletionMutation();

//   const t = isRTL
//     ? {
//         kicker: "مساحة مهامك",
//         title: "مهامي",
//         description: "نظّم أولوياتك وتابع تقدّم مهامك من مكان واحد.",
//         searchPlaceholder: "ابحث بعنوان المهمة أو الوصف...",
//         addTask: "إضافة مهمة",
//         allTasks: "كل المهام",
//         inProgress: "قيد التنفيذ",
//         completed: "مكتملة",
//         thisWeek: "هذا الأسبوع",
//         progress: "إنجاز",
//         taskList: "قائمة المهام",
//         visibleTasks: "مهام ظاهرة",
//         task: "المهمة",
//         dueDate: "تاريخ الاستحقاق",
//         responsibleSector: "القطاع المسؤول",
//         status: "الحالة",
//         reopen: "إعادة فتح",
//         completeTask: "إكمال",
//         moreOptions: "خيارات إضافية للمهمة",
//         emptyTitle: "لا توجد مهام هنا",
//         noResults: "لا توجد نتائج تطابق",
//         emptyDescription: "ستظهر المهام التي تحمل هذه الحالة هنا.",
//         noTeam: "بدون فريق",
//         noSector: "غير محدد",
//         loadingTasks: "جارٍ تحميل المهام...",
//         failedLoad: "تعذر تحميل المهام من الخادم.",
//         retry: "إعادة المحاولة",
//         completionNotePrompt: "اكتب ملاحظة توضح ما تم إنجازه:",
//         submissionNotAllowed: "لا يمكن إرسال المهمة إلا عندما تكون قيد التنفيذ أو معادة للتعديل.",
//       }
//     : {
//         kicker: "YOUR TASK SPACE",
//         title: "My Tasks",
//         description: "Organize your priorities and track your progress in one place.",
//         searchPlaceholder: "Search by task title or description...",
//         addTask: "Add Task",
//         allTasks: "All Tasks",
//         inProgress: "In Progress",
//         completed: "Completed",
//         thisWeek: "This week",
//         progress: "complete",
//         taskList: "Task List",
//         visibleTasks: "tasks shown",
//         task: "Task",
//         dueDate: "Due Date",
//         responsibleSector: "Responsible Sector",
//         status: "Status",
//         reopen: "Reopen",
//         completeTask: "Complete",
//         moreOptions: "More options for task",
//         emptyTitle: "No tasks here",
//         noResults: "No results matching",
//         emptyDescription: "Tasks with this status will appear here.",
//         noTeam: "No team",
//         noSector: "Not set",
//         loadingTasks: "Loading tasks...",
//         failedLoad: "Could not load tasks from the server.",
//         retry: "Retry",
//         completionNotePrompt: "Enter a note describing the completed work:",
//         submissionNotAllowed: "A task can only be submitted when it is dispatched or returned for rework.",
//       };

//   const mutedText = isDark ? "text-gray-400" : "text-gray-500";

//   // Map the backend response to the fields used by this page.
//   const taskList: Task[] = (tasksResponse?.tasks ?? []).map((task) => {
//     const apiStatus = task.status;
//     return {
//       id: task.id,
//       title: task.title,
//       project: task.team?.name ?? t.noTeam,
//       checked: apiStatus === "COMPLETED",
//       date: task.deadline ? task.deadline.split("T")[0] : "—",
//       apiStatus,
//     };
//   });

//   const onToggle = async (task: Task) => {
//     // The API does not expose a simple "toggle completed" endpoint.
//     // Completion must be submitted with a note and is only allowed for DISPATCHED/REWORK tasks.
//     if (task.apiStatus !== "DISPATCHED" && task.apiStatus !== "REWORK") {
//       if (task.apiStatus !== "COMPLETED") {
//         window.alert(t.submissionNotAllowed);
//       }
//       return;
//     }

//     const completionNote = window.prompt(t.completionNotePrompt)?.trim();
//     if (!completionNote) return;

//     try {
//       await submitTaskCompletion({
//         taskId: task.id,
//         completionNote,
//       }).unwrap();
//     } catch (error) {
//       const message =
//         typeof error === "object" &&
//         error !== null &&
//         "data" in error &&
//         typeof (error as { data?: { message?: unknown } }).data?.message === "string"
//           ? (error as { data: { message: string } }).data.message
//           : isRTL
//             ? "فشل إرسال المهمة. حاول مرة أخرى."
//             : "Failed to submit the task. Please try again.";

//       window.alert(message);
//     }
//   };




//   // Search and pagination are handled by the API. The response contains only
//   // the requested page, so do not slice the tasks a second time on the client.
//   const filteredTasks = taskList.filter((task) =>
//     status === "all" ||
//     (status === "completed" ? task.checked : !task.checked)
//   );
//   const totalCount = tasksResponse?.pagination?.total ?? tasksResponse?.count ?? taskList.length;
//   const totalPages = Math.max(
//     1,
//     tasksResponse?.pagination?.totalPages ?? Math.ceil(totalCount / pageSize)
//   );
//   const activePage = Math.min(currentPage, totalPages);
//   const paginatedTasks = filteredTasks;

//   const borderColor = isDark ? "border-gray-700" : "border-gray-200";

//   const completed = taskList.filter((task) => task.apiStatus === "COMPLETED").length;
//   const inProgress = taskList.filter((task) =>
//     task.apiStatus === "IN_PROGRESS" || task.apiStatus === "DISPATCHED" || task.apiStatus === "REWORK"
//   ).length;
//   const completionRate =
//     taskList.length > 0
//       ? Math.round((completed / taskList.length) * 100)
//       : 0;

//   const surface = isDark
//     ? "border-slate-700 bg-slate-800"
//     : "border-gray-200 bg-white";
//   const headingText = isDark ? "text-gray-100" : "text-gray-900";
//   const rowBackground = isDark
//     ? "border-gray-700 hover:bg-gray-700/40"
//     : "border-gray-100 hover:bg-gray-50";
//   const tabBase =
//     "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition sm:text-sm";
//   const tabActive = isDark
//     ? "bg-teal-500/15 text-teal-300"
//     : "bg-teal-50 text-[#238e94]";
//   const tabInactive = isDark
//     ? "text-gray-400 hover:bg-gray-700 hover:text-gray-100"
//     : "text-gray-500 hover:bg-gray-100 hover:text-gray-900";

//   return (
//     <section
//       dir={isRTL ? "rtl" : "ltr"}
//       lang={isRTL ? "ar" : "en"}
//       className={`min-w-0 space-y-6 transition-colors duration-300 ${
//         isDark ? "text-gray-100" : "text-gray-900"
//       }`}
//     >
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div className="min-w-0">
//           <span className="mb-2 inline-flex items-center gap-2 text-xs font-semibold text-[#238e94] sm:text-sm">
//             <Check size={14} />
//             {t.kicker}
//           </span>
//           <h1 className={`text-xl font-bold tracking-tight sm:text-2xl ${headingText}`}>
//             {t.title}
//           </h1>
//           <p className={`mt-2 text-xs leading-6 sm:text-sm ${mutedText}`}>
//             {t.description}
//           </p>
          
//         </div>

//       </div>

//       <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
//         <article className={`flex items-center gap-3 rounded-xl border p-4 sm:p-5 ${surface}`}>
//           <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
//             <Check size={19} />
//           </span>
//           <div className="min-w-0">
//             <strong className={`block text-xl font-bold tabular-nums ${headingText}`}>
//               {taskList.length}
//             </strong>
//             <small className={`text-xs ${mutedText}`}>{t.allTasks}</small>
//           </div>
//         </article>

//         <article className={`flex items-center gap-3 rounded-xl border p-4 sm:p-5 ${surface}`}>
//           <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
//             <Clock3 size={19} />
//           </span>
//           <div className="min-w-0 flex-1">
//             <strong className={`block text-xl font-bold tabular-nums ${headingText}`}>
//               {inProgress}
//             </strong>
//             <small className={`text-xs ${mutedText}`}>{t.inProgress}</small>
//           </div>
//           <span className={`text-[10px] sm:text-xs ${mutedText}`}>{t.thisWeek}</span>
//         </article>

//         <article className={`flex items-center gap-3 rounded-xl border p-4 sm:p-5 ${surface}`}>
//           <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
//             <Sparkles size={19} />
//           </span>
//           <div className="min-w-0 flex-1">
//             <strong className={`block text-xl font-bold tabular-nums ${headingText}`}>
//               {completed}
//             </strong>
//             <small className={`text-xs ${mutedText}`}>{t.completed}</small>
//           </div>
//           <span className="whitespace-nowrap text-[10px] font-semibold text-emerald-500 sm:text-xs">
//             {completionRate}% {t.progress}
//           </span>
//         </article>
//       </div>

//       <div className={`min-w-0 overflow-hidden rounded-xl border shadow-sm ${surface}`}>
  
//         <div className={`border-b p-3 sm:p-5 ${isDark ? "border-gray-700" : "border-gray-200"}`}>
//           <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//             {/* Title — Right on desktop */}
//             <div
//               className="shrink-0 text-start lg:text-end"
//               dir={isRTL ? "rtl" : "ltr"}
//             >
//               <h2 className={`whitespace-nowrap text-base font-bold ${headingText}`}>
//                 {t.taskList}
//               </h2>

//               <p className={`mt-1 whitespace-nowrap text-xs ${mutedText}`}>
//                 {totalCount} {t.visibleTasks}
//               </p>
//             </div>

//             {/* Search + Filters */}
//             <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center  lg:justify-start">
//               {/* Search */}
//               <label className="block w-full min-w-0 sm:flex-1 lg:max-w-xs">
//                 <span className="sr-only">
//                   {isRTL ? "البحث في المهام" : "Search tasks"}
//                 </span>

//                 <input
//                   type="search"
//                   value={query}
//                   onChange={(event) => {
//                     setQuery(event.target.value);
//                     setCurrentPage(1);
//                   }}
//                   placeholder={t.searchPlaceholder}
//                   className={`h-10 w-full rounded-lg border px-3 text-sm outline-none transition focus:border-[#238e94] focus:ring-2 focus:ring-[#238e94]/15 ${
//                     isDark
//                       ? "border-gray-700 bg-gray-900 text-gray-100 placeholder:text-gray-500"
//                       : "border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400"
//                   }`}
//                 />
//               </label>

//               {/* Filters — horizontal scroll on narrow screens */}
//               <div className="max-w-full min-w-0 overflow-x-auto">
//                 <div
//                   className={`flex w-max min-w-full items-center gap-1 rounded-lg border p-1 sm:min-w-0 ${
//                     isDark
//                       ? "border-gray-700 bg-gray-900/70"
//                       : "border-gray-200 bg-gray-50"
//                   }`}
//                   role="tablist"
//                   aria-label={t.status}
//                 >
//                   <button
//                     type="button"
//                     role="tab"
//                     aria-selected={status === "all"}
//                     onClick={() => { setStatus("all"); setCurrentPage(1); }}
//                     className={`${tabBase} shrink-0 whitespace-nowrap ${
//                       status === "all" ? tabActive : tabInactive
//                     }`}
//                   >
//                     {t.allTasks}
//                     <span className="ms-1 text-[10px]">{taskList.length}</span>
//                   </button>

//                   <button
//                     type="button"
//                     role="tab"
//                     aria-selected={status === "progress"}
//                     onClick={() => { setStatus("progress"); setCurrentPage(1); }}
//                     className={`${tabBase} shrink-0 whitespace-nowrap ${
//                       status === "progress" ? tabActive : tabInactive
//                     }`}
//                   >
//                     {t.inProgress}
//                     <span className="ms-1 text-[10px]">{inProgress}</span>
//                   </button>

//                   <button
//                     type="button"
//                     role="tab"
//                     aria-selected={status === "completed"}
//                     onClick={() => { setStatus("completed"); setCurrentPage(1); }}
//                     className={`${tabBase} shrink-0 whitespace-nowrap ${
//                       status === "completed" ? tabActive : tabInactive
//                     }`}
//                   >
//                     {t.completed}
//                     <span className="ms-1 text-[10px]">{completed}</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className={`hidden grid-cols-[minmax(0,2fr)_minmax(110px,1fr)_minmax(120px,1fr)_minmax(100px,0.9fr)] items-center gap-3 px-5 py-3 text-xs font-semibold md:grid ${
//           isDark ? "bg-gray-900/40 text-gray-400" : "bg-gray-50 text-gray-500"
//         }`}>
//           <span>{t.task}</span>
//           <span>{t.dueDate}</span>
//           <span>{t.responsibleSector}</span>
//           <span>{t.status}</span>
//         </div>

//         <div>
//           {isLoading ? (
//             <div className={`flex min-h-40 items-center justify-center px-5 py-10 text-sm ${mutedText}`}>
//               {t.loadingTasks}
//             </div>
//           ) : isError ? (
//             <div className="flex min-h-40 flex-col items-center justify-center gap-3 px-5 py-10 text-center">
//               <p className={`text-sm ${mutedText}`}>{t.failedLoad}</p>
//               <button
//                 type="button"
//                 onClick={() => refetch()}
//                 className="rounded-lg bg-[#238e94] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1d777c]"
//               >
//                 {t.retry}
//               </button>
//             </div>
//           ) : (
//             <>
//           {paginatedTasks.map((task) => (
//             <div key={task.id} className={`grid grid-cols-1 gap-3 border-b p-4 transition last:border-b-0 sm:p-5 md:grid-cols-[minmax(0,2fr)_minmax(110px,1fr)_minmax(120px,1fr)_minmax(100px,0.9fr)] md:items-center md:gap-3 ${rowBackground} ${task.checked ? "opacity-75" : ""}`}>
//               <div className="flex min-w-0 items-start gap-3">
//                 <button
//                   type="button"
//                   aria-label={`${task.checked ? t.reopen : t.completeTask} ${task.title}`}
//                   onClick={() => onToggle(task)}
//                   disabled={isSubmitting || (task.apiStatus !== "DISPATCHED" && task.apiStatus !== "REWORK")}
//                   title={
//                     task.apiStatus === "COMPLETED"
//                       ? t.completed
//                       : task.apiStatus === "IN_PROGRESS" || task.apiStatus === "DISPATCHED" || task.apiStatus === "REWORK"
//                         ? t.completeTask
//                         : t.submissionNotAllowed
//                   }
//                   className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition focus:outline-none focus:ring-2 focus:ring-teal-500/30 disabled:cursor-not-allowed disabled:opacity-60 ${
//                     task.checked
//                       ? "border-[#238e94] bg-[#238e94] text-white"
//                       : isDark
//                         ? "border-gray-500 bg-gray-800 text-transparent hover:border-teal-400"
//                         : "border-gray-300 bg-white text-transparent hover:border-[#238e94]"
//                   }`}
//                 >
//                   {task.checked && <Check size={13} />}
//                 </button>

//                 <div className="min-w-0 flex-1">
//                   <strong className={`block wrap-break-word text-xs font-semibold leading-5 sm:text-sm ${task.checked ? `line-through ${mutedText}` : headingText}`}>
//                     {task.title}
//                   </strong>
//                   <span className={`mt-1.5 inline-flex items-center gap-2 text-[11px] ${mutedText}`}>
//                     <i className={`h-2 w-2 shrink-0 rounded-full ${
//                       task.project === "تطبيق الهاتف"
//                         ? "bg-violet-500"
//                         : task.project === "حملة الربع الثاني"
//                           ? "bg-orange-500"
//                           : "bg-blue-500"
//                     }`} />
//                     {task.project}
//                   </span>

//                   <div className="mt-3 flex flex-wrap items-center gap-2 md:hidden">
//                     <span className={`text-[10px] ${mutedText}`}>{t.dueDate}:</span>
//                     <span className={`text-[11px] ${mutedText}`}>{task.date}</span>
//                     <span className={`mx-1 h-1 w-1 rounded-full ${isDark ? "bg-gray-600" : "bg-gray-300"}`} />
//                     <span className={`text-[10px] ${mutedText}`}>{t.responsibleSector}:</span>
//                     <span className={`text-[11px] font-medium ${headingText}`}>{task.project || t.noSector}</span>
//                   </div>
//                 </div>
//               </div>

//               <span className={`hidden items-center gap-2 text-xs md:flex ${mutedText}`}>
//                 <CalendarDays size={14} />
//                 {task.date}
//               </span>

//               <span className={`hidden min-w-0 text-xs md:inline ${mutedText}`}>
//                 <span className="block truncate">{task.project || t.noSector}</span>
//               </span>

//               <span className={`inline-flex w-fit items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-medium ${
//                 task.checked
//                   ? isDark ? "bg-emerald-500/10 text-emerald-300" : "bg-emerald-50 text-emerald-700"
//                   : isDark ? "bg-amber-500/10 text-amber-300" : "bg-amber-50 text-amber-700"
//               }`}>
//                 <i className={`h-1.5 w-1.5 rounded-full ${task.checked ? "bg-emerald-500" : "bg-amber-500"}`} />
//                 {task.checked
//                   ? t.completed
//                   : task.apiStatus === "SUBMITTED"
//                     ? (isRTL ? "بانتظار المراجعة" : "Awaiting review")
//                     : task.apiStatus === "READY_TO_DISPATCH"
//                       ? (isRTL ? "بانتظار الإرسال" : "Awaiting dispatch")
//                       : task.apiStatus === "REWORK"
//                         ? (isRTL ? "مطلوب تعديل" : "Rework requested")
//                         : task.apiStatus === "CANCELLED"
//                           ? (isRTL ? "ملغاة" : "Cancelled")
//                           : t.inProgress}
//               </span>
//             </div>
//           ))}

//           {filteredTasks.length === 0 && !isLoading && !isError && (
//             <div className="flex min-h-52 flex-col items-center justify-center px-5 py-10 text-center">
//               <span className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
//                 isDark ? "bg-teal-500/10 text-teal-300" : "bg-teal-50 text-[#238e94]"
//               }`}>
//                 <Check size={24} />
//               </span>
//               <strong className={`text-sm font-semibold ${headingText}`}>{t.emptyTitle}</strong>
//               <p className={`mt-2 max-w-sm text-xs leading-6 ${mutedText}`}>
//                 {query.trim() ? `${t.noResults} “${query}”.` : t.emptyDescription}
//               </p>
//             </div>
//           )}
//             </>
//           )}
//         </div>

//       {totalPages > 1 && !isLoading && !isError && (
//         <nav
//           className={`flex min-w-0 flex-col gap-3 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 ${isDark ? "border-gray-700" : "border-gray-200"}`}
//           aria-label={isRTL ? "ترقيم الصفحات" : "Pagination"}
//           dir={isRTL ? "rtl" : "ltr"}
//         >
//           <p className={`text-sm ${mutedText}`} aria-live="polite">
//             {isRTL
//               ? `عرض ${(activePage - 1) * pageSize + 1}–${Math.min(activePage * pageSize, totalCount)} من ${totalCount}`
//               : `Showing ${(activePage - 1) * pageSize + 1}–${Math.min(activePage * pageSize, totalCount)} of ${totalCount}`}
//           </p>

//           <div className="flex items-center justify-between gap-2 sm:justify-end">
//             <button
//               type="button"
//               onClick={() => setCurrentPage((page) => Math.max(1, Math.min(page, totalPages) - 1))}
//               disabled={activePage <= 1}
//               className={`min-h-9 rounded-lg border px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${borderColor} ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
//             >
//               {isRTL ? "السابق" : "Previous"}
//             </button>

//             <span className={`min-w-20 text-center text-sm ${mutedText}`} aria-live="polite">
//               {isRTL
//                 ? `صفحة ${activePage} من ${totalPages}`
//                 : `Page ${activePage} of ${totalPages}`}
//             </span>

//             <button
//               type="button"
//               onClick={() => setCurrentPage((page) => Math.min(totalPages, Math.max(1, page) + 1))}
//               disabled={activePage >= totalPages}
//               className={`min-h-9 rounded-lg border px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${borderColor} ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
//             >
//               {isRTL ? "التالي" : "Next"}
//             </button>
//           </div>
//         </nav>
//       )}
//       </div>


//     </section>
//   );
// }







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

type Task = {
  id: string;
  title: string;
  description?: string | null;
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

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "progress" | "completed" | "needsReview" | "rework">("all");
  const [reviewTaskId, setReviewTaskId] = useState<string | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [supervisorTaskView, setSupervisorTaskView] = useState<"myTasks" | "assignedByMe">("myTasks");
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

  const isEmployee = ["employee", "member", "user", "staff"].includes(userRole);
  const isSupervisor = userRole === "supervisor";
  const isSuperSupervisor = ["super supervisor", "supersupervisor"].includes(userRole);
  // Explicit employee/supervisor roles take precedence over stale admin flags.
  const isAdmin =
    !isEmployee &&
    !isSupervisor &&
    !isSuperSupervisor &&
    (user?.isAdmin === true || ["admin", "administrator"].includes(userRole));

  // Admin / Super Supervisor: assigned-by-me only.
  // Supervisor: load both endpoints, but display one list at a time.
  // Employee: my-tasks only.
  const shouldLoadAssignedByMe = isAdmin || isSuperSupervisor || isSupervisor;
  const shouldLoadMyTasks = isSupervisor || isEmployee;
  const isSupervisorMode = isSupervisor;

  // Keep the two supervisor lists separate. Fetch enough records for local filtering/pagination.
  // Other roles use backend pagination directly.
  const requestArgs = {
    page: isSupervisorMode ? 1 : currentPage,
    limit: isSupervisorMode ? 1000 : pageSize,
    search: query.trim() || undefined,
    status: !isSupervisorMode
      ? status === "completed" ? "COMPLETED" : status === "needsReview" ? "SUBMITTED" : status === "rework" ? "REWORK" : undefined
      : undefined,
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

  const serverTotalCount = isSupervisorMode
    ? responseTasks.length
    : shouldLoadAssignedByMe
      ? assignedResponse?.pagination?.total ?? assignedResponse?.count ?? assignedResponse?.tasks.length ?? 0
      : myResponse?.pagination?.total ?? myResponse?.count ?? myResponse?.tasks.length ?? 0;

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
  const canReviewTasks = isAdmin || isSuperSupervisor || (isSupervisorMode && supervisorTaskView === "assignedByMe");
  const showReviewColumn = canReviewTasks;
  const taskGridColumns = showReviewColumn
    ? "md:grid-cols-[minmax(0,2fr)_minmax(110px,1fr)_minmax(120px,1fr)_minmax(100px,0.9fr)_minmax(90px,0.7fr)]"
    : "md:grid-cols-[minmax(0,2fr)_minmax(110px,1fr)_minmax(140px,1fr)_minmax(110px,0.9fr)]";
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
      date: task.deadline ? task.deadline.split("T")[0] : "—",
      apiStatus,
    };
  });






  // Supervisor paginates only the currently selected list; other roles use their endpoint response.
  const filteredTasks = taskList.filter((task) => {
    const matchesStatus =
      status === "all" ||
      (status === "completed" ? task.checked :
        status === "needsReview" ? task.apiStatus === "SUBMITTED" :
          status === "rework" ? task.apiStatus === "REWORK" :
            !task.checked && task.apiStatus !== "SUBMITTED");
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const matchesSearch = !normalizedQuery ||
      `${task.title} ${task.description ?? ""}`.toLocaleLowerCase().includes(normalizedQuery);
    return matchesStatus && matchesSearch;
  });
  const totalCount = isSupervisorMode ? filteredTasks.length : serverTotalCount;
  const totalPages = Math.max(
    1,
    isSupervisorMode ? Math.ceil(filteredTasks.length / pageSize) :
      (shouldLoadAssignedByMe
        ? assignedResponse?.pagination?.totalPages
        : myResponse?.pagination?.totalPages) ?? Math.ceil(totalCount / pageSize)
  );
  const activePage = Math.min(currentPage, totalPages);
  const paginatedTasks = isSupervisorMode
    ? filteredTasks.slice((activePage - 1) * pageSize, activePage * pageSize)
    : filteredTasks;

  const borderColor = isDark ? "border-gray-700" : "border-gray-200";

  const completed = taskList.filter((task) => task.apiStatus === "COMPLETED").length;
  const inProgress = taskList.filter((task) =>
    task.apiStatus === "IN_PROGRESS" || task.apiStatus === "DISPATCHED" || task.apiStatus === "READY_TO_DISPATCH" || task.apiStatus === "REWORK"
  ).length;
  const needsReviewCount = taskList.filter((task) => task.apiStatus === "SUBMITTED").length;
  const completionRate =
    taskList.length > 0
      ? Math.round((completed / taskList.length) * 100)
      : 0;

  const surface = isDark
    ? "border-slate-700 bg-slate-800"
    : "border-gray-200 bg-white";
  const headingText = isDark ? "text-gray-100" : "text-gray-900";
  const rowBackground = isDark
    ? "border-gray-700 hover:bg-gray-700/40"
    : "border-gray-100 hover:bg-gray-50";
  const tabBase =
    "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition sm:text-sm";
  const tabActive = isDark
    ? "bg-teal-500/15 text-teal-300"
    : "bg-teal-50 text-[#238e94]";
  const tabInactive = isDark
    ? "text-gray-400 hover:bg-gray-700 hover:text-gray-100"
    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900";

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
          <span className="mb-2 inline-flex items-center gap-2 text-xs font-semibold text-[#238e94] sm:text-sm">
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
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

                {/* {isSupervisorMode && (
                  <button
                    type="button"
                    onClick={() => {
                      setSupervisorTaskView((current) =>
                        current === "myTasks" ? "assignedByMe" : "myTasks"
                      );
                      setCurrentPage(1);
                      setStatus("all");
                    }}
                    aria-pressed={supervisorTaskView === "assignedByMe"}
                    className={`min-h-11 w-full shrink-0 rounded-xl border px-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#238e94]/30 sm:w-auto ${
                      supervisorTaskView === "assignedByMe"
                        ? "border-[#238e94] bg-[#238e94] text-white"
                        : isDark
                          ? "border-gray-700 bg-gray-900 text-gray-200 hover:border-[#238e94]"
                          : "border-gray-200 bg-white text-gray-700 hover:border-[#238e94] hover:text-[#238e94]"
                    }`}
                  >
                    {supervisorTaskView === "myTasks"
                      ? t.assignedByMeButton
                      : t.myTasksButton}
                  </button>
                )} */}

                
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
                      className={`rounded-lg px-3 py-2.5 text-xs font-semibold transition sm:text-sm ${
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
                      className={`rounded-lg px-3 py-2.5 text-xs font-semibold transition sm:text-sm ${
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
                  className={`flex w-full min-w-0 flex-wrap items-center gap-1.5 rounded-xl border p-1.5 ${
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
                    className={`${tabBase} min-w-0 flex-1 whitespace-nowrap sm:flex-none ${
                      status === "all" ? tabActive : tabInactive
                    }`}
                  >
                    {t.allTasks}
                    <span className="ms-1 text-[10px]">{serverTotalCount}</span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={status === "progress"}
                    onClick={() => { setStatus("progress"); setCurrentPage(1); }}
                    className={`${tabBase} min-w-0 flex-1 whitespace-nowrap sm:flex-none ${
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
                    className={`${tabBase} min-w-0 flex-1 whitespace-nowrap sm:flex-none ${
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
                    className={`${tabBase} min-w-0 flex-1 whitespace-nowrap sm:flex-none ${
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
                    className={`${tabBase} min-w-0 flex-1 whitespace-nowrap sm:flex-none ${
                      status === "rework"
                        ? (isDark ? "bg-rose-500/15 text-rose-300" : "bg-rose-50 text-rose-700")
                        : tabInactive
                    }`}
                  >
                    {t.rework}
                    <span className="ms-1 text-[10px]">{taskList.filter((task) => task.apiStatus === "REWORK").length}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`hidden ${taskGridColumns} items-center gap-3 px-5 py-3 text-xs font-semibold md:grid ${
            isDark
              ? "border-b border-gray-700 bg-gray-900/60 text-gray-400"
              : "border-b border-gray-200 bg-gray-50 text-gray-500"
          }`}
        >
          <span className="min-w-0">{t.task}</span>

          <span className="min-w-0">
            {t.dueDate}
          </span>

          <span className="min-w-0">
            {responsibleColumnLabel}
          </span>

          <span className="min-w-0">
            {t.status}
          </span>

          {showReviewColumn && (
            <span className="flex items-center justify-center gap-1.5 text-center">
              {isRTL ? "المراجعة" : "Review"}
            </span>
          )}
        </div>

        <div>
          {isLoading ? (
            <div className={`flex min-h-40 items-center justify-center px-5 py-10 text-sm ${mutedText}`}>
              {t.loadingTasks}
            </div>
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
            <>
          {paginatedTasks.map((task) => (
            <div
              key={task.id}
              role="link"
              tabIndex={0}
              aria-label={`${isRTL ? "عرض تفاصيل المهمة" : "View task details"}: ${task.title}`}
              onClick={() => router.push(`/tasks/${task.id}`)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  router.push(`/tasks/${task.id}`);
                }
              }}
              className={`grid grid-cols-1 ${taskGridColumns} cursor-pointer gap-3 border-b p-4 transition last:border-b-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#238e94] sm:p-5 md:items-center md:gap-3 ${rowBackground} ${task.checked ? "opacity-75" : ""}`}
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="min-w-0 flex-1">
                  <strong className={`block wrap-break-word text-xs font-semibold leading-5 sm:text-sm ${task.checked ? `line-through ${mutedText}` : headingText}`}>
                    {task.title}
                  </strong>
                  <div className="mt-3 flex flex-wrap items-center gap-2 md:hidden">
                    <span className={`text-[10px] ${mutedText}`}>{t.dueDate}:</span>
                    <span className={`text-[11px] ${mutedText}`}>{task.date}</span>
                    <span className={`mx-1 h-1 w-1 rounded-full ${isDark ? "bg-gray-600" : "bg-gray-300"}`} />
                    <span className={`text-[10px] ${mutedText}`}>{responsibleColumnLabel}:</span>
                    <span className={`text-[11px] font-medium ${headingText}`}>{getResponsibleDisplay(task) || t.noSector}</span>
                  </div>
                </div>
              </div>

              <span className={`hidden items-center gap-2 text-xs md:flex ${mutedText}`}>
                <CalendarDays size={14} />
                {task.date}
              </span>

              <span className={`hidden min-w-0 text-xs md:inline ${mutedText}`}>
                <span className="block truncate">{getResponsibleDisplay(task) || t.noSector}</span>
              </span>

              <span className={`inline-flex w-fit items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                task.checked
                  ? isDark ? "bg-emerald-500/10 text-emerald-300" : "bg-emerald-50 text-emerald-700"
                  : task.apiStatus === "SUBMITTED"
                    ? isDark ? "bg-violet-500/15 text-violet-300" : "bg-violet-50 text-violet-700"
                    : task.apiStatus === "REWORK"
                      ? isDark ? "bg-rose-500/10 text-rose-300" : "bg-rose-50 text-rose-700"
                      : isDark ? "bg-amber-500/10 text-amber-300" : "bg-amber-50 text-amber-700"
              }`}>
                <i className={`h-1.5 w-1.5 rounded-full ${task.checked ? "bg-emerald-500" : task.apiStatus === "SUBMITTED" ? "bg-violet-500" : task.apiStatus === "REWORK" ? "bg-rose-500" : "bg-amber-500"}`} />
                {task.checked
                  ? t.completed
                  : task.apiStatus === "SUBMITTED"
                    ? (isRTL ? "بانتظار المراجعة" : "Awaiting review")
                    : task.apiStatus === "READY_TO_DISPATCH"
                      ? (isRTL ? "بانتظار الإرسال" : "Awaiting dispatch")
                      : task.apiStatus === "REWORK"
                        ? (isRTL ? "مطلوب تعديل" : "Rework requested")
                        : task.apiStatus === "CANCELLED"
                          ? (isRTL ? "ملغاة" : "Cancelled")
                          : t.inProgress}
              </span>

              {showReviewColumn && <div className="flex items-center gap-2 md:justify-start">
                {task.apiStatus === "SUBMITTED" && (isSupervisor || isSuperSupervisor || isAdmin) ? (
                  <>
                    <button
                      type="button"
                      aria-label={isRTL ? "اعتماد المهمة" : "Approve task"}
                      title={isRTL ? "اعتماد المهمة" : "Approve task"}
                      disabled={isReviewSubmitting || isFetchingApprovalSubmissions}
                      onClick={(event) => { event.stopPropagation(); void handleApproveTask(task.id); }}
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
              </div>}
            </div>
          ))}

          {filteredTasks.length === 0 && !isLoading && !isError && (
            <div className="flex min-h-52 flex-col items-center justify-center px-5 py-10 text-center">
              <span className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
                isDark ? "bg-teal-500/10 text-teal-300" : "bg-teal-50 text-[#238e94]"
              }`}>
                <Check size={24} />
              </span>
              <strong className={`text-sm font-semibold ${headingText}`}>{t.emptyTitle}</strong>
              <p className={`mt-2 max-w-sm text-xs leading-6 ${mutedText}`}>
                {query.trim() ? `${t.noResults} “${query}”.` : t.emptyDescription}
              </p>
            </div>
          )}
            </>
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
