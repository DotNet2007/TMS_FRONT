"use client";


import { type ReactNode } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { Check, Folder, CalendarDays, Sparkles, ArrowLeft, ArrowRight, Clock, MoreHorizontal, ListTodo, CircleCheck, Timer, ChartNoAxesCombined } from "lucide-react";
import { useDashboardLayout } from "@/app/components/DashboardLayout";
import { useGetTasksDashboardQuery } from "@/app/services/dashboard-api";


type Lang = "ar" | "en";
const copy = {
  ar: {
    overview: "نظرة عامة", myTasks: "مهامي", projects: "المشاريع", calendar: "التقويم", team: "الفريق",
    workspace: "مساحة العمل", upgradeTitle: "استفد أكثر مع الباقة الاحترافية",
    upgradeText: "احصل على مساعدة غير محدودة بالذكاء الاصطناعي وتقارير متقدمة.", upgradeButton: "عرض الباقات",
    search: "ابحث عن أي شيء...", notifications: "الإشعارات", newProject: "مشروع جديد",
    date: "", greeting: "صباح الخير", welcome: "إليك آخر المستجدات في مشاريعك اليوم.",
    online: "7 من أعضاء الفريق متصلون", composerTitle: "ابدأ مشروعاً جديداً بالذكاء الاصطناعي",
    composerText: "أخبرنا بما تخطط له وسننشئ المهام المناسبة.", notNow: "ليس الآن", ai: "NTRA",
    aiTitle: "لنجعل يومك أكثر إنتاجية", aiText: "وجدت 3 مهام تحتاج إلى اهتمامك، وأعددت خطة مقترحة لتنظيم يومك.",
    plan: "إضافة مهام جديده", priorities: "3 أولويات", hours: "4.5 ساعات", activeProjects: "المشاريع النشطة",
    projectsSubtitle: "تابع تقدم فريقك بسهولة", viewAll: "عرض الكل", progress: "التقدم", tasksSubtitle: "أولوياتك خلال الأيام القادمة",
    high: "عالية", medium: "متوسطة", low: "منخفضة", today: "اليوم", tomorrow: "غداً",
    empty: "لا توجد مهام تطابق", statistics: "الإحصائيات", statisticsSubtitle: "ملخص إنجازاتك ومهامك",
    totalTasks: "إجمالي المهام", completed: "مهام مكتملة", inProgress: "قيد التنفيذ", completionRate: "معدل الإنجاز",
    tasksCompletedOf: "من المهام مكتملة", assignedTo: "مسندة إلى", submitted: "تم التسليم",
    rework: "مطلوب تعديل", dispatched: "تم الإسناد", somethingWentWrong: "حدث خطأ أثناء تحميل البيانات",
    noUnfinishedTasks: "لا توجد مهام غير مكتملة", totalAssigned: "إجمالي المهام المسندة", assignedTasks: "المهام المسندة إليك",
    assignedTotal: "إجمالي المهام المسندة", assignedCompleted: "المهام المسندة المكتملة",
    assignedDispatched: "المهام المسندة قيد التنفيذ", assignedCompletionRate: "معدل إنجاز المهام المسندة",
    createdTotal: "إجمالي المهام المنشأة", createdCompleted: "المهام المنشأة المكتملة",
    createdTasks: "المهام التي أنشأتها", awaitingReview: "بانتظار المراجعة",
    globalDispatched: "إجمالي المهام المرسلة", allTasks: "على مستوى النظام",
    dispatchedDetail: "تم إسنادها", reviewDetail: "تحتاج إلى مراجعة",
    assignedSource: "مسندة إليك", createdSource: "أنشأتها",
    tasksCreatedByMe: "المهام التي أنشأتها", assignedStatistics: "إحصائيات المهام المسندة",
    createdStatistics: "إحصائيات المهام المنشأة",
    language: "English", languageAria: "التبديل إلى الإنجليزية",
    taskActionComplete: "إكمال", taskActionReopen: "إعادة فتح", taskOptions: "خيارات المهمة", projectOptions: "خيارات المشروع",
    sidebarStats: "ملخص سريع", logout: "تسجيل الخروج", logoutAria: "تسجيل الخروج من الحساب",
    darkMode: "الوضع الداكن", lightMode: "الوضع الفاتح", themeAria: "تغيير المظهر",
  },
  en: {
    overview: "Overview", myTasks: "My Tasks", projects: "Projects", calendar: "Calendar", team: "Team",
    workspace: "WORKSPACE", upgradeTitle: "Get more with Pro", upgradeText: "Unlock unlimited AI assistance and advanced reports.",
    upgradeButton: "Explore plans", search: "Search anything...", notifications: "Notifications", newProject: "New project",
    date: "", greeting: "Good morning", welcome: "Here’s the latest update on your projects today.",
    online: "7 team members online", composerTitle: "Start a new project with AI", composerText: "Tell us what you’re planning and we’ll create the right tasks.",
    notNow: "Not now", ai: "NTRA", aiTitle: "Make your day more productive", aiText: "You have 3 tasks that need attention. We prepared a suggested plan for your day.",
    plan: "Add New Tasks", priorities: "3 priorities", hours: "4.5 hours", activeProjects: "Active projects",
    projectsSubtitle: "Track your team’s progress", viewAll: "View all", progress: "Progress", tasksSubtitle: "Your priorities for the coming days",
    high: "High", medium: "Medium", low: "Low", today: "Today", tomorrow: "Tomorrow",
    empty: "No tasks match", statistics: "Statistics", statisticsSubtitle: "A summary of your tasks and progress",
    totalTasks: "Total tasks", completed: "Completed", inProgress: "In progress", completionRate: "Completion rate",
    tasksCompletedOf: "tasks completed", assignedTo: "Assigned to", submitted: "Submitted",
    rework: "Needs rework", dispatched: "Dispatched", somethingWentWrong: "Something went wrong while loading data",
    noUnfinishedTasks: "No unfinished tasks", totalAssigned: "Total assigned tasks", assignedTasks: "Tasks assigned to you",
    assignedTotal: "Assigned tasks total", assignedCompleted: "Assigned tasks completed",
    assignedDispatched: "Assigned tasks dispatched", assignedCompletionRate: "Assigned completion rate",
    createdTotal: "Created tasks total", createdCompleted: "Created tasks completed",
    createdTasks: "Tasks you created", awaitingReview: "Awaiting review",
    globalDispatched: "Global dispatched tasks", allTasks: "Across all tasks",
    dispatchedDetail: "Dispatched tasks", reviewDetail: "Need review",
    assignedSource: "Assigned to you", createdSource: "Created by you",
    tasksCreatedByMe: "Tasks Created by Me", assignedStatistics: "Assigned Tasks Statistics",
    createdStatistics: "Created Tasks Statistics",
    language: "العربية", languageAria: "Switch to Arabic",
    taskActionComplete: "Complete", taskActionReopen: "Reopen", taskOptions: "Task options", projectOptions: "Project options",
    sidebarStats: "QUICK STATS", logout: "Log out", logoutAria: "Log out of your account",
    darkMode: "Dark mode", lightMode: "Light mode", themeAria: "Toggle color theme",
  },
} satisfies Record<Lang, Record<string, string>>;

function Avatar({ initials, light = false, darkMode = false }: { initials: string; light?: boolean; darkMode?: boolean }) {
  return <span className={`grid h-8.5 w-8.5 shrink-0 place-items-center rounded-full border-2 ${darkMode ? "border-slate-800" : "border-white"} text-[10px] font-bold ${light ? `bg-[#e4e0d8] text-[#5f5b55] ${darkMode ? "text-slate-700" : ""}` : "bg-[#353550] text-white"}`}>{initials}</span>;
}

export default function Home() {
  // Read the authenticated user from the existing login/authentication context.
  const { user, isLoading, isAuthenticated } = useAuth();
  const { lang, isArabic, darkMode } = useDashboardLayout();
  // Build the date from the current system date and format it for the selected language.
  const currentDate = new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  // Choose a greeting based on the current local time, then display the logged-in user's name.
  const currentHour = new Date().getHours();
  const greetingKey = currentHour < 12 ? "morning" : currentHour < 18 ? "afternoon" : "evening";
  const greeting = {
    morning: isArabic ? "صباح الخير" : "Good morning",
    afternoon: isArabic ? "مساء الخير" : "Good afternoon",
    evening: isArabic ? "مساء الخير" : "Good evening",
  }[greetingKey];
  const displayName = isLoading ? "" : isAuthenticated ? user?.fullName?.trim() || (isArabic ? "المستخدم" : "there") : isArabic ? "المستخدم" : "there";

  const t = (key: keyof typeof copy.ar) => copy[lang][key];
  const DirectionArrow = isArabic ? ArrowLeft : ArrowRight;
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    isError,
  } = useGetTasksDashboardQuery();

  const closestTask = dashboardData?.data.closestUnfinishedTask;

  // Keep supervisor task groups separate so each group has its own statistics.
  const assignedTasks =
    dashboardData && dashboardData.role !== "SUPER_SUPERVISOR"
      ? dashboardData.data.recentAssignedTasks
      : [];

  const createdTasks =
    dashboardData?.role === "SUPERVISOR"
      ? dashboardData.data.recentCreatedTasks
      : dashboardData?.role === "SUPER_SUPERVISOR"
        ? dashboardData.data.recentCreatedTasks
        : [];

  const statisticCards =
    dashboardData?.role === "EMPLOYEE"
      ? [
          { title: t("totalAssigned"), value: dashboardData.data.statistics.totalAssigned, icon: <ListTodo size={19} />, iconClass: "bg-[#edf3f7] text-[#47759c]", detail: t("assignedTasks") },
          { title: t("completed"), value: dashboardData.data.statistics.completed, icon: <CircleCheck size={19} />, iconClass: "bg-[#e8f8f8] text-[#238e94]", detail: `${dashboardData.data.statistics.completionRate}%` },
          { title: t("dispatched"), value: dashboardData.data.statistics.dispatched, icon: <Timer size={19} />, iconClass: "bg-[#fff5e7] text-[#c17a36]", detail: t("dispatchedDetail") },
          { title: t("completionRate"), value: `${dashboardData.data.statistics.completionRate}%`, icon: <ChartNoAxesCombined size={19} />, iconClass: "bg-[#f0f9fa] text-[#2eb5bc]", detail: `${dashboardData.data.statistics.completed}/${dashboardData.data.statistics.totalAssigned}` },
        ]
      : dashboardData?.role === "SUPER_SUPERVISOR"
        ? lang === "ar"
          ? [
              // Arabic RTL: show total created tasks as the first card from the right.
              { title: t("createdTotal"), value: dashboardData.data.statistics.created.total, icon: <Folder size={19} />, iconClass: "bg-[#edf3f7] text-[#47759c]", detail: t("createdTasks") },
              { title: t("globalDispatched"), value: dashboardData.data.statistics.dispatched, icon: <Timer size={19} />, iconClass: "bg-[#fff5e7] text-[#c17a36]", detail: t("allTasks") },
              { title: t("createdCompleted"), value: dashboardData.data.statistics.created.completed, icon: <CircleCheck size={19} />, iconClass: "bg-[#e8f8f8] text-[#238e94]", detail: t("createdTasks") },
              { title: t("awaitingReview"), value: dashboardData.data.statistics.awaitingReview, icon: <Clock size={19} />, iconClass: "bg-[#f0f9fa] text-[#2eb5bc]", detail: t("reviewDetail") },
            ]
          : [
              { title: t("globalDispatched"), value: dashboardData.data.statistics.dispatched, icon: <Timer size={19} />, iconClass: "bg-[#fff5e7] text-[#c17a36]", detail: t("allTasks") },
              { title: t("createdTotal"), value: dashboardData.data.statistics.created.total, icon: <Folder size={19} />, iconClass: "bg-[#edf3f7] text-[#47759c]", detail: t("createdTasks") },
              { title: t("createdCompleted"), value: dashboardData.data.statistics.created.completed, icon: <CircleCheck size={19} />, iconClass: "bg-[#e8f8f8] text-[#238e94]", detail: t("createdTasks") },
              { title: t("awaitingReview"), value: dashboardData.data.statistics.awaitingReview, icon: <Clock size={19} />, iconClass: "bg-[#f0f9fa] text-[#2eb5bc]", detail: t("reviewDetail") },
            ]
        : [];

  const assignedStatisticCards =
    dashboardData?.role === "SUPERVISOR"
      ? [
          { title: t("assignedTotal"), value: dashboardData.data.statistics.assigned.total, icon: <ListTodo size={19} />, iconClass: "bg-[#edf3f7] text-[#47759c]", detail: t("assignedTasks") },
          { title: t("assignedCompleted"), value: dashboardData.data.statistics.assigned.completed, icon: <CircleCheck size={19} />, iconClass: "bg-[#e8f8f8] text-[#238e94]", detail: `${dashboardData.data.statistics.assigned.completionRate}%` },
          { title: t("assignedDispatched"), value: dashboardData.data.statistics.assigned.dispatched, icon: <Timer size={19} />, iconClass: "bg-[#fff5e7] text-[#c17a36]", detail: t("dispatchedDetail") },
          { title: t("assignedCompletionRate"), value: `${dashboardData.data.statistics.assigned.completionRate}%`, icon: <ChartNoAxesCombined size={19} />, iconClass: "bg-[#f0f9fa] text-[#2eb5bc]", detail: `${dashboardData.data.statistics.assigned.completed}/${dashboardData.data.statistics.assigned.total}` },
        ]
      : [];

  const createdStatisticCards =
    dashboardData?.role === "SUPERVISOR"
      ? [
          { title: t("createdTotal"), value: dashboardData.data.statistics.created.total, icon: <Folder size={19} />, iconClass: "bg-indigo-50 text-indigo-500", detail: t("createdTasks") },
          { title: t("createdCompleted"), value: dashboardData.data.statistics.created.completed, icon: <CircleCheck size={19} />, iconClass: "bg-[#e8f8f8] text-[#238e94]", detail: t("createdTasks") },
          { title: t("awaitingReview"), value: dashboardData.data.statistics.awaitingReview, icon: <Clock size={19} />, iconClass: "bg-[#fff5e7] text-[#c17a36]", detail: t("reviewDetail") },
        ]
      : [];

  return (
    <div className={`space-y-0 ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
          {/* Dashboard header: live date, time-sensitive greeting, and the logged-in user's name. */}
          <section className="flex items-start justify-between gap-4"><div><p className={`mb-2 text-[10px] font-bold tracking-[1px]  ${darkMode ? "text-slate-400" : "text-[#8f9098]"}`}>{currentDate}</p><h1 className="mb-2 text-[23px] font-bold leading-tight tracking-tight sm:text-[27px]">{greeting}, {displayName}</h1><p className={`text-[13px] ${darkMode ? "text-slate-300" : "text-[#83848c]"} `}>{t("welcome")}</p></div>
            <div className={`hidden shrink-0 text-start text-[10px] sm:block ${darkMode ? "text-slate-400" : "text-[#96979f]"}`}><div className="mb-1 flex"><span className={isArabic ? "-ml-1.75" : "-mr-1.75"}><Avatar initials="A" light darkMode={darkMode} /></span><span className={isArabic ? "-ml-1.75" : "-mr-1.75"}><Avatar initials="M" light darkMode={darkMode} /></span><Avatar initials="T" light darkMode={darkMode} /><span className={`grid h-8.5 w-8.5 place-items-center rounded-full border-2 text-[10px]  ${darkMode ? "bg-slate-700 text-slate-200 border-slate-800" : "bg-[#f0f0f4] text-[#757680] border-white"}`}>+4</span></div><span>{t("online")}</span></div>
          </section>


          {/* AI productivity banner: highlights the suggested plan and quick action. */}
          <section className="relative mt-7.25 grid min-h-48.5 overflow-hidden rounded-[18px] bg-linear-to-l from-[#2eb5bc] via-[#47759c] to-[#345f82] text-white shadow-xl shadow-[#47759c]/15 md:grid-cols-[1.4fr_1fr]">
            <div className="relative z-2 flex items-start gap-3.5 p-5 sm:p-7"><span className="grid h-9.5 w-9.5 shrink-0 place-items-center rounded-[11px] bg-linear-to-br from-[#55cbd0] to-[#2eb5bc] shadow-inner shadow-white/20"><Sparkles size={20} /></span><div><span className="text-[9px] font-bold tracking-[1.1px] text-[#bff3f1]">{t("ai")}</span><h2 className="mb-2 mt-1.5 text-lg font-bold tracking-tight sm:text-xl">{t("aiTitle")}</h2><p className="mb-4 max-w-120 text-xs leading-relaxed text-[#d9eef2]">{t("aiText")}</p><button className="flex h-8.5 items-center gap-2 rounded-[9px] bg-white px-4 text-xs font-semibold text-[#47759c] transition hover:bg-[#f0fbfb]">{t("plan")}<DirectionArrow size={16} /></button></div></div>
            <div className="relative hidden min-h-48.5 overflow-hidden md:block"><div className={`absolute -top-8.75 h-65 w-65 rounded-full border border-white ${isArabic ? "right-[5%]" : "left-[5%]"}`} /><div className={`absolute top-[10%] h-37.5 w-37.5 rounded-full bg-[#6de2df]/20 blur-lg ${isArabic ? "right-[10%]" : "left-[10%]"}`} /><div className="absolute bottom-[-20%] left-[15%] h-20 w-20 rounded-full bg-[#b8ecf0]/15 blur-lg" /><div className={`absolute top-13.75 z-2 grid h-19 w-19 rotate-[-7deg] place-items-center rounded-[25px] bg-linear-to-br from-[#60d0d4]/60 to-[#47759c]/80 text-[#e4ffff] shadow-xl shadow-[#274e66]/30 ${isArabic ? "right-1/4" : "left-1/4"}`}><Sparkles size={34} /></div><span className={`absolute top-6.5 z-3 flex items-center gap-1.5 rounded-lg border border-white/25 bg-white/15 px-2.5 py-2 text-[9px] text-white backdrop-blur-md ${isArabic ? "right-[8%]" : "left-[8%]"}`}><Check size={13} />{t("priorities")}</span><span className={`absolute bottom-6.25 z-3 flex items-center gap-1.5 rounded-lg border border-white/25 bg-white/15 px-2.5 py-2 text-[9px] text-white backdrop-blur-md ${isArabic ? "left-[16%]" : "right-[16%]"}`}><Clock size={13} />{t("hours")}</span></div>
          </section>

          {/* Closest unfinished task from the dashboard API. */}
          <section className="mt-8">
            <div className="mb-3.75 flex items-end justify-between gap-3">
              <div>
                <h2 className="mb-1 text-[17px] font-bold tracking-tight">
                  {t("activeProjects")}
                </h2>
          
                <p
                  className={`text-[11px] ${
                    darkMode ? "text-slate-400" : "text-[#96979f]"
                  }`}
                >
                  {t("projectsSubtitle")}
                </p>
              </div>
          
              <Link
                href="/tasks"
                className="flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-[#47759c] hover:text-[#2eb5bc]"
              >
                {t("viewAll")}
                <DirectionArrow size={15} />
              </Link>
            </div>
          
            <div className="grid w-full grid-cols-1 gap-3.75">
              {dashboardLoading ? (
                <div
                  className={`col-span-full rounded-[14px] border p-6 ${
                    darkMode
                      ? "bg-slate-800 border-slate-700"
                      : "bg-white border-[#e8e8ed]"
                  }`}
                >
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 w-1/3 rounded bg-slate-300/40" />
                    <div className="h-3 w-2/3 rounded bg-slate-300/40" />
                    <div className="h-2 w-full rounded bg-slate-300/40" />
                  </div>
                </div>
              ) : isError ? (
                <div
                  className={`col-span-full rounded-[14px] border p-6 text-center text-sm ${
                    darkMode
                      ? "bg-slate-800 border-slate-700 text-slate-400"
                      : "bg-white border-[#e8e8ed] text-[#96979f]"
                  }`}
                >
                  {t("somethingWentWrong")}
                </div>
              ) : closestTask ? (
                <article
                  className={`w-full min-w-0 rounded-[14px] border ${
                    darkMode
                      ? "bg-slate-800 border-slate-700"
                      : "bg-white border-[#e8e8ed]"
                  } p-4.25 shadow-sm shadow-black/3 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`grid h-8.5 w-8.5 place-items-center rounded-[9px] ${
                        darkMode
                          ? "bg-indigo-500/20 text-indigo-400"
                          : "bg-indigo-50 text-indigo-500"
                      }`}
                    >
                      <Folder size={19} />
                    </span>
          
                    <span
                      className={`rounded-full px-2 py-1 text-[9px] font-semibold ${
                        darkMode
                          ? closestTask.status === "REWORK"
                            ? "bg-orange-500/15 text-orange-300"
                            : closestTask.status === "SUBMITTED"
                              ? "bg-blue-500/15 text-blue-300"
                              : closestTask.status === "COMPLETED"
                                ? "bg-emerald-500/15 text-emerald-300"
                                : closestTask.status === "IN_PROGRESS"
                                  ? "bg-amber-500/15 text-amber-300"
                                  : "bg-slate-700 text-slate-300"
                          : closestTask.status === "REWORK"
                            ? "bg-orange-100 text-orange-700"
                            : closestTask.status === "SUBMITTED"
                              ? "bg-blue-100 text-blue-700"
                              : closestTask.status === "COMPLETED"
                                ? "bg-[#edf7ef] text-[#5d986b]"
                                : closestTask.status === "IN_PROGRESS"
                                  ? "bg-[#fff5e7] text-[#c17a36]"
                                  : "bg-[#f1f1f5] text-[#777780]"
                      }`}
                    >
                      {closestTask.status}
                    </span>
                  </div>
          
                  <h3
                    className="mb-4.25 mt-3.5 truncate text-sm font-bold"
                    title={closestTask.title}
                  >
                    {closestTask.title}
                  </h3>
          
                  <div
                    className={`flex justify-between text-[10px] ${
                      darkMode ? "text-slate-400" : "text-[#9b9ca4]"
                    }`}
                  >
                    <span>
                      {t("assignedTo")}
                    </span>
          
                    <strong
                      className={`${
                        darkMode ? "text-slate-200" : "text-[#595a62]"
                      }`}
                    >
                      {closestTask.assignee?.fullName || "-"}
                    </strong>
                  </div>
          
                  <div
                    className={`mt-1.75 h-1.25 overflow-hidden rounded-full ${
                      darkMode ? "bg-slate-700" : "bg-[#eeeef1]"
                    }`}
                  >
                    <div
                      className={`h-full rounded-full ${
                        closestTask.status === "REWORK"
                          ? "bg-orange-400"
                          : closestTask.status === "SUBMITTED"
                            ? "bg-blue-400"
                            : "bg-[#9B82C4]"
                      }`}
                      style={{
                        width:
                          closestTask.status === "COMPLETED"
                            ? "100%"
                            : closestTask.status === "SUBMITTED"
                              ? "75%"
                              : "40%",
                      }}
                    />
                  </div>
          
                  <div
                    className={`mt-4.5 flex items-center gap-2 border-t pt-3.25 text-[9px] ${
                      darkMode
                        ? "text-slate-400 border-slate-700"
                        : "text-[#999aa2]"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-1">
                      <Folder size={14} />
                      <span className="truncate">
                        {closestTask.team?.name || "-"}
                      </span>
                    </div>
          
                    <span className="ml-auto flex shrink-0 items-center gap-1">
                      <CalendarDays size={14} />
          
                      {closestTask.deadline
                        ? new Date(closestTask.deadline).toLocaleDateString(
                            lang === "ar" ? "ar-EG" : "en-US"
                          )
                        : "-"}
                    </span>
                  </div>
                </article>
              ) : (
                <div
                  className={`col-span-full rounded-[14px] border p-6 text-center text-sm ${
                    darkMode
                      ? "bg-slate-800 border-slate-700 text-slate-400"
                      : "bg-white border-[#e8e8ed] text-[#96979f]"
                  }`}
                >
                  {t("noUnfinishedTasks")}
                </div>
              )}
            </div>
          </section>

          {dashboardData?.role === "SUPERVISOR" ? (
            <>
              <TaskListSection
                title={t("myTasks")}
                subtitle={t("tasksSubtitle")}
                tasks={assignedTasks}
                sourceLabel={t("assignedSource")}
                dashboardLoading={dashboardLoading}
                isError={isError}
                darkMode={darkMode}
                lang={lang}
                t={t}
              />

              <StatisticsSection
                title={t("assignedStatistics")}
                subtitle={t("statisticsSubtitle")}
                cards={assignedStatisticCards}
                dashboardLoading={dashboardLoading}
                isError={isError}
                darkMode={darkMode}
                t={t}
              />

              <TaskListSection
                title={t("tasksCreatedByMe")}
                subtitle={t("projectsSubtitle")}
                tasks={createdTasks}
                sourceLabel={t("createdSource")}
                dashboardLoading={dashboardLoading}
                isError={isError}
                darkMode={darkMode}
                lang={lang}
                t={t}
              />

              <StatisticsSection
                title={t("createdStatistics")}
                subtitle={t("statisticsSubtitle")}
                cards={createdStatisticCards}
                dashboardLoading={dashboardLoading}
                isError={isError}
                darkMode={darkMode}
                t={t}
              />
            </>
          ) : (
            <>
              <TaskListSection
                title={t("myTasks")}
                subtitle={t("tasksSubtitle")}
                tasks={dashboardData?.role === "EMPLOYEE" ? assignedTasks : createdTasks}
                sourceLabel={dashboardData?.role === "EMPLOYEE" ? t("assignedSource") : t("createdSource")}
                dashboardLoading={dashboardLoading}
                isError={isError}
                darkMode={darkMode}
                lang={lang}
                t={t}
              />

              <StatisticsSection
                title={t("statistics")}
                subtitle={t("statisticsSubtitle")}
                cards={statisticCards}
                dashboardLoading={dashboardLoading}
                isError={isError}
                darkMode={darkMode}
                t={t}
              />
            </>
          )}

    </div>
  );
}


type DashboardTaskItem = {
  id: string;
  title: string;
  status: string;
  deadline: string | null;
  createdAt: string;
  assignee: { id: string; fullName: string } | null;
  createdBy: { id: string; fullName: string } | null;
  team: { id: string; name: string } | null;
};

type DashboardCopy = (key: keyof typeof copy.ar) => string;

function TaskListSection({
  title, subtitle, tasks, sourceLabel, dashboardLoading, isError, darkMode, lang, t,
}: {
  title: string;
  subtitle: string;
  tasks: DashboardTaskItem[];
  sourceLabel: string;
  dashboardLoading: boolean;
  isError: boolean;
  darkMode: boolean;
  lang: Lang;
  t: DashboardCopy;
}) {
  return (
    <section className="mt-7.75">
      <div className="mb-3.75 flex items-end justify-between gap-3">
        <div>
          <h2 className="mb-1 text-[17px] font-bold tracking-tight">{title}</h2>
          <p className={`text-[11px] ${darkMode ? "text-slate-400" : "text-[#96979f]"}`}>{subtitle}</p>
        </div>
        <Link href="/tasks" className="flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-[#47759c] hover:text-[#2eb5bc]">
          {t("viewAll")}
          {lang === "ar" ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}
        </Link>
      </div>

      <div className={`overflow-hidden rounded-[14px] border ${darkMode ? "border-slate-700 bg-slate-800" : "border-[#e8e8ed] bg-white"}`}>
        {dashboardLoading ? (
          <div className="animate-pulse space-y-4 p-5">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="h-4 w-4 rounded bg-slate-300/40" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/3 rounded bg-slate-300/40" />
                  <div className="h-2 w-1/4 rounded bg-slate-300/40" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className={`p-7 text-center text-xs ${darkMode ? "text-slate-400" : "text-[#92939a]"}`}>{t("somethingWentWrong")}</div>
        ) : tasks.length ? (
          tasks.map((task, index) => {
            const isCompleted = task.status === "COMPLETED";
            // Use localized labels for every known task status.
            const statusText =
              task.status === "COMPLETED" ? t("completed")
                : task.status === "SUBMITTED" ? t("submitted")
                  : task.status === "REWORK" ? t("rework")
                    : task.status === "DISPATCHED" ? t("dispatched")
                      : task.status === "IN_PROGRESS" ? t("inProgress")
                        : task.status === "READY_TO_DISPATCH" ? t("dispatched")
                          : task.status;

            // Keep status pills readable in both themes.
            const statusStyle = darkMode
              ? task.status === "COMPLETED" ? "bg-emerald-500/15 text-emerald-300"
                : task.status === "SUBMITTED" ? "bg-blue-500/15 text-blue-300"
                  : task.status === "REWORK" ? "bg-orange-500/15 text-orange-300"
                    : task.status === "IN_PROGRESS" ? "bg-amber-500/15 text-amber-300"
                      : task.status === "DISPATCHED" || task.status === "READY_TO_DISPATCH"
                        ? "bg-sky-500/15 text-sky-300"
                        : "bg-slate-700 text-slate-300"
              : task.status === "COMPLETED" ? "bg-[#edf7ef] text-[#5d986b]"
                : task.status === "SUBMITTED" ? "bg-[#edf4ff] text-[#4775b5]"
                  : task.status === "REWORK" ? "bg-[#fff0ee] text-[#cf635b]"
                    : task.status === "IN_PROGRESS" ? "bg-[#fff5e7] text-[#c17a36]"
                      : task.status === "DISPATCHED" || task.status === "READY_TO_DISPATCH"
                        ? "bg-sky-50 text-sky-700"
                        : "bg-slate-100 text-slate-600";

            return (
              <div key={task.id} className={`grid min-h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:grid-cols-[auto_minmax(0,1fr)_100px_68px_auto] ${
                index !== tasks.length - 1 ? `border-b ${darkMode ? "border-slate-700" : "border-[#f0f0f3]"}` : ""
              }`}>
                <span className={`grid h-4.5 w-4.5 place-items-center rounded-[5px] border-[1.5px] ${
                  isCompleted ? "border-[#2eb5bc] bg-[#2eb5bc] text-white"
                    : darkMode ? "border-slate-600 bg-slate-800" : "border-[#ccccd4] bg-white"
                }`} aria-label={statusText}>
                  {isCompleted && <Check size={13} />}
                </span>
                <div className="min-w-0">
                  <strong className={`block text-xs font-semibold ${
                    isCompleted ? `text-[#a5a6ac] ${darkMode ? "text-slate-500" : ""} line-through`
                      : darkMode ? "text-slate-100" : "text-[#3d3e44]"
                  }`}>{task.title}</strong>
                  <span className={`mt-1.25 flex items-center gap-1.5 text-[9px] ${darkMode ? "text-slate-400" : "text-[#999aa2]"}`}>
                    <i className={`h-1.25 w-1.25 rounded-full ${task.team ? "bg-[#2eb5bc]" : "bg-slate-400"}`} />
                    {task.team?.name || "-"} <span className="opacity-70">·</span> {sourceLabel}
                  </span>
                </div>
                <span className={`hidden items-center gap-1.5 text-[9px] sm:flex ${darkMode ? "text-slate-400" : "text-[#8c8d95]"}`}>
                  <CalendarDays size={14} />
                  {task.deadline ? new Date(task.deadline).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US") : "-"}
                </span>
                <span className={`justify-self-start rounded-full px-2 py-1 text-[8px] font-semibold ${statusStyle}`}>{statusText}</span>
                <button aria-label={`${t("taskOptions")}: ${task.title}`} className={`hidden sm:block ${darkMode ? "text-slate-400" : "text-[#a2a3aa]"} hover:text-[#47759c]`}>
                  <MoreHorizontal size={19} />
                </button>
              </div>
            );
          })
        ) : (
          <div className={`p-7 text-center text-xs ${darkMode ? "text-slate-400" : "text-[#92939a]"}`}>{t("empty")}.</div>
        )}
      </div>
    </section>
  );
}

function StatisticsSection({
  title, subtitle, cards, dashboardLoading, isError, darkMode, t,
}: {
  title: string;
  subtitle: string;
  cards: { title: string; value: number | string; icon: ReactNode; iconClass: string; detail: string }[];
  dashboardLoading: boolean;
  isError: boolean;
  darkMode: boolean;
  t: DashboardCopy;
}) {
  return (
    <section className="mt-8 pb-2">
      <div className="mb-3.75">
        <h2 className="mb-1 text-[17px] font-bold tracking-tight">{title}</h2>
        <p className={`text-[11px] ${darkMode ? "text-slate-400" : "text-[#96979f]"}`}>{subtitle}</p>
      </div>
      {dashboardLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className={`h-32.5 animate-pulse rounded-[14px] border p-4 ${darkMode ? "border-slate-700 bg-slate-800" : "border-[#e8e8ed] bg-white"}`}>
              <div className="h-3 w-1/2 rounded bg-slate-300/40" />
              <div className="mt-5 h-7 w-1/3 rounded bg-slate-300/40" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className={`rounded-[14px] border p-6 text-center text-xs ${darkMode ? "border-slate-700 bg-slate-800 text-slate-400" : "border-[#e8e8ed] bg-white text-[#96979f]"}`}>
          {t("somethingWentWrong")}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card, index) => (
            <StatCard key={`${card.title}-${index}`} {...card} darkMode={darkMode} />
          ))}
        </div>
      )}
    </section>
  );
}

// Reusable statistic card used by the dashboard's summary section.
function StatCard({ title, value, icon, iconClass, detail, darkMode }: { title: string; value: number | string; icon: ReactNode; iconClass: string; detail: string; darkMode: boolean }) {
  const darkIconClass = iconClass.includes("indigo")
    ? "bg-indigo-500/15 text-indigo-300"
    : iconClass.includes("238e94")
      ? "bg-teal-500/15 text-teal-300"
      : iconClass.includes("c17a36")
        ? "bg-amber-500/15 text-amber-300"
        : iconClass.includes("2eb5bc")
          ? "bg-cyan-500/15 text-cyan-300"
          : "bg-slate-700 text-blue-300";

  return (
    <article className={`rounded-[14px] border p-4.25 shadow-sm shadow-black/3 ${darkMode ? "border-slate-700 bg-slate-800" : "border-[#e8e8ed] bg-white"}`}>
      <div className="flex items-center justify-between">
        <span className={`text-[11px] font-medium ${darkMode ? "text-slate-300" : "text-[#858592]"}`}>{title}</span>
        <span className={`grid h-8.5 w-8.5 place-items-center rounded-[9px] ${darkMode ? darkIconClass : iconClass}`}>{icon}</span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-2">
        <strong className="text-[27px] font-bold tracking-tight">{value}</strong>
        <span className={`text-[10px] ${darkMode ? "text-slate-400" : "text-[#96979f]"}`}>{detail}</span>
      </div>
    </article>
  );
}

