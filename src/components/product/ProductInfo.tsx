"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart, Heart, Zap, Shield, RefreshCw,
  Truck, Minus, Plus, Share2, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RatingStars } from "@/components/shared/RatingStars";
import { useCartActions } from "@/hooks/useCartActions";
import { useAppSelector } from "@/store/hooks";
import { Product } from "@/types/product.types";
import { formatPrice, calculateDiscountPercent } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreateCheckoutSessionMutation } from "@/services/orderApi";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isCopied, setIsCopied] = useState(false);

  const { handleAddToCart, handleToggleWishlist, isAddingToCart } =
    useCartActions();
  const wishlistIds = useAppSelector((s) => s.wishlist.productIds);
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const isWishlisted = wishlistIds.includes(product.id);
  const isOutOfStock = product.stock === 0;

  const discountPercent = product.discountPrice
    ? calculateDiscountPercent(product.price, product.discountPrice)
    : 0;

  const handleQtyDecrease = () =>
    setQuantity((q) => Math.max(1, q - 1));
  const handleQtyIncrease = () =>
    setQuantity((q) => Math.min(product.stock, q + 1));

  const handleAddToCartWithQty = async () => {
    await handleAddToCart(product.id, quantity);
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const FEATURES = [
    { icon: Truck, label: "Free shipping over $50" },
    { icon: RefreshCw, label: "30-day easy returns" },
    { icon: Shield, label: "2-year warranty" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              {product.category?.name}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {product.brand?.name}
            </Badge>
            {product.isFeatured && (
              <Badge className="text-xs bg-amber-500 hover:bg-amber-500">
                ⭐ Featured
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
            onClick={handleShare}
          >
            {isCopied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </Button>
        </div>

        <h1 className="text-2xl lg:text-3xl font-black leading-tight mb-3">
          {product.name}
        </h1>

        <div className="flex items-center gap-4">
          <RatingStars
            rating={product.rating}
            totalReviews={product.totalReviews}
            size="md"
          />
          <span className="text-sm text-muted-foreground">
            SKU: {product.sku}
          </span>
        </div>
      </div>

      <Separator />

      {/* Price */}
      <div className="flex items-end gap-4">
        {product.discountPrice ? (
          <>
            <span className="text-4xl font-black text-primary">
              {formatPrice(product.discountPrice)}
            </span>
            <span className="text-xl text-muted-foreground line-through pb-0.5">
              {formatPrice(product.price)}
            </span>
            <Badge className="bg-red-500 hover:bg-red-500 text-white font-bold mb-0.5">
              -{discountPercent}% OFF
            </Badge>
          </>
        ) : (
          <span className="text-4xl font-black">
            {formatPrice(product.price)}
          </span>
        )}
      </div>

      {/* Short Description */}
      <p className="text-muted-foreground leading-relaxed">
        {product.shortDescription}
      </p>

      <Separator />

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        <div
          className={`w-2.5 h-2.5 rounded-full ${
            isOutOfStock
              ? "bg-red-500"
              : product.stock <= 5
              ? "bg-orange-500"
              : "bg-green-500"
          }`}
        />
        <span
          className={`text-sm font-semibold ${
            isOutOfStock
              ? "text-red-500"
              : product.stock <= 5
              ? "text-orange-500"
              : "text-green-600"
          }`}
        >
          {isOutOfStock
            ? "Out of Stock"
            : product.stock <= 5
            ? `Only ${product.stock} left in stock!`
            : `In Stock (${product.stock} available)`}
        </span>
      </div>

      {/* Quantity + Actions */}
      {!isOutOfStock && (
        <div className="space-y-4">
          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center border rounded-xl overflow-hidden">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleQtyDecrease}
                disabled={quantity <= 1}
                className="px-3 py-2 hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4" />
              </motion.button>
              <span className="px-5 py-2 font-bold text-sm border-x min-w-[48px] text-center">
                {quantity}
              </span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleQtyIncrease}
                disabled={quantity >= product.stock}
                className="px-3 py-2 hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
            <span className="text-sm text-muted-foreground">
              Total:{" "}
              <span className="font-bold text-foreground">
                {formatPrice(
                  (product.discountPrice ?? product.price) * quantity
                )}
              </span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                className="w-full h-12 font-bold rounded-xl gap-2"
                onClick={handleAddToCartWithQty}
                disabled={isAddingToCart}
              >
                <ShoppingCart className="w-5 h-5" />
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </Button>
            </motion.div>

            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                variant="outline"
                className="w-full h-12 font-bold rounded-xl gap-2"
                onClick={() => {
                  if (!isAuthenticated) {
                    router.push("/login");
                    return;
                  }
                  handleAddToCartWithQty().then(() => {
                    router.push("/checkout");
                  });
                }}
              >
                <Zap className="w-5 h-5" />
                Buy Now
              </Button>
            </motion.div>
          </div>

          {/* Wishlist */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => handleToggleWishlist(product.id)}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all duration-200 text-sm font-semibold ${
              isWishlisted
                ? "border-red-200 bg-red-50 text-red-500 dark:bg-red-950/30"
                : "border-border hover:border-red-200 hover:bg-red-50 hover:text-red-500"
            }`}
          >
            <Heart
              className={`w-4 h-4 ${isWishlisted ? "fill-red-500" : ""}`}
            />
            {isWishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
          </motion.button>
        </div>
      )}

      {/* Features */}
      <div className="grid grid-cols-3 gap-3 pt-2">
        {FEATURES.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center text-center gap-2 p-3 rounded-xl bg-muted/40"
          >
            <Icon className="w-5 h-5 text-primary" />
            <span className="text-xs text-muted-foreground leading-tight">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}