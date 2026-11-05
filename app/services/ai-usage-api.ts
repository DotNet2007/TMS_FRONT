import { teamMembersApi } from "./team-members-api";


import { UsageQueryParams, UsageResponse } from "../interfaces/ai-usage-interface";
import { buildUsageQueryString } from "../utils/ai-usage-helper";


export const aiUsageApi = teamMembersApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiUsage: builder.query<UsageResponse, UsageQueryParams>({
      query: (params) => ({
        url: `/ai-usage?${buildUsageQueryString(params)}`,
        method: "GET",
      }),
      // The cache is keyed by period, page, limit, and applied filters.
      keepUnusedDataFor: 300,
    }),
  }),
  overrideExisting: false,
});

export const { useGetAiUsageQuery } = aiUsageApi;
