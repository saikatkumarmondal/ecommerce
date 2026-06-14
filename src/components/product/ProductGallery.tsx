"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { ProductImage } from "@/types/product.types";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const selectedImage = images[selectedIndex]?.url ?? "/placeholder.png";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const prev = () =>
    setSelectedIndex((i) => (i - 1 + images.length) % images.length);
  const next = () =>
    setSelectedIndex((i) => (i + 1) % images.length);

  return (
    <div className="space-y-4 lg:sticky lg:top-24">
      {/* Main Image */}
      <div
        className="relative aspect-square rounded-2xl overflow-hidden bg-muted/30 border cursor-zoom-in group"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            <Image
              src={selectedImage}
              alt={`${productName} - Image ${selectedIndex + 1}`}
              fill
              className="object-cover transition-transform duration-200"
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      transform: "scale(1.8)",
                    }
                  : {}
              }
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Zoom Hint */}
        <div className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <ZoomIn className="w-4 h-4" />
        </div>

        {/* Arrow Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <motion.button
              key={img.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                "flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200",
                selectedIndex === idx
                  ? "border-primary shadow-md"
                  : "border-transparent hover:border-primary/40"
              )}
            >
              <Image
                src={img.url}
                alt={`${productName} thumbnail ${idx + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}