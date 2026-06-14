"use client";

import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8 items-start">
            <aside className="hidden md:block w-64 flex-shrink-0 sticky top-24">
              <DashboardSidebar />
            </aside>
            <main className="flex-1 min-w-0">{children}</main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}