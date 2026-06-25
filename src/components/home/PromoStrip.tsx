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
    }, 4000); // Slightly longer duration for better readability
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="relative w-full overflow-hidden border-b border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 px-4 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.6)] before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-zinc-700 before:to-transparent"
      style={{ perspective: "1000px" }} // Enables 3D context
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center relative min-h-[24px]">
        
        {/* Animated 3D Rolling Text */}
        <div className="flex items-center justify-center w-full max-w-[280px] sm:max-w-md md:max-w-2xl px-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={current}
              initial={{ rotateX: 90, opacity: 0, y: 15 }}
              animate={{ rotateX: 0, opacity: 1, y: 0 }}
              exit={{ rotateX: -90, opacity: 0, y: -15 }}
              transition={{ 
                type: "spring" as const, 
                stiffness: 120, 
                damping: 14,
                mass: 0.8
              }}
              className="text-xs sm:text-sm font-medium text-center text-zinc-100 tracking-wide select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
              style={{ transformOrigin: "center center -10px" }}
            >
              {PROMO_MESSAGES[current]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-1 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-all duration-200 active:scale-95 group"
          aria-label="Close promotion strip"
        >
          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:rotate-90" />
        </button>
      </div>
    </div>
  );
}
