// "use client";

// import { createContext, useContext, useEffect, useState, useSyncExternalStore, ReactNode } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// // import { LayoutDashboard, ChartNoAxesCombined, ChartColumn, Mail, CalendarDays, FileText, Archive, Target, Users, Newspaper, Megaphone, Receipt, FileSpreadsheet, ListChecks, Building2, ShieldCheck, Network, Paperclip, UserCog, ChevronDown, PanelLeftClose, PanelLeftOpen, Menu, Search, Bell, Plus, Languages, LogOut, Moon, Sun, X, House, Landmark, CalendarCheck, ClipboardList, FileBarChart, RadioTower, Settings2, Bot } from "lucide-react";
// import { LayoutDashboard, ChartNoAxesCombined, ChartColumn, ListChecks, ShieldCheck, UserCog, ChevronDown, PanelLeftClose, PanelLeftOpen, Menu, Search, Bell, Plus, Languages, LogOut, Moon, Sun, X, House, Settings2, Bot, FileBarChart } from "lucide-react";
// import { useAuth } from "../context/AuthContext";
// import AppToaster from "./AppToaster";
// import { copy } from "../translations/dashboard/layout-trans";
// import { DashboardLang, IDashboardContextValue, INavigationGroup, TranslationKey } from "../interfaces/dahboard-layout-interface";


// const navigationGroups: INavigationGroup[] = [
//   {
//     id: "home", label: "home", icon: House, items: [
//       { id: "dashboard", href: "/", label: "dashboard", icon: LayoutDashboard },
//       { id: "analytics", href: "/analytics", label: "analytics", icon: ChartNoAxesCombined },
//       { id: "reports", href: "/tasks-reports", label: "reports", icon: ChartColumn, adminOnly: true  },
//       { id: "ai-assistant", href: "/chat", label: "ai_assistant", icon: Bot },
//     ],
//   },
//   // {
//   //   id: "operations", label: "operations", icon: ClipboardList, items: [
//   //     { id: "correspondence", href: "/correspondence", label: "correspondence", icon: Mail },
//   //     { id: "events", href: "/events", label: "events", icon: CalendarDays },
//   //     { id: "memos", href: "/memos", label: "memos", icon: FileText },
//   //     { id: "archive", href: "/archive", label: "archive", icon: Archive },
//   //     { id: "objectives", href: "/objectives", label: "objectives", icon: Target },
//   //     { id: "meetings", href: "/meetings", label: "meetings", icon: Users },
//   //   ],
//   // },
//   // {
//   //   id: "media", label: "media", icon: RadioTower, items: [
//   //     { id: "newspapers", href: "/media/newspapers", label: "newspapers", icon: Newspaper },
//   //     { id: "campaigns", href: "/media/campaigns", label: "campaigns", icon: Megaphone },
//   //   ],
//   // },
//   // {
//   //   id: "invoices", label: "invoices", icon: Receipt, items: [
//   //     { id: "newspaper-invoices", href: "/invoices/newspapers", label: "newspaperInvoices", icon: Receipt },
//   //     { id: "media-invoices", href: "/invoices/media", label: "mediaInvoices", icon: FileSpreadsheet },
//   //   ],
//   // },
//   {
//     id: "media-reports", label: "mediaReports", icon: FileBarChart, items: [
//       // { id: "issued-statements", href: "/media-reports/issued-statements", label: "issuedStatements", icon: FileText },
//       { id: "tasks", href: "/tasks", label: "tasks", icon: ListChecks },
//     ],
//   },
//   // {
//   //   id: "contacts", label: "contacts", icon: Building2, items: [
//   //     { id: "government-entities", href: "/contacts/government-entities", label: "governmentEntities", icon: Landmark },
//   //   ],
//   // },
//   // {
//   //   id: "security", label: "security", icon: ShieldCheck, items: [
//   //     { id: "cyber-security", href: "/security/cybersecurity", label: "cyberSecurity", icon: ShieldCheck },
//   //   ],
//   // },
//   // {
//   //   id: "other", label: "other", icon: Network, items: [
//   //     { id: "organization", href: "/organization", label: "organization", icon: Network },
//   //     { id: "daily-calendar", href: "/daily-calendar", label: "dailyCalendar", icon: CalendarCheck },
//   //   ],
//   // },
//   {
//     id: "system", label: "system", icon: Settings2, items: [
//       // { id: "attachments", href: "/attachments", label: "attachments", icon: Paperclip },
//       // { id: "user-management", href: "/team", label: "userManagement", icon: UserCog, adminOnly: true },
//       { id: "team", href: "/team", label: "team", icon: UserCog, employeeOnly: true },
//       { id: "user-management", href: "/admin", label: "userManagement", icon: ShieldCheck, adminOnly: true },
//     ],
//   },
// ];


// const DashboardContext = createContext<IDashboardContextValue | null>(null);

// export function useDashboardLayout() {
//   const context = useContext(DashboardContext);

//   if (!context) {
//     throw new Error(
//       "useDashboardLayout must be used inside DashboardLayout."
//     );
//   }

//   return context;
// }

// function useSavedTheme() {
//   return useSyncExternalStore(
//     (onStoreChange) => {
//       window.addEventListener("storage", onStoreChange);
//       window.addEventListener("ntra-theme-change", onStoreChange);

//       return () => {
//         window.removeEventListener("storage", onStoreChange);
//         window.removeEventListener("ntra-theme-change", onStoreChange);
//       };
//     },
//     () => {
//       try {
//         return window.localStorage.getItem("motionly-theme") === "dark";
//       } catch {
//         return false;
//       }
//     },
//     // Keep server rendering deterministic; the saved preference is applied
//     // immediately after hydration by the client snapshot.
//     () => false
//   );
// }

// function Avatar({ initials }: { initials: string }) {
//   return (
//     <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#353550] text-xs font-bold text-white ring-2 ring-white/70">
//       {initials}
//     </span>
//   );
// }

// function isRouteActive(pathname: string, href: string) {
//   if (href === "/") return pathname === "/";
//   return pathname === href || pathname.startsWith(`${href}/`);
// }

// function getActiveGroupIds(pathname: string) {
//   return navigationGroups.filter((group) =>
//     group.items.some((item) => isRouteActive(pathname, item.href))
//   ).map((group) => group.id);
// }

// export default function DashboardLayout({ children }: { children: ReactNode }) {

//   const pathname = usePathname();
//   const router = useRouter();
//   const { isAuthenticated, isLoading, user, logout } = useAuth();

  

//   const userRole = typeof user?.role === "string" ? user.role.trim().toLowerCase() : "";

//   const isAdminUser = user?.isAdmin === true || ["super_supervisor"].includes(userRole);
//   const isEmployeeUser = ["employee"].includes(userRole);
//   const fullName = typeof user?.fullName === "string" ? user.fullName.trim() : "";
//   const displayName = fullName.split(/\s+/).filter(Boolean).filter((_, index, names) => index === 0 || index === names.length - 1).join(" ");

//   const [lang, setLang] = useState<DashboardLang>("ar");
//   const [query, setQuery] = useState("");
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

//   // User-controlled expanded groups.
//   const [openGroups, setOpenGroups] = useState<string[]>([]);

//   // Allows the user to close the group containing the current page.
//   const [closedActiveGroups, setClosedActiveGroups] = useState<string[]>([]);

//   const darkMode = useSavedTheme();
//   const isArabic = lang === "ar";
//   const t = (key: TranslationKey) => copy[lang][key];

//   const activeGroupIds = getActiveGroupIds(pathname);

//   /*
//    * When the route changes, the active group opens by default.
//    * The user can still close it manually.
//    */
//   const isGroupOpen = (groupId: string) => {
//     if (closedActiveGroups.includes(groupId)) return false;

//     return (
//       openGroups.includes(groupId) || activeGroupIds.includes(groupId)
//     );
//   };

//   useEffect(() => {
//     if (!mobileDrawerOpen) return;

//     const handleKeyDown = (event: KeyboardEvent) => {
//       if (event.key === "Escape") {
//         setMobileDrawerOpen(false);
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     document.body.style.overflow = "hidden";

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//       document.body.style.overflow = "";
//     };
//   }, [mobileDrawerOpen]);

//   const toggleTheme = () => {
//     try {
//       window.localStorage.setItem("motionly-theme", darkMode ? "light" : "dark");
//     } catch {
//       // Theme still updates for the current session if storage is unavailable.
//     }

//     window.dispatchEvent(new Event("ntra-theme-change"));
//   };

//   const contextValue: IDashboardContextValue = { lang, isArabic, darkMode, setLang, toggleTheme, t };

//   const handleLogout = async () => {
//     try {
//       await logout();
//     } finally {
//       router.push("/login");
//     }
//   };

//   const toggleGroup = (groupId: string) => {
//     const currentlyOpen = isGroupOpen(groupId);
//     const isActiveGroup = activeGroupIds.includes(groupId);

//     if (currentlyOpen) {
//       if (isActiveGroup) {
//         setClosedActiveGroups((previous) =>
//           previous.includes(groupId)
//             ? previous
//             : [...previous, groupId]
//         );
//       }

//       setOpenGroups((previous) =>
//         previous.filter((id) => id !== groupId)
//       );

//       return;
//     }

//     setClosedActiveGroups((previous) =>
//       previous.filter((id) => id !== groupId)
//     );

//     setOpenGroups((previous) =>
//       previous.includes(groupId) ? previous : [...previous, groupId]
//     );
//   };

//   const filteredGroups = navigationGroups
//     .map((group) => {
//       const normalizedQuery = query.trim().toLocaleLowerCase();
//       const groupMatches = t(group.label)
//         .toLocaleLowerCase()
//         .includes(normalizedQuery);

//       const items = group.items
        
//       .filter((item) => {
//         if (isLoading || !isAuthenticated) return false;

//         if (item.adminOnly && !isAdminUser) return false;

//         if (item.employeeOnly && isAdminUser) return false;

//         if (
//           item.allowedRoles &&
//           !item.allowedRoles.some(
//             (role) => role.trim().toLowerCase() === userRole
//           )
//         ) {
//           return false;
//         }

//         return true;
//       })

//         .filter((item) => {
//           if (!normalizedQuery || groupMatches) return true;
//           return t(item.label).toLocaleLowerCase().includes(normalizedQuery);
//         });

//       return { ...group, items };
//     })
//     .filter((group) => group.items.length > 0);

//   const sidebarWidth = sidebarCollapsed
//     ? "lg:w-[76px]"
//     : "lg:w-[280px]";

//   const mainOffset = sidebarCollapsed
//     ? "lg:ms-[76px]"
//     : "lg:ms-[280px]";

//   function renderNavigation(mobile = false) {
//     return (
//       <nav aria-label={t("workspace")} className="space-y-2">
//         {filteredGroups.map((group) => {
//           const GroupIcon = group.icon;
//           const isOpen = isGroupOpen(group.id);

//           const hasActiveItem = group.items.some((item) =>
//             isRouteActive(pathname, item.href)
//           );

//           return (
//             <section key={group.id} className="min-w-0">
//               <button
//                 type="button"
//                 onClick={() => {
//                   if (sidebarCollapsed && !mobile) {
//                     setSidebarCollapsed(false);
//                   }

//                   toggleGroup(group.id);
//                 }}
//                 title={
//                   sidebarCollapsed && !mobile
//                     ? t(group.label)
//                     : undefined
//                 }
//                 aria-expanded={isOpen}
//                 className={`group flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-start transition ${
//                   hasActiveItem
//                     ? "text-[#238e94]"
//                     : darkMode
//                       ? "text-slate-400 hover:bg-slate-800 hover:text-white"
//                       : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
//                 } ${
//                   sidebarCollapsed && !mobile
//                     ? "lg:justify-center lg:px-0"
//                     : ""
//                 }`}
//               >
//                 <GroupIcon size={19} className="shrink-0" />

//                 {(!sidebarCollapsed || mobile) && (
//                   <>
//                     <span
//                       className={`min-w-0 flex-1 truncate text-xs font-bold ${
//                          hasActiveItem
//                           ? "text-[#238e94]"
//                           : darkMode
//                             ? "text-slate-400 hover:bg-slate-800 hover:text-white"
//                             : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
//                       }`}
//                     >
//                       {t(group.label)}
//                     </span>

//                     <ChevronDown
//                       size={15}
//                       className={`shrink-0 transition-transform ${
//                         isOpen ? "rotate-180" : ""
//                       }`}
//                     />
//                   </>
//                 )}
//               </button>

//               {isOpen && (!sidebarCollapsed || mobile) && (
//                 <div
//                   className={`mt-1 space-y-1 ${
//                     isArabic
//                       ? "me-3 border-r pe-3"
//                       : "ms-3 border-l ps-3"
//                   } border-slate-200 dark:border-slate-700`}
//                 >
//                   {group.items.map((item) => {
//                     const ItemIcon = item.icon;
//                     const active = isRouteActive(pathname, item.href);

//                     return (
//                       <Link
//                         key={item.id}
//                         href={item.href}
//                         onClick={() => {
//                           if (mobile) setMobileDrawerOpen(false);
//                         }}
//                         aria-current={active ? "page" : undefined}
//                         title={
//                           sidebarCollapsed && !mobile
//                             ? t(item.label)
//                             : undefined
//                         }
//                         className={`flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm transition ${
//                           active
//                             ? ` font-semibold ${darkMode ? "bg-[#164e63] text-[#67e8f9]" : "bg-[#e8f8f8] text-[#238e94]"}`
//                             : ` ${darkMode ? "text-slate-300 hover:bg-slate-800 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`
//                         } ${
//                           sidebarCollapsed && !mobile
//                             ? "lg:justify-center lg:px-0"
//                             : ""
//                         }`}
//                       >
//                         <ItemIcon size={17} className="shrink-0" />

//                         {(!sidebarCollapsed || mobile) && (
//                           <span className="min-w-0 flex-1 truncate">
//                             {t(item.label)}
//                           </span>
//                         )}

//                         {active && (!sidebarCollapsed || mobile) && (
//                           <span className="size-1.5 shrink-0 rounded-full bg-[#2eb5bc]" />
//                         )}
//                       </Link>
//                     );
//                   })}
//                 </div>
//               )}
//             </section>
//           );
//         })}
//       </nav>
//     );
//   }

//   const activeItem = navigationGroups
//     .flatMap((group) => group.items)
//     .find((item) => isRouteActive(pathname, item.href));

//   return (
//     <DashboardContext.Provider value={contextValue}>
//       <div dir={isArabic ? "rtl" : "ltr"} lang={lang} className={`${darkMode ? "motionly-dark dark bg-[#111827] text-[#e5e7eb]" : "bg-[#f7f7f9] text-[#202126]"} min-h-screen ${isArabic ? "font-[Tajawal,sans-serif]" : "font-sans"}`}>
                
//         {/* Desktop sidebar */}
//         <aside className={`fixed inset-y-0 z-30 hidden flex-col transition-[width] duration-200 lg:flex ${darkMode ? "border-slate-800 bg-[#182230]" : "border-slate-200 bg-white"} ${sidebarWidth} ${isArabic ? "right-0 border-l" : "left-0 border-r"}`}>
//           <div className={`flex h-19 shrink-0 items-center border-bpx-4 ${darkMode ? "border-slate-800" : "border-slate-100 " } ${sidebarCollapsed ? "justify-center" : "justify-between"}`}>
//             {!sidebarCollapsed && ( <Link href="/" aria-label="NTRA Home" className="flex min-w-0 flex-1 items-center" > <Image src={darkMode ? "/ntra-white.png" : "/ntra-black.png"} alt="NTRA - National Telecom Regulatory Authority" width={808} height={332} priority className="h-auto max-h-12 w-full max-w-51.25 object-contain object-start"/> </Link>)}

//             <button type="button" onClick={() => setSidebarCollapsed((previous) => !previous)} title={ sidebarCollapsed ? t("expandSidebar") : t("collapseSidebar")} aria-label={ sidebarCollapsed ? t("expandSidebar") : t("collapseSidebar")} className={`grid size-9 shrink-0 place-items-center rounded-lg text-slate-500 transition ${darkMode ? "hover:bg-slate-800 hover:text-white" : "hover:bg-slate-100 hover:text-slate-800" }`}>
//               {sidebarCollapsed ? ( <PanelLeftOpen size={19} /> ) : ( <PanelLeftClose size={19} />)}
//             </button>
//           </div>

//           <div className="shrink-0 px-3 pb-3 pt-4">
//             {!sidebarCollapsed && ( <p className="mb-2 px-2 text-[10px] font-bold tracking-wider text-slate-400"> {t("workspace")} </p>)}
//           </div>

//           <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
//             {renderNavigation()}
//           </div>

//           <div className={`shrink-0 border-t p-3  ${darkMode ? "border-slate-800" : "border-slate-100"}`}>
//             <div className={`flex items-center gap-3 rounded-xl p-2 ${ sidebarCollapsed ? "justify-center" : "" }`}>
              
//               <Avatar initials={ displayName ? displayName .split(/\s+/) .map((name) => name[0]) .join("") .slice(0, 2) .toUpperCase() : isArabic ? "م" : "U" }/>

              
//               {!sidebarCollapsed && (
//                 <button type="button" onClick={() => router.push("/account")} className="min-w-0 flex-1 rounded-lg text-start transition-colors hover:text-[#238e94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#238e94]/50" aria-label={t("accountSettings")}>
//                   <p className="truncate text-xs font-semibold">
//                     {displayName || t("account")}
//                   </p>

//                   <p className="mt-0.5 truncate text-[10px] text-slate-400">
//                     {t("accountSettings")}
//                   </p>
//                 </button>
//               )}
//             </div>

//             <button type="button" onClick={handleLogout} title={t("logout")} aria-label={t("logoutAria")} className={`mt-2 flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-red-500 transition ${darkMode ? "hover:bg-red-950/30" : "hover:bg-red-50"} ${ sidebarCollapsed ? "justify-center px-0" : "" }`}>
//               <LogOut size={17} />
//               {!sidebarCollapsed && <span>{t("logout")}</span>}
//             </button>
//           </div>
//         </aside>

//         {/* Mobile drawer backdrop */}
//         {mobileDrawerOpen && (
//           <button
//             type="button"
//             aria-label={t("closeMenu")}
//             onClick={() => setMobileDrawerOpen(false)}
//             className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[1px] lg:hidden"
//           />
//         )}

//         {/* Mobile drawer */}
//         <aside
//           id="mobile-navigation"
//           aria-label={t("workspace")}
//           aria-hidden={!mobileDrawerOpen}
//           className={`fixed inset-y-0 z-50 flex w-[min(86vw,340px)] flex-col shadow-2xl transition-transform duration-200 lg:hidden ${darkMode ? "bg-[#182230]" : "bg-white"} ${
//             isArabic ? "right-0" : "left-0"
//           } ${
//             mobileDrawerOpen
//               ? "translate-x-0"
//               : isArabic
//                 ? "translate-x-full"
//                 : "-translate-x-full"
//           }`}
//         >
//           <div className={`flex h-19 shrink-0 items-center justify-between border-b px-4 ${darkMode ? "border-slate-800" : "border-slate-100"}`}>
//             <Link
//               href="/"
//               onClick={() => setMobileDrawerOpen(false)}
//             >
//               <Image
//                 src={
//                   darkMode ? "/ntra-white.png": "/ntra-black.png"
//                 }
//                 alt="NTRA - National Telecom Regulatory Authority"
//                 width={808}
//                 height={332}
//                 priority
//                 className="h-auto max-h-12 w-47.5 object-contain object-start"
//               />
//             </Link>

//             <button
//               type="button"
//               onClick={() => setMobileDrawerOpen(false)}
//               aria-label={t("closeMenu")}
//               className={`grid size-10 place-items-center rounded-xl text-slate-500 ${darkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
//             >
//               <X size={20} />
//             </button>
//           </div>

//           <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-5">
//             {renderNavigation(true)}
//           </div>
          

//           <div className={`shrink-0 border-t p-4 ${darkMode ? "border-slate-800" : "border-slate-100" }`}>
//             <div className="flex items-center gap-3">
              
//               <Avatar initials={ displayName ? displayName .split(/\s+/) .map((name) => name[0]) .join("") .slice(0, 2) .toUpperCase() : isArabic ? "م" : "U" }/>

//               <button type="button" onClick={() => router.push("/account")} className="min-w-0 flex-1 rounded-lg text-start transition-colors hover:text-[#238e94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#238e94]/50" aria-label={t("accountSettings")}>
//                 <div className="min-w-0 flex-1">
//                   <p className="truncate text-xs font-semibold">{displayName || t("account")}</p>
//                   <p className="mt-0.5 truncate text-[10px] text-slate-400">{t("accountSettings")}</p>
//                 </div>
//               </button>
              
//               <button type="button" onClick={handleLogout} aria-label={t("logoutAria")} className={`grid size-9 place-items-center rounded-lg text-red-500  ${darkMode ? "hover:bg-red-950/30" : "hover:bg-red-50" }`}> <LogOut size={17} /></button>
//             </div>
//           </div>
//         </aside>

//         {/* Main content */}
//         <main
//           className={`min-h-screen min-w-0 transition-[margin] duration-200 ${mainOffset}`}
//         >
//           <header className={`sticky top-0 z-20 flex h-19 items-center justify-between gap-3 border-b px-3 backdrop-blur-md sm:px-6 xl:px-8 ${darkMode ? "border-slate-800 bg-[#182230]/95" : "border-slate-200 bg-white/95" }`}>
//             <div className="flex min-w-0 flex-1 items-center gap-2">
//               <button
//                 type="button"
//                 onClick={() => setMobileDrawerOpen(true)}
//                 aria-label={t("openMenu")}
//                 aria-controls="mobile-navigation"
//                 aria-expanded={mobileDrawerOpen}
//                 className={`grid size-10 shrink-0 place-items-center rounded-xl transition lg:hidden ${darkMode ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100" }`}
//               >
//                 <Menu size={21} />
//               </button>

//               <div className="relative hidden w-full max-w-md items-center sm:flex">
//                 <Search
//                   size={17}
//                   className={`pointer-events-none absolute text-slate-400 ${
//                     isArabic ? "right-3" : "left-3"
//                   }`}
//                 />

//                 <input
//                   aria-label={t("search")}
//                   value={query}
//                   onChange={(event) => setQuery(event.target.value)}
//                   placeholder={t("search")}
//                   className={`h-10 w-full rounded-xl border border-transparent text-sm outline-none transition focus:border-[#2eb5bc] focus:ring-2 focus:ring-[#2eb5bc]/15  ${darkMode ? "bg-slate-900 focus:bg-slate-950" : "bg-slate-50 focus:bg-white"} ${isArabic ? "pr-9 pl-3" : "pl-9 pr-3"}`}
//                 />
//               </div>

//               <span className="truncate text-sm font-semibold sm:hidden">
//                 {t(activeItem?.label ?? "dashboard")}
//               </span>
//             </div>

//             <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
//               <button
//                 type="button"
//                 onClick={toggleTheme}
//                 aria-label={t("themeAria")}
//                 title={darkMode ? t("lightMode") : t("darkMode")}
//                 className={`grid size-10 place-items-center rounded-xl border transition ${darkMode ? "border-slate-700 text-amber-300 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
//               >
//                 {darkMode ? <Sun size={18} /> : <Moon size={18} />}
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setLang(isArabic ? "en" : "ar")}
//                 aria-label={t("languageAria")}
//                 className={`flex h-10 items-center gap-1.5 rounded-xl border  px-2.5 text-xs font-semibold transition sm:px-3 ${darkMode ? "border-slate-700 text-slate-200 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-50" }`}
//               >
//                 <Languages size={17} />
//                 <span>{t("language")}</span>
//               </button>

//               <button
//                 type="button"
//                 aria-label={t("notifications")}
//                 title={t("notifications")}
//                 className={`relative grid size-10 place-items-center rounded-xl border transition ${darkMode ? "border-slate-700 text-slate-200 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-50" }`}
//               >
//                 <Bell size={18} />
//                 <span
//                   className={`absolute top-2 size-1.5 rounded-full bg-rose-500 ${
//                     isArabic ? "left-2" : "right-2"
//                   }`}
//                 />
//               </button>
                
//               {!isEmployeeUser && (
//                 <button
//                   type="button"
//                   onClick={() => router.push("/add-task")}
//                   className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#2eb5bc] px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#269fa6] sm:px-4"
//                 >
//                   <Plus size={17} />
//                   <span className="hidden md:inline">{t("newItem")}</span>
//                 </button>
//               )}
//             </div>
//           </header>

//           <div className="mx-auto w-full px-4 py-5 sm:px-6 sm:py-7 xl:px-8">
//             {children}
//           </div>
//         </main>
//         <AppToaster />
//       </div>
//     </DashboardContext.Provider>
//   );
// }



"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
// import { LayoutDashboard, ChartNoAxesCombined, ChartColumn, Mail, CalendarDays, FileText, Archive, Target, Users, Newspaper, Megaphone, Receipt, FileSpreadsheet, ListChecks, Building2, ShieldCheck, Network, Paperclip, UserCog, ChevronDown, PanelLeftClose, PanelLeftOpen, Menu, Search, Bell, Plus, Languages, LogOut, Moon, Sun, X, House, Landmark, CalendarCheck, ClipboardList, FileBarChart, RadioTower, Settings2, Bot } from "lucide-react";
import { LayoutDashboard, ChartNoAxesCombined, ChartColumn, ListChecks, ShieldCheck, UserCog, ChevronDown, PanelLeftClose, PanelLeftOpen, Menu, Search, Bell, Plus, Languages, LogOut, Moon, Sun, X, House, Settings2, Bot, FileBarChart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AppToaster from "./AppToaster";
import { copy } from "../translations/dashboard/layout-trans";
import { DashboardLang, IDashboardContextValue, INavigationGroup, TranslationKey } from "../interfaces/dahboard-layout-interface";
import NotificationsModal, { type NotificationItem } from "./NotificationsModal";
import {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
  type ApiNotification,
} from "@/app/services/notifications-api";


const navigationGroups: INavigationGroup[] = [
  {
    id: "home", label: "home", icon: House, items: [
      { id: "dashboard", href: "/", label: "dashboard", icon: LayoutDashboard },
      { id: "analytics", href: "/analytics", label: "analytics", icon: ChartNoAxesCombined },
      { id: "reports", href: "/tasks-reports", label: "reports", icon: ChartColumn, adminOnly: true  },
      { id: "ai-assistant", href: "/chat", label: "ai_assistant", icon: Bot },
    ],
  },
  // {
  //   id: "operations", label: "operations", icon: ClipboardList, items: [
  //     { id: "correspondence", href: "/correspondence", label: "correspondence", icon: Mail },
  //     { id: "events", href: "/events", label: "events", icon: CalendarDays },
  //     { id: "memos", href: "/memos", label: "memos", icon: FileText },
  //     { id: "archive", href: "/archive", label: "archive", icon: Archive },
  //     { id: "objectives", href: "/objectives", label: "objectives", icon: Target },
  //     { id: "meetings", href: "/meetings", label: "meetings", icon: Users },
  //   ],
  // },
  // {
  //   id: "media", label: "media", icon: RadioTower, items: [
  //     { id: "newspapers", href: "/media/newspapers", label: "newspapers", icon: Newspaper },
  //     { id: "campaigns", href: "/media/campaigns", label: "campaigns", icon: Megaphone },
  //   ],
  // },
  // {
  //   id: "invoices", label: "invoices", icon: Receipt, items: [
  //     { id: "newspaper-invoices", href: "/invoices/newspapers", label: "newspaperInvoices", icon: Receipt },
  //     { id: "media-invoices", href: "/invoices/media", label: "mediaInvoices", icon: FileSpreadsheet },
  //   ],
  // },
  {
    id: "media-reports", label: "mediaReports", icon: FileBarChart, items: [
      // { id: "issued-statements", href: "/media-reports/issued-statements", label: "issuedStatements", icon: FileText },
      { id: "tasks", href: "/tasks", label: "tasks", icon: ListChecks },
    ],
  },
  // {
  //   id: "contacts", label: "contacts", icon: Building2, items: [
  //     { id: "government-entities", href: "/contacts/government-entities", label: "governmentEntities", icon: Landmark },
  //   ],
  // },
  // {
  //   id: "security", label: "security", icon: ShieldCheck, items: [
  //     { id: "cyber-security", href: "/security/cybersecurity", label: "cyberSecurity", icon: ShieldCheck },
  //   ],
  // },
  // {
  //   id: "other", label: "other", icon: Network, items: [
  //     { id: "organization", href: "/organization", label: "organization", icon: Network },
  //     { id: "daily-calendar", href: "/daily-calendar", label: "dailyCalendar", icon: CalendarCheck },
  //   ],
  // },
  {
    id: "system", label: "system", icon: Settings2, items: [
      // { id: "attachments", href: "/attachments", label: "attachments", icon: Paperclip },
      // { id: "user-management", href: "/team", label: "userManagement", icon: UserCog, adminOnly: true },
      { id: "team", href: "/team", label: "team", icon: UserCog, employeeOnly: true },
      { id: "user-management", href: "/admin", label: "userManagement", icon: ShieldCheck, adminOnly: true },
    ],
  },
];


const DashboardContext = createContext<IDashboardContextValue | null>(null);

export function useDashboardLayout() {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error(
      "useDashboardLayout must be used inside DashboardLayout."
    );
  }

  return context;
}

function useSavedTheme() {
  return useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange);
      window.addEventListener("ntra-theme-change", onStoreChange);

      return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener("ntra-theme-change", onStoreChange);
      };
    },
    () => {
      try {
        return window.localStorage.getItem("motionly-theme") === "dark";
      } catch {
        return false;
      }
    },
    // Keep server rendering deterministic; the saved preference is applied
    // immediately after hydration by the client snapshot.
    () => false
  );
}

function Avatar({ initials }: { initials: string }) {
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#353550] text-xs font-bold text-white ring-2 ring-white/70">
      {initials}
    </span>
  );
}

function isRouteActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getActiveGroupIds(pathname: string) {
  return navigationGroups.filter((group) =>
    group.items.some((item) => isRouteActive(pathname, item.href))
  ).map((group) => group.id);
}

export default function DashboardLayout({ children }: { children: ReactNode }) {

  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  

  const userRole = typeof user?.role === "string" ? user.role.trim().toLowerCase() : "";

  const isAdminUser = user?.isAdmin === true || ["super_supervisor"].includes(userRole);
  const isEmployeeUser = ["employee"].includes(userRole);
  const fullName = typeof user?.fullName === "string" ? user.fullName.trim() : "";
  const displayName = fullName.split(/\s+/).filter(Boolean).filter((_, index, names) => index === 0 || index === names.length - 1).join(" ");


  const [lang, setLang] = useState<DashboardLang>("ar");
  const isArabic = lang === "ar";
  const [query, setQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Notifications are loaded from the authenticated notifications API.
  const [showNotifications, setShowNotifications] = useState(false);
  const {
    data: apiNotifications = [],
    isFetching: isFetchingNotifications,
  } = useGetNotificationsQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: 60_000,
  });
  const { data: unreadCountFromApi = 0 } = useGetUnreadNotificationCountQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: 60_000,
  });
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();
  const [markAllNotificationsAsRead] = useMarkAllNotificationsAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const formatNotificationTime = (value?: string | null) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-US", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(date);
  };

const notifications: NotificationItem[] = apiNotifications.map(
  (item: ApiNotification) => {
    const rawType = (item.type ?? "info").toLowerCase();
    const createdAt = item.created_at ?? item.createdAt;

    return {
      id: item.id,
      title: item.title || (isArabic ? "إشعار جديد" : "New notification"),
      text:
        item.message ||
        item.body ||
        item.content ||
        item.description ||
        "",
      time: formatNotificationTime(createdAt),

      tone:
        rawType.includes("success") || rawType.includes("complete")
          ? "success"
          : rawType.includes("warning") || rawType.includes("alert")
            ? "warning"
            : "info",

      // readAt is null for unread notifications and an ISO date for read ones.
      isRead:
        item.is_read ??
        item.isRead ??
        Boolean(item.read_at ?? item.readAt),

      // resourceId is the related task ID, not the notification ID.
      resourceId:
        String(item.resourceType ?? "").toUpperCase() === "TASK"
          ? item.resourceId
          : null,
    };
  }
);

  const unreadNotificationCount = unreadCountFromApi;

  // User-controlled expanded groups.
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  // Allows the user to close the group containing the current page.
  const [closedActiveGroups, setClosedActiveGroups] = useState<string[]>([]);

  const darkMode = useSavedTheme();
  const t = (key: TranslationKey) => copy[lang][key];

  const activeGroupIds = getActiveGroupIds(pathname);

  /*
   * When the route changes, the active group opens by default.
   * The user can still close it manually.
   */
  const isGroupOpen = (groupId: string) => {
    if (closedActiveGroups.includes(groupId)) return false;

    return (
      openGroups.includes(groupId) || activeGroupIds.includes(groupId)
    );
  };

  useEffect(() => {
    if (!mobileDrawerOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileDrawerOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileDrawerOpen]);

  const toggleTheme = () => {
    try {
      window.localStorage.setItem("motionly-theme", darkMode ? "light" : "dark");
    } catch {
      // Theme still updates for the current session if storage is unavailable.
    }

    window.dispatchEvent(new Event("ntra-theme-change"));
  };

  const contextValue: IDashboardContextValue = { lang, isArabic, darkMode, setLang, toggleTheme, t };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.push("/login");
    }
  };

  const toggleGroup = (groupId: string) => {
    const currentlyOpen = isGroupOpen(groupId);
    const isActiveGroup = activeGroupIds.includes(groupId);

    if (currentlyOpen) {
      if (isActiveGroup) {
        setClosedActiveGroups((previous) =>
          previous.includes(groupId)
            ? previous
            : [...previous, groupId]
        );
      }

      setOpenGroups((previous) =>
        previous.filter((id) => id !== groupId)
      );

      return;
    }

    setClosedActiveGroups((previous) =>
      previous.filter((id) => id !== groupId)
    );

    setOpenGroups((previous) =>
      previous.includes(groupId) ? previous : [...previous, groupId]
    );
  };

  const filteredGroups = navigationGroups
    .map((group) => {
      const normalizedQuery = query.trim().toLocaleLowerCase();
      const groupMatches = t(group.label)
        .toLocaleLowerCase()
        .includes(normalizedQuery);

      const items = group.items
        
      .filter((item) => {
        if (isLoading || !isAuthenticated) return false;

        if (item.adminOnly && !isAdminUser) return false;

        if (item.employeeOnly && isAdminUser) return false;

        if (
          item.allowedRoles &&
          !item.allowedRoles.some(
            (role) => role.trim().toLowerCase() === userRole
          )
        ) {
          return false;
        }

        return true;
      })

        .filter((item) => {
          if (!normalizedQuery || groupMatches) return true;
          return t(item.label).toLocaleLowerCase().includes(normalizedQuery);
        });

      return { ...group, items };
    })
    .filter((group) => group.items.length > 0);

  const sidebarWidth = sidebarCollapsed
    ? "lg:w-[76px]"
    : "lg:w-[280px]";

  const mainOffset = sidebarCollapsed
    ? "lg:ms-[76px]"
    : "lg:ms-[280px]";

  function renderNavigation(mobile = false) {
    return (
      <nav aria-label={t("workspace")} className="space-y-2">
        {filteredGroups.map((group) => {
          const GroupIcon = group.icon;
          const isOpen = isGroupOpen(group.id);

          const hasActiveItem = group.items.some((item) =>
            isRouteActive(pathname, item.href)
          );

          return (
            <section key={group.id} className="min-w-0">
              <button
                type="button"
                onClick={() => {
                  if (sidebarCollapsed && !mobile) {
                    setSidebarCollapsed(false);
                  }

                  toggleGroup(group.id);
                }}
                title={
                  sidebarCollapsed && !mobile
                    ? t(group.label)
                    : undefined
                }
                aria-expanded={isOpen}
                className={`group flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-start transition ${
                  hasActiveItem
                    ? "text-[#238e94]"
                    : darkMode
                      ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                } ${
                  sidebarCollapsed && !mobile
                    ? "lg:justify-center lg:px-0"
                    : ""
                }`}
              >
                <GroupIcon size={19} className="shrink-0" />

                {(!sidebarCollapsed || mobile) && (
                  <>
                    <span
                      className={`min-w-0 flex-1 truncate text-xs font-bold ${
                         hasActiveItem
                          ? "text-[#238e94]"
                          : darkMode
                            ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      }`}
                    >
                      {t(group.label)}
                    </span>

                    <ChevronDown
                      size={15}
                      className={`shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </>
                )}
              </button>

              {isOpen && (!sidebarCollapsed || mobile) && (
                <div
                  className={`mt-1 space-y-1 ${
                    isArabic
                      ? "me-3 border-r pe-3"
                      : "ms-3 border-l ps-3"
                  } border-slate-200 dark:border-slate-700`}
                >
                  {group.items.map((item) => {
                    const ItemIcon = item.icon;
                    const active = isRouteActive(pathname, item.href);

                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => {
                          if (mobile) setMobileDrawerOpen(false);
                        }}
                        aria-current={active ? "page" : undefined}
                        title={
                          sidebarCollapsed && !mobile
                            ? t(item.label)
                            : undefined
                        }
                        className={`flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm transition ${
                          active
                            ? ` font-semibold ${darkMode ? "bg-[#164e63] text-[#67e8f9]" : "bg-[#e8f8f8] text-[#238e94]"}`
                            : ` ${darkMode ? "text-slate-300 hover:bg-slate-800 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`
                        } ${
                          sidebarCollapsed && !mobile
                            ? "lg:justify-center lg:px-0"
                            : ""
                        }`}
                      >
                        <ItemIcon size={17} className="shrink-0" />

                        {(!sidebarCollapsed || mobile) && (
                          <span className="min-w-0 flex-1 truncate">
                            {t(item.label)}
                          </span>
                        )}

                        {active && (!sidebarCollapsed || mobile) && (
                          <span className="size-1.5 shrink-0 rounded-full bg-[#2eb5bc]" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </nav>
    );
  }

  const activeItem = navigationGroups
    .flatMap((group) => group.items)
    .find((item) => isRouteActive(pathname, item.href));

  return (
    <DashboardContext.Provider value={contextValue}>
      <div dir={isArabic ? "rtl" : "ltr"} lang={lang} className={`${darkMode ? "motionly-dark dark bg-[#111827] text-[#e5e7eb]" : "bg-[#f7f7f9] text-[#202126]"} min-h-screen ${isArabic ? "font-[Tajawal,sans-serif]" : "font-sans"}`}>
                
        {/* Desktop sidebar */}
        <aside className={`fixed inset-y-0 z-30 hidden flex-col transition-[width] duration-200 lg:flex ${darkMode ? "border-slate-800 bg-[#182230]" : "border-slate-200 bg-white"} ${sidebarWidth} ${isArabic ? "right-0 border-l" : "left-0 border-r"}`}>
          <div className={`flex h-19 shrink-0 items-center border-bpx-4 ${darkMode ? "border-slate-800" : "border-slate-100 " } ${sidebarCollapsed ? "justify-center" : "justify-between"}`}>
            {!sidebarCollapsed && ( <Link href="/" aria-label="NTRA Home" className="flex min-w-0 flex-1 items-center" > <Image src={darkMode ? "/ntra-white.png" : "/ntra-black.png"} alt="NTRA - National Telecom Regulatory Authority" width={808} height={332} priority className="h-auto max-h-12 w-full max-w-51.25 object-contain object-start"/> </Link>)}

            <button type="button" onClick={() => setSidebarCollapsed((previous) => !previous)} title={ sidebarCollapsed ? t("expandSidebar") : t("collapseSidebar")} aria-label={ sidebarCollapsed ? t("expandSidebar") : t("collapseSidebar")} className={`grid size-9 shrink-0 place-items-center rounded-lg text-slate-500 transition ${darkMode ? "hover:bg-slate-800 hover:text-white" : "hover:bg-slate-100 hover:text-slate-800" }`}>
              {sidebarCollapsed ? ( <PanelLeftOpen size={19} /> ) : ( <PanelLeftClose size={19} />)}
            </button>
          </div>

          <div className="shrink-0 px-3 pb-3 pt-4">
            {!sidebarCollapsed && ( <p className="mb-2 px-2 text-[10px] font-bold tracking-wider text-slate-400"> {t("workspace")} </p>)}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
            {renderNavigation()}
          </div>

          <div className={`shrink-0 border-t p-3  ${darkMode ? "border-slate-800" : "border-slate-100"}`}>
            <div className={`flex items-center gap-3 rounded-xl p-2 ${ sidebarCollapsed ? "justify-center" : "" }`}>
              
              <Avatar initials={ displayName ? displayName .split(/\s+/) .map((name) => name[0]) .join("") .slice(0, 2) .toUpperCase() : isArabic ? "م" : "U" }/>

              
              {!sidebarCollapsed && (
                <button type="button" onClick={() => router.push("/account")} className="min-w-0 flex-1 rounded-lg text-start transition-colors hover:text-[#238e94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#238e94]/50" aria-label={t("accountSettings")}>
                  <p className="truncate text-xs font-semibold">
                    {displayName || t("account")}
                  </p>

                  <p className="mt-0.5 truncate text-[10px] text-slate-400">
                    {t("accountSettings")}
                  </p>
                </button>
              )}
            </div>

            <button type="button" onClick={handleLogout} title={t("logout")} aria-label={t("logoutAria")} className={`mt-2 flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-red-500 transition ${darkMode ? "hover:bg-red-950/30" : "hover:bg-red-50"} ${ sidebarCollapsed ? "justify-center px-0" : "" }`}>
              <LogOut size={17} />
              {!sidebarCollapsed && <span>{t("logout")}</span>}
            </button>
          </div>
        </aside>

        {/* Mobile drawer backdrop */}
        {mobileDrawerOpen && (
          <button
            type="button"
            aria-label={t("closeMenu")}
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[1px] lg:hidden"
          />
        )}

        {/* Mobile drawer */}
        <aside
          id="mobile-navigation"
          aria-label={t("workspace")}
          aria-hidden={!mobileDrawerOpen}
          className={`fixed inset-y-0 z-50 flex w-[min(86vw,340px)] flex-col shadow-2xl transition-transform duration-200 lg:hidden ${darkMode ? "bg-[#182230]" : "bg-white"} ${
            isArabic ? "right-0" : "left-0"
          } ${
            mobileDrawerOpen
              ? "translate-x-0"
              : isArabic
                ? "translate-x-full"
                : "-translate-x-full"
          }`}
        >
          <div className={`flex h-19 shrink-0 items-center justify-between border-b px-4 ${darkMode ? "border-slate-800" : "border-slate-100"}`}>
            <Link
              href="/"
              onClick={() => setMobileDrawerOpen(false)}
            >
              <Image
                src={
                  darkMode ? "/ntra-white.png": "/ntra-black.png"
                }
                alt="NTRA - National Telecom Regulatory Authority"
                width={808}
                height={332}
                priority
                className="h-auto max-h-12 w-47.5 object-contain object-start"
              />
            </Link>

            <button
              type="button"
              onClick={() => setMobileDrawerOpen(false)}
              aria-label={t("closeMenu")}
              className={`grid size-10 place-items-center rounded-xl text-slate-500 ${darkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
            >
              <X size={20} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-5">
            {renderNavigation(true)}
          </div>
          

          <div className={`shrink-0 border-t p-4 ${darkMode ? "border-slate-800" : "border-slate-100" }`}>
            <div className="flex items-center gap-3">
              
              <Avatar initials={ displayName ? displayName .split(/\s+/) .map((name) => name[0]) .join("") .slice(0, 2) .toUpperCase() : isArabic ? "م" : "U" }/>

              <button type="button" onClick={() => router.push("/account")} className="min-w-0 flex-1 rounded-lg text-start transition-colors hover:text-[#238e94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#238e94]/50" aria-label={t("accountSettings")}>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold">{displayName || t("account")}</p>
                  <p className="mt-0.5 truncate text-[10px] text-slate-400">{t("accountSettings")}</p>
                </div>
              </button>
              
              <button type="button" onClick={handleLogout} aria-label={t("logoutAria")} className={`grid size-9 place-items-center rounded-lg text-red-500  ${darkMode ? "hover:bg-red-950/30" : "hover:bg-red-50" }`}> <LogOut size={17} /></button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main
          className={`min-h-screen min-w-0 transition-[margin] duration-200 ${mainOffset}`}
        >
          <header className={`sticky top-0 z-20 flex h-19 items-center justify-between gap-3 border-b px-3 backdrop-blur-md sm:px-6 xl:px-8 ${darkMode ? "border-slate-800 bg-[#182230]/95" : "border-slate-200 bg-white/95" }`}>
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                aria-label={t("openMenu")}
                aria-controls="mobile-navigation"
                aria-expanded={mobileDrawerOpen}
                className={`grid size-10 shrink-0 place-items-center rounded-xl transition lg:hidden ${darkMode ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100" }`}
              >
                <Menu size={21} />
              </button>

              <div className="relative hidden w-full max-w-md items-center sm:flex">
                <Search
                  size={17}
                  className={`pointer-events-none absolute text-slate-400 ${
                    isArabic ? "right-3" : "left-3"
                  }`}
                />

                <input
                  aria-label={t("search")}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t("search")}
                  className={`h-10 w-full rounded-xl border border-transparent text-sm outline-none transition focus:border-[#2eb5bc] focus:ring-2 focus:ring-[#2eb5bc]/15  ${darkMode ? "bg-slate-900 focus:bg-slate-950" : "bg-slate-50 focus:bg-white"} ${isArabic ? "pr-9 pl-3" : "pl-9 pr-3"}`}
                />
              </div>

              <span className="truncate text-sm font-semibold sm:hidden">
                {t(activeItem?.label ?? "dashboard")}
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={t("themeAria")}
                title={darkMode ? t("lightMode") : t("darkMode")}
                className={`grid size-10 place-items-center rounded-xl border transition ${darkMode ? "border-slate-700 text-amber-300 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                type="button"
                onClick={() => setLang(isArabic ? "en" : "ar")}
                aria-label={t("languageAria")}
                className={`flex h-10 items-center gap-1.5 rounded-xl border  px-2.5 text-xs font-semibold transition sm:px-3 ${darkMode ? "border-slate-700 text-slate-200 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-50" }`}
              >
                <Languages size={17} />
                <span>{t("language")}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowNotifications((previous) => !previous)}
                aria-label={t("notifications")}
                title={t("notifications")}
                aria-expanded={showNotifications}
                className={`relative grid size-10 place-items-center rounded-xl border transition ${
                  showNotifications
                    ? darkMode
                      ? "border-[#2eb5bc]/40 bg-[#2eb5bc]/15 text-[#55cbd0]"
                      : "border-[#ccebec] bg-[#e8f8f8] text-[#238e94]"
                    : darkMode
                      ? "border-slate-700 text-slate-200 hover:bg-slate-800"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Bell size={18} />
                {unreadNotificationCount > 0 && (
                  <span
                    className={`absolute -top-1 ${
                      isArabic ? "-left-1" : "-right-1"
                    } flex h-4.25 min-w-4.25 items-center justify-center rounded-full border-2 px-1 text-[9px] font-bold text-white ${
                      darkMode ? "border-[#182230]" : "border-white"
                    } bg-rose-500`}
                  >
                    {unreadNotificationCount > 99
                      ? "99+"
                      : unreadNotificationCount}
                  </span>
                )}
              </button>
                
              {!isEmployeeUser && (
                <button
                  type="button"
                  onClick={() => router.push("/add-task")}
                  className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#2eb5bc] px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#269fa6] sm:px-4"
                >
                  <Plus size={17} />
                  <span className="hidden md:inline">{t("newItem")}</span>
                </button>
              )}
            </div>
          </header>

          <NotificationsModal
            open={showNotifications}
            onClose={() => setShowNotifications(false)}
            lang={lang}
            darkMode={darkMode}
            notifications={notifications}
            unreadCount={unreadNotificationCount}
            isLoading={isFetchingNotifications}
            onMarkAsRead={async (id) => {
              await markNotificationAsRead(id).unwrap();
            }}
            onMarkAllAsRead={() => markAllNotificationsAsRead()}
            onDelete={(id) => deleteNotification(id)}
          />

          <div className="mx-auto w-full px-4 py-5 sm:px-6 sm:py-7 xl:px-8">
            {children}
          </div>
        </main>
        <AppToaster />
      </div>
    </DashboardContext.Provider>
  );
}













