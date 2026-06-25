"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
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
    gradient: "from-zinc-950 via-slate-900 to-zinc-950",
    accentColor: "from-blue-500 via-indigo-500 to-cyan-400",
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
    gradient: "from-zinc-950 via-stone-900 to-zinc-950",
    accentColor: "from-rose-500 via-pink-500 to-amber-400",
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
    gradient: "from-zinc-950 via-neutral-900 to-zinc-950",
    accentColor: "from-amber-500 via-orange-500 to-red-400",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Advanced Mouse Tracking Parallax Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 22 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 22 });

  // Deep 3D Space Transformations
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["14deg", "-14deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-14deg", "14deg"]);
  const glassSkew = useTransform(mouseXSpring, [-0.5, 0.5], ["-2deg", "2deg"]);
  const glowX = useTransform(mouseXSpring, [-0.5, 0.5], ["-30px", "30px"]);
  const glowY = useTransform(mouseYSpring, [-0.5, 0.5], ["-30px", "30px"]);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(next, 6500);
    return () => clearInterval(timer);
  }, [isAutoPlaying, next]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;
    
    x.set(mouseX / rect.width);
    y.set(mouseY / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsAutoPlaying(true);
  };

  // Drag to Switch Slides logic
  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    const threshold = 80;
    if (info.offset.x < -threshold) {
      next();
    } else if (info.offset.x > threshold) {
      prev();
    }
  };

  const slide = SLIDES[current];

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsAutoPlaying(false)}
      className="relative w-full min-h-[680px] sm:min-h-[740px] lg:min-h-[720px] flex items-center overflow-hidden bg-zinc-950 select-none py-12 lg:py-0"
    >
      {/* 3D Depth Layer Stage Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`gradient-${slide.id}`}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`}
          />
        </AnimatePresence>
        
        {/* Abstract Isometric grid line effect overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        {/* Dynamic Interactive Glow Backdrop */}
        <motion.div 
          style={{ x: glowX, y: glowY }}
          className={`absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tr ${slide.accentColor} opacity-[0.06] blur-[120px]`}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Typography Content Column */}
          <div className="lg:col-span-6 text-center lg:text-left order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${slide.id}`}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
                  exit: { opacity: 0, transition: { duration: 0.25 } }
                }}
                className="space-y-6"
              >
                {/* Floating Tech Badge */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20, rotateX: -30 },
                    visible: { opacity: 1, y: 0, rotateX: 0, transition: { type: "spring" as const, stiffness: 120 } }
                  }}
                  className="inline-block perspective-[400px]"
                >
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest bg-zinc-900/80 text-zinc-200 border border-zinc-800 backdrop-blur-md shadow-xl">
                    <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${slide.accentColor} animate-pulse`} />
                    {slide.badge}
                  </span>
                </motion.div>

                {/* Main Heading Text */}
                <motion.h1
                  variants={{
                    hidden: { opacity: 0, x: -40, rotateY: -15 },
                    visible: { opacity: 1, x: 0, rotateY: 0, transition: { type: "spring" as const, damping: 18 } }
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
                >
                  {slide.title}
                </motion.h1>

                {/* Subtitle Accent Strip */}
                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className={`text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r ${slide.accentColor} bg-clip-text text-transparent`}
                >
                  {slide.subtitle}
                </motion.p>

                {/* Narrative Paragraph */}
                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-md mx-auto lg:mx-0 font-medium leading-relaxed"
                >
                  {slide.description}
                </motion.p>

                {/* Magnetic Interactive Action Buttons */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, scale: 0.95 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                  className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4"
                >
                  <Link href={slide.href} passHref>
                    <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        size="lg"
                        className="bg-zinc-100 hover:bg-white text-zinc-950 font-bold px-8 h-12 rounded-2xl shadow-[0_10px_30px_rgba(255,255,255,0.1)] transition-all group"
                      >
                        {slide.cta}
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                      </Button>
                    </motion.div>
                  </Link>
                  
                  <Link href="/products" passHref>
                    <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-zinc-800 bg-zinc-900/30 text-zinc-300 hover:text-white hover:bg-zinc-800/80 h-12 rounded-2xl px-8 backdrop-blur-md"
                      >
                        Browse All
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Immersive 3D Parallax Showcase Column (No Arrows Needed - Drag to Swipe Enabled) */}
          <div className="lg:col-span-6 flex justify-center items-center order-1 lg:order-2 perspective-[1500px]">
            <motion.div 
              style={{ rotateX, rotateY, skewY: glassSkew, transformStyle: "preserve-3d" }}
              className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[430px] md:h-[430px] cursor-grab active:cursor-grabbing group"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`card-${slide.id}`}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.4}
                  onDragEnd={handleDragEnd}
                  initial={{ opacity: 0, scale: 0.82, rotateY: 30, z: -100 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0, z: 0 }}
                  exit={{ opacity: 0, scale: 0.82, rotateY: -30, z: -100 }}
                  transition={{ type: "spring" as const, stiffness: 90, damping: 16 }}
                  className="w-full h-full relative rounded-[32px] p-4 bg-zinc-900/20 border border-zinc-800/60 backdrop-blur-md shadow-[0_40px_80px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)]"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Dynamic underlying neon depth glow */}
                  <div 
                    className={`absolute inset-6 rounded-2xl bg-gradient-to-br ${slide.accentColor} opacity-25 blur-3xl transition-all duration-700 group-hover:opacity-45 group-hover:scale-110`} 
                    style={{ transform: "translateZ(-40px)" }} 
                  />
                  
                  {/* Outer Floating Glass Frame ring */}
                  <div className="w-full h-full overflow-hidden rounded-[24px] relative" style={{ transform: "translateZ(40px)" }}>
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105 pointer-events-none"
                      sizes="(max-w-7xl) 440px"
                      priority
                    />
                    {/* Dark gradient overlay for modern look */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-white/5 pointer-events-none" />
                  </div>

                  {/* High-end subtle 3D typography tag floating over the picture */}
                  <div 
                    className="absolute bottom-8 left-8 right-8 bg-zinc-950/80 backdrop-blur-lg border border-zinc-800/80 p-4 rounded-2xl shadow-2xl hidden sm:block select-none pointer-events-none"
                    style={{ transform: "translateZ(60px)" }}
                  >
                    <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Showcase Concept</p>
                    <p className="text-white font-bold text-sm mt-0.5">{slide.subtitle}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Premium Minimal Tracking Matrix Indicators */}
      <div className="absolute bottom-8 left-4 sm:left-8 flex items-center gap-4 z-20 bg-zinc-900/40 border border-zinc-800/50 px-5 py-2.5 rounded-2xl backdrop-blur-xl shadow-2xl">
        <div className="flex gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className="group relative py-1"
              aria-label={`Switch to slide ${idx + 1}`}
            >
              <motion.div 
                className={`rounded-full transition-colors duration-300 ${
                  idx === current ? "h-1.5 bg-zinc-100" : "h-1.5 bg-zinc-700 group-hover:bg-zinc-500"
                }`}
                animate={{ width: idx === current ? 28 : 6 }}
                transition={{ type: "spring" as const, stiffness: 260, damping: 20 }}
              />
            </button>
          ))}
        </div>
        <div className="h-4 w-[1px] bg-zinc-800" />
        <span className="text-[10px] font-mono font-bold text-zinc-500 tracking-widest uppercase">
          0{current + 1} / 0{SLIDES.length}
        </span>
      </div>
    </section>
  );
}
