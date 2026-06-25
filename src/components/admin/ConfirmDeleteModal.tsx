"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmDeleteModalProps {
  open: boolean;
  title: string;
  message: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({
  open,
  title,
  message,
  loading,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop Blur Mask */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={loading ? undefined : onCancel}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[60]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: "calc(-50% + 12px)", x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, y: "calc(-50% + 12px)", x: "-50%" }}
            transition={{ type: "spring" as const, stiffness: 400, damping: 28 }}
            className="fixed top-1/2 left-1/2 w-[calc(100%-2rem)] sm:w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl z-[60] p-6 text-center"
          >
            {/* Warning Icon Banner */}
            <div className="w-14 h-14 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-100/60 dark:border-rose-900/30 flex items-center justify-center mx-auto mb-4 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-6 h-6 stroke-[2]" />
            </div>

            {/* Typography Content */}
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-50 tracking-tight mb-2">
              {title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed px-1 mb-6">
              {message}
            </p>

            {/* Interactive Actions Overlay Grid */}
            <div className="flex gap-3">
              <motion.button
                whileHover={loading ? {} : { scale: 1.01, backgroundColor: "rgba(0,0,0,0.02)" }}
                whileTap={loading ? {} : { scale: 0.99 }}
                onClick={onCancel}
                disabled={loading}
                className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 bg-transparent dark:hover:bg-slate-800/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Cancel
              </motion.button>
              
              <motion.button
                whileHover={loading ? {} : { y: -1, boxShadow: "0 8px 20px -8px rgba(225, 29, 72, 0.4)" }}
                whileTap={loading ? {} : { y: 0 }}
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-rose-600 dark:bg-rose-500 text-white text-sm font-bold hover:bg-rose-700 dark:hover:bg-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Confirm Delete"
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
