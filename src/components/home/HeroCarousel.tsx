"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
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
    gradient: "from-slate-900 via-blue-950 to-slate-900",
    accentColor: "from-blue-500 to-cyan-400",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80",
  },
  {
    id: 2,
    title: "Premium Fashion",
    subtitle: "Style that speaks for itself",
    description: "Elevate your wardrobe with our curated collection",
    cta: "Explore Fashion",
    href: "/products?categoryId=fashion",
    badge: "Trending",
    gradient: "from-rose-950 via-pink-950 to-slate-900",
    accentColor: "from-rose-500 to-pink-400",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
  },
  {
    id: 3,
    title: "Flash Sale",
    subtitle: "Up to 50% off",
    description: "Limited time deals on top brands",
    cta: "Grab the Deal",
    href: "/products?onSale=true",
    badge: "🔥 Hot Deal",
    gradient: "from-amber-950 via-orange-950 to-slate-900",
    accentColor: "from-amber-500 to-orange-400",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, next]);

  const slide = SLIDES[current];

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className={`relative min-h-[520px] lg:min-h-[620px] bg-gradient-to-br ${slide.gradient} flex items-center`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover opacity-20"
              priority
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-80`} />
          </div>

          {/* Animated Background Orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
              className={`absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br ${slide.accentColor} opacity-10 blur-3xl`}
            />
            <motion.div
              animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-white opacity-5 blur-3xl"
            />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span
                    className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-gradient-to-r ${slide.accentColor} text-white mb-6`}
                  >
                    {slide.badge}
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl lg:text-7xl font-black text-white leading-tight mb-4"
                >
                  {slide.title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`text-xl lg:text-2xl font-semibold bg-gradient-to-r ${slide.accentColor} bg-clip-text text-transparent mb-3`}
                >
                  {slide.subtitle}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="text-white/60 text-lg mb-8 max-w-md"
                >
                  {slide.description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap gap-4"
                >
                  <Link href={slide.href}>
                    <Button
                      size="lg"
                      className={`bg-gradient-to-r ${slide.accentColor} border-0 text-white font-bold px-8 h-12 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200`}
                    >
                      {slide.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 h-12 rounded-full px-8 backdrop-blur-sm"
                    >
                      Browse All
                    </Button>
                  </Link>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-8 mt-12"
                >
                  {[
                    { label: "Products", value: "10K+" },
                    { label: "Brands", value: "200+" },
                    { label: "Customers", value: "50K+" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p
                        className={`text-2xl font-black bg-gradient-to-r ${slide.accentColor} bg-clip-text text-transparent`}
                      >
                        {stat.value}
                      </p>
                      <p className="text-white/50 text-sm">{stat.label}</p>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Hero Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 40 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="hidden lg:flex justify-center items-center"
              >
                <div className="relative w-[420px] h-[420px]">
                  <div
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${slide.accentColor} opacity-20 blur-2xl`}
                  />
                  <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative"
                  >
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      width={420}
                      height={420}
                      className="rounded-3xl object-cover shadow-2xl"
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === current ? "w-8 h-2 bg-white" : "w-2 h-2 bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}