"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowLeft, CreditCard, MapPin,
  Package, Loader2, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CouponInput } from "./CouponInput";
import { useCreateCheckoutSessionMutation } from "@/services/orderApi";
import { Cart, ShippingAddress } from "@/types/order.types";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

const SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = Number(process.env.NEXT_PUBLIC_SHIPPING_COST ?? "20");
const TAX_RATE = Number(process.env.NEXT_PUBLIC_TAX_RATE ?? "0.05");

interface OrderReviewProps {
  shippingAddress: ShippingAddress;
  cart: Cart;
  couponCode: string;
  discount: number;
  onCouponApply: (code: string, amount: number) => void;
  onBack: () => void;
}

export function OrderReview({
  shippingAddress,
  cart,
  couponCode,
  discount,
  onCouponApply,
  onBack,
}: OrderReviewProps) {
  const [createCheckoutSession, { isLoading }] =
    useCreateCheckoutSessionMutation();

  const subtotal = cart.subtotal;
  const isFreeShipping = subtotal >= SHIPPING_THRESHOLD;
  const shipping = isFreeShipping ? 0 : SHIPPING_COST;
  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * TAX_RATE;
  const total = taxableAmount + shipping + tax;

  const handleRemoveCoupon = () => {
    onCouponApply("", 0);
  };

  const handlePlaceOrder = async () => {
    try {
      const res = await createCheckoutSession({
        shippingAddress,
        couponCode: couponCode || undefined,
      }).unwrap();

      if (res.data?.sessionUrl) {
        window.location.href = res.data.sessionUrl;
      }
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to create checkout session");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left — Items + Address */}
        <div className="lg:col-span-3 space-y-6">
          {/* Order Items */}
          <div className="bg-card border rounded-2xl p-6">
            <h3 className="font-bold text-base flex items-center gap-2 mb-5">
              <Package className="w-5 h-5 text-primary" />
              Order Items ({cart.items.length})
            </h3>

            <div className="space-y-4">
              {cart.items.map((item) => {
                const price = Number(
                  item.product.discountPrice ?? item.product.price
                );
                const imageUrl =
                  item.product.images?.[0]?.url ?? "/placeholder.png";

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b last:border-0 last:pb-0"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={imageUrl}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold line-clamp-2">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Qty: {item.quantity} × {formatPrice(price)}
                      </p>
                    </div>
                    <p className="font-bold text-sm flex-shrink-0">
                      {formatPrice(price * item.quantity)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-card border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Shipping Address
              </h3>
              <button
                onClick={onBack}
                className="text-sm text-primary hover:underline font-medium"
              >
                Edit
              </button>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">
                {shippingAddress.fullName}
              </p>
              <p>{shippingAddress.address}</p>
              <p>
                {shippingAddress.city}, {shippingAddress.zipCode}
              </p>
              <p>{shippingAddress.country}</p>
              <p>{shippingAddress.phone}</p>
              <p>{shippingAddress.email}</p>
            </div>
          </div>
        </div>

        {/* Right — Summary + Payment */}
        <div className="lg:col-span-2 space-y-5">
          {/* Coupon */}
          <div className="bg-card border rounded-2xl p-5">
            <CouponInput
              subtotal={subtotal}
              onApply={onCouponApply}
              onRemove={handleRemoveCoupon}
              appliedCode={couponCode}
              discount={discount}
            />
          </div>

          {/* Price Summary */}
          <div className="bg-card border rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-base">Price Summary</h3>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Subtotal ({cart.items.length} items)
                </span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Coupon Discount</span>
                  <span className="text-green-600 font-semibold">
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

            {/* Place Order */}
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                className="w-full h-12 font-bold rounded-xl gap-2"
                onClick={handlePlaceOrder}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Redirecting to Stripe...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Pay {formatPrice(total)}
                  </>
                )}
              </Button>
            </motion.div>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              Secured by Stripe. We never store card data.
            </div>
          </div>

          {/* Back Button */}
          <Button
            variant="ghost"
            className="w-full gap-2"
            onClick={onBack}
            disabled={isLoading}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shipping
          </Button>
        </div>
      </div>
    </div>
  );
}