"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useGetCategoriesQuery } from "@/services/categoryApi";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = [
  "bg-blue-50 border-blue-100 hover:border-blue-300",
  "bg-purple-50 border-purple-100 hover:border-purple-300",
  "bg-amber-50 border-amber-100 hover:border-amber-300",
  "bg-emerald-50 border-emerald-100 hover:border-emerald-300",
  "bg-rose-50 border-rose-100 hover:border-rose-300",
  "bg-violet-50 border-violet-100 hover:border-violet-300",
];

export function CategoryGrid() {
  const { data: categories = [], isLoading } = useGetCategoriesQuery();

  return (
    <section className="py-16 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-primary font-bold text-xs uppercase tracking-widest mb-2">
            Collections
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            Shop by Category
          </h2>
        </div>
        <Link
          href="/products"
          className="group hidden sm:flex items-center gap-1.5 text-sm font-bold text-primary hover:opacity-80 transition-opacity"
        >
          View all
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link href={`/products?categoryId=${cat.id}`}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
                  className={`relative rounded-2xl border-2 p-4 text-center cursor-pointer flex flex-col items-center justify-center gap-3 h-40 transition-colors duration-200 ${COLORS[idx % COLORS.length]}`}
                >
                  {cat.image ? (
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-sm">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center text-2xl font-black text-muted-foreground shadow-sm">
                      {cat.name[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-sm tracking-tight text-foreground line-clamp-1">
                      {cat.name}
                    </p>
                    {cat._count && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {cat._count.products} items
                      </p>
                    )}
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Mobile view all */}
      <div className="mt-6 sm:hidden text-center">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-primary"
        >
          View all categories
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}