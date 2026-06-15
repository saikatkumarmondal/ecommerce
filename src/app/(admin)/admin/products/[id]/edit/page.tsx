"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductForm, ProductFormData } from "@/components/admin/ProductForm";
import {
  useGetProductBySlugQuery,
  useUpdateProductMutation,
} from "@/services/productApi";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading } = useGetProductBySlugQuery(id);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const handleSubmit = async (formData: ProductFormData) => {
    try {
      const { images, discountPrice, ...rest } = formData;
      await updateProduct({
        id,
        data: {
          ...rest,
          discountPrice: discountPrice ? Number(discountPrice) : undefined,
          images,
        },
      }).unwrap();
      toast.success("Product updated!");
      router.push("/admin/products");
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to update product");
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
          <h1 className="text-2xl font-black">Edit Product</h1>
          <p className="text-sm text-muted-foreground">
            Update product information
          </p>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      ) : (
        <ProductForm
          defaultValues={data?.product}
          onSubmit={handleSubmit}
          isLoading={isUpdating}
          submitLabel="Update Product"
        />
      )}
    </div>
  );
}