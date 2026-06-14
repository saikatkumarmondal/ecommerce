import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
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
  tagTypes: [
    "Products",
    "Product",
    "Categories",
    "Brands",
    "Cart",
    "Wishlist",
    "Orders",
    "Order",
    "Coupons",
    "Users",
    "Analytics",
  ],
  endpoints: () => ({}),
});