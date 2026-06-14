"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductSortBar } from "@/components/product/ProductSortBar";
import { useGetProductsQuery } from "@/services/productApi";
import { useDebounce } from "@/hooks/useDebounce";
import { Pagination } from "@/components/shared/Pagination";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { ProductFilters as IProductFilters } from "@/types/product.types";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? ""
  );
  const debouncedSearch = useDebounce(searchInput, 500);

  const filters: IProductFilters = {
    search: debouncedSearch || undefined,
    categoryId: searchParams.get("categoryId") ?? undefined,
    brandId: searchParams.get("brandId") ?? undefined,
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    minRating: searchParams.get("minRating")
      ? Number(searchParams.get("minRating"))
      : undefined,
    inStock: searchParams.get("inStock") === "true" ? true : undefined,
    onSale: searchParams.get("onSale") === "true" ? true : undefined,
    isFeatured: searchParams.get("isFeatured") === "true" ? true : undefined,
    sortBy:
      (searchParams.get("sortBy") as IProductFilters["sortBy"]) ?? "newest",
    page: Number(searchParams.get("page") ?? "1"),
    limit: ITEMS_PER_PAGE,
  };

  const { data, isLoading, isFetching } = useGetProductsQuery(filters);
  const products = data?.data ?? [];
  const meta = data?.meta;

  // Active filter count
  const activeFilterCount = [
    filters.categoryId,
    filters.brandId,
    filters.minPrice,
    filters.maxPrice,
    filters.minRating,
    filters.inStock,
    filters.onSale,
  ].filter(Boolean).length;

  const updateParam = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    router.push(`/products?${params.toString()}`);
  };

  // Sync search input to URL
  useEffect(() => {
    updateParam("search", debouncedSearch || undefined);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-black mb-2">All Products</h1>
            <p className="text-muted-foreground">
              {meta?.total
                ? `${meta.total} products found`
                : "Discover our collection"}
            </p>
          </motion.div>

          {/* Mobile Search */}
          <div className="mt-4 relative sm:hidden">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <ProductFilters
              filters={filters}
              onFilterChange={updateParam}
              onClearAll={clearAllFilters}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Sort Bar */}
            <ProductSortBar
              meta={meta}
              sortBy={filters.sortBy ?? "newest"}
              onSortChange={(val) => updateParam("sortBy", val)}
              activeFilterCount={activeFilterCount}
              onOpenMobileFilter={() => setIsFilterOpen(true)}
              isFetching={isFetching}
            />

            {/* Active Filters */}
            <AnimatePresence>
              {activeFilterCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap gap-2 mb-4"
                >
                  {filters.categoryId && (
                    <Badge
                      variant="secondary"
                      className="gap-1 cursor-pointer"
                      onClick={() => updateParam("categoryId", undefined)}
                    >
                      Category <X className="w-3 h-3" />
                    </Badge>
                  )}
                  {filters.brandId && (
                    <Badge
                      variant="secondary"
                      className="gap-1 cursor-pointer"
                      onClick={() => updateParam("brandId", undefined)}
                    >
                      Brand <X className="w-3 h-3" />
                    </Badge>
                  )}
                  {(filters.minPrice || filters.maxPrice) && (
                    <Badge
                      variant="secondary"
                      className="gap-1 cursor-pointer"
                      onClick={() => {
                        updateParam("minPrice", undefined);
                        updateParam("maxPrice", undefined);
                      }}
                    >
                      Price Range <X className="w-3 h-3" />
                    </Badge>
                  )}
                  {filters.inStock && (
                    <Badge
                      variant="secondary"
                      className="gap-1 cursor-pointer"
                      onClick={() => updateParam("inStock", undefined)}
                    >
                      In Stock <X className="w-3 h-3" />
                    </Badge>
                  )}
                  {filters.onSale && (
                    <Badge
                      variant="secondary"
                      className="gap-1 cursor-pointer"
                      onClick={() => updateParam("onSale", undefined)}
                    >
                      On Sale <X className="w-3 h-3" />
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs text-red-500 hover:text-red-500"
                    onClick={clearAllFilters}
                  >
                    Clear all
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Products Grid */}
            <ProductGrid
              products={products}
              isLoading={isLoading || isFetching}
            />

            {/* Pagination */}
            {meta && (
              <Pagination
                meta={meta}
                onPageChange={(page) =>
                  updateParam("page", String(page))
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setIsFilterOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-950 z-50 overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFilterOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="p-4">
                <ProductFilters
                  filters={filters}
                  onFilterChange={updateParam}
                  onClearAll={clearAllFilters}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}