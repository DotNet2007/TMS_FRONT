import { TasksDashboardResponse } from "../interfaces/dashboard-interface";
import { teamMembersApi } from "./team-members-api";



export const tasksDashboardApi = teamMembersApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasksDashboard: builder.query<TasksDashboardResponse, void>({
      query: () => ({
        url: "/tasks/dashboard",
        method: "GET",
      }),

      providesTags: ["TasksDashboard"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetTasksDashboardQuery,
  useLazyGetTasksDashboardQuery,
} = tasksDashboardApi;