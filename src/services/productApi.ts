import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse, PaginationMeta } from "@/types/api.types";
import { Product, ProductFilters } from "@/types/product.types";

export const productApi = createApi({
  reducerPath: "productApi",
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
  tagTypes: ["Products", "Product"],
  endpoints: (builder) => ({
    getProducts: builder.query<
      { data: Product[]; meta: PaginationMeta },
      ProductFilters
    >({
      query: (filters) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== "") {
            params.set(key, String(value));
          }
        });
        return `/products?${params.toString()}`;
      },
      transformResponse: (res: ApiResponse<Product[]>) => ({
        data: res.data ?? [],
        meta: res.meta ?? { total: 0, page: 1, limit: 12, totalPages: 0 },
      }),
      providesTags: ["Products"],
    }),

    getProductBySlug: builder.query<
      { product: Product; relatedProducts: Product[] },
      string
    >({
      query: (slug) => `/products/${slug}`,
      transformResponse: (res: ApiResponse<{ product: Product; relatedProducts: Product[] }>) =>
        res.data!,
      providesTags: (_result, _err, slug) => [{ type: "Product", id: slug }],
    }),

    createProduct: builder.mutation<ApiResponse<Product>, Partial<Product> & { images: string[] }>({
      query: (body) => ({ url: "/products", method: "POST", body }),
      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation<
      ApiResponse<Product>,
      { id: string; data: Partial<Product> & { images?: string[] } }
    >({
      query: ({ id, data }) => ({ url: `/products/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Products", "Product"],
    }),

    deleteProduct: builder.mutation<ApiResponse, string>({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;