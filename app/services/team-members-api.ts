
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import type { ITeamMemberResponseDetails, ITeamMembersResponse } from "../interfaces/team-interface";

// export const teamMembersApi = createApi({
//   reducerPath: "teamMembersApi",

//   baseQuery: fetchBaseQuery({
//     baseUrl: process.env.NEXT_PUBLIC_API_URL,

//     prepareHeaders: (headers) => {
//       if (typeof window !== "undefined") {
//         const token = localStorage.getItem("userToken");

//         if (token) {
//           headers.set("Authorization", `Bearer ${token}`);
//         }
//       }

//       return headers;
//     },
//   }),

//   tagTypes: ["TeamMembers"],

//   endpoints: (builder) => ({
//     getUsers: builder.query<ITeamMembersResponse, void>({
//       query: () => "/users", 
//       providesTags: ["TeamMembers"],
//     }),

//     getUserById: builder.query<ITeamMemberResponseDetails, string>({
//       query: (id) => `users/${id}`,
//       providesTags: (_result, _error, id) => [
//         { type: "Users", id },
//       ],
//     }),
//   }),
// });

// export const { useGetUsersQuery } = teamMembersApi;




// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import type {
//   ITeamMemberResponseDetails,
//   ITeamMembersResponse,
// } from "../interfaces/team-interface";

// export const teamMembersApi = createApi({
//   reducerPath: "teamMembersApi",

//   baseQuery: fetchBaseQuery({
//     baseUrl: process.env.NEXT_PUBLIC_API_URL,

//     prepareHeaders: (headers) => {
//       if (typeof window !== "undefined") {
//         const token = localStorage.getItem("userToken");

//         if (token) {
//           headers.set("Authorization", `Bearer ${token}`);
//         }
//       }

//       return headers;
//     },
//   }),

//   tagTypes: ["TeamMembers", "Users"],

//   endpoints: (builder) => ({
//     getUsers: builder.query<ITeamMembersResponse, void>({
//       query: () => "/users",
//       providesTags: ["TeamMembers"],
//     }),

//     getUserById: builder.query<ITeamMemberResponseDetails, string>({
//       query: (id) => `/users/${id}`,
//       providesTags: (_result, _error, id) => [
//         { type: "Users", id },
//       ],
//     }),
//   }),
// });

// export const {
//   useGetUsersQuery,
//   useGetUserByIdQuery,
// } = teamMembersApi;





// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import type { ITeamMemberResponseDetails, ITeamMembersResponse } from "../interfaces/team-interface";

// export const teamMembersApi = createApi({
//   reducerPath: "teamMembersApi",

//   baseQuery: fetchBaseQuery({
//     baseUrl: process.env.NEXT_PUBLIC_API_URL,

//     prepareHeaders: (headers) => {
//       if (typeof window !== "undefined") {
//         const token = localStorage.getItem("userToken");

//         if (token) {
//           headers.set("Authorization", `Bearer ${token}`);
//         }
//       }

//       return headers;
//     },
//   }),

//   tagTypes: ["TeamMembers"],

//   endpoints: (builder) => ({
//     getUsers: builder.query<ITeamMembersResponse, void>({
//       query: () => "/users", 
//       providesTags: ["TeamMembers"],
//     }),

//     getUserById: builder.query<ITeamMemberResponseDetails, string>({
//       query: (id) => `users/${id}`,
//       providesTags: (_result, _error, id) => [
//         { type: "Users", id },
//       ],
//     }),
//   }),
// });

// export const { useGetUsersQuery } = teamMembersApi;




// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import type {
//   ITeamMemberResponseDetails,
//   ITeamMembersResponse,
// } from "../interfaces/team-interface";

// export const teamMembersApi = createApi({
//   reducerPath: "teamMembersApi",

//   baseQuery: fetchBaseQuery({
//     baseUrl: process.env.NEXT_PUBLIC_API_URL,

//     prepareHeaders: (headers) => {
//       if (typeof window !== "undefined") {
//         const token = localStorage.getItem("userToken");

//         if (token) {
//           headers.set("Authorization", `Bearer ${token}`);
//         }
//       }

//       return headers;
//     },
//   }),

//   tagTypes: ["TeamMembers", "Users"],

//   endpoints: (builder) => ({
//     getUsers: builder.query<ITeamMembersResponse, void>({
//       query: () => "/users",
//       providesTags: ["TeamMembers"],
//     }),

//     getUserById: builder.query<ITeamMemberResponseDetails, string>({
//       query: (id) => `/users/${id}`,
//       providesTags: (_result, _error, id) => [
//         { type: "Users", id },
//       ],
//     }),
//   }),
// });

// export const {
//   useGetUsersQuery,
//   useGetUserByIdQuery,
// } = teamMembersApi;




import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type {
  ITeamMemberResponseDetails,
  ITeamMembersResponse,
} from "../interfaces/team-interface";

// Add or adjust these imports to match your project interfaces.

export interface ITeam {
  id: string;
  name: string;
  description?: string | null;
  supervisorId?: string | null;
  isActive?: boolean;
  [key: string]: unknown;
}

export interface ITeamMembership {
  id: string;
  teamId?: string;
  userId?: string;
  endedAt?: string | null;
  [key: string]: unknown;
}

export interface IAdminUser {
  id: string;
  fullName: string;
  email: string;
  roleId?: string;
  jobTitleId?: string | null;
  isActive?: boolean;
  [key: string]: unknown;
}

export interface IJobTitle {
  id: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
  [key: string]: unknown;
}

// ==================== ROLES ====================
export interface IRole {
  id: string;
  code: string;
  name: string;
  hierarchyLevel: number;
  [key: string]: unknown;
}

export interface ICreateRole {
  code: string;
  name: string;
  hierarchyLevel: number;
}

export interface IUpdateRole {
  id: string;
  code?: string;
  name?: string;
  hierarchyLevel?: number;
}

export interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IPaginatedResponse<T> {
  data: T[];
  pagination: IPagination;
}

export interface IListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ICreateTeam {
  name: string;
  description?: string;
  supervisorId: string;
}

export interface IUpdateTeam {
  id: string;
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface IChangeSupervisor {
  teamId: string;
  supervisorId: string;
}

export interface IAddTeamMember {
  teamId: string;
  userId: string;
}

export interface IEndMembership {
  teamId: string;
  membershipId: string;
}

export interface IListUsersParams extends IListParams {
  search?: string;
  role?: string;
  jobTitleId?: string;
  isActive?: boolean;
}

export interface ICreateAdminUser {
  fullName: string;
  email: string;
  password: string;
  roleId: string;
  jobTitleId?: string | null;
}

export interface IUpdateAdminUser {
  id: string;
  fullName?: string;
  email?: string;
  roleId?: string;
  jobTitleId?: string | null;
}

export interface IListJobTitlesParams extends IListParams {
  activeOnly?: boolean;
}

export interface ICreateJobTitle {
  name: string;
  description?: string;
}

export interface IUpdateJobTitle {
  id: string;
  name?: string;
  description?: string | null;
  isActive?: boolean;
}

type IListResponse<T> = IPaginatedResponse<T> | T[];

export const teamMembersApi = createApi({
  reducerPath: "teamMembersApi",

  baseQuery: fetchBaseQuery({
    // Assumes NEXT_PUBLIC_API_URL already includes /api,
    // matching your existing API configuration.
    baseUrl: process.env.NEXT_PUBLIC_API_URL,

    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("userToken");

        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }

      headers.set("ngrok-skip-browser-warning", "true");

      return headers;
    },
  }),

  tagTypes: ["TeamMembers", "Users", "Teams", "Memberships", "JobTitles", "Roles", "TasksDashboard"],

  endpoints: (builder) => ({
    // ==================== EXISTING USERS ====================

    getUsers: builder.query<ITeamMembersResponse, Pick<IListUsersParams, "search" | "page" | "limit"> | void>({
      query: (params) => ({
        url: "/users",
        params: params ?? {},
      }),
      providesTags: ["TeamMembers", "Users"],
    }),

    getUserById: builder.query<ITeamMemberResponseDetails, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [
        { type: "Users", id },
      ],
    }),

    // ==================== TEAMS ====================

    getTeams: builder.query<IListResponse<ITeam>, IListParams | void>({
      query: (params) => ({
        url: "/teams",
        params: params ?? {},
      }),
      providesTags: ["Teams"],
    }),

    getTeamById: builder.query<ITeam, string>({
      query: (id) => `/teams/${id}`,
      providesTags: (_result, _error, id) => [
        { type: "Teams", id },
      ],
    }),

    createTeam: builder.mutation<ITeam, ICreateTeam>({
      query: (body) => ({
        url: "/teams",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Teams"],
    }),

    updateTeam: builder.mutation<ITeam, IUpdateTeam>({
      query: ({ id, ...body }) => ({
        url: `/teams/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Teams",
        { type: "Teams", id },
      ],
    }),

    changeTeamSupervisor: builder.mutation<ITeam, IChangeSupervisor>({
      query: ({ teamId, supervisorId }) => ({
        url: `/teams/${teamId}/supervisor`,
        method: "PATCH",
        body: { supervisorId },
      }),
      invalidatesTags: ["Teams"],
    }),

    // ==================== TEAM MEMBERSHIPS ====================

    getTeamMemberships: builder.query<IListResponse<ITeamMembership>, { teamId: string; history?: boolean; search?: string }>({
      query: ({ teamId, history, search }) => ({
        url: `/teams/${teamId}/memberships`,
        params: {
          ...(history ? { history: true } : {}),
          ...(search ? { search } : {}),
        },
      }),
      providesTags: (_result, _error, { teamId }) => [
        { type: "Memberships", id: teamId },
      ],
    }),

    addTeamMember: builder.mutation<ITeamMembership, IAddTeamMember>({
      query: ({ teamId, userId }) => ({
        url: `/teams/${teamId}/memberships`,
        method: "POST",
        body: { userId },
      }),
      invalidatesTags: (_result, _error, { teamId }) => [
        { type: "Memberships", id: teamId },
        "Teams",
        "Users",
        "TeamMembers",
      ],
    }),

    endTeamMembership: builder.mutation<void, IEndMembership>({
      query: ({ teamId, membershipId }) => ({
        url: `/teams/${teamId}/memberships/${membershipId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { teamId }) => [
        { type: "Memberships", id: teamId },
        "Teams",
        "Users",
        "TeamMembers",
      ],
    }),

    // ==================== ADMIN USERS CRUD ====================

    getAdminUsers: builder.query<IListResponse<IAdminUser>, IListUsersParams | void>({
      query: (params) => ({
        url: "/users",
        params: params ?? {},
      }),
      providesTags: ["Users"],
    }),

    getAdminUserById: builder.query<IAdminUser, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [
        { type: "Users", id },
      ],
    }),

    createAdminUser: builder.mutation<IAdminUser, ICreateAdminUser>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users", "TeamMembers"],
    }),

    updateAdminUser: builder.mutation<IAdminUser, IUpdateAdminUser>({
      query: ({ id, ...body }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Users",
        "TeamMembers",
        { type: "Users", id },
      ],
    }),

    deactivateAdminUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}/deactivate`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        "Users",
        "TeamMembers",
        { type: "Users", id },
      ],
    }),

    reactivateAdminUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}/reactivate`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        "Users",
        "TeamMembers",
        { type: "Users", id },
      ],
    }),

    // ==================== ROLES ====================

    // GET /api/roles?page=1&limit=20
    getRoles: builder.query<IListResponse<IRole>, IListParams | void>({
      query: (params) => ({
        url: "/roles",
        params: params ?? { page: 1, limit: 20 },
      }),
      providesTags: ["Roles"],
    }),

    // GET /api/roles/:id (includes assigned-user count)
    getRoleById: builder.query<IRole, string>({
      query: (id) => `/roles/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Roles", id }],
    }),

    // POST /api/roles — Super Supervisor only
    createRole: builder.mutation<IRole, ICreateRole>({
      query: (body) => ({
        url: "/roles",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Roles"],
    }),

    // PATCH /api/roles/:id — Super Supervisor only
    updateRole: builder.mutation<IRole, IUpdateRole>({
      query: ({ id, ...body }) => ({
        url: `/roles/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Roles",
        { type: "Roles", id },
      ],
    }),

    // DELETE /api/roles/:id — fails if users are assigned
    deleteRole: builder.mutation<void, string>({
      query: (id) => ({
        url: `/roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        "Roles",
        { type: "Roles", id },
      ],
    }),

    // ==================== JOB TITLES ====================

    getJobTitles: builder.query<IListResponse<IJobTitle>, IListJobTitlesParams | void>({
      query: (params) => ({
        url: "/job-titles",
        params: params ?? {},
      }),
      providesTags: ["JobTitles"],
    }),

    getJobTitleById: builder.query<IJobTitle, string>({
      query: (id) => `/job-titles/${id}`,
      providesTags: (_result, _error, id) => [
        { type: "JobTitles", id },
      ],
    }),

    createJobTitle: builder.mutation<IJobTitle, ICreateJobTitle>({
      query: (body) => ({
        url: "/job-titles",
        method: "POST",
        body,
      }),
      invalidatesTags: ["JobTitles"],
    }),

    updateJobTitle: builder.mutation<IJobTitle, IUpdateJobTitle>({
      query: ({ id, ...body }) => ({
        url: `/job-titles/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "JobTitles",
        { type: "JobTitles", id },
      ],
    }),
  }),
});

export const {
  // Existing hooks
  useGetUsersQuery,
  useGetUserByIdQuery,

  // Teams
  useGetTeamsQuery,
  useGetTeamByIdQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useChangeTeamSupervisorMutation,

  // Memberships
  useGetTeamMembershipsQuery,
  useAddTeamMemberMutation,
  useEndTeamMembershipMutation,

  // Admin users
  useGetAdminUsersQuery,
  useGetAdminUserByIdQuery,
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useDeactivateAdminUserMutation,
  useReactivateAdminUserMutation,

  // Roles
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,

  // Job titles
  useGetJobTitlesQuery,
  useGetJobTitleByIdQuery,
  useCreateJobTitleMutation,
  useUpdateJobTitleMutation,
} = teamMembersApi;
