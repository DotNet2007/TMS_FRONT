import type { ReactNode } from "react";
import type { TaskStatus } from "@/app/services/tasks-api";

export type Language = "ar" | "en";
export type TaskFilter = "all" | "progress" | "completed" | "needsReview" | "rework";
export type SupervisorTaskView = "myTasks" | "assignedByMe";

export type MyTask = {
  id: string;
  title: string;
  description?: string | null;
  project: string;
  assigneeName: string;
  checked: boolean;
  date: string;
  apiStatus: TaskStatus;
};

export type TaskTranslations = {
  kicker: string; title: string; description: string; searchPlaceholder: string;
  myTasksButton: string; assignedByMeButton: string; addTask: string;
  allTasks: string; inProgress: string; completed: string; thisWeek: string;
  progress: string; taskList: string; visibleTasks: string; task: string;
  dueDate: string; responsibleSector: string; assignedEmployee: string;
  status: string; reopen: string; completeTask: string; moreOptions: string;
  emptyTitle: string; noResults: string; emptyDescription: string;
  noTeam: string; noSector: string; loadingTasks: string; failedLoad: string;
  retry: string; completionNotePrompt: string; submissionNotAllowed: string;
  needsReview: string; rework: string; reviewFeedbackTitle: string;
  reviewFeedbackPlaceholder: string; sendFeedback: string; cancel: string;
  feedbackRequired: string;
};

export type TaskTableProps = {
  tasks: MyTask[];
  isRTL: boolean;
  isDark: boolean;
  language: Language;
  translations: TaskTranslations;
  canReviewTasks: boolean;
  showAssignedEmployee: boolean;
  isReviewSubmitting: boolean;
  isFetchingApprovalSubmissions: boolean;
  onOpenTask: (taskId: string) => void;
  onApprove: (taskId: string) => void;
  onRequestChanges: (taskId: string) => void;
};

export type TableColumn<T> = {
  key: string;
  header: string;
  width?: string;
  render: (row: T) => ReactNode;
};
