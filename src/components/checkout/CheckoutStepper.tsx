"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckoutStepperProps {
  steps: string[];
  currentStep: number;
}

export function CheckoutStepper({ steps, currentStep }: CheckoutStepperProps) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isActive = idx === currentStep;

        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            {/* Step Circle */}
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{
                  backgroundColor: isCompleted
                    ? "hsl(var(--primary))"
                    : isActive
                    ? "hsl(var(--primary))"
                    : "hsl(var(--muted))",
                  scale: isActive ? 1.1 : 1,
                }}
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm",
                  isCompleted || isActive ? "text-white" : "text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" as const, stiffness: 300 }}
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                ) : (
                  idx + 1
                )}
              </motion.div>
              <span
                className={cn(
                  "text-xs font-medium whitespace-nowrap",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </div>

            {/* Connector Line */}
            {idx < steps.length - 1 && (
              <div className="flex-1 mx-3 mb-5">
                <div className="h-0.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: isCompleted ? "100%" : "0%" }}
                    transition={{ duration: 0.4 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
