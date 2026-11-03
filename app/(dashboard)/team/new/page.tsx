
// "use client";

// import { FormEvent, useState} from "react";
// import {
//   ArrowLeft,
//   ArrowRight,
//   UserPlus,
//   UserRound,
//   Mail,
//   LockKeyhole,
//   BriefcaseBusiness,
//   ShieldCheck,
//   CheckCircle2,
//   X,
//   Eye,
//   EyeOff,
//   Info,
// } from "lucide-react";
// import { useDashboardLayout } from "@/app/components/DashboardLayout";


// interface EmployeeForm {
//   fullName: string;
//   email: string;
//   password: string;
//   roleId: string;
//   jobTitleId: string;
//   isActive: boolean;
// }

// export default function AddEmployeePage() {
//   const { isArabic, darkMode } = useDashboardLayout();

//   const [form, setForm] = useState<EmployeeForm>({
//     fullName: "",
//     email: "",
//     password: "",
//     roleId: "",
//     jobTitleId: "",
//     isActive: true,
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState<
//     Partial<Record<keyof EmployeeForm, string>>
//   >({});
//   const [notice, setNotice] = useState(false);

//   // Temporary design options. Replace these with API data later.
//   const roles = [
//     { id: "role-admin", name: isArabic ? "مدير النظام" : "Admin" },
//     { id: "role-manager", name: isArabic ? "مدير" : "Manager" },
//     { id: "role-member", name: isArabic ? "عضو فريق" : "Team Member" },
//   ];

//   const jobTitles = [
//     { id: "job-developer", name: isArabic ? "مطور برمجيات" : "Software Developer" },
//     { id: "job-analyst", name: isArabic ? "محلل" : "Analyst" },
//     { id: "job-supervisor", name: isArabic ? "مشرف" : "Supervisor" },
//   ];

//   const isDark = darkMode;
//   const pageBg = isDark ? "bg-[#101820]" : "bg-[#f5f8fb]";
//   const cardBg = isDark ? "bg-[#182630]" : "bg-white";
//   const borderColor = isDark ? "border-slate-700" : "border-slate-200";
//   const headingColor = isDark ? "text-white" : "text-slate-800";
//   const mutedColor = isDark ? "text-slate-400" : "text-slate-500";

//   const inputClass = `
//     w-full rounded-xl border ${borderColor}
//     ${isDark ? "bg-[#111d26] text-white" : "bg-white text-slate-800"}
//     px-4 py-3 text-sm outline-none transition
//     focus:border-[#47759c] focus:ring-2 focus:ring-[#47759c]/15
//   `;

//   const labelClass = `mb-2 block text-sm font-semibold ${headingColor}`;

//   const t = {
//     title: isArabic ? "إضافة موظف جديد" : "Add New Employee",
//     subtitle: isArabic
//       ? "أضف بيانات الموظف وحدد دوره وصلاحياته داخل النظام."
//       : "Add employee details and configure their access to the system.",
//     team: isArabic ? "الفريق" : "Team",
//     back: isArabic ? "رجوع" : "Back",
//     personal: isArabic ? "البيانات الشخصية" : "Personal Information",
//     personalDesc: isArabic
//       ? "أدخل الاسم والبريد الإلكتروني وكلمة المرور."
//       : "Enter the employee's name, email, and password.",
//     fullName: isArabic ? "الاسم الكامل" : "Full Name",
//     email: isArabic ? "البريد الإلكتروني" : "Email Address",
//     password: isArabic ? "كلمة المرور" : "Password",
//     jobAccess: isArabic ? "الوظيفة والصلاحيات" : "Job & Access",
//     jobAccessDesc: isArabic
//       ? "حدد دور الموظف والمسمى الوظيفي."
//       : "Select the employee's role and job title.",
//     role: isArabic ? "الدور الوظيفي" : "Role",
//     jobTitle: isArabic ? "المسمى الوظيفي" : "Job Title",
//     chooseRole: isArabic ? "اختر الدور" : "Select a role",
//     chooseJob: isArabic ? "اختر المسمى الوظيفي (اختياري)" : "Select a job title (optional)",
//     account: isArabic ? "إعدادات الحساب" : "Account Settings",
//     accountDesc: isArabic
//       ? "تحكم في حالة حساب الموظف."
//       : "Configure the employee's account status.",
//     active: isArabic ? "حساب نشط" : "Active Account",
//     activeDesc: isArabic
//       ? "تحديد ما إذا كان الحساب مفعّلًا."
//       : "Choose whether this account is active.",
//     required: isArabic ? "هذا الحقل مطلوب." : "This field is required.",
//     invalidEmail: isArabic ? "البريد الإلكتروني غير صحيح." : "Enter a valid email address.",
//     shortPassword: isArabic
//       ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل."
//       : "Password must be at least 8 characters.",
//     cancel: isArabic ? "إلغاء" : "Cancel",
//     submit: isArabic ? "إضافة الموظف" : "Add Employee",
//     noteTitle: isArabic ? "وضع التصميم" : "Design Preview",
//     note: isArabic
//       ? "قوائم الأدوار والمسميات مؤقتة للعرض فقط. لم يتم حفظ البيانات."
//       : "Role and job title options are placeholders for preview. Nothing has been saved.",
//     namePlaceholder: isArabic ? "أدخل الاسم الكامل" : "Enter full name",
//     emailPlaceholder: "name@company.com",
//     passwordPlaceholder: isArabic ? "8 أحرف على الأقل" : "At least 8 characters",
//   };

//   function updateField<K extends keyof EmployeeForm>(
//     field: K,
//     value: EmployeeForm[K]
//   ) {
//     setForm((prev) => ({ ...prev, [field]: value }));
//     setErrors((prev) => ({ ...prev, [field]: undefined }));
//   }

//   function validate() {
//     const next: typeof errors = {};

//     if (!form.fullName.trim()) next.fullName = t.required;

//     if (!form.email.trim()) {
//       next.email = t.required;
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
//       next.email = t.invalidEmail;
//     }

//     if (!form.password) {
//       next.password = t.required;
//     } else if (form.password.length < 8) {
//       next.password = t.shortPassword;
//     }

//     if (!form.roleId) next.roleId = t.required;

//     setErrors(next);
//     return Object.keys(next).length === 0;
//   }

//   function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     if (!validate()) return;

//     // UI preview only. Add the RTK Query mutation later.
//     setNotice(true);
//   }

//   function handleCancel() {
//     setForm({
//       fullName: "",
//       email: "",
//       password: "",
//       roleId: "",
//       jobTitleId: "",
//       isActive: true,
//     });
//     setErrors({});
//     setNotice(false);
//   }

//   return (
//     <main
//       dir={isArabic ? "rtl" : "ltr"}
//       className={`min-h-screen ${pageBg} px-4 py-6 sm:px-6 lg:px-8`}
//     >
//       <div className="mx-auto max-w-380">
//         <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
//           <div>
//             <div className="mb-3 flex items-center gap-2 text-sm">
//               <span className={mutedColor}>{t.team}</span>
//               <span className={mutedColor}>/</span>
//               <span className="font-medium text-[#47759c]">{t.title}</span>
//             </div>

//             <h1 className={`text-2xl font-bold tracking-tight sm:text-3xl ${headingColor}`}>
//               {t.title}
//             </h1>
//             <p className={`mt-2 text-sm ${mutedColor}`}>{t.subtitle}</p>
//           </div>

//           <button
//             type="button"
//             onClick={() => window.history.back()}
//             className={`inline-flex items-center gap-2 rounded-xl border ${borderColor} ${cardBg} px-4 py-2.5 text-sm font-semibold ${headingColor} hover:opacity-80`}
//           >
//             {isArabic ? <ArrowRight size={17} /> : <ArrowLeft size={17} />}
//             {t.back}
//           </button>
//         </div>

//         {notice && (
//           <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
//             <Info size={20} className="mt-0.5 shrink-0 text-amber-500" />
//             <div className="flex-1">
//               <p className={`text-sm font-bold ${headingColor}`}>{t.noteTitle}</p>
//               <p className={`mt-1 text-sm ${mutedColor}`}>{t.note}</p>
//             </div>
//             <button type="button" onClick={() => setNotice(false)} aria-label="Dismiss">
//               <X size={18} className={mutedColor} />
//             </button>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} noValidate>
//           {/* Personal information */}
//           <section className={`mb-5 overflow-hidden rounded-2xl border ${borderColor} ${cardBg} shadow-sm`}>
//             <div className={`flex items-center gap-3 border-b ${borderColor} px-5 py-5 sm:px-7`}>
//               <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#47759c]/10 text-[#47759c]">
//                 <UserRound size={22} />
//               </div>
//               <div>
//                 <h2 className={`font-bold ${headingColor}`}>{t.personal}</h2>
//                 <p className={`mt-1 text-xs ${mutedColor}`}>{t.personalDesc}</p>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-7">
//               <div>
//                 <label htmlFor="fullName" className={labelClass}>
//                   {t.fullName} <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <UserRound size={17} className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${isArabic ? "right-4" : "left-4"} ${mutedColor}`} />
//                   <input
//                     id="fullName"
//                     autoComplete="name"
//                     value={form.fullName}
//                     onChange={(e) => updateField("fullName", e.target.value)}
//                     placeholder={t.namePlaceholder}
//                     aria-invalid={!!errors.fullName}
//                     className={`${inputClass} ${isArabic ? "pr-11" : "pl-11"}`}
//                   />
//                 </div>
//                 {errors.fullName && <p className="mt-1.5 text-xs text-red-500">{errors.fullName}</p>}
//               </div>

//               <div>
//                 <label htmlFor="email" className={labelClass}>
//                   {t.email} <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Mail size={17} className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${isArabic ? "right-4" : "left-4"} ${mutedColor}`} />
//                   <input
//                     id="email"
//                     type="email"
//                     autoComplete="email"
//                     dir="ltr"
//                     value={form.email}
//                     onChange={(e) => updateField("email", e.target.value)}
//                     placeholder={t.emailPlaceholder}
//                     aria-invalid={!!errors.email}
//                     className={`${inputClass} pl-11 text-left`}
//                   />
//                 </div>
//                 {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
//               </div>

//               <div className="sm:col-span-2">
//                 <label htmlFor="password" className={labelClass}>
//                   {t.password} <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <LockKeyhole size={17} className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${isArabic ? "right-4" : "left-4"} ${mutedColor}`} />
//                   <input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     autoComplete="new-password"
//                     value={form.password}
//                     onChange={(e) => updateField("password", e.target.value)}
//                     placeholder={t.passwordPlaceholder}
//                     aria-invalid={!!errors.password}
//                     className={`${inputClass} ${isArabic ? "pr-11 pl-12" : "pl-11 pr-12"}`}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword((prev) => !prev)}
//                     aria-label={showPassword ? "Hide password" : "Show password"}
//                     className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? "left-4" : "right-4"} ${mutedColor}`}
//                   >
//                     {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
//                   </button>
//                 </div>
//                 {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>}
//               </div>
//             </div>
//           </section>

//           {/* Role and job title */}
//           <section className={`mb-5 overflow-hidden rounded-2xl border ${borderColor} ${cardBg} shadow-sm`}>
//             <div className={`flex items-center gap-3 border-b ${borderColor} px-5 py-5 sm:px-7`}>
//               <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2eb5bc]/10 text-[#2eb5bc]">
//                 <ShieldCheck size={22} />
//               </div>
//               <div>
//                 <h2 className={`font-bold ${headingColor}`}>{t.jobAccess}</h2>
//                 <p className={`mt-1 text-xs ${mutedColor}`}>{t.jobAccessDesc}</p>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-7">
//               <div>
//                 <label htmlFor="roleId" className={labelClass}>
//                   {t.role} <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <ShieldCheck size={17} className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${isArabic ? "right-4" : "left-4"} ${mutedColor}`} />
//                   <select
//                     id="roleId"
//                     value={form.roleId}
//                     onChange={(e) => updateField("roleId", e.target.value)}
//                     aria-invalid={!!errors.roleId}
//                     className={`${inputClass} appearance-none ${isArabic ? "pr-11" : "pl-11"}`}
//                   >
//                     <option value="">{t.chooseRole}</option>
//                     {roles.map((role) => (
//                       <option key={role.id} value={role.id}>{role.name}</option>
//                     ))}
//                   </select>
//                 </div>
//                 {errors.roleId && <p className="mt-1.5 text-xs text-red-500">{errors.roleId}</p>}
//               </div>

//               <div>
//                 <label htmlFor="jobTitleId" className={labelClass}>{t.jobTitle}</label>
//                 <div className="relative">
//                   <BriefcaseBusiness size={17} className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${isArabic ? "right-4" : "left-4"} ${mutedColor}`} />
//                   <select
//                     id="jobTitleId"
//                     value={form.jobTitleId}
//                     onChange={(e) => updateField("jobTitleId", e.target.value)}
//                     className={`${inputClass} appearance-none ${isArabic ? "pr-11" : "pl-11"}`}
//                   >
//                     <option value="">{t.chooseJob}</option>
//                     {jobTitles.map((job) => (
//                       <option key={job.id} value={job.id}>{job.name}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Account status */}
//           <section className={`mb-6 overflow-hidden rounded-2xl border ${borderColor} ${cardBg} shadow-sm`}>
//             <div className={`flex items-center gap-3 border-b ${borderColor} px-5 py-5 sm:px-7`}>
//               <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2eb5bc]/10 text-[#2eb5bc]">
//                 <CheckCircle2 size={22} />
//               </div>
//               <div>
//                 <h2 className={`font-bold ${headingColor}`}>{t.account}</h2>
//                 <p className={`mt-1 text-xs ${mutedColor}`}>{t.accountDesc}</p>
//               </div>
//             </div>

//             <div className="p-5 sm:p-7">
//               <label htmlFor="isActive" className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border ${borderColor} p-4 transition hover:border-[#2eb5bc]/60`}>
//                 <div>
//                   <p className={`text-sm font-semibold ${headingColor}`}>{t.active}</p>
//                   <p className={`mt-1 text-xs ${mutedColor}`}>{t.activeDesc}</p>
//                 </div>
//                 <input
//                   id="isActive"
//                   type="checkbox"
//                   checked={form.isActive}
//                   onChange={(e) => updateField("isActive", e.target.checked)}
//                   className="h-5 w-5 shrink-0 cursor-pointer accent-[#2eb5bc]"
//                 />
//               </label>
//             </div>
//           </section>

//           {/* Form actions */}
//           <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
//             <button
//               type="button"
//               onClick={handleCancel}
//               className={`inline-flex items-center justify-center gap-2 rounded-xl border ${borderColor} ${cardBg} px-6 py-3 text-sm font-semibold ${headingColor} transition hover:opacity-80`}
//             >
//               <X size={17} />
//               {t.cancel}
//             </button>

//             <button
//               type="submit"
//               className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#47759c] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3b6487] focus:outline-none focus:ring-2 focus:ring-[#47759c]/40 focus:ring-offset-2"
//             >
//               <UserPlus size={18} />
//               {t.submit}
//             </button>
//           </div>

//           <p className={`mt-5 text-center text-xs ${mutedColor}`}>
//             {isArabic
//               ? "هذه نسخة تصميم؛ الحفظ الفعلي وربط القوائم سيأتيان لاحقًا."
//               : "Design preview only; saving and real dropdown data will be connected later."}
//           </p>
//         </form>
//       </div>
//     </main>
//   );
// }





"use client";

import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  UserPlus,
  UserRound,
  Mail,
  LockKeyhole,
  BriefcaseBusiness,
  ShieldCheck,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { useDashboardLayout } from "@/app/components/DashboardLayout";
import {
  useCreateAdminUserMutation,
  useGetJobTitlesQuery,
  useGetRolesQuery,
} from "@/app/services/team-members-api";
// import { toast } from "sonner";


interface EmployeeForm {
  fullName: string;
  email: string;
  password: string;
  roleId: string;
  jobTitleId: string;
  isActive: boolean;
}

export default function AddEmployeePage() {
  const { isArabic, darkMode } = useDashboardLayout();
  const [createAdminUser, { isLoading: isSaving }] =
    useCreateAdminUserMutation();

  const {
    data: jobTitlesResponse,
    isLoading: isLoadingJobTitles,
    isError: isJobTitlesError,
  } = useGetJobTitlesQuery({ activeOnly: true });

  const jobTitles = Array.isArray(jobTitlesResponse)
    ? jobTitlesResponse
    : jobTitlesResponse?.data ?? [];

  const {
    data: rolesResponse,
    isLoading: isLoadingRoles,
    isError: isRolesError,
  } = useGetRolesQuery({ page: 1, limit: 100 });

  const roles = Array.isArray(rolesResponse)
    ? rolesResponse
    : rolesResponse?.data ?? [];

  const [form, setForm] = useState<EmployeeForm>({
    fullName: "",
    email: "",
    password: "",
    roleId: "",
    jobTitleId: "",
    isActive: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof EmployeeForm, string>>
  >({});


  const isDark = darkMode;
  const pageBg = isDark ? "bg-[#101820]" : "bg-[#f5f8fb]";
  const cardBg = isDark ? "bg-[#182630]" : "bg-white";
  const borderColor = isDark ? "border-slate-700" : "border-slate-200";
  const headingColor = isDark ? "text-white" : "text-slate-800";
  const mutedColor = isDark ? "text-slate-400" : "text-slate-500";

  const inputClass = `
    w-full rounded-xl border ${borderColor}
    ${isDark ? "bg-[#111d26] text-white" : "bg-white text-slate-800"}
    px-4 py-3 text-sm outline-none transition
    focus:border-[#47759c] focus:ring-2 focus:ring-[#47759c]/15
  `;

  const labelClass = `mb-2 block text-sm font-semibold ${headingColor}`;

  const t = {
    title: isArabic ? "إضافة موظف جديد" : "Add New Employee",
    subtitle: isArabic
      ? "أضف بيانات الموظف وحدد دوره وصلاحياته داخل النظام."
      : "Add employee details and configure their access to the system.",
    team: isArabic ? "الفريق" : "Team",
    back: isArabic ? "رجوع" : "Back",
    personal: isArabic ? "البيانات الشخصية" : "Personal Information",
    personalDesc: isArabic
      ? "أدخل الاسم والبريد الإلكتروني وكلمة المرور."
      : "Enter the employee's name, email, and password.",
    fullName: isArabic ? "الاسم الكامل" : "Full Name",
    email: isArabic ? "البريد الإلكتروني" : "Email Address",
    password: isArabic ? "كلمة المرور" : "Password",
    jobAccess: isArabic ? "الوظيفة والصلاحيات" : "Job & Access",
    jobAccessDesc: isArabic
      ? "حدد دور الموظف والمسمى الوظيفي."
      : "Select the employee's role and job title.",
    role: isArabic ? "الدور الوظيفي" : "Role",
    jobTitle: isArabic ? "المسمى الوظيفي" : "Job Title",
    chooseRole: isArabic ? "اختر الدور" : "Select a role",
    loadingRoles: isArabic ? "جاري تحميل الأدوار..." : "Loading roles...",
    rolesError: isArabic ? "فشل تحميل الأدوار" : "Failed to load roles",
    chooseJob: isArabic ? "اختر المسمى الوظيفي (اختياري)" : "Select a job title (optional)",
    loadingJobTitles: isArabic ? "جاري تحميل المسميات الوظيفية..." : "Loading job titles...",
    jobTitlesError: isArabic ? "فشل تحميل المسميات الوظيفية" : "Failed to load job titles",
    account: isArabic ? "إعدادات الحساب" : "Account Settings",
    accountDesc: isArabic
      ? "تحكم في حالة حساب الموظف."
      : "Configure the employee's account status.",
    active: isArabic ? "حساب نشط" : "Active Account",
    activeDesc: isArabic
      ? "تحديد ما إذا كان الحساب مفعّلًا."
      : "Choose whether this account is active.",
    required: isArabic ? "هذا الحقل مطلوب." : "This field is required.",
    invalidEmail: isArabic ? "البريد الإلكتروني غير صحيح." : "Enter a valid email address.",
    shortPassword: isArabic
      ? "كلمة المرور يجب أن تكون من 10 إلى 128 حرفًا."
      : "Password must be between 10 and 128 characters.",
    cancel: isArabic ? "إلغاء" : "Cancel",
    submit: isArabic ? "إضافة الموظف" : "Add Employee",
    namePlaceholder: isArabic ? "أدخل الاسم الكامل" : "Enter full name",
    emailPlaceholder: "name@company.com",
    passwordPlaceholder: isArabic ? "10 أحرف على الأقل" : "At least 10 characters",
  };

  function updateField<K extends keyof EmployeeForm>(
    field: K,
    value: EmployeeForm[K]
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate() {
    const next: typeof errors = {};

    if (!form.fullName.trim()) next.fullName = t.required;

    if (!form.email.trim()) {
      next.email = t.required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = t.invalidEmail;
    }

    if (!form.password) {
      next.password = t.required;
    } else if (form.password.length < 10 || form.password.length > 128) {
      next.password = t.shortPassword;
    }

    if (!form.roleId) next.roleId = t.required;

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    try {
      await createAdminUser({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        roleId: form.roleId,
        jobTitleId: form.jobTitleId || null,
      }).unwrap();

      // toast.success(
      //   isArabic ? "تمت إضافة الموظف بنجاح" : "Employee added successfully"
      // );
      window.alert("Added")
      handleCancel();
    } catch (error: unknown) {
      // const apiError = error as {
      //   data?: { message?: string | string[] };
      // };
      // const message = apiError.data?.message;

      // toast.error(
      //   Array.isArray(message)
      //     ? message.join(", ")
      //     : message ||
      //         (isArabic
      //           ? "فشل إضافة الموظف. حاول مرة أخرى."
      //           : "Failed to add employee. Please try again.")
      // );
      window.alert("Not Added")
      console.log(error)
    }
  }

  function handleCancel() {
    setForm({
      fullName: "",
      email: "",
      password: "",
      roleId: "",
      jobTitleId: "",
      isActive: true,
    });
    setErrors({});
  }

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className={`min-h-screen ${pageBg} px-4 py-6 sm:px-6 lg:px-8`}
    >
      <div className="mx-auto ">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm">
              <span className={mutedColor}>{t.team}</span>
              <span className={mutedColor}>/</span>
              <span className="font-medium text-[#47759c]">{t.title}</span>
            </div>

            <h1 className={`text-2xl font-bold tracking-tight sm:text-3xl ${headingColor}`}>
              {t.title}
            </h1>
            <p className={`mt-2 text-sm ${mutedColor}`}>{t.subtitle}</p>
          </div>

          <button
            type="button"
            onClick={() => window.history.back()}
            className={`inline-flex items-center gap-2 rounded-xl border ${borderColor} ${cardBg} px-4 py-2.5 text-sm font-semibold ${headingColor} hover:opacity-80`}
          >
            {isArabic ? <ArrowRight size={17} /> : <ArrowLeft size={17} />}
            {t.back}
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Personal information */}
          <section className={`mb-5 overflow-hidden rounded-2xl border ${borderColor} ${cardBg} shadow-sm`}>
            <div className={`flex items-center gap-3 border-b ${borderColor} px-5 py-5 sm:px-7`}>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#47759c]/10 text-[#47759c]">
                <UserRound size={22} />
              </div>
              <div>
                <h2 className={`font-bold ${headingColor}`}>{t.personal}</h2>
                <p className={`mt-1 text-xs ${mutedColor}`}>{t.personalDesc}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-7">
              <div>
                <label htmlFor="fullName" className={labelClass}>
                  {t.fullName} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserRound size={17} className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${isArabic ? "right-4" : "left-4"} ${mutedColor}`} />
                  <input
                    id="fullName"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder={t.namePlaceholder}
                    aria-invalid={!!errors.fullName}
                    className={`${inputClass} ${isArabic ? "pr-11" : "pl-11"}`}
                  />
                </div>
                {errors.fullName && <p className="mt-1.5 text-xs text-red-500">{errors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  {t.email} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={17} className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${isArabic ? "right-4" : "left-4"} ${mutedColor}`} />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    dir="ltr"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder={t.emailPlaceholder}
                    aria-invalid={!!errors.email}
                    className={`${inputClass} pl-11 text-left`}
                  />
                </div>
                {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="password" className={labelClass}>
                  {t.password} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <LockKeyhole size={17} className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${isArabic ? "right-4" : "left-4"} ${mutedColor}`} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    placeholder={t.passwordPlaceholder}
                    aria-invalid={!!errors.password}
                    className={`${inputClass} ${isArabic ? "pr-11 pl-12" : "pl-11 pr-12"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? "left-4" : "right-4"} ${mutedColor}`}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>}
              </div>
            </div>
          </section>

          {/* Role and job title */}
          <section className={`mb-5 overflow-hidden rounded-2xl border ${borderColor} ${cardBg} shadow-sm`}>
            <div className={`flex items-center gap-3 border-b ${borderColor} px-5 py-5 sm:px-7`}>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2eb5bc]/10 text-[#2eb5bc]">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h2 className={`font-bold ${headingColor}`}>{t.jobAccess}</h2>
                <p className={`mt-1 text-xs ${mutedColor}`}>{t.jobAccessDesc}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-7">
              <div>
                <label htmlFor="roleId" className={labelClass}>
                  {t.role} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <ShieldCheck size={17} className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${isArabic ? "right-4" : "left-4"} ${mutedColor}`} />
                  <select
                    id="roleId"
                    value={form.roleId}
                    onChange={(e) => updateField("roleId", e.target.value)}
                    aria-invalid={!!errors.roleId}
                    disabled={isLoadingRoles}
                    className={`${inputClass} appearance-none ${isArabic ? "pr-11" : "pl-11"} disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    <option value="">
                      {isLoadingRoles
                        ? t.loadingRoles
                        : isRolesError
                          ? t.rolesError
                          : t.chooseRole}
                    </option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.roleId && <p className="mt-1.5 text-xs text-red-500">{errors.roleId}</p>}
                {isRolesError && <p className="mt-1.5 text-xs text-red-500">{t.rolesError}</p>}
              </div>

              <div>
                <label htmlFor="jobTitleId" className={labelClass}>{t.jobTitle}</label>
                <div className="relative">
                  <BriefcaseBusiness size={17} className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${isArabic ? "right-4" : "left-4"} ${mutedColor}`} />
                  <select
                    id="jobTitleId"
                    value={form.jobTitleId}
                    onChange={(e) => updateField("jobTitleId", e.target.value)}
                    disabled={isLoadingJobTitles}
                    className={`${inputClass} appearance-none ${isArabic ? "pr-11" : "pl-11"} disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    <option value="">
                      {isLoadingJobTitles
                        ? t.loadingJobTitles
                        : isJobTitlesError
                          ? t.jobTitlesError
                          : t.chooseJob}
                    </option>
                    {jobTitles.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.name}
                      </option>
                    ))}
                  </select>
                  {isJobTitlesError && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {t.jobTitlesError}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Account status */}
          <section className={`mb-6 overflow-hidden rounded-2xl border ${borderColor} ${cardBg} shadow-sm`}>
            <div className={`flex items-center gap-3 border-b ${borderColor} px-5 py-5 sm:px-7`}>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2eb5bc]/10 text-[#2eb5bc]">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <h2 className={`font-bold ${headingColor}`}>{t.account}</h2>
                <p className={`mt-1 text-xs ${mutedColor}`}>{t.accountDesc}</p>
              </div>
            </div>

            <div className="p-5 sm:p-7">
              <label htmlFor="isActive" className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border ${borderColor} p-4 transition hover:border-[#2eb5bc]/60`}>
                <div>
                  <p className={`text-sm font-semibold ${headingColor}`}>{t.active}</p>
                  <p className={`mt-1 text-xs ${mutedColor}`}>{t.activeDesc}</p>
                </div>
                <input
                  id="isActive"
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => updateField("isActive", e.target.checked)}
                  className="h-5 w-5 shrink-0 cursor-pointer accent-[#2eb5bc]"
                />
              </label>
            </div>
          </section>

          {/* Form actions */}
          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleCancel}
              className={`inline-flex items-center justify-center gap-2 rounded-xl border ${borderColor} ${cardBg} px-6 py-3 text-sm font-semibold ${headingColor} transition hover:opacity-80`}
            >
              <X size={17} />
              {t.cancel}
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#47759c] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3b6487] focus:outline-none focus:ring-2 focus:ring-[#47759c]/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <UserPlus size={18} />
              {isSaving
                ? isArabic
                  ? "جاري الحفظ..."
                  : "Saving..."
                : t.submit}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}






