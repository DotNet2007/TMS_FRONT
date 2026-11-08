
import { TaskFilter, TaskTranslations } from "@/app/interfaces/tasks-interface";
import type { TaskStatus } from "@/app/services/tasks-api";

export const apiStatusFilter: Record<TaskFilter, string | undefined> = {
  all: undefined,
  progress: "DISPATCHED",
  completed: "COMPLETED",
  needsReview: "SUBMITTED",
  rework: "REWORK",
};

export function getTaskStatusLabel(
  status: TaskStatus,
  checked: boolean,
  t: TaskTranslations,
  isRTL: boolean,
): string {
  if (checked || status === "COMPLETED") return t.completed;
  if (status === "SUBMITTED") return isRTL ? "بانتظار المراجعة" : "Awaiting review";
  if (status === "READY_TO_DISPATCH") return isRTL ? "بانتظار الإرسال" : "Awaiting dispatch";
  if (status === "REWORK") return isRTL ? "مطلوب تعديل" : "Rework requested";
  if (status === "CANCELLED") return isRTL ? "ملغاة" : "Cancelled";
  return t.inProgress;
}

export function getTaskStatusTone(status: TaskStatus, checked: boolean, isDark: boolean): string {
  if (checked || status === "COMPLETED") return isDark ? "bg-emerald-500/10 text-emerald-300" : "bg-emerald-50 text-emerald-700";
  if (status === "SUBMITTED") return isDark ? "bg-violet-500/15 text-violet-300" : "bg-violet-50 text-violet-700";
  if (status === "REWORK") return isDark ? "bg-rose-500/10 text-rose-300" : "bg-rose-50 text-rose-700";
  return isDark ? "bg-amber-500/10 text-amber-300" : "bg-amber-50 text-amber-700";
}

export function getTaskStatusDot(status: TaskStatus, checked: boolean): string {
  if (checked || status === "COMPLETED") return "bg-emerald-500";
  if (status === "SUBMITTED") return "bg-violet-500";
  if (status === "REWORK") return "bg-rose-500";
  return "bg-amber-500";
}
