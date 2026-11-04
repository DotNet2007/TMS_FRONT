export type DashboardRole =
  | "EMPLOYEE"
  | "SUPERVISOR"
  | "SUPER_SUPERVISOR";

export type TaskStatus =
  | "DISPATCHED"
  | "SUBMITTED"
  | "COMPLETED"
  | "REWORK"
  | (string & {});

export interface DashboardUser {
  id: string;
  fullName: string;
}

export interface DashboardTeam {
  id: string;
  name: string;
}

export interface DashboardTask {
  id: string;
  title: string;
  status: TaskStatus;
  deadline: string | null;
  createdAt: string;
  assignee: DashboardUser | null;
  createdBy: DashboardUser | null;
  team: DashboardTeam | null;
}

// Employee statistics
export interface EmployeeStatistics {
  totalAssigned: number;
  completed: number;
  dispatched: number;
  completionRate: number;
}

// Supervisor statistics
export interface SupervisorStatistics {
  assigned: {
    total: number;
    completed: number;
    dispatched: number;
    completionRate: number;
  };
  created: {
    total: number;
    completed: number;
  };
  awaitingReview: number;
}

// Super Supervisor statistics
export interface SuperSupervisorStatistics {
  dispatched: number;
  created: {
    total: number;
    completed: number;
  };
  awaitingReview: number;
}

// Role-specific dashboard data
export interface EmployeeDashboardData {
  recentAssignedTasks: DashboardTask[];
  closestUnfinishedTask: DashboardTask | null;
  statistics: EmployeeStatistics;
}

export interface SupervisorDashboardData {
  recentAssignedTasks: DashboardTask[];
  recentCreatedTasks: DashboardTask[];
  closestUnfinishedTask: DashboardTask | null;
  statistics: SupervisorStatistics;
}

export interface SuperSupervisorDashboardData {
  recentCreatedTasks: DashboardTask[];
  closestUnfinishedTask: DashboardTask | null;
  statistics: SuperSupervisorStatistics;
}

// Discriminated API response
export interface EmployeeDashboardResponse {
  status: "success";
  role: "EMPLOYEE";
  data: EmployeeDashboardData;
}

export interface SupervisorDashboardResponse {
  status: "success";
  role: "SUPERVISOR";
  data: SupervisorDashboardData;
}

export interface SuperSupervisorDashboardResponse {
  status: "success";
  role: "SUPER_SUPERVISOR";
  data: SuperSupervisorDashboardData;
}

export type TasksDashboardResponse =
  | EmployeeDashboardResponse
  | SupervisorDashboardResponse
  | SuperSupervisorDashboardResponse;