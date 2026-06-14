"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useGetCategoriesQuery } from "@/services/categoryApi";
import { useGetBrandsQuery } from "@/services/brandApi";
import { Skeleton } from "@/components/ui/skeleton";

interface MegaMenuProps {
  isOpen: boolean;
}

export function MegaMenu({ isOpen }: MegaMenuProps) {
  const { data: categories = [], isLoading: loadingCats } = useGetCategoriesQuery();
  const { data: brands = [], isLoading: loadingBrands } = useGetBrandsQuery();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="absolute top-full left-0 right-0 bg-white dark:bg-gray-950 shadow-2xl border-t z-50"
        >
          <div className="container mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Categories */}
            <div className="col-span-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Shop by Category
              </p>
              {loadingCats ? (
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?categoryId=${cat.id}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors group"
                    >
                      {cat.image && (
                        <div className="w-8 h-8 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium group-hover:text-primary transition-colors">
                          {cat.name}
                        </p>
                        {cat._count && (
                          <p className="text-xs text-muted-foreground">
                            {cat._count.products} products
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Brands */}
            <div className="col-span-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Top Brands
              </p>
              {loadingBrands ? (
                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {brands.slice(0, 6).map((brand) => (
                    <Link
                      key={brand.id}
                      href={`/products?brandId=${brand.id}`}
                      className="flex flex-col items-center gap-2 px-3 py-3 rounded-xl border hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                      {brand.logo ? (
                        <Image
                          src={brand.logo}
                          alt={brand.name}
                          width={48}
                          height={24}
                          className="h-6 w-auto object-contain"
                        />
                      ) : (
                        <span className="text-lg font-bold text-muted-foreground">
                          {brand.name[0]}
                        </span>
                      )}
                      <span className="text-xs font-medium">{brand.name}</span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Promo banner */}
              <div className="mt-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 p-4">
                <p className="text-sm font-semibold">🔥 Flash Sale</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Up to 50% off on selected items
                </p>
                <Link
                  href="/products?onSale=true"
                  className="text-xs text-primary font-medium mt-2 inline-block hover:underline"
                >
                  Shop now →
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}