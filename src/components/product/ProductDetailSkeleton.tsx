import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailSkeleton() {
  // Common 3D styling variables to keep it highly maintainable and clean
  const premium3DEffect = "relative overflow-hidden bg-gradient-to-br from-gray-200/80 via-gray-100 to-gray-200/50 dark:from-gray-900/80 dark:via-gray-950 dark:to-gray-900/50 border border-gray-200/30 dark:border-gray-800/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),_0_4px_12px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.03),_0_4px_24px_rgba(0,0,0,0.4)] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 dark:before:via-white/5 before:to-transparent before:animate-[shimmer_2s_infinite] transform-gpu";

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="space-y-4">
          {/* Main Product Image Placeholder with 3D Depth */}
          <div className="perspective-1000">
            <Skeleton className={`${premium3DEffect} aspect-square w-full rounded-2xl transform hover:rotate-x-1 hover:rotate-y-1 transition-transform duration-500`} />
          </div>
          
          {/* Thumbnails with a lifted, tactile appearance */}
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton 
                key={i} 
                className={`${premium3DEffect} w-20 h-20 rounded-xl flex-shrink-0 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05),_0_2px_6px_rgba(0,0,0,0.05)]`} 
              />
            ))}
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-5">
          {/* Badges */}
          <div className="flex gap-2">
            <Skeleton className={`${premium3DEffect} h-6 w-24 rounded-full`} />
            <Skeleton className={`${premium3DEffect} h-6 w-20 rounded-full`} />
          </div>
          
          {/* Title */}
          <Skeleton className={`${premium3DEffect} h-10 w-3/4 rounded-xl`} />
          
          {/* Rating/Meta */}
          <Skeleton className={`${premium3DEffect} h-5 w-40 rounded-lg`} />
          
          {/* Price Tag with a heavier 3D recess */}
          <Skeleton className={`${premium3DEffect} h-12 w-48 rounded-xl bg-gradient-to-br from-gray-300/50 to-gray-200/30 dark:from-gray-800/50 dark:to-gray-900/30`} />
          
          {/* Description Block */}
          <Skeleton className={`${premium3DEffect} h-20 w-full rounded-xl`} />
          
          {/* Action Buttons */}
          <Skeleton className={`${premium3DEffect} h-12 w-full rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)]`} />
          <Skeleton className={`${premium3DEffect} h-12 w-full rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)]`} />
        </div>
      </div>
    </div>
  );
}