"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { RatingStars } from "@/components/shared/RatingStars";
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from "@/services/wishlistApi";
import { useAppDispatch } from "@/store/hooks";
import { setWishlist } from "@/store/slices/wishlistSlice";
import { useCartActions } from "@/hooks/useCartActions";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

function WishlistContent() {
  const dispatch = useAppDispatch();
  const { data: items = [], isLoading } = useGetWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const { handleAddToCart } = useCartActions();

  useEffect(() => {
    if (items.length > 0) {
      dispatch(setWishlist(items.map((i) => i.productId)));
    }
  }, [items, dispatch]);

  const handleRemove = async (productId: string) => {
    try {
      await removeFromWishlist(productId).unwrap();
      toast.success("Removed from wishlist");
    } catch {
      toast.error("Failed to remove");
    }
  };

  const handleMoveToCart = async (productId: string) => {
    await handleAddToCart(productId, 1);
    await handleRemove(productId);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <h1 className="text-3xl font-black flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          My Wishlist
          <span className="text-lg font-normal text-muted-foreground">
            ({items.length} {items.length === 1 ? "item" : "items"})
          </span>
        </h1>
        <Link href="/products">
          <Button variant="outline" size="sm">Continue Shopping</Button>
        </Link>
      </motion.div>

      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save products you love and come back to them anytime."
          actionLabel="Discover Products"
          actionHref="/products"
        />
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item, idx) => {
              const p = item.product;
              const isOutOfStock = p.stock === 0;
              const imageUrl = p.images?.[0]?.url ?? "/placeholder.png";

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-card border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {/* Image */}
                  <Link href={`/products/${item.productId}`}>
                    <div className="relative aspect-square bg-muted overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Badge variant="secondary">Out of Stock</Badge>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-4 space-y-3">
                    <Link href={`/products/${item.productId}`}>
                      <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary transition-colors">
                        {p.name}
                      </h3>
                    </Link>

                    <RatingStars rating={p.rating} size="sm" showCount={false} />

                    <div className="flex items-center gap-2">
                      {p.discountPrice ? (
                        <>
                          <span className="font-black text-primary">
                            {formatPrice(p.discountPrice)}
                          </span>
                          <span className="text-xs text-muted-foreground line-through">
                            {formatPrice(p.price)}
                          </span>
                        </>
                      ) : (
                        <span className="font-black">{formatPrice(p.price)}</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 gap-1.5 text-xs"
                        disabled={isOutOfStock}
                        onClick={() => handleMoveToCart(item.productId)}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        {isOutOfStock ? "Unavailable" : "Add to Cart"}
                      </Button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemove(item.productId)}
                        className="w-9 h-9 flex-shrink-0 rounded-lg border flex items-center justify-center text-muted-foreground hover:text-red-500 hover:border-red-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}

export default function WishlistPage() {
  return (
    <ProtectedRoute>
      <WishlistContent />
    </ProtectedRoute>
  );
}