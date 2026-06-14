"use client";

import { SlidersHorizontal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PaginationMeta } from "@/types/api.types";
import { SORT_OPTIONS } from "@/lib/constants";

interface ProductSortBarProps {
  meta?: PaginationMeta;
  sortBy: string;
  onSortChange: (value: string) => void;
  activeFilterCount: number;
  onOpenMobileFilter: () => void;
  isFetching: boolean;
}

export function ProductSortBar({
  meta,
  sortBy,
  onSortChange,
  activeFilterCount,
  onOpenMobileFilter,
  isFetching,
}: ProductSortBarProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-5 bg-muted/30 rounded-xl p-3">
      <div className="flex items-center gap-3">
        {/* Mobile Filter Button */}
        <Button
          variant="outline"
          size="sm"
          className="lg:hidden gap-2"
          onClick={onOpenMobileFilter}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px] rounded-full">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {/* Results Count */}
        <div className="flex items-center gap-2">
          {isFetching && (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          )}
          {meta && (
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {meta.total}
              </span>{" "}
              products
            </p>
          )}
        </div>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground hidden sm:block">
          Sort by:
        </span>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-44 h-9 text-sm rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}