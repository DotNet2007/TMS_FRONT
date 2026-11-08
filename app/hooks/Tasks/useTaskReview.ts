import { useState } from "react";
import {
  useGetTaskSubmissionsQuery,
  useLazyGetTaskSubmissionsQuery,
  useReviewTaskSubmissionMutation,
  type TaskSubmission,
} from "@/app/services/tasks-api";

function latestSubmissionId(submissions: TaskSubmission[] = []): string | undefined {
  const valid = submissions.filter((item) => typeof item?.id === "string" && item.id.trim().length > 0);
  if (!valid.length) return undefined;
  const dated = valid.filter((item) => typeof item.createdAt === "string" && !Number.isNaN(Date.parse(item.createdAt)));
  if (dated.length) {
    return [...dated].sort((a, b) => Date.parse(a.createdAt!) - Date.parse(b.createdAt!)).at(-1)?.id;
  }
  return valid.at(-1)?.id;
}

function getApiError(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data?: { message?: unknown } }).data;
    if (typeof data?.message === "string") return data.message;
  }
  return fallback;
}

export function useTaskReview(isRTL: boolean) {
  const [reviewTaskId, setReviewTaskId] = useState<string | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewTaskSubmission, { isLoading: isReviewSubmitting }] = useReviewTaskSubmissionMutation();
  const { currentData: reviewSubmissionsData, isFetching: isLoadingReviewSubmissions } =
    useGetTaskSubmissionsQuery(reviewTaskId ?? "", { skip: !reviewTaskId });
  const [fetchTaskSubmissions, { isFetching: isFetchingApprovalSubmissions }] = useLazyGetTaskSubmissionsQuery();

  const closeReviewModal = () => {
    if (isReviewSubmitting) return;
    setIsReviewModalOpen(false);
    setReviewTaskId(null);
    setReviewFeedback("");
    setReviewError(null);
  };

  const openReviewModal = (taskId: string) => {
    setReviewTaskId(taskId);
    setReviewFeedback("");
    setReviewError(null);
    setIsReviewModalOpen(true);
  };

  const approveTask = async (taskId: string) => {
    try {
      const result = await fetchTaskSubmissions(taskId).unwrap();
      const submissionId = latestSubmissionId(result.submissions ?? []);
      if (!submissionId) throw new Error(isRTL ? "لا يوجد تسليم متاح لمراجعته." : "No submission is available to review.");
      await reviewTaskSubmission({ taskId, submissionId, decision: "APPROVE" }).unwrap();
      return { success: true as const };
    } catch (error) {
      return { success: false as const, message: error instanceof Error ? error.message : getApiError(error, isRTL ? "تعذرت الموافقة على المهمة." : "Could not approve this task.") };
    }
  };

  const requestChanges = async (feedbackRequired: string) => {
    const taskId = reviewTaskId;
    const submissionId = latestSubmissionId(reviewSubmissionsData?.submissions ?? []);
    if (!taskId || !submissionId) {
      setReviewError(isRTL ? "لا يوجد تسليم متاح لمراجعته." : "No submission is available to review.");
      return false;
    }
    if (!reviewFeedback.trim()) {
      setReviewError(feedbackRequired);
      return false;
    }
    setReviewError(null);
    try {
      await reviewTaskSubmission({ taskId, submissionId, decision: "REWORK", feedback: reviewFeedback.trim() }).unwrap();
      setIsReviewModalOpen(false);
      setReviewTaskId(null);
      setReviewFeedback("");
      return true;
    } catch (error) {
      setReviewError(getApiError(error, isRTL ? "تعذر إرسال الملاحظات." : "Could not send feedback."));
      return false;
    }
  };

  return {
    reviewTaskId, reviewFeedback, setReviewFeedback, isReviewModalOpen,
    setIsReviewModalOpen, reviewError, setReviewError, isReviewSubmitting,
    isLoadingReviewSubmissions, isFetchingApprovalSubmissions,
    hasReviewSubmission: Boolean(latestSubmissionId(reviewSubmissionsData?.submissions ?? [])),
    openReviewModal, closeReviewModal, approveTask, requestChanges,
  };
}
