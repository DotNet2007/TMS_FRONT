
// "use client";

// import { useState, type FormEvent } from "react";
// import { Check, X } from "lucide-react";
// import { TaskDetailTranslations } from "../translations/dashboard/tasks/task-details-tran";

// type SubmitTaskReviewModalProps = {
//   open: boolean;
//   isArabic: boolean;
//   darkMode: boolean;
//   isSubmitting: boolean;
//   translations: TaskDetailTranslations;
//   onClose: () => void;
//   onSubmit: (completionNote: string) => Promise<void>;
// };

// export default function SubmitTaskReviewModal(
//   props: SubmitTaskReviewModalProps,
// ) {
//   if (!props.open) return null;

//   return <SubmitTaskReviewModalContent key="submit-task-review-modal" {...props} />;
// }

// function SubmitTaskReviewModalContent({
//   isArabic,
//   darkMode,
//   isSubmitting,
//   translations: t,
//   onClose,
//   onSubmit,
// }: SubmitTaskReviewModalProps) {
//   const [completionNote, setCompletionNote] = useState("");
//   const [validationError, setValidationError] = useState("");

//   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     const note = completionNote.trim();

//     if (!note) {
//       setValidationError(t.completionNoteRequired);
//       return;
//     }

//     setValidationError("");

//     try {
//       await onSubmit(note);
//     } catch {
//       // The parent handles API errors and displays the Sonner toast.
//     }
//   };

//   const handleClose = () => {
//     if (isSubmitting) return;
//     onClose();
//   };

//   return (
//     <div
//       className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
//       dir={isArabic ? "rtl" : "ltr"}
//       onMouseDown={(event) => {
//         if (event.target === event.currentTarget) handleClose();
//       }}
//     >
//       <section
//         role="dialog"
//         aria-modal="true"
//         aria-labelledby="submit-task-review-title"
//         className={`w-full max-w-lg rounded-2xl border p-5 shadow-2xl sm:p-6 ${
//           darkMode
//             ? "border-slate-700 bg-slate-900 text-slate-100"
//             : "border-slate-200 bg-white text-slate-900"
//         }`}
//       >
//         <div className="mb-5 flex items-start justify-between gap-4">
//           <div>
//             <h2
//               id="submit-task-review-title"
//               className="text-lg font-bold"
//             >
//               {t.reviewModalTitle}
//             </h2>

//             <p
//               className={`mt-2 text-sm leading-6 ${
//                 darkMode ? "text-slate-400" : "text-slate-500"
//               }`}
//             >
//               {t.reviewModalDescription}
//             </p>
//           </div>

//           <button
//             type="button"
//             aria-label={isArabic ? "إغلاق" : "Close"}
//             disabled={isSubmitting}
//             onClick={handleClose}
//             className={`rounded-lg p-2 transition disabled:opacity-50 ${
//               darkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"
//             }`}
//           >
//             <X size={18} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label
//               htmlFor="task-completion-note"
//               className="mb-2 block text-sm font-semibold"
//             >
//               {t.completionNoteLabel}
//             </label>

//             <textarea
//               id="task-completion-note"
//               autoFocus
//               rows={5}
//               value={completionNote}
//               onChange={(event) => {
//                 setCompletionNote(event.target.value);

//                 if (validationError) {
//                   setValidationError("");
//                 }
//               }}
//               placeholder={t.completionNotePlaceholder}
//               disabled={isSubmitting}
//               aria-invalid={Boolean(validationError)}
//               aria-describedby={
//                 validationError ? "task-completion-note-error" : undefined
//               }
//               className={`w-full resize-y rounded-xl border px-3.5 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:opacity-60 ${
//                 darkMode
//                   ? "border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500"
//                   : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
//               }`}
//             />

//             {validationError && (
//               <p
//                 id="task-completion-note-error"
//                 role="alert"
//                 className="mt-2 text-xs text-rose-500"
//               >
//                 {validationError}
//               </p>
//             )}
//           </div>

//           <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
//             <button
//               type="button"
//               onClick={handleClose}
//               disabled={isSubmitting}
//               className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${
//                 darkMode
//                   ? "border-slate-700 hover:bg-slate-800"
//                   : "border-slate-200 hover:bg-slate-50"
//               }`}
//             >
//               {t.reviewCancel}
//             </button>

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               <span>
//                 {isSubmitting ? t.sending : t.reviewConfirm}
//               </span>

//               {!isSubmitting && <Check size={16} />}
//             </button>
//           </div>
//         </form>
//       </section>
//     </div>
//   );
// }





"use client";

import { useState, type FormEvent } from "react";
import { X, Mail, Send, UserRound, FileText } from "lucide-react";
import { TaskDetailTranslations } from "../translations/dashboard/tasks/task-details-tran";

type SubmitTaskReviewModalProps = {
  open: boolean;
  isArabic: boolean;
  darkMode: boolean;
  isSubmitting: boolean;
  translations: TaskDetailTranslations;
  onClose: () => void;
  onSubmit: (completionNote: string) => Promise<void>;
};

export default function SubmitTaskReviewModal(
  props: SubmitTaskReviewModalProps,
) {
  if (!props.open) return null;

  return (
    <SubmitTaskReviewModalContent
      key="submit-task-review-modal"
      {...props}
    />
  );
}

function SubmitTaskReviewModalContent({
  isArabic,
  darkMode,
  isSubmitting,
  translations: t,
  onClose,
  onSubmit,
}: SubmitTaskReviewModalProps) {
  const [completionNote, setCompletionNote] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const note = completionNote.trim();

    if (!note) {
      setValidationError(t.completionNoteRequired);
      return;
    }

    setValidationError("");

    try {
      await onSubmit(note);
    } catch {
      // The parent handles API errors and displays the Sonner toast.
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const muted = darkMode ? "text-slate-400" : "text-slate-500";
  const border = darkMode ? "border-slate-700" : "border-slate-200";
 
  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5"
      dir={isArabic ? "rtl" : "ltr"}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="submit-task-review-title"
        className={`w-full max-w-2xl overflow-hidden rounded-2xl border shadow-2xl ${
          darkMode
            ? "border-slate-700 bg-slate-900 text-slate-100"
            : "border-slate-200 bg-white text-slate-900"
        }`}
      >
        {/* Email Window Header */}
        <div
          className={`flex items-center justify-between border-b px-5 py-4 ${border} ${
            darkMode ? "bg-slate-800/80" : "bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-500">
              <Mail size={19} />
            </span>

            <div>
              <h2
                id="submit-task-review-title"
                className="text-base font-bold"
              >
                {isArabic ? "رسالة مراجعة المهمة" : "New review email"}
              </h2>

              <p className={`mt-0.5 text-xs ${muted}`}>
                {isArabic
                  ? "إرسال المهمة إلى المراجع"
                  : "Send task completion for review"}
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label={isArabic ? "إغلاق" : "Close"}
            disabled={isSubmitting}
            onClick={handleClose}
            className={`rounded-lg p-2 transition disabled:opacity-50 ${
              darkMode ? "hover:bg-slate-700" : "hover:bg-slate-200"
            }`}
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email Fields */}
          <div className="px-5 pt-4">
            {/* To */}
            <div className={`flex min-h-12 items-center gap-3 border-b ${border}`}>
              <span className={`flex w-20 shrink-0 items-center gap-2 text-xs font-semibold ${muted}`}>
                <UserRound size={15} />
                {isArabic ? "إلى" : "To"}
              </span>

              <div className="flex min-w-0 flex-1 items-center py-2">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
                    darkMode
                      ? "bg-slate-700 text-slate-200"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  <span className="size-2 rounded-full bg-teal-500" />
                  {isArabic ? "مراجع المهمة" : "Task Reviewer"}
                </span>
              </div>
            </div>

            {/* Subject */}
            <div className={`flex min-h-12 items-center gap-3 border-b ${border}`}>
              <span className={`flex w-20 shrink-0 items-center gap-2 text-xs font-semibold ${muted}`}>
                <FileText size={15} />
                {isArabic ? "الموضوع" : "Subject"}
              </span>

              <div className="min-w-0 flex-1 py-3">
                <p className="text-sm font-semibold">
                  {isArabic
                    ? `طلب مراجعة المهمة - ${t.reviewModalTitle}`
                    : `Task Review Request - ${t.reviewModalTitle}`}
                </p>
              </div>
            </div>
          </div>

          {/* Email Body */}
          <div className="px-5 py-5">
            <div
              className={`mb-4 rounded-xl border p-4 ${
                darkMode
                  ? "border-slate-700 bg-slate-800/60"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <p className="text-sm font-semibold">
                {isArabic ? "السادة / فريق مراجعة المهام،" : "Dear Task Review Team,"}
              </p>

              <p className={`mt-2 text-sm leading-7 ${muted}`}>
                {isArabic
                  ? "أفيدكم بأنه تم الانتهاء من تنفيذ المهمة، برجاء مراجعة تفاصيل الإنجاز الموضحة أدناه واتخاذ اللازم."
                  : "I would like to inform you that the task has been completed. Please review the completion details below and take the necessary action."}
              </p>
            </div>

            <label
              htmlFor="task-completion-note"
              className="mb-2 block text-sm font-bold"
            >
              {t.completionNoteLabel}
              <span className="ms-1 text-rose-500">*</span>
            </label>

            <textarea
              id="task-completion-note"
              autoFocus
              rows={6}
              value={completionNote}
              onChange={(event) => {
                setCompletionNote(event.target.value);

                if (validationError) {
                  setValidationError("");
                }
              }}
              placeholder={t.completionNotePlaceholder}
              disabled={isSubmitting}
              aria-invalid={Boolean(validationError)}
              aria-describedby={
                validationError ? "task-completion-note-error" : undefined
              }
              className={`w-full resize-y rounded-xl border px-4 py-3 text-sm leading-7 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 disabled:opacity-60 ${
                darkMode
                  ? "border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500"
                  : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
              }`}
            />

            {validationError && (
              <p
                id="task-completion-note-error"
                role="alert"
                className="mt-2 text-xs text-rose-500"
              >
                {validationError}
              </p>
            )}

            <p className={`mt-4 text-sm leading-6 ${muted}`}>
              {isArabic
                ? "وتفضلوا بقبول فائق الاحترام والتقدير."
                : "Best regards,"}
            </p>
          </div>

          {/* Email Footer */}
          <div
            className={`flex flex-col-reverse gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${border} ${
              darkMode ? "bg-slate-800/50" : "bg-slate-50"
            }`}
          >
            <p className={`text-[11px] ${muted}`}>
              {isArabic
                ? "سيتم إرسال المهمة للمراجعة بعد التأكيد."
                : "The task will be submitted for review after confirmation."}
            </p>

            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${
                  darkMode
                    ? "border-slate-700 hover:bg-slate-700"
                    : "border-slate-200 bg-white hover:bg-slate-100"
                }`}
              >
                {t.reviewCancel}
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>
                  {isSubmitting
                    ? t.sending
                    : isArabic
                      ? "إرسال للمراجعة"
                      : "Send for Review"}
                </span>

                {isSubmitting ? (
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <Send size={15} />
                )}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
