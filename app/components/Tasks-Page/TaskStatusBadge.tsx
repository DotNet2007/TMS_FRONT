import { MyTask, TaskTranslations } from "@/app/interfaces/tasks-interface";
import { getTaskStatusDot, getTaskStatusLabel, getTaskStatusTone } from "@/app/utils/tasks/task-status.helper";


export default function TaskStatusBadge({ task, isDark, isRTL, t }: {
  task: MyTask; isDark: boolean; isRTL: boolean; t: TaskTranslations;
}) {
  return (
    <span className={`inline-flex w-fit items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-medium ${getTaskStatusTone(task.apiStatus, task.checked, isDark)}`}>
      <i className={`h-1.5 w-1.5 rounded-full ${getTaskStatusDot(task.apiStatus, task.checked)}`} />
      {getTaskStatusLabel(task.apiStatus, task.checked, t, isRTL)}
    </span>
  );
}
