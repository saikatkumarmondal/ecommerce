"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { CheckoutStepper } from "@/components/checkout/CheckoutStepper";
import { ShippingForm } from "@/components/checkout/ShippingForm";
import { OrderReview } from "@/components/checkout/OrderReview";
import { ShippingAddress } from "@/types/order.types";
import { useGetCartQuery } from "@/services/cartApi";
import { EmptyState } from "@/components/shared/EmptyState";
import { ShoppingCart } from "lucide-react";

const STEPS = ["Shipping", "Review & Pay"];

function CheckoutContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress | null>(null);
  const [couponCode, setCouponCode] = useState<string>("");
  const [discount, setDiscount] = useState(0);

  const { data: cart } = useGetCartQuery();
  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Add items to your cart before checking out."
          actionLabel="Shop Now"
          actionHref="/products"
        />
      </div>
    );
  }

  const handleShippingSubmit = (data: ShippingAddress) => {
    setShippingAddress(data);
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-950 border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-black mb-6">Checkout</h1>
          <CheckoutStepper steps={STEPS} currentStep={currentStep} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="shipping"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ShippingForm
                onSubmit={handleShippingSubmit}
                defaultValues={shippingAddress ?? undefined}
              />
            </motion.div>
          )}

          {currentStep === 1 && shippingAddress && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <OrderReview
                shippingAddress={shippingAddress}
                cart={cart!}
                couponCode={couponCode}
                discount={discount}
                onCouponApply={(code, discountAmt) => {
                  setCouponCode(code);
                  setDiscount(discountAmt);
                }}
                onBack={() => setCurrentStep(0)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
}