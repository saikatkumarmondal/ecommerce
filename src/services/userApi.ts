import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "@/lib/baseQuery";
import { ApiResponse, PaginationMeta } from "@/types/api.types";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<{ data: AdminUser[]; meta: PaginationMeta }, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 12 }) => `/admin/users?page=${page}&limit=${limit}`,
      transformResponse: (res: ApiResponse<AdminUser[]>) => ({
        data: res.data ?? [],
        meta: res.meta ?? { total: 0, page: 1, limit: 12, totalPages: 0 },
      }),
      providesTags: ["Users"],
    }),
  }),
});

export const { useGetUsersQuery } = userApi;