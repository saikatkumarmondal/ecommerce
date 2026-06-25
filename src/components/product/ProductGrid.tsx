"use client";

import { motion, Variants } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Product } from "@/types/product.types";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    rotateX: 15,
    scale: 0.95,
  },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const textContainerVariants: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const wordVariants: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const letterVariants: Variants = {
  initial: { opacity: 0, y: 15, rotateX: -90 },
  animate: {
    opacity: [0, 1, 1, 0],
    y: [15, 0, 0, -15],
    rotateX: [-90, 0, 0, 90],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut",
      times: [0, 0.15, 0.85, 1],
    },
  },
};

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    const text = "Just Wait Pls";
    const words = text.split(" ");

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-8">
        <div className="relative flex items-center justify-center [perspective:800px]">
          <motion.div
            animate={{
              y: [0, -24, 0],
              rotateY: [0, 180, 360],
              rotateX: [0, 45, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-[0_15px_35px_rgba(139,92,246,0.4)] border border-white/20"
          />
          <motion.div
            animate={{
              y: [0, 24, 0],
              rotateY: [180, 360, 540],
              scale: [0.8, 1.1, 0.8],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
            }}
            className="absolute w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 mix-blend-multiply opacity-80 shadow-lg"
          />
        </div>

        <motion.div
          variants={textContainerVariants}
          animate="animate"
          className="flex gap-x-3 [perspective:500px] select-none"
        >
          {words.map((word, wordIndex) => (
            <motion.span
              key={wordIndex}
              variants={wordVariants}
              className="flex inline-block origin-center will-change-transform"
            >
              {word.split("").map((char, charIndex) => (
                <motion.span
                  key={charIndex}
                  variants={letterVariants}
                  className="inline-block text-base font-bold tracking-wider uppercase bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent origin-bottom"
                >
                  {char}
                </motion.span>
              ))}
            </motion.span>
          ))}
        </motion.div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="No products found"
        description="Try adjusting your filters or search terms to find what you're looking for."
        actionLabel="Clear Filters"
        actionHref="/products"
      />
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 [perspective:1200px]"
    >
      {products.map((product) => (
        <motion.div
          key={product.id}
          variants={cardVariants}
          layout
          whileHover={{
            y: -10,
            scale: 1.02,
            rotateY: 2,
            rotateX: -2,
            z: 10,
            transition: { type: "spring" as const, stiffness: 300, damping: 20 },
          }}
          whileTap={{ scale: 0.98 }}
          className="relative group rounded-3xl transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] will-change-transform transform-gpu"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 -z-10" />
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
