type TaskStatusLabels = {
  completed: string;
  inProgress: string;
};

export type TaskStatusMeta = {
  label: string;
  color: "emerald" | "blue" | "amber" | "rose" | "slate";
};

const STATUS_COLORS: Record<string, TaskStatusMeta["color"]> = {
  COMPLETED: "emerald",
  APPROVED: "emerald",
  SUBMITTED: "blue",
  DISPATCHED: "amber",
  REWORK: "rose",
  PENDING: "slate",
  CANCELLED: "slate",
};

const STATUS_LABELS: Record<string, { ar: string; en: string }> = {
  COMPLETED: { ar: "مكتملة", en: "Completed" },
  APPROVED: { ar: "تمت الموافقة", en: "Approved" },
  SUBMITTED: { ar: "قيد المراجعة", en: "Under review" },
  DISPATCHED: { ar: "قيد التنفيذ", en: "In Progress" },
  REWORK: { ar: "مطلوب تعديل", en: "Requires changes" },
  PENDING: { ar: "معلقة", en: "Pending" },
  CANCELLED: { ar: "ملغاة", en: "Cancelled" },
};

export function normalizeTaskStatus(status?: string | null): string {
  return String(status ?? "").trim().toUpperCase();
}

export function getTaskStatusMeta(
  status: string | null | undefined,
  isArabic: boolean,
  fallbackLabels: TaskStatusLabels,
): TaskStatusMeta {
  const normalizedStatus = normalizeTaskStatus(status);
  const knownLabel = STATUS_LABELS[normalizedStatus];

  let label = knownLabel?.[isArabic ? "ar" : "en"];

  if (!label && normalizedStatus === "IN_PROGRESS") {
    label = fallbackLabels.inProgress;
  }

  if (!label && normalizedStatus === "DONE") {
    label = fallbackLabels.completed;
  }

  if (!label) {
    label = normalizedStatus
      ? normalizedStatus.replaceAll("_", " ")
      : fallbackLabels.inProgress;
  }

  return {
    label,
    color: STATUS_COLORS[normalizedStatus] ?? "slate",
  };
}
