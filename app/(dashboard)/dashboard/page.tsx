// "use client";


// import { useMemo, useState, type ReactNode } from "react";
// import Link from "next/link";
// import {
//   Check, Folder, CalendarDays, Sparkles, ArrowLeft, ArrowRight, Clock,
//   MoreHorizontal, ListTodo, CircleCheck, Timer, ChartNoAxesCombined,
// } from "lucide-react";
// import { useDashboardLayout } from "@/app/components/DashboardLayout";

// type Lang = "ar" | "en";
// type Project = {
//   id: string; name: { ar: string; en: string }; progress: number; color: "blue" | "violet" | "orange";
//   tasks: string; due: { ar: string; en: string }; members: string[];
// };
// type Task = {
//   id: string; title: { ar: string; en: string }; projectId: string; date: { ar: string; en: string };
//   priority: "high" | "medium" | "low"; checked: boolean;
// };

// const copy = {
//   ar: {
//     overview: "نظرة عامة", myTasks: "مهامي", projects: "المشاريع", calendar: "التقويم", team: "الفريق",
//     workspace: "مساحة العمل", upgradeTitle: "استفد أكثر مع الباقة الاحترافية",
//     upgradeText: "احصل على مساعدة غير محدودة بالذكاء الاصطناعي وتقارير متقدمة.", upgradeButton: "عرض الباقات",
//     search: "ابحث عن أي شيء...", notifications: "الإشعارات", newProject: "مشروع جديد",
//     date: "الاثنين، 13 مايو", greeting: "صباح الخير، جنى", welcome: "إليك آخر المستجدات في مشاريعك اليوم.",
//     online: "7 من أعضاء الفريق متصلون", composerTitle: "ابدأ مشروعاً جديداً بالذكاء الاصطناعي",
//     composerText: "أخبرنا بما تخطط له وسننشئ المهام المناسبة.", notNow: "ليس الآن", ai: "NTRA",
//     aiTitle: "لنجعل يومك أكثر إنتاجية", aiText: "وجدت 3 مهام تحتاج إلى اهتمامك، وأعددت خطة مقترحة لتنظيم يومك.",
//     plan: "إضافة مهام جديده", priorities: "3 أولويات", hours: "4.5 ساعات", activeProjects: "المشاريع النشطة",
//     projectsSubtitle: "تابع تقدم فريقك بسهولة", viewAll: "عرض الكل", progress: "التقدم", tasksSubtitle: "أولوياتك خلال الأيام القادمة",
//     high: "عالية", medium: "متوسطة", low: "منخفضة", today: "اليوم", tomorrow: "غداً",
//     empty: "لا توجد مهام تطابق", statistics: "الإحصائيات", statisticsSubtitle: "ملخص إنجازاتك ومهامك",
//     totalTasks: "إجمالي المهام", completed: "مهام مكتملة", inProgress: "قيد التنفيذ", completionRate: "معدل الإنجاز",
//     tasksCompletedOf: "من المهام مكتملة", language: "English", languageAria: "التبديل إلى الإنجليزية",
//     taskActionComplete: "إكمال", taskActionReopen: "إعادة فتح", taskOptions: "خيارات المهمة", projectOptions: "خيارات المشروع",
//     sidebarStats: "ملخص سريع", logout: "تسجيل الخروج", logoutAria: "تسجيل الخروج من الحساب",
//     darkMode: "الوضع الداكن", lightMode: "الوضع الفاتح", themeAria: "تغيير المظهر",
//   },
//   en: {
//     overview: "Overview", myTasks: "My Tasks", projects: "Projects", calendar: "Calendar", team: "Team",
//     workspace: "WORKSPACE", upgradeTitle: "Get more with Pro", upgradeText: "Unlock unlimited AI assistance and advanced reports.",
//     upgradeButton: "Explore plans", search: "Search anything...", notifications: "Notifications", newProject: "New project",
//     date: "Monday, May 13", greeting: "Good morning, Jana", welcome: "Here’s the latest update on your projects today.",
//     online: "7 team members online", composerTitle: "Start a new project with AI", composerText: "Tell us what you’re planning and we’ll create the right tasks.",
//     notNow: "Not now", ai: "NTRA", aiTitle: "Make your day more productive", aiText: "You have 3 tasks that need attention. We prepared a suggested plan for your day.",
//     plan: "Add New Tasks", priorities: "3 priorities", hours: "4.5 hours", activeProjects: "Active projects",
//     projectsSubtitle: "Track your team’s progress", viewAll: "View all", progress: "Progress", tasksSubtitle: "Your priorities for the coming days",
//     high: "High", medium: "Medium", low: "Low", today: "Today", tomorrow: "Tomorrow",
//     empty: "No tasks match", statistics: "Statistics", statisticsSubtitle: "A summary of your tasks and progress",
//     totalTasks: "Total tasks", completed: "Completed", inProgress: "In progress", completionRate: "Completion rate",
//     tasksCompletedOf: "tasks completed", language: "العربية", languageAria: "Switch to Arabic",
//     taskActionComplete: "Complete", taskActionReopen: "Reopen", taskOptions: "Task options", projectOptions: "Project options",
//     sidebarStats: "QUICK STATS", logout: "Log out", logoutAria: "Log out of your account",
//     darkMode: "Dark mode", lightMode: "Light mode", themeAria: "Toggle color theme",
//   },
// } satisfies Record<Lang, Record<string, string>>;

// const projects: Project[] = [
//   { id: "website", name: { ar: "إعادة تصميم الموقع", en: "Website redesign" }, progress: 72, color: "blue", tasks: "18/25", due: { ar: "24 مايو", en: "May 24" }, members: ["س", "أ", "م"] },
//   { id: "mobile", name: { ar: "تطبيق الهاتف", en: "Mobile app" }, progress: 48, color: "violet", tasks: "12/28", due: { ar: "02 يونيو", en: "Jun 02" }, members: ["أ", "ت"] },
//   { id: "campaign", name: { ar: "حملة الربع الثاني", en: "Q2 campaign" }, progress: 86, color: "orange", tasks: "24/30", due: { ar: "18 مايو", en: "May 18" }, members: ["م", "س", "ت"] },
// ];

// const initialTasks: Task[] = [
//   { id: "homepage", title: { ar: "إنهاء مخططات الصفحة الرئيسية", en: "Finalize homepage wireframes" }, projectId: "website", date: { ar: "اليوم", en: "Today" }, priority: "high", checked: false },
//   { id: "interviews", title: { ar: "مراجعة ملاحظات مقابلات المستخدمين", en: "Review user interview notes" }, projectId: "mobile", date: { ar: "اليوم", en: "Today" }, priority: "medium", checked: false },
//   { id: "report", title: { ar: "إعداد تقرير أداء الحملة", en: "Prepare campaign performance report" }, projectId: "campaign", date: { ar: "غداً", en: "Tomorrow" }, priority: "low", checked: false },
//   { id: "design-system", title: { ar: "تحديث مكوّنات نظام التصميم", en: "Update design system components" }, projectId: "website", date: { ar: "17 مايو", en: "May 17" }, priority: "medium", checked: true },
// ];

// const projectColors = {
//   blue: { icon: "bg-[#edf3f7] text-[#47759c]", bar: "bg-[#47759c]", dot: "bg-[#47759c]" },
//   violet: { icon: "bg-[#e8f8f8] text-[#2eb5bc]", bar: "bg-[#2eb5bc]", dot: "bg-[#2eb5bc]" },
//   orange: { icon: "bg-[#edf7f8] text-[#6fa6b4]", bar: "bg-[#6fa6b4]", dot: "bg-[#6fa6b4]" },
// };

// function Avatar({ initials, light = false }: { initials: string; light?: boolean }) {
//   return <span className={`grid h-8.5 w-8.5 shrink-0 place-items-center rounded-full border-2 border-white text-[10px] font-bold ${light ? "bg-[#e4e0d8] text-[#5f5b55]" : "bg-[#353550] text-white"}`}>{initials}</span>;
// }

// export default function Home() {
//   const { lang, isArabic } = useDashboardLayout();
//   const [taskList, setTaskList] = useState(initialTasks);
//   const t = (key: keyof typeof copy.ar) => copy[lang][key];
//   const DirectionArrow = isArabic ? ArrowLeft : ArrowRight;
//   const projectById = (id: string) => projects.find((project) => project.id === id)!;

//   const visibleTasks = useMemo(() => taskList, [taskList]);

//   const completedCount = taskList.filter((task) => task.checked).length;
//   const totalCount = taskList.length;
//   const completionRate = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
//   const inProgressCount = totalCount - completedCount;

//   const toggleTask = (id: string) => setTaskList((current) =>
//     current.map((task) => task.id === id ? { ...task, checked: !task.checked } : task)
//   );

//   return (
//     <div className="space-y-0">
//           <section className="flex items-start justify-between gap-4"><div><p className="mb-2 text-[10px] font-bold tracking-[1px] text-[#8f9098]">{t("date")}</p><h1 className="mb-2 text-[23px] font-bold leading-tight tracking-tight sm:text-[27px]">{t("greeting")}</h1><p className="text-[13px] text-[#83848c]">{t("welcome")}</p></div>
//             <div className="hidden shrink-0 text-start text-[10px] text-[#96979f] sm:block"><div className="mb-1 flex"><span className={isArabic ? "-ml-1.75" : "-mr-1.75"}><Avatar initials="A" light /></span><span className={isArabic ? "-ml-1.75" : "-mr-1.75"}><Avatar initials="M" light /></span><Avatar initials="T" light /><span className="grid h-8.5 w-8.5 place-items-center rounded-full border-2 border-white bg-[#f0f0f4] text-[10px] text-[#757680]">+4</span></div><span>{t("online")}</span></div>
//           </section>


//           <section className="relative mt-7.25 grid min-h-48.5 overflow-hidden rounded-[18px] bg-linear-to-l from-[#2eb5bc] via-[#47759c] to-[#345f82] text-white shadow-xl shadow-[#47759c]/15 md:grid-cols-[1.4fr_1fr]">
//             <div className="relative z-2 flex items-start gap-3.5 p-5 sm:p-7"><span className="grid h-9.5 w-9.5 shrink-0 place-items-center rounded-[11px] bg-linear-to-br from-[#55cbd0] to-[#2eb5bc] shadow-inner shadow-white/20"><Sparkles size={20} /></span><div><span className="text-[9px] font-bold tracking-[1.1px] text-[#bff3f1]">{t("ai")}</span><h2 className="mb-2 mt-1.5 text-lg font-bold tracking-tight sm:text-xl">{t("aiTitle")}</h2><p className="mb-4 max-w-120 text-xs leading-relaxed text-[#d9eef2]">{t("aiText")}</p><button className="flex h-8.5 items-center gap-2 rounded-[9px] bg-white px-4 text-xs font-semibold text-[#47759c] transition hover:bg-[#f0fbfb]">{t("plan")}<DirectionArrow size={16} /></button></div></div>
//             <div className="relative hidden min-h-48.5 overflow-hidden md:block"><div className={`absolute -top-8.75 h-65 w-65 rounded-full border border-white ${isArabic ? "right-[5%]" : "left-[5%]"}`} /><div className={`absolute top-[10%] h-37.5 w-37.5 rounded-full bg-[#6de2df]/20 blur-lg ${isArabic ? "right-[10%]" : "left-[10%]"}`} /><div className="absolute bottom-[-20%] left-[15%] h-20 w-20 rounded-full bg-[#b8ecf0]/15 blur-lg" /><div className={`absolute top-13.75 z-2 grid h-19 w-19 rotate-[-7deg] place-items-center rounded-[25px] bg-linear-to-br from-[#60d0d4]/60 to-[#47759c]/80 text-[#e4ffff] shadow-xl shadow-[#274e66]/30 ${isArabic ? "right-1/4" : "left-1/4"}`}><Sparkles size={34} /></div><span className={`absolute top-6.5 z-3 flex items-center gap-1.5 rounded-lg border border-white bg-white px-2.5 py-2 text-[9px] text-[#eeeefe] backdrop-blur-md ${isArabic ? "right-[8%]" : "left-[8%]"}`}><Check size={13} />{t("priorities")}</span><span className={`absolute bottom-6.25 z-3 flex items-center gap-1.5 rounded-lg border border-white bg-white px-2.5 py-2 text-[9px] text-[#eeeefe] backdrop-blur-md ${isArabic ? "left-[16%]" : "right-[16%]"}`}><Clock size={13} />{t("hours")}</span></div>
//           </section>

//           <section className="mt-8"><div className="mb-3.75 flex items-end justify-between gap-3"><div><h2 className="mb-1 text-[17px] font-bold tracking-tight">{t("activeProjects")}</h2><p className="text-[11px] text-[#96979f]">{t("projectsSubtitle")}</p></div><Link href="/projects" className="flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-[#47759c] hover:text-[#2eb5bc]">{t("viewAll")}<DirectionArrow size={15} /></Link></div>
//             <div className="grid grid-cols-1 gap-3.75 md:grid-cols-2 xl:grid-cols-3">{projects.map((project) => { const color = projectColors[project.color]; return <article key={project.id} className="min-w-0 rounded-[14px] border border-[#e8e8ed] bg-white p-4.25 shadow-sm shadow-black/3 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5"><div className="flex items-center justify-between"><span className={`grid h-8.5 w-8.5 place-items-center rounded-[9px] ${color.icon}`}><Folder size={19} /></span><button aria-label={`${t("projectOptions")}: ${project.name[lang]}`} className="text-[#a2a3aa] hover:text-[#47759c]"><MoreHorizontal size={19} /></button></div><h3 className="mb-4.25 mt-3.5 text-sm font-bold">{project.name[lang]}</h3><div className="flex justify-between text-[10px] text-[#9b9ca4]"><span>{t("progress")}</span><strong className="text-[#595a62]">{project.progress}%</strong></div><div className="mt-1.75 h-1.25 overflow-hidden rounded-full bg-[#eeeef1]" role="progressbar" aria-valuenow={project.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${t("progress")} ${project.name[lang]}`}><div className={`h-full rounded-full ${color.bar}`} style={{ width: `${project.progress}%` }} /></div><div className="mt-4.5 flex items-center gap-2 border-t border-[#f0f0f3] pt-3.25 text-[9px] text-[#898a93]"><div className={`${isArabic ? "mr-auto" : "ml-auto"} flex`}>{project.members.map((member, index) => <span key={`${member}-${index}`} className={isArabic ? "-ml-1.5" : "-mr-1.5"}><span className="grid h-5.75 w-5.75 place-items-center rounded-full border-2 border-white bg-[#e4e0d8] text-[7px] font-bold text-[#5f5b55]">{member}</span></span>)}</div><span className="flex shrink-0 items-center gap-1"><Check size={14} />{project.tasks}</span><span className="flex shrink-0 items-center gap-1"><CalendarDays size={14} />{project.due[lang]}</span></div></article>; })}</div>
//           </section>

//           {/* Tasks */}
//           <section className="mt-7.75"><div className="mb-3.75 flex items-end justify-between gap-3"><div><h2 className="mb-1 text-[17px] font-bold tracking-tight">{t("myTasks")}</h2><p className="text-[11px] text-[#96979f]">{t("tasksSubtitle")}</p></div><Link href="/tasks" className="flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-[#47759c] hover:text-[#2eb5bc]">{t("viewAll")}<DirectionArrow size={15} /></Link></div>
//             <div className="overflow-hidden rounded-[14px] border border-[#e8e8ed] bg-white">{visibleTasks.length ? visibleTasks.map((task, index) => { const project = projectById(task.projectId); const priorityStyle = task.priority === "high" ? "bg-[#fff0ee] text-[#cf635b]" : task.priority === "medium" ? "bg-[#fff5e7] text-[#c17a36]" : "bg-[#edf7ef] text-[#5d986b]"; const priorityText = task.priority === "high" ? t("high") : task.priority === "medium" ? t("medium") : t("low"); return <div key={task.id} className={`grid min-h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:grid-cols-[auto_minmax(0,1fr)_100px_68px_auto] ${index !== visibleTasks.length - 1 ? "border-b border-[#f0f0f3]" : ""}`}><button aria-label={`${task.checked ? t("taskActionReopen") : t("taskActionComplete")} ${task.title[lang]}`} aria-pressed={task.checked} onClick={() => toggleTask(task.id)} className={`grid h-4.5 w-4.5 place-items-center rounded-[5px] border-[1.5px] transition ${task.checked ? "border-[#2eb5bc] bg-[#2eb5bc] text-white" : "border-[#ccccd4] bg-white hover:border-[#2eb5bc]"}`}>{task.checked && <Check size={13} />}</button><div className="min-w-0"><strong className={`block text-xs font-semibold ${task.checked ? "text-[#a5a6ac] line-through" : "text-[#3d3e44]"}`}>{task.title[lang]}</strong><span className="mt-1.25 flex items-center gap-1.5 text-[9px] text-[#999aa2]"><i className={`h-1.25 w-1.25 rounded-full ${projectColors[project.color].dot}`} />{project.name[lang]}</span></div><span className="hidden items-center gap-1.5 text-[9px] text-[#8c8d95] sm:flex"><CalendarDays size={14} />{task.date[lang]}</span><span className={`justify-self-start rounded-full px-2 py-1 text-[8px] font-semibold ${priorityStyle}`}>{priorityText}</span><button aria-label={`${t("taskOptions")}: ${task.title[lang]}`} className="hidden text-[#a2a3aa] hover:text-[#47759c] sm:block"><MoreHorizontal size={19} /></button></div>; }) : <div className="p-7 text-center text-xs text-[#92939a]">{t("empty")}.</div>}</div>
//           </section>

//           {/* Statistics directly below My Tasks */}
//           <section className="mt-8 pb-8"><div className="mb-3.75"><h2 className="mb-1 text-[17px] font-bold tracking-tight">{t("statistics")}</h2><p className="text-[11px] text-[#96979f]">{t("statisticsSubtitle")}</p></div>
//             <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
//               <StatCard title={t("totalTasks")} value={totalCount} icon={<ListTodo size={19} />} iconClass="bg-[#edf3f7] text-[#47759c]" detail={`${completedCount} ${t("tasksCompletedOf")}`} />
//               <StatCard title={t("completed")} value={completedCount} icon={<CircleCheck size={19} />} iconClass="bg-[#e8f8f8] text-[#238e94]" detail={`${completionRate}%`} />
//               <StatCard title={t("inProgress")} value={inProgressCount} icon={<Timer size={19} />} iconClass="bg-[#fff5e7] text-[#c17a36]" detail={isArabic ? "مهام لم تكتمل بعد" : "Tasks not completed yet"} />
//               <div className="rounded-[14px] border border-[#e8e8ed] bg-white p-4.25 shadow-sm shadow-black/3"><div className="flex items-center justify-between"><span className="text-[11px] font-medium text-[#858592]">{t("completionRate")}</span><span className="grid h-8.5 w-8.5 place-items-center rounded-[9px] bg-[#f0f9fa] text-[#2eb5bc]"><ChartNoAxesCombined size={19} /></span></div><div className="mt-3 flex items-end justify-between"><strong className="text-[27px] font-bold tracking-tight">{completionRate}%</strong><span className="text-[10px] text-[#96979f]">{completedCount}/{totalCount}</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#eeeef1]"><div className="h-full rounded-full bg-[#2eb5bc] transition-all" style={{ width: `${completionRate}%` }} /></div></div>
//             </div>
//           </section>
//     </div>
//   );
// }


// function StatCard({ title, value, icon, iconClass, detail }: { title: string; value: number; icon: ReactNode; iconClass: string; detail: string }) {
//   return <article className="rounded-[14px] border border-[#e8e8ed] bg-white p-4.25 shadow-sm shadow-black/3"><div className="flex items-center justify-between"><span className="text-[11px] font-medium text-[#858592]">{title}</span><span className={`grid h-8.5 w-8.5 place-items-center rounded-[9px] ${iconClass}`}>{icon}</span></div><div className="mt-3 flex items-end justify-between gap-2"><strong className="text-[27px] font-bold tracking-tight">{value}</strong><span className="text-[10px] text-[#96979f]">{detail}</span></div></article>;
// }


"use client";


import { useMemo, useState, type ReactNode } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import {
  Check, Folder, CalendarDays, Sparkles, ArrowLeft, ArrowRight, Clock,
  MoreHorizontal, ListTodo, CircleCheck, Timer, ChartNoAxesCombined,
} from "lucide-react";
import { useDashboardLayout } from "@/app/components/DashboardLayout";

type Lang = "ar" | "en";
type Project = {
  id: string; name: { ar: string; en: string }; progress: number; color: "blue" | "violet" | "orange";
  tasks: string; due: { ar: string; en: string }; members: string[];
};
type Task = {
  id: string; title: { ar: string; en: string }; projectId: string; date: { ar: string; en: string };
  priority: "high" | "medium" | "low"; checked: boolean;
};

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
    tasksCompletedOf: "من المهام مكتملة", language: "English", languageAria: "التبديل إلى الإنجليزية",
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
    tasksCompletedOf: "tasks completed", language: "العربية", languageAria: "Switch to Arabic",
    taskActionComplete: "Complete", taskActionReopen: "Reopen", taskOptions: "Task options", projectOptions: "Project options",
    sidebarStats: "QUICK STATS", logout: "Log out", logoutAria: "Log out of your account",
    darkMode: "Dark mode", lightMode: "Light mode", themeAria: "Toggle color theme",
  },
} satisfies Record<Lang, Record<string, string>>;

const projects: Project[] = [
  { id: "website", name: { ar: "إعادة تصميم الموقع", en: "Website redesign" }, progress: 72, color: "blue", tasks: "18/25", due: { ar: "24 مايو", en: "May 24" }, members: ["س", "أ", "م"] },
  { id: "mobile", name: { ar: "تطبيق الهاتف", en: "Mobile app" }, progress: 48, color: "violet", tasks: "12/28", due: { ar: "02 يونيو", en: "Jun 02" }, members: ["أ", "ت"] },
  { id: "campaign", name: { ar: "حملة الربع الثاني", en: "Q2 campaign" }, progress: 86, color: "orange", tasks: "24/30", due: { ar: "18 مايو", en: "May 18" }, members: ["م", "س", "ت"] },
];

const initialTasks: Task[] = [
  { id: "homepage", title: { ar: "إنهاء مخططات الصفحة الرئيسية", en: "Finalize homepage wireframes" }, projectId: "website", date: { ar: "اليوم", en: "Today" }, priority: "high", checked: false },
  { id: "interviews", title: { ar: "مراجعة ملاحظات مقابلات المستخدمين", en: "Review user interview notes" }, projectId: "mobile", date: { ar: "اليوم", en: "Today" }, priority: "medium", checked: false },
  { id: "report", title: { ar: "إعداد تقرير أداء الحملة", en: "Prepare campaign performance report" }, projectId: "campaign", date: { ar: "غداً", en: "Tomorrow" }, priority: "low", checked: false },
  { id: "design-system", title: { ar: "تحديث مكوّنات نظام التصميم", en: "Update design system components" }, projectId: "website", date: { ar: "17 مايو", en: "May 17" }, priority: "medium", checked: true },
];

const projectColors = {
  blue: { icon: "bg-[#edf3f7] text-[#47759c]", bar: "bg-[#47759c]", dot: "bg-[#47759c]" },
  violet: { icon: "bg-[#e8f8f8] text-[#2eb5bc]", bar: "bg-[#2eb5bc]", dot: "bg-[#2eb5bc]" },
  orange: { icon: "bg-[#edf7f8] text-[#6fa6b4]", bar: "bg-[#6fa6b4]", dot: "bg-[#6fa6b4]" },
};

function Avatar({ initials, light = false, darkMode = false }: { initials: string; light?: boolean; darkMode?: boolean }) {
  return <span className={`grid h-8.5 w-8.5 shrink-0 place-items-center rounded-full border-2 ${darkMode ? "border-slate-800" : "border-white"} text-[10px] font-bold ${light ? `bg-[#e4e0d8] text-[#5f5b55] ${darkMode ? "text-slate-700" : ""}` : "bg-[#353550] text-white"}`}>{initials}</span>;
}

export default function Home() {
  // Read the authenticated user from the existing login/authentication context.
  const { user, isLoading, isAuthenticated } = useAuth();
  const { lang, isArabic, darkMode } = useDashboardLayout();
  const [taskList, setTaskList] = useState(initialTasks);
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
  const projectById = (id: string) => projects.find((project) => project.id === id)!;

  const visibleTasks = useMemo(() => taskList, [taskList]);

  const completedCount = taskList.filter((task) => task.checked).length;
  const totalCount = taskList.length;
  const completionRate = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
  const inProgressCount = totalCount - completedCount;

  const toggleTask = (id: string) => setTaskList((current) =>
    current.map((task) => task.id === id ? { ...task, checked: !task.checked } : task)
  );

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

          {/* Active projects: shows project progress, assigned members, task counts, and due dates. */}          
          <section className="mt-8"><div className="mb-3.75 flex items-end justify-between gap-3"><div><h2 className="mb-1 text-[17px] font-bold tracking-tight">{t("activeProjects")}</h2><p className={`text-[11px]  ${darkMode ? "text-slate-400" : "text-[#96979f]"}`}>{t("projectsSubtitle")}</p></div><Link href="/projects" className="flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-[#47759c] hover:text-[#2eb5bc]">{t("viewAll")}<DirectionArrow size={15} /></Link></div>
            <div className="grid grid-cols-1 gap-3.75 md:grid-cols-2 xl:grid-cols-3">{projects.map((project) => { const color = projectColors[project.color]; return <article key={project.id} className={`min-w-0 rounded-[14px] border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-[#e8e8ed]"} p-4.25 shadow-sm shadow-black/3 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5`}><div className="flex items-center justify-between"><span className={`grid h-8.5 w-8.5 place-items-center rounded-[9px] ${color.icon}`}><Folder size={19} /></span><button aria-label={`${t("projectOptions")}: ${project.name[lang]}`} className={`${darkMode ? "text-slate-400" : "text-[#a2a3aa]"}  hover:text-[#47759c]`}><MoreHorizontal size={19} /></button></div><h3 className="mb-4.25 mt-3.5 text-sm font-bold">{project.name[lang]}</h3><div className={`flex justify-between text-[10px] ${darkMode ? "text-slate-400" : "text-[#9b9ca4]"} `}><span>{t("progress")}</span><strong className={`${darkMode ? "text-slate-200" : "text-[#595a62] " }`}>{project.progress}%</strong></div><div className={`mt-1.75 h-1.25 overflow-hidden rounded-full ${darkMode ? "bg-slate-700" : "bg-[#eeeef1]"}`} role="progressbar" aria-valuenow={project.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${t("progress")} ${project.name[lang]}`}><div className={`h-full rounded-full ${color.bar}`} style={{ width: `${project.progress}%` }} /></div><div className={`mt-4.5 flex items-center gap-2 border-t pt-3.25 text-[9px] ${darkMode ? "text-slate-400 border-slate-700" : "text-[#999aa2]" }`}><div className={`${isArabic ? "mr-auto" : "ml-auto"} flex`}>{project.members.map((member, index) => <span key={`${member}-${index}`} className={isArabic ? "-ml-1.5" : "-mr-1.5"}><span className={`grid h-5.75 w-5.75 place-items-center rounded-full border-2  bg-[#e4e0d8] text-[7px] font-bold ${darkMode ? "border-slate-800 text-slate-700 " : "border-white text-[#5f5b55]"}`}>{member}</span></span>)}</div><span className="flex shrink-0 items-center gap-1"><Check size={14} />{project.tasks}</span><span className="flex shrink-0 items-center gap-1"><CalendarDays size={14} />{project.due[lang]}</span></div></article>; })}</div>
          </section>

          {/* My tasks: lists the current sample tasks and lets the user mark each task complete or reopen it. */}
          <section className="mt-7.75"><div className="mb-3.75 flex items-end justify-between gap-3"><div><h2 className="mb-1 text-[17px] font-bold tracking-tight">{t("myTasks")}</h2><p className={`text-[11px] ${darkMode ? "text-slate-400" : "text-[#96979f]"}`}>{t("tasksSubtitle")}</p></div><Link href="/tasks" className="flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-[#47759c] hover:text-[#2eb5bc]">{t("viewAll")}<DirectionArrow size={15} /></Link></div>
            <div className={`overflow-hidden rounded-[14px] border ${darkMode ? "border-slate-700 bg-slate-800" : "border-[#e8e8ed] bg-white"}`}>{visibleTasks.length ? visibleTasks.map((task, index) => { const project = projectById(task.projectId); const priorityStyle = task.priority === "high" ? "bg-[#fff0ee] text-[#cf635b]" : task.priority === "medium" ? "bg-[#fff5e7] text-[#c17a36]" : "bg-[#edf7ef] text-[#5d986b]"; const priorityText = task.priority === "high" ? t("high") : task.priority === "medium" ? t("medium") : t("low"); return <div key={task.id} className={`grid min-h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:grid-cols-[auto_minmax(0,1fr)_100px_68px_auto] ${index !== visibleTasks.length - 1 ? `border-b ${darkMode ? "border-slate-700" : "border-[#f0f0f3] "} ` : ""}`}><button aria-label={`${task.checked ? t("taskActionReopen") : t("taskActionComplete")} ${task.title[lang]}`} aria-pressed={task.checked} onClick={() => toggleTask(task.id)} className={`grid h-4.5 w-4.5 place-items-center rounded-[5px] border-[1.5px] transition ${task.checked ? "border-[#2eb5bc] bg-[#2eb5bc] text-white" : `${darkMode ? "border-slate-600 bg-slate-800" : "border-[#ccccd4] bg-white" } hover:border-[#2eb5bc]`}`}>{task.checked && <Check size={13} />}</button><div className="min-w-0"><strong className={`block text-xs font-semibold ${task.checked ? `text-[#a5a6ac] ${darkMode ? "text-slate-500" : ""} line-through` : `${darkMode ? "text-slate-100" : "text-[#3d3e44]"}`}`}>{task.title[lang]}</strong><span className={`mt-1.25 flex items-center gap-1.5 text-[9px] ${darkMode ? "text-slate-400" : "text-[#999aa2]" }`}><i className={`h-1.25 w-1.25 rounded-full ${projectColors[project.color].dot}`} />{project.name[lang]}</span></div><span className={`hidden items-center gap-1.5 text-[9px] sm:flex ${darkMode ? "text-slate-400" : "text-[#8c8d95]"}`}><CalendarDays size={14} />{task.date[lang]}</span><span className={`justify-self-start rounded-full px-2 py-1 text-[8px] font-semibold ${priorityStyle}`}>{priorityText}</span><button aria-label={`${t("taskOptions")}: ${task.title[lang]}`} className={`hidden sm:block ${darkMode ? "text-slate-400" : "text-[#a2a3aa]"} hover:text-[#47759c]`}><MoreHorizontal size={19} /></button></div>; }) : <div className={`p-7 text-center text-xs ${darkMode ? "text-slate-400" : "text-[#92939a]"}`}>{t("empty")}.</div>}</div>
          </section>

          {/* Statistics: summarizes total, completed, unfinished tasks, and the completion percentage. */}
          <section className="mt-8 pb-8"><div className="mb-3.75"><h2 className="mb-1 text-[17px] font-bold tracking-tight">{t("statistics")}</h2><p className={`text-[11px] ${darkMode ? "text-slate-400" : "text-[#96979f]"}`}>{t("statisticsSubtitle")}</p></div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard title={t("totalTasks")} value={totalCount} icon={<ListTodo size={19} />} iconClass="bg-[#edf3f7] text-[#47759c]" detail={`${completedCount} ${t("tasksCompletedOf")}`} darkMode={darkMode} />
              <StatCard title={t("completed")} value={completedCount} icon={<CircleCheck size={19} />} iconClass="bg-[#e8f8f8] text-[#238e94]" detail={`${completionRate}%`} darkMode={darkMode} />
              <StatCard title={t("inProgress")} value={inProgressCount} icon={<Timer size={19} />} iconClass="bg-[#fff5e7] text-[#c17a36]" detail={isArabic ? "مهام لم تكتمل بعد" : "Tasks not completed yet"} darkMode={darkMode} />
              <div className={`rounded-[14px] border p-4.25 shadow-sm shadow-black/3 ${darkMode ? "border-slate-700 bg-slate-800" : "border-[#e8e8ed] bg-white"}`}><div className="flex items-center justify-between"><span className={`text-[11px] font-medium ${darkMode ? "text-slate-300" : "text-[#858592]"}`}>{t("completionRate")}</span><span className={`grid h-8.5 w-8.5 place-items-center rounded-[9px] ${darkMode ? "bg-teal-950/60 text-teal-300" : "bg-[#f0f9fa] text-[#2eb5bc]"}`}><ChartNoAxesCombined size={19} /></span></div><div className="mt-3 flex items-end justify-between"><strong className="text-[27px] font-bold tracking-tight">{completionRate}%</strong><span className={`text-[10px] ${darkMode ? "text-slate-400" : "text-[#96979f]"}`}>{completedCount}/{totalCount}</span></div><div className={`mt-3 h-1.5 overflow-hidden rounded-full ${darkMode ? "bg-slate-700" : "bg-[#eeeef1]"}`}><div className="h-full rounded-full bg-[#2eb5bc] transition-all" style={{ width: `${completionRate}%` }} /></div></div>
            </div>
          </section>
    </div>
  );
}


// Reusable statistic card used by the dashboard's summary section.
function StatCard({ title, value, icon, iconClass, detail, darkMode }: { title: string; value: number; icon: ReactNode; iconClass: string; detail: string; darkMode: boolean }) {
  return <article className={`rounded-[14px] border p-4.25 shadow-sm shadow-black/3 ${darkMode ? "border-slate-700 bg-slate-800" : "border-[#e8e8ed] bg-white"}`}><div className="flex items-center justify-between"><span className={`text-[11px] font-medium ${darkMode ? "text-slate-300" : "text-[#858592]"}`}>{title}</span><span className={`grid h-8.5 w-8.5 place-items-center rounded-[9px] ${iconClass}`}>{icon}</span></div><div className="mt-3 flex items-end justify-between gap-2"><strong className="text-[27px] font-bold tracking-tight">{value}</strong><span className={`text-[10px] ${darkMode ? "text-slate-400" : "text-[#96979f]"}`}>{detail}</span></div></article>;
}








// "use client";


// import { useMemo, useState, type ReactNode } from "react";
// import { useAuth } from "@/app/context/AuthContext";
// import Link from "next/link";
// import {
//   Check, Folder, CalendarDays, Sparkles, ArrowLeft, ArrowRight, Clock,
//   MoreHorizontal, ListTodo, CircleCheck, Timer, ChartNoAxesCombined,
// } from "lucide-react";
// import { useDashboardLayout } from "@/app/components/DashboardLayout";

// type Lang = "ar" | "en";
// type Project = {
//   id: string; name: { ar: string; en: string }; progress: number; color: "blue" | "violet" | "orange";
//   tasks: string; due: { ar: string; en: string }; members: string[];
// };
// type Task = {
//   id: string; title: { ar: string; en: string }; projectId: string; date: { ar: string; en: string };
//   priority: "high" | "medium" | "low"; checked: boolean;
// };

// const copy = {
//   ar: {
//     overview: "نظرة عامة", myTasks: "مهامي", projects: "المشاريع", calendar: "التقويم", team: "الفريق",
//     workspace: "مساحة العمل", upgradeTitle: "استفد أكثر مع الباقة الاحترافية",
//     upgradeText: "احصل على مساعدة غير محدودة بالذكاء الاصطناعي وتقارير متقدمة.", upgradeButton: "عرض الباقات",
//     search: "ابحث عن أي شيء...", notifications: "الإشعارات", newProject: "مشروع جديد",
//     date: "", greeting: "صباح الخير", welcome: "إليك آخر المستجدات في مشاريعك اليوم.",
//     online: "7 من أعضاء الفريق متصلون", composerTitle: "ابدأ مشروعاً جديداً بالذكاء الاصطناعي",
//     composerText: "أخبرنا بما تخطط له وسننشئ المهام المناسبة.", notNow: "ليس الآن", ai: "NTRA",
//     aiTitle: "لنجعل يومك أكثر إنتاجية", aiText: "وجدت 3 مهام تحتاج إلى اهتمامك، وأعددت خطة مقترحة لتنظيم يومك.",
//     plan: "إضافة مهام جديده", priorities: "3 أولويات", hours: "4.5 ساعات", activeProjects: "المشاريع النشطة",
//     projectsSubtitle: "تابع تقدم فريقك بسهولة", viewAll: "عرض الكل", progress: "التقدم", tasksSubtitle: "أولوياتك خلال الأيام القادمة",
//     high: "عالية", medium: "متوسطة", low: "منخفضة", today: "اليوم", tomorrow: "غداً",
//     empty: "لا توجد مهام تطابق", statistics: "الإحصائيات", statisticsSubtitle: "ملخص إنجازاتك ومهامك",
//     totalTasks: "إجمالي المهام", completed: "مهام مكتملة", inProgress: "قيد التنفيذ", completionRate: "معدل الإنجاز",
//     tasksCompletedOf: "من المهام مكتملة", language: "English", languageAria: "التبديل إلى الإنجليزية",
//     taskActionComplete: "إكمال", taskActionReopen: "إعادة فتح", taskOptions: "خيارات المهمة", projectOptions: "خيارات المشروع",
//     sidebarStats: "ملخص سريع", logout: "تسجيل الخروج", logoutAria: "تسجيل الخروج من الحساب",
//     darkMode: "الوضع الداكن", lightMode: "الوضع الفاتح", themeAria: "تغيير المظهر",
//   },
//   en: {
//     overview: "Overview", myTasks: "My Tasks", projects: "Projects", calendar: "Calendar", team: "Team",
//     workspace: "WORKSPACE", upgradeTitle: "Get more with Pro", upgradeText: "Unlock unlimited AI assistance and advanced reports.",
//     upgradeButton: "Explore plans", search: "Search anything...", notifications: "Notifications", newProject: "New project",
//     date: "", greeting: "Good morning", welcome: "Here’s the latest update on your projects today.",
//     online: "7 team members online", composerTitle: "Start a new project with AI", composerText: "Tell us what you’re planning and we’ll create the right tasks.",
//     notNow: "Not now", ai: "NTRA", aiTitle: "Make your day more productive", aiText: "You have 3 tasks that need attention. We prepared a suggested plan for your day.",
//     plan: "Add New Tasks", priorities: "3 priorities", hours: "4.5 hours", activeProjects: "Active projects",
//     projectsSubtitle: "Track your team’s progress", viewAll: "View all", progress: "Progress", tasksSubtitle: "Your priorities for the coming days",
//     high: "High", medium: "Medium", low: "Low", today: "Today", tomorrow: "Tomorrow",
//     empty: "No tasks match", statistics: "Statistics", statisticsSubtitle: "A summary of your tasks and progress",
//     totalTasks: "Total tasks", completed: "Completed", inProgress: "In progress", completionRate: "Completion rate",
//     tasksCompletedOf: "tasks completed", language: "العربية", languageAria: "Switch to Arabic",
//     taskActionComplete: "Complete", taskActionReopen: "Reopen", taskOptions: "Task options", projectOptions: "Project options",
//     sidebarStats: "QUICK STATS", logout: "Log out", logoutAria: "Log out of your account",
//     darkMode: "Dark mode", lightMode: "Light mode", themeAria: "Toggle color theme",
//   },
// } satisfies Record<Lang, Record<string, string>>;

// const projects: Project[] = [
//   { id: "website", name: { ar: "إعادة تصميم الموقع", en: "Website redesign" }, progress: 72, color: "blue", tasks: "18/25", due: { ar: "24 مايو", en: "May 24" }, members: ["س", "أ", "م"] },
//   { id: "mobile", name: { ar: "تطبيق الهاتف", en: "Mobile app" }, progress: 48, color: "violet", tasks: "12/28", due: { ar: "02 يونيو", en: "Jun 02" }, members: ["أ", "ت"] },
//   { id: "campaign", name: { ar: "حملة الربع الثاني", en: "Q2 campaign" }, progress: 86, color: "orange", tasks: "24/30", due: { ar: "18 مايو", en: "May 18" }, members: ["م", "س", "ت"] },
// ];

// const initialTasks: Task[] = [
//   { id: "homepage", title: { ar: "إنهاء مخططات الصفحة الرئيسية", en: "Finalize homepage wireframes" }, projectId: "website", date: { ar: "اليوم", en: "Today" }, priority: "high", checked: false },
//   { id: "interviews", title: { ar: "مراجعة ملاحظات مقابلات المستخدمين", en: "Review user interview notes" }, projectId: "mobile", date: { ar: "اليوم", en: "Today" }, priority: "medium", checked: false },
//   { id: "report", title: { ar: "إعداد تقرير أداء الحملة", en: "Prepare campaign performance report" }, projectId: "campaign", date: { ar: "غداً", en: "Tomorrow" }, priority: "low", checked: false },
//   { id: "design-system", title: { ar: "تحديث مكوّنات نظام التصميم", en: "Update design system components" }, projectId: "website", date: { ar: "17 مايو", en: "May 17" }, priority: "medium", checked: true },
// ];

// const projectColors = {
//   blue: { icon: "bg-[#edf3f7] text-[#47759c]", bar: "bg-[#47759c]", dot: "bg-[#47759c]" },
//   violet: { icon: "bg-[#e8f8f8] text-[#2eb5bc]", bar: "bg-[#2eb5bc]", dot: "bg-[#2eb5bc]" },
//   orange: { icon: "bg-[#edf7f8] text-[#6fa6b4]", bar: "bg-[#6fa6b4]", dot: "bg-[#6fa6b4]" },
// };

// function Avatar({ initials, light = false }: { initials: string; light?: boolean }) {
//   return <span className={`grid h-8.5 w-8.5 shrink-0 place-items-center rounded-full border-2 border-white text-[10px] font-bold ${light ? "bg-[#e4e0d8] text-[#5f5b55]" : "bg-[#353550] text-white"}`}>{initials}</span>;
// }

// export default function Home() {
//   // Read the authenticated user from the existing login/authentication context.
//   const { user, isLoading, isAuthenticated } = useAuth();
//   const { lang, isArabic } = useDashboardLayout();
//   const [taskList, setTaskList] = useState(initialTasks);
//   // Build the date from the current system date and format it for the selected language.
//   const currentDate = new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-US", {
//     weekday: "long",
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   }).format(new Date());

//   // Choose a greeting based on the current local time, then display the logged-in user's name.
//   const currentHour = new Date().getHours();
//   const greetingKey =
//     currentHour < 12 ? "morning" : currentHour < 18 ? "afternoon" : "evening";
//   const greeting = {
//     morning: isArabic ? "صباح الخير" : "Good morning",
//     afternoon: isArabic ? "مساء الخير" : "Good afternoon",
//     evening: isArabic ? "مساء الخير" : "Good evening",
//   }[greetingKey];
//   const displayName = isLoading ? "" : isAuthenticated ? user?.fullName?.trim() || (isArabic ? "المستخدم" : "there") : isArabic ? "المستخدم" : "there";

//   const t = (key: keyof typeof copy.ar) => copy[lang][key];
//   const DirectionArrow = isArabic ? ArrowLeft : ArrowRight;
//   const projectById = (id: string) => projects.find((project) => project.id === id)!;

//   const visibleTasks = useMemo(() => taskList, [taskList]);

//   const completedCount = taskList.filter((task) => task.checked).length;
//   const totalCount = taskList.length;
//   const completionRate = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
//   const inProgressCount = totalCount - completedCount;

//   const toggleTask = (id: string) => setTaskList((current) =>
//     current.map((task) => task.id === id ? { ...task, checked: !task.checked } : task)
//   );

//   return (
//     <div className="space-y-0">
//           {/* Dashboard header: live date, time-sensitive greeting, and the logged-in user's name. */}
//           <section className="flex items-start justify-between gap-4"><div><p className="mb-2 text-[10px] font-bold tracking-[1px] text-[#8f9098]">{currentDate}</p><h1 className="mb-2 text-[23px] font-bold leading-tight tracking-tight sm:text-[27px]">{greeting}, {displayName}</h1><p className="text-[13px] text-[#83848c]">{t("welcome")}</p></div>
//             <div className="hidden shrink-0 text-start text-[10px] text-[#96979f] sm:block"><div className="mb-1 flex"><span className={isArabic ? "-ml-1.75" : "-mr-1.75"}><Avatar initials="A" light /></span><span className={isArabic ? "-ml-1.75" : "-mr-1.75"}><Avatar initials="M" light /></span><Avatar initials="T" light /><span className="grid h-8.5 w-8.5 place-items-center rounded-full border-2 border-white bg-[#f0f0f4] text-[10px] text-[#757680]">+4</span></div><span>{t("online")}</span></div>
//           </section>


//           {/* AI productivity banner: highlights the suggested plan and quick action. */}
//           <section className="relative mt-7.25 grid min-h-48.5 overflow-hidden rounded-[18px] bg-linear-to-l from-[#2eb5bc] via-[#47759c] to-[#345f82] text-white shadow-xl shadow-[#47759c]/15 md:grid-cols-[1.4fr_1fr]">
//             <div className="relative z-2 flex items-start gap-3.5 p-5 sm:p-7"><span className="grid h-9.5 w-9.5 shrink-0 place-items-center rounded-[11px] bg-linear-to-br from-[#55cbd0] to-[#2eb5bc] shadow-inner shadow-white/20"><Sparkles size={20} /></span><div><span className="text-[9px] font-bold tracking-[1.1px] text-[#bff3f1]">{t("ai")}</span><h2 className="mb-2 mt-1.5 text-lg font-bold tracking-tight sm:text-xl">{t("aiTitle")}</h2><p className="mb-4 max-w-120 text-xs leading-relaxed text-[#d9eef2]">{t("aiText")}</p><button className="flex h-8.5 items-center gap-2 rounded-[9px] bg-white px-4 text-xs font-semibold text-[#47759c] transition hover:bg-[#f0fbfb]">{t("plan")}<DirectionArrow size={16} /></button></div></div>
//             <div className="relative hidden min-h-48.5 overflow-hidden md:block"><div className={`absolute -top-8.75 h-65 w-65 rounded-full border border-white ${isArabic ? "right-[5%]" : "left-[5%]"}`} /><div className={`absolute top-[10%] h-37.5 w-37.5 rounded-full bg-[#6de2df]/20 blur-lg ${isArabic ? "right-[10%]" : "left-[10%]"}`} /><div className="absolute bottom-[-20%] left-[15%] h-20 w-20 rounded-full bg-[#b8ecf0]/15 blur-lg" /><div className={`absolute top-13.75 z-2 grid h-19 w-19 rotate-[-7deg] place-items-center rounded-[25px] bg-linear-to-br from-[#60d0d4]/60 to-[#47759c]/80 text-[#e4ffff] shadow-xl shadow-[#274e66]/30 ${isArabic ? "right-1/4" : "left-1/4"}`}><Sparkles size={34} /></div><span className={`absolute top-6.5 z-3 flex items-center gap-1.5 rounded-lg border border-white bg-white px-2.5 py-2 text-[9px] text-[#eeeefe] backdrop-blur-md ${isArabic ? "right-[8%]" : "left-[8%]"}`}><Check size={13} />{t("priorities")}</span><span className={`absolute bottom-6.25 z-3 flex items-center gap-1.5 rounded-lg border border-white bg-white px-2.5 py-2 text-[9px] text-[#eeeefe] backdrop-blur-md ${isArabic ? "left-[16%]" : "right-[16%]"}`}><Clock size={13} />{t("hours")}</span></div>
//           </section>

//           {/* Active projects: shows project progress, assigned members, task counts, and due dates. */}          
//           <section className="mt-8"><div className="mb-3.75 flex items-end justify-between gap-3"><div><h2 className="mb-1 text-[17px] font-bold tracking-tight">{t("activeProjects")}</h2><p className="text-[11px] text-[#96979f]">{t("projectsSubtitle")}</p></div><Link href="/projects" className="flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-[#47759c] hover:text-[#2eb5bc]">{t("viewAll")}<DirectionArrow size={15} /></Link></div>
//             <div className="grid grid-cols-1 gap-3.75 md:grid-cols-2 xl:grid-cols-3">{projects.map((project) => { const color = projectColors[project.color]; return <article key={project.id} className="min-w-0 rounded-[14px] border border-[#e8e8ed] bg-white p-4.25 shadow-sm shadow-black/3 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5"><div className="flex items-center justify-between"><span className={`grid h-8.5 w-8.5 place-items-center rounded-[9px] ${color.icon}`}><Folder size={19} /></span><button aria-label={`${t("projectOptions")}: ${project.name[lang]}`} className="text-[#a2a3aa] hover:text-[#47759c]"><MoreHorizontal size={19} /></button></div><h3 className="mb-4.25 mt-3.5 text-sm font-bold">{project.name[lang]}</h3><div className="flex justify-between text-[10px] text-[#9b9ca4]"><span>{t("progress")}</span><strong className="text-[#595a62]">{project.progress}%</strong></div><div className="mt-1.75 h-1.25 overflow-hidden rounded-full bg-[#eeeef1]" role="progressbar" aria-valuenow={project.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${t("progress")} ${project.name[lang]}`}><div className={`h-full rounded-full ${color.bar}`} style={{ width: `${project.progress}%` }} /></div><div className="mt-4.5 flex items-center gap-2 border-t border-[#f0f0f3] pt-3.25 text-[9px] text-[#898a93]"><div className={`${isArabic ? "mr-auto" : "ml-auto"} flex`}>{project.members.map((member, index) => <span key={`${member}-${index}`} className={isArabic ? "-ml-1.5" : "-mr-1.5"}><span className="grid h-5.75 w-5.75 place-items-center rounded-full border-2 border-white bg-[#e4e0d8] text-[7px] font-bold text-[#5f5b55]">{member}</span></span>)}</div><span className="flex shrink-0 items-center gap-1"><Check size={14} />{project.tasks}</span><span className="flex shrink-0 items-center gap-1"><CalendarDays size={14} />{project.due[lang]}</span></div></article>; })}</div>
//           </section>

//           {/* My tasks: lists the current sample tasks and lets the user mark each task complete or reopen it. */}
//           <section className="mt-7.75"><div className="mb-3.75 flex items-end justify-between gap-3"><div><h2 className="mb-1 text-[17px] font-bold tracking-tight">{t("myTasks")}</h2><p className="text-[11px] text-[#96979f]">{t("tasksSubtitle")}</p></div><Link href="/tasks" className="flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-[#47759c] hover:text-[#2eb5bc]">{t("viewAll")}<DirectionArrow size={15} /></Link></div>
//             <div className="overflow-hidden rounded-[14px] border border-[#e8e8ed] bg-white">{visibleTasks.length ? visibleTasks.map((task, index) => { const project = projectById(task.projectId); const priorityStyle = task.priority === "high" ? "bg-[#fff0ee] text-[#cf635b]" : task.priority === "medium" ? "bg-[#fff5e7] text-[#c17a36]" : "bg-[#edf7ef] text-[#5d986b]"; const priorityText = task.priority === "high" ? t("high") : task.priority === "medium" ? t("medium") : t("low"); return <div key={task.id} className={`grid min-h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:grid-cols-[auto_minmax(0,1fr)_100px_68px_auto] ${index !== visibleTasks.length - 1 ? "border-b border-[#f0f0f3]" : ""}`}><button aria-label={`${task.checked ? t("taskActionReopen") : t("taskActionComplete")} ${task.title[lang]}`} aria-pressed={task.checked} onClick={() => toggleTask(task.id)} className={`grid h-4.5 w-4.5 place-items-center rounded-[5px] border-[1.5px] transition ${task.checked ? "border-[#2eb5bc] bg-[#2eb5bc] text-white" : "border-[#ccccd4] bg-white hover:border-[#2eb5bc]"}`}>{task.checked && <Check size={13} />}</button><div className="min-w-0"><strong className={`block text-xs font-semibold ${task.checked ? "text-[#a5a6ac] line-through" : "text-[#3d3e44]"}`}>{task.title[lang]}</strong><span className="mt-1.25 flex items-center gap-1.5 text-[9px] text-[#999aa2]"><i className={`h-1.25 w-1.25 rounded-full ${projectColors[project.color].dot}`} />{project.name[lang]}</span></div><span className="hidden items-center gap-1.5 text-[9px] text-[#8c8d95] sm:flex"><CalendarDays size={14} />{task.date[lang]}</span><span className={`justify-self-start rounded-full px-2 py-1 text-[8px] font-semibold ${priorityStyle}`}>{priorityText}</span><button aria-label={`${t("taskOptions")}: ${task.title[lang]}`} className="hidden text-[#a2a3aa] hover:text-[#47759c] sm:block"><MoreHorizontal size={19} /></button></div>; }) : <div className="p-7 text-center text-xs text-[#92939a]">{t("empty")}.</div>}</div>
//           </section>

//           {/* Statistics: summarizes total, completed, unfinished tasks, and the completion percentage. */}
//           <section className="mt-8 pb-8"><div className="mb-3.75"><h2 className="mb-1 text-[17px] font-bold tracking-tight">{t("statistics")}</h2><p className="text-[11px] text-[#96979f]">{t("statisticsSubtitle")}</p></div>
//             <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
//               <StatCard title={t("totalTasks")} value={totalCount} icon={<ListTodo size={19} />} iconClass="bg-[#edf3f7] text-[#47759c]" detail={`${completedCount} ${t("tasksCompletedOf")}`} />
//               <StatCard title={t("completed")} value={completedCount} icon={<CircleCheck size={19} />} iconClass="bg-[#e8f8f8] text-[#238e94]" detail={`${completionRate}%`} />
//               <StatCard title={t("inProgress")} value={inProgressCount} icon={<Timer size={19} />} iconClass="bg-[#fff5e7] text-[#c17a36]" detail={isArabic ? "مهام لم تكتمل بعد" : "Tasks not completed yet"} />
//               <div className="rounded-[14px] border border-[#e8e8ed] bg-white p-4.25 shadow-sm shadow-black/3"><div className="flex items-center justify-between"><span className="text-[11px] font-medium text-[#858592]">{t("completionRate")}</span><span className="grid h-8.5 w-8.5 place-items-center rounded-[9px] bg-[#f0f9fa] text-[#2eb5bc]"><ChartNoAxesCombined size={19} /></span></div><div className="mt-3 flex items-end justify-between"><strong className="text-[27px] font-bold tracking-tight">{completionRate}%</strong><span className="text-[10px] text-[#96979f]">{completedCount}/{totalCount}</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#eeeef1]"><div className="h-full rounded-full bg-[#2eb5bc] transition-all" style={{ width: `${completionRate}%` }} /></div></div>
//             </div>
//           </section>
//     </div>
//   );
// }


// // Reusable statistic card used by the dashboard's summary section.
// function StatCard({ title, value, icon, iconClass, detail }: { title: string; value: number; icon: ReactNode; iconClass: string; detail: string }) {
//   return <article className="rounded-[14px] border border-[#e8e8ed] bg-white p-4.25 shadow-sm shadow-black/3"><div className="flex items-center justify-between"><span className="text-[11px] font-medium text-[#858592]">{title}</span><span className={`grid h-8.5 w-8.5 place-items-center rounded-[9px] ${iconClass}`}>{icon}</span></div><div className="mt-3 flex items-end justify-between gap-2"><strong className="text-[27px] font-bold tracking-tight">{value}</strong><span className="text-[10px] text-[#96979f]">{detail}</span></div></article>;
// }

