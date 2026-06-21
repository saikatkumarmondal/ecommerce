"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Edit2, Trash2, ImageOff } from "lucide-react";
import { useGetCategoriesQuery, useDeleteCategoryMutation } from "@/services/categoryApi";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";

interface CategoryTableProps {
  onEdit: (category: any) => void;
}

// Framer Motion staggered orchestration setup
const listVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.03 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
};

export function CategoryTable({ onEdit }: CategoryTableProps) {
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCategory(deleteTarget.id).unwrap();
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err?.data?.message || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-12 text-center text-sm text-slate-400 font-medium animate-pulse">
        Syncing categories...
      </div>
    );
  }

  if (!categories?.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-12 text-center max-w-sm mx-auto shadow-xs">
        <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">No classifications found.</p>
      </div>
    );
  }

  return (
    <>
      {/* 1. LARGE DESKTOP MODE (>= lg Breakpoint) */}
      <div className="hidden lg:block bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-sm">
          <thead className="bg-slate-50/70 dark:bg-slate-950/40 text-left text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider w-24">Visual</th>
              <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Slug Router</th>
              <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Product Inventory</th>
              <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <motion.tbody variants={listVariants} initial="hidden" animate="show" className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {categories.map((cat: any) => (
              <motion.tr key={cat.id} variants={itemVariants} className="hover:bg-slate-50/30 dark:hover:bg-slate-950/20 transition-colors group">
                <td className="px-6 py-3.5">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-100 dark:ring-slate-800" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center border border-slate-100 dark:border-slate-800"><ImageOff className="w-4 h-4 text-slate-300 dark:text-slate-700" /></div>
                  )}
                </td>
                <td className="px-6 py-3.5 font-bold text-slate-800 dark:text-slate-100">{cat.name}</td>
                <td className="px-6 py-3.5 text-slate-400 dark:text-slate-500 font-mono text-xs">{cat.slug}</td>
                <td className="px-6 py-3.5">
                  <span className="inline-flex items-center px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold">{cat._count?.products ?? 0} items</span>
                </td>
                <td className="px-6 py-3.5 text-right">
                  <div className="flex justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(cat)} className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteTarget({ id: cat.id, name: cat.name })} className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>

      {/* 2. MID-SIZE TABLET GRID SYSTEM (>= sm and < lg Breakpoints) */}
      <motion.div variants={listVariants} initial="hidden" animate="show" className="hidden sm:grid lg:hidden grid-cols-2 md:grid-cols-3 gap-5">
        {categories.map((cat: any) => (
          <motion.div key={cat.id} variants={itemVariants} whileHover={{ y: -2 }} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
            <div className="flex items-start justify-between gap-3">
              {cat.image ? (
                <img src={cat.image} alt={cat.name} className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-100 dark:ring-slate-800 flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-center flex-shrink-0"><ImageOff className="w-5 h-5 text-slate-300 dark:text-slate-700" /></div>
              )}
              <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/20 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold">{cat._count?.products ?? 0} items</span>
            </div>
            <div className="mt-4 pt-1">
              <h4 className="font-extrabold text-slate-800 dark:text-slate-100 truncate">{cat.name}</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate font-mono mt-0.5">/{cat.slug}</p>
            </div>
            <div className="flex items-center justify-end gap-1 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60">
              <button onClick={() => onEdit(cat)} className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => setDeleteTarget({ id: cat.id, name: cat.name })} className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 3. MOBILE ULTRA COMPACT VIEW (< sm Breakpoint) */}
      <motion.div variants={listVariants} initial="hidden" animate="show" className="sm:hidden space-y-3">
        {categories.map((cat: any) => (
          <motion.div key={cat.id} variants={itemVariants} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-4 flex items-center gap-3">
            {cat.image ? (
              <img src={cat.image} alt={cat.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 shadow-xs" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-center flex-shrink-0"><ImageOff className="w-5 h-5 text-slate-300 dark:text-slate-700" /></div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{cat.name}</p>
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">{cat._count?.products ?? 0} active items</p>
            </div>
            <div className="flex gap-0.5 flex-shrink-0">
              <button onClick={() => onEdit(cat)} className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => setDeleteTarget({ id: cat.id, name: cat.name })} className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <ConfirmDeleteModal
        open={!!deleteTarget}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}