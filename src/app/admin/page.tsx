"use client";

import { Package, FolderTree, Tags, ShoppingBag } from "lucide-react";
import { useGetProductsQuery } from "@/services/productApi";
import { useGetCategoriesQuery } from "@/services/categoryApi";
import { useGetBrandsQuery } from "@/services/brandApi";
import { StatCard } from "@/components/admin/StatCard";

export default function AdminDashboardPage() {
  const { data: productsData } = useGetProductsQuery({ limit: 1 });
  const { data: categories } = useGetCategoriesQuery();
  const { data: brands } = useGetBrandsQuery();

  const stats = [
    { label: "Total Products", value: productsData?.meta?.total ?? 0, icon: Package, color: "bg-blue-500" },
    { label: "Categories", value: categories?.length ?? 0, icon: FolderTree, color: "bg-green-500" },
    { label: "Brands", value: brands?.length ?? 0, icon: Tags, color: "bg-purple-500" },
    { label: "Orders", value: "—", icon: ShoppingBag, color: "bg-orange-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </div>
  );
}