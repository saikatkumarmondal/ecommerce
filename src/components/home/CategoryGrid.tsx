"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useGetCategoriesQuery } from "@/services/categoryApi";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORY_COLORS = [
  "from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30",
  "from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30",
  "from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30",
  "from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30",
  "from-rose-500/20 to-red-500/20 hover:from-rose-500/30 hover:to-red-500/30",
  "from-indigo-500/20 to-violet-500/20 hover:from-indigo-500/30 hover:to-violet-500/30",
];

export function CategoryGrid() {
  const { data: categories = [], isLoading } = useGetCategoriesQuery();

  return (
    <section className="py-16 container mx-auto px-4">
      <div className="flex items-end justify-between mb-10">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-semibold text-sm uppercase tracking-widest mb-2"
          >
            Browse
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-4xl font-black"
          >
            Shop by Category
          </motion.h2>
        </div>
        <Link
          href="/products"
          className="hidden sm:flex items-center gap-1 text-sm text-primary font-medium hover:underline"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.07 }}
            >
              <Link href={`/products?categoryId=${cat.id}`}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`group relative rounded-2xl bg-gradient-to-br ${
                    CATEGORY_COLORS[idx % CATEGORY_COLORS.length]
                  } border border-border/50 p-5 text-center cursor-pointer transition-all duration-300 overflow-hidden h-36 flex flex-col items-center justify-center gap-3`}
                >
                  {cat.image ? (
                    <div className="w-14 h-14 rounded-xl overflow-hidden">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-white/50 flex items-center justify-center text-2xl font-black text-muted-foreground">
                      {cat.name[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-sm">{cat.name}</p>
                    {cat._count && (
                      <p className="text-xs text-muted-foreground">
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
    </section>
  );
}