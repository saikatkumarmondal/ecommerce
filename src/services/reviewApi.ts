import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "@/types/api.types";
import { Review } from "@/types/product.types";

export const reviewApi = createApi({
  reducerPath: "reviewApi",
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
  endpoints: (builder) => ({
    createReview: builder.mutation<
      ApiResponse<Review>,
      { productId: string; rating: number; title: string; comment: string }
    >({
      query: (body) => ({ url: "/reviews", method: "POST", body }),
    }),
  }),
});

export const { useCreateReviewMutation } = reviewApi;