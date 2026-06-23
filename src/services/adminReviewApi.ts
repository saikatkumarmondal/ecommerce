import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "@/lib/baseQuery";
import { ApiResponse, PaginationMeta } from "@/types/api.types";

interface AdminReview {
  id: string;
  rating: number;
  title: string;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  user: { id: string; name: string; email: string };
  product: { id: string; name: string; slug: string };
}

export const adminReviewApi = createApi({
  reducerPath: "adminReviewApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["AdminReviews"],
  endpoints: (builder) => ({
    getAdminReviews: builder.query<{ data: AdminReview[]; meta: PaginationMeta }, { status: string; page: number }>({
      query: ({ status, page }) => `/admin/reviews?status=${status}&page=${page}&limit=10`,
      transformResponse: (res: ApiResponse<AdminReview[]>) => ({
        data: res.data ?? [],
        meta: res.meta ?? { total: 0, page: 1, limit: 10, totalPages: 0 },
      }),
      providesTags: ["AdminReviews"],
    }),
    toggleReviewApproval: builder.mutation<ApiResponse<AdminReview>, string>({
      query: (id) => ({ url: `/admin/reviews/${id}`, method: "PATCH" }),
      invalidatesTags: ["AdminReviews"],
    }),
    deleteAdminReview: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({ url: `/admin/reviews/${id}`, method: "DELETE" }),
      invalidatesTags: ["AdminReviews"],
    }),
  }),
});

export const {
  useGetAdminReviewsQuery,
  useToggleReviewApprovalMutation,
  useDeleteAdminReviewMutation,
} = adminReviewApi;