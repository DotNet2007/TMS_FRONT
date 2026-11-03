"use client";

import { useState, type ReactNode } from "react";
import { toast } from "sonner";



import { useDashboardLayout } from "@/app/components/DashboardLayout";
import { useGetUsersQuery } from "@/app/services/team-members-api";
import { IAnalysisResponse, IEmailDraft, IIntakeApiResponse, ISelectableEmployee } from "@/app/interfaces/add-task-interface";
import { useAnalyzeTaskIntakeMutation, useCreateTaskDraftAndConfirmMutation } from "@/app/services/task-in-take- api";

type IconName =
  | "spark"
  | "arrow"
  | "mail"
  | "image"
  | "send";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    spark: <path d="m12 3-1.2 4.1a5.4 5.4 0 0 1-3.7 3.7L3 12l4.1 1.2a5.4 5.4 0 0 1 3.7 3.7L12 21l1.2-4.1a5.4 5.4 0 0 1 3.7-3.7L21 12l-4.1-1.2a5.4 5.4 0 0 1-3.7-3.7Z" />,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-5-5L5 20" /></>,
    send: <path d="m22 2-7 20-4-9-9-4Z M22 2 11 13" />,
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function Button({
  children,
  className = "",
  onClick,
  ariaLabel,
  type,
  disabled = false,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return <button type={type} aria-label={ariaLabel} disabled={disabled} className={className} onClick={onClick}>{children}</button>;
}



function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function readText(record: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number") return String(value);
  }
  return "";
}

function localizeRecommendationMessage(message: string | null | undefined, isArabicUi: boolean): string {
  const normalized = message?.trim() ?? "";
  if (!normalized) {
    return isArabicUi
      ? "لم يتم العثور على ترشيح تلقائي لهذا الموظف. يمكنك اختيار الموظف المناسب يدويًا."
      : "No automatic employee recommendation is available. You can choose an employee manually.";
  }

  if (normalized.toLowerCase().includes("successful job-title prediction is required before recommending an employee")) {
    return isArabicUi
      ? "يتعذر ترشيح موظف قبل تحديد المسمى الوظيفي المناسب بنجاح. يمكنك اختيار الموظف يدويًا."
      : "An employee cannot be recommended until the job-title prediction succeeds. You can choose an employee manually.";
  }

  return normalized;
}

function normalizeEmployees(response: unknown): ISelectableEmployee[] {
  const root = asRecord(response);
  const possibleData = root.data;
  const list = Array.isArray(possibleData)
    ? possibleData
    : Array.isArray(root.users)
      ? root.users
      : Array.isArray(root.items)
        ? root.items
        : [];

  return list
    .map((item): ISelectableEmployee | null => {
      const user = asRecord(item);
      const roleValue = user.role;
      const roleObject = asRecord(roleValue);
      const jobTitleValue = user.jobTitle ?? user.job_title;
      const jobTitleObject = asRecord(jobTitleValue);
      const teamValue = user.teamId ?? user.team_id ?? user.team;
      const teamObject = asRecord(teamValue);
      const role =
        typeof roleValue === "string"
          ? roleValue
          : readText(roleObject, "code", "name", "role");
      const id = readText(user, "userId", "id", "employeeId", "employee_id");
      const name = readText(
        user,
        "displayName",
        "fullName",
        "name",
        "username",
      );
      if (!id || !name) return null;

      const activeValue = user.isActive ?? user.active ?? user.is_active;
      if (activeValue === false) return null;
      // if (role && !role.toUpperCase().includes("EMPLOYEE")) return null;
      if (role &&  !["EMPLOYEE", "SUPERVISOR"].includes(role.toUpperCase())) return null;

      return {
        id,
        name,
        email: readText(user, "email", "emailAddress"),
        jobTitle:
          typeof jobTitleValue === "string"
            ? jobTitleValue
            : readText(jobTitleObject, "name", "title", "description"),
        role: role || "EMPLOYEE",
        teamId:
          typeof teamValue === "string"
            ? teamValue
            : readText(teamObject, "id", "teamId") || null,
      };
    })
    .filter((employee): employee is ISelectableEmployee => employee !== null);
}

function toDateTimeLocal(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
}

function dateTimeLocalToIso(value: string): string | null {
  if (!value.trim()) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function localizeErrorMessage(
  message: string | null | undefined,
  isArabicUi: boolean,
  fallback?: string,
): string {
  const text = message?.trim() ?? "";
  if (!text) {
    return fallback || (isArabicUi
      ? "حدث خطأ غير متوقع. حاول مرة أخرى."
      : "An unexpected error occurred. Please try again.");
  }

  const hasArabic = /[\u0600-\u06FF]/.test(text);
  // Keep errors that already match the selected interface language.
  if ((isArabicUi && hasArabic) || (!isArabicUi && !hasArabic)) return text;

  const normalized = text.toLowerCase();
  if (normalized.includes("deadline")) {
    return isArabicUi ? "يجب تحديد الموعد النهائي للمهمة." : "A task deadline is required.";
  }
  if (normalized.includes("network") || normalized.includes("fetch")) {
    return isArabicUi
      ? "تعذّر الاتصال بالخادم. تحقق من الاتصال وحاول مرة أخرى."
      : "Could not connect to the server. Check your connection and try again.";
  }
  if (normalized.includes("unauthorized") || normalized.includes("forbidden")) {
    return isArabicUi
      ? "ليست لديك صلاحية لتنفيذ هذا الإجراء. سجّل الدخول مرة أخرى إذا لزم الأمر."
      : "You are not authorized to perform this action. Sign in again if needed.";
  }
  if (normalized.includes("internal server error") || normalized.includes("500")) {
    return isArabicUi
      ? "حدث خطأ في الخادم أثناء تنفيذ الطلب. حاول مرة أخرى."
      : "The server encountered an error while processing the request. Please try again.";
  }

  return fallback || (isArabicUi
    ? "حدث خطأ أثناء تنفيذ الطلب. حاول مرة أخرى."
    : "An error occurred while processing the request. Please try again.");
}

export default function NewTaskPage() {
  const { isArabic, darkMode } = useDashboardLayout();
  const [sourceType, setSourceType] = useState<"email" | "image">("email");
  const [workflowStep, setWorkflowStep] = useState<1 | 2 | 3 >(1);
  const [emailContent, setEmailContent] = useState("");
  const [imageName, setImageName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  // const [apiError, setApiError] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [subject] = useState("");
  const [analysis, setAnalysis] = useState<IAnalysisResponse | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<Record<string, string>>({});
  const [emailDrafts, setEmailDrafts] = useState<Record<string, IEmailDraft>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [copiedEmailId, setCopiedEmailId] = useState<string | null>(null);
  const [savingProposalId, setSavingProposalId] = useState<string | null>(null);
  const [savedProposalIds, setSavedProposalIds] = useState<string[]>([]);
  const [deadlines, setDeadlines] = useState<Record<string, string>>({});
  const [deadlineErrors, setDeadlineErrors] = useState<Record<string, string>>({});
  // const [actionMessage, setActionMessage] = useState("");

  // Uses the existing GET /users RTK Query endpoint.
  // The sample list keeps the workflow preview usable if the endpoint is empty or unavailable.
  const { data: usersResponse, isLoading: isLoadingUsers, isError: usersError } = useGetUsersQuery();
  const [analyzeTaskIntake] = useAnalyzeTaskIntakeMutation();
  const [createTaskDraft] = useCreateTaskDraftAndConfirmMutation();
  const apiEmployees = normalizeEmployees(usersResponse);
  const employees = apiEmployees;

  // console.log(usersResponse)
  // console.log(employees)

  const isArabicUi = isArabic;

  // Show a toast for every failed action, even when the same message repeats.
  // React state effects keyed only by the message do not rerun for identical strings.
  const showApiError = (message: string) => {
    // setApiError(message);
    toast.error(message);
  };
  const panelClass = darkMode
    ? "border-slate-700 bg-slate-900 text-slate-100"
    : "border-[#e5e6ea] bg-white text-[#252630]";
  const mutedClass = darkMode ? "text-slate-400" : "text-[#85868f]";
  const inputClass = `w-full rounded-xl border px-3.5 py-3 text-sm outline-none transition focus:border-[#2eb5bc] focus:ring-4 focus:ring-[#2eb5bc]/10 ${
    darkMode
      ? "border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500"
      : "border-[#dedfe4] bg-white text-[#3d3e43] placeholder:text-[#a5a6ad]"
  }`;
  const buttonSecondaryClass = darkMode
    ? "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
    : "border-[#e5e6ea] bg-white text-[#505157] hover:bg-slate-50";

  const handleImageFile = (file?: File) => {
    if (!file) return;
    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/bmp", "image/tiff"];
    if (!allowedImageTypes.includes(file.type)) {
      showApiError(isArabicUi ? "نوع الصورة غير مدعوم. استخدم JPEG أو PNG أو WEBP أو BMP أو TIFF." : "Unsupported image type. Use JPEG, PNG, WEBP, BMP, or TIFF.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showApiError(isArabicUi ? "حجم الصورة يجب ألا يتجاوز 10 ميجابايت." : "Image size must not exceed 10 MB.");
      return;
    }
    // setApiError("");
    setImageFile(file);
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  const generateRecommendation = async () => {
    if (sourceType === "email" ? !emailContent.trim() : !imageFile) return;

    setIsGenerating(true);
    // setApiError("");
    setAnalysis(null);
    setWorkflowStep(1);
    try {
      let result: Partial<IIntakeApiResponse>;
      if (sourceType === "image") {
        if (!imageFile) throw new Error(isArabicUi ? "اختر صورة أولًا." : "Choose an image first.");
        result = await analyzeTaskIntake({ file: imageFile }).unwrap() as Partial<IIntakeApiResponse>;
      } else {
        const fullEmailText = subject.trim()
          ? `${isArabicUi ? "الموضوع" : "Subject"}: ${subject.trim()}\n\n${emailContent.trim()}`
          : emailContent.trim();
        if (fullEmailText.length > 100000) {
          throw new Error(isArabicUi ? "نص البريد يتجاوز الحد المسموح (100,000 حرف)." : "Email text exceeds the 100,000 character limit.");
        }
        result = await analyzeTaskIntake({ emailText: fullEmailText }).unwrap() as Partial<IIntakeApiResponse>;
      }
      if (!result.analysisId || !Array.isArray(result.proposals)) {
        throw new Error(isArabicUi ? "استجابة الـ API غير متوقعة." : "The API returned an unexpected response.");
      }

      const responseSender = result.sender;
      const normalized: IAnalysisResponse = {
        analysisId: result.analysisId,
        status: result.analysis?.analysisStatus || result.status || "COMPLETED",
        sender: {
          userId: responseSender?.userId || "",
          displayName: responseSender?.displayName || (isArabicUi ? "المشرف الحالي" : "Current supervisor"),
          email: responseSender?.email,
          role: responseSender?.role || "SUPERVISOR",
          hierarchyLevel: responseSender?.hierarchyLevel ?? 0,
        },
        proposals: result.proposals.map((proposal) => ({
          ...proposal,
          description: proposal.description || proposal.sourceText || "",
          predictedJobTitle: proposal.predictedJobTitle || "",
          predictionStatus: proposal.predictionStatus || "failed",
          predictionReason: proposal.predictionReason || proposal.recommendationMessage || "",
        })),
      };
      setAnalysis(normalized);
      setDeadlines(Object.fromEntries(
        normalized.proposals.map((proposal) => [
          proposal.proposalId,
          toDateTimeLocal(proposal.suggestedDeadline),
        ]),
      ));
      setWorkflowStep(2);
      setSelectedEmployees(Object.fromEntries(
        normalized.proposals
          .filter((proposal) => proposal.recommendation)
          .map((proposal) => [proposal.proposalId, proposal.recommendation!.userId]),
      ));
      setEmailDrafts(Object.fromEntries(normalized.proposals.map((proposal) => {
        const employee = proposal.recommendation;
        const emailBody = isArabicUi
          ? `مرحبًا ${employee?.displayName ?? ""}،\n\nنرجو تنفيذ المهمة التالية: ${proposal.title}.\n\nتفاصيل المهمة: ${proposal.description}\n\nالموعد المقترح: ${proposal.suggestedDeadline || "غير محدد"}\n\nيرجى تأكيد استلام المهمة وإبلاغ المشرف بالتقدم.\n\nشكرًا لك.`
          : `Hi ${employee?.displayName ?? ""},\n\nPlease work on the following task: ${proposal.title}.\n\nTask details: ${proposal.description}\n\nSuggested deadline: ${proposal.suggestedDeadline || "Not specified"}\n\nPlease confirm receipt and keep your supervisor updated.\n\nThank you.`;
        return [proposal.proposalId, { to: employee?.email ?? "", subject: proposal.title, body: emailBody }];
      })));
      if (normalized.proposals.length === 0) {
        // An informational backend message such as "Input processed..." is not
        // an error. Show a clear no-tasks message in the existing alert area.
        showApiError(
          isArabicUi
            ? "اكتمل تحليل المحتوى، لكن لم يتم استخراج مهام قابلة للمراجعة. راجع النص أو الصورة وحاول مرة أخرى."
            : "The input was analyzed, but no reviewable tasks were extracted. Check the email text or image and try again."
        );
      }
    } catch (error: unknown) {
      const errorRecord = asRecord(error);
      const dataRecord = asRecord(errorRecord.data);

      const status =
        errorRecord.status ??
        dataRecord.statusCode ??
        dataRecord.status ??
        asRecord(dataRecord.error).status;

      if (status === 401 || status === "401") {
        if (typeof window !== "undefined") {
          localStorage.removeItem("userToken");
          window.location.replace("/login");
        }
        return;
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : readText(dataRecord, "message", "error", "details") ||
            readText(errorRecord, "message", "error") ||
            (typeof errorRecord.status === "number" || typeof errorRecord.status === "string"
              ? `${isArabicUi ? "فشل طلب التحليل (HTTP/RTK Query)" : "Analysis request failed (HTTP/RTK Query)"}: ${errorRecord.status}`
              : "");

      showApiError(localizeErrorMessage(
        errorMessage,
        isArabicUi,
        isArabicUi
          ? "حدث خطأ غير متوقع أثناء التحليل. تحقق من اتصال الخادم وحاول مرة أخرى."
          : "An unexpected error occurred during analysis. Check the server connection and try again.",
      ));
    } finally {
      setIsGenerating(false);
    }
  };

  const continueWorkflow = () => {
    if (!analysis) return;

    if (workflowStep === 2) {
      const missingSelection = analysis.proposals.some(
        (proposal) => !selectedEmployees[proposal.proposalId],
      );
      const missingEmail = analysis.proposals.some((proposal) => {
        const draft = emailDrafts[proposal.proposalId];
        return !draft?.to.trim();
      });

      if (missingSelection || missingEmail) {
        showApiError(
          isArabicUi
            ? "اختَر موظفًا لكل مهمة وتأكد من وجود البريد الإلكتروني قبل المتابعة."
            : "Choose an employee for every task and make sure each has an email address before continuing.",
        );
        return;
      }

      setWorkflowStep(3);
    }
  };

  const copyEmailDraft = async (proposalId: string) => {
    const draft = emailDrafts[proposalId];
    if (!draft) return;

    const emailText = `${isArabicUi ? "إلى" : "To"}: ${draft.to}\n${isArabicUi ? "الموضوع" : "Subject"}: ${draft.subject}\n\n${draft.body}`;

    const markAsCopied = () => {
      setCopiedEmailId(proposalId);
      window.setTimeout(() => {
        setCopiedEmailId((current) => current === proposalId ? null : current);
      }, 2000);
    };

    try {
      // The modern Clipboard API only works in secure contexts and with browser permission.
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(emailText);
        markAsCopied();
        return;
      }
    } catch {
      // Try the compatibility fallback below (common when running on a LAN HTTP address).
    }

    // Fallback for browsers/HTTP LAN deployments where navigator.clipboard is unavailable.
    const temporaryTextarea = document.createElement("textarea");
    temporaryTextarea.value = emailText;
    temporaryTextarea.setAttribute("readonly", "");
    temporaryTextarea.setAttribute("aria-hidden", "true");
    temporaryTextarea.style.position = "fixed";
    temporaryTextarea.style.top = "0";
    temporaryTextarea.style.left = "-9999px";
    temporaryTextarea.style.opacity = "0";
    document.body.appendChild(temporaryTextarea);

    try {
      temporaryTextarea.focus();
      temporaryTextarea.select();
      temporaryTextarea.setSelectionRange(0, temporaryTextarea.value.length);
      const copied = document.execCommand("copy");
      if (!copied) throw new Error("Clipboard fallback failed");
      markAsCopied();
    } catch {
      showApiError(isArabicUi
        ? "تعذر النسخ تلقائيًا. حدّد نص البريد وانسخه يدويًا باستخدام Ctrl+C."
        : "Automatic copy was blocked. Select the email text and press Ctrl+C to copy it.");
    } finally {
      document.body.removeChild(temporaryTextarea);
    }
  };

  const openEmailDraft = (proposalId: string) => {
    const draft = emailDrafts[proposalId];
    if (!draft?.to.trim() || !draft.subject.trim() || !draft.body.trim()) {
      showApiError(isArabicUi ? "أكمل المستلم والموضوع ونص الرسالة أولًا." : "Complete the recipient, subject, and message first.");
      return;
    }

    const mailto = `mailto:${draft.to}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
    window.location.href = mailto;
  };

  const saveTaskDraft = async (proposalId: string) => {
    if (!analysis) return;

    const proposal = analysis.proposals.find((item) => item.proposalId === proposalId);
    const draft = emailDrafts[proposalId];
    const assigneeId = selectedEmployees[proposalId];

    if (!proposal || !draft || !assigneeId) {
      showApiError(isArabicUi
        ? "اختَر الموظف وأكمل بيانات مسودة البريد قبل إنشاء المهمة."
        : "Choose an employee and complete the email draft before creating the task.");
      return;
    }

    if (!draft.to.trim() || !draft.subject.trim() || !draft.body.trim()) {
      showApiError(isArabicUi
        ? "أكمل البريد الإلكتروني والموضوع ونص الرسالة أولًا."
        : "Complete the recipient, subject, and message first.");
      return;
    }

    const deadlineIso = dateTimeLocalToIso(deadlines[proposalId] ?? "");
    if (!deadlineIso) {
      const message = isArabicUi
        ? "يجب تحديد موعد نهائي صحيح للمهمة قبل إنشائها."
        : "Enter a valid task deadline before creating the task.";
      setDeadlineErrors((previous) => ({ ...previous, [proposalId]: message }));
      showApiError(message);
      return;
    }

    setDeadlineErrors((previous) => {
      const next = { ...previous };
      delete next[proposalId];
      return next;
    });
    setSavingProposalId(proposalId);
    try {
      await createTaskDraft({
        analysisId: analysis.analysisId,
        proposalId,
        draft: {
          assigneeId,
          title: proposal.title,
          description: proposal.description ?? "",
          deadline: deadlineIso,
          emailSubject: draft.subject,
          emailBody: draft.body,
        },
      }).unwrap();

      setSavedProposalIds((previous) => previous.includes(proposalId)
        ? previous
        : [...previous, proposalId]);
      const successMessage = isArabicUi
        ? "تم إنشاء المهمة وحفظ مسودة البريد بنجاح."
        : "Task created and email draft saved successfully.";
      toast.success(successMessage);
    } catch (error: unknown) {
      const errorRecord = asRecord(error);
      const dataRecord = asRecord(errorRecord.data);
      const message = readText(dataRecord, "message", "error", "details") ||
        readText(errorRecord, "message", "error") ||
        (typeof errorRecord.status === "number" || typeof errorRecord.status === "string"
          ? `HTTP/RTK Query: ${errorRecord.status}`
          : "");

      showApiError(localizeErrorMessage(
        message,
        isArabicUi,
        isArabicUi
          ? "تعذر إنشاء المهمة أو حفظ مسودة البريد. تحقق من البيانات وحاول مرة أخرى."
          : "Could not create the task or save the email draft. Check the details and try again.",
      ));
    } finally {
      setSavingProposalId(null);
    }
  };

  return (
    <section dir={isArabicUi ? "rtl" : "ltr"} className="mx-auto w-full min-w-0 px-3 pb-6 sm:px-5 lg:px-6">
      
      <div className="mb-6 flex min-w-0 flex-col gap-3 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
        
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2eb5bc]">
            <Icon name="spark" size={14} />
            {isArabicUi ? "مهمة مدعومة بالذكاء الاصطناعي" : "AI-powered task"}
          </span>
          <h1 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
            {isArabicUi ? "إنشاء وإسناد مهمة" : "Create and assign a task"}
          </h1>
          <p className={`mt-2 max-w-2xl text-sm leading-6 ${mutedClass}`}>
            {isArabicUi
              ? "حلّل رسالة أو صورة، راجع اقتراحات المهام والموظفين، ثم اعتمد الإسناد النهائي."
              : "Analyze a message or image, review suggested tasks and employees, then confirm the final assignments."}
          </p>
        </div>
        <span className="hidden rounded-full bg-[#edf3f7] px-3 py-2 text-xs font-semibold text-[#47759c] lg:inline-flex">
          {isArabicUi ? "1. إدخال المحتوى ← 2. مراجعة المهمة والموظف ← 3. البريد" : "1. Add source → 2. Review task and employee → 3. Email"}
        </span>
      </div>

      <div className={`mb-6 rounded-2xl border p-3 sm:p-4 ${panelClass}`}>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {([
            { step: 1, en: "Add email or photo", ar: "إضافة بريد أو صورة", detailEn: "Provide the task source", detailAr: "أدخل مصدر المهمة" },
            { step: 2, en: "Review task and employee", ar: "مراجعة المهمة والموظف", detailEn: "Review AI suggestions and choose an assignee", detailAr: "راجع اقتراحات الذكاء الاصطناعي واختر الموظف" },
            { step: 3, en: "Email preview", ar: "معاينة البريد", detailEn: "Review the message before sending", detailAr: "راجع الرسالة قبل الإرسال" },
          ] as const).map((item) => {
            const active = workflowStep === item.step;
            const complete = workflowStep > item.step;
            return (
              <div
                key={item.step}
                aria-current={active ? "step" : undefined}
                className={`relative flex min-w-0 items-center gap-3 overflow-hidden rounded-xl border p-3 transition-colors sm:p-4 ${
                  active
                    ? darkMode
                      ? "border-[#2eb5bc] bg-[#2eb5bc]/10 shadow-[0_0_0_1px_rgba(46,181,188,0.12)]"
                      : "border-[#2eb5bc] bg-[#f0fbfb] shadow-sm"
                    : complete
                      ? darkMode
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : "border-emerald-200 bg-emerald-50/70"
                      : darkMode
                        ? "border-slate-700 bg-slate-950/40"
                        : "border-slate-200 bg-slate-50/70"
                }`}
              >
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-bold ${
                  active
                    ? "bg-[#2eb5bc] text-white shadow-sm"
                    : complete
                      ? "bg-emerald-500 text-white"
                      : darkMode
                        ? "bg-slate-800 text-slate-400"
                        : "bg-white text-slate-500 ring-1 ring-slate-200"
                }`}>
                  {complete ? "✓" : `0${item.step}`}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold leading-5">{isArabicUi ? item.ar : item.en}</p>
                    {active && (
                      <span className="rounded-full bg-[#2eb5bc]/15 px-2 py-0.5 text-[10px] font-bold text-[#238e94]">
                        {isArabicUi ? "الحالية" : "Current"}
                      </span>
                    )}
                    {complete && (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                        {isArabicUi ? "مكتملة" : "Done"}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs leading-5 ${mutedClass}`}>{isArabicUi ? item.detailAr : item.detailEn}</p>
                </div>
                {active && (
                  <span className="absolute inset-y-0 inset-s-0 w-1 bg-[#2eb5bc]" aria-hidden="true" />
                )}
              </div>
            );
          })}
        </div>
      </div>



      {workflowStep !== 3 && (
      <div className="grid min-w-0 grid-cols-1 items-start gap-4 2xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className={`workflow-card min-w-0 rounded-2xl border p-3 sm:p-5 lg:p-6 ${panelClass}`}>
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#47759c] text-sm font-bold text-white">1</span>
            <div>
              <h2 className="font-bold">{isArabicUi ? "الخطوة 1: أضف البريد أو الصورة" : "Step 1: Add email or photo"}</h2>
              <p className={`mt-1 text-xs ${mutedClass}`}>
                {isArabicUi ? "الصق البريد أو ارفع صورة للمهمة" : "Paste an email or upload an image"}
              </p>
            </div>
          </div>

          <div className={`mb-5 grid grid-cols-2 gap-1 rounded-xl p-1 ${darkMode ? "bg-slate-800" : "bg-[#f2f3f5]"}`}>
            <Button
              type="button"
              onClick={() => setSourceType("email")}
              className={`flex h-10 items-center justify-center gap-2 rounded-lg border-0 text-sm font-semibold transition ${
                sourceType === "email"
                  ? darkMode ? "bg-slate-700 text-white shadow" : "bg-white text-[#47759c] shadow-sm"
                  : `bg-transparent ${mutedClass}`
              }`}
            >
              <Icon name="mail" size={16} />
              {isArabicUi ? "رسالة بريد" : "Email"}
            </Button>
            <Button
              type="button"
              onClick={() => setSourceType("image")}
              className={`flex h-10 items-center justify-center gap-2 rounded-lg border-0 text-sm font-semibold transition ${
                sourceType === "image"
                  ? darkMode ? "bg-slate-700 text-white shadow" : "bg-white text-[#47759c] shadow-sm"
                  : `bg-transparent ${mutedClass}`
              }`}
            >
              <Icon name="image" size={16} />
              {isArabicUi ? "صورة" : "Image"}
            </Button>
          </div>

          {sourceType === "email" ? (
            <label className="mb-5 block">
              <span className="mb-2 block text-sm font-semibold">
                {isArabicUi ? "محتوى الرسالة" : "Message content"}
              </span>
              <textarea
                rows={8}
                value={emailContent}
                onChange={(event) => setEmailContent(event.target.value)}
                placeholder={isArabicUi ? "الصق البريد أو تفاصيل المهمة هنا..." : "Paste the email or task details here..."}
                className={`${inputClass} h-56 resize-none overflow-y-auto rounded-xl py-2 text-xs leading-6 ${darkMode ? "bg-slate-900" : "bg-[#f8fbfe]"}`}
              />
              <span className={`mt-2 block text-xs ${mutedClass}`}>
                {emailContent.length} {isArabicUi ? "حرف" : "characters"}
              </span>
            </label>
          ) : (
            <label
              className={`mb-5 flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 text-center transition ${
                isDragging
                  ? "border-[#2eb5bc] bg-[#2eb5bc]/10"
                  : darkMode
                    ? "border-slate-700 bg-slate-950 hover:border-[#2eb5bc]"
                    : "border-[#cbd5da] bg-[#fafcfc] hover:border-[#2eb5bc]"
              }`}
              onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                handleImageFile(event.dataTransfer.files[0]);
              }}
            >
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => handleImageFile(event.target.files?.[0])}
              />
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="Task attachment preview" className="mb-3 max-h-40 rounded-lg object-contain" />
              ) : (
                <span className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-[#e8f8f8] text-[#2eb5bc]">
                  <Icon name="image" size={25} />
                </span>
              )}
              <strong className="text-sm">
                {imageName || (isArabicUi ? "اسحب الصورة هنا أو اضغط للاختيار" : "Drop an image here or click to browse")}
              </strong>
              <span className={`mt-2 text-xs ${mutedClass}`}>
                {isArabicUi ? "يدعم الصور التي تحتوي على تفاصيل المهمة" : "Upload an image containing task details"}
              </span>
            </label>
          )}

          {usersError && (
            <p className="mb-4 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-600">
              {isArabicUi
                ? "تعذّر تحميل الموظفين من الخادم. تحقق من API المستخدمين قبل إسناد المهام."
                : "Could not load employees from the server. Check the users API before assigning tasks."}
            </p>
          )}

          <Button
            type="button"
            disabled={isGenerating || (sourceType === "email" ? !emailContent.trim() : !imageFile)}
            onClick={generateRecommendation}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border-0 bg-[#47759c] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#3c6689] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon name="spark" size={17} />
            {isGenerating
              ? isArabicUi ? "جارٍ تحليل المحتوى..." : "Analyzing..."
              : isArabicUi ? "تحليل واقتراح المهام" : "Analyze and suggest tasks"}
          </Button>
          <p className={`mt-3 text-xs leading-5 ${mutedClass}`}>
            {isArabicUi
              ? "بعد التحليل ستظهر المهام المقترحة والموظف المناسب لكل مهمة، ويمكنك تغيير الاختيار قبل الإسناد."
              : "After analysis, suggested tasks and recommended employees appear. You can change each employee before assignment."}
          </p>
        </div>

        <div className={`workflow-card min-w-0 rounded-2xl border p-3 sm:p-5 lg:p-6 ${panelClass}`}>
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#2eb5bc] text-sm font-bold text-white">2</span>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold">{isArabicUi ? "راجع المهام والموظفين" : "Review tasks and assignees"}</h2>
              <p className={`mt-1 text-xs ${mutedClass}`}>
                {isArabicUi ? "الاختيار المقترح قابل للتغيير قبل الاعتماد" : "AI suggestions can be changed before confirmation"}
              </p>
            </div>
            {analysis && (
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600">
                {analysis.status}
              </span>
            )}
          </div>

          {!analysis ? (
            <div className={`flex min-h-64 flex-col items-center sm:min-h-80 lg:min-h-96 justify-center rounded-xl border border-dashed px-6 py-10 text-center ${
              darkMode ? "border-slate-700 bg-slate-950/60" : "border-[#e5e6ea] bg-[#fbfbfc]"
            }`}>
              {isGenerating ? (
                <>
                  <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-[#2eb5bc]/10 text-[#2eb5bc]">
                    <span className="absolute inset-1 animate-spin rounded-xl border-2 border-transparent border-t-[#2eb5bc]" />
                    <Icon name="spark" size={27} />
                  </span>
                  <h3 className="mt-4 font-bold">{isArabicUi ? "جارٍ تحليل المحتوى..." : "Analyzing your content..."}</h3>
                  <p className={`mt-2 max-w-sm text-sm leading-6 ${mutedClass}`}>
                    {isArabicUi ? "نستخرج المهام ونحللها ونبحث عن الموظفين المناسبين. قد يستغرق ذلك بضع لحظات." : "Extracting tasks and preparing employee recommendations. This may take a few moments."}
                  </p>
                  <div className="mt-5 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div className="h-full w-2/5 animate-pulse rounded-full bg-[#2eb5bc]" />
                  </div>
                </>
              ) : (
                <>
                  <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#e8f8f8] text-[#2eb5bc]">
                    <Icon name="spark" size={28} />
                  </span>
                  <h3 className="mt-4 font-bold">{isArabicUi ? "نتيجة التحليل هتظهر هنا" : "Analysis results will appear here"}</h3>
                  <p className={`mt-2 max-w-sm text-sm leading-6 ${mutedClass}`}>
                    {isArabicUi ? "أدخل محتوى المهمة واضغط «تحليل واقتراح المهام» لعرض الاقتراحات وترشيحات الموظفين." : "Provide the task content and select “Analyze and suggest tasks” to review proposals and employee recommendations."}
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4  px-6 py-10 text-center">
              <div className={`rounded-xl flex min-h-64 flex-col items-center sm:min-h-80 lg:min-h-96 justify-center  border-dashed border p-4 ${darkMode ? "border-emerald-500/30 bg-emerald-500/5" : "border-emerald-200 bg-emerald-50/70"}`}>
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-600">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500 text-white">✓</span>
                  {isArabicUi ? "تم التحليل بنجاح" : "Analysis completed successfully"}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className={`text-xs ${mutedClass}`}>{isArabicUi ? "بدأ التحليل بواسطة" : "Analysis started by"}</span>
                  <span className="wrap-break-word text-xs font-semibold">{analysis.sender.displayName || "Mohamed Adel Elsayed Ibrahim Elseglaby"} · {analysis.sender.role || "SUPER_SUPERVISOR"}</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <span className={`text-xs ${mutedClass}`}>{isArabicUi ? "رقم التحليل" : "Analysis ID"}</span>
                  <code className="max-w-full break-all text-xs">{analysis.analysisId}</code>
                </div>
              </div>


            </div>
          )}
        </div>
      </div>
      )}

      {analysis && workflowStep === 2 && (
        <section className={`workflow-card mt-5 w-full min-w-0 rounded-2xl border p-3 shadow-sm sm:p-5 lg:p-6 ${panelClass}`}>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">{isArabicUi ? "المهام المقترحة وتوصيات الموظفين" : "Task recommendations and employee assignments"}</h2>
              <p className={`mt-1 text-sm ${mutedClass}`}>{isArabicUi ? "راجع كل مهمة واختر الموظف المناسب قبل اعتماد الاختيارات." : "Review each task and choose the right employee before confirming."}</p>
            </div>
            <span className="rounded-full bg-[#2eb5bc]/10 px-3 py-1.5 text-xs font-bold text-[#238e94]">{analysis.proposals.length} {isArabicUi ? "مهام مقترحة" : "proposed tasks"}</span>
          </div>
          <div className="grid min-w-0 grid-cols-1 items-start gap-3 xl:grid-cols-2 2xl:grid-cols-3">
              {analysis.proposals.map((proposal, index) => {
                const recommended = proposal.recommendation;
                const selectedId = selectedEmployees[proposal.proposalId] ?? "";
                const selectedEmployee = employees.find((employee) => employee.id === selectedId) ??
                  (recommended?.userId === selectedId
                    ? {
                        id: recommended.userId,
                        name: recommended.displayName,
                        email: recommended.email ?? "",
                        jobTitle: recommended.jobTitle || proposal.predictedJobTitle || "",
                        role: "EMPLOYEE",
                        teamId: null,
                      }
                    : undefined);
                const recommendationIsDifferent = !!recommended && selectedId !== recommended.userId;

                return (
                  <article key={proposal.proposalId} className={`rounded-xl border p-3 sm:p-5 ${
                    darkMode ? "border-slate-700 bg-slate-950/40" : "border-[#e5e6ea] bg-white"
                  }`}>
                    <div className="mb-3 flex items-start gap-3">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#47759c]/10 text-sm font-bold text-[#47759c]">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="wrap-break-word font-bold leading-6">{proposal.title}</h3>
                        <p className={`mt-1 wrap-break-word text-sm leading-6 ${mutedClass}`}>{proposal.description}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${
                        proposal.predictionStatus === "success"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-amber-500/10 text-amber-600"
                      }`}>
                        {proposal.predictionStatus === "success"
                          ? isArabicUi ? "نجح التوقع" : "Prediction success"
                          : isArabicUi ? "يحتاج مراجعة" : "Needs review"}
                      </span>
                    </div>

                    {proposal.sourceText && (
                      <p className={`mb-3 rounded-lg border p-3 text-xs leading-5 ${darkMode ? "border-slate-700 text-slate-300" : "border-slate-200 text-slate-600"}`}>
                        <strong>{isArabicUi ? "النص المستخرج:" : "Extracted source:"}</strong> {proposal.sourceText}
                      </p>
                    )}
                    {proposal.suggestedDeadline && (
                      <p className={`mb-3 text-xs ${mutedClass}`}>
                        <strong>{isArabicUi ? "الموعد المقترح:" : "Suggested deadline:"}</strong> {new Date(proposal.suggestedDeadline).toLocaleString(isArabicUi ? "ar-EG" : "en-US")}
                      </p>
                    )}
                   
                    {workflowStep === 2 && (
                      <div className={`mb-4 rounded-xl border p-4 ${
                        darkMode ? "border-slate-700 bg-slate-900/70" : "border-[#d8f0f1] bg-[#f1fbfb]"
                      }`}>
                        <p className="text-xs font-bold uppercase tracking-wide text-[#238e94]">
                          {isArabicUi ? "الترشيح المقترح" : "AI employee recommendation"}
                        </p>
                        {recommended ? (
                          <div className="mt-2">
                            <p className="font-bold">{recommended.displayName}</p>
                            <p className={`mt-1 text-sm ${mutedClass}`}>{recommended.jobTitle || proposal.predictedJobTitle}</p>
                            <p className={`mt-1 text-xs ${mutedClass}`}>{recommended.email}</p>
                          </div>
                        ) : (
                          <div className="mt-2">
                            <p className="mt-4 text-sm text-amber-600">
                              {localizeRecommendationMessage(proposal.recommendationMessage, isArabicUi)}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {workflowStep === 2 && (
                    <>
                    <label className="block">
                      <span className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm font-semibold">
                        <span>{isArabicUi ? "الموظف المسؤول عن التنفيذ" : "Assign to employee"}</span>
                        {recommended && !recommendationIsDifferent && (
                          <span className="rounded-full bg-[#2eb5bc]/10 px-2 py-1 text-[10px] font-bold text-[#238e94]">
                            {isArabicUi ? "ترشيح الذكاء الاصطناعي" : "AI recommendation"}
                          </span>
                        )}
                        {recommendationIsDifferent && (
                          <span className="rounded-full bg-blue-500/10 px-2 py-1 text-[10px] font-bold text-blue-600">
                            {isArabicUi ? "تم تغيير المرشح" : "Recommendation changed"}
                          </span>
                        )}
                      </span>
                      <div className="relative">
                        <select
                          value={selectedId}
                          onChange={(event) => {
                            const nextEmployeeId = event.target.value;
                            const nextEmployee = employees.find((employee) => employee.id === nextEmployeeId) ??
                              (recommended?.userId === nextEmployeeId
                                ? {
                                    id: recommended.userId,
                                    name: recommended.displayName,
                                    email: recommended.email ?? "",
                                    jobTitle: recommended.jobTitle || proposal.predictedJobTitle || "",
                                    role: "EMPLOYEE",
                                    teamId: null,
                                  }
                                : undefined);

                            setSelectedEmployees((previous) => ({
                              ...previous,
                              [proposal.proposalId]: nextEmployeeId,
                            }));

                            setEmailDrafts((previous) => ({
                              ...previous,
                              [proposal.proposalId]: {
                                ...(previous[proposal.proposalId] ?? {
                                  to: "",
                                  subject: proposal.title,
                                  body: "",
                                }),
                                to: nextEmployee?.email ?? "",
                                body: nextEmployee
                                  ? isArabicUi
                                    ? `مرحبًا ${nextEmployee.name}،

                                    نرجو تنفيذ المهمة التالية: ${proposal.title}.

                                    تفاصيل المهمة: ${proposal.description}

                                    الموعد المقترح: ${proposal.suggestedDeadline || "غير محدد"}

                                    يرجى تأكيد استلام المهمة وإبلاغ المشرف بالتقدم.

                                    شكرًا لك.`
                                                  : `Hi ${nextEmployee.name},

                                    Please work on the following task: ${proposal.title}.

                                    Task details: ${proposal.description}

                                    Suggested deadline: ${proposal.suggestedDeadline || "Not specified"}

                                    Please confirm receipt and keep your supervisor updated.

                                    Thank you.`
                                  : (previous[proposal.proposalId]?.body ?? ""),
                              },
                            }));
                          }}
                          className={`${inputClass} workflow-select appearance-none ${
                            isArabicUi ? "pl-10 pr-4" : "pl-4 pr-10"
                          }`}
                        >
                          <option value="" disabled>
                            {isArabicUi ? "اختر الموظف..." : "Select an employee..."}
                          </option>

                          {recommended &&
                            !employees.some((employee) => employee.id === recommended.userId) && (
                              <option value={recommended.userId}>
                                {recommended.displayName} — {recommended.jobTitle} (
                                {isArabicUi ? "ترشيح التحليل" : "analysis recommendation"})
                              </option>
                            )}

                          {employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                              {employee.name}
                              {employee.jobTitle ? ` — ${employee.jobTitle}` : ""}
                              {employee.email ? ` (${employee.email})` : ""}
                            </option>
                          ))}
                        </select>

                        {/* Custom SVG arrow */}
                        <svg
                          className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 ${
                            isArabicUi ? "left-3" : "right-3"
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </div>
                    </label>

                    {selectedEmployee && (
                      <div className={`mt-3 flex items-start gap-3 rounded-lg border p-3 ${
                        darkMode ? "border-slate-700" : "border-[#e5e6ea]"
                      }`}>
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#47759c]/10 font-bold text-[#47759c]">
                          {selectedEmployee.name.slice(0, 1).toUpperCase()}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold">{selectedEmployee.name}</p>
                          <p className={`mt-1 break-all text-xs ${mutedClass}`}>{selectedEmployee.email || (isArabicUi ? "لا يوجد بريد إلكتروني" : "No email provided")}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {selectedEmployee.jobTitle && (
                              <span className="rounded-full bg-[#47759c]/10 px-2 py-1 text-[10px] font-semibold text-[#47759c]">{selectedEmployee.jobTitle}</span>
                            )}
                            {selectedEmployee.teamId && (
                              <span className={`rounded-full px-2 py-1 text-[10px] ${darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
                                {isArabicUi ? "الفريق" : "Team"}: {selectedEmployee.teamId}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    </>
                    )}
                  </article>
                );
              })}

              {isLoadingUsers && (
                <p className={`text-xs ${mutedClass}`}>
                  {isArabicUi ? "جارٍ تحميل قائمة الموظفين..." : "Loading employee directory..."}
                </p>
              )}

              {usersError && (
                <p className="rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-600">
                  {isArabicUi ? "تعذّر تحميل قائمة الموظفين بسبب فشل طلب المستخدمين." : "The employee list could not be loaded because the users request failed."}
                </p>
              )}

              {workflowStep < 4 && analysis && (
                <div className={`rounded-xl border p-4 ${darkMode ? "border-slate-700 bg-slate-800/60" : "border-[#d8f0f1] bg-[#f1fbfb]"}`}>
                  <p className="text-sm font-bold">
                    {isArabicUi ? "الخطوة 2 من 3 — راجع المهمة والموظف" : "Step 2 of 3 — Review task and employee"}
                  </p>
                  <p className={`mt-1 text-xs leading-5 ${mutedClass}`}>
                    {isArabicUi
                      ? "راجع المهمة وترشيح الذكاء الاصطناعي، واختر الموظف من القائمة عند الحاجة. بطاقة الموظف المختار تظهر أسفل القائمة، ثم انتقل لمعاينة البريد."
                      : "Review the task and AI recommendation. Change the employee in the dropdown if needed; the selected employee card appears below it. Then continue to email preview."}
                  </p>
                  <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row">
                    <Button
                      type="button"
                      disabled={
                        workflowStep === 2 &&
                        analysis.proposals.some((proposal) => {
                          const employeeId = selectedEmployees[proposal.proposalId];
                          const emailTo = emailDrafts[proposal.proposalId]?.to?.trim();

                          return !employeeId || !emailTo;
                        })
                      }
                      onClick={continueWorkflow}
                      className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border-0 bg-[#2eb5bc] px-4 text-sm font-bold text-white transition hover:bg-[#259da3] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isArabicUi
                        ? "اعتماد الموظفين ومعاينة البريد"
                        : "Confirm employees and preview email"}
                      <Icon name="arrow" size={16} />
                    </Button>
                  </div>
                </div>
              )}

          </div>
        </section>
      )}

      

      {workflowStep === 3 && analysis && (
        <section className={`workflow-card mt-5 w-full min-w-0 overflow-hidden rounded-2xl border shadow-sm ${
                darkMode ? "border-slate-700 bg-slate-900 text-slate-100" : "border-[#dfe5ea] bg-white text-[#252630]"
              }`}>
                <div className={`flex flex-wrap items-center justify-between gap-3 border-b px-3 py-3 sm:px-5 sm:py-4 lg:px-7 ${darkMode ? "border-slate-700 bg-slate-800/70" : "border-[#e5eaf0] bg-[#f8fafc]"}`}>
                  <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#2eb5bc]/15 text-[#2eb5bc]">
                    <Icon name="mail" size={18} />
                  </span>
                    <div className="min-w-0">
                      <h3 className="font-bold">
                        {isArabicUi ? "معاينة البريد قبل الإرسال" : "Email preview"}
                      </h3>
                      <p className={`mt-1 text-xs leading-5 ${mutedClass}`}>
                        {isArabicUi ? "راجع الرسائل وانسخها أو افتحها في تطبيق البريد." : "Review each message, copy it, or open it in your email app."}
                      </p>
                    </div>
                  </div>
                  <span className={`hidden rounded-full px-3 py-1.5 text-xs font-semibold sm:inline-flex ${darkMode ? "bg-slate-700 text-slate-200" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}>
                    {analysis.proposals.length} {isArabicUi ? "رسالة" : analysis.proposals.length === 1 ? "message" : "messages"}
                  </span>
                </div>
                <div className="grid min-w-0 grid-cols-1 items-stretch gap-3 p-2 sm:gap-4 sm:p-4 2xl:grid-cols-2">

                {analysis.proposals.map((proposal, index) => {
                  const draft = emailDrafts[proposal.proposalId] ?? {
                    to: proposal.recommendation?.email ?? "",
                    subject: proposal.title,
                    body: "",
                  };
                  const employee = employees.find(
                    (item) => item.id === selectedEmployees[proposal.proposalId],
                  );
                  return (
                    
                    <div
                      key={`email-${proposal.proposalId}`}
                      className={`flex min-w-0 flex-col overflow-hidden rounded-2xl border shadow-sm transition-shadow hover:shadow-md ${
                        darkMode ? "border-slate-700 bg-slate-950/40" : "border-[#dce7ef] bg-white"
                      }`}
                    >
                      <div className={`flex flex-wrap items-center justify-between gap-3 border-b-2 border-b-[#2eb5bc] px-3 py-3 sm:px-4 ${darkMode ? "border-slate-700 bg-slate-800/60" : "border-[#e8f1f7] bg-linear-to-r from-[#f2f9ff] to-[#f0fbfb]"}`}>
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#2eb5bc]/15 text-[#2eb5bc]"><Icon name="mail" size={17} /></span>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold">{draft.subject || (isArabicUi ? "بدون موضوع" : "No subject")}</p>
                            <p className={`mt-0.5 truncate text-[11px] ${mutedClass}`}>{employee?.name ?? (isArabicUi ? "لم يتم اختيار موظف" : "No employee selected")}</p>
                          </div>
                        </div>
                        <p className="max-w-full text-xs font-bold">
                          {isArabicUi ? `رسالة المهمة ${index + 1}` : `Task email ${index + 1}`}
                        </p>
                        <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${darkMode ? "bg-slate-700 text-slate-300" : "bg-emerald-50 text-emerald-700"}`}>
                          {isArabicUi ? "مسودة" : "Draft"}
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col space-y-3 p-3 sm:p-4">
                      <label className="block">
                        <span className="mb-1 block text-[11px] font-semibold">
                          {isArabicUi ? "إلى" : "To"}
                        </span>
                        <input
                          type="email"
                          value={draft.to}
                          onChange={(event) => {
                            setEmailDrafts((previous) => ({
                              ...previous,
                              [proposal.proposalId]: {
                                ...draft,
                                to: event.target.value,
                              },
                            }));
                          }}
                          placeholder="employee@example.com"
                          className={`${inputClass} min-w-0 py-2 text-xs`}
                        />
                      </label>

                      <label className="block">
                        <span className="mb-1 block text-[11px] font-semibold">
                          {isArabicUi ? "الموضوع" : "Subject"}
                        </span>
                        <input
                          value={draft.subject}
                          onChange={(event) => {
                            setEmailDrafts((previous) => ({
                              ...previous,
                              [proposal.proposalId]: {
                                ...draft,
                                subject: event.target.value,
                              },
                            }));
                          }}
                          className={`${inputClass} min-w-0 py-2 text-xs`}
                        />
                      </label>

                      <label className="block">
                        <span className="mb-1 block text-[11px] font-semibold">
                          {isArabicUi ? "الموعد النهائي للمهمة" : "Task deadline"}
                        </span>
                        <input
                          type="datetime-local"
                          required
                          aria-required="true"
                          aria-invalid={Boolean(deadlineErrors[proposal.proposalId])}
                          value={deadlines[proposal.proposalId] ?? ""}
                          onChange={(event) => {
                            const value = event.target.value;
                            setDeadlines((previous) => ({
                              ...previous,
                              [proposal.proposalId]: value,
                            }));
                            if (value) {
                              setDeadlineErrors((previous) => {
                                const next = { ...previous };
                                delete next[proposal.proposalId];
                                return next;
                              });
                            }
                          }}
                          className={`${inputClass} py-2 text-xs ${deadlineErrors[proposal.proposalId] ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10" : ""}`}
                        />
                        {deadlineErrors[proposal.proposalId] ? (
                          <span role="alert" className="mt-1 block text-xs text-rose-600">
                            {deadlineErrors[proposal.proposalId]}
                          </span>
                        ) : (
                          <span className={`mt-1 block text-[10px] ${mutedClass}`}>
                            {isArabicUi
                              ? "مطلوب — حدّد تاريخ ووقت الموعد النهائي."
                              : "Required — select the deadline date and time."}
                          </span>
                        )}
                      </label>

                      <label className="block">
                        <span className="mb-1 block text-[11px] font-semibold">
                          {isArabicUi ? "نص الرسالة" : "Email message"}
                        </span>
                        <textarea
                          rows={8}
                          value={draft.body}
                          onChange={(event) => {
                            setEmailDrafts((previous) => ({
                              ...previous,
                              [proposal.proposalId]: {
                                ...draft,
                                body: event.target.value,
                              },
                            }));
                          }}
                          className={`${inputClass} h-56 resize-none overflow-y-auto rounded-xl py-2 text-xs leading-6 ${darkMode ? "bg-slate-900" : "bg-[#f8fbfe]"}`}
                        />
                      </label>
                      <div className="mt-auto grid grid-cols-1 gap-2 pt-4 2xl:grid-cols-3">
                        <Button
                          type="button"
                          onClick={() => copyEmailDraft(proposal.proposalId)}
                          className={`flex min-h-11 w-full min-w-0 items-center justify-center gap-2 whitespace-normal rounded-xl border px-3 py-2 text-center text-xs leading-5 font-bold transition ${buttonSecondaryClass}`}
                        >
                          {copiedEmailId === proposal.proposalId ? "✓" : <span aria-hidden="true">▢</span>}
                          {copiedEmailId === proposal.proposalId
                            ? isArabicUi ? "تم النسخ" : "Copied!"
                            : isArabicUi ? "نسخ البريد بالكامل" : "Copy full email"}
                        </Button>
                        <Button
                          type="button"
                          onClick={() => openEmailDraft(proposal.proposalId)}
                          className="flex min-h-11 w-full min-w-0 items-center justify-center gap-2 whitespace-normal rounded-xl border-0 bg-[#2eb5bc] px-3 py-2 text-center text-xs leading-5 font-bold text-white transition hover:bg-[#259da3]"
                        >
                          <Icon name="send" size={15} />
                          {isArabicUi ? "فتح البريد لإرساله" : "Open email app to send"}
                        </Button>
                        <Button
                          type="button"
                          disabled={savingProposalId === proposal.proposalId || savedProposalIds.includes(proposal.proposalId)}
                          onClick={() => saveTaskDraft(proposal.proposalId)}
                          className="flex min-h-11 w-full min-w-0 items-center justify-center gap-2 whitespace-normal rounded-xl border-0 bg-[#47759c] px-3 py-2 text-center text-xs leading-5 font-bold text-white transition hover:bg-[#3c6689] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {savingProposalId === proposal.proposalId
                            ? (isArabicUi ? "جارٍ الحفظ..." : "Saving...")
                            : savedProposalIds.includes(proposal.proposalId)
                              ? (isArabicUi ? "تم إنشاء المهمة" : "Task created")
                              : (isArabicUi ? "إنشاء المهمة وحفظ المسودة" : "Create task & save draft")}
                        </Button>
                      </div>
                      </div>
                    </div>
                  );
                })}
                </div>
                <div className={`flex flex-col gap-3 border-t px-3 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:px-7 ${darkMode ? "border-slate-700 bg-slate-800/40" : "border-[#e8edf1] bg-[#fbfcfd]"}`}>
                  <p className={`text-xs leading-5 ${mutedClass}`}>
                    {isArabicUi
                      ? "هذه الرسائل مسودات فقط. النسخ لا يرسل البريد؛ يمكنك فتح تطبيق البريد لإرسالها يدويًا."
                      : "These are drafts only. Copying does not send email; open your mail app to send manually."}
                  </p>
                  <Button
                    type="button"
                    onClick={() => setWorkflowStep(2)}
                    className={`flex min-h-11 w-full shrink-0 items-center justify-center rounded-xl border px-4 text-sm font-semibold lg:w-auto ${buttonSecondaryClass}`}
                  >
                    {isArabicUi ? "رجوع وتغيير الموظفين" : "Back to change employees"}
                  </Button>
                </div>
        </section>
      )}

      {workflowStep !== 3 && (
        <div className={`mt-5 flex items-start gap-3 rounded-xl border p-4 ${
          darkMode ? "border-slate-700 bg-slate-900" : "border-[#e3eaee] bg-[#f7fafb]"
        }`}>
          <span className="mt-0.5 text-[#47759c]"><Icon name="spark" size={17} /></span>
          <p className={`text-xs leading-6 ${mutedClass}`}>
            <strong className={darkMode ? "text-slate-200" : "text-[#47759c]"}>
              {isArabicUi ? "ملاحظة عن الربط:" : "Integration note:"}
            </strong>{" "}
            {isArabicUi
              ? "يمكنك تحديد الموعد النهائي لكل مهمة ثم إنشاء المهمة وحفظ مسودة البريد من خلال نقطة الـ API. حفظ المسودة لا يرسل البريد؛ استخدم فتح تطبيق البريد لإرساله يدويًا."
              : "Set a deadline for each task, then create the task and save its email draft through the API. Saving the draft does not send email; use the email-app action to send it manually."}
          </p>
        </div>
      )}
    </section>
  );
}



// "use client";

// import { useEffect, useRef, useState, type ReactNode } from "react";
// import { toast } from "sonner";



// import { useDashboardLayout } from "@/app/components/DashboardLayout";
// import { useGetUsersQuery } from "@/app/services/team-members-api";
// import { IAnalysisResponse, IEmailDraft, IIntakeApiResponse, ISelectableEmployee } from "@/app/interfaces/add-task-interface";
// import { useAnalyzeTaskIntakeMutation, useCreateTaskDraftAndConfirmMutation } from "@/app/services/task-in-take- api";

// type IconName =
//   | "spark"
//   | "arrow"
//   | "mail"
//   | "image"
//   | "send";

// function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
//   const paths: Record<IconName, ReactNode> = {
//     spark: <path d="m12 3-1.2 4.1a5.4 5.4 0 0 1-3.7 3.7L3 12l4.1 1.2a5.4 5.4 0 0 1 3.7 3.7L12 21l1.2-4.1a5.4 5.4 0 0 1 3.7-3.7L21 12l-4.1-1.2a5.4 5.4 0 0 1-3.7-3.7Z" />,
//     arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
//     mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
//     image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-5-5L5 20" /></>,
//     send: <path d="m22 2-7 20-4-9-9-4Z M22 2 11 13" />,
//   };

//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
//       {paths[name]}
//     </svg>
//   );
// }

// function Button({
//   children,
//   className = "",
//   onClick,
//   ariaLabel,
//   type,
//   disabled = false,
// }: {
//   children: ReactNode;
//   className?: string;
//   onClick?: () => void;
//   ariaLabel?: string;
//   type?: "button" | "submit";
//   disabled?: boolean;
// }) {
//   return <button type={type} aria-label={ariaLabel} disabled={disabled} className={className} onClick={onClick}>{children}</button>;
// }



// function asRecord(value: unknown): Record<string, unknown> {
//   return value && typeof value === "object"
//     ? (value as Record<string, unknown>)
//     : {};
// }

// function readText(record: Record<string, unknown>, ...keys: string[]): string {
//   for (const key of keys) {
//     const value = record[key];
//     if (typeof value === "string" && value.trim()) return value;
//     if (typeof value === "number") return String(value);
//   }
//   return "";
// }

// function localizeRecommendationMessage(message: string | null | undefined, isArabicUi: boolean): string {
//   const normalized = message?.trim() ?? "";
//   if (!normalized) {
//     return isArabicUi
//       ? "لم يتم العثور على ترشيح تلقائي لهذا الموظف. يمكنك اختيار الموظف المناسب يدويًا."
//       : "No automatic employee recommendation is available. You can choose an employee manually.";
//   }

//   if (normalized.toLowerCase().includes("successful job-title prediction is required before recommending an employee")) {
//     return isArabicUi
//       ? "يتعذر ترشيح موظف قبل تحديد المسمى الوظيفي المناسب بنجاح. يمكنك اختيار الموظف يدويًا."
//       : "An employee cannot be recommended until the job-title prediction succeeds. You can choose an employee manually.";
//   }

//   return normalized;
// }

// function normalizeEmployees(response: unknown): ISelectableEmployee[] {
//   const root = asRecord(response);
//   const possibleData = root.data;
//   const list = Array.isArray(possibleData)
//     ? possibleData
//     : Array.isArray(root.users)
//       ? root.users
//       : Array.isArray(root.items)
//         ? root.items
//         : [];

//   return list
//     .map((item): ISelectableEmployee | null => {
//       const user = asRecord(item);
//       const roleValue = user.role;
//       const roleObject = asRecord(roleValue);
//       const jobTitleValue = user.jobTitle ?? user.job_title;
//       const jobTitleObject = asRecord(jobTitleValue);
//       const teamValue = user.teamId ?? user.team_id ?? user.team;
//       const teamObject = asRecord(teamValue);
//       const role =
//         typeof roleValue === "string"
//           ? roleValue
//           : readText(roleObject, "code", "name", "role");
//       const id = readText(user, "userId", "id", "employeeId", "employee_id");
//       const name = readText(
//         user,
//         "displayName",
//         "fullName",
//         "name",
//         "username",
//       );
//       if (!id || !name) return null;

//       const activeValue = user.isActive ?? user.active ?? user.is_active;
//       if (activeValue === false) return null;
//       // if (role && !role.toUpperCase().includes("EMPLOYEE")) return null;
//       if (role &&  !["EMPLOYEE", "SUPERVISOR"].includes(role.toUpperCase())) return null;

//       return {
//         id,
//         name,
//         email: readText(user, "email", "emailAddress"),
//         jobTitle:
//           typeof jobTitleValue === "string"
//             ? jobTitleValue
//             : readText(jobTitleObject, "name", "title", "description"),
//         role: role || "EMPLOYEE",
//         teamId:
//           typeof teamValue === "string"
//             ? teamValue
//             : readText(teamObject, "id", "teamId") || null,
//       };
//     })
//     .filter((employee): employee is ISelectableEmployee => employee !== null);
// }

// function toDateTimeLocal(value?: string | null): string {
//   if (!value) return "";
//   const date = new Date(value);
//   if (Number.isNaN(date.getTime())) return "";
//   const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
//   return localDate.toISOString().slice(0, 16);
// }

// function dateTimeLocalToIso(value: string): string | null {
//   if (!value.trim()) return null;
//   const date = new Date(value);
//   return Number.isNaN(date.getTime()) ? null : date.toISOString();
// }

// function localizeErrorMessage(
//   message: string | null | undefined,
//   isArabicUi: boolean,
//   fallback?: string,
// ): string {
//   const text = message?.trim() ?? "";
//   if (!text) {
//     return fallback || (isArabicUi
//       ? "حدث خطأ غير متوقع. حاول مرة أخرى."
//       : "An unexpected error occurred. Please try again.");
//   }

//   const hasArabic = /[\u0600-\u06FF]/.test(text);
//   // Keep errors that already match the selected interface language.
//   if ((isArabicUi && hasArabic) || (!isArabicUi && !hasArabic)) return text;

//   const normalized = text.toLowerCase();
//   if (normalized.includes("deadline")) {
//     return isArabicUi ? "يجب تحديد الموعد النهائي للمهمة." : "A task deadline is required.";
//   }
//   if (normalized.includes("network") || normalized.includes("fetch")) {
//     return isArabicUi
//       ? "تعذّر الاتصال بالخادم. تحقق من الاتصال وحاول مرة أخرى."
//       : "Could not connect to the server. Check your connection and try again.";
//   }
//   if (normalized.includes("unauthorized") || normalized.includes("forbidden")) {
//     return isArabicUi
//       ? "ليست لديك صلاحية لتنفيذ هذا الإجراء. سجّل الدخول مرة أخرى إذا لزم الأمر."
//       : "You are not authorized to perform this action. Sign in again if needed.";
//   }
//   if (normalized.includes("internal server error") || normalized.includes("500")) {
//     return isArabicUi
//       ? "حدث خطأ في الخادم أثناء تنفيذ الطلب. حاول مرة أخرى."
//       : "The server encountered an error while processing the request. Please try again.";
//   }

//   return fallback || (isArabicUi
//     ? "حدث خطأ أثناء تنفيذ الطلب. حاول مرة أخرى."
//     : "An error occurred while processing the request. Please try again.");
// }

// export default function NewTaskPage() {
//   const { isArabic, darkMode } = useDashboardLayout();
//   const [sourceType, setSourceType] = useState<"email" | "image">("email");
//   const [workflowStep, setWorkflowStep] = useState<1 | 2 | 3 >(1);
//   const [emailContent, setEmailContent] = useState("");
//   const [imageName, setImageName] = useState("");
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   // const [apiError, setApiError] = useState("");
//   const [imagePreview, setImagePreview] = useState("");
//   const [subject] = useState("");
//   const [analysis, setAnalysis] = useState<IAnalysisResponse | null>(null);
//   const [storageReady, setStorageReady] = useState(false);
//   const activeAnalysisRequest = useRef<{ abort: () => void } | null>(null);
//   const analysisCancelled = useRef(false);
//   const ANALYSIS_STORAGE_KEY = "new-task-analysis-session-v1";
//   const [selectedEmployees, setSelectedEmployees] = useState<Record<string, string>>({});
//   const [emailDrafts, setEmailDrafts] = useState<Record<string, IEmailDraft>>({});
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const [copiedEmailId, setCopiedEmailId] = useState<string | null>(null);
//   const [savingProposalId, setSavingProposalId] = useState<string | null>(null);
//   const [savedProposalIds, setSavedProposalIds] = useState<string[]>([]);
//   const [deadlines, setDeadlines] = useState<Record<string, string>>({});
//   const [deadlineErrors, setDeadlineErrors] = useState<Record<string, string>>({});
//   // const [actionMessage, setActionMessage] = useState("");

//   // Uses the existing GET /users RTK Query endpoint.
//   // The sample list keeps the workflow preview usable if the endpoint is empty or unavailable.
//   const { data: usersResponse, isLoading: isLoadingUsers, isError: usersError } = useGetUsersQuery();
//   const [analyzeTaskIntake] = useAnalyzeTaskIntakeMutation();
//   const [createTaskDraft] = useCreateTaskDraftAndConfirmMutation();

//   // Restore browser storage after the initial commit. The animation-frame callback
//   // keeps state updates out of the synchronous effect body (React 19 lint rule).
//   useEffect(() => {
//     const frameId = window.requestAnimationFrame(() => {
//       try {
//         const raw = window.localStorage.getItem(ANALYSIS_STORAGE_KEY);
//         if (raw) {
//           const saved = JSON.parse(raw) as {
//             analysis?: IAnalysisResponse;
//             workflowStep?: 1 | 2 | 3;
//             selectedEmployees?: Record<string, string>;
//             emailDrafts?: Record<string, IEmailDraft>;
//             savedProposalIds?: string[];
//             deadlines?: Record<string, string>;
//           };

//           if (saved.analysis?.analysisId && Array.isArray(saved.analysis.proposals)) {
//             setAnalysis(saved.analysis);
//             setWorkflowStep(saved.workflowStep === 3 ? 3 : 2);
//             setSelectedEmployees(saved.selectedEmployees ?? {});
//             setEmailDrafts(saved.emailDrafts ?? {});
//             setSavedProposalIds(saved.savedProposalIds ?? []);
//             setDeadlines(saved.deadlines ?? {});
//           }
//         }
//       } catch (error) {
//         console.error("Could not restore the saved task analysis:", error);
//         window.localStorage.removeItem(ANALYSIS_STORAGE_KEY);
//       } finally {
//         setStorageReady(true);
//       }
//     });

//     return () => window.cancelAnimationFrame(frameId);
//   }, []);

//   // Keep the analysis and review edits available after refresh.
//   useEffect(() => {
//     if (!storageReady) return;
//     if (!analysis) {
//       window.localStorage.removeItem(ANALYSIS_STORAGE_KEY);
//       return;
//     }
//     try {
//       window.localStorage.setItem(ANALYSIS_STORAGE_KEY, JSON.stringify({
//         analysis,
//         workflowStep,
//         selectedEmployees,
//         emailDrafts,
//         savedProposalIds,
//         deadlines,
//       }));
//     } catch (error) {
//       console.error("Could not persist the task analysis:", error);
//       toast.error(isArabic ? "تعذر حفظ نتيجة التحليل محليًا." : "Could not save the analysis locally.");
//     }
//   }, [storageReady, analysis, workflowStep, selectedEmployees, emailDrafts, savedProposalIds, deadlines, isArabic]);
//   const apiEmployees = normalizeEmployees(usersResponse);
//   const employees = apiEmployees;

//   // console.log(usersResponse)
//   // console.log(employees)

//   const isArabicUi = isArabic;

//   // Show a toast for every failed action, even when the same message repeats.
//   // React state effects keyed only by the message do not rerun for identical strings.
//   const showApiError = (message: string) => {
//     // setApiError(message);
//     toast.error(message);
//   };
//   const panelClass = darkMode
//     ? "border-slate-700 bg-slate-900 text-slate-100"
//     : "border-[#e5e6ea] bg-white text-[#252630]";
//   const mutedClass = darkMode ? "text-slate-400" : "text-[#85868f]";
//   const inputClass = `w-full rounded-xl border px-3.5 py-3 text-sm outline-none transition focus:border-[#2eb5bc] focus:ring-4 focus:ring-[#2eb5bc]/10 ${
//     darkMode
//       ? "border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500"
//       : "border-[#dedfe4] bg-white text-[#3d3e43] placeholder:text-[#a5a6ad]"
//   }`;
//   const buttonSecondaryClass = darkMode
//     ? "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
//     : "border-[#e5e6ea] bg-white text-[#505157] hover:bg-slate-50";

//   const handleImageFile = (file?: File) => {
//     if (!file) return;
//     const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/bmp", "image/tiff"];
//     if (!allowedImageTypes.includes(file.type)) {
//       showApiError(isArabicUi ? "نوع الصورة غير مدعوم. استخدم JPEG أو PNG أو WEBP أو BMP أو TIFF." : "Unsupported image type. Use JPEG, PNG, WEBP, BMP, or TIFF.");
//       return;
//     }
//     if (file.size > 10 * 1024 * 1024) {
//       showApiError(isArabicUi ? "حجم الصورة يجب ألا يتجاوز 10 ميجابايت." : "Image size must not exceed 10 MB.");
//       return;
//     }
//     // setApiError("");
//     setImageFile(file);
//     setImageName(file.name);
//     const reader = new FileReader();
//     reader.onload = () => setImagePreview(String(reader.result));
//     reader.readAsDataURL(file);
//   };

//   const generateRecommendation = async () => {
//     if (sourceType === "email" ? !emailContent.trim() : !imageFile) return;

//     analysisCancelled.current = false;
//     activeAnalysisRequest.current = null;
//     setIsGenerating(true);
//     // setApiError("");
//     setAnalysis(null);
//     window.localStorage.removeItem(ANALYSIS_STORAGE_KEY);
//     setWorkflowStep(1);
//     try {
//       let result: Partial<IIntakeApiResponse>;
//       if (sourceType === "image") {
//         if (!imageFile) throw new Error(isArabicUi ? "اختر صورة أولًا." : "Choose an image first.");
//         const request = analyzeTaskIntake({ file: imageFile });
//         activeAnalysisRequest.current = request;
//         result = await request.unwrap() as Partial<IIntakeApiResponse>;
//       } else {
//         const fullEmailText = subject.trim()
//           ? `${isArabicUi ? "الموضوع" : "Subject"}: ${subject.trim()}\n\n${emailContent.trim()}`
//           : emailContent.trim();
//         if (fullEmailText.length > 100000) {
//           throw new Error(isArabicUi ? "نص البريد يتجاوز الحد المسموح (100,000 حرف)." : "Email text exceeds the 100,000 character limit.");
//         }
//         const request = analyzeTaskIntake({ emailText: fullEmailText });
//         activeAnalysisRequest.current = request;
//         result = await request.unwrap() as Partial<IIntakeApiResponse>;
//       }
//       if (!result.analysisId || !Array.isArray(result.proposals)) {
//         throw new Error(isArabicUi ? "استجابة الـ API غير متوقعة." : "The API returned an unexpected response.");
//       }

//       const responseSender = result.sender;
//       const normalized: IAnalysisResponse = {
//         analysisId: result.analysisId,
//         status: result.analysis?.analysisStatus || result.status || "COMPLETED",
//         sender: {
//           userId: responseSender?.userId || "",
//           displayName: responseSender?.displayName || (isArabicUi ? "المشرف الحالي" : "Current supervisor"),
//           email: responseSender?.email,
//           role: responseSender?.role || "SUPERVISOR",
//           hierarchyLevel: responseSender?.hierarchyLevel ?? 0,
//         },
//         proposals: result.proposals.map((proposal) => ({
//           ...proposal,
//           description: proposal.description || proposal.sourceText || "",
//           predictedJobTitle: proposal.predictedJobTitle || "",
//           predictionStatus: proposal.predictionStatus || "failed",
//           predictionReason: proposal.predictionReason || proposal.recommendationMessage || "",
//         })),
//       };
//       setAnalysis(normalized);
//       setDeadlines(Object.fromEntries(
//         normalized.proposals.map((proposal) => [
//           proposal.proposalId,
//           toDateTimeLocal(proposal.suggestedDeadline),
//         ]),
//       ));
//       setWorkflowStep(2);
//       setSelectedEmployees(Object.fromEntries(
//         normalized.proposals
//           .filter((proposal) => proposal.recommendation)
//           .map((proposal) => [proposal.proposalId, proposal.recommendation!.userId]),
//       ));
//       setEmailDrafts(Object.fromEntries(normalized.proposals.map((proposal) => {
//         const employee = proposal.recommendation;
//         const emailBody = isArabicUi
//           ? `مرحبًا ${employee?.displayName ?? ""}،\n\nنرجو تنفيذ المهمة التالية: ${proposal.title}.\n\nتفاصيل المهمة: ${proposal.description}\n\nالموعد المقترح: ${proposal.suggestedDeadline || "غير محدد"}\n\nيرجى تأكيد استلام المهمة وإبلاغ المشرف بالتقدم.\n\nشكرًا لك.`
//           : `Hi ${employee?.displayName ?? ""},\n\nPlease work on the following task: ${proposal.title}.\n\nTask details: ${proposal.description}\n\nSuggested deadline: ${proposal.suggestedDeadline || "Not specified"}\n\nPlease confirm receipt and keep your supervisor updated.\n\nThank you.`;
//         return [proposal.proposalId, { to: employee?.email ?? "", subject: proposal.title, body: emailBody }];
//       })));
//       if (normalized.proposals.length === 0) {
//         // An informational backend message such as "Input processed..." is not
//         // an error. Show a clear no-tasks message in the existing alert area.
//         showApiError(
//           isArabicUi
//             ? "اكتمل تحليل المحتوى، لكن لم يتم استخراج مهام قابلة للمراجعة. راجع النص أو الصورة وحاول مرة أخرى."
//             : "The input was analyzed, but no reviewable tasks were extracted. Check the email text or image and try again."
//         );
//       }
//     } catch (error: unknown) {
//       if (analysisCancelled.current) return;
//       const errorRecord = asRecord(error);
//       const dataRecord = asRecord(errorRecord.data);

//       const status =
//         errorRecord.status ??
//         dataRecord.statusCode ??
//         dataRecord.status ??
//         asRecord(dataRecord.error).status;

//       if (status === 401 || status === "401") {
//         if (typeof window !== "undefined") {
//           localStorage.removeItem("userToken");
//           window.location.replace("/login");
//         }
//         return;
//       }

//       const errorMessage =
//         error instanceof Error
//           ? error.message
//           : readText(dataRecord, "message", "error", "details") ||
//             readText(errorRecord, "message", "error") ||
//             (typeof errorRecord.status === "number" || typeof errorRecord.status === "string"
//               ? `${isArabicUi ? "فشل طلب التحليل (HTTP/RTK Query)" : "Analysis request failed (HTTP/RTK Query)"}: ${errorRecord.status}`
//               : "");

//       showApiError(localizeErrorMessage(
//         errorMessage,
//         isArabicUi,
//         isArabicUi
//           ? "حدث خطأ غير متوقع أثناء التحليل. تحقق من اتصال الخادم وحاول مرة أخرى."
//           : "An unexpected error occurred during analysis. Check the server connection and try again.",
//       ));
//     } finally {
//       activeAnalysisRequest.current = null;
//       setIsGenerating(false);
//     }
//   };

//   const cancelAnalysis = () => {
//     if (!activeAnalysisRequest.current) return;
//     analysisCancelled.current = true;
//     activeAnalysisRequest.current.abort();
//     activeAnalysisRequest.current = null;
//     toast.info(isArabicUi ? "تم إلغاء طلب التحليل من المتصفح." : "The analysis request was cancelled in the browser.");
//   };

//   const continueWorkflow = () => {
//     if (!analysis) return;

//     if (workflowStep === 2) {
//       const missingSelection = analysis.proposals.some(
//         (proposal) => !selectedEmployees[proposal.proposalId],
//       );
//       const missingEmail = analysis.proposals.some((proposal) => {
//         const draft = emailDrafts[proposal.proposalId];
//         return !draft?.to.trim();
//       });

//       if (missingSelection || missingEmail) {
//         showApiError(
//           isArabicUi
//             ? "اختَر موظفًا لكل مهمة وتأكد من وجود البريد الإلكتروني قبل المتابعة."
//             : "Choose an employee for every task and make sure each has an email address before continuing.",
//         );
//         return;
//       }

//       setWorkflowStep(3);
//     }
//   };

//   const copyEmailDraft = async (proposalId: string) => {
//     const draft = emailDrafts[proposalId];
//     if (!draft) return;

//     const emailText = `${isArabicUi ? "إلى" : "To"}: ${draft.to}\n${isArabicUi ? "الموضوع" : "Subject"}: ${draft.subject}\n\n${draft.body}`;

//     const markAsCopied = () => {
//       setCopiedEmailId(proposalId);
//       window.setTimeout(() => {
//         setCopiedEmailId((current) => current === proposalId ? null : current);
//       }, 2000);
//     };

//     try {
//       // The modern Clipboard API only works in secure contexts and with browser permission.
//       if (navigator.clipboard && window.isSecureContext) {
//         await navigator.clipboard.writeText(emailText);
//         markAsCopied();
//         return;
//       }
//     } catch {
//       // Try the compatibility fallback below (common when running on a LAN HTTP address).
//     }

//     // Fallback for browsers/HTTP LAN deployments where navigator.clipboard is unavailable.
//     const temporaryTextarea = document.createElement("textarea");
//     temporaryTextarea.value = emailText;
//     temporaryTextarea.setAttribute("readonly", "");
//     temporaryTextarea.setAttribute("aria-hidden", "true");
//     temporaryTextarea.style.position = "fixed";
//     temporaryTextarea.style.top = "0";
//     temporaryTextarea.style.left = "-9999px";
//     temporaryTextarea.style.opacity = "0";
//     document.body.appendChild(temporaryTextarea);

//     try {
//       temporaryTextarea.focus();
//       temporaryTextarea.select();
//       temporaryTextarea.setSelectionRange(0, temporaryTextarea.value.length);
//       const copied = document.execCommand("copy");
//       if (!copied) throw new Error("Clipboard fallback failed");
//       markAsCopied();
//     } catch {
//       showApiError(isArabicUi
//         ? "تعذر النسخ تلقائيًا. حدّد نص البريد وانسخه يدويًا باستخدام Ctrl+C."
//         : "Automatic copy was blocked. Select the email text and press Ctrl+C to copy it.");
//     } finally {
//       document.body.removeChild(temporaryTextarea);
//     }
//   };

//   const openEmailDraft = (proposalId: string) => {
//     const draft = emailDrafts[proposalId];
//     if (!draft?.to.trim() || !draft.subject.trim() || !draft.body.trim()) {
//       showApiError(isArabicUi ? "أكمل المستلم والموضوع ونص الرسالة أولًا." : "Complete the recipient, subject, and message first.");
//       return;
//     }

//     const mailto = `mailto:${draft.to}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
//     window.location.href = mailto;
//   };

//   const saveTaskDraft = async (proposalId: string) => {
//     if (!analysis) return;

//     const proposal = analysis.proposals.find((item) => item.proposalId === proposalId);
//     const draft = emailDrafts[proposalId];
//     const assigneeId = selectedEmployees[proposalId];

//     if (!proposal || !draft || !assigneeId) {
//       showApiError(isArabicUi
//         ? "اختَر الموظف وأكمل بيانات مسودة البريد قبل إنشاء المهمة."
//         : "Choose an employee and complete the email draft before creating the task.");
//       return;
//     }

//     if (!draft.to.trim() || !draft.subject.trim() || !draft.body.trim()) {
//       showApiError(isArabicUi
//         ? "أكمل البريد الإلكتروني والموضوع ونص الرسالة أولًا."
//         : "Complete the recipient, subject, and message first.");
//       return;
//     }

//     const deadlineIso = dateTimeLocalToIso(deadlines[proposalId] ?? "");
//     if (!deadlineIso) {
//       const message = isArabicUi
//         ? "يجب تحديد موعد نهائي صحيح للمهمة قبل إنشائها."
//         : "Enter a valid task deadline before creating the task.";
//       setDeadlineErrors((previous) => ({ ...previous, [proposalId]: message }));
//       showApiError(message);
//       return;
//     }

//     setDeadlineErrors((previous) => {
//       const next = { ...previous };
//       delete next[proposalId];
//       return next;
//     });
//     setSavingProposalId(proposalId);
//     try {
//       await createTaskDraft({
//         analysisId: analysis.analysisId,
//         proposalId,
//         draft: {
//           assigneeId,
//           title: proposal.title,
//           description: proposal.description ?? "",
//           deadline: deadlineIso,
//           emailSubject: draft.subject,
//           emailBody: draft.body,
//         },
//       }).unwrap();

//       setSavedProposalIds((previous) => previous.includes(proposalId)
//         ? previous
//         : [...previous, proposalId]);
//       const successMessage = isArabicUi
//         ? "تم إنشاء المهمة وحفظ مسودة البريد بنجاح."
//         : "Task created and email draft saved successfully.";
//       toast.success(successMessage);
//     } catch (error: unknown) {
//       const errorRecord = asRecord(error);
//       const dataRecord = asRecord(errorRecord.data);
//       const message = readText(dataRecord, "message", "error", "details") ||
//         readText(errorRecord, "message", "error") ||
//         (typeof errorRecord.status === "number" || typeof errorRecord.status === "string"
//           ? `HTTP/RTK Query: ${errorRecord.status}`
//           : "");

//       showApiError(localizeErrorMessage(
//         message,
//         isArabicUi,
//         isArabicUi
//           ? "تعذر إنشاء المهمة أو حفظ مسودة البريد. تحقق من البيانات وحاول مرة أخرى."
//           : "Could not create the task or save the email draft. Check the details and try again.",
//       ));
//     } finally {
//       setSavingProposalId(null);
//     }
//   };

//   return (
//     <section dir={isArabicUi ? "rtl" : "ltr"} className={`mx-auto max-w-380`}>
      
//       <div className="mb-7 flex items-end justify-between gap-4 max-[760px]:items-start">
        
//         <div>
//           <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2eb5bc]">
//             <Icon name="spark" size={14} />
//             {isArabicUi ? "مهمة مدعومة بالذكاء الاصطناعي" : "AI-powered task"}
//           </span>
//           <h1 className="mt-2 text-2xl font-bold tracking-tight">
//             {isArabicUi ? "إنشاء وإسناد مهمة" : "Create and assign a task"}
//           </h1>
//           <p className={`mt-2 max-w-2xl text-sm leading-6 ${mutedClass}`}>
//             {isArabicUi
//               ? "حلّل رسالة أو صورة، راجع اقتراحات المهام والموظفين، ثم اعتمد الإسناد النهائي."
//               : "Analyze a message or image, review suggested tasks and employees, then confirm the final assignments."}
//           </p>
//         </div>
//         <span className="hidden rounded-full bg-[#edf3f7] px-3 py-2 text-xs font-semibold text-[#47759c] sm:inline-flex">
//           {isArabicUi ? "1. إدخال المحتوى ← 2. مراجعة المهمة والموظف ← 3. البريد" : "1. Add source → 2. Review task and employee → 3. Email"}
//         </span>
//       </div>

//       {analysis && storageReady && (
//         <div className={`mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
//           darkMode ? "border-sky-500/30 bg-sky-500/10 text-sky-200" : "border-sky-200 bg-sky-50 text-sky-800"
//         }`}>
//           <span>{isArabicUi ? "تم استرجاع آخر تحليل محفوظ بعد تحديث الصفحة." : "Your last saved analysis was restored after the page refresh."}</span>
//           <Button
//             type="button"
//             onClick={() => {
//               setAnalysis(null);
//               setWorkflowStep(1);
//               setSelectedEmployees({});
//               setEmailDrafts({});
//               setSavedProposalIds([]);
//               setDeadlines({});
//               window.localStorage.removeItem(ANALYSIS_STORAGE_KEY);
//             }}
//             className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${buttonSecondaryClass}`}
//           >
//             {isArabicUi ? "بدء تحليل جديد" : "Start a new analysis"}
//           </Button>
//         </div>
//       )}

//       <div className={`mb-6 rounded-2xl border p-3 sm:p-4 ${panelClass}`}>
//         <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
//           {([
//             { step: 1, en: "Add email or photo", ar: "إضافة بريد أو صورة", detailEn: "Provide the task source", detailAr: "أدخل مصدر المهمة" },
//             { step: 2, en: "Review task and employee", ar: "مراجعة المهمة والموظف", detailEn: "Review AI suggestions and choose an assignee", detailAr: "راجع اقتراحات الذكاء الاصطناعي واختر الموظف" },
//             { step: 3, en: "Email preview", ar: "معاينة البريد", detailEn: "Review the message before sending", detailAr: "راجع الرسالة قبل الإرسال" },
//           ] as const).map((item) => {
//             const active = workflowStep === item.step;
//             const complete = workflowStep > item.step;
//             return (
//               <div
//                 key={item.step}
//                 aria-current={active ? "step" : undefined}
//                 className={`relative flex min-w-0 items-center gap-3 overflow-hidden rounded-xl border p-4 transition-colors ${
//                   active
//                     ? darkMode
//                       ? "border-[#2eb5bc] bg-[#2eb5bc]/10 shadow-[0_0_0_1px_rgba(46,181,188,0.12)]"
//                       : "border-[#2eb5bc] bg-[#f0fbfb] shadow-sm"
//                     : complete
//                       ? darkMode
//                         ? "border-emerald-500/30 bg-emerald-500/5"
//                         : "border-emerald-200 bg-emerald-50/70"
//                       : darkMode
//                         ? "border-slate-700 bg-slate-950/40"
//                         : "border-slate-200 bg-slate-50/70"
//                 }`}
//               >
//                 <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-bold ${
//                   active
//                     ? "bg-[#2eb5bc] text-white shadow-sm"
//                     : complete
//                       ? "bg-emerald-500 text-white"
//                       : darkMode
//                         ? "bg-slate-800 text-slate-400"
//                         : "bg-white text-slate-500 ring-1 ring-slate-200"
//                 }`}>
//                   {complete ? "✓" : `0${item.step}`}
//                 </span>
//                 <div className="min-w-0 flex-1">
//                   <div className="mb-1 flex flex-wrap items-center gap-2">
//                     <p className="text-sm font-bold leading-5">{isArabicUi ? item.ar : item.en}</p>
//                     {active && (
//                       <span className="rounded-full bg-[#2eb5bc]/15 px-2 py-0.5 text-[10px] font-bold text-[#238e94]">
//                         {isArabicUi ? "الحالية" : "Current"}
//                       </span>
//                     )}
//                     {complete && (
//                       <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
//                         {isArabicUi ? "مكتملة" : "Done"}
//                       </span>
//                     )}
//                   </div>
//                   <p className={`text-xs leading-5 ${mutedClass}`}>{isArabicUi ? item.detailAr : item.detailEn}</p>
//                 </div>
//                 {active && (
//                   <span className="absolute inset-y-0 inset-s-0 w-1 bg-[#2eb5bc]" aria-hidden="true" />
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>



//       {workflowStep !== 3 && (
//       <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
//         <div className={`workflow-card min-w-0 rounded-2xl border p-5 sm:p-6 ${panelClass}`}>
//           <div className="mb-5 flex items-center gap-3">
//             <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#47759c] text-sm font-bold text-white">1</span>
//             <div>
//               <h2 className="font-bold">{isArabicUi ? "الخطوة 1: أضف البريد أو الصورة" : "Step 1: Add email or photo"}</h2>
//               <p className={`mt-1 text-xs ${mutedClass}`}>
//                 {isArabicUi ? "الصق البريد أو ارفع صورة للمهمة" : "Paste an email or upload an image"}
//               </p>
//             </div>
//           </div>

//           <div className={`mb-5 grid grid-cols-2 gap-1 rounded-xl p-1 ${darkMode ? "bg-slate-800" : "bg-[#f2f3f5]"}`}>
//             <Button
//               type="button"
//               onClick={() => setSourceType("email")}
//               className={`flex h-10 items-center justify-center gap-2 rounded-lg border-0 text-sm font-semibold transition ${
//                 sourceType === "email"
//                   ? darkMode ? "bg-slate-700 text-white shadow" : "bg-white text-[#47759c] shadow-sm"
//                   : `bg-transparent ${mutedClass}`
//               }`}
//             >
//               <Icon name="mail" size={16} />
//               {isArabicUi ? "رسالة بريد" : "Email"}
//             </Button>
//             <Button
//               type="button"
//               onClick={() => setSourceType("image")}
//               className={`flex h-10 items-center justify-center gap-2 rounded-lg border-0 text-sm font-semibold transition ${
//                 sourceType === "image"
//                   ? darkMode ? "bg-slate-700 text-white shadow" : "bg-white text-[#47759c] shadow-sm"
//                   : `bg-transparent ${mutedClass}`
//               }`}
//             >
//               <Icon name="image" size={16} />
//               {isArabicUi ? "صورة" : "Image"}
//             </Button>
//           </div>

//           {sourceType === "email" ? (
//             <label className="mb-5 block">
//               <span className="mb-2 block text-sm font-semibold">
//                 {isArabicUi ? "محتوى الرسالة" : "Message content"}
//               </span>
//               <textarea
//                 rows={8}
//                 value={emailContent}
//                 onChange={(event) => setEmailContent(event.target.value)}
//                 placeholder={isArabicUi ? "الصق البريد أو تفاصيل المهمة هنا..." : "Paste the email or task details here..."}
//                 className={`${inputClass} h-56 resize-none overflow-y-auto rounded-xl py-2 text-xs leading-6 ${darkMode ? "bg-slate-900" : "bg-[#f8fbfe]"}`}
//               />
//               <span className={`mt-2 block text-xs ${mutedClass}`}>
//                 {emailContent.length} {isArabicUi ? "حرف" : "characters"}
//               </span>
//             </label>
//           ) : (
//             <label
//               className={`mb-5 flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 text-center transition ${
//                 isDragging
//                   ? "border-[#2eb5bc] bg-[#2eb5bc]/10"
//                   : darkMode
//                     ? "border-slate-700 bg-slate-950 hover:border-[#2eb5bc]"
//                     : "border-[#cbd5da] bg-[#fafcfc] hover:border-[#2eb5bc]"
//               }`}
//               onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
//               onDragLeave={() => setIsDragging(false)}
//               onDrop={(event) => {
//                 event.preventDefault();
//                 setIsDragging(false);
//                 handleImageFile(event.dataTransfer.files[0]);
//               }}
//             >
//               <input
//                 type="file"
//                 accept="image/*"
//                 className="sr-only"
//                 onChange={(event) => handleImageFile(event.target.files?.[0])}
//               />
//               {imagePreview ? (
//                 // eslint-disable-next-line @next/next/no-img-element
//                 <img src={imagePreview} alt="Task attachment preview" className="mb-3 max-h-40 rounded-lg object-contain" />
//               ) : (
//                 <span className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-[#e8f8f8] text-[#2eb5bc]">
//                   <Icon name="image" size={25} />
//                 </span>
//               )}
//               <strong className="text-sm">
//                 {imageName || (isArabicUi ? "اسحب الصورة هنا أو اضغط للاختيار" : "Drop an image here or click to browse")}
//               </strong>
//               <span className={`mt-2 text-xs ${mutedClass}`}>
//                 {isArabicUi ? "يدعم الصور التي تحتوي على تفاصيل المهمة" : "Upload an image containing task details"}
//               </span>
//             </label>
//           )}

//           {usersError && (
//             <p className="mb-4 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-600">
//               {isArabicUi
//                 ? "تعذّر تحميل الموظفين من الخادم. تحقق من API المستخدمين قبل إسناد المهام."
//                 : "Could not load employees from the server. Check the users API before assigning tasks."}
//             </p>
//           )}

//           <Button
//             type="button"
//             disabled={isGenerating || (sourceType === "email" ? !emailContent.trim() : !imageFile)}
//             onClick={generateRecommendation}
//             className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border-0 bg-[#47759c] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#3c6689] disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             <Icon name="spark" size={17} />
//             {isGenerating
//               ? isArabicUi ? "جارٍ تحليل المحتوى..." : "Analyzing..."
//               : isArabicUi ? "تحليل واقتراح المهام" : "Analyze and suggest tasks"}
//           </Button>
//           {isGenerating && (
//             <Button
//               type="button"
//               onClick={cancelAnalysis}
//               className={`mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition ${
//                 darkMode
//                   ? "border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
//                   : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
//               }`}
//             >
//               {isArabicUi ? "إلغاء التحليل" : "Cancel analysis"}
//             </Button>
//           )}
//           <p className={`mt-3 text-xs leading-5 ${mutedClass}`}>
//             {isArabicUi
//               ? "بعد التحليل ستظهر المهام المقترحة والموظف المناسب لكل مهمة، ويمكنك تغيير الاختيار قبل الإسناد."
//               : "After analysis, suggested tasks and recommended employees appear. You can change each employee before assignment."}
//           </p>
//         </div>

//         <div className={`workflow-card min-w-0 rounded-2xl border p-5 sm:p-6 ${panelClass}`}>
//           <div className="mb-5 flex items-center gap-3">
//             <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#2eb5bc] text-sm font-bold text-white">2</span>
//             <div className="min-w-0 flex-1">
//               <h2 className="font-bold">{isArabicUi ? "راجع المهام والموظفين" : "Review tasks and assignees"}</h2>
//               <p className={`mt-1 text-xs ${mutedClass}`}>
//                 {isArabicUi ? "الاختيار المقترح قابل للتغيير قبل الاعتماد" : "AI suggestions can be changed before confirmation"}
//               </p>
//             </div>
//             {analysis && (
//               <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600">
//                 {analysis.status}
//               </span>
//             )}
//           </div>

//           {!analysis ? (
//             <div className={`flex min-h-107.5 flex-col items-center justify-center rounded-xl border border-dashed px-6 py-10 text-center ${
//               darkMode ? "border-slate-700 bg-slate-950/60" : "border-[#e5e6ea] bg-[#fbfbfc]"
//             }`}>
//               {isGenerating ? (
//                 <>
//                   <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-[#2eb5bc]/10 text-[#2eb5bc]">
//                     <span className="absolute inset-1 animate-spin rounded-xl border-2 border-transparent border-t-[#2eb5bc]" />
//                     <Icon name="spark" size={27} />
//                   </span>
//                   <h3 className="mt-4 font-bold">{isArabicUi ? "جارٍ تحليل المحتوى..." : "Analyzing your content..."}</h3>
//                   <p className={`mt-2 max-w-sm text-sm leading-6 ${mutedClass}`}>
//                     {isArabicUi ? "نستخرج المهام ونحللها ونبحث عن الموظفين المناسبين. قد يستغرق ذلك بضع لحظات." : "Extracting tasks and preparing employee recommendations. This may take a few moments."}
//                   </p>
//                   <div className="mt-5 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
//                     <div className="h-full w-2/5 animate-pulse rounded-full bg-[#2eb5bc]" />
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#e8f8f8] text-[#2eb5bc]">
//                     <Icon name="spark" size={28} />
//                   </span>
//                   <h3 className="mt-4 font-bold">{isArabicUi ? "نتيجة التحليل هتظهر هنا" : "Analysis results will appear here"}</h3>
//                   <p className={`mt-2 max-w-sm text-sm leading-6 ${mutedClass}`}>
//                     {isArabicUi ? "أدخل محتوى المهمة واضغط «تحليل واقتراح المهام» لعرض الاقتراحات وترشيحات الموظفين." : "Provide the task content and select “Analyze and suggest tasks” to review proposals and employee recommendations."}
//                   </p>
//                 </>
//               )}
//             </div>
//           ) : (
//             <div className="space-y-4  px-6 py-10 text-center">
//               <div className={`rounded-xl flex min-h-107.5 flex-col items-center justify-center  border-dashed border p-4 ${darkMode ? "border-emerald-500/30 bg-emerald-500/5" : "border-emerald-200 bg-emerald-50/70"}`}>
//                 <div className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-600">
//                   <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500 text-white">✓</span>
//                   {isArabicUi ? "تم التحليل بنجاح" : "Analysis completed successfully"}
//                 </div>
//                 <div className="flex flex-wrap items-center justify-between gap-2">
//                   <span className={`text-xs ${mutedClass}`}>{isArabicUi ? "بدأ التحليل بواسطة" : "Analysis started by"}</span>
//                   <span className="text-xs font-semibold">{analysis.sender.displayName || "Mohamed Adel Elsayed Ibrahim Elseglaby"} · {analysis.sender.role || "SUPER_SUPERVISOR"}</span>
//                 </div>
//                 <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
//                   <span className={`text-xs ${mutedClass}`}>{isArabicUi ? "رقم التحليل" : "Analysis ID"}</span>
//                   <code className="max-w-full break-all text-xs">{analysis.analysisId}</code>
//                 </div>
//               </div>


//             </div>
//           )}
//         </div>
//       </div>
//       )}

//       {analysis && workflowStep === 2 && (
//         <section className={`workflow-card mt-5 w-full rounded-2xl border p-5 shadow-sm sm:p-6 ${panelClass}`}>
//           <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
//             <div>
//               <h2 className="text-lg font-bold">{isArabicUi ? "المهام المقترحة وتوصيات الموظفين" : "Task recommendations and employee assignments"}</h2>
//               <p className={`mt-1 text-sm ${mutedClass}`}>{isArabicUi ? "راجع كل مهمة واختر الموظف المناسب قبل اعتماد الاختيارات." : "Review each task and choose the right employee before confirming."}</p>
//             </div>
//             <span className="rounded-full bg-[#2eb5bc]/10 px-3 py-1.5 text-xs font-bold text-[#238e94]">{analysis.proposals.length} {isArabicUi ? "مهام مقترحة" : "proposed tasks"}</span>
//           </div>
//           <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2 2xl:grid-cols-3">
//               {analysis.proposals.map((proposal, index) => {
//                 const recommended = proposal.recommendation;
//                 const selectedId = selectedEmployees[proposal.proposalId] ?? "";
//                 const selectedEmployee = employees.find((employee) => employee.id === selectedId) ??
//                   (recommended?.userId === selectedId
//                     ? {
//                         id: recommended.userId,
//                         name: recommended.displayName,
//                         email: recommended.email ?? "",
//                         jobTitle: recommended.jobTitle || proposal.predictedJobTitle || "",
//                         role: "EMPLOYEE",
//                         teamId: null,
//                       }
//                     : undefined);
//                 const recommendationIsDifferent = !!recommended && selectedId !== recommended.userId;

//                 return (
//                   <article key={proposal.proposalId} className={`rounded-xl border p-4 sm:p-5 ${
//                     darkMode ? "border-slate-700 bg-slate-950/40" : "border-[#e5e6ea] bg-white"
//                   }`}>
//                     <div className="mb-3 flex items-start gap-3">
//                       <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#47759c]/10 text-sm font-bold text-[#47759c]">
//                         {index + 1}
//                       </span>
//                       <div className="min-w-0 flex-1">
//                         <h3 className="font-bold leading-6">{proposal.title}</h3>
//                         <p className={`mt-1 text-sm leading-6 ${mutedClass}`}>{proposal.description}</p>
//                       </div>
//                       <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${
//                         proposal.predictionStatus === "success"
//                           ? "bg-emerald-500/10 text-emerald-600"
//                           : "bg-amber-500/10 text-amber-600"
//                       }`}>
//                         {proposal.predictionStatus === "success"
//                           ? isArabicUi ? "نجح التوقع" : "Prediction success"
//                           : isArabicUi ? "يحتاج مراجعة" : "Needs review"}
//                       </span>
//                     </div>

//                     {proposal.sourceText && (
//                       <p className={`mb-3 rounded-lg border p-3 text-xs leading-5 ${darkMode ? "border-slate-700 text-slate-300" : "border-slate-200 text-slate-600"}`}>
//                         <strong>{isArabicUi ? "النص المستخرج:" : "Extracted source:"}</strong> {proposal.sourceText}
//                       </p>
//                     )}
//                     {proposal.suggestedDeadline && (
//                       <p className={`mb-3 text-xs ${mutedClass}`}>
//                         <strong>{isArabicUi ? "الموعد المقترح:" : "Suggested deadline:"}</strong> {new Date(proposal.suggestedDeadline).toLocaleString(isArabicUi ? "ar-EG" : "en-US")}
//                       </p>
//                     )}
                   
//                     {workflowStep === 2 && (
//                       <div className={`mb-4 rounded-xl border p-4 ${
//                         darkMode ? "border-slate-700 bg-slate-900/70" : "border-[#d8f0f1] bg-[#f1fbfb]"
//                       }`}>
//                         <p className="text-xs font-bold uppercase tracking-wide text-[#238e94]">
//                           {isArabicUi ? "الترشيح المقترح" : "AI employee recommendation"}
//                         </p>
//                         {recommended ? (
//                           <div className="mt-2">
//                             <p className="font-bold">{recommended.displayName}</p>
//                             <p className={`mt-1 text-sm ${mutedClass}`}>{recommended.jobTitle || proposal.predictedJobTitle}</p>
//                             <p className={`mt-1 text-xs ${mutedClass}`}>{recommended.email}</p>
//                           </div>
//                         ) : (
//                           <div className="mt-2">
//                             <p className="mt-4 text-sm text-amber-600">
//                               {localizeRecommendationMessage(proposal.recommendationMessage, isArabicUi)}
//                             </p>
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     {workflowStep === 2 && (
//                     <>
//                     <label className="block">
//                       <span className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm font-semibold">
//                         <span>{isArabicUi ? "الموظف المسؤول عن التنفيذ" : "Assign to employee"}</span>
//                         {recommended && !recommendationIsDifferent && (
//                           <span className="rounded-full bg-[#2eb5bc]/10 px-2 py-1 text-[10px] font-bold text-[#238e94]">
//                             {isArabicUi ? "ترشيح الذكاء الاصطناعي" : "AI recommendation"}
//                           </span>
//                         )}
//                         {recommendationIsDifferent && (
//                           <span className="rounded-full bg-blue-500/10 px-2 py-1 text-[10px] font-bold text-blue-600">
//                             {isArabicUi ? "تم تغيير المرشح" : "Recommendation changed"}
//                           </span>
//                         )}
//                       </span>
//                       <div className="relative">
//                         <select
//                           value={selectedId}
//                           onChange={(event) => {
//                             const nextEmployeeId = event.target.value;
//                             const nextEmployee = employees.find((employee) => employee.id === nextEmployeeId) ??
//                               (recommended?.userId === nextEmployeeId
//                                 ? {
//                                     id: recommended.userId,
//                                     name: recommended.displayName,
//                                     email: recommended.email ?? "",
//                                     jobTitle: recommended.jobTitle || proposal.predictedJobTitle || "",
//                                     role: "EMPLOYEE",
//                                     teamId: null,
//                                   }
//                                 : undefined);

//                             setSelectedEmployees((previous) => ({
//                               ...previous,
//                               [proposal.proposalId]: nextEmployeeId,
//                             }));

//                             setEmailDrafts((previous) => ({
//                               ...previous,
//                               [proposal.proposalId]: {
//                                 ...(previous[proposal.proposalId] ?? {
//                                   to: "",
//                                   subject: proposal.title,
//                                   body: "",
//                                 }),
//                                 to: nextEmployee?.email ?? "",
//                                 body: nextEmployee
//                                   ? isArabicUi
//                                     ? `مرحبًا ${nextEmployee.name}،

//                                     نرجو تنفيذ المهمة التالية: ${proposal.title}.

//                                     تفاصيل المهمة: ${proposal.description}

//                                     الموعد المقترح: ${proposal.suggestedDeadline || "غير محدد"}

//                                     يرجى تأكيد استلام المهمة وإبلاغ المشرف بالتقدم.

//                                     شكرًا لك.`
//                                                   : `Hi ${nextEmployee.name},

//                                     Please work on the following task: ${proposal.title}.

//                                     Task details: ${proposal.description}

//                                     Suggested deadline: ${proposal.suggestedDeadline || "Not specified"}

//                                     Please confirm receipt and keep your supervisor updated.

//                                     Thank you.`
//                                   : (previous[proposal.proposalId]?.body ?? ""),
//                               },
//                             }));
//                           }}
//                           className={`${inputClass} workflow-select appearance-none ${
//                             isArabicUi ? "pl-10 pr-4" : "pl-4 pr-10"
//                           }`}
//                         >
//                           <option value="" disabled>
//                             {isArabicUi ? "اختر الموظف..." : "Select an employee..."}
//                           </option>

//                           {recommended &&
//                             !employees.some((employee) => employee.id === recommended.userId) && (
//                               <option value={recommended.userId}>
//                                 {recommended.displayName} — {recommended.jobTitle} (
//                                 {isArabicUi ? "ترشيح التحليل" : "analysis recommendation"})
//                               </option>
//                             )}

//                           {employees.map((employee) => (
//                             <option key={employee.id} value={employee.id}>
//                               {employee.name}
//                               {employee.jobTitle ? ` — ${employee.jobTitle}` : ""}
//                               {employee.email ? ` (${employee.email})` : ""}
//                             </option>
//                           ))}
//                         </select>

//                         {/* Custom SVG arrow */}
//                         <svg
//                           className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 ${
//                             isArabicUi ? "left-3" : "right-3"
//                           }`}
//                           xmlns="http://www.w3.org/2000/svg"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth={2}
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           aria-hidden="true"
//                         >
//                           <path d="m6 9 6 6 6-6" />
//                         </svg>
//                       </div>
//                     </label>

//                     {selectedEmployee && (
//                       <div className={`mt-3 flex items-start gap-3 rounded-lg border p-3 ${
//                         darkMode ? "border-slate-700" : "border-[#e5e6ea]"
//                       }`}>
//                         <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#47759c]/10 font-bold text-[#47759c]">
//                           {selectedEmployee.name.slice(0, 1).toUpperCase()}
//                         </span>
//                         <div className="min-w-0 flex-1">
//                           <p className="text-sm font-bold">{selectedEmployee.name}</p>
//                           <p className={`mt-1 break-all text-xs ${mutedClass}`}>{selectedEmployee.email || (isArabicUi ? "لا يوجد بريد إلكتروني" : "No email provided")}</p>
//                           <div className="mt-2 flex flex-wrap gap-2">
//                             {selectedEmployee.jobTitle && (
//                               <span className="rounded-full bg-[#47759c]/10 px-2 py-1 text-[10px] font-semibold text-[#47759c]">{selectedEmployee.jobTitle}</span>
//                             )}
//                             {selectedEmployee.teamId && (
//                               <span className={`rounded-full px-2 py-1 text-[10px] ${darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
//                                 {isArabicUi ? "الفريق" : "Team"}: {selectedEmployee.teamId}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                     </>
//                     )}
//                   </article>
//                 );
//               })}

//               {isLoadingUsers && (
//                 <p className={`text-xs ${mutedClass}`}>
//                   {isArabicUi ? "جارٍ تحميل قائمة الموظفين..." : "Loading employee directory..."}
//                 </p>
//               )}

//               {usersError && (
//                 <p className="rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-600">
//                   {isArabicUi ? "تعذّر تحميل قائمة الموظفين بسبب فشل طلب المستخدمين." : "The employee list could not be loaded because the users request failed."}
//                 </p>
//               )}

//               {workflowStep < 4 && analysis && (
//                 <div className={`rounded-xl border p-4 ${darkMode ? "border-slate-700 bg-slate-800/60" : "border-[#d8f0f1] bg-[#f1fbfb]"}`}>
//                   <p className="text-sm font-bold">
//                     {isArabicUi ? "الخطوة 2 من 3 — راجع المهمة والموظف" : "Step 2 of 3 — Review task and employee"}
//                   </p>
//                   <p className={`mt-1 text-xs leading-5 ${mutedClass}`}>
//                     {isArabicUi
//                       ? "راجع المهمة وترشيح الذكاء الاصطناعي، واختر الموظف من القائمة عند الحاجة. بطاقة الموظف المختار تظهر أسفل القائمة، ثم انتقل لمعاينة البريد."
//                       : "Review the task and AI recommendation. Change the employee in the dropdown if needed; the selected employee card appears below it. Then continue to email preview."}
//                   </p>
//                   <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row">
//                     <Button
//                       type="button"
//                       disabled={
//                         workflowStep === 2 &&
//                         analysis.proposals.some((proposal) => {
//                           const employeeId = selectedEmployees[proposal.proposalId];
//                           const emailTo = emailDrafts[proposal.proposalId]?.to?.trim();

//                           return !employeeId || !emailTo;
//                         })
//                       }
//                       onClick={continueWorkflow}
//                       className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border-0 bg-[#2eb5bc] px-4 text-sm font-bold text-white transition hover:bg-[#259da3] disabled:cursor-not-allowed disabled:opacity-50"
//                     >
//                       {isArabicUi
//                         ? "اعتماد الموظفين ومعاينة البريد"
//                         : "Confirm employees and preview email"}
//                       <Icon name="arrow" size={16} />
//                     </Button>
//                   </div>
//                 </div>
//               )}

//           </div>
//         </section>
//       )}

      

//       {workflowStep === 3 && analysis && (
//         <section className={`workflow-card mt-5 w-full overflow-hidden rounded-2xl border shadow-sm ${
//                 darkMode ? "border-slate-700 bg-slate-900 text-slate-100" : "border-[#dfe5ea] bg-white text-[#252630]"
//               }`}>
//                 <div className={`flex items-center justify-between gap-3 border-b px-5 py-4 sm:px-7 ${darkMode ? "border-slate-700 bg-slate-800/70" : "border-[#e5eaf0] bg-[#f8fafc]"}`}>
//                   <div className="flex min-w-0 items-center gap-3">
//                   <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#2eb5bc]/15 text-[#2eb5bc]">
//                     <Icon name="mail" size={18} />
//                   </span>
//                     <div className="min-w-0">
//                       <h3 className="font-bold">
//                         {isArabicUi ? "معاينة البريد قبل الإرسال" : "Email preview"}
//                       </h3>
//                       <p className={`mt-1 text-xs leading-5 ${mutedClass}`}>
//                         {isArabicUi ? "راجع الرسائل وانسخها أو افتحها في تطبيق البريد." : "Review each message, copy it, or open it in your email app."}
//                       </p>
//                     </div>
//                   </div>
//                   <span className={`hidden rounded-full px-3 py-1.5 text-xs font-semibold sm:inline-flex ${darkMode ? "bg-slate-700 text-slate-200" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}>
//                     {analysis.proposals.length} {isArabicUi ? "رسالة" : analysis.proposals.length === 1 ? "message" : "messages"}
//                   </span>
//                 </div>
//                 <div className="grid grid-cols-1 items-stretch gap-3 p-3 sm:p-4 lg:grid-cols-2">

//                 {analysis.proposals.map((proposal, index) => {
//                   const draft = emailDrafts[proposal.proposalId] ?? {
//                     to: proposal.recommendation?.email ?? "",
//                     subject: proposal.title,
//                     body: "",
//                   };
//                   const employee = employees.find(
//                     (item) => item.id === selectedEmployees[proposal.proposalId],
//                   );
//                   return (
                    
//                     <div
//                       key={`email-${proposal.proposalId}`}
//                       className={`flex min-w-0 flex-col overflow-hidden rounded-2xl border shadow-sm transition-shadow hover:shadow-md ${
//                         darkMode ? "border-slate-700 bg-slate-950/40" : "border-[#dce7ef] bg-white"
//                       }`}
//                     >
//                       <div className={`flex flex-wrap items-center justify-between gap-3 border-b-2 border-b-[#2eb5bc] px-3 py-3 sm:px-4 ${darkMode ? "border-slate-700 bg-slate-800/60" : "border-[#e8f1f7] bg-linear-to-r from-[#f2f9ff] to-[#f0fbfb]"}`}>
//                         <div className="flex min-w-0 items-center gap-2">
//                           <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#2eb5bc]/15 text-[#2eb5bc]"><Icon name="mail" size={17} /></span>
//                           <div className="min-w-0">
//                             <p className="truncate text-xs font-bold">{draft.subject || (isArabicUi ? "بدون موضوع" : "No subject")}</p>
//                             <p className={`mt-0.5 truncate text-[11px] ${mutedClass}`}>{employee?.name ?? (isArabicUi ? "لم يتم اختيار موظف" : "No employee selected")}</p>
//                           </div>
//                         </div>
//                         <p className="text-xs font-bold">
//                           {isArabicUi ? `رسالة المهمة ${index + 1}` : `Task email ${index + 1}`}
//                         </p>
//                         <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${darkMode ? "bg-slate-700 text-slate-300" : "bg-emerald-50 text-emerald-700"}`}>
//                           {isArabicUi ? "مسودة" : "Draft"}
//                         </span>
//                       </div>
//                       <div className="flex flex-1 flex-col space-y-3 p-3 sm:p-4">
//                       <label className="block">
//                         <span className="mb-1 block text-[11px] font-semibold">
//                           {isArabicUi ? "إلى" : "To"}
//                         </span>
//                         <input
//                           type="email"
//                           value={draft.to}
//                           onChange={(event) => {
//                             setEmailDrafts((previous) => ({
//                               ...previous,
//                               [proposal.proposalId]: {
//                                 ...draft,
//                                 to: event.target.value,
//                               },
//                             }));
//                           }}
//                           placeholder="employee@example.com"
//                           className={`${inputClass} py-2 text-xs`}
//                         />
//                       </label>

//                       <label className="block">
//                         <span className="mb-1 block text-[11px] font-semibold">
//                           {isArabicUi ? "الموضوع" : "Subject"}
//                         </span>
//                         <input
//                           value={draft.subject}
//                           onChange={(event) => {
//                             setEmailDrafts((previous) => ({
//                               ...previous,
//                               [proposal.proposalId]: {
//                                 ...draft,
//                                 subject: event.target.value,
//                               },
//                             }));
//                           }}
//                           className={`${inputClass} py-2 text-xs`}
//                         />
//                       </label>

//                       <label className="block">
//                         <span className="mb-1 block text-[11px] font-semibold">
//                           {isArabicUi ? "الموعد النهائي للمهمة" : "Task deadline"}
//                         </span>
//                         <input
//                           type="datetime-local"
//                           required
//                           aria-required="true"
//                           aria-invalid={Boolean(deadlineErrors[proposal.proposalId])}
//                           value={deadlines[proposal.proposalId] ?? ""}
//                           onChange={(event) => {
//                             const value = event.target.value;
//                             setDeadlines((previous) => ({
//                               ...previous,
//                               [proposal.proposalId]: value,
//                             }));
//                             if (value) {
//                               setDeadlineErrors((previous) => {
//                                 const next = { ...previous };
//                                 delete next[proposal.proposalId];
//                                 return next;
//                               });
//                             }
//                           }}
//                           className={`${inputClass} py-2 text-xs ${deadlineErrors[proposal.proposalId] ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10" : ""}`}
//                         />
//                         {deadlineErrors[proposal.proposalId] ? (
//                           <span role="alert" className="mt-1 block text-xs text-rose-600">
//                             {deadlineErrors[proposal.proposalId]}
//                           </span>
//                         ) : (
//                           <span className={`mt-1 block text-[10px] ${mutedClass}`}>
//                             {isArabicUi
//                               ? "مطلوب — حدّد تاريخ ووقت الموعد النهائي."
//                               : "Required — select the deadline date and time."}
//                           </span>
//                         )}
//                       </label>

//                       <label className="block">
//                         <span className="mb-1 block text-[11px] font-semibold">
//                           {isArabicUi ? "نص الرسالة" : "Email message"}
//                         </span>
//                         <textarea
//                           rows={8}
//                           value={draft.body}
//                           onChange={(event) => {
//                             setEmailDrafts((previous) => ({
//                               ...previous,
//                               [proposal.proposalId]: {
//                                 ...draft,
//                                 body: event.target.value,
//                               },
//                             }));
//                           }}
//                           className={`${inputClass} h-56 resize-none overflow-y-auto rounded-xl py-2 text-xs leading-6 ${darkMode ? "bg-slate-900" : "bg-[#f8fbfe]"}`}
//                         />
//                       </label>
//                       <div className="mt-auto flex flex-col gap-2 pt-4 sm:flex-row">
//                         <Button
//                           type="button"
//                           onClick={() => copyEmailDraft(proposal.proposalId)}
//                           className={`flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border px-2 text-[11px] font-bold transition ${buttonSecondaryClass}`}
//                         >
//                           {copiedEmailId === proposal.proposalId ? "✓" : <span aria-hidden="true">▢</span>}
//                           {copiedEmailId === proposal.proposalId
//                             ? isArabicUi ? "تم النسخ" : "Copied!"
//                             : isArabicUi ? "نسخ البريد بالكامل" : "Copy full email"}
//                         </Button>
//                         <Button
//                           type="button"
//                           onClick={() => openEmailDraft(proposal.proposalId)}
//                           className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border-0 bg-[#2eb5bc] px-2 text-[11px] font-bold text-white transition hover:bg-[#259da3]"
//                         >
//                           <Icon name="send" size={15} />
//                           {isArabicUi ? "فتح البريد لإرساله" : "Open email app to send"}
//                         </Button>
//                         <Button
//                           type="button"
//                           disabled={savingProposalId === proposal.proposalId || savedProposalIds.includes(proposal.proposalId)}
//                           onClick={() => saveTaskDraft(proposal.proposalId)}
//                           className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border-0 bg-[#47759c] px-2 text-[11px] font-bold text-white transition hover:bg-[#3c6689] disabled:cursor-not-allowed disabled:opacity-50"
//                         >
//                           {savingProposalId === proposal.proposalId
//                             ? (isArabicUi ? "جارٍ الحفظ..." : "Saving...")
//                             : savedProposalIds.includes(proposal.proposalId)
//                               ? (isArabicUi ? "تم إنشاء المهمة" : "Task created")
//                               : (isArabicUi ? "إنشاء المهمة وحفظ المسودة" : "Create task & save draft")}
//                         </Button>
//                       </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//                 </div>
//                 <div className={`flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7 ${darkMode ? "border-slate-700 bg-slate-800/40" : "border-[#e8edf1] bg-[#fbfcfd]"}`}>
//                   <p className={`text-xs leading-5 ${mutedClass}`}>
//                     {isArabicUi
//                       ? "هذه الرسائل مسودات فقط. النسخ لا يرسل البريد؛ يمكنك فتح تطبيق البريد لإرسالها يدويًا."
//                       : "These are drafts only. Copying does not send email; open your mail app to send manually."}
//                   </p>
//                   <Button
//                     type="button"
//                     onClick={() => setWorkflowStep(2)}
//                     className={`flex h-10 shrink-0 items-center justify-center rounded-xl border px-4 text-sm font-semibold ${buttonSecondaryClass}`}
//                   >
//                     {isArabicUi ? "رجوع وتغيير الموظفين" : "Back to change employees"}
//                   </Button>
//                 </div>
//         </section>
//       )}

//       {workflowStep !== 3 && (
//         <div className={`mt-5 flex items-start gap-3 rounded-xl border p-4 ${
//           darkMode ? "border-slate-700 bg-slate-900" : "border-[#e3eaee] bg-[#f7fafb]"
//         }`}>
//           <span className="mt-0.5 text-[#47759c]"><Icon name="spark" size={17} /></span>
//           <p className={`text-xs leading-6 ${mutedClass}`}>
//             <strong className={darkMode ? "text-slate-200" : "text-[#47759c]"}>
//               {isArabicUi ? "ملاحظة عن الربط:" : "Integration note:"}
//             </strong>{" "}
//             {isArabicUi
//               ? "يمكنك تحديد الموعد النهائي لكل مهمة ثم إنشاء المهمة وحفظ مسودة البريد من خلال نقطة الـ API. حفظ المسودة لا يرسل البريد؛ استخدم فتح تطبيق البريد لإرساله يدويًا."
//               : "Set a deadline for each task, then create the task and save its email draft through the API. Saving the draft does not send email; use the email-app action to send it manually."}
//           </p>
//         </div>
//       )}
//     </section>
//   );
// }
