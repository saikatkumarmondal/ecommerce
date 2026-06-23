"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/shared/RatingStars";
import { useAppSelector } from "@/store/hooks";
import { useCartActions } from "@/hooks/useCartActions";
import { Product } from "@/types/product.types";
import { formatPrice, calculateDiscountPercent } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact";
}

// Infinite smooth floating animation for badges
const repeatingFloat = {
  animate: {
    y: [0, -6, 0],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const { handleAddToCart, handleToggleWishlist, isAddingToCart } = useCartActions();
  const wishlistIds = useAppSelector((s) => s.wishlist.productIds);
  const isWishlisted = wishlistIds.includes(product.id);
  const isOutOfStock = product.stock === 0;
  const discountPercent = product.discountPrice
    ? calculateDiscountPercent(product.price, product.discountPrice)
    : 0;

  const imageUrl = product.images?.[0]?.url ?? "/placeholder.png";

  return (
    <motion.div
      whileHover={{ 
        y: -12,
        x: 4,
        rotateX: 3,
        rotateY: -3,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "group relative bg-background rounded-3xl border-2 border-slate-800/80 overflow-hidden dark:border-white/10",
        "shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]",
        "hover:shadow-[12px_12px_0px_0px_#6366f1] dark:hover:shadow-[12px_12px_0px_0px_#a855f7]",
        "transition-all duration-300 ease-out transform-gpu [transform-style:preserve-3d]",
        variant === "compact" ? "p-2" : "p-0"
      )}
    >
      {/* Image Container with 3D Depth */}
      <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-900 m-3 rounded-2xl border border-slate-100 dark:border-slate-800 [transform:translateZ(20px)]">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
            priority={product.isFeatured}
          />

          {/* Neo Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* Quick View Button - Adaptive Mobile Layout (Visible instantly on mobile, hover on desktop) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 md:group-hover:opacity-100 pointer-events-none md:pointer-events-auto transition-all duration-300">
          <Link href={`/products/${product.slug}`}>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs font-bold shadow-xl border border-slate-200 dark:border-slate-700 cursor-pointer pointer-events-auto"
            >
              <Eye className="w-3.5 h-3.5 stroke-[2.5]" />
              QUICK VIEW
            </motion.div>
          </Link>
        </div>

        {/* Repeating Animated Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {discountPercent > 0 && (
            <motion.div variants={repeatingFloat} animate="animate">
              <Badge className="bg-rose-500 hover:bg-rose-500 text-white font-black px-2.5 py-1 rounded-lg text-[10px] tracking-wider border border-rose-600 shadow-md">
                SAVE {discountPercent}%
              </Badge>
            </motion.div>
          )}
          {product.isFeatured && (
            <motion.div variants={repeatingFloat} animate="animate" transition={{ delay: 0.2 }}>
              <Badge className="bg-cyan-500 hover:bg-cyan-500 text-slate-950 font-black px-2.5 py-1 rounded-lg text-[10px] tracking-wider border border-cyan-600 shadow-md">
                POPULAR
              </Badge>
            </motion.div>
          )}
          {isOutOfStock && (
            <Badge className="bg-slate-800 text-slate-400 font-bold px-2.5 py-1 rounded-lg text-[10px] border border-slate-700">
              SOLD OUT
            </Badge>
          )}
        </div>

        {/* Wishlist Button - Clean execution across viewport triggers */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.preventDefault();
            handleToggleWishlist(product.id);
          }}
          className={cn(
            "absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg border backdrop-blur-md z-10",
            "opacity-100 md:opacity-0 md:group-hover:opacity-100", // Responsive visibility rule
            isWishlisted
              ? "bg-rose-500 text-white border-rose-600"
              : "bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-rose-500 hover:text-white"
          )}
        >
          <Heart className={cn("w-4 h-4 transition-transform duration-300 group-active:scale-120", isWishlisted && "fill-current")} />
        </motion.button>
      </div>

      {/* Info Section */}
      <div className="p-5 pt-2 [transform:translateZ(10px)]">
        <Link href={`/products/${product.slug}`} className="space-y-1">
          <p className="text-[10px] uppercase font-black tracking-widest text-indigo-500 dark:text-cyan-400">
            {product.brand?.name || "Premium Edition"}
          </p>
          <h3 className="font-bold text-sm tracking-tight text-slate-800 dark:text-slate-100 line-clamp-2 min-h-[40px] group-hover:text-indigo-600 dark:group-hover:text-purple-400 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="py-1">
          <RatingStars rating={product.rating} totalReviews={product.totalReviews} size="sm" />
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between mt-4 pt-2 border-t border-dashed border-slate-200 dark:border-slate-800">
          <div className="flex flex-col">
            {product.discountPrice ? (
              <>
                <span className="text-xs text-slate-400 line-through font-medium">
                  {formatPrice(product.price)}
                </span>
                <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight">
                  {formatPrice(product.discountPrice)}
                </span>
              </>
            ) : (
              <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Interactive Cart Button */}
          <motion.button
            whileHover={!isOutOfStock && !isAddingToCart ? { scale: 1.1, rotate: -4 } : {}}
            whileTap={!isOutOfStock && !isAddingToCart ? { scale: 0.9 } : {}}
            onClick={() => handleAddToCart(product.id)}
            disabled={isOutOfStock || isAddingToCart}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 border-2",
              isOutOfStock
                ? "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 cursor-not-allowed"
                : "bg-indigo-600 text-white border-indigo-700 shadow-[2px_2px_0px_0px_#1e1b4b] hover:bg-indigo-500 hover:shadow-none dark:bg-purple-600 dark:border-purple-700 dark:shadow-[2px_2px_0px_0px_#2e1065] dark:hover:bg-purple-500"
            )}
          >
            <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
          </motion.button>
        </div>

        {/* Low Stock Micro-Warning */}
        {!isOutOfStock && product.stock <= 5 && (
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Only {product.stock} left in stock!
          </div>
        )}
      </div>
    </motion.div>
  );
}