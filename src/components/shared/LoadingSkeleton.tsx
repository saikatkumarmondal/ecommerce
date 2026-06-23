"use client";

import { motion } from "framer-motion";

// Custom premium 3D shimmering element to replace standard flat skeletons
function Shimmer3D({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-slate-100/80 dark:bg-zinc-800/80 ${className}`}>
      <motion.div
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.6,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -skew-x-12"
      />
    </div>
  );
}

// 3D Stagger animation settings for parent grids
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

// 3D pop-in transition for items
const item3DVariants = {
  hidden: { opacity: 0, y: 30, rotateX: 12, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 14,
    },
  },
};

export function ProductCardSkeleton() {
  return (
    <motion.div
      variants={item3DVariants}
      whileHover={{ y: -6, rotateY: 2, rotateX: -2, scale: 1.01 }}
      className="rounded-3xl border border-black/5 dark:border-white/5 bg-white dark:bg-zinc-900/50 p-3 shadow-[0_10px_30px_rgba(0,0,0,0.04)] backdrop-blur-sm transition-shadow duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] overflow-hidden transform-gpu"
    >
      {/* Aspect Ratio Box with high 3D rounded depth */}
      <Shimmer3D className="aspect-square w-full rounded-2xl shadow-inner" />
      
      <div className="p-3 space-y-3 mt-2">
        <Shimmer3D className="h-4 w-3/4 rounded-md" />
        <Shimmer3D className="h-3 w-1/2 rounded-md" />
        <div className="flex items-center justify-between pt-1">
          <Shimmer3D className="h-5 w-1/4 rounded-md" />
          <Shimmer3D className="h-8 w-1/3 rounded-xl" />
        </div>
      </div>
    </motion.div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 [perspective:1200px]"
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </motion.div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-3 p-2 [perspective:100px]"
    >
      {Array.from({ length: rows }).map((_, i) => (
        <motion.div
          key={i}
          variants={item3DVariants}
          className="w-full rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-zinc-900/40 p-4 flex items-center justify-between gap-4 shadow-sm"
        >
          <div className="flex items-center gap-3 w-2/5">
            <Shimmer3D className="h-10 w-10 rounded-xl shrink-0" />
            <div className="space-y-2 w-full">
              <Shimmer3D className="h-3 w-3/4 rounded-md" />
              <Shimmer3D className="h-2 w-1/2 rounded-md" />
            </div>
          </div>
          <Shimmer3D className="h-3 w-1/6 rounded-md hidden sm:block" />
          <Shimmer3D className="h-3 w-1/6 rounded-md" />
          <Shimmer3D className="h-7 w-16 rounded-lg" />
        </motion.div>
      ))}
    </motion.div>
  );
}

export function StatCardSkeleton() {
  return (
    <motion.div
      variants={item3DVariants}
      whileHover={{ y: -4, rotateX: -2, scale: 1.02 }}
      className="rounded-3xl border border-black/5 dark:border-white/5 bg-white dark:bg-zinc-900/50 p-6 space-y-4 shadow-[0_8px_25px_rgba(0,0,0,0.03)] transform-gpu"
    >
      <div className="flex items-center justify-between">
        <Shimmer3D className="h-4 w-24 rounded-md" />
        <Shimmer3D className="h-7 w-7 rounded-lg" />
      </div>
      <Shimmer3D className="h-8 w-32 rounded-lg" />
      <Shimmer3D className="h-3 w-20 rounded-md" />
    </motion.div>
  );
}