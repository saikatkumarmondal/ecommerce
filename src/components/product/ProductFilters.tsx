"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Star, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useGetCategoriesQuery } from "@/services/categoryApi";
import { useGetBrandsQuery } from "@/services/brandApi";
import { ProductFilters as IProductFilters } from "@/types/product.types";
import { cn } from "@/lib/utils";

interface ProductFiltersProps {
  filters: IProductFilters;
  onFilterChange: (key: string, value: string | undefined) => void;
  onClearAll: () => void;
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b pb-4 mb-4 last:border-0">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center justify-between w-full mb-3 group"
      >
        <span className="font-semibold text-sm">{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProductFilters({
  filters,
  onFilterChange,
  onClearAll,
}: ProductFiltersProps) {
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: brands = [] } = useGetBrandsQuery();
  const [priceRange, setPriceRange] = useState([
    filters.minPrice ?? 0,
    filters.maxPrice ?? 2000,
  ]);

  const handlePriceCommit = (values: number[]) => {
    onFilterChange("minPrice", values[0] > 0 ? String(values[0]) : undefined);
    onFilterChange(
      "maxPrice",
      values[1] < 2000 ? String(values[1]) : undefined
    );
  };

  return (
    <div className="bg-card rounded-2xl border p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-base flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-xs text-red-500 hover:text-red-500 h-7"
        >
          Clear all
        </Button>
      </div>

      {/* Categories */}
      <FilterSection title="Category">
        <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
          {categories.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <Checkbox
                checked={filters.categoryId === cat.id}
                onCheckedChange={(checked) =>
                  onFilterChange("categoryId", checked ? cat.id : undefined)
                }
              />
              <span className="text-sm group-hover:text-primary transition-colors flex-1">
                {cat.name}
              </span>
              {cat._count && (
                <span className="text-xs text-muted-foreground">
                  ({cat._count.products})
                </span>
              )}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Brands */}
      <FilterSection title="Brand">
        <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
          {brands.map((brand) => (
            <label
              key={brand.id}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <Checkbox
                checked={filters.brandId === brand.id}
                onCheckedChange={(checked) =>
                  onFilterChange("brandId", checked ? brand.id : undefined)
                }
              />
              <span className="text-sm group-hover:text-primary transition-colors">
                {brand.name}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-4 px-1">
          <Slider
            min={0}
            max={2000}
            step={10}
            value={priceRange}
            onValueChange={setPriceRange}
            onValueCommit={handlePriceCommit}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm font-medium">
            <span className="bg-muted px-2 py-1 rounded-md">
              ${priceRange[0]}
            </span>
            <span className="text-muted-foreground">—</span>
            <span className="bg-muted px-2 py-1 rounded-md">
              ${priceRange[1]}
            </span>
          </div>
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Min Rating">
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <Checkbox
                checked={filters.minRating === rating}
                onCheckedChange={(checked) =>
                  onFilterChange(
                    "minRating",
                    checked ? String(rating) : undefined
                  )
                }
              />
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-3.5 h-3.5",
                      i < rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-200 text-gray-200"
                    )}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-1">
                  & up
                </span>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability">
        <div className="space-y-2.5">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <Checkbox
              checked={filters.inStock === true}
              onCheckedChange={(checked) =>
                onFilterChange("inStock", checked ? "true" : undefined)
              }
            />
            <span className="text-sm">In Stock Only</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <Checkbox
              checked={filters.onSale === true}
              onCheckedChange={(checked) =>
                onFilterChange("onSale", checked ? "true" : undefined)
              }
            />
            <span className="text-sm">On Sale</span>
          </label>
        </div>
      </FilterSection>
    </div>
  );
}