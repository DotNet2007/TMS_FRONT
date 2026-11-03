// "use client";

// import { useState } from "react";
// import { UserRound, ShieldCheck, Bell, Camera, Check, ChevronLeft, ChevronRight, LockKeyhole, Mail, Phone, BriefcaseBusiness, FileText, Save, X, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
// import { useDashboardLayout } from "@/app/components/DashboardLayout";
// import { useGetProfileQuery, useUpdateProfileMutation } from "@/app/services/account-api";
// import type { IProfile } from "@/app/interfaces/profile-interface";
// import { translations } from "@/app/translations/profile-translations";

// type Tab = "profile" | "security" | "notifications";
// type Language = "ar" | "en";



// type NotificationSettings = {
//   tasks: boolean;
//   projects: boolean;
//   email: boolean;
// };

// const initialNotifications: NotificationSettings = {
//   tasks: true,
//   projects: true,
//   email: false,
// };



// function mapApiProfileToForm(apiProfile: IProfile): IProfile {
//   const nameParts = (apiProfile.fullName ?? "").trim().split(/\s+/);

//   return {
//     ...apiProfile,
//     firstName: nameParts[0] ?? "",
//     lastName: nameParts.slice(1).join(" "),
//     email: apiProfile.email ?? "",
//     jobTitle: typeof apiProfile.jobTitle === "string" ? apiProfile.jobTitle : apiProfile.jobTitle?.name ?? "",
//     phone: apiProfile.phone ?? "",
//     bio: apiProfile.bio ?? "",
//   };
// }

// export default function AccountPage() {
//   const { lang, isArabic, darkMode } = useDashboardLayout();
//   const language: Language = lang;
//   const t = translations[language];
//   const pageBg = darkMode ? "bg-[#111827]" : "bg-[#f7f7f9]";
//   const textColor = darkMode ? "text-[#e5e7eb]" : "text-[#202126]";

//   const { data: apiProfile, isLoading: isProfileLoading, isError: isProfileError } = useGetProfileQuery();

//   if (isProfileLoading) {
//     return (
//       <main dir={isArabic ? "rtl" : "ltr"} lang={language} className={`flex min-h-screen items-center justify-center ${pageBg} ${textColor}`}>
//         <p className="text-sm"> {language === "ar" ? "جارٍ تحميل بيانات الحساب..." : "Loading account details..."} </p>
//       </main>
//     );
//   }

//   if (isProfileError || !apiProfile) {
//     return (
//       <main dir={isArabic ? "rtl" : "ltr"} lang={language} className={`flex min-h-screen items-center justify-center ${pageBg} ${textColor}`}>
//         <p role="alert" className="text-sm">{t.profileLoadError}</p>
//       </main>
//     );
//   }

//   return <AccountPageContent key={apiProfile.id ?? apiProfile.email} apiProfile={apiProfile} />;
// }

// function AccountPageContent({ apiProfile }: { apiProfile: IProfile }) {
//   const { lang, isArabic, darkMode} = useDashboardLayout();

//   const [tab, setTab] = useState<Tab>("profile");
//   const language: Language = lang;

//   const t = translations[language];
//   const isRTL = isArabic;
//   const isDark = darkMode;

//   const [saveProfileMutation, { isLoading: isSaving }] =
//     useUpdateProfileMutation();

//   const [profile, setProfile] = useState<IProfile>(() =>
//     mapApiProfileToForm(apiProfile)
//   );
//   const [savedProfile, setSavedProfile] = useState<IProfile>(() =>
//     mapApiProfileToForm(apiProfile)
//   );

//   const [notifications, setNotifications] =
//     useState<NotificationSettings>(initialNotifications);

//   const [savedMessage, setSavedMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const [passwords, setPasswords] = useState({
//     current: "",
//     next: "",
//     confirm: "",
//   });


//   const pageBg = isDark ? "bg-[#111827]" : "bg-[#f7f7f9]";
//   const cardBg = isDark ? "bg-[#1f2937]" : "bg-white";
//   const borderColor = isDark ? "border-[#374151]" : "border-[#e9e9ee]";
//   const textColor = isDark ? "text-[#e5e7eb]" : "text-[#202126]";
//   const mutedColor = isDark ? "text-[#9ca3af]" : "text-[#858592]";
//   const inputBg = isDark
//     ? "bg-[#111827] border-[#374151] text-[#e5e7eb] placeholder:text-[#6b7280]"
//     : "bg-white border-[#e6e6eb] text-[#202126] placeholder:text-[#a0a1aa]";


//   const clearMessages = () => {
//     setSavedMessage("");
//     setErrorMessage("");
//   };

//   const updateProfile = (key: keyof IProfile, value: string) => {
//     setProfile((current) => ({ ...current, [key]: value }));
//     clearMessages();
//   };

//   const saveProfile = async () => {
//     clearMessages();

//     try {
//       await saveProfileMutation({
//         fullName: [profile.firstName, profile.lastName]
//           .map((part) => part.trim())
//           .filter(Boolean)
//           .join(" "),
//         bio: profile.bio,
//       }).unwrap();

//       setSavedProfile({ ...profile });
//       setSavedMessage(t.saved);
//     } catch {
//       setErrorMessage(t.profileSaveError);
//     }
//   };

//   const cancelProfile = () => {
//     setProfile({ ...savedProfile });
//     clearMessages();
//   };

//   const saveNotificationPreferences = () => {
//     setSavedMessage(t.saved);
//     setErrorMessage("");
//   };

//   const toggleNotification = (key: keyof NotificationSettings) => {
//     setNotifications((current) => ({
//       ...current,
//       [key]: !current[key],
//     }));
//     clearMessages();
//   };

//   const updatePassword = () => {
//     clearMessages();

//     if (!passwords.current || !passwords.next || !passwords.confirm) {
//       setErrorMessage(t.passwordRequired);
//       return;
//     }

//     if (passwords.next.length < 8) {
//       setErrorMessage(t.passwordLength);
//       return;
//     }

//     if (passwords.next !== passwords.confirm) {
//       setErrorMessage(t.passwordMismatch);
//       return;
//     }

//     // Connect this handler to your backend password-update API.
//     setSavedMessage(t.passwordUpdated);
//     setPasswords({ current: "", next: "", confirm: "" });
//   };

//   const tabs: {
//     id: Tab;
//     title: string;
//     description: string;
//     Icon: typeof UserRound;
//   }[] = [
//     {
//       id: "profile",
//       title: t.profile,
//       description: t.profileDescription,
//       Icon: UserRound,
//     },
//     {
//       id: "security",
//       title: t.security,
//       description: t.securityDescription,
//       Icon: ShieldCheck,
//     },
//     {
//       id: "notifications",
//       title: t.notifications,
//       description: t.notificationsDescription,
//       Icon: Bell,
//     },
//   ];

// //   const inputClass =
// //     `w-full rounded-xl border px-4 py-3 text-[12px] outline-none transition ` +
// //     `${inputBg} focus:border-[#2eb5bc] focus:ring-4 focus:ring-[#2eb5bc]/10`;

// const inputClass =
//   `w-full rounded-xl border px-4 py-3 !text-[12px] outline-none transition ${inputBg} focus:border-[#2eb5bc] focus:ring-4 focus:ring-[#2eb5bc]/10`;

//   const fieldLabelClass = `mb-2 block text-[10px] font-medium ${textColor}`;

//   const renderPasswordField = (
//     label: string,
//     placeholder: string,
//     value: string,
//     key: keyof typeof passwords,
//     visible: boolean,
//     toggleVisibility: () => void,
//   ) => (
//     <label className="block">
//       <span className={fieldLabelClass}>{label}</span>
//       <span className="relative block">
//         <input
//           type={visible ? "text" : "password"}
//           value={value}
//           onChange={(event) => {
//             setPasswords((current) => ({
//               ...current,
//               [key]: event.target.value,
//             }));
//             clearMessages();
//           }}
//           placeholder={placeholder}
//           autoComplete={
//             key === "current"
//               ? "current-password"
//               : "new-password"
//           }
//           style={{ fontSize: "12px" }}
//           className={`${inputClass} ${isRTL ? "pl-12" : "pr-12"}`}
//         />
//         <button
//           type="button"
//           onClick={toggleVisibility}
//           aria-label={visible ? t.hidePassword : t.showPassword}
//           className={`absolute top-1/2 -translate-y-1/2 rounded-lg p-2 ${mutedColor} hover:text-[#238e94] ${
//             isRTL ? "left-2" : "right-2"
//           }`}
//         >
//           {visible ? <EyeOff size={17} /> : <Eye size={17} />}
//         </button>
//       </span>
//     </label>
//   );

//   return (
//     <main
//       dir={isRTL ? "rtl" : "ltr"}
//       lang={language}
//       className={`min-h-screen px-4 py-6 transition-colors duration-300 sm:px-6 lg:px-8 lg:py-10 ${pageBg} ${textColor}`}
//     >
//       <div className="mx-auto ">
//         {/* Page heading and preferences */}
//         <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#238e94]">
//               <UserRound size={15} />
//               <span>{t.settings}</span>
//             </div>

//             <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
//               {t.account}
//             </h1>

//             <p className={`mt-2 max-w-xl text-sm leading-6 ${mutedColor}`}>
//               {t.description}
//             </p>
//           </div>

//         </header>

//         {/* Feedback */}
//         {(savedMessage || errorMessage) && (
//           <div
//             role={errorMessage ? "alert" : "status"}
//             className={`mb-6 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
//               errorMessage
//                 ? isDark
//                   ? "border-red-900 bg-red-950/40 text-red-300"
//                   : "border-red-200 bg-red-50 text-red-700"
//                 : isDark
//                   ? "border-emerald-900 bg-emerald-950/40 text-emerald-300"
//                   : "border-emerald-200 bg-emerald-50 text-emerald-700"
//             }`}
//           >
//             {errorMessage ? (
//               <AlertCircle size={18} />
//             ) : (
//               <CheckCircle2 size={18} />
//             )}
//             <span>{errorMessage || savedMessage}</span>

//             <button
//               type="button"
//               onClick={clearMessages}
//               className="ms-auto rounded-lg p-1 opacity-70 hover:opacity-100"
//               aria-label={language === "ar" ? "إغلاق" : "Dismiss"}
//             >
//               <X size={16} />
//             </button>
//           </div>
//         )}

//         <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
//           {/* Sidebar */}
//           <aside className={`overflow-hidden rounded-2xl border shadow-sm ${borderColor} ${cardBg}`}>
//             <div className={`flex flex-col items-center border-b px-6 py-8 text-center ${borderColor}`}>
//               <div className="relative mb-4">
//                 <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(145deg,#47759c,#2eb5bc)] text-3xl font-bold text-white ring-4 ring-[#2eb5bc]/10">
//                     {profile.firstName.trim().charAt(0) || "?"}
//                 </div>

//                 <button
//                   type="button"
//                   onClick={() => {
//                     setSavedMessage(
//                       language === "ar"
//                         ? "اربط زر الصورة بخدمة رفع الصور لتغييرها."
//                         : "Connect the avatar button to your image upload service.",
//                     );
//                     setErrorMessage("");
//                   }}
//                   aria-label={language === "ar" ? "تغيير الصورة" : "Change avatar"}
//                   className={`absolute bottom-0 inset-e-0 rounded-full border shadow-sm transition hover:bg-[#e8f8f8] ${isDark ? "border-[#374151] bg-[#273449] text-[#7de0e2]" : "border-[#ccebec] bg-white p-2 text-[#238e94]"}`}
//                 >
//                   <Camera size={14} />
//                 </button>
//               </div>

//               <h2 className="text-lg font-bold">
//                 {[profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
//                   t.account}
//               </h2>

//               <p className={`mt-1 text-sm ${mutedColor}`}>
//                 {(typeof profile.jobTitle === "string" ? profile.jobTitle : profile.jobTitle?.name) || t.projectManager}
//               </p> 

//               <span className="mt-4 rounded-full bg-[#e8f8f8] px-3 py-1.5 text-xs font-semibold text-[#238e94]">
//                 {t.professionalPlan}
//               </span>
//             </div>

//             <nav className="space-y-1 p-3" aria-label={t.settings}>
//               {tabs.map(({ id, title, description, Icon }) => {
//                 const active = tab === id;
//                 const Chevron = isRTL ? ChevronLeft : ChevronRight;

//                 return (
//                   <button
//                     key={id}
//                     type="button"
//                     onClick={() => {
//                       setTab(id);
//                       clearMessages();
//                     }}
//                     aria-current={active ? "page" : undefined}
//                     className={`flex w-full items-center gap-3 rounded-xl border p-3 text-start transition ${
//                       active
//                         ? isDark
//                           ? "border-[#2eb5bc]/30 bg-[#e8f8f8] text-[#238e94]"
//                           : "border-[#ccebec] bg-[#e8f8f8] text-[#238e94]"
//                         : `border-transparent ${textColor} hover:bg-[#f7f7f9]0/5`
//                     }`}
//                   >
//                     <span
//                       className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
//                         active
//                           ? "bg-[#e8f8f8]"
//                           : isDark
//                             ? "bg-[#273449]"
//                             : "bg-[#f0f0f4]"
//                       }`}
//                     >
//                       <Icon size={19} />
//                     </span>

//                     <span className="min-w-0 flex-1">
//                       <span className="block text-sm font-semibold">
//                         {title}
//                       </span>
//                       <span className={`mt-1 block text-xs leading-5 ${mutedColor}`}>
//                         {description}
//                       </span>
//                     </span>

//                     <Chevron size={16} className={mutedColor} />
//                   </button>
//                 );
//               })}
//             </nav>
//           </aside>

//           {/* Main panel */}
//           <section className={`min-w-0 rounded-2xl border shadow-sm ${borderColor} ${cardBg}`}>
//             {/* Profile */}
//             {tab === "profile" && (
//               <form
//                 onSubmit={(event) => {
//                   event.preventDefault();
//                   saveProfile();
//                 }}
//               >
//                 <div className={`flex flex-col gap-3 border-b px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 ${borderColor}`}>
//                   <div>
//                     <h2 className="text-xl font-bold">{t.personalInfo}</h2>
//                     <p className={`mt-1 text-sm leading-6 ${mutedColor}`}>
//                       {t.personalInfoDescription}
//                     </p>
//                   </div>

//                   <span className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
//                     isDark
//                       ? "bg-emerald-950 text-emerald-300"
//                       : "bg-emerald-50 text-emerald-700"
//                   }`}>
//                     {t.completion} 90%
//                   </span>
//                 </div>

//                 <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-8">
//                   <label className="block">
//                     <span className={fieldLabelClass}>{t.firstName}</span>
//                     <span className="relative block">
//                       <UserRound
//                         size={17}
//                         className={`absolute top-1/2 -translate-y-1/2 ${mutedColor} ${
//                           isRTL ? "right-4" : "left-4"
//                         }`}
//                       />
//                       <input
//                         value={profile.firstName}
//                         onChange={(e) => updateProfile("firstName", e.target.value)}
//                         autoComplete="given-name"
//                         style={{ fontSize: "12px" }}
//                         className={`${inputClass} ${isRTL ? "pr-11" : "pl-11"}`}
//                       />
//                     </span>
//                   </label>

//                   <label className="block">
//                     <span className={fieldLabelClass}>{t.lastName}</span>
//                     <input
//                       value={profile.lastName}
//                       onChange={(e) => updateProfile("lastName", e.target.value)}
//                       autoComplete="family-name"
//                       style={{ fontSize: "12px" }}
//                       className={inputClass}
//                     />
//                   </label>

//                   <label className="block sm:col-span-2">
//                     <span className={fieldLabelClass}>{t.emailAddress}</span>
//                     <span className="relative block">
//                       <Mail
//                         size={17}
//                         className={`absolute top-1/2 -translate-y-1/2 ${mutedColor} ${
//                           isRTL ? "right-4" : "left-4"
//                         }`}
//                       />
//                       <input
//                         type="email"
//                         value={profile.email}
//                         readOnly
//                         aria-describedby="email-hint"
//                         autoComplete="email"
//                         style={{ fontSize: "12px" }}
//                         className={`${inputClass} cursor-not-allowed opacity-75 ${isRTL ? "pr-11 pl-24" : "pl-11 pr-24"}`}
//                       />
//                       <span className={`absolute top-1/2 flex -translate-y-1/2 items-center gap-1 text-xs font-semibold text-emerald-500 ${
//                         isRTL ? "left-3" : "right-3"
//                       }`}>
//                         <Check size={13} />
//                         {t.verified}
//                       </span>
//                     </span>
//                     <span id="email-hint" className={`mt-1 block text-xs ${mutedColor}`}>
//                       {t.emailHint}
//                     </span>
//                   </label>

//                   <label className="block">
//                     <span className={fieldLabelClass}>{t.jobTitle}</span>
//                     <span className="relative block">
//                       <BriefcaseBusiness
//                         size={17}
//                         className={`absolute top-1/2 -translate-y-1/2 ${mutedColor} ${
//                           isRTL ? "right-4" : "left-4"
//                         }`}
//                       />
//                       <input
//                         value={ typeof profile.jobTitle === "string" ? profile.jobTitle : profile.jobTitle?.name ?? ""}
//                         readOnly
//                         autoComplete="organization-title"
//                         style={{ fontSize: "12px" }}
//                         className={`${inputClass} cursor-not-allowed opacity-75 ${isRTL ? "pr-11" : "pl-11"}`}
//                       />
//                     </span>
//                   </label>

//                   <label className="block">
//                     <span className={fieldLabelClass}>{t.phone}</span>
//                     <span className="relative block">
//                       <Phone
//                         size={17}
//                         className={`absolute top-1/2 -translate-y-1/2 ${mutedColor} ${
//                           isRTL ? "right-4" : "left-4"
//                         }`}
//                       />
//                       <input
//                         type="tel"
//                         dir="ltr"
//                         value={profile.phone}
//                         readOnly
//                         autoComplete="tel"
//                         style={{ fontSize: "12px" }}
//                         className={`${inputClass} cursor-not-allowed opacity-75 text-start ${isRTL ? "pr-11" : "pl-11"}`}
//                       />
//                     </span>
//                   </label>

//                   <label className="block sm:col-span-2">
//                     <span className={fieldLabelClass}>{t.bio}</span>
//                     <span className="relative block">
//                       <FileText
//                         size={17}
//                         className={`absolute top-4 ${mutedColor} ${
//                           isRTL ? "right-4" : "left-4"
//                         }`}
//                       />
//                       <textarea
//                         rows={4}
//                         value={profile.bio}
//                         onChange={(e) => updateProfile("bio", e.target.value)}
//                         style={{ fontSize: "12px" }}
//                         className={`${inputClass} resize-y leading-6 ${isRTL ? "pr-11" : "pl-11"}`}
//                       />
//                     </span>
//                   </label>
//                 </div>

//                 <div className={`flex flex-wrap items-center gap-3 border-t px-5 py-5 sm:px-8 ${borderColor}`}>
//                   <button
//                     type="submit"
//                     disabled={isSaving}
//                     className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2eb5bc] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#269fa6] focus:outline-none focus:ring-4 focus:ring-[#2eb5bc]/20 disabled:cursor-not-allowed disabled:opacity-60"
//                   >
//                     <Save size={16} />
//                     {isSaving
//                       ? language === "ar" ? "جارٍ الحفظ..." : "Saving..."
//                       : t.save}
//                   </button>

//                   <button
//                     type="button"
//                     onClick={cancelProfile}
//                     className={`inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition hover:bg-[#f7f7f9]0/5 ${borderColor}`}
//                   >
//                     <X size={16} />
//                     {t.cancel}
//                   </button>
//                 </div>
//               </form>
//             )}

//             {/* Security */}
//             {tab === "security" && (
//               <form
//                 onSubmit={(event) => {
//                   event.preventDefault();
//                   updatePassword();
//                 }}
//               >
//                 <div className={`flex flex-col gap-3 border-b px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 ${borderColor}`}>
//                   <div>
//                     <h2 className="text-xl font-bold">{t.securityTitle}</h2>
//                     <p className={`mt-1 text-sm leading-6 ${mutedColor}`}>
//                       {t.securityDescriptionText}
//                     </p>
//                   </div>

//                   <span className={`flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
//                     isDark
//                       ? "bg-emerald-950 text-emerald-300"
//                       : "bg-emerald-50 text-emerald-700"
//                   }`}>
//                     <ShieldCheck size={14} />
//                     {t.secureAccount}
//                   </span>
//                 </div>

//                 <div className="space-y-6 p-5 sm:p-8">
//                   <div className={`flex items-start gap-4 rounded-xl border p-4 ${borderColor} ${
//                     isDark ? "bg-[#111827]/70" : "bg-[#f7f7f9]"
//                   }`}>
//                     <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f8f8] text-[#238e94]">
//                       <LockKeyhole size={20} />
//                     </span>
//                     <div>
//                       <h3 className="text-sm font-semibold">{t.passwordChanged}</h3>
//                       <p className={`mt-1 text-sm leading-6 ${mutedColor}`}>
//                         {t.passwordChangedDescription}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="grid gap-5 sm:grid-cols-2">
//                     <div className="sm:col-span-2">
//                       {renderPasswordField(
//                         t.currentPassword,
//                         t.currentPasswordPlaceholder,
//                         passwords.current,
//                         "current",
//                         showCurrentPassword,
//                         () => setShowCurrentPassword((v) => !v),
//                       )}
//                     </div>

//                     {renderPasswordField(
//                       t.newPassword,
//                       t.newPasswordPlaceholder,
//                       passwords.next,
//                       "next",
//                       showNewPassword,
//                       () => setShowNewPassword((v) => !v),
//                     )}

//                     {renderPasswordField(
//                       t.confirmPassword,
//                       t.confirmPasswordPlaceholder,
//                       passwords.confirm,
//                       "confirm",
//                       showConfirmPassword,
//                       () => setShowConfirmPassword((v) => !v),
//                     )}
//                   </div>
//                 </div>

//                 <div className={`border-t px-5 py-5 sm:px-8 ${borderColor}`}>
//                   <button
//                     type="submit"
//                     className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2eb5bc] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#269fa6] focus:outline-none focus:ring-4 focus:ring-[#2eb5bc]/20"
//                   >
//                     <ShieldCheck size={16} />
//                     {t.updatePassword}
//                   </button>
//                 </div>
//               </form>
//             )}

//             {/* Notifications */}
//             {tab === "notifications" && (
//               <>
//                 <div className={`border-b px-5 py-6 sm:px-8 ${borderColor}`}>
//                   <h2 className="text-xl font-bold">{t.notificationTitle}</h2>
//                   <p className={`mt-1 text-sm leading-6 ${mutedColor}`}>
//                     {t.notificationDescription}
//                   </p>
//                 </div>

//                 <div className="px-5 sm:px-8">
//                   {(
//                     [
//                       {
//                         key: "tasks",
//                         title: t.taskUpdates,
//                         description: t.taskUpdatesDescription,
//                       },
//                       {
//                         key: "projects",
//                         title: t.projectUpdates,
//                         description: t.projectUpdatesDescription,
//                       },
//                       {
//                         key: "email",
//                         title: t.weeklyEmail,
//                         description: t.weeklyEmailDescription,
//                       },
//                     ] as const
//                   ).map((item) => {
//                     const checked = notifications[item.key];

//                     return (
//                       <div
//                         key={item.key}
//                         className={`flex items-center justify-between gap-4 border-b py-6 last:border-b-0 ${borderColor}`}
//                       >
//                         <div className="min-w-0">
//                           <h3 className="text-sm font-semibold">{item.title}</h3>
//                           <p className={`mt-1 text-sm leading-6 ${mutedColor}`}>
//                             {item.description}
//                           </p>
//                         </div>

//                         <button
//                           type="button"
//                           role="switch"
//                           aria-checked={checked}
//                           aria-label={item.title}
//                           onClick={() => toggleNotification(item.key)}
//                           className={`relative h-7 w-12 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-[#2eb5bc]/20 ${
//                             checked
//                               ? "bg-[#2eb5bc]"
//                               : isDark
//                                 ? "bg-[#374151]"
//                                 : "bg-[#d1d5db]"
//                           }`}
//                         >
//                           <span
//                             className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
//                               checked
//                                 ? isRTL ? "right-1" : "left-1"
//                                 : isRTL ? "left-1" : "right-1"
//                             }`}
//                           />
//                         </button>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 <div className={`border-t px-5 py-5 sm:px-8 ${borderColor}`}>
//                   <button
//                     type="button"
//                     onClick={saveNotificationPreferences}
//                     className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2eb5bc] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#269fa6] focus:outline-none focus:ring-4 focus:ring-[#2eb5bc]/20"
//                   >
//                     <Save size={16} />
//                     {t.savePreferences}
//                   </button>
//                 </div>
//               </>
//             )}
//           </section>
//         </div>
//       </div>
//     </main>
//   );
// }




"use client";

import { useState } from "react";
import { UserRound, ShieldCheck, Bell, Camera, Check, ChevronLeft, ChevronRight, LockKeyhole, Mail, Phone, BriefcaseBusiness, FileText, Save, X, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { useDashboardLayout } from "@/app/components/DashboardLayout";
import type { IProfile } from "@/app/interfaces/profile-interface";
import { translations } from "@/app/translations/profile-translations";
import { useAuth } from "@/app/context/AuthContext";

type Tab = "profile" | "security" | "notifications";
type Language = "ar" | "en";



type NotificationSettings = {
  tasks: boolean;
  projects: boolean;
  email: boolean;
};

const initialNotifications: NotificationSettings = {
  tasks: true,
  projects: true,
  email: false,
};



function mapApiProfileToForm(apiProfile: IProfile): IProfile {
  const nameParts = (apiProfile.fullName ?? "").trim().split(/\s+/);

  return {
    ...apiProfile,
    firstName: nameParts[0] ?? "",
    lastName: nameParts.slice(1).join(" "),
    email: apiProfile.email ?? "",
    jobTitle: typeof apiProfile.jobTitle === "string" ? apiProfile.jobTitle : apiProfile.jobTitle?.name ?? "",
    phone: apiProfile.phone ?? "",
    bio: apiProfile.bio ?? "",
  };
}

export default function AccountPage() {
  const { lang, isArabic, darkMode } = useDashboardLayout();
  const { user, isLoading } = useAuth();

  const language: Language = lang;
  const t = translations[language];
  const pageBg = darkMode ? "bg-[#111827]" : "bg-[#f7f7f9]";
  const textColor = darkMode ? "text-[#e5e7eb]" : "text-[#202126]";

  if (isLoading) {
    return (
      <main
        dir={isArabic ? "rtl" : "ltr"}
        lang={language}
        className={`flex min-h-screen items-center justify-center ${pageBg} ${textColor}`}
      >
        <p className="text-sm">
          {language === "ar"
            ? "جارٍ تحميل بيانات الحساب..."
            : "Loading account details..."}
        </p>
      </main>
    );
  }

  if (!user) {
    return (
      <main
        dir={isArabic ? "rtl" : "ltr"}
        lang={language}
        className={`flex min-h-screen items-center justify-center ${pageBg} ${textColor}`}
      >
        <p role="alert" className="text-sm">
          {t.profileLoadError}
        </p>
      </main>
    );
  }

  const profileData = user as unknown as IProfile;

  return (
    <AccountPageContent
      key={String(profileData.id ?? profileData.email ?? profileData.fullName)}
      apiProfile={profileData}
    />
  );
}

function AccountPageContent({ apiProfile }: { apiProfile: IProfile }) {
  const { lang, isArabic, darkMode} = useDashboardLayout();

  const [tab, setTab] = useState<Tab>("profile");
  const language: Language = lang;

  const t = translations[language];
  const isRTL = isArabic;
  const isDark = darkMode;

  const [profile, setProfile] = useState<IProfile>(() =>
    mapApiProfileToForm(apiProfile)
  );
  const [savedProfile, setSavedProfile] = useState<IProfile>(() =>
    mapApiProfileToForm(apiProfile)
  );

  const [notifications, setNotifications] =
    useState<NotificationSettings>(initialNotifications);

  const [savedMessage, setSavedMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });


  const pageBg = isDark ? "bg-[#111827]" : "bg-[#f7f7f9]";
  const cardBg = isDark ? "bg-[#1f2937]" : "bg-white";
  const borderColor = isDark ? "border-[#374151]" : "border-[#e9e9ee]";
  const textColor = isDark ? "text-[#e5e7eb]" : "text-[#202126]";
  const mutedColor = isDark ? "text-[#9ca3af]" : "text-[#858592]";
  const inputBg = isDark
    ? "bg-[#111827] border-[#374151] text-[#e5e7eb] placeholder:text-[#6b7280]"
    : "bg-white border-[#e6e6eb] text-[#202126] placeholder:text-[#a0a1aa]";


  const clearMessages = () => {
    setSavedMessage("");
    setErrorMessage("");
  };

  const updateProfile = (key: keyof IProfile, value: string) => {
    setProfile((current) => ({ ...current, [key]: value }));
    clearMessages();
  };

  // This updates the local form state only.
  // Connect this handler to your backend API to persist changes.
  const saveProfile = () => {
    clearMessages();
    setSavedProfile({ ...profile });
    setSavedMessage(t.saved);
  };

  const cancelProfile = () => {
    setProfile({ ...savedProfile });
    clearMessages();
  };

  const saveNotificationPreferences = () => {
    setSavedMessage(t.saved);
    setErrorMessage("");
  };

  const toggleNotification = (key: keyof NotificationSettings) => {
    setNotifications((current) => ({
      ...current,
      [key]: !current[key],
    }));
    clearMessages();
  };

  const updatePassword = () => {
    clearMessages();

    if (!passwords.current || !passwords.next || !passwords.confirm) {
      setErrorMessage(t.passwordRequired);
      return;
    }

    if (passwords.next.length < 8) {
      setErrorMessage(t.passwordLength);
      return;
    }

    if (passwords.next !== passwords.confirm) {
      setErrorMessage(t.passwordMismatch);
      return;
    }

    // Connect this handler to your backend password-update API.
    setSavedMessage(t.passwordUpdated);
    setPasswords({ current: "", next: "", confirm: "" });
  };

  const tabs: {
    id: Tab;
    title: string;
    description: string;
    Icon: typeof UserRound;
  }[] = [
    {
      id: "profile",
      title: t.profile,
      description: t.profileDescription,
      Icon: UserRound,
    },
    {
      id: "security",
      title: t.security,
      description: t.securityDescription,
      Icon: ShieldCheck,
    },
    {
      id: "notifications",
      title: t.notifications,
      description: t.notificationsDescription,
      Icon: Bell,
    },
  ];

//   const inputClass =
//     `w-full rounded-xl border px-4 py-3 text-[12px] outline-none transition ` +
//     `${inputBg} focus:border-[#2eb5bc] focus:ring-4 focus:ring-[#2eb5bc]/10`;

const inputClass =
  `w-full rounded-xl border px-4 py-3 !text-[12px] outline-none transition ${inputBg} focus:border-[#2eb5bc] focus:ring-4 focus:ring-[#2eb5bc]/10`;

  const fieldLabelClass = `mb-2 block text-[10px] font-medium ${textColor}`;

  const renderPasswordField = (
    label: string,
    placeholder: string,
    value: string,
    key: keyof typeof passwords,
    visible: boolean,
    toggleVisibility: () => void,
  ) => (
    <label className="block">
      <span className={fieldLabelClass}>{label}</span>
      <span className="relative block">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => {
            setPasswords((current) => ({
              ...current,
              [key]: event.target.value,
            }));
            clearMessages();
          }}
          placeholder={placeholder}
          autoComplete={
            key === "current"
              ? "current-password"
              : "new-password"
          }
          style={{ fontSize: "12px" }}
          className={`${inputClass} ${isRTL ? "pl-12" : "pr-12"}`}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          aria-label={visible ? t.hidePassword : t.showPassword}
          className={`absolute top-1/2 -translate-y-1/2 rounded-lg p-2 ${mutedColor} hover:text-[#238e94] ${
            isRTL ? "left-2" : "right-2"
          }`}
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </span>
    </label>
  );

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      lang={language}
      className={`min-h-screen px-4 py-6 transition-colors duration-300 sm:px-6 lg:px-8 lg:py-10 ${pageBg} ${textColor}`}
    >
      <div className="mx-auto ">
        {/* Page heading and preferences */}
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#238e94]">
              <UserRound size={15} />
              <span>{t.settings}</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t.account}
            </h1>

            <p className={`mt-2 max-w-xl text-sm leading-6 ${mutedColor}`}>
              {t.description}
            </p>
          </div>

        </header>

        {/* Feedback */}
        {(savedMessage || errorMessage) && (
          <div
            role={errorMessage ? "alert" : "status"}
            className={`mb-6 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
              errorMessage
                ? isDark
                  ? "border-red-900 bg-red-950/40 text-red-300"
                  : "border-red-200 bg-red-50 text-red-700"
                : isDark
                  ? "border-emerald-900 bg-emerald-950/40 text-emerald-300"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {errorMessage ? (
              <AlertCircle size={18} />
            ) : (
              <CheckCircle2 size={18} />
            )}
            <span>{errorMessage || savedMessage}</span>

            <button
              type="button"
              onClick={clearMessages}
              className="ms-auto rounded-lg p-1 opacity-70 hover:opacity-100"
              aria-label={language === "ar" ? "إغلاق" : "Dismiss"}
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className={`overflow-hidden rounded-2xl border shadow-sm ${borderColor} ${cardBg}`}>
            <div className={`flex flex-col items-center border-b px-6 py-8 text-center ${borderColor}`}>
              <div className="relative mb-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(145deg,#47759c,#2eb5bc)] text-3xl font-bold text-white ring-4 ring-[#2eb5bc]/10">
                    {profile.firstName.trim().charAt(0) || "?"}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSavedMessage(
                      language === "ar"
                        ? "اربط زر الصورة بخدمة رفع الصور لتغييرها."
                        : "Connect the avatar button to your image upload service.",
                    );
                    setErrorMessage("");
                  }}
                  aria-label={language === "ar" ? "تغيير الصورة" : "Change avatar"}
                  className={`absolute bottom-0 inset-e-0 rounded-full border shadow-sm transition hover:bg-[#e8f8f8] ${isDark ? "border-[#374151] bg-[#273449] text-[#7de0e2]" : "border-[#ccebec] bg-white p-2 text-[#238e94]"}`}
                >
                  <Camera size={14} />
                </button>
              </div>

              <h2 className="text-lg font-bold">
                {[profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
                  t.account}
              </h2>

              <p className={`mt-1 text-sm ${mutedColor}`}>
                {(typeof profile.jobTitle === "string" ? profile.jobTitle : profile.jobTitle?.name) || t.projectManager}
              </p> 

              <span className="mt-4 rounded-full bg-[#e8f8f8] px-3 py-1.5 text-xs font-semibold text-[#238e94]">
                {t.professionalPlan}
              </span>
            </div>

            <nav className="space-y-1 p-3" aria-label={t.settings}>
              {tabs.map(({ id, title, description, Icon }) => {
                const active = tab === id;
                const Chevron = isRTL ? ChevronLeft : ChevronRight;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setTab(id);
                      clearMessages();
                    }}
                    aria-current={active ? "page" : undefined}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-start transition ${
                      active
                        ? isDark
                          ? "border-[#2eb5bc]/30 bg-[#e8f8f8] text-[#238e94]"
                          : "border-[#ccebec] bg-[#e8f8f8] text-[#238e94]"
                        : `border-transparent ${textColor} hover:bg-[#f7f7f9]0/5`
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        active
                          ? "bg-[#e8f8f8]"
                          : isDark
                            ? "bg-[#273449]"
                            : "bg-[#f0f0f4]"
                      }`}
                    >
                      <Icon size={19} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">
                        {title}
                      </span>
                      <span className={`mt-1 block text-xs leading-5 ${mutedColor}`}>
                        {description}
                      </span>
                    </span>

                    <Chevron size={16} className={mutedColor} />
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main panel */}
          <section className={`min-w-0 rounded-2xl border shadow-sm ${borderColor} ${cardBg}`}>
            {/* Profile */}
            {tab === "profile" && (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  saveProfile();
                }}
              >
                <div className={`flex flex-col gap-3 border-b px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 ${borderColor}`}>
                  <div>
                    <h2 className="text-xl font-bold">{t.personalInfo}</h2>
                    <p className={`mt-1 text-sm leading-6 ${mutedColor}`}>
                      {t.personalInfoDescription}
                    </p>
                  </div>

                  <span className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
                    isDark
                      ? "bg-emerald-950 text-emerald-300"
                      : "bg-emerald-50 text-emerald-700"
                  }`}>
                    {t.completion} 90%
                  </span>
                </div>

                <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-8">
                  <label className="block">
                    <span className={fieldLabelClass}>{t.firstName}</span>
                    <span className="relative block">
                      <UserRound
                        size={17}
                        className={`absolute top-1/2 -translate-y-1/2 ${mutedColor} ${
                          isRTL ? "right-4" : "left-4"
                        }`}
                      />
                      <input
                        value={profile.firstName}
                        onChange={(e) => updateProfile("firstName", e.target.value)}
                        autoComplete="given-name"
                        style={{ fontSize: "12px" }}
                        className={`${inputClass} ${isRTL ? "pr-11" : "pl-11"}`}
                      />
                    </span>
                  </label>

                  <label className="block">
                    <span className={fieldLabelClass}>{t.lastName}</span>
                    <input
                      value={profile.lastName}
                      onChange={(e) => updateProfile("lastName", e.target.value)}
                      autoComplete="family-name"
                      style={{ fontSize: "12px" }}
                      className={inputClass}
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className={fieldLabelClass}>{t.emailAddress}</span>
                    <span className="relative block">
                      <Mail
                        size={17}
                        className={`absolute top-1/2 -translate-y-1/2 ${mutedColor} ${
                          isRTL ? "right-4" : "left-4"
                        }`}
                      />
                      <input
                        type="email"
                        value={profile.email}
                        readOnly
                        aria-describedby="email-hint"
                        autoComplete="email"
                        style={{ fontSize: "12px" }}
                        className={`${inputClass} cursor-not-allowed opacity-75 ${isRTL ? "pr-11 pl-24" : "pl-11 pr-24"}`}
                      />
                      <span className={`absolute top-1/2 flex -translate-y-1/2 items-center gap-1 text-xs font-semibold text-emerald-500 ${
                        isRTL ? "left-3" : "right-3"
                      }`}>
                        <Check size={13} />
                        {t.verified}
                      </span>
                    </span>
                    <span id="email-hint" className={`mt-1 block text-xs ${mutedColor}`}>
                      {t.emailHint}
                    </span>
                  </label>

                  <label className="block">
                    <span className={fieldLabelClass}>{t.jobTitle}</span>
                    <span className="relative block">
                      <BriefcaseBusiness
                        size={17}
                        className={`absolute top-1/2 -translate-y-1/2 ${mutedColor} ${
                          isRTL ? "right-4" : "left-4"
                        }`}
                      />
                      <input
                        value={ typeof profile.jobTitle === "string" ? profile.jobTitle : profile.jobTitle?.name ?? ""}
                        readOnly
                        autoComplete="organization-title"
                        style={{ fontSize: "12px" }}
                        className={`${inputClass} cursor-not-allowed opacity-75 ${isRTL ? "pr-11" : "pl-11"}`}
                      />
                    </span>
                  </label>

                  <label className="block">
                    <span className={fieldLabelClass}>{t.phone}</span>
                    <span className="relative block">
                      <Phone
                        size={17}
                        className={`absolute top-1/2 -translate-y-1/2 ${mutedColor} ${
                          isRTL ? "right-4" : "left-4"
                        }`}
                      />
                      <input
                        type="tel"
                        dir="ltr"
                        value={profile.phone}
                        readOnly
                        autoComplete="tel"
                        style={{ fontSize: "12px" }}
                        className={`${inputClass} cursor-not-allowed opacity-75 text-start ${isRTL ? "pr-11" : "pl-11"}`}
                      />
                    </span>
                  </label>

                  <label className="block sm:col-span-2">
                    <span className={fieldLabelClass}>{t.bio}</span>
                    <span className="relative block">
                      <FileText
                        size={17}
                        className={`absolute top-4 ${mutedColor} ${
                          isRTL ? "right-4" : "left-4"
                        }`}
                      />
                      <textarea
                        rows={4}
                        value={profile.bio}
                        onChange={(e) => updateProfile("bio", e.target.value)}
                        style={{ fontSize: "12px" }}
                        className={`${inputClass} resize-y leading-6 ${isRTL ? "pr-11" : "pl-11"}`}
                      />
                    </span>
                  </label>
                </div>

                <div className={`flex flex-wrap items-center gap-3 border-t px-5 py-5 sm:px-8 ${borderColor}`}>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2eb5bc] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#269fa6] focus:outline-none focus:ring-4 focus:ring-[#2eb5bc]/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save size={16} />
                    {t.save}
                  </button>

                  <button
                    type="button"
                    onClick={cancelProfile}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition hover:bg-[#f7f7f9]0/5 ${borderColor}`}
                  >
                    <X size={16} />
                    {t.cancel}
                  </button>
                </div>
              </form>
            )}

            {/* Security */}
            {tab === "security" && (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  updatePassword();
                }}
              >
                <div className={`flex flex-col gap-3 border-b px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 ${borderColor}`}>
                  <div>
                    <h2 className="text-xl font-bold">{t.securityTitle}</h2>
                    <p className={`mt-1 text-sm leading-6 ${mutedColor}`}>
                      {t.securityDescriptionText}
                    </p>
                  </div>

                  <span className={`flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                    isDark
                      ? "bg-emerald-950 text-emerald-300"
                      : "bg-emerald-50 text-emerald-700"
                  }`}>
                    <ShieldCheck size={14} />
                    {t.secureAccount}
                  </span>
                </div>

                <div className="space-y-6 p-5 sm:p-8">
                  <div className={`flex items-start gap-4 rounded-xl border p-4 ${borderColor} ${
                    isDark ? "bg-[#111827]/70" : "bg-[#f7f7f9]"
                  }`}>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f8f8] text-[#238e94]">
                      <LockKeyhole size={20} />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold">{t.passwordChanged}</h3>
                      <p className={`mt-1 text-sm leading-6 ${mutedColor}`}>
                        {t.passwordChangedDescription}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      {renderPasswordField(
                        t.currentPassword,
                        t.currentPasswordPlaceholder,
                        passwords.current,
                        "current",
                        showCurrentPassword,
                        () => setShowCurrentPassword((v) => !v),
                      )}
                    </div>

                    {renderPasswordField(
                      t.newPassword,
                      t.newPasswordPlaceholder,
                      passwords.next,
                      "next",
                      showNewPassword,
                      () => setShowNewPassword((v) => !v),
                    )}

                    {renderPasswordField(
                      t.confirmPassword,
                      t.confirmPasswordPlaceholder,
                      passwords.confirm,
                      "confirm",
                      showConfirmPassword,
                      () => setShowConfirmPassword((v) => !v),
                    )}
                  </div>
                </div>

                <div className={`border-t px-5 py-5 sm:px-8 ${borderColor}`}>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2eb5bc] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#269fa6] focus:outline-none focus:ring-4 focus:ring-[#2eb5bc]/20"
                  >
                    <ShieldCheck size={16} />
                    {t.updatePassword}
                  </button>
                </div>
              </form>
            )}

            {/* Notifications */}
            {tab === "notifications" && (
              <>
                <div className={`border-b px-5 py-6 sm:px-8 ${borderColor}`}>
                  <h2 className="text-xl font-bold">{t.notificationTitle}</h2>
                  <p className={`mt-1 text-sm leading-6 ${mutedColor}`}>
                    {t.notificationDescription}
                  </p>
                </div>

                <div className="px-5 sm:px-8">
                  {(
                    [
                      {
                        key: "tasks",
                        title: t.taskUpdates,
                        description: t.taskUpdatesDescription,
                      },
                      {
                        key: "projects",
                        title: t.projectUpdates,
                        description: t.projectUpdatesDescription,
                      },
                      {
                        key: "email",
                        title: t.weeklyEmail,
                        description: t.weeklyEmailDescription,
                      },
                    ] as const
                  ).map((item) => {
                    const checked = notifications[item.key];

                    return (
                      <div
                        key={item.key}
                        className={`flex items-center justify-between gap-4 border-b py-6 last:border-b-0 ${borderColor}`}
                      >
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold">{item.title}</h3>
                          <p className={`mt-1 text-sm leading-6 ${mutedColor}`}>
                            {item.description}
                          </p>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={checked}
                          aria-label={item.title}
                          onClick={() => toggleNotification(item.key)}
                          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-[#2eb5bc]/20 ${
                            checked
                              ? "bg-[#2eb5bc]"
                              : isDark
                                ? "bg-[#374151]"
                                : "bg-[#d1d5db]"
                          }`}
                        >
                          <span
                            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
                              checked
                                ? isRTL ? "right-1" : "left-1"
                                : isRTL ? "left-1" : "right-1"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className={`border-t px-5 py-5 sm:px-8 ${borderColor}`}>
                  <button
                    type="button"
                    onClick={saveNotificationPreferences}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2eb5bc] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#269fa6] focus:outline-none focus:ring-4 focus:ring-[#2eb5bc]/20"
                  >
                    <Save size={16} />
                    {t.savePreferences}
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
