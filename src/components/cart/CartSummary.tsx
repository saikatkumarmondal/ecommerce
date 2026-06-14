"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Tag, Truck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";

const SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = Number(process.env.NEXT_PUBLIC_SHIPPING_COST ?? "20");
const TAX_RATE = Number(process.env.NEXT_PUBLIC_TAX_RATE ?? "0.05");

interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
  discount?: number;
}

export function CartSummary({
  subtotal,
  itemCount,
  discount = 0,
}: CartSummaryProps) {
  const isFreeShipping = subtotal >= SHIPPING_THRESHOLD;
  const shipping = isFreeShipping ? 0 : subtotal > 0 ? SHIPPING_COST : 0;
  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * TAX_RATE;
  const total = taxableAmount + shipping + tax;

  const shippingProgress = Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100);
  const remaining = SHIPPING_THRESHOLD - subtotal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border rounded-2xl p-6 space-y-5"
    >
      <h2 className="text-lg font-bold">Order Summary</h2>

      {/* Free Shipping Progress */}
      {!isFreeShipping && subtotal > 0 && (
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-400">
            <Truck className="w-4 h-4 flex-shrink-0" />
            <span>
              Add{" "}
              <span className="font-bold">{formatPrice(remaining)}</span> more for{" "}
              <span className="font-bold">free shipping!</span>
            </span>
          </div>
          <div className="h-1.5 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${shippingProgress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-blue-500 rounded-full"
            />
          </div>
        </div>
      )}

      {isFreeShipping && (
        <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-3 flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
          <Truck className="w-4 h-4" />
          <span className="font-semibold">🎉 You qualify for free shipping!</span>
        </div>
      )}

      {/* Line Items */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
          </span>
          <span className="font-semibold">{formatPrice(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              Coupon Discount
            </span>
            <span className="font-semibold text-green-600">
              -{formatPrice(discount)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-semibold">
            {shipping === 0 ? (
              <span className="text-green-600">FREE</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Tax ({(TAX_RATE * 100).toFixed(0)}%)
          </span>
          <span className="font-semibold">{formatPrice(tax)}</span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between items-center">
        <span className="font-bold text-lg">Total</span>
        <span className="font-black text-2xl text-primary">
          {formatPrice(total)}
        </span>
      </div>

      <Link href="/checkout">
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button
            className="w-full h-12 font-bold rounded-xl gap-2 text-base"
            size="lg"
          >
            Proceed to Checkout
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </Link>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-4 pt-1">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          Secure Checkout
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Truck className="w-4 h-4 text-blue-500" />
          Fast Delivery
        </div>
      </div>

      {/* Payment icons */}
      <div className="flex items-center justify-center gap-2 pt-1">
        {["VISA", "MC", "AMEX", "Stripe"].map((b) => (
          <div
            key={b}
            className="px-2 py-1 bg-muted rounded text-[10px] font-bold text-muted-foreground"
          >
            {b}
          </div>
        ))}
      </div>
    </motion.div>
  );
}