"use client";

import { motion } from "framer-motion";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductSection } from "@/components/home/ProductSection";
import { BrandSection } from "@/components/home/BrandSection";
import { Newsletter } from "@/components/home/Newsletter";
import { PromoStrip } from "@/components/home/PromoStrip";

const sectionRevealVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 50, damping: 20, mass: 1 }
  }
};

export default function HomePage() {
  return (
    <div className="w-full overflow-hidden bg-background min-h-screen selection:bg-primary selection:text-primary-foreground antialiased">
      <PromoStrip />
      
      <main className="relative w-full overflow-visible z-10">
        <HeroCarousel />
      </main>

      <div className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-12 overflow-visible w-full">
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionRevealVariants}
          className="overflow-visible w-full"
        >
          <CategoryGrid />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionRevealVariants}
          className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 transition-colors duration-500 rounded-[3rem] w-full"
        >
          <ProductSection
            title="Featured Products"
            subtitle="Handpicked by our team"
            queryParams={{ isFeatured: true, limit: 8 }}
            viewAllHref="/products?isFeatured=true"
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionRevealVariants}
          className="relative shadow-[0_0_100px_rgba(0,0,0,0.2)] w-full"
        >
          <ProductSection
            title="New Arrivals"
            subtitle="Fresh drops just for you"
            queryParams={{ sortBy: "newest", limit: 8 }}
            viewAllHref="/products?sortBy=newest"
            variant="dark"
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionRevealVariants}
          className="w-full"
        >
          <BrandSection />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionRevealVariants}
          className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 transition-colors duration-500 rounded-[3rem] w-full"
        >
          <ProductSection
            title="Best Sellers"
            subtitle="Most loved by customers"
            queryParams={{ sortBy: "best_selling", limit: 8 }}
            viewAllHref="/products?sortBy=best_selling"
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionRevealVariants}
          className="overflow-hidden w-full shadow-sm"
        >
          <ProductSection
            title="On Sale"
            subtitle="Limited time deals"
            queryParams={{ onSale: true, limit: 8 }}
            viewAllHref="/products?onSale=true"
            variant="accent"
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={sectionRevealVariants}
          className="w-full"
        >
          <Newsletter />
        </motion.div>

      </div>
    </div>
  );
}