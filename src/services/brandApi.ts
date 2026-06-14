import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "@/types/api.types";
import { Brand } from "@/types/product.types";

export const brandApi = createApi({
  reducerPath: "brandApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Brands"],
  endpoints: (builder) => ({
    getBrands: builder.query<Brand[], void>({
      query: () => "/brands",
      transformResponse: (res: ApiResponse<Brand[]>) => res.data ?? [],
      providesTags: ["Brands"],
    }),
    createBrand: builder.mutation<ApiResponse<Brand>, { name: string; logo?: string }>({
      query: (body) => ({ url: "/brands", method: "POST", body }),
      invalidatesTags: ["Brands"],
    }),
    updateBrand: builder.mutation
      ApiResponse<Brand>,
      { id: string; data: { name?: string; logo?: string } }
    >({
      query: ({ id, data }) => ({ url: `/brands/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Brands"],
    }),
    deleteBrand: builder.mutation<ApiResponse, string>({
      query: (id) => ({ url: `/brands/${id}`, method: "DELETE" }),
      invalidatesTags: ["Brands"],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;