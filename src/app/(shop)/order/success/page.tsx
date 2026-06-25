"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store/hooks";
import { clearCart } from "@/store/slices/cartSlice";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring" as const, stiffness: 200 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" as const, stiffness: 200 }}
          className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-950/50 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-14 h-14 text-green-500" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-black mb-3">Order Confirmed! 🎉</h1>
          <p className="text-muted-foreground mb-2">
            Thank you for your purchase. Your payment was successful and your order is being processed.
          </p>
          {sessionId && (
            <p className="text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2 font-mono mb-6 truncate">
              Session: {sessionId}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-muted/40 rounded-2xl p-5 mb-8 text-left space-y-3"
        >
          {[
            { icon: "✅", label: "Payment confirmed" },
            { icon: "📦", label: "Order is being prepared" },
            { icon: "🚚", label: "Shipping confirmation email on the way" },
          ].map((step) => (
            <div key={step.label} className="flex items-center gap-3">
              <span className="text-lg">{step.icon}</span>
              <span className="text-sm font-medium">{step.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link href="/dashboard/orders" className="flex-1">
            <Button className="w-full gap-2" size="lg">
              <Package className="w-4 h-4" />
              Track Order
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full gap-2" size="lg">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-5"
        >
          <Link
            href="/products"
            className="text-sm text-primary font-medium hover:underline flex items-center justify-center gap-1"
          >
            Continue Shopping <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-black border-t-transparent animate-spin" />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
