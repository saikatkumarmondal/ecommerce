"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Plus, Trash2 } from "lucide-react";
import { useCreateProductMutation, useUpdateProductMutation } from "@/services/productApi";
import { useGetCategoriesQuery } from "@/services/categoryApi";
import { useGetBrandsQuery } from "@/services/brandApi";

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  editingProduct?: any | null;
}

const emptyForm = {
  name: "",
  description: "",
  shortDescription: "",
  sku: "",
  price: "",
  discountPrice: "",
  stock: "",
  categoryId: "",
  brandId: "",
  isFeatured: false,
  images: [""],
};

export function ProductForm({ open, onClose, editingProduct }: ProductFormProps) {
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const { data: categories } = useGetCategoriesQuery();
  const { data: brands } = useGetBrandsQuery();

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name ?? "",
        description: editingProduct.description ?? "",
        shortDescription: editingProduct.shortDescription ?? "",
        sku: editingProduct.sku ?? "",
        price: String(editingProduct.price ?? ""),
        discountPrice: editingProduct.discountPrice ? String(editingProduct.discountPrice) : "",
        stock: String(editingProduct.stock ?? ""),
        categoryId: editingProduct.categoryId ?? editingProduct.category?.id ?? "",
        brandId: editingProduct.brandId ?? editingProduct.brand?.id ?? "",
        isFeatured: editingProduct.isFeatured ?? false,
        images: editingProduct.images?.length
          ? editingProduct.images.map((img: any) => (typeof img === "string" ? img : img.url))
          : [""],
      });
    } else {
      setForm(emptyForm);
    }
    setError("");
  }, [editingProduct, open]);

  const handleImageChange = (idx: number, value: string) => {
    const next = [...form.images];
    next[idx] = value;
    setForm({ ...form, images: next });
  };

  const addImageField = () => setForm({ ...form, images: [...form.images, ""] });

  const removeImageField = (idx: number) => {
    const next = form.images.filter((_, i) => i !== idx);
    setForm({ ...form, images: next.length ? next : [""] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanImages = form.images.map((i) => i.trim()).filter(Boolean);
    if (cleanImages.length === 0) {
      setError("At least one image URL is required");
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      shortDescription: form.shortDescription,
      sku: form.sku,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      stock: Number(form.stock),
      categoryId: form.categoryId,
      brandId: form.brandId,
      isFeatured: form.isFeatured,
      images: cleanImages,
    };

    try {
      if (editingProduct) {
        await updateProduct({ id: editingProduct.id, data: payload }).unwrap();
      } else {
        await createProduct(payload).unwrap();
      }
      onClose();
    } catch (err: any) {
      const fieldErrors = err?.data?.errors;
      if (fieldErrors) {
        const firstKey = Object.keys(fieldErrors)[0];
        setError(fieldErrors[firstKey]?.[0] || "Validation failed");
      } else {
        setError(err?.data?.message || "Something went wrong");
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full sm:h-auto sm:w-[92vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[100vh] sm:max-h-[88vh] overflow-y-auto bg-white sm:rounded-2xl shadow-2xl z-50 p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-5 sticky top-0 bg-white py-2 z-10 border-b border-gray-100 sm:border-none">
              <h2 className="font-bold text-lg md:text-xl text-gray-900">{editingProduct ? "Edit Product" : "New Product"}</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-4">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 pb-20 sm:pb-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700">Product Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700">Short Description</label>
                <input
                  type="text"
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  required
                  maxLength={200}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700">Full Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all resize-none"
                />
              </div>

              {/* SKU & Stock Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">SKU</label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    required
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Stock</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    required
                    min={0}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                  />
                </div>
              </div>

              {/* Price & Discount Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Price ($)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                    min={0}
                    step="0.01"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Discount Price ($)</label>
                  <input
                    type="number"
                    value={form.discountPrice}
                    onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                    min={0}
                    step="0.01"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                  />
                </div>
              </div>

              {/* Category & Brand Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Category</label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    required
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all bg-white"
                  >
                    <option value="">Select category</option>
                    {categories?.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Brand</label>
                  <select
                    value={form.brandId}
                    onChange={(e) => setForm({ ...form, brandId: e.target.value })}
                    required
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all bg-white"
                  >
                    <option value="">Select brand</option>
                    {brands?.map((b: any) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700">Image URLs</label>
                <div className="space-y-2">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="url"
                        value={img}
                        onChange={(e) => handleImageChange(idx, e.target.value)}
                        placeholder="https://..."
                        className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => removeImageField(idx)}
                        className="px-3 rounded-xl border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addImageField}
                  className="mt-2 flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-black"
                >
                  <Plus className="w-4 h-4" />
                  Add another image
                </button>
              </div>

              <label className="flex items-center gap-2 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 accent-black"
                />
                <span className="text-sm font-medium text-gray-700">Mark as Featured</span>
              </label>

              {/* Action Buttons */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 sm:static sm:p-0 sm:border-none z-10">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white py-2.5 sm:py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md sm:shadow-none"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingProduct ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}