"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="w-full flex items-center justify-center px-4 py-16 sm:py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative max-w-md w-full flex flex-col items-center text-center p-8 sm:p-12 rounded-[2.5rem] bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm backdrop-blur-sm group overflow-hidden"
      >
        {/* Background Visual Flair (Floating Ambient Glows) */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-zinc-200/40 dark:bg-zinc-800/40 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-zinc-200/40 dark:bg-zinc-800/40 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* 3D Tactile Animated Icon Shell */}
        <motion.div
          whileHover={{ 
            scale: 1.08, 
            rotateZ: [0, -6, 6, 0],
            transition: { duration: 0.4 } 
          }}
          className="relative w-20 h-20 rounded-2xl bg-white dark:bg-zinc-900 text-black dark:text-white border border-zinc-300/60 dark:border-zinc-700/60 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.05),0_1px_0_rgba(255,255,255,0.1)_inside] mb-6"
        >
          <Icon className="w-9 h-9 text-zinc-800 dark:text-zinc-200" />
          
          {/* Decorative Radar Ring */}
          <span className="absolute inset-0 rounded-2xl border border-zinc-400/30 animate-ping opacity-20 pointer-events-none" />
        </motion.div>

        {/* Typography Content Wrapper */}
        <div className="space-y-2 mb-8">
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            {title}
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
            {description}
          </p>
        </div>

        {/* Premium Call to Action Area */}
        {actionLabel && (
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto"
          >
            {actionHref ? (
              <Button asChild className="w-full sm:w-auto bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 rounded-xl px-8 py-5 text-sm font-bold shadow-md transition-all duration-200">
                <Link href={actionHref}>{actionLabel}</Link>
              </Button>
            ) : (
              <Button 
                onClick={onAction} 
                className="w-full sm:w-auto bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 rounded-xl px-8 py-5 text-sm font-bold shadow-md transition-all duration-200"
              >
                {actionLabel}
              </Button>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}