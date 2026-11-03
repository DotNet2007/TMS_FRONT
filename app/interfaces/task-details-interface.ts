export interface TaskDetail {
  id: string;
  title: string;
  priority: string;
  priorityClass?: string;
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