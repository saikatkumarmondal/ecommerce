import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "@/types/api.types";
import { Category } from "@/types/product.types";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Categories"],
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => "/categories",
      transformResponse: (res: ApiResponse<Category[]>) => res.data ?? [],
      providesTags: ["Categories"],
    }),
    createCategory: builder.mutation<ApiResponse<Category>, { name: string; image?: string }>({
      query: (body) => ({ url: "/categories", method: "POST", body }),
      invalidatesTags: ["Categories"],
    }),
    updateCategory: builder.mutation<
      ApiResponse<Category>,
      { id: string; data: { name?: string; image?: string } }
    >({
      query: ({ id, data }) => ({ url: `/categories/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Categories"],
    }),
    deleteCategory: builder.mutation<ApiResponse, string>({
      query: (id) => ({ url: `/categories/${id}`, method: "DELETE" }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;