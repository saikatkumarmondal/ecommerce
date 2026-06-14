"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaginationMeta } from "@/types/api.types";

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  const { page, totalPages } = meta;
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2
  );

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {pages.map((p, idx) => {
        const prev = pages[idx - 1];
        return (
          <span key={p} className="flex items-center gap-2">
            {prev && p - prev > 1 && (
              <span className="text-muted-foreground px-1">...</span>
            )}
            <Button
              variant={p === page ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(p)}
            >
              {p}
            </Button>
          </span>
        );
      })}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}