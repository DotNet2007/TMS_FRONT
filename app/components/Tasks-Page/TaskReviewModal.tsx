import { TaskTranslations } from "@/app/interfaces/tasks-interface";
import { X } from "lucide-react";
import type { MouseEvent } from "react";


export default function TaskReviewModal({
  isOpen, isRTL, isDark, isSubmitting, isLoadingSubmissions, hasSubmission,
  feedback, onFeedbackChange, error, onClose, onSubmit, t,
}: {
  isOpen: boolean; isRTL: boolean; isDark: boolean; isSubmitting: boolean;
  isLoadingSubmissions: boolean; hasSubmission: boolean; feedback: string;
  onFeedbackChange: (value: string) => void; error: string | null;
  onClose: () => void; onSubmit: () => void; t: TaskTranslations;
}) {
  if (!isOpen) return null;
  const headingText = isDark ? "text-gray-100" : "text-gray-900";
  const mutedText = isDark ? "text-gray-400" : "text-gray-500";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  const closeIfBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !isSubmitting) onClose();
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation" onMouseDown={closeIfBackdrop}>
    <div role="dialog" aria-modal="true" aria-labelledby="review-feedback-title" aria-describedby="review-feedback-description" dir={isRTL ? "rtl" : "ltr"} className={`w-full max-w-lg rounded-2xl border p-5 shadow-2xl ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 id="review-feedback-title" className={`text-lg font-bold ${headingText}`}>{t.reviewFeedbackTitle}</h3>
        <button type="button" onClick={onClose} disabled={isSubmitting} aria-label={t.cancel} className={`rounded-lg p-2 ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}><X size={18} /></button>
      </div>
      <p id="review-feedback-description" className={`mb-3 text-sm ${mutedText}`}>{isRTL ? "اكتب ملاحظات واضحة للموظف قبل إعادة المهمة." : "Provide clear feedback before returning this task to the employee."}</p>
      <textarea value={feedback} onChange={(event) => onFeedbackChange(event.target.value)} rows={5} autoFocus placeholder={t.reviewFeedbackPlaceholder} className={`w-full resize-y rounded-xl border p-3 text-sm outline-none focus:border-[#238e94] focus:ring-2 focus:ring-[#238e94]/20 ${isDark ? "border-gray-700 bg-gray-950 text-gray-100 placeholder:text-gray-500" : "border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400"}`} />
      {error && <p role="alert" className="mt-2 text-sm text-rose-500">{error}</p>}
      <div className="mt-4 flex justify-end gap-2">
        <button type="button" onClick={onClose} disabled={isSubmitting} className={`rounded-lg border px-4 py-2 text-sm font-medium ${borderColor} ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}>{t.cancel}</button>
        <button type="button" disabled={isSubmitting || isLoadingSubmissions || !feedback.trim() || !hasSubmission} onClick={onSubmit} className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? (isRTL ? "جارٍ الإرسال..." : "Sending...") : t.sendFeedback}</button>
      </div>
    </div>
  </div>;
}
