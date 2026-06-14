"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (requireAdmin && user?.role !== "ADMIN") {
      router.replace("/");
    }
  }, [isAuthenticated, user, requireAdmin, router]);

  if (!isAuthenticated) return null;
  if (requireAdmin && user?.role !== "ADMIN") return null;

  return <>{children}</>;
}