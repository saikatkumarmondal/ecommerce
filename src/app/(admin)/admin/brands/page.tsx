"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Plus, Pencil, Trash2, Award, X, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  useGetBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} from "@/services/brandApi";
import { Brand } from "@/types/product.types";
import { toast } from "sonner";

export default function AdminBrandsPage() {
  const { data: brands = [], isLoading } = useGetBrandsQuery();
  const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({ name: "", logo: "" });

  const openCreate = () => {
    setEditingBrand(null);
    setFormData({ name: "", logo: "" });
    setIsFormOpen(true);
  };

  const openEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({ name: brand.name, logo: brand.logo ?? "" });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    try {
      if (editingBrand) {
        await updateBrand({
          id: editingBrand.id,
          data: { name: formData.name, logo: formData.logo || undefined },
        }).unwrap();
        toast.success("Brand updated!");
      } else {
        await createBrand({
          name: formData.name,
          logo: formData.logo || undefined,
        }).unwrap();
        toast.success("Brand created!");
      }
      setIsFormOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Operation failed");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete brand "${name}"?`)) return;
    try {
      await deleteBrand(id).unwrap();
      toast.success("Brand deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-black">Brands</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {brands.length} brands
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2 rounded-xl">
          <Plus className="w-4 h-4" />
          Add Brand
        </Button>
      </motion.div>

      {/* Form */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card border rounded-2xl p-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold">
                {editingBrand ? "Edit Brand" : "New Brand"}
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsFormOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Brand Name *</Label>
                <Input
                  placeholder="Apple"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Logo URL (optional)</Label>
                <Input
                  placeholder="https://..."
                  value={formData.logo}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, logo: e.target.value }))
                  }
                />
              </div>
              <div className="sm:col-span-2 flex gap-3">
                <Button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="gap-2 rounded-xl"
                >
                  {isCreating || isUpdating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {editingBrand ? "Update" : "Create"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : brands.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No brands yet"
          description="Add your first brand."
          actionLabel="Add Brand"
          onAction={openCreate}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {brands.map((brand, idx) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.04 }}
              className="bg-card border rounded-2xl p-4 hover:shadow-md transition-shadow group flex flex-col items-center gap-3 text-center"
            >
              {brand.logo ? (
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={64}
                  height={32}
                  className="h-8 w-auto object-contain"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-xl font-black text-muted-foreground">
                  {brand.name[0]}
                </div>
              )}
              <p className="font-bold text-sm">{brand.name}</p>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-primary"
                  onClick={() => openEdit(brand)}
                >
                  <Pencil className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-red-500"
                  onClick={() => handleDelete(brand.id, brand.name)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}