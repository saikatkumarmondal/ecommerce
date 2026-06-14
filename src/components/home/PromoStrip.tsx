"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const PROMO_MESSAGES = [
  "🚀 Free shipping on orders over $50",
  "🔥 Up to 50% off on selected items",
  "💳 Use code SAVE10 for 10% off your first order",
  "📦 Easy 30-day returns",
];

export function PromoStrip() {
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % PROMO_MESSAGES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-primary text-white py-2 px-4 relative overflow-hidden">
      <div className="container mx-auto flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={current}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-sm font-medium text-center"
          >
            {PROMO_MESSAGES[current]}
          </motion.p>
        </AnimatePresence>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}