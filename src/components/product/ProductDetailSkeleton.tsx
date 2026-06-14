import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="w-20 h-20 rounded-xl flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}