import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "@/types/api.types";
import { UserRole } from "@/types/user.types";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;  // string → UserRole
}

interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/auth" }),
  endpoints: (builder) => ({
    register: builder.mutation<ApiResponse<AuthUser>, RegisterInput>({
      query: (body) => ({ url: "/register", method: "POST", body }),
    }),
    login: builder.mutation<ApiResponse<LoginResponse>, LoginInput>({
      query: (body) => ({ url: "/login", method: "POST", body }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = authApi;