import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  shortDescription: z.string().min(5).max(200),
  sku: z.string().min(2),
  price: z.number().positive(),
  discountPrice: z.number().positive().optional(),
  stock: z.number().int().min(0),
  categoryId: z.string().min(1),
  brandId: z.string().min(1),
  isFeatured: z.boolean().optional(),
  images: z.array(z.string().url()).min(1, "At least one image required"),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;