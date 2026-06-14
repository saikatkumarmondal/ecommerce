"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { restoreAuth } from "@/store/slices/authSlice";
import { Toaster } from "sonner";

function AuthRestorer() {
  useEffect(() => {
    store.dispatch(restoreAuth());
  }, []);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthRestorer />
      {children}
      <Toaster position="top-right" richColors closeButton />
    </Provider>
  );
}