"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { BrandForm } from "@/components/admin/BrandForm";
import { BrandTable } from "@/components/admin/BrandTable";

export default function AdminBrandsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);

  const handleAdd = () => {
    setEditingBrand(null);
    setFormOpen(true);
  };

  const handleEdit = (brand: any) => {
    setEditingBrand(brand);
    setFormOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Brands</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage product brands</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Brand
        </button>
      </div>

      <BrandTable onEdit={handleEdit} />

      <BrandForm open={formOpen} onClose={() => setFormOpen(false)} editingBrand={editingBrand} />
    </div>
  );
}