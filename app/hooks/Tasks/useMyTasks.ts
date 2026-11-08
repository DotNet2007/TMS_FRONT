import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/app/hooks/useDebounce";
import { useGetAssignedByMeQuery, useGetMyTasksQuery } from "@/app/services/tasks-api";

import { useTaskRolePermissions } from "./useTaskRolePermissions";
import { SupervisorTaskView, TaskFilter } from "@/app/interfaces/tasks-interface";
import { apiStatusFilter } from "@/app/utils/tasks/task-status.helper";
import { mapApiTasks } from "@/app/utils/tasks/task-mappers";

const PAGE_SIZE = 10;

export function useMyTasks({ role, authLoading, isRTL }: { role: unknown; authLoading: boolean; isRTL: boolean }) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const [status, setStatus] = useState<TaskFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [supervisorTaskView, setSupervisorTaskView] = useState<SupervisorTaskView>("assignedByMe");
  const permissions = useTaskRolePermissions(role as string | { name?: unknown; code?: unknown } | null | undefined, supervisorTaskView);

  const requestArgs = {
    page: currentPage,
    limit: PAGE_SIZE,
    search: debouncedQuery.trim() || undefined,
    status: apiStatusFilter[status],
  };

  const assignedQuery = useGetAssignedByMeQuery(requestArgs, {
    skip: authLoading || !permissions.shouldLoadAssignedByMe,
  });
  const myTasksQuery = useGetMyTasksQuery(requestArgs, {
    skip: authLoading || !permissions.shouldLoadMyTasks,
  });

  const activeQuery = permissions.isSupervisorMode
    ? supervisorTaskView === "assignedByMe" ? assignedQuery : myTasksQuery
    : permissions.shouldLoadAssignedByMe ? assignedQuery : myTasksQuery;
  const activeResponse = activeQuery.data;
  const responseTasks = useMemo(() => activeResponse?.tasks ?? [], [activeResponse?.tasks]);
  const taskList = useMemo(
    () => mapApiTasks(responseTasks, isRTL ? "بدون فريق" : "No team", isRTL ? "غير محدد" : "Unassigned"),
    [responseTasks, isRTL],
  );

  const totalCount = activeResponse?.pagination?.total
    ?? activeResponse?.count
    ?? activeResponse?.statistics?.total
    ?? activeResponse?.tasks?.length
    ?? 0;
  const totalPages = activeResponse?.pagination?.totalPages ?? Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const activePage = Math.min(currentPage, totalPages);
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);
  const isLoading = authLoading || (!authLoading && permissions.isSupportedRole && activeQuery.isLoading);
  const isFetching = !authLoading && permissions.isSupportedRole && activeQuery.isFetching;
  const isError = !authLoading && (!permissions.isSupportedRole || activeQuery.isError);

  const refetch = () => {
    if (permissions.isSupportedRole) void activeQuery.refetch();
  };

  const changeStatus = (value: TaskFilter) => { setStatus(value); setCurrentPage(1); };
  const changeQuery = (value: string) => { setQuery(value); setCurrentPage(1); };
  const changeSupervisorView = (value: SupervisorTaskView) => {
    setSupervisorTaskView(value);
    setCurrentPage(1);
    setStatus("all");
  };
  const changePage = (value: number) => setCurrentPage(Math.min(Math.max(1, value), totalPages));

  return {
    query, status, currentPage, activePage, pageSize: PAGE_SIZE, totalCount, totalPages,
    serverTotalCount: activeResponse?.statistics?.total ?? activeResponse?.pagination?.total ?? activeResponse?.count ?? activeResponse?.tasks?.length ?? 0,
    supervisorTaskView, taskList, activeResponse, isLoading, isFetching, isError,
    refetch, changeQuery, changeStatus, changePage, changeSupervisorView,
    ...permissions,
  };
}
