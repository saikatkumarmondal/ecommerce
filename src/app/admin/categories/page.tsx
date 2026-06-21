"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { CategoryTable } from "@/components/admin/CategoryTable";

export default function AdminCategoriesPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const handleAdd = () => {
    setEditingCategory(null);
    setFormOpen(true);
  };

  const handleEdit = (cat: any) => {
    setEditingCategory(cat);
    setFormOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your product categories</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <CategoryTable onEdit={handleEdit} />

      <CategoryForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        editingCategory={editingCategory}
      />
    </div>
  );
}