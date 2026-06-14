"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUpdateCartItemMutation, useRemoveCartItemMutation } from "@/services/cartApi";
import { CartItem } from "@/types/order.types";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { optimisticUpdateQty, optimisticRemoveItem } from "@/store/slices/cartSlice";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const dispatch = useAppDispatch();
  const [updateQty, { isLoading: isUpdating }] = useUpdateCartItemMutation();
  const [removeItem, { isLoading: isRemoving }] = useRemoveCartItemMutation();

  const price = Number(item.product.discountPrice ?? item.product.price);
  const imageUrl = item.product.images?.[0]?.url ?? "/placeholder.png";

  const handleQuantityChange = async (newQty: number) => {
    if (newQty < 1 || newQty > item.product.stock) return;
    dispatch(optimisticUpdateQty({ itemId: item.id, quantity: newQty }));
    try {
      await updateQty({ itemId: item.id, quantity: newQty }).unwrap();
    } catch {
      dispatch(optimisticUpdateQty({ itemId: item.id, quantity: item.quantity }));
      toast.error("Failed to update quantity");
    }
  };

  const handleRemove = async () => {
    dispatch(optimisticRemoveItem(item.id));
    try {
      await removeItem(item.id).unwrap();
      toast.success("Item removed from cart");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30, height: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-card border rounded-2xl p-4 flex gap-4 hover:shadow-md transition-shadow"
    >
      {/* Image */}
      <Link href={`/products/${item.product.id}`} className="flex-shrink-0">
        <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={item.product.name}
            width={96}
            height={96}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.product.id}`}>
          <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary transition-colors mb-1">
            {item.product.name}
          </h3>
        </Link>

        {/* Price per unit */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-bold text-primary">
            {formatPrice(price)}
          </span>
          {item.product.discountPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(item.product.price)}
            </span>
          )}
          <span className="text-xs text-muted-foreground">/ unit</span>
        </div>

        {/* Qty Controls + Remove */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center border rounded-lg overflow-hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1 || isUpdating}
              className="px-2.5 py-1.5 hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Minus className="w-3.5 h-3.5" />
            </motion.button>
            <span className="px-4 py-1.5 text-sm font-bold border-x min-w-[40px] text-center">
              {item.quantity}
            </span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= item.product.stock || isUpdating}
              className="px-2.5 py-1.5 hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-black text-base">
              {formatPrice(price * item.quantity)}
            </span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleRemove}
              disabled={isRemoving}
              className="text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-40"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Stock warning */}
        {item.product.stock <= 5 && (
          <p className="text-xs text-orange-500 mt-1.5 font-medium">
            Only {item.product.stock} left in stock
          </p>
        )}
      </div>
    </motion.div>
  );
}