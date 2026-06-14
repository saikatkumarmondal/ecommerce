import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "@/types/api.types";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    sendMessage: builder.mutation
      ApiResponse<{ reply: string }>,
      { message: string; history: ChatMessage[] }
    >({
      query: (body) => ({ url: "/chat", method: "POST", body }),
    }),
  }),
});

export const { useSendMessageMutation } = chatApi;