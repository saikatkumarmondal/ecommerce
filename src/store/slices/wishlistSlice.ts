import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistState {
  productIds: string[];
}

const initialState: WishlistState = { productIds: [] };

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action: PayloadAction<string[]>) => {
      state.productIds = action.payload;
    },
    toggleWishlistItem: (state, action: PayloadAction<string>) => {
      const idx = state.productIds.indexOf(action.payload);
      if (idx === -1) {
        state.productIds.push(action.payload);
      } else {
        state.productIds.splice(idx, 1);
      }
    },
  },
});

export const { setWishlist, toggleWishlistItem } = wishlistSlice.actions;
export default wishlistSlice.reducer;