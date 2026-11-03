// // /* eslint-disable @next/next/no-img-element */

// // "use client";

// // import { useMemo, useState, type ReactNode } from "react";
// // import {
// //   ChartColumn,
// //   Check,
// //   Clock3,
// //   Download,
// //   FileText,
// //   Filter,
// //   Grid2X2,
// //   RotateCcw,
// //   Search,
// //   RefreshCw,
// // } from "lucide-react";

// // import { useDashboardLayout } from "@/app/components/DashboardLayout";
// // import { useGetAssignedByMeQuery } from "@/app/services/tasks-api";


// // // --------------------------------------------------
// // // Types
// // // --------------------------------------------------

// // type Language = "ar" | "en";
// // type ReportView = "summary" | "details";

// // type ApiTask = {
// //   id: string;
// //   title: string;
// //   description?: string | null;
// //   deadline?: string | null;
// //   status: string;
// //   activatedAt?: string | null;
// //   startedAt?: string | null;
// //   createdAt?: string;
// //   updatedAt?: string;

// //   team?: {
// //     id: string;
// //     name: string;
// //   } | null;

// //   assignee?: {
// //     id: string;
// //     fullName: string;
// //     email: string;
// //   } | null;

// //   createdBy?: {
// //     id: string;
// //     fullName: string;
// //     email: string;
// //   } | null;

// //   submissions?: unknown[];
// // };

// // type TaskStatusFilter = "all" | "progress" | "completed";

// // // --------------------------------------------------
// // // Date helpers
// // // --------------------------------------------------

// // function getLocalDateString(date: Date) {
// //   const year = date.getFullYear();
// //   const month = String(date.getMonth() + 1).padStart(2, "0");
// //   const day = String(date.getDate()).padStart(2, "0");

// //   return `${year}-${month}-${day}`;
// // }

// // function getTaskDateValue(value?: string | null): string | null {
// //   if (!value) return null;

// //   const parsed = new Date(value);

// //   if (Number.isNaN(parsed.getTime())) return null;

// //   return getLocalDateString(parsed);
// // }

// // function formatReportDate(language: Language) {
// //   return new Date().toLocaleDateString(
// //     language === "ar" ? "ar-EG" : "en-US",
// //     {
// //       year: "numeric",
// //       month: "long",
// //       day: "numeric",
// //     }
// //   );
// // }

// // function displayDate(value: string | null | undefined, language: Language) {
// //   if (!value) return "—";

// //   const date = new Date(value);

// //   if (Number.isNaN(date.getTime())) return "—";

// //   return date.toLocaleDateString(
// //     language === "ar" ? "ar-EG" : "en-US",
// //     {
// //       year: "numeric",
// //       month: "short",
// //       day: "numeric",
// //     }
// //   );
// // }

// // // --------------------------------------------------
// // // Status helpers
// // // --------------------------------------------------

// // function isTaskCompleted(status: string) {
// //   return status?.toUpperCase() === "COMPLETED";
// // }

// // function getTaskStatusLabel(status: string, language: Language) {
// //   const normalized = status?.toUpperCase();

// //   const labels: Record<string, { ar: string; en: string }> = {
// //     COMPLETED: {
// //       ar: "مكتملة",
// //       en: "Completed",
// //     },
// //     SUBMITTED: {
// //       ar: "تم التسليم",
// //       en: "Submitted",
// //     },
// //     DISPATCHED: {
// //       ar: "تم الإسناد",
// //       en: "Assigned",
// //     },
// //     REWORK: {
// //       ar: "إعادة العمل",
// //       en: "Rework",
// //     },
// //     IN_PROGRESS: {
// //       ar: "قيد التنفيذ",
// //       en: "In Progress",
// //     },
// //     PENDING: {
// //       ar: "قيد الانتظار",
// //       en: "Pending",
// //     },
// //     CANCELLED: {
// //       ar: "ملغاة",
// //       en: "Cancelled",
// //     },
// //     DRAFT: {
// //       ar: "مسودة",
// //       en: "Draft",
// //     },
// //   };

// //   return labels[normalized]?.[language] ?? status ?? "—";
// // }

// // // --------------------------------------------------
// // // Custom select with SVG arrow
// // // --------------------------------------------------


// // type CustomSelectProps = {
// //   value: string;
// //   onChange: (value: string) => void;
// //   dir: "rtl" | "ltr";
// //   className: string;
// //   children: ReactNode;
// //   ariaLabel: string;
// // };

// // function CustomSelect({
// //   value,
// //   onChange,
// //   dir,
// //   className,
// //   children,
// //   ariaLabel,
// // }: CustomSelectProps) {
// //   return (
// //     <div className="relative">
// //       <select
// //         aria-label={ariaLabel}
// //         dir={dir}
// //         value={value}
// //         onChange={(event) => onChange(event.target.value)}
// //         className={`${className} appearance-none ${
// //           dir === "rtl" ? "pl-10 pr-3" : "pl-3 pr-10"
// //         }`}
// //       >
// //         {children}
// //       </select>

// //       <svg
// //         aria-hidden="true"
// //         viewBox="0 0 20 20"
// //         fill="none"
// //         className={`pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-current ${
// //           dir === "rtl" ? "left-3" : "right-3"
// //         }`}
// //       >
// //         <path
// //           d="m5.5 7.5 4.5 4.5 4.5-4.5"
// //           stroke="currentColor"
// //           strokeWidth="1.8"
// //           strokeLinecap="round"
// //           strokeLinejoin="round"
// //         />
// //       </svg>
// //     </div>
// //   );
// // }

// // // --------------------------------------------------
// // // Component
// // // --------------------------------------------------

// // export default function TaskReportsPage() {
// //   const { lang, isArabic, darkMode } = useDashboardLayout();

// //   const language: Language = lang === "ar" ? "ar" : "en";
// //   const isRTL = isArabic || language === "ar";
// //   const isDark = darkMode;

// //   // --------------------------------------------------
// //   // API
// //   // --------------------------------------------------

// //   const {
// //     data,
// //     isLoading,
// //     isFetching,
// //     error,
// //     refetch,
// //   } = useGetAssignedByMeQuery({
// //     page: 1,
// //     limit: 100,
// //   });

// //   const taskList: ApiTask[] = (data?.tasks ?? []) as ApiTask[];

// //   // --------------------------------------------------
// //   // Filters state
// //   // --------------------------------------------------

// //   const [dateFrom, setDateFrom] = useState("");
// //   const [dateTo, setDateTo] = useState("");

// //   const [statusFilter, setStatusFilter] =
// //     useState<TaskStatusFilter>("all");

// //   const [projectFilter, setProjectFilter] = useState("all");

// //   const [view, setView] = useState<ReportView>("details");

// //   // --------------------------------------------------
// //   // Translations
// //   // --------------------------------------------------

// //   const t = {
// //     ar: {
// //       kicker: "التقارير والتحليلات",
// //       title: "تقرير المهام",
// //       description:
// //         "صفِّ المهام واستعرض النتائج واطبع تقريرًا احترافيًا.",

// //       summary: "ملخص",
// //       details: "تفصيلي",
// //       print: "طباعة التقرير",
// //       refresh: "تحديث",

// //       filters: "تصفية التقرير",
// //       matchingResults: "نتيجة مطابقة",

// //       from: "من تاريخ",
// //       to: "إلى تاريخ",

// //       status: "الحالة",
// //       allStatuses: "كل الحالات",
// //       progress: "قيد التنفيذ",
// //       completed: "مكتملة",

// //       project: "الفريق",
// //       allProjects: "كل الفرق",

// //       reset: "إعادة ضبط",

// //       totalTasks: "إجمالي المهام",
// //       completedTasks: "المهام المكتملة",
// //       inProgress: "المهام غير المكتملة",

// //       withinFilters: "ضمن الفلاتر المحددة",
// //       completionRate: "معدل الإنجاز",

// //       needsFollowUp: "تحتاج إلى متابعة",
// //       overallProgress: "التقدم الإجمالي",

// //       doneOf: "تم إنجاز",
// //       outOf: "من أصل",
// //       tasks: "مهام",

// //       taskDetails: "تفاصيل المهام",
// //       matchingTasks: "قائمة بجميع المهام المطابقة لمعايير التقرير",

// //       task: "المهمة",
// //       dueDate: "تاريخ الاستحقاق",
// //       projectColumn: "الفريق",
// //       assignee: "المسؤول",
// //       statusColumn: "الحالة",

// //       noResults: "لا توجد نتائج",
// //       changeFilters: "غيّر معايير التصفية لعرض مهام أخرى.",

// //       byProject: "المهام حسب الفريق",
// //       projectDescription: "توزيع المهام على الفرق",

// //       completionStatus: "حالة الإنجاز",
// //       completionDescription: "نسبة المهام المكتملة وغير المكتملة",

// //       complete: "مكتمل",

// //       createdBy: "تم إنشاء هذا التقرير بواسطة NTRA",
// //       confidential: "سري للاستخدام الداخلي",
// //       reportNumber: "رقم التقرير",

// //       loading: "جاري تحميل المهام...",
// //       loadError: "حدث خطأ أثناء تحميل تقرير المهام.",
// //       retry: "إعادة المحاولة",

// //       dateRangeError: "تاريخ البداية يجب أن يكون قبل تاريخ النهاية.",
// //       totalFromApi: "إجمالي المهام من الخادم",
// //       showing: "المعروض",
// //       noTeam: "بدون فريق",
// //     },

// //     en: {
// //       kicker: "REPORTS & ANALYTICS",
// //       title: "Task Report",
// //       description:
// //         "Filter tasks, review performance, and print a professional report.",

// //       summary: "Summary",
// //       details: "Details",
// //       print: "Print Report",
// //       refresh: "Refresh",

// //       filters: "Report Filters",
// //       matchingResults: "matching results",

// //       from: "From date",
// //       to: "To date",

// //       status: "Status",
// //       allStatuses: "All statuses",
// //       progress: "In progress",
// //       completed: "Completed",

// //       project: "Team",
// //       allProjects: "All teams",

// //       reset: "Reset filters",

// //       totalTasks: "Total tasks",
// //       completedTasks: "Completed tasks",
// //       inProgress: "Incomplete tasks",

// //       withinFilters: "Within selected filters",
// //       completionRate: "Completion rate",

// //       needsFollowUp: "Needs follow-up",
// //       overallProgress: "Overall progress",

// //       doneOf: "Completed",
// //       outOf: "out of",
// //       tasks: "tasks",

// //       taskDetails: "Task details",
// //       matchingTasks: "All tasks matching the selected report criteria",

// //       task: "Task",
// //       dueDate: "Due date",
// //       projectColumn: "Team",
// //       assignee: "Assignee",
// //       statusColumn: "Status",

// //       noResults: "No results found",
// //       changeFilters: "Change your filters to see other tasks.",

// //       byProject: "Tasks by team",
// //       projectDescription: "Task distribution across teams",

// //       completionStatus: "Completion status",
// //       completionDescription: "Completed and incomplete tasks",

// //       complete: "Complete",

// //       createdBy: "Report generated by NTRA",
// //       confidential: "Confidential · Internal use only",
// //       reportNumber: "Report number",

// //       loading: "Loading tasks...",
// //       loadError: "Failed to load task report.",
// //       retry: "Retry",

// //       dateRangeError: "Start date must be before end date.",
// //       totalFromApi: "Total tasks from server",
// //       showing: "Showing",
// //       noTeam: "No team",
// //     },
// //   }[language];

// //   // --------------------------------------------------
// //   // Projects / Teams
// //   // --------------------------------------------------

// //   const projects = useMemo(() => {
// //     const uniqueTeams = new Map<string, string>();

// //     taskList.forEach((task) => {
// //       if (task.team?.id && task.team?.name) {
// //         uniqueTeams.set(task.team.id, task.team.name);
// //       }
// //     });

// //     return Array.from(uniqueTeams.entries()).map(([id, name]) => ({
// //       id,
// //       name,
// //     }));
// //   }, [taskList]);

// //   // --------------------------------------------------
// //   // Filter validation
// //   // --------------------------------------------------

// //   const today = getLocalDateString(new Date());

// //   const rangeIsInvalid =
// //     Boolean(dateFrom && dateTo && dateFrom > dateTo);

// //   // --------------------------------------------------
// //   // Filter tasks
// //   // --------------------------------------------------

// //   const reportTasks = useMemo(() => {
// //     return taskList.filter((task) => {
// //       const taskDate = getTaskDateValue(task.deadline);

// //       const completed = isTaskCompleted(task.status);

// //       const dateMatches =
// //         (!dateFrom ||
// //           (taskDate !== null && taskDate >= dateFrom)) &&
// //         (!dateTo ||
// //           (taskDate !== null && taskDate <= dateTo));

// //       const statusMatches =
// //         statusFilter === "all" ||
// //         (statusFilter === "completed" && completed) ||
// //         (statusFilter === "progress" && !completed);

// //       const projectMatches =
// //         projectFilter === "all" ||
// //         task.team?.id === projectFilter;

// //       return (
// //         dateMatches &&
// //         statusMatches &&
// //         projectMatches
// //       );
// //     });
// //   }, [
// //     taskList,
// //     dateFrom,
// //     dateTo,
// //     statusFilter,
// //     projectFilter,
// //   ]);

// //   // --------------------------------------------------
// //   // Statistics
// //   // --------------------------------------------------

// //   const completed = reportTasks.filter((task) =>
// //     isTaskCompleted(task.status)
// //   ).length;

// //   const inProgress = reportTasks.length - completed;

// //   const completion = reportTasks.length
// //     ? Math.round((completed / reportTasks.length) * 100)
// //     : 0;

// //   // --------------------------------------------------
// //   // Reset filters
// //   // --------------------------------------------------

// //   const resetFilters = () => {
// //     setDateFrom("");
// //     setDateTo("");
// //     setStatusFilter("all");
// //     setProjectFilter("all");
// //   };

// //   // --------------------------------------------------
// //   // Styling
// //   // --------------------------------------------------

// //   const surface = isDark
// //     ? "border-gray-700 bg-gray-800"
// //     : "border-gray-200 bg-white";

// //   const pageText = isDark
// //     ? "text-gray-100"
// //     : "text-gray-900";

// //   const mutedText = isDark
// //     ? "text-gray-400"
// //     : "text-gray-500";

// //   const inputStyle = isDark
// //     ? "border-gray-600 bg-gray-900 text-gray-100 placeholder:text-gray-500"
// //     : "border-gray-200 bg-white text-gray-800 placeholder:text-gray-400";

// //   const controlStyle =
// //     "h-10 w-full rounded-xl border px-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15";

// //   // --------------------------------------------------
// //   // Loading state
// //   // --------------------------------------------------

// //   if (isLoading) {
// //     return (
// //       <section
// //         dir={isRTL ? "rtl" : "ltr"}
// //         className={`flex min-h-80 flex-col items-center justify-center gap-4 ${pageText}`}
// //       >
// //         <div className="size-10 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />

// //         <p className={`text-sm ${mutedText}`}>
// //           {t.loading}
// //         </p>
// //       </section>
// //     );
// //   }

// //   // --------------------------------------------------
// //   // Error state
// //   // --------------------------------------------------

// //   if (error && taskList.length === 0) {
// //     return (
// //       <section
// //         dir={isRTL ? "rtl" : "ltr"}
// //         className={`mx-auto w-full max-w-7xl p-4 ${pageText}`}
// //       >
// //         <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/30">
// //           <p className="text-sm font-semibold text-red-600 dark:text-red-400">
// //             {t.loadError}
// //           </p>

// //           <button
// //             type="button"
// //             onClick={() => refetch()}
// //             className="mt-4 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-700"
// //           >
// //             <RefreshCw size={15} />
// //             {t.retry}
// //           </button>
// //         </div>
// //       </section>
// //     );
// //   }

// //   // --------------------------------------------------
// //   // Main component
// //   // --------------------------------------------------

// //   return (
// //     <section
// //       dir={isRTL ? "rtl" : "ltr"}
// //       className={`mx-auto w-full space-y-6 p-1 sm:p-3 ${pageText}`}
// //     >
// //       {/* Page heading */}

// //       <div className="no-print flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
// //         <div>
// //           <span className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wide text-teal-600 dark:text-teal-400">
// //             <ChartColumn size={15} />
// //             {t.kicker}
// //           </span>

// //           <h1 className="text-2xl font-bold sm:text-3xl">
// //             {t.title}
// //           </h1>

// //           <p className={`mt-2 text-sm ${mutedText}`}>
// //             {t.description}
// //           </p>

// //           <p className={`mt-2 text-xs ${mutedText}`}>
// //             {t.totalFromApi}: {data?.count ?? taskList.length}
// //           </p>
// //         </div>

// //         <div className="flex flex-wrap items-center gap-2">
// //           <div className={`flex rounded-xl border p-1 ${surface}`}>
// //             <button
// //               type="button"
// //               onClick={() => setView("summary")}
// //               className={`flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition ${
// //                 view === "summary"
// //                   ? "bg-teal-600 text-white shadow-sm"
// //                   : mutedText
// //               }`}
// //             >
// //               <ChartColumn size={16} />
// //               {t.summary}
// //             </button>

// //             <button
// //               type="button"
// //               onClick={() => setView("details")}
// //               className={`flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition ${
// //                 view === "details"
// //                   ? "bg-teal-600 text-white shadow-sm"
// //                   : mutedText
// //               }`}
// //             >
// //               <Grid2X2 size={16} />
// //               {t.details}
// //             </button>
// //           </div>

// //           <button
// //             type="button"
// //             onClick={() => refetch()}
// //             disabled={isFetching}
// //             className={`flex h-11 items-center gap-2 rounded-xl border px-3 text-sm font-semibold transition ${surface} ${mutedText}`}
// //           >
// //             <RefreshCw
// //               size={15}
// //               className={isFetching ? "animate-spin" : ""}
// //             />
// //             {t.refresh}
// //           </button>

// //           <button
// //             type="button"
// //             onClick={() => window.print()}
// //             className="flex h-11 items-center gap-2 rounded-xl bg-teal-600 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700"
// //           >
// //             <Download size={16} />
// //             {t.print}
// //           </button>
// //         </div>
// //       </div>

// //       {/* Filters */}

// //       <div className={`no-print rounded-2xl border p-4 shadow-sm sm:p-5 ${surface}`}>
// //         <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
// //           <div className="flex items-center gap-3">
// //             <span className="grid size-10 place-items-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
// //               <Filter size={19} />
// //             </span>

// //             <div>
// //               <h2 className="font-bold">
// //                 {t.filters}
// //               </h2>

// //               <p className={`mt-1 text-xs ${mutedText}`}>
// //                 {reportTasks.length} {t.matchingResults}
// //               </p>
// //             </div>
// //           </div>

// //           <button
// //             type="button"
// //             onClick={resetFilters}
// //             className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition hover:bg-gray-500/10 ${mutedText}`}
// //           >
// //             <RotateCcw size={14} />
// //             {t.reset}
// //           </button>
// //         </div>

// //         <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
// //           {/* From date */}

// //           <label className="space-y-2">
// //             <span className={`block text-xs font-semibold ${mutedText}`}>
// //               {t.from}
// //             </span>

// //             <input
// //               type="date"
// //               value={dateFrom}
// //               max={dateTo || undefined}
// //               onChange={(event) => setDateFrom(event.target.value)}
// //               className={`${controlStyle} ${inputStyle}`}
// //             />
// //           </label>

// //           {/* To date */}

// //           <label className="space-y-2">
// //             <span className={`block text-xs font-semibold ${mutedText}`}>
// //               {t.to}
// //             </span>

// //             <input
// //               type="date"
// //               value={dateTo}
// //               min={dateFrom || undefined}
// //               onChange={(event) => setDateTo(event.target.value)}
// //               className={`${controlStyle} ${inputStyle}`}
// //             />
// //           </label>

// //           {/* Status */}

// //           <label className="space-y-2">
// //             <span className={`block text-xs font-semibold ${mutedText}`}>
// //               {t.status}
// //             </span>

// //             <CustomSelect
// //               ariaLabel={t.status}
// //               dir={isRTL ? "rtl" : "ltr"}
// //               value={statusFilter}
// //               onChange={(value) => setStatusFilter(value as TaskStatusFilter)}
// //               className={`${controlStyle} ${inputStyle}`}
// //             >
// //               <option value="all">{t.allStatuses}</option>
// //               <option value="progress">{t.progress}</option>
// //               <option value="completed">{t.completed}</option>
// //             </CustomSelect>
// //           </label>

// //           {/* Team */}

// //           <label className="space-y-2">
// //             <span className={`block text-xs font-semibold ${mutedText}`}>
// //               {t.project}
// //             </span>

// //             <CustomSelect
// //               ariaLabel={t.project}
// //               dir={isRTL ? "rtl" : "ltr"}
// //               value={projectFilter}
// //               onChange={setProjectFilter}
// //               className={`${controlStyle} ${inputStyle}`}
// //             >
// //               <option value="all">{t.allProjects}</option>

// //               {projects.map((project) => (
// //                 <option key={project.id} value={project.id}>
// //                   {project.name}
// //                 </option>
// //               ))}
// //             </CustomSelect>
// //           </label>
// //         </div>

// //         {rangeIsInvalid && (
// //           <p className="mt-3 text-xs font-medium text-red-500">
// //             {t.dateRangeError}
// //           </p>
// //         )}
// //       </div>

// //       {/* Printable report */}

// //       <article
// //         className={`print-report space-y-5 rounded-2xl border p-4 shadow-sm sm:p-6 lg:p-7 ${surface}`}
// //       >
// //         {/* Report header */}

// //         <header className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-5 dark:border-gray-700 sm:flex-row sm:items-center">
// //           <div className="flex items-center gap-3">
// //             <img
// //               src="/icon.png"
// //               alt="NTRA Logo"
// //               className="h-12 w-auto max-w-36 object-contain"
// //             />

// //             <div>
// //               <strong className="block text-lg font-extrabold">
// //                 NTRA
// //               </strong>

// //               <small className={mutedText}>
// //                 National Telecom Regulatory Authority
// //               </small>
// //             </div>
// //           </div>

// //           <div className={isRTL ? "text-right" : "text-left"}>
// //             <h2 className="font-bold">
// //               {t.title}
// //             </h2>

// //             <p className={`mt-1 text-sm ${mutedText}`}>
// //               {formatReportDate(language)}
// //             </p>

// //             <small className={mutedText}>
// //               {t.reportNumber}: RPT-{today.replaceAll("-", "")}
// //             </small>
// //           </div>
// //         </header>

// //         {/* Statistics */}

// //         <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
// //           {[
// //             {
// //               label: t.totalTasks,
// //               value: reportTasks.length,
// //               note: t.withinFilters,
// //               icon: FileText,
// //               color: "text-blue-500 bg-blue-500/10",
// //             },
// //             {
// //               label: t.completedTasks,
// //               value: completed,
// //               note: `${completion}% ${t.completionRate}`,
// //               icon: Check,
// //               color: "text-teal-500 bg-teal-500/10",
// //             },
// //             {
// //               label: t.inProgress,
// //               value: inProgress,
// //               note: t.needsFollowUp,
// //               icon: Clock3,
// //               color: "text-amber-500 bg-amber-500/10",
// //             },
// //           ].map((stat) => {
// //             const StatIcon = stat.icon;

// //             return (
// //               <div
// //                 key={stat.label}
// //                 className={`rounded-xl border p-4 ${surface}`}
// //               >
// //                 <span
// //                   className={`mb-4 grid size-10 place-items-center rounded-xl ${stat.color}`}
// //                 >
// //                   <StatIcon size={19} />
// //                 </span>

// //                 <p className={`text-xs ${mutedText}`}>
// //                   {stat.label}
// //                 </p>

// //                 <strong className="mt-1 block text-2xl font-extrabold tabular-nums">
// //                   {stat.value}
// //                 </strong>

// //                 <small className={`mt-2 block text-xs ${mutedText}`}>
// //                   {stat.note}
// //                 </small>
// //               </div>
// //             );
// //           })}
// //         </div>

// //         {/* Overall progress */}

// //         <section className={`rounded-xl border p-4 sm:p-5 ${surface}`}>
// //           <div className="mb-3 flex items-center justify-between gap-3">
// //             <h3 className="font-bold">
// //               {t.overallProgress}
// //             </h3>

// //             <strong className="text-lg font-extrabold text-teal-600 dark:text-teal-400">
// //               {completion}%
// //             </strong>
// //           </div>

// //           <div
// //             className={`h-3 overflow-hidden rounded-full ${
// //               isDark ? "bg-gray-700" : "bg-gray-100"
// //             }`}
// //           >
// //             <div
// //               className="h-full rounded-full bg-linear-to-r from-blue-500 to-teal-500 transition-all duration-300"
// //               style={{ width: `${completion}%` }}
// //             />
// //           </div>

// //           <p className={`mt-3 text-xs ${mutedText}`}>
// //             {t.doneOf} {completed} {t.outOf} {reportTasks.length} {t.tasks}.
// //           </p>
// //         </section>

// //         {/* Details view */}

// //         {(
// //           <section className={`print-task-details ${view === "summary" ? "hidden" : ""}`}>
// //             <div className="mb-4 flex items-center justify-between gap-3">
// //               <div>
// //                 <h2 className="font-bold">
// //                   {t.taskDetails}
// //                 </h2>

// //                 <p className={`mt-1 text-xs ${mutedText}`}>
// //                   {t.matchingTasks}
// //                 </p>
// //               </div>

// //               <span className="rounded-full bg-teal-500/10 px-3 py-1.5 text-xs font-bold text-teal-600 dark:text-teal-400">
// //                 {reportTasks.length} {t.tasks}
// //               </span>
// //             </div>

// //             {reportTasks.length > 0 ? (
// //               <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
// //                 <table className="w-full min-w-180 text-sm">
// //                   <thead
// //                     className={
// //                       isDark
// //                         ? "bg-gray-900/70 text-gray-400"
// //                         : "bg-gray-50 text-gray-500"
// //                     }
// //                   >
// //                     <tr>
// //                       {[
// //                         t.task,
// //                         t.projectColumn,
// //                         t.dueDate,
// //                         t.assignee,
// //                         t.statusColumn,
// //                       ].map((heading) => (
// //                         <th
// //                           key={heading}
// //                           className={`px-4 py-3 text-xs font-bold ${
// //                             isRTL ? "text-right" : "text-left"
// //                           }`}
// //                         >
// //                           {heading}
// //                         </th>
// //                       ))}
// //                     </tr>
// //                   </thead>

// //                   <tbody>
// //                     {reportTasks.map((task) => {
// //                       const completed = isTaskCompleted(task.status);

// //                       return (
// //                         <tr
// //                           key={task.id}
// //                           className="border-t border-gray-200 transition hover:bg-gray-500/5 dark:border-gray-700"
// //                         >
// //                           {/* Task */}

// //                           <td className="px-4 py-4">
// //                             <div className="flex items-center gap-3">
// //                               <span
// //                                 className={`grid size-6 shrink-0 place-items-center rounded-md border ${
// //                                   completed
// //                                     ? "border-teal-500 bg-teal-500 text-white"
// //                                     : "border-gray-300 dark:border-gray-600"
// //                                 }`}
// //                               >
// //                                 {completed && <Check size={13} />}
// //                               </span>

// //                               <div className="min-w-0">
// //                                 <strong className="block max-w-xs truncate text-xs font-semibold">
// //                                   {task.title}
// //                                 </strong>

// //                                 <small className={`mt-1 block text-[11px] ${mutedText}`}>
// //                                   {task.id}
// //                                 </small>
// //                               </div>
// //                             </div>
// //                           </td>

// //                           {/* Team */}

// //                           <td className={`px-4 py-4 text-xs ${mutedText}`}>
// //                             {task.team?.name ?? t.noTeam}
// //                           </td>

// //                           {/* Deadline */}

// //                           <td className={`px-4 py-4 text-xs ${mutedText}`}>
// //                             {displayDate(task.deadline, language)}
// //                           </td>

// //                           {/* Assignee */}

// //                           <td className={`px-4 py-4 text-xs ${mutedText}`}>
// //                             {task.assignee?.fullName ?? "—"}
// //                           </td>

// //                           {/* Status */}

// //                           <td className="px-4 py-4">
// //                             <span
// //                               className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
// //                                 completed
// //                                   ? "bg-teal-500/10 text-teal-600 dark:text-teal-400"
// //                                   : "bg-amber-500/10 text-amber-600"
// //                               }`}
// //                             >
// //                               <span className="size-1.5 rounded-full bg-current" />

// //                               {getTaskStatusLabel(task.status, language)}
// //                             </span>
// //                           </td>
// //                         </tr>
// //                       );
// //                     })}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             ) : (
// //               <div
// //                 className={`flex flex-col items-center justify-center rounded-xl border border-dashed px-4 py-14 text-center ${surface}`}
// //               >
// //                 <Search size={28} className={`mb-3 ${mutedText}`} />

// //                 <strong className="text-sm">
// //                   {t.noResults}
// //                 </strong>

// //                 <p className={`mt-2 text-xs ${mutedText}`}>
// //                   {t.changeFilters}
// //                 </p>
// //               </div>
// //             )}
// //           </section>
// //         )}

// //         {view === "summary" && (
// //           /* Summary view */

// //           <section className="no-print grid grid-cols-1 gap-5 lg:grid-cols-2">
// //             {/* Tasks by team */}

// //             <div className={`rounded-xl border p-4 sm:p-5 ${surface}`}>
// //               <h2 className="font-bold">
// //                 {t.byProject}
// //               </h2>

// //               <p className={`mb-6 mt-1 text-xs ${mutedText}`}>
// //                 {t.projectDescription}
// //               </p>

// //               <div className="space-y-5">
// //                 {projects.map((project) => {
// //                   const count = reportTasks.filter(
// //                     (task) => task.team?.id === project.id
// //                   ).length;

// //                   const percentage = reportTasks.length
// //                     ? Math.round((count / reportTasks.length) * 100)
// //                     : 0;

// //                   return (
// //                     <div key={project.id}>
// //                       <div className="mb-2 flex items-center justify-between gap-3 text-xs">
// //                         <span className="font-semibold">
// //                           {project.name}
// //                         </span>

// //                         <strong className={mutedText}>
// //                           {count}
// //                         </strong>
// //                       </div>

// //                       <div
// //                         className={`h-2.5 overflow-hidden rounded-full ${
// //                           isDark ? "bg-gray-700" : "bg-gray-100"
// //                         }`}
// //                       >
// //                         <div
// //                           className="h-full rounded-full bg-linear-to-r from-blue-500 to-teal-500 transition-all"
// //                           style={{ width: `${percentage}%` }}
// //                         />
// //                       </div>
// //                     </div>
// //                   );
// //                 })}

// //                 {projects.length === 0 && (
// //                   <p className={`text-sm ${mutedText}`}>
// //                     {t.noResults}
// //                   </p>
// //                 )}
// //               </div>
// //             </div>

// //             {/* Completion status */}

// //             <div className={`rounded-xl border p-4 sm:p-5 ${surface}`}>
// //               <h2 className="font-bold">
// //                 {t.completionStatus}
// //               </h2>

// //               <p className={`mb-6 mt-1 text-xs ${mutedText}`}>
// //                 {t.completionDescription}
// //               </p>

// //               <div className="flex flex-col items-center justify-center gap-6 py-4">
// //                 <div
// //                   className="relative grid size-44 place-items-center rounded-full"
// //                   style={{
// //                     background: `conic-gradient(#2eb5bc 0 ${completion}%, ${
// //                       isDark ? "#374151" : "#e5e7eb"
// //                     } ${completion}% 100%)`,
// //                   }}
// //                 >
// //                   <div
// //                     className={`grid size-32 place-content-center rounded-full text-center ${
// //                       isDark ? "bg-gray-800" : "bg-white"
// //                     }`}
// //                   >
// //                     <strong className="text-3xl font-extrabold text-teal-600 dark:text-teal-400">
// //                       {completion}%
// //                     </strong>

// //                     <small className={mutedText}>
// //                       {t.complete}
// //                     </small>
// //                   </div>
// //                 </div>

// //                 <div className="flex flex-wrap justify-center gap-5 text-xs">
// //                   <span className="flex items-center gap-2">
// //                     <i className="size-2.5 rounded-full bg-teal-500" />
// //                     {t.completed} ({completed})
// //                   </span>

// //                   <span className="flex items-center gap-2">
// //                     <i
// //                       className={`size-2.5 rounded-full ${
// //                         isDark ? "bg-gray-600" : "bg-gray-300"
// //                       }`}
// //                     />
// //                     {t.progress} ({inProgress})
// //                   </span>
// //                 </div>
// //               </div>
// //             </div>
// //           </section>
// //         )}

// //         {/* Report footer */}

// //         <footer
// //           className={`flex flex-col justify-between gap-2 border-t border-gray-200 pt-4 text-xs dark:border-gray-700 sm:flex-row ${mutedText}`}
// //         >
// //           <span>{t.createdBy}</span>

// //           <span>
// //             NTRA · {t.confidential}
// //           </span>
// //         </footer>
// //       </article>

// //       {/* Print styles */}

// //       <style jsx global>{`
// //         @media print {
// //           @page {
// //             size: A4 landscape;
// //             margin: 12mm;
// //           }

// //           html,
// //           body {
// //             background: #ffffff !important;
// //             color: #111827 !important;
// //           }

// //           body * {
// //             visibility: hidden !important;
// //           }

// //           .print-task-details,
// //           .print-task-details * {
// //             visibility: visible !important;
// //           }

// //           .print-task-details {
// //             display: block !important;
// //             position: absolute !important;
// //             top: 0 !important;
// //             left: 0 !important;
// //             right: 0 !important;
// //             width: 100% !important;
// //             margin: 0 !important;
// //             padding: 0 !important;
// //             border: 0 !important;
// //             background: #ffffff !important;
// //             color: #111827 !important;
// //           }

// //           .print-task-details table {
// //             width: 100% !important;
// //             min-width: 0 !important;
// //             border-collapse: collapse !important;
// //             page-break-inside: auto;
// //           }

// //           .print-task-details thead {
// //             display: table-header-group;
// //           }

// //           .print-task-details tr {
// //             break-inside: avoid;
// //             page-break-inside: avoid;
// //           }

// //           .print-task-details th,
// //           .print-task-details td {
// //             color: #111827 !important;
// //             border-color: #d1d5db !important;
// //           }

// //           .print-task-details th {
// //             background: #f3f4f6 !important;
// //           }

// //           .print-task-details * {
// //             print-color-adjust: exact;
// //             -webkit-print-color-adjust: exact;
// //           }
// //         }
// //       `}</style>
// //     </section>
// //   );
// // }




// /* eslint-disable @next/next/no-img-element */

// "use client";

// import { useMemo, useState, type ReactNode } from "react";
// import {
//   ChartColumn,
//   Check,
//   Clock3,
//   Download,
//   FileText,
//   Filter,
//   Grid2X2,
//   RotateCcw,
//   Search,
//   RefreshCw,
// } from "lucide-react";

// import { useDashboardLayout } from "@/app/components/DashboardLayout";
// import { useAuth } from "@/app/context/AuthContext";
// import { useGetAssignedByMeQuery } from "@/app/services/tasks-api";


// // --------------------------------------------------
// // Types
// // --------------------------------------------------

// type Language = "ar" | "en";
// type ReportView = "summary" | "details";

// type ApiTask = {
//   id: string;
//   title: string;
//   description?: string | null;
//   deadline?: string | null;
//   status: string;
//   activatedAt?: string | null;
//   startedAt?: string | null;
//   createdAt?: string;
//   updatedAt?: string;

//   team?: {
//     id: string;
//     name: string;
//   } | null;

//   assignee?: {
//     id: string;
//     fullName: string;
//     email: string;
//   } | null;

//   createdBy?: {
//     id: string;
//     fullName: string;
//     email: string;
//   } | null;

//   submissions?: unknown[];
// };

// type TaskStatusFilter = "all" | "progress" | "completed";

// // --------------------------------------------------
// // Date helpers
// // --------------------------------------------------

// function getLocalDateString(date: Date) {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");

//   return `${year}-${month}-${day}`;
// }

// function getTaskDateValue(value?: string | null): string | null {
//   if (!value) return null;

//   const parsed = new Date(value);

//   if (Number.isNaN(parsed.getTime())) return null;

//   return getLocalDateString(parsed);
// }

// function formatReportDate(language: Language) {
//   return new Date().toLocaleDateString(
//     language === "ar" ? "ar-EG" : "en-US",
//     {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     }
//   );
// }

// function displayDate(value: string | null | undefined, language: Language) {
//   if (!value) return "—";

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) return "—";

//   return date.toLocaleDateString(
//     language === "ar" ? "ar-EG" : "en-US",
//     {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     }
//   );
// }

// // --------------------------------------------------
// // Status helpers
// // --------------------------------------------------

// function isTaskCompleted(status: string) {
//   return status?.toUpperCase() === "COMPLETED";
// }

// function getTaskStatusLabel(status: string, language: Language) {
//   const normalized = status?.toUpperCase();

//   const labels: Record<string, { ar: string; en: string }> = {
//     COMPLETED: {
//       ar: "مكتملة",
//       en: "Completed",
//     },
//     SUBMITTED: {
//       ar: "تم التسليم",
//       en: "Submitted",
//     },
//     DISPATCHED: {
//       ar: "تم الإسناد",
//       en: "Assigned",
//     },
//     REWORK: {
//       ar: "إعادة العمل",
//       en: "Rework",
//     },
//     IN_PROGRESS: {
//       ar: "قيد التنفيذ",
//       en: "In Progress",
//     },
//     PENDING: {
//       ar: "قيد الانتظار",
//       en: "Pending",
//     },
//     CANCELLED: {
//       ar: "ملغاة",
//       en: "Cancelled",
//     },
//     DRAFT: {
//       ar: "مسودة",
//       en: "Draft",
//     },
//   };

//   return labels[normalized]?.[language] ?? status ?? "—";
// }

// // --------------------------------------------------
// // Custom select with SVG arrow
// // --------------------------------------------------


// type CustomSelectProps = {
//   value: string;
//   onChange: (value: string) => void;
//   dir: "rtl" | "ltr";
//   className: string;
//   children: ReactNode;
//   ariaLabel: string;
// };

// function CustomSelect({
//   value,
//   onChange,
//   dir,
//   className,
//   children,
//   ariaLabel,
// }: CustomSelectProps) {
//   return (
//     <div className="relative">
//       <select
//         aria-label={ariaLabel}
//         dir={dir}
//         value={value}
//         onChange={(event) => onChange(event.target.value)}
//         className={`${className} appearance-none ${
//           dir === "rtl" ? "pl-10 pr-3" : "pl-3 pr-10"
//         }`}
//       >
//         {children}
//       </select>

//       <svg
//         aria-hidden="true"
//         viewBox="0 0 20 20"
//         fill="none"
//         className={`pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-current ${
//           dir === "rtl" ? "left-3" : "right-3"
//         }`}
//       >
//         <path
//           d="m5.5 7.5 4.5 4.5 4.5-4.5"
//           stroke="currentColor"
//           strokeWidth="1.8"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />
//       </svg>
//     </div>
//   );
// }

// // --------------------------------------------------
// // Component
// // --------------------------------------------------

// export default function TaskReportsPage() {
//   const { lang, isArabic, darkMode } = useDashboardLayout();
//   const { user } = useAuth();

//   const language: Language = lang === "ar" ? "ar" : "en";
//   const isRTL = isArabic || language === "ar";
//   const isDark = darkMode;

//   const authUser = user as unknown as Record<string, unknown> | null;
//   const firstName =
//     typeof authUser?.firstName === "string" ? authUser.firstName : "";
//   const lastName =
//     typeof authUser?.lastName === "string" ? authUser.lastName : "";
//   const printedBy =
//     [
//       authUser?.fullName,
//       authUser?.name,
//       `${firstName} ${lastName}`.trim(),
//       authUser?.email,
//       authUser?.username,
//     ].find((value) => typeof value === "string" && value.trim()) as
//       | string
//       | undefined;

//   // --------------------------------------------------
//   // API
//   // --------------------------------------------------

//   const {
//     data,
//     isLoading,
//     isFetching,
//     error,
//     refetch,
//   } = useGetAssignedByMeQuery({
//     page: 1,
//     limit: 100,
//   });

//   const taskList: ApiTask[] = (data?.tasks ?? []) as ApiTask[];

//   // --------------------------------------------------
//   // Filters state
//   // --------------------------------------------------

//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo, setDateTo] = useState("");

//   const [statusFilter, setStatusFilter] =
//     useState<TaskStatusFilter>("all");

//   const [projectFilter, setProjectFilter] = useState("all");

//   const [view, setView] = useState<ReportView>("details");

//   // --------------------------------------------------
//   // Translations
//   // --------------------------------------------------

//   const t = {
//     ar: {
//       kicker: "التقارير والتحليلات",
//       title: "تقرير المهام",
//       description:
//         "صفِّ المهام واستعرض النتائج واطبع تقريرًا احترافيًا.",

//       summary: "ملخص",
//       details: "تفصيلي",
//       print: "طباعة التقرير",
//       refresh: "تحديث",

//       filters: "تصفية التقرير",
//       matchingResults: "نتيجة مطابقة",

//       from: "من تاريخ",
//       to: "إلى تاريخ",

//       status: "الحالة",
//       allStatuses: "كل الحالات",
//       progress: "قيد التنفيذ",
//       completed: "مكتملة",

//       project: "الفريق",
//       allProjects: "كل الفرق",

//       reset: "إعادة ضبط",

//       totalTasks: "إجمالي المهام",
//       completedTasks: "المهام المكتملة",
//       inProgress: "المهام غير المكتملة",

//       withinFilters: "ضمن الفلاتر المحددة",
//       completionRate: "معدل الإنجاز",

//       needsFollowUp: "تحتاج إلى متابعة",
//       overallProgress: "التقدم الإجمالي",

//       doneOf: "تم إنجاز",
//       outOf: "من أصل",
//       tasks: "مهام",

//       taskDetails: "تفاصيل المهام",
//       matchingTasks: "قائمة بجميع المهام المطابقة لمعايير التقرير",

//       task: "المهمة",
//       dueDate: "تاريخ الاستحقاق",
//       projectColumn: "الفريق",
//       assignee: "المسؤول",
//       statusColumn: "الحالة",

//       noResults: "لا توجد نتائج",
//       changeFilters: "غيّر معايير التصفية لعرض مهام أخرى.",

//       byProject: "المهام حسب الفريق",
//       projectDescription: "توزيع المهام على الفرق",

//       completionStatus: "حالة الإنجاز",
//       completionDescription: "نسبة المهام المكتملة وغير المكتملة",

//       complete: "مكتمل",

//       createdBy: "تم إنشاء هذا التقرير بواسطة NTRA",
//       confidential: "سري للاستخدام الداخلي",
//       reportNumber: "رقم التقرير",

//       loading: "جاري تحميل المهام...",
//       loadError: "حدث خطأ أثناء تحميل تقرير المهام.",
//       retry: "إعادة المحاولة",

//       dateRangeError: "تاريخ البداية يجب أن يكون قبل تاريخ النهاية.",
//       totalFromApi: "إجمالي المهام من الخادم",
//       showing: "المعروض",
//       noTeam: "بدون فريق",
//       printedBy: "تمت الطباعة بواسطة",
//       reportDate: "تاريخ التقرير",
//     },

//     en: {
//       kicker: "REPORTS & ANALYTICS",
//       title: "Task Report",
//       description:
//         "Filter tasks, review performance, and print a professional report.",

//       summary: "Summary",
//       details: "Details",
//       print: "Print Report",
//       refresh: "Refresh",

//       filters: "Report Filters",
//       matchingResults: "matching results",

//       from: "From date",
//       to: "To date",

//       status: "Status",
//       allStatuses: "All statuses",
//       progress: "In progress",
//       completed: "Completed",

//       project: "Team",
//       allProjects: "All teams",

//       reset: "Reset filters",

//       totalTasks: "Total tasks",
//       completedTasks: "Completed tasks",
//       inProgress: "Incomplete tasks",

//       withinFilters: "Within selected filters",
//       completionRate: "Completion rate",

//       needsFollowUp: "Needs follow-up",
//       overallProgress: "Overall progress",

//       doneOf: "Completed",
//       outOf: "out of",
//       tasks: "tasks",

//       taskDetails: "Task details",
//       matchingTasks: "All tasks matching the selected report criteria",

//       task: "Task",
//       dueDate: "Due date",
//       projectColumn: "Team",
//       assignee: "Assignee",
//       statusColumn: "Status",

//       noResults: "No results found",
//       changeFilters: "Change your filters to see other tasks.",

//       byProject: "Tasks by team",
//       projectDescription: "Task distribution across teams",

//       completionStatus: "Completion status",
//       completionDescription: "Completed and incomplete tasks",

//       complete: "Complete",

//       createdBy: "Report generated by NTRA",
//       confidential: "Confidential · Internal use only",
//       reportNumber: "Report number",

//       loading: "Loading tasks...",
//       loadError: "Failed to load task report.",
//       retry: "Retry",

//       dateRangeError: "Start date must be before end date.",
//       totalFromApi: "Total tasks from server",
//       showing: "Showing",
//       noTeam: "No team",
//       printedBy: "Printed by",
//       reportDate: "Report date",
//     },
//   }[language];

//   // --------------------------------------------------
//   // Projects / Teams
//   // --------------------------------------------------

//   const projects = useMemo(() => {
//     const uniqueTeams = new Map<string, string>();

//     taskList.forEach((task) => {
//       if (task.team?.id && task.team?.name) {
//         uniqueTeams.set(task.team.id, task.team.name);
//       }
//     });

//     return Array.from(uniqueTeams.entries()).map(([id, name]) => ({
//       id,
//       name,
//     }));
//   }, [taskList]);

//   // --------------------------------------------------
//   // Filter validation
//   // --------------------------------------------------

//   const today = getLocalDateString(new Date());

//   const rangeIsInvalid =
//     Boolean(dateFrom && dateTo && dateFrom > dateTo);

//   // --------------------------------------------------
//   // Filter tasks
//   // --------------------------------------------------

//   const reportTasks = useMemo(() => {
//     return taskList.filter((task) => {
//       const taskDate = getTaskDateValue(task.deadline);

//       const completed = isTaskCompleted(task.status);

//       const dateMatches =
//         (!dateFrom ||
//           (taskDate !== null && taskDate >= dateFrom)) &&
//         (!dateTo ||
//           (taskDate !== null && taskDate <= dateTo));

//       const statusMatches =
//         statusFilter === "all" ||
//         (statusFilter === "completed" && completed) ||
//         (statusFilter === "progress" && !completed);

//       const projectMatches =
//         projectFilter === "all" ||
//         task.team?.id === projectFilter;

//       return (
//         dateMatches &&
//         statusMatches &&
//         projectMatches
//       );
//     });
//   }, [
//     taskList,
//     dateFrom,
//     dateTo,
//     statusFilter,
//     projectFilter,
//   ]);

//   // --------------------------------------------------
//   // Statistics
//   // --------------------------------------------------

//   const completed = reportTasks.filter((task) =>
//     isTaskCompleted(task.status)
//   ).length;

//   const inProgress = reportTasks.length - completed;

//   const completion = reportTasks.length
//     ? Math.round((completed / reportTasks.length) * 100)
//     : 0;

//   // --------------------------------------------------
//   // Reset filters
//   // --------------------------------------------------

//   const resetFilters = () => {
//     setDateFrom("");
//     setDateTo("");
//     setStatusFilter("all");
//     setProjectFilter("all");
//   };

//   // --------------------------------------------------
//   // Styling
//   // --------------------------------------------------

//   const surface = isDark
//     ? "border-gray-700 bg-gray-800"
//     : "border-gray-200 bg-white";

//   const pageText = isDark
//     ? "text-gray-100"
//     : "text-gray-900";

//   const mutedText = isDark
//     ? "text-gray-400"
//     : "text-gray-500";

//   const inputStyle = isDark
//     ? "border-gray-600 bg-gray-900 text-gray-100 placeholder:text-gray-500"
//     : "border-gray-200 bg-white text-gray-800 placeholder:text-gray-400";

//   const controlStyle =
//     "h-10 w-full rounded-xl border px-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15";

//   // --------------------------------------------------
//   // Loading state
//   // --------------------------------------------------

//   if (isLoading) {
//     return (
//       <section
//         dir={isRTL ? "rtl" : "ltr"}
//         className={`flex min-h-80 flex-col items-center justify-center gap-4 ${pageText}`}
//       >
//         <div className="size-10 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />

//         <p className={`text-sm ${mutedText}`}>
//           {t.loading}
//         </p>
//       </section>
//     );
//   }

//   // --------------------------------------------------
//   // Error state
//   // --------------------------------------------------

//   if (error && taskList.length === 0) {
//     return (
//       <section
//         dir={isRTL ? "rtl" : "ltr"}
//         className={`mx-auto w-full max-w-7xl p-4 ${pageText}`}
//       >
//         <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/30">
//           <p className="text-sm font-semibold text-red-600 dark:text-red-400">
//             {t.loadError}
//           </p>

//           <button
//             type="button"
//             onClick={() => refetch()}
//             className="mt-4 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-700"
//           >
//             <RefreshCw size={15} />
//             {t.retry}
//           </button>
//         </div>
//       </section>
//     );
//   }

//   // --------------------------------------------------
//   // Main component
//   // --------------------------------------------------

//   return (
//     <section
//       dir={isRTL ? "rtl" : "ltr"}
//       className={`mx-auto w-full space-y-6 p-1 sm:p-3 ${pageText}`}
//     >
//       {/* Page heading */}

//       <div className="no-print flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
//         <div>
//           <span className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wide text-teal-600 dark:text-teal-400">
//             <ChartColumn size={15} />
//             {t.kicker}
//           </span>

//           <h1 className="text-2xl font-bold sm:text-3xl">
//             {t.title}
//           </h1>

//           <p className={`mt-2 text-sm ${mutedText}`}>
//             {t.description}
//           </p>

//           <p className={`mt-2 text-xs ${mutedText}`}>
//             {t.totalFromApi}: {data?.count ?? taskList.length}
//           </p>
//         </div>

//         <div className="flex flex-wrap items-center gap-2">
//           <div className={`flex rounded-xl border p-1 ${surface}`}>
//             <button
//               type="button"
//               onClick={() => setView("summary")}
//               className={`flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition ${
//                 view === "summary"
//                   ? "bg-teal-600 text-white shadow-sm"
//                   : mutedText
//               }`}
//             >
//               <ChartColumn size={16} />
//               {t.summary}
//             </button>

//             <button
//               type="button"
//               onClick={() => setView("details")}
//               className={`flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition ${
//                 view === "details"
//                   ? "bg-teal-600 text-white shadow-sm"
//                   : mutedText
//               }`}
//             >
//               <Grid2X2 size={16} />
//               {t.details}
//             </button>
//           </div>

//           <button
//             type="button"
//             onClick={() => refetch()}
//             disabled={isFetching}
//             className={`flex h-11 items-center gap-2 rounded-xl border px-3 text-sm font-semibold transition ${surface} ${mutedText}`}
//           >
//             <RefreshCw
//               size={15}
//               className={isFetching ? "animate-spin" : ""}
//             />
//             {t.refresh}
//           </button>

//           <button
//             type="button"
//             onClick={() => window.print()}
//             className="flex h-11 items-center gap-2 rounded-xl bg-teal-600 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700"
//           >
//             <Download size={16} />
//             {t.print}
//           </button>
//         </div>
//       </div>

//       {/* Filters */}

//       <div className={`no-print rounded-2xl border p-4 shadow-sm sm:p-5 ${surface}`}>
//         <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
//           <div className="flex items-center gap-3">
//             <span className="grid size-10 place-items-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
//               <Filter size={19} />
//             </span>

//             <div>
//               <h2 className="font-bold">
//                 {t.filters}
//               </h2>

//               <p className={`mt-1 text-xs ${mutedText}`}>
//                 {reportTasks.length} {t.matchingResults}
//               </p>
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={resetFilters}
//             className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition hover:bg-gray-500/10 ${mutedText}`}
//           >
//             <RotateCcw size={14} />
//             {t.reset}
//           </button>
//         </div>

//         <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
//           {/* From date */}

//           <label className="space-y-2">
//             <span className={`block text-xs font-semibold ${mutedText}`}>
//               {t.from}
//             </span>

//             <input
//               type="date"
//               value={dateFrom}
//               max={dateTo || undefined}
//               onChange={(event) => setDateFrom(event.target.value)}
//               className={`${controlStyle} ${inputStyle}`}
//             />
//           </label>

//           {/* To date */}

//           <label className="space-y-2">
//             <span className={`block text-xs font-semibold ${mutedText}`}>
//               {t.to}
//             </span>

//             <input
//               type="date"
//               value={dateTo}
//               min={dateFrom || undefined}
//               onChange={(event) => setDateTo(event.target.value)}
//               className={`${controlStyle} ${inputStyle}`}
//             />
//           </label>

//           {/* Status */}

//           <label className="space-y-2">
//             <span className={`block text-xs font-semibold ${mutedText}`}>
//               {t.status}
//             </span>

//             <CustomSelect
//               ariaLabel={t.status}
//               dir={isRTL ? "rtl" : "ltr"}
//               value={statusFilter}
//               onChange={(value) => setStatusFilter(value as TaskStatusFilter)}
//               className={`${controlStyle} ${inputStyle}`}
//             >
//               <option value="all">{t.allStatuses}</option>
//               <option value="progress">{t.progress}</option>
//               <option value="completed">{t.completed}</option>
//             </CustomSelect>
//           </label>

//           {/* Team */}

//           <label className="space-y-2">
//             <span className={`block text-xs font-semibold ${mutedText}`}>
//               {t.project}
//             </span>

//             <CustomSelect
//               ariaLabel={t.project}
//               dir={isRTL ? "rtl" : "ltr"}
//               value={projectFilter}
//               onChange={setProjectFilter}
//               className={`${controlStyle} ${inputStyle}`}
//             >
//               <option value="all">{t.allProjects}</option>

//               {projects.map((project) => (
//                 <option key={project.id} value={project.id}>
//                   {project.name}
//                 </option>
//               ))}
//             </CustomSelect>
//           </label>
//         </div>

//         {rangeIsInvalid && (
//           <p className="mt-3 text-xs font-medium text-red-500">
//             {t.dateRangeError}
//           </p>
//         )}
//       </div>

//       {/* Printable report */}

//       <article
//         className={`print-report space-y-5 rounded-2xl border p-4 shadow-sm sm:p-6 lg:p-7 ${surface}`}
//       >
//         {/* Report header */}

//         <header className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-5 dark:border-gray-700 sm:flex-row sm:items-center">
//           <div className="flex items-center gap-3">
//             <img
//               src="/icon.png"
//               alt="NTRA Logo"
//               className="h-12 w-auto max-w-36 object-contain"
//             />

//             <div>
//               <strong className="block text-lg font-extrabold">
//                 NTRA
//               </strong>

//               <small className={mutedText}>
//                 National Telecom Regulatory Authority
//               </small>
//             </div>
//           </div>

//           <div className={isRTL ? "text-right" : "text-left"}>
//             <h2 className="font-bold">
//               {t.title}
//             </h2>

//             <p className={`mt-1 text-sm ${mutedText}`}>
//               {formatReportDate(language)}
//             </p>

//             <small className={mutedText}>
//               {t.reportNumber}: RPT-{today.replaceAll("-", "")}
//             </small>
//           </div>
//         </header>

//         {/* Statistics */}

//         <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
//           {[
//             {
//               label: t.totalTasks,
//               value: reportTasks.length,
//               note: t.withinFilters,
//               icon: FileText,
//               color: "text-blue-500 bg-blue-500/10",
//             },
//             {
//               label: t.completedTasks,
//               value: completed,
//               note: `${completion}% ${t.completionRate}`,
//               icon: Check,
//               color: "text-teal-500 bg-teal-500/10",
//             },
//             {
//               label: t.inProgress,
//               value: inProgress,
//               note: t.needsFollowUp,
//               icon: Clock3,
//               color: "text-amber-500 bg-amber-500/10",
//             },
//           ].map((stat) => {
//             const StatIcon = stat.icon;

//             return (
//               <div
//                 key={stat.label}
//                 className={`rounded-xl border p-4 ${surface}`}
//               >
//                 <span
//                   className={`mb-4 grid size-10 place-items-center rounded-xl ${stat.color}`}
//                 >
//                   <StatIcon size={19} />
//                 </span>

//                 <p className={`text-xs ${mutedText}`}>
//                   {stat.label}
//                 </p>

//                 <strong className="mt-1 block text-2xl font-extrabold tabular-nums">
//                   {stat.value}
//                 </strong>

//                 <small className={`mt-2 block text-xs ${mutedText}`}>
//                   {stat.note}
//                 </small>
//               </div>
//             );
//           })}
//         </div>

//         {/* Overall progress */}

//         <section className={`rounded-xl border p-4 sm:p-5 ${surface}`}>
//           <div className="mb-3 flex items-center justify-between gap-3">
//             <h3 className="font-bold">
//               {t.overallProgress}
//             </h3>

//             <strong className="text-lg font-extrabold text-teal-600 dark:text-teal-400">
//               {completion}%
//             </strong>
//           </div>

//           <div
//             className={`h-3 overflow-hidden rounded-full ${
//               isDark ? "bg-gray-700" : "bg-gray-100"
//             }`}
//           >
//             <div
//               className="h-full rounded-full bg-linear-to-r from-blue-500 to-teal-500 transition-all duration-300"
//               style={{ width: `${completion}%` }}
//             />
//           </div>

//           <p className={`mt-3 text-xs ${mutedText}`}>
//             {t.doneOf} {completed} {t.outOf} {reportTasks.length} {t.tasks}.
//           </p>
//         </section>

//         {/* Details view */}

//         {(
//           <section className={`print-task-details ${view === "summary" ? "hidden" : ""}`}>
//             {/* Print-only report heading: logo beside task details */}
//             <div className="print-only-header relative mb-5 hidden items-center justify-between gap-4 border-b border-gray-200 pb-4">
//                 <div>
//                     <h2 className="text-lg font-extrabold text-gray-900">
//                     {t.taskDetails}
//                     </h2>
//                     <p className="mt-1 text-xs text-gray-500">
//                     {t.matchingTasks}
//                     </p>
//                 </div>

//                 <img
//                     src="/ntra-black.png"
//                     alt="NTRA Logo"
//                     className="absolute left-1/2 top-1/2 h-12 w-auto max-w-36 -translate-x-1/2 -translate-y-1/2 object-contain"
//                 />

//                 <span className="text-sm font-bold text-gray-700">
//                     {reportTasks.length} {t.tasks}
//                 </span>
//             </div>

//             <div className="screen-only-details-heading mb-4 flex items-center justify-between gap-3">
//               <div>
//                 <h2 className="font-bold">
//                   {t.taskDetails}
//                 </h2>

//                 <p className={`mt-1 text-xs ${mutedText}`}>
//                   {t.matchingTasks}
//                 </p>
//               </div>

//               <span className="rounded-full bg-teal-500/10 px-3 py-1.5 text-xs font-bold text-teal-600 dark:text-teal-400">
//                 {reportTasks.length} {t.tasks}
//               </span>
//             </div>

//             {reportTasks.length > 0 ? (
//               <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
//                 <table className="w-full min-w-180 text-sm">
//                   <thead
//                     className={
//                       isDark
//                         ? "bg-gray-900/70 text-gray-400"
//                         : "bg-gray-50 text-gray-500"
//                     }
//                   >
//                     <tr>
//                       {[
//                         t.task,
//                         t.projectColumn,
//                         t.dueDate,
//                         t.assignee,
//                         t.statusColumn,
//                       ].map((heading) => (
//                         <th
//                           key={heading}
//                           className={`px-4 py-3 text-xs font-bold ${
//                             isRTL ? "text-right" : "text-left"
//                           }`}
//                         >
//                           {heading}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {reportTasks.map((task) => {
//                       const completed = isTaskCompleted(task.status);

//                       return (
//                         <tr
//                           key={task.id}
//                           className="border-t border-gray-200 transition hover:bg-gray-500/5 dark:border-gray-700"
//                         >
//                           {/* Task */}

//                           <td className="px-4 py-4">
//                             <div className="flex items-center gap-3">
//                               <span
//                                 className={`grid size-6 shrink-0 place-items-center rounded-md border ${
//                                   completed
//                                     ? "border-teal-500 bg-teal-500 text-white"
//                                     : "border-gray-300 dark:border-gray-600"
//                                 }`}
//                               >
//                                 {completed && <Check size={13} />}
//                               </span>

//                               <div className="min-w-0">
//                                 <strong className="block max-w-xs truncate text-xs font-semibold">
//                                   {task.title}
//                                 </strong>

//                                 <small className={`mt-1 block text-[11px] ${mutedText}`}>
//                                   {task.id}
//                                 </small>
//                               </div>
//                             </div>
//                           </td>

//                           {/* Team */}

//                           <td className={`px-4 py-4 text-xs ${mutedText}`}>
//                             {task.team?.name ?? t.noTeam}
//                           </td>

//                           {/* Deadline */}

//                           <td className={`px-4 py-4 text-xs ${mutedText}`}>
//                             {displayDate(task.deadline, language)}
//                           </td>

//                           {/* Assignee */}

//                           <td className={`px-4 py-4 text-xs ${mutedText}`}>
//                             {task.assignee?.fullName ?? "—"}
//                           </td>

//                           {/* Status */}

//                           <td className="px-4 py-4">
//                             <span
//                               className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
//                                 completed
//                                   ? "bg-teal-500/10 text-teal-600 dark:text-teal-400"
//                                   : "bg-amber-500/10 text-amber-600"
//                               }`}
//                             >
//                               <span className="size-1.5 rounded-full bg-current" />

//                               {getTaskStatusLabel(task.status, language)}
//                             </span>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <div
//                 className={`flex flex-col items-center justify-center rounded-xl border border-dashed px-4 py-14 text-center ${surface}`}
//               >
//                 <Search size={28} className={`mb-3 ${mutedText}`} />

//                 <strong className="text-sm">
//                   {t.noResults}
//                 </strong>

//                 <p className={`mt-2 text-xs ${mutedText}`}>
//                   {t.changeFilters}
//                 </p>
//               </div>
//             )}

//             {/* Print-only footer */}
//             <footer className="print-only-footer mt-8 hidden items-center justify-between gap-4 border-t border-gray-300 pt-4 text-xs text-gray-700">
//               <div>
//                 <span className="font-semibold">{t.printedBy}:</span>{" "}
//                 {printedBy || (language === "ar" ? "المستخدم الحالي" : "Current user")}
//               </div>
//               <div>
//                 <span className="font-semibold">{t.reportDate}:</span>{" "}
//                 {formatReportDate(language)}
//               </div>
//             </footer>
//           </section>
//         )}

//         {view === "summary" && (
//           /* Summary view */

//           <section className="no-print grid grid-cols-1 gap-5 lg:grid-cols-2">
//             {/* Tasks by team */}

//             <div className={`rounded-xl border p-4 sm:p-5 ${surface}`}>
//               <h2 className="font-bold">
//                 {t.byProject}
//               </h2>

//               <p className={`mb-6 mt-1 text-xs ${mutedText}`}>
//                 {t.projectDescription}
//               </p>

//               <div className="space-y-5">
//                 {projects.map((project) => {
//                   const count = reportTasks.filter(
//                     (task) => task.team?.id === project.id
//                   ).length;

//                   const percentage = reportTasks.length
//                     ? Math.round((count / reportTasks.length) * 100)
//                     : 0;

//                   return (
//                     <div key={project.id}>
//                       <div className="mb-2 flex items-center justify-between gap-3 text-xs">
//                         <span className="font-semibold">
//                           {project.name}
//                         </span>

//                         <strong className={mutedText}>
//                           {count}
//                         </strong>
//                       </div>

//                       <div
//                         className={`h-2.5 overflow-hidden rounded-full ${
//                           isDark ? "bg-gray-700" : "bg-gray-100"
//                         }`}
//                       >
//                         <div
//                           className="h-full rounded-full bg-linear-to-r from-blue-500 to-teal-500 transition-all"
//                           style={{ width: `${percentage}%` }}
//                         />
//                       </div>
//                     </div>
//                   );
//                 })}

//                 {projects.length === 0 && (
//                   <p className={`text-sm ${mutedText}`}>
//                     {t.noResults}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Completion status */}

//             <div className={`rounded-xl border p-4 sm:p-5 ${surface}`}>
//               <h2 className="font-bold">
//                 {t.completionStatus}
//               </h2>

//               <p className={`mb-6 mt-1 text-xs ${mutedText}`}>
//                 {t.completionDescription}
//               </p>

//               <div className="flex flex-col items-center justify-center gap-6 py-4">
//                 <div
//                   className="relative grid size-44 place-items-center rounded-full"
//                   style={{
//                     background: `conic-gradient(#2eb5bc 0 ${completion}%, ${
//                       isDark ? "#374151" : "#e5e7eb"
//                     } ${completion}% 100%)`,
//                   }}
//                 >
//                   <div
//                     className={`grid size-32 place-content-center rounded-full text-center ${
//                       isDark ? "bg-gray-800" : "bg-white"
//                     }`}
//                   >
//                     <strong className="text-3xl font-extrabold text-teal-600 dark:text-teal-400">
//                       {completion}%
//                     </strong>

//                     <small className={mutedText}>
//                       {t.complete}
//                     </small>
//                   </div>
//                 </div>

//                 <div className="flex flex-wrap justify-center gap-5 text-xs">
//                   <span className="flex items-center gap-2">
//                     <i className="size-2.5 rounded-full bg-teal-500" />
//                     {t.completed} ({completed})
//                   </span>

//                   <span className="flex items-center gap-2">
//                     <i
//                       className={`size-2.5 rounded-full ${
//                         isDark ? "bg-gray-600" : "bg-gray-300"
//                       }`}
//                     />
//                     {t.progress} ({inProgress})
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </section>
//         )}

//         {/* Report footer */}

//         <footer
//           className={`flex flex-col justify-between gap-2 border-t border-gray-200 pt-4 text-xs dark:border-gray-700 sm:flex-row ${mutedText}`}
//         >
//           <span>{t.createdBy}</span>

//           <span>
//             NTRA · {t.confidential}
//           </span>
//         </footer>
//       </article>

//       {/* Print styles */}

//       <style jsx global>{`
//         @media print {
//           @page {
//             size: A4 landscape;
//             margin: 12mm;
//           }

//           html,
//           body {
//             background: #ffffff !important;
//             color: #111827 !important;
//           }

//           body * {
//             visibility: hidden !important;
//           }

//           .print-task-details,
//           .print-task-details * {
//             visibility: visible !important;
//           }

//           .print-task-details {
//             display: block !important;
//             position: absolute !important;
//             top: 0 !important;
//             left: 0 !important;
//             right: 0 !important;
//             width: 100% !important;
//             margin: 0 !important;
//             padding: 0 !important;
//             border: 0 !important;
//             background: #ffffff !important;
//             color: #111827 !important;
//           }

//           .print-only-header,
//           .print-only-footer {
//             display: flex !important;
//           }

//           .screen-only-details-heading {
//             display: none !important;
//           }

//           .print-task-details table {
//             width: 100% !important;
//             min-width: 0 !important;
//             border-collapse: collapse !important;
//             page-break-inside: auto;
//           }

//           .print-task-details thead {
//             display: table-header-group;
//           }

//           .print-task-details tr {
//             break-inside: avoid;
//             page-break-inside: avoid;
//           }

//           .print-task-details th,
//           .print-task-details td {
//             color: #111827 !important;
//             border-color: #d1d5db !important;
//           }

//           .print-task-details th {
//             background: #f3f4f6 !important;
//           }

//           .print-task-details * {
//             print-color-adjust: exact;
//             -webkit-print-color-adjust: exact;
//           }
//         }
//       `}</style>
//     </section>
//   );
// }





/* eslint-disable @next/next/no-img-element */

"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  ChartColumn,
  Check,
  Clock3,
  Download,
  FileText,
  Filter,
  Grid2X2,
  RotateCcw,
  Search,
  RefreshCw,
} from "lucide-react";

import { useDashboardLayout } from "@/app/components/DashboardLayout";
import { useAuth } from "@/app/context/AuthContext";
import { useGetAllTasksQuery } from "@/app/services/tasks-api";
import {
  useGetAdminUsersQuery,
  useGetTeamsQuery,
} from "@/app/services/team-members-api";


// --------------------------------------------------
// Types
// --------------------------------------------------

type Language = "ar" | "en";
type ReportView = "summary" | "details";

type ApiTask = {
  id: string;
  title: string;
  description?: string | null;
  deadline?: string | null;
  status: string;
  activatedAt?: string | null;
  startedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;

  team?: {
    id: string;
    name: string;
  } | null;

  assignee?: {
    id: string;
    fullName: string;
    email: string;
  } | null;

  createdBy?: {
    id: string;
    fullName: string;
    email: string;
  } | null;

  submissions?: unknown[];
};

type TaskStatusFilter = "all" | "progress" | "completed";

type FilterUser = {
  id: string;
  fullName?: string;
  name?: string;
  email?: string;
};

type FilterTeam = { id: string; name: string };

function getApiList<T>(response: unknown): T[] {
  if (Array.isArray(response)) return response as T[];
  if (response && typeof response === "object" && "data" in response &&
      Array.isArray((response as { data?: unknown }).data)) {
    return (response as { data: T[] }).data;
  }
  return [];
}

// --------------------------------------------------
// Date helpers
// --------------------------------------------------

function getLocalDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getTaskDateValue(value?: string | null): string | null {
  if (!value) return null;

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) return null;

  return getLocalDateString(parsed);
}

function formatReportDate(language: Language) {
  return new Date().toLocaleDateString(
    language === "ar" ? "ar-EG" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
}

function displayDate(value: string | null | undefined, language: Language) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString(
    language === "ar" ? "ar-EG" : "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );
}

// --------------------------------------------------
// Status helpers
// --------------------------------------------------

function isTaskCompleted(status: string) {
  return status?.toUpperCase() === "COMPLETED";
}

function getTaskStatusLabel(status: string, language: Language) {
  const normalized = status?.toUpperCase();

  const labels: Record<string, { ar: string; en: string }> = {
    COMPLETED: {
      ar: "مكتملة",
      en: "Completed",
    },
    SUBMITTED: {
      ar: "تم التسليم",
      en: "Submitted",
    },
    DISPATCHED: {
      ar: "تم الإسناد",
      en: "Assigned",
    },
    REWORK: {
      ar: "إعادة العمل",
      en: "Rework",
    },
    IN_PROGRESS: {
      ar: "قيد التنفيذ",
      en: "In Progress",
    },
    PENDING: {
      ar: "قيد الانتظار",
      en: "Pending",
    },
    CANCELLED: {
      ar: "ملغاة",
      en: "Cancelled",
    },
    DRAFT: {
      ar: "مسودة",
      en: "Draft",
    },
  };

  return labels[normalized]?.[language] ?? status ?? "—";
}

// --------------------------------------------------
// Custom select with SVG arrow
// --------------------------------------------------


type CustomSelectProps = {
  value: string;
  onChange: (value: string) => void;
  dir: "rtl" | "ltr";
  className: string;
  children: ReactNode;
  ariaLabel: string;
};

function CustomSelect({
  value,
  onChange,
  dir,
  className,
  children,
  ariaLabel,
}: CustomSelectProps) {
  return (
    <div className="relative">
      <select
        aria-label={ariaLabel}
        dir={dir}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${className} appearance-none ${
          dir === "rtl" ? "pl-10 pr-3" : "pl-3 pr-10"
        }`}
      >
        {children}
      </select>

      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        className={`pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-current ${
          dir === "rtl" ? "left-3" : "right-3"
        }`}
      >
        <path
          d="m5.5 7.5 4.5 4.5 4.5-4.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// --------------------------------------------------
// Component
// --------------------------------------------------

export default function TaskReportsPage() {
  const { lang, isArabic, darkMode } = useDashboardLayout();
  const { user } = useAuth();

  const language: Language = lang === "ar" ? "ar" : "en";
  const isRTL = isArabic || language === "ar";
  const isDark = darkMode;

  const authUser = user as unknown as Record<string, unknown> | null;
  const firstName =
    typeof authUser?.firstName === "string" ? authUser.firstName : "";
  const lastName =
    typeof authUser?.lastName === "string" ? authUser.lastName : "";
  const printedBy =
    [
      authUser?.fullName,
      authUser?.name,
      `${firstName} ${lastName}`.trim(),
      authUser?.email,
      authUser?.username,
    ].find((value) => typeof value === "string" && value.trim()) as
      | string
      | undefined;

  // --------------------------------------------------
  // API
  // --------------------------------------------------

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<TaskStatusFilter>("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");

  const { data: usersResponse } = useGetAdminUsersQuery();
  const { data: teamsResponse } = useGetTeamsQuery();

  const users = useMemo(() => getApiList<FilterUser>(usersResponse), [usersResponse]);
  const apiTeams = useMemo(() => getApiList<FilterTeam>(teamsResponse), [teamsResponse]);
  const [view, setView] = useState<ReportView>("details");

  const apiStatus =
    statusFilter === "completed"
      ? "COMPLETED"
      : statusFilter === "progress"
        ? "IN_PROGRESS"
        : undefined;

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetAllTasksQuery(
    {
      page: 1,
      limit: 100,
      ...(dateFrom ? { from: dateFrom } : {}),
      ...(dateTo ? { to: dateTo } : {}),
      ...(apiStatus ? { status: apiStatus } : {}),
      ...(projectFilter !== "all" ? { teamId: projectFilter } : {}),
      ...(userFilter !== "all" ? { userId: userFilter } : {}),
    },
    { skip: Boolean(dateFrom && dateTo && dateFrom > dateTo) }
  );

  const taskList: ApiTask[] = (data?.data ?? []) as ApiTask[];

  // --------------------------------------------------
  // Filters state
  // --------------------------------------------------


  // --------------------------------------------------
  // Translations
  // --------------------------------------------------

  const t = {
    ar: {
      kicker: "التقارير والتحليلات",
      title: "تقرير المهام",
      description:
        "صفِّ المهام واستعرض النتائج واطبع تقريرًا احترافيًا.",

      summary: "ملخص",
      details: "تفصيلي",
      print: "طباعة التقرير",
      refresh: "تحديث",

      filters: "تصفية التقرير",
      matchingResults: "نتيجة مطابقة",

      from: "من تاريخ",
      to: "إلى تاريخ",

      status: "الحالة",
      allStatuses: "كل الحالات",
      progress: "قيد التنفيذ",
      completed: "مكتملة",

      project: "الفريق",
      allProjects: "كل الفرق",
      user: "الموظف",
      allUsers: "كل الموظفين",
      taskFrom: "المهمة من",
      taskTo: "المهمة إلى",

      reset: "إعادة ضبط",

      totalTasks: "إجمالي المهام",
      completedTasks: "المهام المكتملة",
      inProgress: "المهام غير المكتملة",

      withinFilters: "ضمن الفلاتر المحددة",
      completionRate: "معدل الإنجاز",

      needsFollowUp: "تحتاج إلى متابعة",
      overallProgress: "التقدم الإجمالي",

      doneOf: "تم إنجاز",
      outOf: "من أصل",
      tasks: "مهام",

      taskDetails: "تفاصيل المهام",
      matchingTasks: "قائمة بجميع المهام المطابقة لمعايير التقرير",

      task: "المهمة",
      dueDate: "تاريخ الاستحقاق",
      projectColumn: "الفريق",
      assignee: "المسؤول",
      statusColumn: "الحالة",

      noResults: "لا توجد نتائج",
      changeFilters: "غيّر معايير التصفية لعرض مهام أخرى.",

      byProject: "المهام حسب الفريق",
      projectDescription: "توزيع المهام على الفرق",

      completionStatus: "حالة الإنجاز",
      completionDescription: "نسبة المهام المكتملة وغير المكتملة",

      complete: "مكتمل",

      createdBy: "تم إنشاء هذا التقرير بواسطة NTRA",
      confidential: "سري للاستخدام الداخلي",
      reportNumber: "رقم التقرير",

      loading: "جاري تحميل المهام...",
      loadError: "حدث خطأ أثناء تحميل تقرير المهام.",
      retry: "إعادة المحاولة",

      dateRangeError: "تاريخ البداية يجب أن يكون قبل تاريخ النهاية.",
      totalFromApi: "إجمالي المهام من الخادم",
      showing: "المعروض",
      noTeam: "بدون فريق",
      printedBy: "تمت الطباعة بواسطة",
      reportDate: "تاريخ التقرير",
    },

    en: {
      kicker: "REPORTS & ANALYTICS",
      title: "Task Report",
      description:
        "Filter tasks, review performance, and print a professional report.",

      summary: "Summary",
      details: "Details",
      print: "Print Report",
      refresh: "Refresh",

      filters: "Report Filters",
      matchingResults: "matching results",

      from: "From date",
      to: "To date",

      status: "Status",
      allStatuses: "All statuses",
      progress: "In progress",
      completed: "Completed",

      project: "Team",
      allProjects: "All teams",
      user: "Employee",
      allUsers: "All employees",
      taskFrom: "Task From",
      taskTo: "Task To",

      reset: "Reset filters",

      totalTasks: "Total tasks",
      completedTasks: "Completed tasks",
      inProgress: "Incomplete tasks",

      withinFilters: "Within selected filters",
      completionRate: "Completion rate",

      needsFollowUp: "Needs follow-up",
      overallProgress: "Overall progress",

      doneOf: "Completed",
      outOf: "out of",
      tasks: "tasks",

      taskDetails: "Task details",
      matchingTasks: "All tasks matching the selected report criteria",

      task: "Task",
      dueDate: "Due date",
      projectColumn: "Team",
      assignee: "Assignee",
      statusColumn: "Status",

      noResults: "No results found",
      changeFilters: "Change your filters to see other tasks.",

      byProject: "Tasks by team",
      projectDescription: "Task distribution across teams",

      completionStatus: "Completion status",
      completionDescription: "Completed and incomplete tasks",

      complete: "Complete",

      createdBy: "Report generated by NTRA",
      confidential: "Confidential · Internal use only",
      reportNumber: "Report number",

      loading: "Loading tasks...",
      loadError: "Failed to load task report.",
      retry: "Retry",

      dateRangeError: "Start date must be before end date.",
      totalFromApi: "Total tasks from server",
      showing: "Showing",
      noTeam: "No team",
      printedBy: "Printed by",
      reportDate: "Report date",
    },
  }[language];

  // --------------------------------------------------
  // Projects / Teams
  // --------------------------------------------------

  const projects = useMemo(() => {
    if (apiTeams.length > 0) {
      return apiTeams.filter((team) => team?.id && team?.name)
        .map((team) => ({ id: team.id, name: team.name }));
    }

    const uniqueTeams = new Map<string, string>();
    taskList.forEach((task) => {
      if (task.team?.id && task.team?.name) uniqueTeams.set(task.team.id, task.team.name);
    });
    return Array.from(uniqueTeams.entries()).map(([id, name]) => ({ id, name }));
  }, [apiTeams, taskList]);

  // --------------------------------------------------
  // Filter validation
  // --------------------------------------------------

 const today = getLocalDateString(new Date());

  const rangeIsInvalid =
    Boolean(dateFrom && dateTo && dateFrom > dateTo);

  // --------------------------------------------------
  // Filter tasks
  // --------------------------------------------------

  const reportTasks = taskList;

  // --------------------------------------------------
  // Statistics
  // --------------------------------------------------

  const completed = reportTasks.filter((task) =>
    isTaskCompleted(task.status)
  ).length;

  const inProgress = reportTasks.length - completed;

  const completion = reportTasks.length
    ? Math.round((completed / reportTasks.length) * 100)
    : 0;

  // --------------------------------------------------
  // Reset filters
  // --------------------------------------------------

  const resetFilters = () => {
    setDateFrom("");
    setDateTo("");
    setStatusFilter("all");
    setProjectFilter("all");
  };

  // --------------------------------------------------
  // Styling
  // --------------------------------------------------

  const surface = isDark
    ? "border-gray-700 bg-gray-800"
    : "border-gray-200 bg-white";

  const pageText = isDark
    ? "text-gray-100"
    : "text-gray-900";

  const mutedText = isDark
    ? "text-gray-400"
    : "text-gray-500";

  const inputStyle = isDark
    ? "border-gray-600 bg-gray-900 text-gray-100 placeholder:text-gray-500"
    : "border-gray-200 bg-white text-gray-800 placeholder:text-gray-400";

  const controlStyle =
    "h-10 w-full rounded-xl border px-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15";

  // --------------------------------------------------
  // Loading state
  // --------------------------------------------------

  if (isLoading) {
    return (
      <section
        dir={isRTL ? "rtl" : "ltr"}
        className={`flex min-h-80 flex-col items-center justify-center gap-4 ${pageText}`}
      >
        <div className="size-10 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />

        <p className={`text-sm ${mutedText}`}>
          {t.loading}
        </p>
      </section>
    );
  }

  // --------------------------------------------------
  // Error state
  // --------------------------------------------------

  if (error && taskList.length === 0) {
    return (
      <section
        dir={isRTL ? "rtl" : "ltr"}
        className={`mx-auto w-full max-w-7xl p-4 ${pageText}`}
      >
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/30">
          <p className="text-sm font-semibold text-red-600 dark:text-red-400">
            {t.loadError}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-700"
          >
            <RefreshCw size={15} />
            {t.retry}
          </button>
        </div>
      </section>
    );
  }

  // --------------------------------------------------
  // Main component
  // --------------------------------------------------

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className={`mx-auto w-full space-y-6 p-1 sm:p-3 ${pageText}`}
    >
      {/* Page heading */}

      <div className="no-print flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <span className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wide text-teal-600 dark:text-teal-400">
            <ChartColumn size={15} />
            {t.kicker}
          </span>

          <h1 className="text-2xl font-bold sm:text-3xl">
            {t.title}
          </h1>

          <p className={`mt-2 text-sm ${mutedText}`}>
            {t.description}
          </p>

          <p className={`mt-2 text-xs ${mutedText}`}>
            {t.totalFromApi}: {data?.count ?? taskList.length}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className={`flex rounded-xl border p-1 ${surface}`}>
            <button
              type="button"
              onClick={() => setView("summary")}
              className={`flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition ${
                view === "summary"
                  ? "bg-teal-600 text-white shadow-sm"
                  : mutedText
              }`}
            >
              <ChartColumn size={16} />
              {t.summary}
            </button>

            <button
              type="button"
              onClick={() => setView("details")}
              className={`flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition ${
                view === "details"
                  ? "bg-teal-600 text-white shadow-sm"
                  : mutedText
              }`}
            >
              <Grid2X2 size={16} />
              {t.details}
            </button>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className={`flex h-11 items-center gap-2 rounded-xl border px-3 text-sm font-semibold transition ${surface} ${mutedText}`}
          >
            <RefreshCw
              size={15}
              className={isFetching ? "animate-spin" : ""}
            />
            {t.refresh}
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex h-11 items-center gap-2 rounded-xl bg-teal-600 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700"
          >
            <Download size={16} />
            {t.print}
          </button>
        </div>
      </div>

      {/* Filters */}

      <div className={`no-print rounded-2xl border p-4 shadow-sm sm:p-5 ${surface}`}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Filter size={19} />
            </span>

            <div>
              <h2 className="font-bold">
                {t.filters}
              </h2>

              <p className={`mt-1 text-xs ${mutedText}`}>
                {reportTasks.length} {t.matchingResults}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition hover:bg-gray-500/10 ${mutedText}`}
          >
            <RotateCcw size={14} />
            {t.reset}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {/* From date */}

          <label className="space-y-2">
            <span className={`block text-xs font-semibold ${mutedText}`}>
              {t.from}
            </span>

            <input
              type="date"
              value={dateFrom}
              max={dateTo || undefined}
              onChange={(event) => setDateFrom(event.target.value)}
              className={`${controlStyle} ${inputStyle}`}
            />
          </label>

          {/* To date */}

          <label className="space-y-2">
            <span className={`block text-xs font-semibold ${mutedText}`}>
              {t.to}
            </span>

            <input
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={(event) => setDateTo(event.target.value)}
              className={`${controlStyle} ${inputStyle}`}
            />
          </label>

          {/* Status */}

          <label className="space-y-2">
            <span className={`block text-xs font-semibold ${mutedText}`}>
              {t.status}
            </span>

            <CustomSelect
              ariaLabel={t.status}
              dir={isRTL ? "rtl" : "ltr"}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as TaskStatusFilter)}
              className={`${controlStyle} ${inputStyle}`}
            >
              <option value="all">{t.allStatuses}</option>
              <option value="progress">{t.progress}</option>
              <option value="completed">{t.completed}</option>
            </CustomSelect>
          </label>

          {/* Team */}

          <label className="space-y-2">
            <span className={`block text-xs font-semibold ${mutedText}`}>
              {t.project}
            </span>

            <CustomSelect
              ariaLabel={t.project}
              dir={isRTL ? "rtl" : "ltr"}
              value={projectFilter}
              onChange={setProjectFilter}
              className={`${controlStyle} ${inputStyle}`}
            >
              <option value="all">{t.allProjects}</option>

              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </CustomSelect>
          </label>

          {/* Employee */}
          <label className="space-y-2">
            <span className={`block text-xs font-semibold ${mutedText}`}>
              {t.user}
            </span>
            <CustomSelect
              ariaLabel={t.user}
              dir={isRTL ? "rtl" : "ltr"}
              value={userFilter}
              onChange={setUserFilter}
              className={`${controlStyle} ${inputStyle}`}
            >
              <option value="all">{t.allUsers}</option>
              {users.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.fullName || employee.name || employee.email || employee.id}
                </option>
              ))}
            </CustomSelect>
          </label>
        </div>

        {rangeIsInvalid && (
          <p className="mt-3 text-xs font-medium text-red-500">
            {t.dateRangeError}
          </p>
        )}
      </div>

      {/* Printable report */}

      <article
        className={`print-report space-y-5 rounded-2xl border p-4 shadow-sm sm:p-6 lg:p-7 ${surface}`}
      >
        {/* Report header */}

        <header
          dir={isRTL ? "rtl" : "ltr"}
          className="flex flex-col gap-4 border-b border-gray-200 pb-5 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between"
        >
          {/* NTRA Logo */}
          <div className="flex justify-center sm:justify-start">
            <img
              src="/ntra-black.png"
              alt="NTRA Logo"
              className="h-14 w-auto max-w-44 object-contain sm:h-16"
            />
          </div>

          {/* Report Information */}
          <div className="min-w-0 text-center sm:text-end">
            <h2 className="text-base font-bold sm:text-lg">
              {t.title}
            </h2>

            <p className={`mt-1 text-sm ${mutedText}`}>
              {formatReportDate(language)}
            </p>

            <small className={`mt-1 block text-xs ${mutedText}`}>
              {t.reportNumber}: RPT-{today.replaceAll("-", "")}
            </small>
          </div>
        </header>

        {/* Statistics */}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[
            {
              label: t.totalTasks,
              value: reportTasks.length,
              note: t.withinFilters,
              icon: FileText,
              color: "text-blue-500 bg-blue-500/10",
            },
            {
              label: t.completedTasks,
              value: completed,
              note: `${completion}% ${t.completionRate}`,
              icon: Check,
              color: "text-teal-500 bg-teal-500/10",
            },
            {
              label: t.inProgress,
              value: inProgress,
              note: t.needsFollowUp,
              icon: Clock3,
              color: "text-amber-500 bg-amber-500/10",
            },
          ].map((stat) => {
            const StatIcon = stat.icon;

            return (
              <div
                key={stat.label}
                className={`rounded-xl border p-4 ${surface}`}
              >
                <span
                  className={`mb-4 grid size-10 place-items-center rounded-xl ${stat.color}`}
                >
                  <StatIcon size={19} />
                </span>

                <p className={`text-xs ${mutedText}`}>
                  {stat.label}
                </p>

                <strong className="mt-1 block text-2xl font-extrabold tabular-nums">
                  {stat.value}
                </strong>

                <small className={`mt-2 block text-xs ${mutedText}`}>
                  {stat.note}
                </small>
              </div>
            );
          })}
        </div>

        {/* Overall progress */}

        <section className={`rounded-xl border p-4 sm:p-5 ${surface}`}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="font-bold">
              {t.overallProgress}
            </h3>

            <strong className="text-lg font-extrabold text-teal-600 dark:text-teal-400">
              {completion}%
            </strong>
          </div>

          <div
            className={`h-3 overflow-hidden rounded-full ${
              isDark ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <div
              className="h-full rounded-full bg-linear-to-r from-blue-500 to-teal-500 transition-all duration-300"
              style={{ width: `${completion}%` }}
            />
          </div>

          <p className={`mt-3 text-xs ${mutedText}`}>
            {t.doneOf} {completed} {t.outOf} {reportTasks.length} {t.tasks}.
          </p>
        </section>

        {/* Details view */}

        {(
          <section className={`print-task-details ${view === "summary" ? "hidden" : ""}`}>
            {/* Print-only report heading: logo beside task details */}
            {/* <div className="print-only-header mb-5 hidden items-center justify-between gap-4 border-b border-gray-200 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src="/ntra-black.png"
                  alt="NTRA Logo"
                  className="h-12 w-auto max-w-36 object-contain"
                />
                <div>
                  <h2 className="text-lg font-extrabold text-gray-900">
                    {t.taskDetails}
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    {t.matchingTasks}
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-700">
                {reportTasks.length} {t.tasks}
              </span>
            </div> */}

            <div
              dir={isRTL ? "rtl" : "ltr"}
              className="print-only-header mb-5 hidden grid-cols-3 items-center gap-4 border-b border-gray-200 pb-4"
            >
              {/* Report Details - Right */}
              <div className="min-w-0 text-start">
                <h2 className="text-base font-extrabold text-gray-900">
                  {t.taskDetails}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  {t.matchingTasks}
                </p>
              </div>

              {/* Center Logo */}
              <div className="flex items-center justify-center">
                <img
                  src="/ntra-black.png"
                  alt="NTRA Logo"
                  className="h-12 w-auto max-w-36 object-contain"
                />
              </div>

              {/* Tasks Count - Left */}
              <div className="text-end">
                <span className="text-xs font-bold text-gray-700">
                  {reportTasks.length} {t.tasks}
                </span>
              </div>
            </div>

            <div className="screen-only-details-heading mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-bold">
                  {t.taskDetails}
                </h2>

                <p className={`mt-1 text-xs ${mutedText}`}>
                  {t.matchingTasks}
                </p>
              </div>

              <span className="rounded-full bg-teal-500/10 px-3 py-1.5 text-xs font-bold text-teal-600 dark:text-teal-400">
                {reportTasks.length} {t.tasks}
              </span>
            </div>

            {reportTasks.length > 0 ? (
                <>
              <div className="print-table-wrapper hidden overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 md:block">
                <table className="w-full min-w-0 table-fixed text-sm">
                  <thead
                    className={
                      isDark
                        ? "bg-gray-900/70 text-gray-400"
                        : "bg-gray-50 text-gray-500"
                    }
                  >
                    <tr>
                      {[
                        t.task,
                        t.projectColumn,
                        t.dueDate,
                        t.taskFrom,
                        t.taskTo,
                        t.statusColumn,
                      ].map((heading) => (
                        <th
                          key={heading}
                          className={`px-2 py-3 text-xs font-bold ${
                            isRTL ? "text-right" : "text-left"
                          }`}
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {reportTasks.map((task) => {
                      const completed = isTaskCompleted(task.status);

                      return (
                        <tr
                          key={task.id}
                          className="border-t border-gray-200 transition hover:bg-gray-500/5 dark:border-gray-700"
                        >
                        

                          <td className="w-[24%] px-2 py-3">
                            <div className="flex min-w-0 items-center gap-2">
                              <span
                                className={`grid size-6 shrink-0 place-items-center rounded-md border ${
                                  completed
                                    ? "border-teal-500 bg-teal-500 text-white"
                                    : "border-gray-300 dark:border-gray-600"
                                }`}
                              >
                                {completed && <Check size={13} />}
                              </span>

                              <div className="min-w-0">
                                <strong className="block max-w-full truncate text-[10px] font-semibold leading-tight print-task-title">
                                  {task.title}
                                </strong>

                                <small className={`mt-1 block text-[11px] ${mutedText}`}>
                                  {task.id}
                                </small>
                              </div>
                            </div>
                          </td>

                          
                          <td className={`wrap-break-word px-2 py-3 text-[11px] ${mutedText}`}>
                            {task.team?.name ?? t.noTeam}
                          </td>

                       

                          <td className={`wrap-break-word px-2 py-3 text-[11px] ${mutedText}`}>
                            {displayDate(task.deadline, language)}
                          </td>

              
                          <td className={`wrap-break-word px-2 py-3 text-[11px] ${mutedText}`}>
                            {task.createdBy?.fullName ?? "—"}
                          </td>

            
                          <td className={`wrap-break-word px-2 py-3 text-[11px] ${mutedText}`}>
                            {task.assignee?.fullName ?? "—"}
                          </td>

             

                          <td className="whitespace-nowrap px-2 py-3">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                completed
                                  ? "bg-teal-500/10 text-teal-600 dark:text-teal-400"
                                  : "bg-amber-500/10 text-amber-600"
                              }`}
                            >
                              <span className="size-1.5 rounded-full bg-current" />

                              {getTaskStatusLabel(task.status, language)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            
              <div className="mobile-task-cards grid grid-cols-1 gap-3 md:hidden">
                {reportTasks.map((task) => {
                  const taskCompleted = isTaskCompleted(task.status);
                  return (
                    <article
                      key={`mobile-${task.id}`}
                      className={`min-w-0 rounded-xl border p-3 ${surface}`}
                    >
                      <div className="flex min-w-0 items-start gap-2">
                        <span
                          className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-md border ${
                            taskCompleted
                              ? "border-teal-500 bg-teal-500 text-white"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          {taskCompleted && <Check size={13} />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <strong className="block wrap-break-word text-sm font-semibold leading-5">
                            {task.title}
                          </strong>
                          <small className={`mt-1 block break-all text-[10px] ${mutedText}`}>
                            {task.id}
                          </small>
                        </div>
                        <span
                          className={`shrink-0 whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-semibold ${
                            taskCompleted
                              ? "bg-teal-500/10 text-teal-600 dark:text-teal-400"
                              : "bg-amber-500/10 text-amber-600"
                          }`}
                        >
                          {getTaskStatusLabel(task.status, language)}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-gray-200 pt-3 text-xs dark:border-gray-700">
                        <div className="min-w-0">
                          <span className={`block ${mutedText}`}>{t.projectColumn}</span>
                          <span className="mt-0.5 block wrap-break-word font-medium">{task.team?.name ?? t.noTeam}</span>
                        </div>
                        <div className="min-w-0">
                          <span className={`block ${mutedText}`}>{t.dueDate}</span>
                          <span className="mt-0.5 block font-medium">{displayDate(task.deadline, language)}</span>
                        </div>
                        <div className="min-w-0">
                          <span className={`block ${mutedText}`}>{t.taskFrom}</span>
                          <span className="mt-0.5 block wrap-break-word font-medium">{task.createdBy?.fullName ?? "—"}</span>
                        </div>
                        <div className="min-w-0">
                          <span className={`block ${mutedText}`}>{t.taskTo}</span>
                          <span className="mt-0.5 block wrap-break-word font-medium">{task.assignee?.fullName ?? "—"}</span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
              </>
            ) : (
              <div
                className={`flex flex-col items-center justify-center rounded-xl border border-dashed px-4 py-14 text-center ${surface}`}
              >
                <Search size={28} className={`mb-3 ${mutedText}`} />

                <strong className="text-sm">
                  {t.noResults}
                </strong>

                <p className={`mt-2 text-xs ${mutedText}`}>
                  {t.changeFilters}
                </p>
              </div>
            )}

            {/* Print-only footer */}
            <footer className="print-only-footer mt-8 hidden items-center justify-between gap-4 border-t border-gray-300 pt-4 text-xs text-gray-700">
              <div>
                <span className="font-semibold">{t.printedBy}:</span>{" "}
                {printedBy || (language === "ar" ? "المستخدم الحالي" : "Current user")}
              </div>
              <div>
                <span className="font-semibold">{t.reportDate}:</span>{" "}
                {formatReportDate(language)}
              </div>
            </footer>
          </section>
        )}

        {view === "summary" && (
          /* Summary view */

          <section className="no-print grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Tasks by team */}

            <div className={`rounded-xl border p-4 sm:p-5 ${surface}`}>
              <h2 className="font-bold">
                {t.byProject}
              </h2>

              <p className={`mb-6 mt-1 text-xs ${mutedText}`}>
                {t.projectDescription}
              </p>

              <div className="space-y-5">
                {projects.map((project) => {
                  const count = reportTasks.filter(
                    (task) => task.team?.id === project.id
                  ).length;

                  const percentage = reportTasks.length
                    ? Math.round((count / reportTasks.length) * 100)
                    : 0;

                  return (
                    <div key={project.id}>
                      <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                        <span className="font-semibold">
                          {project.name}
                        </span>

                        <strong className={mutedText}>
                          {count}
                        </strong>
                      </div>

                      <div
                        className={`h-2.5 overflow-hidden rounded-full ${
                          isDark ? "bg-gray-700" : "bg-gray-100"
                        }`}
                      >
                        <div
                          className="h-full rounded-full bg-linear-to-r from-blue-500 to-teal-500 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

                {projects.length === 0 && (
                  <p className={`text-sm ${mutedText}`}>
                    {t.noResults}
                  </p>
                )}
              </div>
            </div>

            {/* Completion status */}

            <div className={`rounded-xl border p-4 sm:p-5 ${surface}`}>
              <h2 className="font-bold">
                {t.completionStatus}
              </h2>

              <p className={`mb-6 mt-1 text-xs ${mutedText}`}>
                {t.completionDescription}
              </p>

              <div className="flex flex-col items-center justify-center gap-6 py-4">
                <div
                  className="relative grid size-44 place-items-center rounded-full"
                  style={{
                    background: `conic-gradient(#2eb5bc 0 ${completion}%, ${
                      isDark ? "#374151" : "#e5e7eb"
                    } ${completion}% 100%)`,
                  }}
                >
                  <div
                    className={`grid size-32 place-content-center rounded-full text-center ${
                      isDark ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    <strong className="text-3xl font-extrabold text-teal-600 dark:text-teal-400">
                      {completion}%
                    </strong>

                    <small className={mutedText}>
                      {t.complete}
                    </small>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-5 text-xs">
                  <span className="flex items-center gap-2">
                    <i className="size-2.5 rounded-full bg-teal-500" />
                    {t.completed} ({completed})
                  </span>

                  <span className="flex items-center gap-2">
                    <i
                      className={`size-2.5 rounded-full ${
                        isDark ? "bg-gray-600" : "bg-gray-300"
                      }`}
                    />
                    {t.progress} ({inProgress})
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Report footer */}

        <footer
          className={`flex flex-col justify-between gap-2 border-t border-gray-200 pt-4 text-xs dark:border-gray-700 sm:flex-row ${mutedText}`}
        >
          <span>{t.createdBy}</span>

          <span>
            NTRA · {t.confidential}
          </span>
        </footer>
      </article>

      {/* Print styles */}

      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 12mm;
          }

          html,
          body {
            background: #ffffff !important;
            color: #111827 !important;
          }

          body * {
            visibility: hidden !important;
          }

          .print-task-details,
          .print-task-details * {
            visibility: visible !important;
          }

          .print-task-details {
            display: block !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: 0 !important;
            background: #ffffff !important;
            color: #111827 !important;
          }

          .print-only-header{
            display: grid !important;
            grid-template-columns: 1fr 1fr 1fr;
            align-items: center;
          }
            
          .print-only-footer {
            display: flex !important;
          }

          .screen-only-details-heading {
            display: none !important;
          }

          .print-task-details table {
            width: 100% !important;
            min-width: 0 !important;
            table-layout: fixed !important;
            border-collapse: collapse !important;
            page-break-inside: auto;
          }

          /* Keep the task title compact so the status column stays on one line. */
          .print-task-details th,
          .print-task-details td {
            padding: 5px 6px !important;
            font-size: 8px !important;
            line-height: 1.2 !important;
            vertical-align: middle !important;
            overflow-wrap: anywhere;
          }

          .print-task-details th:first-child,
          .print-task-details td:first-child {
            width: 23% !important;
          }

          .print-task-details th:last-child,
          .print-task-details td:last-child {
            width: 12% !important;
            white-space: nowrap !important;
            overflow-wrap: normal !important;
          }

          .print-task-details .print-task-title {
            max-width: 100% !important;
            font-size: 8px !important;
            line-height: 1.15 !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }

          .print-task-details td:last-child span {
            white-space: nowrap !important;
            font-size: 7px !important;
            padding: 2px 5px !important;
          }

          .print-task-details .print-table-wrapper {
            display: block !important;
            overflow: visible !important;
          }

          .print-task-details .mobile-task-cards {
            display: none !important;
          }

          .print-task-details thead {
            display: table-header-group;
          }

          .print-task-details tr {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .print-task-details th,
          .print-task-details td {
            color: #111827 !important;
            border-color: #d1d5db !important;
          }

          .print-task-details th {
            background: #f3f4f6 !important;
          }

          .print-task-details * {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </section>
  );
}
