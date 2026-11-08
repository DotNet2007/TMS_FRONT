import { useMemo } from "react";
import { TaskApiDetails } from "../interfaces/task-details-interface";


type UseTaskPermissionsArgs = {
  userRole: string;
  currentUserId: string;
  task?: TaskApiDetails;
};

const SUPER_SUPERVISOR_ROLES = ["super supervisor", "supersupervisor"];

function isSuperSupervisorRole(role: string) {
  return SUPER_SUPERVISOR_ROLES.includes(role.replace(/\s+/g, " ").trim());
}

export function useTaskPermissions({
  userRole,
  currentUserId,
  task,
}: UseTaskPermissionsArgs) {
  return useMemo(() => {
    const normalizedRole = userRole.trim().toLowerCase();
    const isEmployee = normalizedRole === "employee";
    const isSupervisor = normalizedRole === "supervisor";
    const isSuperSupervisor = isSuperSupervisorRole(normalizedRole);

    const creatorRole = String(
      task?.createdBy?.role ??
        task?.createdBy?.roleName ??
        task?.createdBy?.code ??
        "",
    )
      .trim()
      .toLowerCase();

    const createdBySuperSupervisor =
      isSuperSupervisorRole(creatorRole);

    const assignedToCurrentUser =
      Boolean(currentUserId) &&
      String(task?.assignee?.id ?? task?.assigneeId ?? "") ===
        String(currentUserId);

    const supervisorCanSubmit =
      isSupervisor &&
      assignedToCurrentUser &&
      createdBySuperSupervisor;

    const status = String(task?.status ?? "").trim().toUpperCase();

    const canSubmitForReview =
      !isSuperSupervisor &&
      (isEmployee || supervisorCanSubmit) &&
      ["DISPATCHED", "REWORK"].includes(status);

    return {
      isEmployee,
      isSupervisor,
      isSuperSupervisor,
      assignedToCurrentUser,
      supervisorCanSubmit,
      canSubmitForReview,
    };
  }, [userRole, currentUserId, task]);
}
