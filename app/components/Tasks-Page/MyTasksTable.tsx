import { CalendarDays, Check, CheckCircle2, XCircle } from "lucide-react";
import DynamicReportTable from "@/app/components/DynamicTable";
import type { TableColumn } from "@/app/components/DynamicTable";
import { MyTask, TaskTableProps } from "@/app/interfaces/tasks-interface";
import TaskStatusBadge from "./TaskStatusBadge";
import { displayDate } from "@/app/utils/tasks/task-date.helper";


export default function MyTasksTable({
  tasks, isRTL, isDark, language, translations: t, canReviewTasks,
  showAssignedEmployee, isReviewSubmitting, isFetchingApprovalSubmissions,
  onOpenTask, onApprove, onRequestChanges,
}: TaskTableProps) {
  const mutedText = isDark ? "text-gray-400" : "text-gray-500";
  const headingText = isDark ? "text-gray-100" : "text-gray-900";
  const surface = isDark ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-white";
  const columns: TableColumn<MyTask>[] = [
    {
      key: "title", header: t.task, width: canReviewTasks ? "32%" : "38%",
      render: (task) => <div className="min-w-0">
        <strong className={`block wrap-break-word text-xs font-semibold leading-5 sm:text-sm ${task.checked ? `line-through ${mutedText}` : headingText}`}>{task.title}</strong>
        <div className="mt-2 flex items-center gap-2 md:hidden"><CalendarDays size={13} /><span className={`text-[11px] ${mutedText}`}>{displayDate(task.date, language)}</span></div>
      </div>,
    },
    { key: "date", header: t.dueDate, width: "16%", render: (task) => <span className={`hidden items-center gap-2 text-xs md:inline-flex ${mutedText}`}><CalendarDays size={14} />{displayDate(task.date, language)}</span> },
    { key: "responsible", header: showAssignedEmployee ? t.assignedEmployee : t.responsibleSector, width: canReviewTasks ? "20%" : "24%", render: (task) => <span className={`block min-w-0 truncate text-xs ${mutedText}`}>{(showAssignedEmployee ? task.assigneeName : task.project) || t.noSector}</span> },
    { key: "status", header: t.status, width: "16%", render: (task) => <TaskStatusBadge task={task} isDark={isDark} isRTL={isRTL} t={t} /> },
    ...(canReviewTasks ? [{
      key: "review", header: isRTL ? "المراجعة" : "Review", width: "16%",
      render: (task: MyTask) => <div className="flex items-center gap-2">
        {task.apiStatus === "SUBMITTED" ? <>
          <button type="button" aria-label={isRTL ? "اعتماد المهمة" : "Approve task"} title={isRTL ? "اعتماد المهمة" : "Approve task"}
            disabled={isReviewSubmitting || isFetchingApprovalSubmissions}
            onClick={(event) => { event.stopPropagation(); onApprove(task.id); }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:text-emerald-300"><CheckCircle2 size={18} /></button>
          <button type="button" aria-label={isRTL ? "إرجاع المهمة للتعديل" : "Request task changes"} title={isRTL ? "إرجاع المهمة للتعديل" : "Request changes"}
            onClick={(event) => { event.stopPropagation(); onRequestChanges(task.id); }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-600 transition hover:bg-rose-500/20 dark:text-rose-300"><XCircle size={18} /></button>
        </> : <span className={`text-xs ${mutedText}`}>—</span>}
      </div>,
    } satisfies TableColumn<MyTask>] : []),
  ];

  return <DynamicReportTable<MyTask>
    data={tasks} columns={columns} getRowKey={(task) => task.id}
    getRowLabel={(task) => `${isRTL ? "عرض تفاصيل المهمة" : "View task details"}: ${task.title}`}
    onRowClick={(task) => onOpenTask(task.id)} rowClassName={(task) => task.checked ? "opacity-75" : ""}
    isDark={isDark} isRTL={isRTL} surface={surface} mutedText={mutedText}
    noResults={isRTL ? "لا توجد مهام تطابق البحث أو الفلتر المحدد." : "No tasks match the search or selected filter."}
    changeFilters={t.emptyDescription} mobileCards
    emptyIcon={<span className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${isDark ? "bg-teal-500/10 text-teal-300" : "bg-teal-50 text-[#238e94]"}`}><Check size={24} /></span>}
  />;
}
