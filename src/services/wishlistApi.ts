import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "@/types/api.types";

export interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    discountPrice?: number;
    rating: number;
    images: { url: string }[];
    stock: number;
  };
}

export const wishlistApi = createApi({
  reducerPath: "wishlistApi",
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
  tagTypes: ["Wishlist"],
  endpoints: (builder) => ({
    getWishlist: builder.query<WishlistItem[], void>({
      query: () => "/wishlist",
      transformResponse: (res: ApiResponse<WishlistItem[]>) => res.data ?? [],
      providesTags: ["Wishlist"],
    }),
    addToWishlist: builder.mutation<ApiResponse, string>({
      query: (productId) => ({
        url: "/wishlist",
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: ["Wishlist"],
    }),
    removeFromWishlist: builder.mutation<ApiResponse, string>({
      query: (productId) => ({
        url: `/wishlist/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApi;