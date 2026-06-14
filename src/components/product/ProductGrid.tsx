"use client";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Product } from "@/types/product.types";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
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
      layout
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {products.map((product, idx) => (
        <motion.div
          key={product.id}
          layout
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.04 }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}