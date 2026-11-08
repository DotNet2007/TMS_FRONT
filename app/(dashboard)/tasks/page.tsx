"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDashboardLayout } from "@/app/components/DashboardLayout";
import { useAuth } from "@/app/context/AuthContext";
import type { Language } from "@/app/interfaces/tasks-interface";
import { useMyTasks } from "@/app/hooks/Tasks/useMyTasks";
import { useTaskReview } from "@/app/hooks/Tasks/useTaskReview";
import MyTasksStatistics, { type TaskStatistics } from "@/app/components/Tasks-Page/MyTasksStatistics";
import MyTasksToolbar from "@/app/components/Tasks-Page/MyTasksToolbar";
import MyTasksTable from "@/app/components/Tasks-Page/MyTasksTable";
import TaskPagination from "@/app/components/Tasks-Page/TaskPagination";
import TaskReviewModal from "@/app/components/Tasks-Page/TaskReviewModal";
import { taskTranslations } from "@/app/translations/dashboard/tasks/tasks-trans";
import MyTasksSkeleton from "@/app/components/Tasks-Page/TasksSkeleton";
import PageHeader from "@/app/components/PageHeader";

export default function MyTasksPage() {
    const router = useRouter();

    const { lang, isArabic, darkMode } = useDashboardLayout();
    const { user, isLoading: authLoading } = useAuth();

    // =========================================
    // Layout & Language
    // =========================================

    const isRTL = isArabic || lang === "ar";
    const isDark = darkMode;

    const language: Language = isRTL ? "ar" : "en";
    const t = taskTranslations[language];

    // =========================================
    // Hooks
    // =========================================

    const tasks = useMyTasks({ role: user?.role, authLoading, isRTL });
    const review = useTaskReview(isRTL);

    // =========================================
    // Skeleton Loading
    // =========================================

    if (authLoading || tasks.isLoading) {
      return <MyTasksSkeleton isRTL={isRTL} isDark={isDark} />;
    }

    // =========================================
    // Statistics
    // =========================================

    const apiStats = tasks.activeResponse?.statistics;

    // Fallback counts are based on the currently loaded page.
    const completed = apiStats?.completed ?? tasks.taskList.filter( (task) => task.apiStatus === "COMPLETED" ).length;
    const inProgress = apiStats?.dispatched ?? tasks.taskList.filter((task) => ["IN_PROGRESS", "DISPATCHED", "READY_TO_DISPATCH"].includes( task.apiStatus ) ).length;
    const needsReview = apiStats?.needReview ?? tasks.taskList.filter( (task) => task.apiStatus === "SUBMITTED" ).length;
    const rework = apiStats?.rework ?? tasks.taskList.filter( (task) => task.apiStatus === "REWORK" ).length;

    const stats: TaskStatistics = {
      total: tasks.serverTotalCount,
      inProgress,
      completed,
      needsReview,
      rework,
      completionRate:
        tasks.totalCount > 0
          ? Math.round((completed / tasks.totalCount) * 100)
          : 0,
    };

    // =========================================
    // Actions
    // =========================================

    const handleApprove = async (taskId: string) => {
      const result = await review.approveTask(taskId);

      if (result.success) {
        toast.success(
          isRTL
            ? "تم اعتماد المهمة بنجاح."
            : "Task approved successfully."
        );

        tasks.refetch();
      } else {
        toast.error(result.message);
      }
    };

    const handleRequestChanges = async () => {
      const success = await review.requestChanges(
        t.feedbackRequired
      );

      if (success) {
        toast.success(
          isRTL
            ? "تم إرسال الملاحظات وإرجاع المهمة للتعديل."
            : "Feedback sent and task returned for changes."
        );

        tasks.refetch();
      }
    };

    // =========================================
    // Styles
    // =========================================

    const mutedText = isDark ? "text-gray-400" : "text-gray-500";
    const surface = isDark ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-white";

    // =========================================
    // Render
    // =========================================

    return (
      <section dir={isRTL ? "rtl" : "ltr"} lang={isRTL ? "ar" : "en"} className={`min-w-0 space-y-6 transition-colors duration-300 ${ isDark ? "text-gray-100" : "text-gray-900" }`} >
        
        {/* Page Header */}
        <PageHeader isRTL={isRTL} isDark={isDark} kicker={t.kicker} title={t.title} description={t.description} />

        {/* Statistics */}
        <MyTasksStatistics stats={stats} t={t} isDark={isDark} />

        {/* Tasks Container */}
        <div className={`min-w-0 overflow-hidden rounded-xl border shadow-sm ${surface}`} >
          
          {/* Toolbar */}
          <MyTasksToolbar query={tasks.query} onQueryChange={tasks.changeQuery} status={tasks.status} onStatusChange={tasks.changeStatus} supervisorTaskView={tasks.supervisorTaskView} onSupervisorViewChange={tasks.changeSupervisorView} isSupervisorMode={tasks.isSupervisorMode} isRTL={isRTL} isDark={isDark} t={t} stats={stats} />

          {/* Tasks Content */}
          <div>
            {tasks.isError ? (
              <div className="flex min-h-40 flex-col items-center justify-center gap-3 px-5 py-10 text-center">
                <p className={`text-sm ${mutedText}`}>
                  {tasks.isSupportedRole
                    ? t.failedLoad
                    : isRTL
                      ? "ليس لديك صلاحية لعرض المهام."
                      : "You do not have permission to view tasks."}
                </p>

                {tasks.isSupportedRole && (
                  <button type="button" onClick={tasks.refetch} className="rounded-lg bg-[#238e94] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1d777c]" >
                    {t.retry}
                  </button>
                )}
              </div>
            ) : (<MyTasksTable tasks={tasks.taskList} isRTL={isRTL} isDark={isDark} language={language} translations={t} canReviewTasks={tasks.canReviewTasks} showAssignedEmployee={tasks.showAssignedEmployee} isReviewSubmitting={review.isReviewSubmitting} isFetchingApprovalSubmissions={ review.isFetchingApprovalSubmissions } onOpenTask={(taskId) => router.push(`/tasks/${taskId}`) } onApprove={(taskId) => void handleApprove(taskId) } onRequestChanges={review.openReviewModal}/>)}
          </div>

          {/* Pagination */}
          {!tasks.isError && (<TaskPagination currentPage={tasks.activePage} totalPages={tasks.totalPages} totalCount={tasks.totalCount} pageSize={tasks.pageSize} isRTL={isRTL} isDark={isDark} onPageChange={tasks.changePage} />)}
        </div>

        {/* Review Modal */}
        <TaskReviewModal isOpen={review.isReviewModalOpen} isRTL={isRTL} isDark={isDark} isSubmitting={review.isReviewSubmitting} isLoadingSubmissions={review.isLoadingReviewSubmissions} hasSubmission={review.hasReviewSubmission} feedback={review.reviewFeedback} onFeedbackChange={review.setReviewFeedback} error={review.reviewError} onClose={review.closeReviewModal} onSubmit={() => void handleRequestChanges()} t={t} />
      </section>
    );
}
