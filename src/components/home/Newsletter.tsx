"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitted(true);
    setEmail("");
  };

  return (
    <section className="pt-12 sm:pt-16 lg:pt-20 pb-0">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-6 sm:p-10 lg:p-16 text-center text-white"
        >
          {/* Background Decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -right-20 w-60 h-60 sm:w-80 sm:h-80 rounded-full border border-white/10"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-20 -left-20 w-40 h-40 sm:w-60 sm:h-60 rounded-full border border-white/10"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
          </div>

          <div className="relative z-10 max-w-xl mx-auto">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Mail className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-2 sm:mb-3">
              Stay in the Loop
            </h2>
            <p className="text-white/70 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 px-2">
              Get exclusive deals, early access to sales, and the latest product
              launches straight to your inbox.
            </p>

            {isSubmitted ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-center gap-2 sm:gap-3 bg-white/20 rounded-2xl px-4 sm:px-6 py-3 sm:py-4"
              >
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-300 flex-shrink-0" />
                <p className="font-semibold text-base sm:text-lg">
                  You're subscribed! 🎉
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 h-11 sm:h-12 bg-white/20 border-white/30 text-white placeholder:text-white/50 focus-visible:ring-white/50 rounded-xl text-sm sm:text-base"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-bold h-11 sm:h-12 px-6 sm:px-8 rounded-xl flex-shrink-0 text-sm sm:text-base"
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            )}

            <p className="text-white/50 text-xs mt-3 sm:mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}