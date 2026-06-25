"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product.types";

// Floating animation fix
const repeatingFloat = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut" as const,   // ✅ এখানে ফিক্স করা হয়েছে
    },
  },
};

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (productId: string) => void;
  isWishlisted?: boolean;
}

export function ProductCard({ 
  product, 
  onAddToCart, 
  onToggleWishlist, 
  isWishlisted = false 
}: ProductCardProps) {
  
  const discountPercent = product.discountPrice 
    ? Math.round(((Number(product.price) - Number(product.discountPrice)) / Number(product.price)) * 100) 
    : 0;

  const finalPrice = product.discountPrice ? Number(product.discountPrice) : Number(product.price);

  return (
    <motion.div 
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group relative bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Discount Badge */}
      <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
        {discountPercent > 0 && (
          <motion.div variants={repeatingFloat} animate="animate">
            <Badge className="bg-rose-500 hover:bg-rose-500 text-white font-black px-2.5 py-1 text-xs shadow-md">
              SAVE {discountPercent}%
            </Badge>
          </motion.div>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={() => onToggleWishlist?.(product.id)}
        className="absolute top-3 right-3 z-20 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
      >
        <Heart 
          className={`w-4 h-4 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} 
        />
      </button>

      {/* Product Image */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={product.images?.[0]?.url || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="font-semibold text-base line-clamp-2 min-h-[2.5em] group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center text-amber-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium text-gray-700 ml-1">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-gray-500">({product.totalReviews})</span>
        </div>

        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-xl font-bold">৳{finalPrice}</span>
          {product.discountPrice && (
            <span className="text-sm text-gray-500 line-through">৳{product.price}</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={() => onAddToCart?.(product)}
          className="w-full mt-4 bg-black hover:bg-gray-800 text-white rounded-2xl py-2.5 text-sm font-medium flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
}