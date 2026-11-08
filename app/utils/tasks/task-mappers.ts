import type { TaskStatus } from "@/app/services/tasks-api";
import { toTaskDate } from "./task-date.helper";
import { MyTask } from "@/app/interfaces/tasks-interface";

type ApiTask = {
  id: string; title: string; description?: string | null; status: TaskStatus;
  team?: { name?: string | null } | null;
  assignee?: { fullName?: string | null } | null;
  deadline?: string | null;
};

export function mapApiTasks(tasks: ApiTask[], noTeamLabel: string, unassignedLabel: string): MyTask[] {
  return tasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    project: task.team?.name ?? noTeamLabel,
    assigneeName: task.assignee?.fullName?.trim() || unassignedLabel,
    checked: task.status === "COMPLETED",
    date: toTaskDate(task.deadline),
    apiStatus: task.status,
  }));
}
