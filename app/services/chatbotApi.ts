// /* eslint-disable @typescript-eslint/no-explicit-any */
// const CHATBOT_API_URL = process.env.NEXT_PUBLIC_CHATBOT_API_URL?.replace(/\/$/, "");

// export type ChatMessage = {
//   id: number | string;
//   role: "user" | "assistant" | string;
//   content: string;
//   created_at?: string;
// };

// export type ChatConversation = {
//   id: string;
//   conversation_id?: string;
//   title: string;
//   created_at?: string;
//   updated_at?: string;
// };

// export type SendChatMessageRequest = {
//   message: string;
//   conversation_id?: string | null;
// };

// export type SendChatMessageResponse = {
//   conversation_id: string;
//   reply: string;
//   message?: { role: string; content: string };
// };

// function getApiUrl(): string {
//   if (!CHATBOT_API_URL) {
//     throw new Error("NEXT_PUBLIC_CHATBOT_API_URL is not configured.");
//   }
//   return CHATBOT_API_URL;
// }

// function getAuthHeaders(extra?: HeadersInit): Headers {
//   const headers = new Headers(extra);

//   if (typeof window !== "undefined") {
//     const token = window.localStorage.getItem("userToken");
//     if (!token) {
//       throw new Error("Login token is missing. Please sign in again.");
//     }
//     headers.set("Authorization", `Bearer ${token}`);
//   }

//   return headers;
// }

// async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
//   const headers = getAuthHeaders(init.headers);
//   if (init.body && !headers.has("Content-Type")) {
//     headers.set("Content-Type", "application/json");
//   }

//   const response = await fetch(`${getApiUrl()}${path}`, {
//     ...init,
//     headers,
//     cache: "no-store",
//   });

//   if (response.status === 401 || response.status === 403) {
//     throw new Error("Authentication failed. Please sign in again.");
//   }

//   const raw = await response.text();
//   let data: any = null;
//   if (raw) {
//     try {
//       data = JSON.parse(raw);
//     } catch {
//       data = raw;
//     }
//   }

//   if (!response.ok) {
//     const detail = typeof data === "object" && data !== null
//       ? data.detail ?? data.message
//       : data;
//     throw new Error(`Chatbot API error (${response.status}): ${detail || response.statusText}`);
//   }

//   return data as T;
// }

// export async function getConversations(): Promise<ChatConversation[]> {
//   const data = await request<{ conversations: ChatConversation[] }>("/api/conversations");
//   return Array.isArray(data) ? data : data.conversations ?? [];
// }

// export async function getConversationMessages(conversationId: string): Promise<ChatMessage[]> {
//   const data = await request<{ messages: ChatMessage[] }>(
//     `/api/conversations/${encodeURIComponent(conversationId)}/messages`
//   );
//   return Array.isArray(data) ? data : data.messages ?? [];
// }

// export async function createConversation(title = "New chat"): Promise<{ conversation_id: string; title: string }> {
//   return request("/api/conversations", {
//     method: "POST",
//     body: JSON.stringify({ title }),
//   });
// }

// export async function renameConversation(conversationId: string, title: string): Promise<{ conversation_id: string; title: string }> {
//   return request(`/api/conversations/${encodeURIComponent(conversationId)}`, {
//     method: "PATCH",
//     body: JSON.stringify({ title }),
//   });
// }

// export async function deleteConversation(conversationId: string): Promise<{ deleted: boolean; conversation_id: string }> {
//   return request(`/api/conversations/${encodeURIComponent(conversationId)}`, {
//     method: "DELETE",
//   });
// }

// export async function sendChatMessage(payload: SendChatMessageRequest): Promise<SendChatMessageResponse> {
//   return request("/api/chat", {
//     method: "POST",
//     body: JSON.stringify(payload),
//   });
// }




import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

export type ChatMessage = {
  id: number | string;
  role: "user" | "assistant" | string;
  content: string;
  created_at?: string;
};

export type ChatConversation = {
  id: string;
  conversation_id?: string;
  title: string;
  created_at?: string;
  updated_at?: string;
};

export type SendChatMessageRequest = {
  message: string;
  conversation_id?: string | null;
};

export type SendChatMessageResponse = {
  conversation_id: string;
  reply: string;
  message?: {
    role: string;
    content: string;
  };
};

type ConversationsResponse =
  | ChatConversation[]
  | { conversations: ChatConversation[] };

type MessagesResponse =
  | ChatMessage[]
  | { messages: ChatMessage[] };

type CreateConversationResponse = {
  conversation_id: string;
  title: string;
};

type RenameConversationRequest = {
  conversationId: string;
  title: string;
};

type DeleteConversationResponse = {
  deleted: boolean;
  conversation_id: string;
};

const baseUrl =
  process.env.NEXT_PUBLIC_CHATBOT_API_URL?.replace(/\/+$/, "");

export const chatbotApi = createApi({
  reducerPath: "chatbotApi",

  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl ? `${baseUrl}/` : "",
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = window.localStorage.getItem("userToken");

        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }

      headers.set("ngrok-skip-browser-warning", "true");

      return headers;
    },
  }),

  tagTypes: ["Conversations", "Messages"],

  endpoints: (builder) => ({
    getConversations: builder.query<ChatConversation[], void>({
      query: () => "api/conversations",

      transformResponse: (response: ConversationsResponse) =>
        Array.isArray(response)
          ? response
          : response.conversations ?? [],

      providesTags: (result) => [
        { type: "Conversations", id: "LIST" },
        ...(result ?? []).map((conversation) => ({
          type: "Conversations" as const,
          id: conversation.conversation_id ?? conversation.id,
        })),
      ],
    }),

    getConversationMessages: builder.query<
      ChatMessage[],
      string
    >({
      query: (conversationId) =>
        `api/conversations/${encodeURIComponent(conversationId)}/messages`,

      transformResponse: (response: MessagesResponse) =>
        Array.isArray(response)
          ? response
          : response.messages ?? [],

      providesTags: (_result, _error, conversationId) => [
        { type: "Messages", id: conversationId },
      ],
    }),

    createConversation: builder.mutation<
      CreateConversationResponse,
      { title?: string }
    >({
      query: ({ title = "New chat" }) => ({
        url: "api/conversations",
        method: "POST",
        body: { title },
      }),

      invalidatesTags: [
        { type: "Conversations", id: "LIST" },
      ],
    }),

    renameConversation: builder.mutation<
      CreateConversationResponse,
      RenameConversationRequest
    >({
      query: ({ conversationId, title }) => ({
        url: `api/conversations/${encodeURIComponent(conversationId)}`,
        method: "PATCH",
        body: { title },
      }),

      invalidatesTags: (_result, _error, { conversationId }) => [
        { type: "Conversations", id: "LIST" },
        { type: "Conversations", id: conversationId },
      ],
    }),

    deleteConversation: builder.mutation<
      DeleteConversationResponse,
      string
    >({
      query: (conversationId) => ({
        url: `api/conversations/${encodeURIComponent(conversationId)}`,
        method: "DELETE",
      }),

      invalidatesTags: [
        { type: "Conversations", id: "LIST" },
      ],
    }),

    sendChatMessage: builder.mutation<
      SendChatMessageResponse,
      SendChatMessageRequest
    >({
      query: (payload) => ({
        url: "api/chat",
        method: "POST",
        body: payload,
      }),

      invalidatesTags: (_result, _error, payload) =>
        payload.conversation_id
          ? [
              {
                type: "Messages",
                id: payload.conversation_id,
              },
            ]
          : [],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationMessagesQuery,
  useCreateConversationMutation,
  useRenameConversationMutation,
  useDeleteConversationMutation,
  useSendChatMessageMutation,
} = chatbotApi;
