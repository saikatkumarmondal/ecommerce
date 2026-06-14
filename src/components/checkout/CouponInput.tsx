"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, X, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useValidateCouponMutation } from "@/services/couponApi";
import { toast } from "sonner";

interface CouponInputProps {
  subtotal: number;
  onApply: (code: string, discountAmount: number) => void;
  onRemove: () => void;
  appliedCode?: string;
  discount?: number;
}

export function CouponInput({
  subtotal,
  onApply,
  onRemove,
  appliedCode,
  discount = 0,
}: CouponInputProps) {
  const [code, setCode] = useState("");
  const [validateCoupon, { isLoading }] = useValidateCouponMutation();

  const handleApply = async () => {
    if (!code.trim()) return;
    try {
      const res = await validateCoupon({
        code: code.trim(),
        orderTotal: subtotal,
      }).unwrap();

      if (res.success && res.data) {
        onApply(code.toUpperCase(), res.data.discountAmount);
        toast.success(
          `Coupon applied! You save $${res.data.discountAmount.toFixed(2)}`
        );
        setCode("");
      }
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Invalid coupon");
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold flex items-center gap-1.5">
        <Tag className="w-4 h-4" />
        Coupon Code
      </p>

      <AnimatePresence mode="wait">
        {appliedCode ? (
          <motion.div
            key="applied"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="flex items-center justify-between bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-green-700 dark:text-green-400">
                  {appliedCode}
                </p>
                <p className="text-xs text-green-600 dark:text-green-500">
                  Saving ${discount.toFixed(2)}
                </p>
              </div>
            </div>
            <button
              onClick={onRemove}
              className="text-green-600 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex gap-2"
          >
            <Input
              placeholder="Enter coupon code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleApply()}
              className="rounded-xl font-mono"
            />
            <Button
              onClick={handleApply}
              disabled={!code.trim() || isLoading}
              variant="outline"
              className="px-5 rounded-xl flex-shrink-0 font-semibold"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Apply"
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}