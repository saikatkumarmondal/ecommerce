"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const { handleAddToCart, handleToggleWishlist, isAddingToCart } = useCartActions();
  const wishlistIds = useAppSelector((s) => s.wishlist.productIds);
  const isWishlisted = wishlistIds.includes(product.id);
  const isOutOfStock = product.stock === 0;
  const discountPercent =
    product.discountPrice
      ? calculateDiscountPercent(product.price, product.discountPrice)
      : 0;

  const imageUrl = product.images?.[0]?.url ?? "/placeholder.png";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300"
    >
      {/* Image Container */}
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-muted/30">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Quick View */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium shadow-lg">
              <Eye className="w-4 h-4" />
              Quick View
            </div>
          </motion.div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discountPercent > 0 && (
              <Badge className="bg-red-500 hover:bg-red-500 text-white font-bold px-2 py-0.5 text-xs">
                -{discountPercent}%
              </Badge>
            )}
            {product.isFeatured && (
              <Badge className="bg-amber-500 hover:bg-amber-500 text-white font-bold px-2 py-0.5 text-xs">
                Featured
              </Badge>
            )}
            {isOutOfStock && (
              <Badge variant="secondary" className="text-xs">
                Sold Out
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              handleToggleWishlist(product.id);
            }}
            className={cn(
              "absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-md",
              isWishlisted
                ? "bg-red-500 text-white"
                : "bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100"
            )}
          >
            <Heart
              className={cn("w-4 h-4", isWishlisted && "fill-current")}
            />
          </motion.button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <p className="text-xs text-muted-foreground mb-1">{product.brand?.name}</p>
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 hover:text-primary transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        <RatingStars
          rating={product.rating}
          totalReviews={product.totalReviews}
          size="sm"
        />

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            {product.discountPrice ? (
              <>
                <span className="font-black text-lg text-primary">
                  {formatPrice(product.discountPrice)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="font-black text-lg">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleAddToCart(product.id)}
            disabled={isOutOfStock || isAddingToCart}
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm",
              isOutOfStock
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary/90 hover:shadow-md"
            )}
          >
            <ShoppingCart className="w-4 h-4" />
          </motion.button>
        </div>

        {!isOutOfStock && product.stock <= 5 && (
          <p className="text-xs text-orange-500 font-medium mt-2">
            Only {product.stock} left!
          </p>
        )}
      </div>
    </motion.div>
  );
}