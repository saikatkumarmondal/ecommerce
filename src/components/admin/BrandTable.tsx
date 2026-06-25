"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Edit2, Trash2, ImageOff, Loader2, Plus } from "lucide-react";
import { useGetBrandsQuery, useDeleteBrandMutation } from "@/services/brandApi";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";

interface BrandTableProps {
  onEdit: (brand: any) => void;
}

// Stagger list container animation
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 }
  }
};

// Item pop-in animation
const itemVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 260, damping: 20 } }
};

export function BrandTable({ onEdit }: BrandTableProps) {
  const { data: brands, isLoading } = useGetBrandsQuery();
  const [deleteBrand] = useDeleteBrandMutation();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteBrand(deleteTarget.id).unwrap();
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err?.data?.message || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {[...Array(5)].map((_, idx) => (
          <div 
            key={idx} 
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 h-36 flex flex-col items-center justify-center space-y-3 animate-pulse"
          >
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full" />
            <div className="w-16 h-3.5 bg-slate-100 dark:bg-slate-800 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (!brands?.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto"
      >
        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
          <ImageOff className="w-5 h-5 stroke-[1.5]" />
        </div>
        <h3 className="text-slate-900 dark:text-slate-100 font-bold tracking-tight">No brands found</h3>
        <p className="text-muted-foreground text-sm mt-1">Get started by creating your very first company profiles.</p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5"
      >
        {brands.map((brand: any) => (
          <motion.div
            key={brand.id}
            variants={itemVariants}
            whileHover={{ y: -4, boxShadow: "0 12px 20px -8px rgba(0,0,0,0.08)" }}
            className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/60 rounded-2xl p-5 group relative flex flex-col items-center justify-center transition-colors duration-200 hover:border-slate-300 dark:hover:border-slate-700"
          >
            {/* Logo Wrapper Grid */}
            <div className="w-full h-20 flex items-center justify-center mb-3 p-2 rounded-xl bg-slate-50/50 dark:bg-slate-950/30 border border-slate-50/20">
              {brand.logo ? (
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className="max-h-14 max-w-full object-contain filter drop-shadow-xs transition-transform duration-300 group-hover:scale-105" 
                />
              ) : (
                <ImageOff className="w-5 h-5 text-slate-300 dark:text-slate-700 stroke-[1.5]" />
              )}
            </div>

            {/* Brand Title Label */}
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 text-center truncate w-full px-1">
              {brand.name}
            </p>

            {/* Float Floating Action Overlay Buttons */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 flex gap-1 z-10">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onEdit(brand)}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm transition-colors"
                title="Edit profile"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDeleteTarget({ id: brand.id, name: brand.name })}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 shadow-sm transition-colors"
                title="Remove identity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <ConfirmDeleteModal
        open={!!deleteTarget}
        title="Delete Brand"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
