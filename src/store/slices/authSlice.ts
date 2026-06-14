import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "@/types/user.types";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      }
    },
    restoreAuth: (state) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        if (token && user) {
          state.token = token;
          state.user = JSON.parse(user);
          state.isAuthenticated = true;
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },
  },
});

export const { setCredentials, restoreAuth, logout } = authSlice.actions;
export default authSlice.reducer;