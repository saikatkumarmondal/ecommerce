"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useGetBrandsQuery } from "@/services/brandApi";
import { Skeleton } from "@/components/ui/skeleton";

export function BrandSection() {
  const { data: brands = [], isLoading } = useGetBrandsQuery();

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-semibold text-sm uppercase tracking-widest mb-2"
          >
            Trusted By
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-4xl font-black"
          >
            Top Brands
          </motion.h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {brands.map((brand, idx) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
              >
                <Link href={`/products?brandId=${brand.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="group h-20 bg-white dark:bg-gray-900 rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg flex items-center justify-center p-4 transition-all duration-200"
                  >
                    {brand.logo ? (
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        width={80}
                        height={32}
                        className="h-8 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    ) : (
                      <span className="font-black text-lg text-muted-foreground group-hover:text-primary transition-colors">
                        {brand.name}
                      </span>
                    )}
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