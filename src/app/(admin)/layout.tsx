"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-muted/20 flex">
        {/* Sidebar */}
        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
          <AdminTopbar onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}