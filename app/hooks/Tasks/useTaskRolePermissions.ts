import { SupervisorTaskView } from "@/app/interfaces/tasks-interface";


type RoleLike = string | { name?: unknown; code?: unknown } | null | undefined;

function normalizeRole(role: RoleLike): string {
  const value = typeof role === "string"
    ? role
    : role && typeof role === "object"
      ? [role.name, role.code].find((item): item is string => typeof item === "string" && item.trim().length > 0) ?? ""
      : "";
  return value.trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
}

export function useTaskRolePermissions(role: RoleLike, supervisorTaskView: SupervisorTaskView) {
  const userRole = normalizeRole(role);
  const isEmployee = userRole === "employee";
  const isSupervisor = userRole === "supervisor";
  const isSuperSupervisor = ["super supervisor", "supersupervisor"].includes(userRole);
  // Current API behavior from the supplied page: super supervisor loads assigned-by-me;
  // supervisor loads both endpoints; employee loads my-tasks only.
  const shouldLoadAssignedByMe = isSuperSupervisor || isSupervisor;
  const shouldLoadMyTasks = isSupervisor || isEmployee;
  const isSupervisorMode = isSupervisor;
  const showAssignedEmployee = isSupervisorMode && supervisorTaskView === "assignedByMe";
  const canReviewTasks = isSuperSupervisor || (isSupervisorMode && supervisorTaskView === "assignedByMe");
  return {
    userRole, isEmployee, isSupervisor, isSuperSupervisor,
    shouldLoadAssignedByMe, shouldLoadMyTasks, isSupervisorMode,
    showAssignedEmployee, canReviewTasks, isSupportedRole: shouldLoadAssignedByMe || shouldLoadMyTasks,
  };
}
