import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/types/order.types";

interface CartState {
  items: CartItem[];
  subtotal: number;
  isCartOpen: boolean;
}

const initialState: CartState = {
  items: [],
  subtotal: 0,
  isCartOpen: false,
};

const calculateSubtotal = (items: CartItem[]): number =>
  items.reduce((sum, item) => {
    const price = item.product.discountPrice ?? item.product.price;
    return sum + Number(price) * item.quantity;
  }, 0);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.subtotal = calculateSubtotal(action.payload);
    },
    optimisticAddItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(
        (i) => i.productId === action.payload.productId
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.subtotal = calculateSubtotal(state.items);
    },
    optimisticRemoveItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      state.subtotal = calculateSubtotal(state.items);
    },
    optimisticUpdateQty: (
      state,
      action: PayloadAction<{ itemId: string; quantity: number }>
    ) => {
      const item = state.items.find((i) => i.id === action.payload.itemId);
      if (item) item.quantity = action.payload.quantity;
      state.subtotal = calculateSubtotal(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
    },
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
  },
});

export const {
  setCart,
  optimisticAddItem,
  optimisticRemoveItem,
  optimisticUpdateQty,
  clearCart,
  toggleCart,
} = cartSlice.actions;
export default cartSlice.reducer;