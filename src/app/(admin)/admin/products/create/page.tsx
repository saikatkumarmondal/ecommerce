"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductForm, ProductFormData } from "@/components/admin/ProductForm";
import { useCreateProductMutation } from "@/services/productApi";
import { toast } from "sonner";

export default function CreateProductPage() {
  const router = useRouter();
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const handleSubmit = async (data: ProductFormData) => {
    try {
      const { images, discountPrice, ...rest } = data;
      await createProduct({
        ...rest,
        discountPrice: discountPrice ? Number(discountPrice) : undefined,
        images,
      }).unwrap();
      toast.success("Product created successfully!");
      router.push("/admin/products");
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to create product");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link href="/admin/products">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-black">Create Product</h1>
          <p className="text-sm text-muted-foreground">
            Add a new product to your store
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ProductForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitLabel="Create Product"
        />
      </motion.div>
    </div>
  );
}