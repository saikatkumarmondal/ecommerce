import { configureStore } from "@reduxjs/toolkit";
import { productApi } from "@/services/productApi";
import { categoryApi } from "@/services/categoryApi";
import { brandApi } from "@/services/brandApi";
import { cartApi } from "@/services/cartApi";
import { wishlistApi } from "@/services/wishlistApi";
import { orderApi } from "@/services/orderApi";
import { couponApi } from "@/services/couponApi";
import { reviewApi } from "@/services/reviewApi";
import { adminApi } from "@/services/adminApi";
import { chatApi } from "@/services/chatApi";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    [productApi.reducerPath]: productApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [brandApi.reducerPath]: brandApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [wishlistApi.reducerPath]: wishlistApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [couponApi.reducerPath]: couponApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productApi.middleware,
      categoryApi.middleware,
      brandApi.middleware,
      cartApi.middleware,
      wishlistApi.middleware,
      orderApi.middleware,
      couponApi.middleware,
      reviewApi.middleware,
      adminApi.middleware,
      chatApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;