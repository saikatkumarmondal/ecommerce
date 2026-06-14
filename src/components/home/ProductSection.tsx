"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { useGetProductsQuery } from "@/services/productApi";
import { ProductFilters } from "@/types/product.types";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductSectionProps {
  title: string;
  subtitle: string;
  queryParams: ProductFilters;
  viewAllHref: string;
  variant?: "default" | "dark" | "accent";
}

export function ProductSection({
  title,
  subtitle,
  queryParams,
  viewAllHref,
  variant = "default",
}: ProductSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useGetProductsQuery(queryParams);
  const products = data?.data ?? [];

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "right" ? 280 : -280,
      behavior: "smooth",
    });
  };

  const sectionClass = cn(
    "py-16",
    variant === "dark" && "bg-gray-950 dark:bg-gray-900",
    variant === "accent" && "bg-primary/5"
  );

  const textClass = cn(
    variant === "dark" ? "text-white" : "text-foreground"
  );

  const subTextClass = cn(
    variant === "dark" ? "text-gray-400" : "text-muted-foreground"
  );

  return (
    <section className={sectionClass}>
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-primary font-semibold text-sm uppercase tracking-widest mb-1"
            >
              {subtitle}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={cn("text-3xl lg:text-4xl font-black", textClass)}
            >
              {title}
            </motion.h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className={cn(
                "w-9 h-9 rounded-full border flex items-center justify-center transition-colors hover:bg-primary hover:text-white hover:border-primary",
                variant === "dark"
                  ? "border-gray-700 text-gray-400"
                  : "border-border"
              )}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className={cn(
                "w-9 h-9 rounded-full border flex items-center justify-center transition-colors hover:bg-primary hover:text-white hover:border-primary",
                variant === "dark"
                  ? "border-gray-700 text-gray-400"
                  : "border-border"
              )}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <Link
              href={viewAllHref}
              className={cn(
                "hidden sm:flex items-center gap-1 text-sm font-medium hover:underline ml-2",
                variant === "dark" ? "text-gray-300" : "text-primary"
              )}
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-64">
                <ProductCardSkeleton />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No products found"
            description="Check back later for new arrivals"
          />
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
                className="flex-shrink-0 w-60 sm:w-64"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-6 text-center sm:hidden">
          <Link href={viewAllHref}>
            <Button
              variant={variant === "dark" ? "outline" : "default"}
              className={variant === "dark" ? "border-gray-700 text-white" : ""}
            >
              View All {title}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}