// import { teamMembersApi } from "./team-members-api";


// export type TaskIntakeRequest =
//   | { emailText: string; file?: never }
//   | { file: File; emailText?: never };

// export const taskIntakeApi = teamMembersApi.injectEndpoints({
//   endpoints: (builder) => ({
//     analyzeTaskIntake: builder.mutation<unknown, TaskIntakeRequest>({
//       query: (input) => {
//         if ("file" in input && input.file) {
//             const formData = new FormData();
//             formData.append("file", input.file);

//             return {
//                 url: "/tasks/intake",
//                 method: "POST",
//                 body: formData,
//             };
//         }

//         return {
//           url: "/tasks/intake",
//           method: "POST",
//           body: { emailText: input.emailText },
//         };
//       },
//     }),
//     getTaskIntake: builder.mutation<unknown, string>({
//       query: (analysisId) => ({
//         url: `/tasks/intake/${encodeURIComponent(analysisId)}`,
//         method: "GET",
//       }),
//     }),
//     requestTaskRecommendation: builder.mutation<unknown, { analysisId: string; proposalId: string }>({
//       query: ({ analysisId, proposalId }) => ({
//         url: `/tasks/intake/${encodeURIComponent(analysisId)}/proposals/${encodeURIComponent(proposalId)}/recommend`,
//         method: "POST",
//       }),
//     }),
//   }),
//   overrideExisting: false,
// });

// export const {
//   useAnalyzeTaskIntakeMutation,
//   useGetTaskIntakeMutation: useGetTaskIntakeQueryMutation,
//   useRequestTaskRecommendationMutation,
// } = taskIntakeApi;





import { teamMembersApi } from "./team-members-api";

export type TaskIntakeRequest =
  | { emailText: string; file?: never }
  | { file: File; emailText?: never };

export interface TaskDraftRequest {
  assigneeId: string;
  title: string;
  description: string;
  deadline: string | null;
  emailSubject: string;
  emailBody: string;
}

export interface TaskRecommendationRequest {
  analysisId: string;
  proposalId: string;
}

export interface CreateTaskDraftRequest extends TaskRecommendationRequest {
  draft: TaskDraftRequest;
}

export const taskIntakeApi = teamMembersApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Analyze email text or image
    analyzeTaskIntake: builder.mutation<unknown, TaskIntakeRequest>({
      query: (input) => {
        if ("file" in input && input.file) {
          const formData = new FormData();
          formData.append("file", input.file);

          return {
            url: "/tasks/intake",
            method: "POST",
            body: formData,
          };
        }

        return {
          url: "/tasks/intake",
          method: "POST",
          body: { emailText: input.emailText },
        };
      },
    }),

    // 2. Retrieve a saved analysis
    getTaskIntake: builder.query<unknown, string>({
      query: (analysisId) => ({
        url: `/tasks/intake/${encodeURIComponent(analysisId)}`,
        method: "GET",
      }),
    }),

    // 3. Request/recalculate an employee recommendation
    requestTaskRecommendation: builder.mutation<
      unknown,
      TaskRecommendationRequest
    >({
      query: ({ analysisId, proposalId }) => ({
        url: `/tasks/intake/${encodeURIComponent(
          analysisId
        )}/proposals/${encodeURIComponent(proposalId)}/recommend`,
        method: "POST",
      }),
    }),

    // 4. Create the task and email draft after supervisor review
    // createTaskDraft: builder.mutation<unknown, CreateTaskDraftRequest>({
    //   query: ({ analysisId, proposalId, draft }) => ({
    //     url: `/tasks/intake/${encodeURIComponent(
    //       analysisId
    //     )}/proposals/${encodeURIComponent(proposalId)}/draft`,
    //     method: "POST",
    //     body: draft,
    //   }),
    // }),

    // 5. Create task/draft and confirm dispatch
    createTaskDraftAndConfirm: builder.mutation<
      unknown,
      CreateTaskDraftRequest
    >({
      query: ({ analysisId, proposalId, draft }) => ({
        url: `/tasks/intake/${encodeURIComponent(
          analysisId
        )}/proposals/${encodeURIComponent(
          proposalId
        )}/draft-and-confirm`,
        method: "POST",
        body: draft,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useAnalyzeTaskIntakeMutation,
  useGetTaskIntakeQuery,
  useLazyGetTaskIntakeQuery,
  useRequestTaskRecommendationMutation,
  // useCreateTaskDraftMutation,
  useCreateTaskDraftAndConfirmMutation,
} = taskIntakeApi;
