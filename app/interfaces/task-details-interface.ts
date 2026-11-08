export interface TaskDetail {
  id: string;
  title: string;
  project: string;
  checked: boolean;
  date: string;
  description?: string;
  assignee?: string;
  createdBy?: string;
  status?: string;
};


export interface TaskActivityEvent {
  id: string;
  eventType: string;
  actorId?: string | null;
  occurredAt?: string | null;
};


/**
 * These types describe the task detail API payload fields consumed by this page.
 * Keep them aligned with the actual backend response and use them as the
 * response type in the RTK Query endpoint when possible.
 */

export interface TaskApiPerson {
  id?: string | number | null;
  fullName?: string | null;
  role?: string | null;
  roleName?: string | null;
  code?: string | null;
}

export interface TaskApiDetails {
  id?: string;
  title?: string | null;
  description?: string | null;
  status?: string | null;
  deadline?: string | null;
  assigneeId?: string | number | null;
  createdById?: string | number | null;
  assignee?: TaskApiPerson | null;
  createdBy?: TaskApiPerson | null;
  team?: {
    name?: string | null;
  } | null;
}

export interface TaskDetailsResponse {
  task?: TaskApiDetails;
  events?: TaskActivityEvent[];
}
