"use client";

import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Users,
  Zap,
  ChartNoAxesCombined,
} from "lucide-react";
import { useDashboardLayout } from "@/app/components/DashboardLayout";

type StatTone = "teal" | "blue" | "cyan" | "navy";
type PieTone = "teal" | "blue" | "cyan";

type Stat = {
  label: string;
  value: string;
  change: string;
  icon: "check" | "clock" | "folder" | "bolt" | "users" | "chart";
  tone: StatTone;
};

type PieMetric = {
  label: string;
  value: number;
  detail: string;
  tone: PieTone;
};

type AnalyticsData = {
  stats: Stat[];
  pies: PieMetric[];
};

const userAnalytics: AnalyticsData = {
  stats: [
    { label: "completed", value: "126", change: "+12%", icon: "check", tone: "teal" },
    { label: "focusHours", value: "84.5", change: "+8%", icon: "clock", tone: "blue" },
    { label: "activeProjects", value: "6", change: "+2", icon: "folder", tone: "cyan" },
    { label: "productivity", value: "91%", change: "+5%", icon: "bolt", tone: "navy" },
  ],
  pies: [
    { label: "completion", value: 86, detail: "126 of 147 tasks", tone: "teal" },
    { label: "deadlines", value: 78, detail: "14 tasks on time", tone: "blue" },
    { label: "monthlyGoals", value: 72, detail: "8 of 11 goals", tone: "cyan" },
  ],
};

const adminAnalytics: AnalyticsData = {
  stats: [
    { label: "teamMembers", value: "48", change: "+6", icon: "users", tone: "teal" },
    { label: "completed", value: "1,284", change: "+18%", icon: "check", tone: "blue" },
    { label: "activeProjects", value: "24", change: "+4", icon: "folder", tone: "cyan" },
    { label: "teamEfficiency", value: "88%", change: "+7%", icon: "chart", tone: "navy" },
  ],
  pies: [
    { label: "teamPerformance", value: 88, detail: "Above last month", tone: "teal" },
    { label: "projectHealth", value: 76, detail: "18 projects on track", tone: "blue" },
    { label: "resourceUsage", value: 69, detail: "Across all departments", tone: "cyan" },
  ],
};

const messages = {
  ar: {
    kicker: "نظرة شاملة على الأداء",
    title: "التحليلات والإحصاءات",
    description: "تابع التقدم، اكتشف الاتجاهات، واتخذ قرارات أفضل بالاعتماد على البيانات.",
    user: "إحصاءات المستخدم",
    admin: "إحصاءات المدير",
    week: "هذا الأسبوع",
    month: "هذا الشهر",
    quarter: "آخر 3 أشهر",
    year: "هذا العام",
    previousPeriod: "مقارنة بالفترة السابقة",
    performance: "تطور الأداء",
    currentPeriod: "الفترة الحالية",
    previousPeriodLegend: "الفترة السابقة",
    workload: "توزيع المهام",
    currentStatus: "حسب الحالة الحالية",
    totalTasks: "إجمالي المهام",
    completed: "مكتملة",
    inProgress: "قيد التنفيذ",
    review: "للمراجعة",
    overdue: "متأخرة",
    completion: "إنجاز المهام",
    deadlines: "الالتزام بالمواعيد",
    monthlyGoals: "أهداف هذا الشهر",
    noticeableImprovement: "تحسّن ملحوظ",
    projectsHealth: "حالة المشاريع",
    projectsHealthDescription: "توزيع المشاريع حسب مستوى التقدم",
    details: "عرض التفاصيل",
    onTrack: "تسير حسب الخطة",
    attention: "تحتاج إلى انتباه",
    recentActivity: "نشاطك الأخير",
    bestTeam: "أفضل أعضاء الفريق",
    performanceDuring: "الأداء خلال",
    comparison: "مقارنة بالفترة السابقة",
    weeks: ["أسبوع 1", "أسبوع 2", "أسبوع 3", "أسبوع 4"],
    completedTasks: "مهمة مكتملة",
    teamMembers: "إجمالي أعضاء الفريق",
    focusHours: "ساعات التركيز",
    activeProjects: "المشاريع النشطة",
    productivity: "معدل الإنتاجية",
    teamEfficiency: "كفاءة الفريق",
    teamPerformance: "أداء الفريق",
    projectHealth: "صحة المشاريع",
    resourceUsage: "استخدام الموارد",
    taskDetails: ["126 من 147 مهمة", "14 مهمة في موعدها", "8 من 11 هدفاً"],
    adminDetails: ["أعلى من الشهر السابق", "18 مشروعاً تسير حسب الخطة", "متوسط جميع الأقسام"],
    projectLabels: ["مكتملة", "تسير حسب الخطة", "تحتاج إلى انتباه", "متأخرة"],
    userProjects: ["إعادة تصميم الموقع", "تطبيق الهاتف", "حملة الربع الثاني", "نظام التصميم"],
    teamNames: ["أحمد خالد", "مريم علي", "سارة محمد", "يوسف سالم"],
    taskCounts: ["24 مهمة مكتملة", "21 مهمة مكتملة", "19 مهمة مكتملة", "17 مهمة مكتملة"],
    statLabels: {
      completed: "المهام المكتملة",
      focusHours: "ساعات التركيز",
      activeProjects: "المشاريع النشطة",
      productivity: "معدل الإنتاجية",
      teamMembers: "إجمالي أعضاء الفريق",
      teamEfficiency: "كفاءة الفريق",
    },
  },
  en: {
    kicker: "Performance overview",
    title: "Analytics & Statistics",
    description: "Track progress, discover trends, and make better data-driven decisions.",
    user: "User analytics",
    admin: "Admin analytics",
    week: "This week",
    month: "This month",
    quarter: "Last 3 months",
    year: "This year",
    previousPeriod: "Compared with the previous period",
    performance: "Performance over time",
    currentPeriod: "Current period",
    previousPeriodLegend: "Previous period",
    workload: "Task distribution",
    currentStatus: "By current status",
    totalTasks: "Total tasks",
    completed: "Completed",
    inProgress: "In progress",
    review: "In review",
    overdue: "Overdue",
    completion: "Task completion",
    deadlines: "On-time delivery",
    monthlyGoals: "Monthly goals",
    noticeableImprovement: "Noticeable improvement",
    projectsHealth: "Project health",
    projectsHealthDescription: "Projects by progress status",
    details: "View details",
    onTrack: "On track",
    attention: "Needs attention",
    recentActivity: "Recent activity",
    bestTeam: "Top team members",
    performanceDuring: "Performance during",
    comparison: "Compared with the previous period",
    weeks: ["Week 1", "Week 2", "Week 3", "Week 4"],
    completedTasks: "tasks completed",
    teamMembers: "Total team members",
    focusHours: "Focus hours",
    activeProjects: "Active projects",
    productivity: "Productivity rate",
    teamEfficiency: "Team efficiency",
    teamPerformance: "Team performance",
    projectHealth: "Project health",
    resourceUsage: "Resource usage",
    taskDetails: ["126 of 147 tasks", "14 tasks on time", "8 of 11 goals"],
    adminDetails: ["Above last month", "18 projects on track", "Across all departments"],
    projectLabels: ["Completed", "On track", "Needs attention", "Overdue"],
    userProjects: ["Website redesign", "Mobile app", "Q2 campaign", "Design system"],
    teamNames: ["Ahmed Khaled", "Maryam Ali", "Sara Mohamed", "Youssef Salem"],
    taskCounts: ["24 tasks completed", "21 tasks completed", "19 tasks completed", "17 tasks completed"],
    statLabels: {
      completed: "Tasks completed",
      focusHours: "Focus hours",
      activeProjects: "Active projects",
      productivity: "Productivity rate",
      teamMembers: "Total team members",
      teamEfficiency: "Team efficiency",
    },
  },
} as const;

function MetricIcon({ name, size = 20 }: { name: Stat["icon"]; size?: number }) {
  switch (name) {
    case "check":
      return <CheckCircle2 size={size} />;
    case "clock":
      return <Clock3 size={size} />;
    case "folder":
      return <FolderKanban size={size} />;
    case "bolt":
      return <Zap size={size} />;
    case "users":
      return <Users size={size} />;
    case "chart":
      return <ChartNoAxesCombined size={size} />;
  }
}

function AnalyticsAvatar({ initials }: { initials: string }) {
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-teal-500/20 bg-teal-500/10 text-sm font-bold text-teal-600 dark:text-teal-300">
      {initials}
    </span>
  );
}

export default function AnalyticsPage() {
  const { isArabic, darkMode } = useDashboardLayout();
  const [view, setView] = useState<"user" | "admin">("user");
  const [range, setRange] = useState<"week" | "month" | "quarter" | "year">("month");

  const data = view === "user" ? userAnalytics : adminAnalytics;
  const t = messages[isArabic ? "ar" : "en"];
  const rangeLabels = { week: t.week, month: t.month, quarter: t.quarter, year: t.year };
  const bars = view === "user"
    ? [42, 58, 49, 72, 66, 85, 78, 91, 76, 88, 82, 94]
    : [55, 64, 60, 78, 74, 82, 70, 89, 85, 92, 88, 96];

  const cardClass = `min-w-0 rounded-2xl border p-5 shadow-sm transition-colors sm:p-6 ${
    darkMode ? "border-slate-700 bg-slate-800 text-slate-100" : "border-slate-200 bg-white text-slate-800"
  }`;
  const mutedClass = darkMode ? "text-slate-400" : "text-slate-500";
  const inputClass = `rounded-xl border px-3 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${
    darkMode ? "border-slate-600 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-700"
  }`;

  const projectRows = [
    { label: t.projectLabels[0], value: view === "user" ? "8" : "42", width: "82%", color: "bg-[#2EB5BC]" },
    { label: t.projectLabels[1], value: view === "user" ? "4" : "18", width: "68%", color: "bg-[#47759C]" },
    { label: t.projectLabels[2], value: view === "user" ? "2" : "5", width: "31%", color: "bg-[#79CBD0]" },
    { label: t.projectLabels[3], value: view === "user" ? "1" : "3", width: "18%", color: "bg-[#E99086]" },
  ];

  const activity = [0, 1, 2, 3].map((index) => ({
    initials: isArabic ? ["أ", "م", "س", "ي"][index] : ["A", "M", "S", "Y"][index],
    name: view === "user" ? t.userProjects[index] : t.teamNames[index],
    detail: view === "user" ? t.taskCounts[index] : t.taskCounts[index],
    score: ["96%", "92%", "89%", "86%"][index],
  }));

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      lang={isArabic ? "ar" : "en"}
      className={`w-full space-y-6 ${isArabic ? "font-[Tajawal,sans-serif]" : "font-sans"}`}
    >
      {/* Page Header & Filters
          - Displays the page title, overview, and description.
          - Provides User/Admin view selection.
          - Allows filtering analytics by the selected time range.
      */}
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div className="min-w-0">
          <span className="mb-2 inline-flex items-center gap-2 text-xs font-bold text-teal-500">
            <ChartNoAxesCombined size={15} />
            {t.kicker}
          </span>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.title}</h1>
          <p className={`mt-2 max-w-2xl text-sm leading-6 ${mutedClass}`}>{t.description}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className={`grid grid-cols-2 gap-1 rounded-xl p-1 ${darkMode ? "bg-slate-700" : "bg-slate-100"}`}>
            <button
              type="button"
              aria-pressed={view === "user"}
              onClick={() => setView("user")}
              className={`rounded-lg px-3 py-2.5 text-xs font-semibold transition sm:text-sm ${
                view === "user" ? "bg-teal-500 text-white shadow-sm" : `${mutedClass} hover:text-teal-500`
              }`}
            >
              {t.user}
            </button>
            <button
              type="button"
              aria-pressed={view === "admin"}
              onClick={() => setView("admin")}
              className={`rounded-lg px-3 py-2.5 text-xs font-semibold transition sm:text-sm ${
                view === "admin" ? "bg-teal-500 text-white shadow-sm" : `${mutedClass} hover:text-teal-500`
              }`}
            >
              {t.admin}
            </button>
          </div>

          <select
            aria-label={isArabic ? "الفترة الزمنية" : "Date range"}
            value={range}
            onChange={(event) => setRange(event.target.value as typeof range)}
            className={`${inputClass} min-w-36`}
          >
            <option value="week">{t.week}</option>
            <option value="month">{t.month}</option>
            <option value="quarter">{t.quarter}</option>
            <option value="year">{t.year}</option>
          </select>
        </div>
      </div>

      
        {/* Statistics Overview
            - Displays key performance indicators for the selected view.
            - Shows metric values, changes, and matching icons.
            - Uses theme-aware colors for Light and Dark modes.
        */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {data.stats.map((stat, index) => (
                <article
                key={`${stat.icon}-${index}`}
                className={`${cardClass} ${
                    darkMode
                    ? "border-gray-700 bg-gray-900 text-gray-100"
                    : "border-gray-200 bg-white text-gray-900"
                }`}
                >
                <div className="flex items-start justify-between gap-3 mb-5">
                    <div
                    className={`grid h-11 w-11 place-items-center rounded-xl ${
                        stat.tone === "teal"
                        ? darkMode
                            ? "bg-teal-500/15 text-teal-300"
                            : "bg-teal-50 text-teal-700"
                        : stat.tone === "blue"
                            ? darkMode
                            ? "bg-blue-500/15 text-blue-300"
                            : "bg-blue-50 text-blue-700"
                            : stat.tone === "cyan"
                            ? darkMode
                                ? "bg-cyan-500/15 text-cyan-300"
                                : "bg-cyan-50 text-cyan-700"
                            : darkMode
                                ? "bg-slate-500/20 text-slate-300"
                                : "bg-slate-100 text-slate-700"
                    }`}
                    >
                    <MetricIcon name={stat.icon} />
                    </div>

                    <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        darkMode
                        ? "bg-emerald-400/10 text-emerald-300"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                    >
                    {stat.change}
                    </span>
                </div>

                <p
                    className={`text-sm  ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                >
                    {t.statLabels[stat.label as keyof typeof t.statLabels] ??
                    stat.label}
                </p>

                <strong
                    className={`mt-2 mb-2 block text-3xl font-bold tracking-tight ${
                    darkMode ? "text-white" : "text-gray-900"
                    }`}
                >
                    {stat.value}
                </strong>

                <p
                    className={`mt-2 text-xs ${
                    darkMode ? "text-gray-500" : "text-gray-500"
                    }`}
                >
                    {t.comparison}
                </p>
                </article>
            ))}
        </div>


      {/* Performance Analytics & Task Workload
          - Visualizes performance trends for the selected time range.
          - Compares the current period with the previous period.
          - Displays the distribution of tasks by status in a donut chart.
      */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.6fr_1fr]">
        <article className={cardClass}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-bold sm:text-lg">{t.performance}</h2>
              <p className={`mt-1 text-xs ${mutedClass}`}>{rangeLabels[range]} — {t.previousPeriod}</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-500">
              +14.2% <ArrowUpRight size={14} />
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-xs">
            <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-sm bg-teal-500" />{t.currentPeriod}</span>
            <span className={`inline-flex items-center gap-2 ${mutedClass}`}>
              <i className={`h-2.5 w-2.5 rounded-sm ${darkMode ? "bg-slate-600" : "bg-slate-300"}`} />
              {t.previousPeriodLegend}
            </span>
          </div>

          <div className="mt-5 flex h-56 items-end gap-1.5 border-b border-dashed border-slate-500/20 px-1 sm:gap-3">
            {bars.map((height, index) => (
                <div key={`${height}-${index}`} className="flex h-full min-w-0 flex-1 items-end justify-center gap-1">
                    <span className={`w-2 shrink-0 rounded-t-md ${ darkMode ? "bg-slate-600" : "bg-slate-200"}`} style={{ height: `${Math.max(12, height - 17)}%` }}/>
                    <span className="w-2.5 shrink-0 rounded-t-md bg-linear-to-t from-[#47759c] to-[#2eb5bc] transition-all duration-300" style={{ height: `${height}%` }}/>
                </div>
            ))}
            </div>
          <div className={`mt-3 flex justify-between text-[10px] sm:text-xs ${mutedClass}`}>
            {t.weeks.map((week) => <span key={week}>{week}</span>)}
          </div>
        </article>

        <article className={cardClass}>
          <div>
            <h2 className="text-base font-bold sm:text-lg">{t.workload}</h2>
            <p className={`mt-1 text-xs ${mutedClass}`}>{t.currentStatus}</p>
          </div>

          <div className="mt-7 flex flex-col items-center gap-7 sm:flex-row sm:justify-center xl:flex-col 2xl:flex-row">
            <div
              className="grid h-44 w-44 shrink-0 place-items-center rounded-full"
              style={{ background: "conic-gradient(#2EB5BC 0% 62%, #47759C 62% 86%, #79CBD0 86% 95%, #E99086 95% 100%)" }}
            >
              <div className={`grid h-32 w-32 place-items-center rounded-full ${darkMode ? "bg-slate-800" : "bg-white"}`}>
                <div className="text-center">
                  <strong className="block text-2xl font-bold">{view === "user" ? "147" : "1,526"}</strong>
                  <span className={`mt-1 block text-xs ${mutedClass}`}>{t.totalTasks}</span>
                </div>
              </div>
            </div>

            <div className="w-full max-w-xs space-y-4">
              {[
                { label: t.completed, percentage: 62, color: "bg-[#2EB5BC]" },
                { label: t.inProgress, percentage: 24, color: "bg-[#47759C]" },
                { label: t.review, percentage: 9, color: "bg-[#79CBD0]" },
                { label: t.overdue, percentage: 5, color: "bg-[#E99086]" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex min-w-0 items-center gap-2">
                    <i className={`h-2.5 w-2.5 shrink-0 rounded-sm ${item.color}`} />
                    <span className="truncate">{item.label}</span>
                  </span>
                  <strong className="text-xs">{item.percentage}%</strong>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>

      {/* Performance Metrics
          - Displays individual progress indicators and completion rates.
          - Summarizes performance percentages for the selected User/Admin view.
      */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {data.pies.map((pie, index) => (
          <article key={pie.label} className={`flex items-center gap-4 rounded-2xl border p-5 shadow-sm ${darkMode ? "border-slate-700 bg-slate-800 text-slate-100" : "border-slate-200 bg-white text-slate-800"}`}>
            <div
              className="grid h-24 w-24 shrink-0 place-items-center rounded-full"
              style={{
                background: `conic-gradient(${index === 1 ? "#47759C" : index === 2 ? "#79CBD0" : "#2EB5BC"} ${pie.value}%, ${darkMode ? "#374151" : "#e5e7eb"} 0)`,
              }}
            >
              <div className={`grid h-17 w-17 place-items-center rounded-full ${darkMode ? "bg-slate-800 text-slate-100" : "bg-white text-slate-800"}`}>
                <strong className="text-lg">{pie.value}<small className="text-xs">%</small></strong>
              </div>
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold">
                {pie.label === "completion" ? t.completion :
                 pie.label === "deadlines" ? t.deadlines :
                 pie.label === "monthlyGoals" ? t.monthlyGoals :
                 pie.label === "teamPerformance" ? t.teamPerformance :
                 pie.label === "projectHealth" ? t.projectHealth : t.resourceUsage}
              </h3>
              <p className={`mt-1 text-xs leading-5 ${mutedClass}`}>{pie.detail}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-500">
                <ArrowUpRight size={12} />{t.noticeableImprovement}
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Project Health & Recent Activity
          - Summarizes project progress by status.
          - Shows recent user activity or top team members.
          - Adapts labels, layout direction, and colors to language and theme.
      */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <article className={cardClass}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold sm:text-lg">{t.projectsHealth}</h2>
              <p className={`mt-1 text-xs ${mutedClass}`}>{t.projectsHealthDescription}</p>
            </div>
            <button type="button" className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-teal-500 transition hover:bg-teal-500/10">
              {t.details}<ArrowRight size={14} />
            </button>
          </div>

          <div className="space-y-5">
            {projectRows.map((project) => (
              <div key={project.label}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className={mutedClass}>{project.label}</span>
                  <strong>{project.value}</strong>
                </div>
                <div className={`h-2.5 overflow-hidden rounded-full ${darkMode ? "bg-slate-700" : "bg-slate-100"}`}>
                  <div className={`h-full rounded-full transition-all duration-500 ${project.color}`} style={{ width: project.width }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className={cardClass}>
          <div className="mb-5">
            <h2 className="text-base font-bold sm:text-lg">{view === "user" ? t.recentActivity : t.bestTeam}</h2>
            <p className={`mt-1 text-xs ${mutedClass}`}>{t.performanceDuring} {rangeLabels[range]}</p>
          </div>

          <div className={`divide-y ${darkMode ? "divide-slate-700" : "divide-slate-200"}`}>
            {activity.map((person) => (
              <div key={person.name} className="flex items-center gap-3 py-4 first:pt-0 last:pb-0">
                <AnalyticsAvatar initials={person.initials} />
                <div className="min-w-0 flex-1">
                  <strong className="block truncate text-sm font-semibold">{person.name}</strong>
                  <span className={`mt-1 block text-xs ${mutedClass}`}>{person.detail}</span>
                </div>
                <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-xs font-bold text-emerald-500">{person.score}</span>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
