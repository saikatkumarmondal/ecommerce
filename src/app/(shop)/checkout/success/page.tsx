"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Package, Home } from "lucide-react";
import Link from "next/link";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order_id");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/dashboard/orders");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [orderId, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring" as const, stiffness: 200, damping: 20 }}
        className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" as const, stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-green-500" />
        </motion.div>

        <h1 className="text-2xl sm:text-3xl font-black mb-2">Payment Successful!</h1>
        <p className="text-gray-500 mb-6 text-sm sm:text-base">
          Thank you for your order. We have received your payment and will process your order shortly.
        </p>

        {orderId && (
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <p className="text-xs text-gray-400 mb-1">Order ID</p>
            <p className="text-sm font-mono font-semibold text-gray-700 break-all">{orderId}</p>
          </div>
        )}

        <p className="text-sm text-gray-400 mb-6">
          Redirecting to your orders in{" "}
          <span className="font-bold text-primary">{countdown}s</span>...
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard/orders"
            className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            <Package className="w-4 h-4" />
            View Orders
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 border py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-black border-t-transparent animate-spin" />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
