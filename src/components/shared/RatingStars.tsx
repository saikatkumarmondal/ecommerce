"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  totalReviews?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
}

export function RatingStars({
  rating,
  totalReviews,
  size = "sm",
  showCount = true,
}: RatingStarsProps) {
  const sizeMap = { sm: "w-3.5 h-3.5", md: "w-4 h-4", lg: "w-5 h-5" };
  const textMap = { sm: "text-xs", md: "text-sm", lg: "text-base" };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeMap[size],
              star <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200"
            )}
          />
        ))}
      </div>
      {showCount && totalReviews !== undefined && (
        <span className={cn(textMap[size], "text-muted-foreground")}>
          ({totalReviews})
        </span>
      )}
    </div>
  );
}