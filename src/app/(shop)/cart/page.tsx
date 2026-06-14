"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { useGetCartQuery } from "@/services/cartApi";
import { useAppDispatch } from "@/store/hooks";
import { setCart } from "@/store/slices/cartSlice";
import { Skeleton } from "@/components/ui/skeleton";

function CartContent() {
  const dispatch = useAppDispatch();
  const { data: cart, isLoading } = useGetCartQuery();

  useEffect(() => {
    if (cart?.items) dispatch(setCart(cart.items));
  }, [cart, dispatch]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10">
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Looks like you haven't added anything to your cart yet."
          actionLabel="Start Shopping"
          actionHref="/products"
        />
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
          <ShoppingCart className="w-8 h-8" />
          My Cart
          <span className="text-lg font-normal text-muted-foreground">
            ({items.length} {items.length === 1 ? "item" : "items"})
          </span>
        </h1>
        <Link href="/products">
          <Button variant="ghost" size="sm" className="gap-2">
            Continue Shopping
          </Button>
        </Link>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </AnimatePresence>

          <Separator className="my-4" />

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {items.reduce((sum, i) => sum + i.quantity, 0)} items in cart
            </p>
            <Link href="/products">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowRight className="w-4 h-4 rotate-180" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-24">
          <CartSummary subtotal={cart?.subtotal ?? 0} itemCount={items.length} />
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <ProtectedRoute>
      <CartContent />
    </ProtectedRoute>
  );
}