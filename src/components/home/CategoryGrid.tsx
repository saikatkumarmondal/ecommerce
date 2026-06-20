"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useGetCategoriesQuery } from "@/services/categoryApi";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORY_COLORS = [
  "from-blue-500/10 to-indigo-500/10 hover:from-blue-600/20 hover:to-indigo-600/20 border-blue-500/20 shadow-blue-500/5",
  "from-purple-500/10 to-fuchsia-500/10 hover:from-purple-600/20 hover:to-fuchsia-600/20 border-purple-500/20 shadow-purple-500/5",
  "from-amber-500/10 to-orange-500/10 hover:from-amber-600/20 hover:to-orange-600/20 border-amber-500/20 shadow-amber-500/5",
  "from-emerald-500/10 to-teal-500/10 hover:from-emerald-600/20 hover:to-teal-600/20 border-emerald-500/20 shadow-emerald-500/5",
  "from-rose-500/10 to-pink-500/10 hover:from-rose-600/20 hover:to-pink-600/20 border-rose-500/20 shadow-rose-500/5",
  "from-violet-500/10 to-purple-500/10 hover:from-violet-600/20 hover:to-purple-600/20 border-violet-500/20 shadow-violet-500/5",
];

export function CategoryGrid() {
  const { data: categories = [], isLoading } = useGetCategoriesQuery();

  return (
    <section className="py-24 w-full px-4 max-w-[1700px] mx-auto overflow-visible">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold text-xs uppercase tracking-widest mb-3"
          >
            Our Collections
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black tracking-tight text-foreground"
          >
            Shop by Category
          </motion.h2>
        </div>
        <Link
          href="/products"
          className="group inline-flex items-center gap-2 text-sm text-primary font-bold hover:opacity-80 transition-opacity self-start sm:self-auto"
        >
          View all categories
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </Link>
      </div>

      {/* Grid Container */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-[2.5rem]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8 [perspective:1200px]">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ 
                type: "spring",
                stiffness: 80,
                damping: 18,
                delay: idx * 0.04 
              }}
              className="h-full"
            >
              <Link href={`/products?categoryId=${cat.id}`} className="block h-full group">
                <motion.div
                  whileHover={{ 
                    y: -14, 
                    scale: 1.03,
                    rotateX: 8,
                    rotateY: -6,
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 180, 
                    damping: 14 
                  }}
                  className={`relative rounded-[2.5rem] bg-gradient-to-br border-2 p-8 text-center cursor-pointer h-64 flex flex-col items-center justify-center gap-5 shadow-lg hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] transition-all duration-300 [transform-style:preserve-3d] ${
                    CATEGORY_COLORS[idx % CATEGORY_COLORS.length]
                  }`}
                >
                  {/* Premium 3D Base Shadow Plate */}
                  <div className="absolute inset-0 rounded-[2.5rem] bg-current opacity-0 group-hover:opacity-[0.03] pointer-events-none transition-opacity duration-300 [transform:translateZ(-10px)]" />

                  {/* Image wrapper with extreme depth perspective popping */}
                  {cat.image ? (
                    <div className="w-28 h-28 rounded-3xl overflow-hidden shadow-md group-hover:shadow-2xl transition-all duration-500 [transform:translateZ(40px)] border-4 border-white dark:border-zinc-900 bg-background">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        width={112}
                        height={112}
                        className="w-full h-full object-cover scale-100 group-hover:scale-115 transition-transform duration-500 ease-out"
                        priority={idx < 6}
                      />
                    </div>
                  ) : (
                    <div className="w-28 h-28 rounded-3xl bg-background border-4 border-white dark:border-zinc-900 flex items-center justify-center text-4xl font-black text-muted-foreground shadow-md group-hover:shadow-xl transition-all duration-500 [transform:translateZ(40px)]">
                      {cat.name[0]}
                    </div>
                  )}

                  {/* Typography Layer */}
                  <div className="[transform:translateZ(30px)]">
                    <p className="font-black text-lg tracking-tight mb-1 text-foreground group-hover:text-primary transition-colors duration-200">
                      {cat.name}
                    </p>
                    {cat._count && (
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                        {cat._count.products} Products
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