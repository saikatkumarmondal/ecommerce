import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "@/types/api.types";

export interface Coupon {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minOrderAmt?: number;
  maxUses?: number;
  usedCount: number;
  isActive: boolean;
  expiresAt?: string;
}

export interface CouponValidation {
  coupon: Coupon;
  discountAmount: number;
  finalTotal: number;
}

export const couponApi = createApi({
  reducerPath: "couponApi",
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
  tagTypes: ["Coupons"],
  endpoints: (builder) => ({
    getCoupons: builder.query<Coupon[], void>({
      query: () => "/coupons",
      transformResponse: (res: ApiResponse<Coupon[]>) => res.data ?? [],
      providesTags: ["Coupons"],
    }),
    validateCoupon: builder.mutation
      ApiResponse<CouponValidation>,
      { code: string; orderTotal: number }
    >({
      query: (body) => ({ url: "/coupons/validate", method: "POST", body }),
    }),
    createCoupon: builder.mutation<ApiResponse<Coupon>, Partial<Coupon>>({
      query: (body) => ({ url: "/coupons", method: "POST", body }),
      invalidatesTags: ["Coupons"],
    }),
  }),
});

export const {
  useGetCouponsQuery,
  useValidateCouponMutation,
  useCreateCouponMutation,
} = couponApi;