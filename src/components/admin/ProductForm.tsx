"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Save, Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useGetCategoriesQuery } from "@/services/categoryApi";
import { useGetBrandsQuery } from "@/services/brandApi";
import { Product } from "@/types/product.types";

const productSchema = z.object({
  name: z.string().min(2, "Name required"),
  description: z.string().min(10, "Description too short"),
  shortDescription: z.string().min(5).max(200),
  sku: z.string().min(2, "SKU required"),
  price: z.coerce.number().positive("Must be positive"),
  discountPrice: z.coerce.number().positive().optional().or(z.literal("")),
  stock: z.coerce.number().int().min(0),
  categoryId: z.string().min(1, "Category required"),
  brandId: z.string().min(1, "Brand required"),
  isFeatured: z.boolean().default(false),
  images: z.array(z.string().url("Must be a valid URL")).min(1, "At least one image"),
});

export type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  defaultValues?: Partial<Product>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isLoading: boolean;
  submitLabel?: string;
}

export function ProductForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = "Save Product",
}: ProductFormProps) {
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: brands = [] } = useGetBrandsQuery();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      shortDescription: defaultValues?.shortDescription ?? "",
      sku: defaultValues?.sku ?? "",
      price: defaultValues?.price ?? 0,
      discountPrice: defaultValues?.discountPrice ?? "",
      stock: defaultValues?.stock ?? 0,
      categoryId: defaultValues?.categoryId ?? "",
      brandId: defaultValues?.brandId ?? "",
      isFeatured: defaultValues?.isFeatured ?? false,
      images: defaultValues?.images?.map((img) =>
        typeof img === "string" ? img : img.url
      ) ?? [""],
    },
  });

  const images = watch("images");
  const isFeatured = watch("isFeatured");

  const addImageField = () => setValue("images", [...images, ""]);
  const removeImageField = (idx: number) => {
    const updated = images.filter((_, i) => i !== idx);
    setValue("images", updated.length ? updated : [""]);
  };

  const FIELDS = [
    { id: "name", label: "Product Name", placeholder: "iPhone 15 Pro Max", colSpan: 2 },
    { id: "sku", label: "SKU", placeholder: "IP15PM-256-BLK", colSpan: 1 },
    { id: "price", label: "Price ($)", placeholder: "999", type: "number", colSpan: 1 },
    { id: "discountPrice", label: "Discount Price ($)", placeholder: "899 (optional)", type: "number", colSpan: 1 },
    { id: "stock", label: "Stock Quantity", placeholder: "50", type: "number", colSpan: 1 },
  ] as const;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-card border rounded-2xl p-6">
        <h3 className="font-bold mb-5 text-base">Basic Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {FIELDS.map((field) => (
            <div
              key={field.id}
              className={field.colSpan === 2 ? "sm:col-span-2" : ""}
            >
              <div className="space-y-1.5">
                <Label htmlFor={field.id}>{field.label}</Label>
                <Input
                  id={field.id}
                  type={field.type ?? "text"}
                  placeholder={field.placeholder}
                  step={field.type === "number" ? "0.01" : undefined}
                  {...register(field.id)}
                  className={errors[field.id] ? "border-red-500" : ""}
                />
                {errors[field.id] && (
                  <p className="text-xs text-red-500">
                    {errors[field.id]?.message as string}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Category */}
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select
              value={watch("categoryId")}
              onValueChange={(v) => setValue("categoryId", v)}
            >
              <SelectTrigger className={errors.categoryId ? "border-red-500" : ""}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-xs text-red-500">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Brand */}
          <div className="space-y-1.5">
            <Label>Brand</Label>
            <Select
              value={watch("brandId")}
              onValueChange={(v) => setValue("brandId", v)}
            >
              <SelectTrigger className={errors.brandId ? "border-red-500" : ""}>
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.brandId && (
              <p className="text-xs text-red-500">{errors.brandId.message}</p>
            )}
          </div>

          {/* Featured Toggle */}
          <div className="sm:col-span-2 flex items-center gap-3 pt-1">
            <Switch
              checked={isFeatured}
              onCheckedChange={(v) => setValue("isFeatured", v)}
            />
            <div>
              <Label className="cursor-pointer">Featured Product</Label>
              <p className="text-xs text-muted-foreground">
                Show in featured sections on homepage
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Descriptions */}
      <div className="bg-card border rounded-2xl p-6">
        <h3 className="font-bold mb-5 text-base">Product Description</h3>
        <div className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="shortDescription">Short Description</Label>
            <Input
              id="shortDescription"
              placeholder="Brief product summary (max 200 chars)"
              {...register("shortDescription")}
              className={errors.shortDescription ? "border-red-500" : ""}
            />
            {errors.shortDescription && (
              <p className="text-xs text-red-500">
                {errors.shortDescription.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Full Description</Label>
            <Textarea
              id="description"
              placeholder="Detailed product description..."
              rows={5}
              {...register("description")}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-card border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-base">Product Images</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addImageField}
            className="gap-1.5 rounded-xl"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Image
          </Button>
        </div>
        <div className="space-y-3">
          {images.map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex gap-2"
            >
              <Input
                placeholder={`Image URL ${idx + 1}`}
                {...register(`images.${idx}`)}
                className={
                  errors.images?.[idx] ? "border-red-500" : ""
                }
              />
              {images.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeImageField(idx)}
                  className="flex-shrink-0 text-muted-foreground hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </motion.div>
          ))}
          {errors.images && (
            <p className="text-xs text-red-500">
              {typeof errors.images?.message === "string"
                ? errors.images.message
                : "At least one valid image URL required"}
            </p>
          )}
        </div>
      </div>

      {/* Submit */}
      <motion.div whileTap={{ scale: 0.98 }}>
        <Button
          type="submit"
          size="lg"
          className="w-full h-12 font-bold rounded-xl gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              {submitLabel}
            </>
          )}
        </Button>
      </motion.div>
    </form>
  );
}