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
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-10 lg:p-16 text-center text-white"
        >
          {/* Background Decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -right-20 w-80 h-80 rounded-full border border-white/10"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full border border-white/10"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
          </div>

          <div className="relative z-10 max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-7 h-7" />
            </div>

            <h2 className="text-3xl lg:text-4xl font-black mb-3">
              Stay in the Loop
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Get exclusive deals, early access to sales, and the latest product
              launches straight to your inbox.
            </p>

            {isSubmitted ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-center gap-3 bg-white/20 rounded-2xl px-6 py-4"
              >
                <CheckCircle className="w-6 h-6 text-green-300" />
                <p className="font-semibold text-lg">
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
                  className="flex-1 h-12 bg-white/20 border-white/30 text-white placeholder:text-white/50 focus-visible:ring-white/50 rounded-xl"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-bold h-12 px-8 rounded-xl flex-shrink-0"
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            )}

            <p className="text-white/50 text-xs mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}