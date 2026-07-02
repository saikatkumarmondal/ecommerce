"use client";

import { motion, Variants } from "framer-motion";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductSection } from "@/components/home/ProductSection";
import { BrandSection } from "@/components/home/BrandSection";
import { Newsletter } from "@/components/home/Newsletter";
import { PromoStrip } from "@/components/home/PromoStrip";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 60, damping: 20 },
  },
};

export default function HomePage() {
  return (
    <div className="w-full bg-background min-h-screen">
      <PromoStrip />

      {/* Hero */}
      <HeroCarousel />

      {/* Categories */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        className="w-full"
      >
        <CategoryGrid />
      </motion.div>

      {/* Featured Products */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        className="w-full"
      >
        <ProductSection
          title="Featured Products"
          subtitle="Handpicked by our team"
          queryParams={{ isFeatured: true, limit: 8 }}
          viewAllHref="/products?isFeatured=true"
        />
      </motion.div>

      {/* New Arrivals */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        className="w-full"
      >
        <ProductSection
          title="New Arrivals"
          subtitle="Fresh drops just for you"
          queryParams={{ sortBy: "newest", limit: 8 }}
          viewAllHref="/products?sortBy=newest"
          variant="dark"
        />
      </motion.div>

      {/* Brands */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        className="w-full"
      >
        <BrandSection />
      </motion.div>

      {/* Best Sellers */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        className="w-full"
      >
        <ProductSection
          title="Best Sellers"
          subtitle="Most loved by customers"
          queryParams={{ sortBy: "best_selling", limit: 8 }}
          viewAllHref="/products?sortBy=best_selling"
        />
      </motion.div>

      {/* On Sale */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        className="w-full"
      >
        <ProductSection
          title="On Sale"
          subtitle="Limited time deals"
          queryParams={{ onSale: true, limit: 8 }}
          viewAllHref="/products?onSale=true"
          variant="accent"
        />
      </motion.div>

      {/* Newsletter */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeUp}
        className="w-full"
      >
        <Newsletter />
      </motion.div>
    </div>
  );
}