"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronRight } from "lucide-react";

import { useGetProductBySlugQuery } from "@/services/productApi";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ReviewSection } from "@/components/product/ReviewSection";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { ProductDetailSkeleton } from "@/components/product/ProductDetailSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import type { ProductWithReviews } from "@/types/product.types";   // ✅ এই লাইন যোগ করুন

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const { data, isLoading, isError } = useGetProductBySlugQuery(slug);

  if (isLoading) return <ProductDetailSkeleton />;

  if (isError || !data?.product) {
    return (
      <div className="container mx-auto px-4 py-20">
        <EmptyState
          icon={ShoppingBag}
          title="Product not found"
          description="This product may have been removed or the link is incorrect."
          actionLabel="Browse Products"
          actionHref="/products"
        />
      </div>
    );
  }

  const { product, relatedProducts } = data;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/products?categoryId=${product.categoryId}`} className="hover:text-primary transition-colors">
              {product.category?.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-foreground truncate max-w-[220px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 lg:py-14">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-start"
        >
          <div className="rounded-3xl border bg-card shadow-sm p-4">
            <ProductGallery images={product.images} productName={product.name} />
          </div>
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-3xl border bg-card shadow-sm p-6"
          >
            <ProductInfo product={product} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <ReviewSection 
            product={{
              ...product,
              reviews: [],                    // এখনো reviews আনা হয়নি তাই খালি অ্যারে
              totalReviews: product.totalReviews ?? 0
            } as ProductWithReviews} 
          />
        </motion.div>

        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-20"
          >
            <RelatedProducts products={relatedProducts} />
          </motion.div>
        )}
      </div>
    </div>
  );
}