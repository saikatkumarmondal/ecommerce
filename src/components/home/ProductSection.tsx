"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { useGetProductsQuery } from "@/services/productApi";
import { ProductFilters } from "@/types/product.types";

interface ProductSectionProps {
  title: string;
  subtitle: string;
  queryParams: ProductFilters;
  viewAllHref: string;
}

export function ProductSection({
  title,
  subtitle,
  queryParams,
  viewAllHref,
}: ProductSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useGetProductsQuery(queryParams);
  const products = data?.data ?? [];

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const offsetWidth = scrollRef.current.offsetWidth;
    scrollRef.current.scrollBy({
      left: dir === "right" ? offsetWidth * 0.75 : -offsetWidth * 0.75,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-24 w-full bg-white text-black light relative overflow-visible">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Layout */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-amber-600 font-extrabold text-xs uppercase tracking-widest mb-2"
            >
              {subtitle}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-black"
            >
              {title}
            </motion.h2>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4 self-end sm:self-auto">
            <Link
              href={viewAllHref}
              className="group flex items-center gap-1.5 text-sm font-bold text-black hover:text-amber-600 transition-colors mr-2"
            >
              View all{" "}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
            
            <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-full border border-zinc-200">
              <button
                onClick={() => scroll("left")}
                aria-label="Scroll Left"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-black border border-zinc-200 hover:bg-black hover:text-white hover:border-black shadow-sm transition-all active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => scroll("right")}
                aria-label="Scroll Right"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-black border border-zinc-200 hover:bg-black hover:text-white hover:border-black shadow-sm transition-all active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Content */}
        {isLoading ? (
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-72 sm:w-85 h-[420px] bg-zinc-100 rounded-[2.5rem]" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="p-16 rounded-[2.5rem] border-2 border-dashed border-zinc-200 text-center bg-zinc-50/50">
            <EmptyState
              icon={ShoppingBag}
              title="No products found"
              description="Check back later for new arrivals"
            />
          </div>
        ) : (
          <div className="relative w-full overflow-visible [perspective:1400px]">
            <div
              ref={scrollRef}
              className="flex gap-8 overflow-x-auto pb-10 pt-4 px-2 scroll-smooth snap-x snap-mandatory"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {products.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 60, rotateY: 12 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{
                    type: "spring",
                    stiffness: 85,
                    damping: 16,
                    delay: idx * 0.04,
                  }}
                  whileHover={{ 
                    y: -14,
                    scale: 1.03,
                    rotateX: 6,
                    rotateY: -4,
                    z: 25
                  }}
                  className="flex-shrink-0 w-72 sm:w-85 snap-start p-4 bg-white border-2 border-zinc-100 hover:border-zinc-300 rounded-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] transition-shadow duration-300 [transform-style:preserve-3d]"
                >
                  {/* Clean white card content container forcing text to be black */}
                  <div className="[transform:translateZ(35px)] w-full text-black bg-white">
                    <ProductCard product={product} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="mt-6 text-center sm:hidden">
          <Link href={viewAllHref} className="block w-full">
            <Button
              variant="default"
              className="w-full h-13 rounded-2xl text-sm font-bold uppercase tracking-wider bg-black text-white hover:bg-zinc-800"
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