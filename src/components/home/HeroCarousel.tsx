"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const SLIDES = [
  {
    id: 1,
    title: "Next-Gen Technology",
    subtitle: "Discover the latest electronics",
    description: "Shop cutting-edge gadgets at unbeatable prices",
    cta: "Shop Electronics",
    href: "/products?categoryId=electronics",
    badge: "New Arrivals",
    bg: "from-slate-900 to-slate-800",
    accent: "from-blue-400 to-cyan-400",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80",
  },
  {
    id: 2,
    title: "Premium Fashion",
    subtitle: "Style that speaks for itself",
    description: "Elevate your wardrobe with our curated collection",
    cta: "Explore Fashion",
    href: "/products?categoryId=fashion",
    badge: "Trending Now",
    bg: "from-zinc-900 to-stone-800",
    accent: "from-rose-400 to-pink-400",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
  },
  {
    id: 3,
    title: "Flash Sale",
    subtitle: "Up to 50% off today",
    description: "Limited time deals on top brands — don't miss out",
    cta: "Grab the Deal",
    href: "/products?onSale=true",
    badge: "🔥 Hot Deal",
    bg: "from-neutral-900 to-zinc-800",
    accent: "from-amber-400 to-orange-400",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((p) => (p + 1) % SLIDES.length), []);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [paused, next]);

  const slide = SLIDES[current];

  return (
    <section
      className="relative w-full overflow-hidden bg-slate-900"
      style={{ minHeight: "clamp(420px, 60vw, 640px)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className={`absolute inset-0 bg-gradient-to-br ${slide.bg}`}
        />
      </AnimatePresence>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full">

          {/* Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${slide.id}`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4 }}
              className="text-center lg:text-left order-2 lg:order-1"
            >
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-white/10 text-white border border-white/20 mb-4`}>
                {slide.badge}
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-3">
                {slide.title}
              </h1>

              <p className={`text-lg font-bold bg-gradient-to-r ${slide.accent} bg-clip-text text-transparent mb-3`}>
                {slide.subtitle}
              </p>

              <p className="text-white/60 text-sm sm:text-base mb-8 max-w-md mx-auto lg:mx-0">
                {slide.description}
              </p>

              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <Link href={slide.href}>
                  <Button size="lg" className="bg-white text-black hover:bg-white/90 font-bold rounded-xl px-6 h-11">
                    {slide.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/products">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-xl px-6 h-11">
                    Browse All
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`img-${slide.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="order-1 lg:order-2 flex justify-center"
            >
              <div className="relative w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[440px] aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 640px) 320px, (max-width: 1024px) 380px, 440px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
        <button
          onClick={prev}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`rounded-full transition-all duration-300 h-1.5 ${
                idx === current ? "w-6 bg-white" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}