"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useGetBrandsQuery } from "@/services/brandApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Award } from "lucide-react";

export function BrandSection() {
  const { data: brands = [], isLoading } = useGetBrandsQuery();

  return (
    <section className="py-24 bg-gradient-to-b from-zinc-50/50 via-white to-zinc-50/50 dark:from-zinc-950 dark:via-zinc-900/40 dark:to-zinc-950 border-y border-zinc-100 dark:border-zinc-800/60 overflow-visible">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4 shadow-sm"
          >
            <Award className="w-3.5 h-3.5" />
            Trusted Partners
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground"
          >
            Shop Official Brands
          </motion.h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-xl">
            We partner directly with top world manufacturers to guarantee 100% authentic premium goods.
          </p>
        </div>

        {/* Dynamic Grid System */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8 [perspective:1000px]">
            {brands.map((brand, idx) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ 
                  type: "spring",
                  stiffness: 90,
                  damping: 16,
                  delay: idx * 0.04 
                }}
              >
                <Link href={`/products?brandId=${brand.id}`} className="block h-full group">
                  <motion.div
                    whileHover={{ 
                      scale: 1.05, 
                      y: -8,
                      rotateX: 6,
                      rotateY: -4,
                      z: 15
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 14 
                    }}
                    className="relative h-32 w-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-[2rem] p-6 flex flex-col items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-300 [transform-style:preserve-3d]"
                  >
                    {/* Interior High-Gloss Active Light Ring */}
                    <div className="absolute inset-0 rounded-[2rem] border-2 border-transparent group-hover:border-primary/20 pointer-events-none transition-colors duration-300" />
                    
                    {brand.logo ? (
                      <div className="w-full h-full flex items-center justify-center relative [transform:translateZ(25px)] transition-transform duration-300">
                        <Image
                          src={brand.logo}
                          alt={brand.name}
                          width={140}
                          height={56}
                          className="max-h-14 max-w-[85%] w-auto h-auto object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out"
                          priority={idx < 6}
                        />
                      </div>
                    ) : (
                      <div className="text-center [transform:translateZ(20px)]">
                        <span className="font-black text-lg sm:text-xl text-muted-foreground/80 tracking-tight group-hover:text-primary transition-colors duration-200 block truncate max-w-full px-2">
                          {brand.name}
                        </span>
                      </div>
                    )}

                    {/* Minimalist interactive badge layer */}
                    <div className="absolute bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 hidden sm:block">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-2 py-0.5 rounded-full">
                        Explore →
                      </span>
                    </div>

                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}