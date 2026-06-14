import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse, PaginationMeta } from "@/types/api.types";
import { User } from "@/types/user.types";
import { Order } from "@/types/order.types";
import { Product } from "@/types/product.types";

export interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: Order[];
  topProducts: Product[];
}

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Analytics", "Users"],
  endpoints: (builder) => ({
    getAnalytics: builder.query<Analytics, void>({
      query: () => "/admin/analytics",
      transformResponse: (res: ApiResponse<Analytics>) => res.data!,
      providesTags: ["Analytics"],
    }),
    getUsers: builder.query
      { data: User[]; meta: PaginationMeta },
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 } = {}) =>
        `/admin/users?page=${page}&limit=${limit}`,
      transformResponse: (res: ApiResponse<User[]>) => ({
        data: res.data ?? [],
        meta: res.meta ?? { total: 0, page: 1, limit: 10, totalPages: 0 },
      }),
      providesTags: ["Users"],
    }),
  }),
});

export const { useGetAnalyticsQuery, useGetUsersQuery } = adminApi;