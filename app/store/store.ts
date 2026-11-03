import { configureStore } from "@reduxjs/toolkit";
import { accountApi } from "@/app/services/account-api";
import { teamMembersApi } from "../services/team-members-api";
import { tasksApi } from "../services/tasks-api";
import { chatbotApi } from "../services/chatbotApi";

export const store = configureStore({
    reducer: {
        [accountApi.reducerPath]: accountApi.reducer,
        [teamMembersApi.reducerPath]: teamMembersApi.reducer,
        [tasksApi.reducerPath]: tasksApi.reducer,
        [chatbotApi.reducerPath]: chatbotApi.reducer,
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
        accountApi.middleware,
        teamMembersApi.middleware,
        tasksApi.middleware,
        chatbotApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;