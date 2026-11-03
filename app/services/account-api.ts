import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { IProfile } from "../interfaces/profile-interface";

export const accountApi = createApi({
  reducerPath: "accountApi",

  baseQuery: fetchBaseQuery({
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

  tagTypes: ["Account"],

  endpoints: (builder) => ({
    getProfile: builder.query<IProfile, void>({
      query: () => "/auth/me",
      providesTags: ["Account"],
    }),

    updateProfile: builder.mutation<IProfile, Partial<IProfile>>({
      query: (body) => ({
        url: "/account/profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Account"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
} = accountApi;