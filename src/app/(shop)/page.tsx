import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductSection } from "@/components/home/ProductSection";
import { BrandSection } from "@/components/home/BrandSection";
import { Newsletter } from "@/components/home/Newsletter";
import { PromoStrip } from "@/components/home/PromoStrip";

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <PromoStrip />
      <HeroCarousel />
      <CategoryGrid />
      <ProductSection
        title="Featured Products"
        subtitle="Handpicked by our team"
        queryParams={{ isFeatured: true, limit: 8 }}
        viewAllHref="/products?isFeatured=true"
      />
      <ProductSection
        title="New Arrivals"
        subtitle="Fresh drops just for you"
        queryParams={{ sortBy: "newest", limit: 8 }}
        viewAllHref="/products?sortBy=newest"
        variant="dark"
      />
      <BrandSection />
      <ProductSection
        title="Best Sellers"
        subtitle="Most loved by customers"
        queryParams={{ sortBy: "best_selling", limit: 8 }}
        viewAllHref="/products?sortBy=best_selling"
      />
      <ProductSection
        title="On Sale"
        subtitle="Limited time deals"
        queryParams={{ onSale: true, limit: 8 }}
        viewAllHref="/products?onSale=true"
        variant="accent"
      />
      <Newsletter />
    </div>
  );
}