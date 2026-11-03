import { teamMembersApi } from "./team-members-api";


export type ApiNotification = {
  id: string | number;
  title?: string | null;
  message?: string | null;
  body?: string | null;
  content?: string | null;
  description?: string | null;
  type?: string | null;
  created_at?: string | null;
  createdAt?: string | null;
  is_read?: boolean;
  isRead?: boolean;
  read_at?: string | null;
  readAt?: string | null;
  resourceType?: string | null;
  resourceId?: string | number | null;
  [key: string]: unknown;
};

export type NotificationsListResponse =
  | ApiNotification[]
  | { data?: ApiNotification[]; notifications?: ApiNotification[]; items?: ApiNotification[] };

export type UnreadCountResponse =
  | number
  | { count?: number; unreadCount?: number; unread_count?: number; data?: number | { count?: number } };

function extractNotifications(response: NotificationsListResponse): ApiNotification[] {
  if (Array.isArray(response)) return response;
  return response.data ?? response.notifications ?? response.items ?? [];
}

function extractUnreadCount(response: UnreadCountResponse): number {
  if (typeof response === "number") return response;
  if (typeof response.data === "number") return response.data;
  if (response.data && typeof response.data === "object") return response.data.count ?? 0;
  return response.unreadCount ?? response.unread_count ?? response.count ?? 0;
}

export const notificationsApi = teamMembersApi
  .enhanceEndpoints({ addTagTypes: ["Notification"] })
  .injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<ApiNotification[], { unreadOnly?: boolean } | void>({
      query: (arg) => ({
        url: "/notifications",
        method: "GET",
        params: arg?.unreadOnly ? { unreadOnly: true } : undefined,
      }),
      transformResponse: extractNotifications,
      providesTags: (result) => [
        { type: "Notification" as const, id: "LIST" },
        ...(result ?? []).map(({ id }) => ({ type: "Notification" as const, id })),
      ],
    }),

    getUnreadNotificationCount: builder.query<number, void>({
      query: () => ({ url: "/notifications/unread-count", method: "GET" }),
      transformResponse: extractUnreadCount,
      providesTags: [{ type: "Notification" as const, id: "UNREAD_COUNT" }],
    }),

    markNotificationAsRead: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/notifications/${encodeURIComponent(String(id))}/read`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Notification", id },
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: "UNREAD_COUNT" },
      ],
    }),

    markAllNotificationsAsRead: builder.mutation<void, void>({
      query: () => ({ url: "/notifications/read-all", method: "PATCH" }),
      invalidatesTags: [
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: "UNREAD_COUNT" },
      ],
    }),

    deleteNotification: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/notifications/${encodeURIComponent(String(id))}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Notification", id },
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: "UNREAD_COUNT" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi;
