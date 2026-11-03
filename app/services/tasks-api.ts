// import {
//   createApi,
//   fetchBaseQuery,
// } from "@reduxjs/toolkit/query/react";

// /**
//  * Tasks API based on tasks-api-frontend-handoff.md
//  *
//  * Configure NEXT_PUBLIC_API_URL as the backend origin, e.g. http://localhost:5000
//  * Do not include /tasks in NEXT_PUBLIC_API_URL because endpoint paths below
//  * already include /tasks.
//  */

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// const baseQuery = fetchBaseQuery({
//   baseUrl: API_BASE_URL,
//   prepareHeaders: (headers) => {
//     if (typeof window !== "undefined") {
//       const token = localStorage.getItem("userToken");
//       if (token) {
//         headers.set("Authorization", `Bearer ${token}`);
//       }
//     }

//     // fetchBaseQuery sets JSON content type for JSON bodies as needed.
//     // Do not set Content-Type manually for FormData uploads.
//     return headers;
//   },
// });

// export type TaskStatus =
//   | "READY_TO_DISPATCH"
//   | "IN_PROGRESS"
//   | "DISPATCHED"
//   | "SUBMITTED"
//   | "COMPLETED"
//   | "REWORK"
//   | "CANCELLED";

// export type IntakeStatus = "NO_TASKS" | "NEEDS_REVIEW" | "COMPLETED";

// export type ProposalStatus =
//   | "NEEDS_REVIEW"
//   | "DRAFT"
//   | "TASK_CREATED"
//   | "REJECTED";

// export interface TaskPerson {
//   id: string;
//   fullName: string;
//   email?: string;
// }

// export interface TaskTeam {
//   id: string;
//   name: string;
// }

// export interface TaskRecord {
//   id: string;
//   title: string;
//   description?: string | null;
//   deadline: string;
//   status: TaskStatus;
//   // Nested objects returned by GET /tasks/assigned-by-me and /tasks/my-tasks.
//   assignee?: TaskPerson | null;
//   createdBy?: TaskPerson | null;
//   team?: TaskTeam | null;
//   _count?: {
//     submissions: number;
//     reviews: number;
//   };
//   [key: string]: unknown;
// }

// export interface TasksPagination {
//   page: number;
//   limit: number;
//   total: number;
//   totalPages: number;
// }

// export interface GetMyTasksParams {
//   page?: number;
//   limit?: number;
//   search?: string;
//   status?: TaskStatus | string;
// }

// /**
//  * Normalized response used by the UI.
//  * The backend currently returns tasks in `data` and pagination metadata,
//  * while older endpoints may return them in `tasks`.
//  */
// export interface MyTasksResponse {
//   status: string;
//   count: number;
//   tasks: TaskRecord[];
//   pagination?: TasksPagination;
// }

// interface RawMyTasksResponse {
//   status?: string;
//   count?: number;
//   tasks?: TaskRecord[];
//   data?: TaskRecord[];
//   pagination?: TasksPagination;
// }

// export interface TaskSubmission {
//   id: string;
//   completionNote?: string;
//   createdAt?: string;
//   submitter?: TaskPerson;
//   reviews?: TaskReview[];
//   attachments?: unknown[];
//   [key: string]: unknown;
// }

// export interface TaskReview {
//   id?: string;
//   decision: "APPROVE" | "REWORK";
//   feedback?: string | null;
//   reviewer?: TaskPerson;
//   [key: string]: unknown;
// }

// export interface TaskDetailsResponse {
//   task: TaskRecord;
//   submissions: TaskSubmission[];
//   events: unknown[];
//   deadlineChanges: unknown[];
// }

// export interface TaskSubmissionsResponse {
//   status: string;
//   taskId: string;
//   submissions: TaskSubmission[];
// }

// export interface TaskHistoryResponse {
//   status: string;
//   taskId: string;
//   events: unknown[];
//   deadlineChanges: unknown[];
//   reviews: TaskReview[];
// }

// export interface BasicStatusResponse {
//   status: string;
//   message?: string;
//   [key: string]: unknown;
// }

// export interface SubmitTaskRequest {
//   taskId: string;
//   completionNote: string;
// }

// export interface ReviewTaskRequest {
//   taskId: string;
//   submissionId: string;
//   decision: "APPROVE" | "REWORK";
//   feedback?: string;
// }

// export interface UpdateTaskDeadlineRequest {
//   taskId: string;
//   deadline: string;
//   reason: string;
// }

// export interface TaskProposal {
//   proposalId: string;
//   title: string;
//   description?: string | null;
//   predictedJobTitle?: string | null;
//   predictionStatus?: string;
//   predictionReason?: string | null;
//   suggestedDeadline?: string | null;
//   status?: ProposalStatus;
//   recommendation?: {
//     userId: string;
//     displayName: string;
//     email?: string;
//     jobTitle?: string;
//     role?: string;
//     hierarchyLevel?: number;
//     workload?: Record<string, unknown>;
//   } | null;
//   recommendationMessage?: string | null;
//   [key: string]: unknown;
// }

// export interface TaskIntakeResponse {
//   status: string;
//   analysisId: string;
//   analysis?: {
//     id: string;
//     source?: string;
//     analysisStatus?: IntakeStatus;
//     createdAt?: string;
//     [key: string]: unknown;
//   };
//   taskCount?: number;
//   proposals: TaskProposal[];
//   [key: string]: unknown;
// }

// export interface AnalyzeTaskTextRequest {
//   emailText: string;
// }

// export interface GetTaskIntakeResponse {
//   status?: string;
//   analysis?: Record<string, unknown>;
//   proposals: TaskProposal[];
//   [key: string]: unknown;
// }

// export interface RecommendEmployeeResponse {
//   status?: string;
//   proposal?: TaskProposal;
//   recommendation?: TaskProposal["recommendation"];
//   [key: string]: unknown;
// }

// export interface CreateTaskDraftRequest {
//   analysisId: string;
//   proposalId: string;
//   assigneeId: string;
//   title: string;
//   description?: string;
//   deadline: string;
//   emailSubject: string;
//   emailBody: string;
// }

// export interface CreateTaskDraftResponse {
//   status?: string;
//   task: TaskRecord;
//   emailDraft: {
//     id: string;
//     subject: string;
//     body: string;
//     status: string;
//     recipient?: string;
//     [key: string]: unknown;
//   };
//   selection?: Record<string, unknown>;
//   [key: string]: unknown;
// }

// export interface ConfirmEmailDraftRequest {
//   draftId: string;
//   note?: string;
// }

// export const tasksApi = createApi({
//   reducerPath: "tasksApi",
//   baseQuery,
//   tagTypes: ["Task", "TaskList", "TaskIntake", "TaskSubmissions", "TaskHistory"],
//   endpoints: (builder) => ({
//     // GET /tasks/my-tasks?status=...
//     getMyTasks: builder.query<MyTasksResponse, GetMyTasksParams | void>({
//         query: (arg) => {
//             const params: Record<string, string | number> = {};

//             if (arg?.page !== undefined) params.page = arg.page;
//             if (arg?.limit !== undefined) params.limit = arg.limit;

//             const search = arg?.search?.trim();
//             if (search) params.search = search;

//             if (arg?.status) params.status = arg.status;

//             return {
//             url: "/tasks/my-tasks",
//             params,
//             };
//     },

    
    

//     transformResponse: (
//         response: RawMyTasksResponse
//     ): MyTasksResponse => {
//         const tasks = Array.isArray(response?.data)
//         ? response.data
//         : Array.isArray(response?.tasks)
//             ? response.tasks
//             : [];

//         return {
//         status: response?.status ?? "success",
//         count: response?.pagination?.total ?? response?.count ?? tasks.length,
//         tasks,
//         pagination: response?.pagination,
//         };
//     },

//     providesTags: (result) => [
//         { type: "TaskList", id: "LIST" },
//         ...(result?.tasks ?? []).map((task) => ({
//         type: "Task" as const,
//         id: task.id,
//         })),
//     ],
//     }),

    
//     //For Admin 
//     getAssignedByMe: builder.query<MyTasksResponse, GetMyTasksParams | void>({
//         query: (arg) => {
//             const params: Record<string, string | number> = {};

//             if (arg?.page !== undefined) params.page = arg.page;
//             if (arg?.limit !== undefined) params.limit = arg.limit;

//             const search = arg?.search?.trim();
//             if (search) params.search = search;

//             if (arg?.status) params.status = arg.status;

//             return {
//             url: "/tasks/assigned-by-me",
//             params,
//             };
//         },

//         transformResponse: (
//             response: RawMyTasksResponse
//         ): MyTasksResponse => {
//             const tasks = Array.isArray(response?.data)
//             ? response.data
//             : Array.isArray(response?.tasks)
//                 ? response.tasks
//                 : [];

//             return {
//             status: response?.status ?? "success",
//             count: response?.pagination?.total ?? response?.count ?? tasks.length,
//             tasks,
//             pagination: response?.pagination,
//             };
//         },

//         providesTags: (result) => [
//             { type: "TaskList", id: "ASSIGNED_BY_ME" },
//             ...(result?.tasks ?? []).map((task) => ({
//             type: "Task" as const,
//             id: task.id,
//             })),
//         ],
//         }),

//     // GET /tasks/:id
//     getTaskById: builder.query<TaskDetailsResponse, string>({
//       query: (taskId) => `/tasks/${encodeURIComponent(taskId)}`,
//       providesTags: (_result, _error, taskId) => [{ type: "Task", id: taskId }],
//     }),

//     // GET /tasks/:id/submissions
//     getTaskSubmissions: builder.query<TaskSubmissionsResponse, string>({
//       query: (taskId) => `/tasks/${encodeURIComponent(taskId)}/submissions`,
//       providesTags: (_result, _error, taskId) => [
//         { type: "TaskSubmissions", id: taskId },
//       ],
//     }),

//     // GET /tasks/:id/history
//     getTaskHistory: builder.query<TaskHistoryResponse, string>({
//       query: (taskId) => `/tasks/${encodeURIComponent(taskId)}/history`,
//       providesTags: (_result, _error, taskId) => [{ type: "TaskHistory", id: taskId }],
//     }),

//     // POST /tasks/:id/submissions
//     submitTaskCompletion: builder.mutation<
//       BasicStatusResponse & { submission?: TaskSubmission; task?: { id: string; status: TaskStatus } },
//       SubmitTaskRequest
//     >({
//       query: ({ taskId, completionNote }) => ({
//         url: `/tasks/${encodeURIComponent(taskId)}/submissions`,
//         method: "POST",
//         body: { completionNote },
//       }),
//       invalidatesTags: (_result, _error, { taskId }) => [
//         { type: "Task", id: taskId },
//         { type: "TaskList", id: "LIST" },
//         { type: "TaskList", id: "ASSIGNED_BY_ME" },
//         { type: "TaskSubmissions", id: taskId },
//         { type: "TaskHistory", id: taskId },
//       ],
//     }),

//     // POST /tasks/:id/reviews
//     reviewTaskSubmission: builder.mutation<
//       BasicStatusResponse,
//       ReviewTaskRequest
//     >({
//       query: ({ taskId, ...body }) => ({
//         url: `/tasks/${encodeURIComponent(taskId)}/reviews`,
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: (_result, _error, { taskId }) => [
//         { type: "Task", id: taskId },
//         { type: "TaskList", id: "LIST" },
//         { type: "TaskList", id: "ASSIGNED_BY_ME" },
//         { type: "TaskSubmissions", id: taskId },
//         { type: "TaskHistory", id: taskId },
//       ],
//     }),

//     // PATCH /tasks/:id/deadline
//     updateTaskDeadline: builder.mutation<BasicStatusResponse, UpdateTaskDeadlineRequest>({
//       query: ({ taskId, deadline, reason }) => ({
//         url: `/tasks/${encodeURIComponent(taskId)}/deadline`,
//         method: "PATCH",
//         body: { deadline, reason },
//       }),
//       invalidatesTags: (_result, _error, { taskId }) => [
//         { type: "Task", id: taskId },
//         { type: "TaskList", id: "LIST" },
//         { type: "TaskList", id: "ASSIGNED_BY_ME" },
//         { type: "TaskHistory", id: taskId },
//       ],
//     }),

//     // POST /tasks/intake with pasted text
//     analyzeTaskIntakeText: builder.mutation<TaskIntakeResponse, AnalyzeTaskTextRequest>({
//       query: ({ emailText }) => ({
//         url: "/tasks/intake",
//         method: "POST",
//         body: { emailText },
//       }),
//       invalidatesTags: [{ type: "TaskIntake", id: "LIST" }],
//     }),

//     // POST /tasks/intake with screenshot. Do not set Content-Type manually.
//     analyzeTaskIntakeImage: builder.mutation<TaskIntakeResponse, File>({
//       query: (file) => {
//         const formData = new FormData();
//         formData.append("file", file);
//         return {
//           url: "/tasks/intake",
//           method: "POST",
//           body: formData,
//         };
//       },
//       invalidatesTags: [{ type: "TaskIntake", id: "LIST" }],
//     }),

//     // GET /tasks/intake/:id
//     getTaskIntake: builder.query<GetTaskIntakeResponse, string>({
//       query: (analysisId) => `/tasks/intake/${encodeURIComponent(analysisId)}`,
//       providesTags: (_result, _error, analysisId) => [
//         { type: "TaskIntake", id: analysisId },
//       ],
//     }),

//     // POST /tasks/intake/:analysisId/proposals/:proposalId/recommend
//     recommendTaskEmployee: builder.mutation<
//       RecommendEmployeeResponse,
//       { analysisId: string; proposalId: string }
//     >({
//       query: ({ analysisId, proposalId }) => ({
//         url: `/tasks/intake/${encodeURIComponent(analysisId)}/proposals/${encodeURIComponent(proposalId)}/recommend`,
//         method: "POST",
//       }),
//       invalidatesTags: (_result, _error, { analysisId }) => [
//         { type: "TaskIntake", id: analysisId },
//       ],
//     }),

//     // POST /tasks/intake/:analysisId/proposals/:proposalId/draft
//     createTaskDraft: builder.mutation<CreateTaskDraftResponse, CreateTaskDraftRequest>({
//       query: ({ analysisId, proposalId, ...body }) => ({
//         url: `/tasks/intake/${encodeURIComponent(analysisId)}/proposals/${encodeURIComponent(proposalId)}/draft`,
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: (_result, _error, { analysisId }) => [
//         { type: "TaskIntake", id: analysisId },
//         { type: "TaskList", id: "LIST" },
//       ],
//     }),

//     // POST /tasks/intake/:analysisId/proposals/:proposalId/draft-and-confirm
//     createTaskDraftAndConfirm: builder.mutation<
//       CreateTaskDraftResponse,
//       CreateTaskDraftRequest
//     >({
//       query: ({ analysisId, proposalId, ...body }) => ({
//         url: `/tasks/intake/${encodeURIComponent(analysisId)}/proposals/${encodeURIComponent(proposalId)}/draft-and-confirm`,
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: (_result, _error, { analysisId }) => [
//         { type: "TaskIntake", id: analysisId },
//         { type: "TaskList", id: "LIST" },
//       ],
//     }),

//     // POST /tasks/email-drafts/:id/confirm-sent
//     confirmEmailDraftSent: builder.mutation<
//       BasicStatusResponse,
//       ConfirmEmailDraftRequest
//     >({
//       query: ({ draftId, note }) => ({
//         url: `/tasks/email-drafts/${encodeURIComponent(draftId)}/confirm-sent`,
//         method: "POST",
//         body: note ? { note } : {},
//       }),
//       invalidatesTags: [
//         { type: "TaskList", id: "LIST" },
//         { type: "TaskList", id: "ASSIGNED_BY_ME" },
//       ],
//     }),
//   }),
// });

// export const {
//   useGetMyTasksQuery,
//   useGetAssignedByMeQuery,
//   useGetTaskByIdQuery,
//   useGetTaskSubmissionsQuery,
//   useLazyGetTaskSubmissionsQuery,
//   useGetTaskHistoryQuery,
//   useSubmitTaskCompletionMutation,
//   useReviewTaskSubmissionMutation,
//   useUpdateTaskDeadlineMutation,
//   useAnalyzeTaskIntakeTextMutation,
//   useAnalyzeTaskIntakeImageMutation,
//   useGetTaskIntakeQuery,
//   useRecommendTaskEmployeeMutation,
//   useCreateTaskDraftMutation,
//   useCreateTaskDraftAndConfirmMutation,
//   useConfirmEmailDraftSentMutation,
// } = tasksApi;




import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

/**
 * Tasks API based on tasks-api-frontend-handoff.md
 *
 * Configure NEXT_PUBLIC_API_URL as the backend origin, e.g. http://localhost:5000
 * Do not include /tasks in NEXT_PUBLIC_API_URL because endpoint paths below
 * already include /tasks.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("userToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    // fetchBaseQuery sets JSON content type for JSON bodies as needed.
    // Do not set Content-Type manually for FormData uploads.
    return headers;
  },
});

export type TaskStatus =
  | "READY_TO_DISPATCH"
  | "IN_PROGRESS"
  | "DISPATCHED"
  | "SUBMITTED"
  | "COMPLETED"
  | "REWORK"
  | "CANCELLED";

export type IntakeStatus = "NO_TASKS" | "NEEDS_REVIEW" | "COMPLETED";

export type ProposalStatus =
  | "NEEDS_REVIEW"
  | "DRAFT"
  | "TASK_CREATED"
  | "REJECTED";

export interface TaskPerson {
  id: string;
  fullName: string;
  email?: string;
}

export interface TaskTeam {
  id: string;
  name: string;
}

export interface TaskRecord {
  id: string;
  title: string;
  description?: string | null;
  deadline: string;
  status: TaskStatus;
  assignee?: TaskPerson | null;
  createdBy?: TaskPerson | null;
  team?: TaskTeam | null;
  _count?: {
    submissions: number;
    reviews: number;
  };
  [key: string]: unknown;
}

export interface TasksPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Normalized response used by the UI.
 * The backend currently returns tasks in `data` and pagination metadata,
 * while older endpoints may return them in `tasks`.
 */
export interface GetMyTasksParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TaskStatus | string;
}


export interface GetAllTasksParams {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  status?: TaskStatus | string;
  teamId?: string;
  userId?: string;
}

export interface AllTasksPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface AllTasksResponse {
  status: string;
  data: TaskRecord[];
  count: number;
  pagination?: AllTasksPagination;
}

interface RawAllTasksResponse {
  status?: string;
  data?: Array<TaskRecord & {
    teamId?: string | null;
    teamName?: string | null;
    createdById?: string | null;
    createdByName?: string | null;
    assigneeId?: string | null;
    assigneeName?: string | null;
  }>;
  pagination?: AllTasksPagination;
}

export interface MyTasksResponse {
  status: string;
  count: number;
  tasks: TaskRecord[];
  pagination?: TasksPagination;
}

interface RawMyTasksResponse {
  status?: string;
  count?: number;
  tasks?: TaskRecord[];
  data?: TaskRecord[];
  pagination?: TasksPagination;
}

export interface TaskSubmission {
  id: string;
  completionNote?: string;
  createdAt?: string;
  submitter?: TaskPerson;
  reviews?: TaskReview[];
  attachments?: unknown[];
  [key: string]: unknown;
}

export interface TaskReview {
  id?: string;
  decision: "APPROVE" | "REWORK";
  feedback?: string | null;
  reviewer?: TaskPerson;
  [key: string]: unknown;
}

export interface TaskDetailsResponse {
  task: TaskRecord;
  submissions: TaskSubmission[];
  events: unknown[];
  deadlineChanges: unknown[];
}

export interface TaskSubmissionsResponse {
  status: string;
  taskId: string;
  submissions: TaskSubmission[];
}

export interface TaskHistoryResponse {
  status: string;
  taskId: string;
  events: unknown[];
  deadlineChanges: unknown[];
  reviews: TaskReview[];
}

export interface BasicStatusResponse {
  status: string;
  message?: string;
  [key: string]: unknown;
}

export interface SubmitTaskRequest {
  taskId: string;
  completionNote: string;
}

export interface ReviewTaskRequest {
  taskId: string;
  submissionId: string;
  decision: "APPROVE" | "REWORK";
  feedback?: string;
}

export interface UpdateTaskDeadlineRequest {
  taskId: string;
  deadline: string;
  reason: string;
}

export interface TaskProposal {
  proposalId: string;
  title: string;
  description?: string | null;
  predictedJobTitle?: string | null;
  predictionStatus?: string;
  predictionReason?: string | null;
  suggestedDeadline?: string | null;
  status?: ProposalStatus;
  recommendation?: {
    userId: string;
    displayName: string;
    email?: string;
    jobTitle?: string;
    role?: string;
    hierarchyLevel?: number;
    workload?: Record<string, unknown>;
  } | null;
  recommendationMessage?: string | null;
  [key: string]: unknown;
}

export interface TaskIntakeResponse {
  status: string;
  analysisId: string;
  analysis?: {
    id: string;
    source?: string;
    analysisStatus?: IntakeStatus;
    createdAt?: string;
    [key: string]: unknown;
  };
  taskCount?: number;
  proposals: TaskProposal[];
  [key: string]: unknown;
}

export interface AnalyzeTaskTextRequest {
  emailText: string;
}

export interface GetTaskIntakeResponse {
  status?: string;
  analysis?: Record<string, unknown>;
  proposals: TaskProposal[];
  [key: string]: unknown;
}

export interface RecommendEmployeeResponse {
  status?: string;
  proposal?: TaskProposal;
  recommendation?: TaskProposal["recommendation"];
  [key: string]: unknown;
}

export interface CreateTaskDraftRequest {
  analysisId: string;
  proposalId: string;
  assigneeId: string;
  title: string;
  description?: string;
  deadline: string;
  emailSubject: string;
  emailBody: string;
}

export interface CreateTaskDraftResponse {
  status?: string;
  task: TaskRecord;
  emailDraft: {
    id: string;
    subject: string;
    body: string;
    status: string;
    recipient?: string;
    [key: string]: unknown;
  };
  selection?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ConfirmEmailDraftRequest {
  draftId: string;
  note?: string;
}

export const tasksApi = createApi({
  reducerPath: "tasksApi",
  baseQuery,
  tagTypes: ["Task", "TaskList", "TaskIntake", "TaskSubmissions", "TaskHistory"],
  endpoints: (builder) => ({
    // GET /api/tasks/all?page=1&limit=20&from=...&to=...&status=...&teamId=...&userId=...
    getAllTasks: builder.query<AllTasksResponse, GetAllTasksParams | void>({
      query: (arg) => {
        const params: Record<string, string | number> = {};

        if (arg?.page !== undefined) params.page = arg.page;
        if (arg?.limit !== undefined) params.limit = arg.limit;
        if (arg?.from) params.from = arg.from;
        if (arg?.to) params.to = arg.to;
        if (arg?.status) params.status = arg.status;
        if (arg?.teamId) params.teamId = arg.teamId;
        if (arg?.userId) params.userId = arg.userId;

        return { url: "/tasks/all", params };
      },
      transformResponse: (response: RawAllTasksResponse): AllTasksResponse => {
        const tasks = (response?.data ?? []).map((task) => ({
          ...task,
          team: task.teamId
            ? { id: task.teamId, name: task.teamName ?? "" }
            : task.team ?? null,
          assignee: task.assigneeId
            ? { id: task.assigneeId, fullName: task.assigneeName ?? "" }
            : task.assignee ?? null,
          createdBy: task.createdById
            ? { id: task.createdById, fullName: task.createdByName ?? "" }
            : task.createdBy ?? null,
        }));

        return {
          status: response?.status ?? "success",
          data: tasks,
          count: response?.pagination?.totalItems ?? tasks.length,
          pagination: response?.pagination,
        };
      },
      providesTags: (result) => [
        { type: "TaskList", id: "LIST" },
        ...(result?.data ?? []).map((task) => ({
          type: "Task" as const,
          id: task.id,
        })),
      ],
    }),

    // GET /api/tasks/my-tasks?page=1&limit=10&search=...
    // The backend should search both title and description for the `search` parameter.
    getMyTasks: builder.query<MyTasksResponse, GetMyTasksParams | void>({
      query: (arg) => {
        const params: Record<string, string | number> = {};

        if (arg?.page !== undefined) params.page = arg.page;
        if (arg?.limit !== undefined) params.limit = arg.limit;

        const search = arg?.search?.trim();
        if (search) params.search = search;
        if (arg?.status) params.status = arg.status;

        return { url: "/tasks/my-tasks", params };
      },
      transformResponse: (response: RawMyTasksResponse): MyTasksResponse => {
        const tasks = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.tasks)
            ? response.tasks
            : [];

        return {
          status: response?.status ?? "success",
          count: response?.pagination?.total ?? response?.count ?? tasks.length,
          tasks,
          pagination: response?.pagination,
        };
      },
      providesTags: (result) => [
        { type: "TaskList", id: "LIST" },
        ...(result?.tasks ?? []).map((task) => ({ type: "Task" as const, id: task.id })),
      ],
    }),

    // GET /api/tasks/assigned-by-me?page=1&limit=10&search=...
    getAssignedByMe: builder.query<MyTasksResponse, GetMyTasksParams | void>({
      query: (arg) => {
        const params: Record<string, string | number> = {};

        if (arg?.page !== undefined) params.page = arg.page;
        if (arg?.limit !== undefined) params.limit = arg.limit;

        const search = arg?.search?.trim();
        if (search) params.search = search;
        if (arg?.status) params.status = arg.status;

        return { url: "/tasks/assigned-by-me", params };
      },
      transformResponse: (response: RawMyTasksResponse): MyTasksResponse => {
        const tasks = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.tasks)
            ? response.tasks
            : [];

        return {
          status: response?.status ?? "success",
          count: response?.pagination?.total ?? response?.count ?? tasks.length,
          tasks,
          pagination: response?.pagination,
        };
      },
      providesTags: (result) => [
        // Shared LIST tag means task mutations refresh both my-tasks and assigned-by-me.
        { type: "TaskList", id: "LIST" },
        ...(result?.tasks ?? []).map((task) => ({ type: "Task" as const, id: task.id })),
      ],
    }),

    // GET /tasks/:id
    getTaskById: builder.query<TaskDetailsResponse, string>({
      query: (taskId) => `/tasks/${encodeURIComponent(taskId)}`,
      providesTags: (_result, _error, taskId) => [{ type: "Task", id: taskId }],
    }),

    // GET /tasks/:id/submissions
    getTaskSubmissions: builder.query<TaskSubmissionsResponse, string>({
      query: (taskId) => `/tasks/${encodeURIComponent(taskId)}/submissions`,
      providesTags: (_result, _error, taskId) => [
        { type: "TaskSubmissions", id: taskId },
      ],
    }),

    // GET /tasks/:id/history
    getTaskHistory: builder.query<TaskHistoryResponse, string>({
      query: (taskId) => `/tasks/${encodeURIComponent(taskId)}/history`,
      providesTags: (_result, _error, taskId) => [{ type: "TaskHistory", id: taskId }],
    }),

    // POST /tasks/:id/submissions
    submitTaskCompletion: builder.mutation<
      BasicStatusResponse & { submission?: TaskSubmission; task?: { id: string; status: TaskStatus } },
      SubmitTaskRequest
    >({
      query: ({ taskId, completionNote }) => ({
        url: `/tasks/${encodeURIComponent(taskId)}/submissions`,
        method: "POST",
        body: { completionNote },
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Task", id: taskId },
        { type: "TaskList", id: "LIST" },
        { type: "TaskSubmissions", id: taskId },
        { type: "TaskHistory", id: taskId },
      ],
    }),

    // POST /tasks/:id/reviews
    reviewTaskSubmission: builder.mutation<
      BasicStatusResponse,
      ReviewTaskRequest
    >({
      query: ({ taskId, ...body }) => ({
        url: `/tasks/${encodeURIComponent(taskId)}/reviews`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Task", id: taskId },
        { type: "TaskList", id: "LIST" },
        { type: "TaskSubmissions", id: taskId },
        { type: "TaskHistory", id: taskId },
      ],
    }),

    // PATCH /tasks/:id/deadline
    updateTaskDeadline: builder.mutation<BasicStatusResponse, UpdateTaskDeadlineRequest>({
      query: ({ taskId, deadline, reason }) => ({
        url: `/tasks/${encodeURIComponent(taskId)}/deadline`,
        method: "PATCH",
        body: { deadline, reason },
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Task", id: taskId },
        { type: "TaskList", id: "LIST" },
        { type: "TaskHistory", id: taskId },
      ],
    }),

    // POST /tasks/intake with pasted text
    analyzeTaskIntakeText: builder.mutation<TaskIntakeResponse, AnalyzeTaskTextRequest>({
      query: ({ emailText }) => ({
        url: "/tasks/intake",
        method: "POST",
        body: { emailText },
      }),
      invalidatesTags: [{ type: "TaskIntake", id: "LIST" }],
    }),

    // POST /tasks/intake with screenshot. Do not set Content-Type manually.
    analyzeTaskIntakeImage: builder.mutation<TaskIntakeResponse, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: "/tasks/intake",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "TaskIntake", id: "LIST" }],
    }),

    // GET /tasks/intake/:id
    getTaskIntake: builder.query<GetTaskIntakeResponse, string>({
      query: (analysisId) => `/tasks/intake/${encodeURIComponent(analysisId)}`,
      providesTags: (_result, _error, analysisId) => [
        { type: "TaskIntake", id: analysisId },
      ],
    }),

    // POST /tasks/intake/:analysisId/proposals/:proposalId/recommend
    recommendTaskEmployee: builder.mutation<
      RecommendEmployeeResponse,
      { analysisId: string; proposalId: string }
    >({
      query: ({ analysisId, proposalId }) => ({
        url: `/tasks/intake/${encodeURIComponent(analysisId)}/proposals/${encodeURIComponent(proposalId)}/recommend`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, { analysisId }) => [
        { type: "TaskIntake", id: analysisId },
      ],
    }),

    // POST /tasks/intake/:analysisId/proposals/:proposalId/draft
    createTaskDraft: builder.mutation<CreateTaskDraftResponse, CreateTaskDraftRequest>({
      query: ({ analysisId, proposalId, ...body }) => ({
        url: `/tasks/intake/${encodeURIComponent(analysisId)}/proposals/${encodeURIComponent(proposalId)}/draft`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { analysisId }) => [
        { type: "TaskIntake", id: analysisId },
        { type: "TaskList", id: "LIST" },
      ],
    }),

    // POST /tasks/intake/:analysisId/proposals/:proposalId/draft-and-confirm
    createTaskDraftAndConfirm: builder.mutation<
      CreateTaskDraftResponse,
      CreateTaskDraftRequest
    >({
      query: ({ analysisId, proposalId, ...body }) => ({
        url: `/tasks/intake/${encodeURIComponent(analysisId)}/proposals/${encodeURIComponent(proposalId)}/draft-and-confirm`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { analysisId }) => [
        { type: "TaskIntake", id: analysisId },
        { type: "TaskList", id: "LIST" },
      ],
    }),

    // POST /tasks/email-drafts/:id/confirm-sent
    confirmEmailDraftSent: builder.mutation<
      BasicStatusResponse,
      ConfirmEmailDraftRequest
    >({
      query: ({ draftId, note }) => ({
        url: `/tasks/email-drafts/${encodeURIComponent(draftId)}/confirm-sent`,
        method: "POST",
        body: note ? { note } : {},
      }),
      invalidatesTags: [{ type: "TaskList", id: "LIST" }],
    }),
  }),
});

export const {
  useGetMyTasksQuery,
  useGetAllTasksQuery,
  useGetAssignedByMeQuery,
  useGetTaskByIdQuery,
  useGetTaskSubmissionsQuery,
  useLazyGetTaskSubmissionsQuery,
  useGetTaskHistoryQuery,
  useSubmitTaskCompletionMutation,
  useReviewTaskSubmissionMutation,
  useUpdateTaskDeadlineMutation,
  useAnalyzeTaskIntakeTextMutation,
  useAnalyzeTaskIntakeImageMutation,
  useGetTaskIntakeQuery,
  useRecommendTaskEmployeeMutation,
  useCreateTaskDraftMutation,
  useCreateTaskDraftAndConfirmMutation,
  useConfirmEmailDraftSentMutation,
} = tasksApi;
