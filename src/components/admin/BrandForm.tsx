"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Image as ImageIcon } from "lucide-react";
import { useCreateBrandMutation, useUpdateBrandMutation } from "@/services/brandApi";

interface BrandFormProps {
  open: boolean;
  onClose: () => void;
  editingBrand?: { id: string; name: string; logo?: string } | null;
}

export function BrandForm({ open, onClose, editingBrand }: BrandFormProps) {
  const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();
  const [form, setForm] = useState({ name: "", logo: "" });
  const [error, setError] = useState("");
  const [previewError, setPreviewError] = useState(false);

  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (editingBrand) {
      setForm({ name: editingBrand.name, logo: editingBrand.logo ?? "" });
    } else {
      setForm({ name: "", logo: "" });
    }
    setError("");
    setPreviewError(false);
  }, [editingBrand, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (editingBrand) {
        await updateBrand({ id: editingBrand.id, data: form }).unwrap();
      } else {
        await createBrand(form).unwrap();
      }
      onClose();
    } catch (err: any) {
      setError(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop Mask */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: "calc(-50% + 15px)", x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, y: "calc(-50% + 15px)", x: "-50%" }}
            transition={{ type: "spring" as const, stiffness: 350, damping: 26 }}
            className="fixed top-1/2 left-1/2 w-[calc(100%-2rem)] sm:w-full max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl z-50 p-6 md:p-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-extrabold text-xl text-slate-900 dark:text-slate-50 tracking-tight">
                  {editingBrand ? "Edit Brand" : "New Brand"}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {editingBrand ? "Modify existing identity assets" : "Setup a new company profile"}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.05)" }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 text-sm px-4 py-3 rounded-xl mb-5 font-medium"
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-600 dark:text-slate-400">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="e.g. Apple"
                  className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-600 dark:text-slate-400">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={form.logo}
                  onChange={(e) => {
                    setForm({ ...form, logo: e.target.value });
                    setPreviewError(false);
                  }}
                  placeholder="https://example.com/logo.png"
                  className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Dynamic Stylish Visual Preview Section */}
              {form.logo && !previewError && (
                <motion.div 
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative group w-full h-24 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center p-3 bg-slate-50/30 dark:bg-slate-950/30 backdrop-blur-sm overflow-hidden"
                >
                  <img
                    src={form.logo}
                    alt="Brand Logo Preview"
                    className="max-w-full max-h-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
                    onError={() => setPreviewError(true)}
                  />
                </motion.div>
              )}

              {/* Broken Logo Fallback Graphic */}
              {form.logo && previewError && (
                <div className="w-full h-24 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex flex-col items-center justify-center gap-1.5 bg-slate-50/50 dark:bg-slate-950/50 text-slate-400">
                  <ImageIcon className="w-5 h-5 stroke-[1.5]" />
                  <span className="text-xs">Image could not load</span>
                </div>
              )}

              {/* Action Button */}
              <motion.button
                whileHover={{ y: -1, boxShadow: "0 10px 20px -10px rgba(99, 102, 241, 0.4)" }}
                whileTap={{ y: 0 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-3 rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : editingBrand ? (
                  "Save Changes"
                ) : (
                  "Create Brand"
                )}
              </motion.button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
