"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useGetCategoriesQuery } from "@/services/categoryApi";
import { useGetBrandsQuery } from "@/services/brandApi";
import { Skeleton } from "@/components/ui/skeleton";

interface MegaMenuProps {
  isOpen: boolean;
  onClose?: () => void; // Highly recommended to handle clicking away or pressing Esc
}

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const { data: categories = [], isLoading: loadingCats } = useGetCategoriesQuery();
  const { data: brands = [], isLoading: loadingBrands } = useGetBrandsQuery();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-md z-40"
          />

          {/* 3D Modern Fly-out Modal Container */}
          <div className="fixed inset-x-0 top-16 md:top-20 z-50 flex justify-center px-4 pointer-events-none perspective-1000">
            <motion.div
              initial={{ 
                opacity: 0, 
                scale: 0.92, 
                rotateX: -15, 
                y: -20 
              }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotateX: 0, 
                y: 0 
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.95, 
                rotateX: -10, 
                y: -10 
              }}
              transition={{ 
                type: "spring" as const, 
                stiffness: 300, 
                damping: 24 
              }}
              className="pointer-events-auto w-full max-w-5xl origin-top bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] overflow-hidden transform-gpu"
            >
              {/* Dynamic light streak reflection effect at top boundary */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

              <div className="container mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
                
                {/* Categories */}
                <div className="md:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary/80 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Shop by Category
                  </p>
                  {loadingCats ? (
                    <div className="grid grid-cols-2 gap-3">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 rounded-lg" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/products?categoryId=${cat.id}`}
                          onClick={onClose}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-900/80 transition-all duration-200 group border border-transparent hover:border-gray-200/50 dark:hover:border-gray-800/50 hover:shadow-sm"
                        >
                          {cat.image && (
                            <div className="w-9 h-9 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-gray-100 dark:border-gray-800 group-hover:scale-105 transition-transform">
                              <Image
                                src={cat.image}
                                alt={cat.name}
                                width={36}
                                height={36}
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
                                {cat._count.products} items
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Brands */}
                <div className="md:col-span-2 flex flex-col justify-between gap-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-primary/80 mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
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
                            onClick={onClose}
                            className="flex flex-col items-center justify-center gap-2 px-2 py-3 rounded-xl border border-gray-200/60 dark:border-gray-800/60 bg-white/50 dark:bg-gray-900/50 hover:border-primary hover:bg-primary/5 transition-all duration-200 group hover:-translate-y-0.5 shadow-sm"
                          >
                            {brand.logo ? (
                              <Image
                                src={brand.logo}
                                alt={brand.name}
                                width={48}
                                height={24}
                                className="h-6 w-auto object-contain brightness-95 dark:brightness-110 group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <span className="text-lg font-bold text-muted-foreground">
                                {brand.name[0]}
                              </span>
                            )}
                            <span className="text-[11px] font-medium text-center truncate w-full px-1">{brand.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Promo Banner with Subtle 3D Depth */}
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/20 p-5 shadow-inner">
                    <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none" />
                    <p className="text-sm font-bold flex items-center gap-1.5 text-primary">
                      <span>🔥</span> Flash Sale
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
                      Up to 50% off on premium selected items. Limited time offer.
                    </p>
                    <Link
                      href="/products?onSale=true"
                      onClick={onClose}
                      className="text-xs text-white bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-lg font-medium mt-3 inline-block shadow-sm shadow-primary/20 transition-all transform hover:translate-x-0.5"
                    >
                      Shop now →
                    </Link>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
