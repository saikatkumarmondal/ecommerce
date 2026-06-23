import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse, PaginationMeta } from "@/types/api.types";
import { Order, ShippingAddress } from "@/types/order.types";

export const orderApi = createApi({
  reducerPath: "orderApi",
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
  tagTypes: ["Orders", "Order"],
  endpoints: (builder) => ({
    getOrders: builder.query<{ data: Order[]; meta: PaginationMeta }, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 } = {}) => `/orders?page=${page}&limit=${limit}`,
      transformResponse: (res: ApiResponse<Order[]>) => ({
        data: res.data ?? [],
        meta: res.meta ?? { total: 0, page: 1, limit: 10, totalPages: 0 },
      }),
      providesTags: ["Orders"],
    }),
    getOrderById: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
      transformResponse: (res: ApiResponse<Order>) => res.data!,
      providesTags: (_r, _e, id) => [{ type: "Order", id }],
    }),
    updateOrderStatus: builder.mutation<ApiResponse<Order>, { id: string; orderStatus: string }>({
      query: ({ id, orderStatus }) => ({ url: `/orders/${id}`, method: "PUT", body: { orderStatus } }),
      invalidatesTags: ["Orders", "Order"],
    }),
    createCheckoutSession: builder.mutation<ApiResponse<{ sessionUrl: string; sessionId: string; orderId: string }>, { items: { productId: string; quantity: number }[]; shippingAddress: ShippingAddress; couponCode?: string }>({
      query: (body) => ({ url: "/checkout/session", method: "POST", body }),
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useCreateCheckoutSessionMutation,
} = orderApi;