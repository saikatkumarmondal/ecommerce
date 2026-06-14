import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdminAuth, AuthenticatedRequest } from "@/lib/auth-middleware";
import { updateProductSchema } from "@/lib/validators/product.validator";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await prisma.product.findFirst({
    where: { OR: [{ id }, { slug: id }], status: "ACTIVE" },
    include: {
      images: true,
      category: true,
      brand: true,
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!product) {
    return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
  }

  const relatedProducts = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id }, status: "ACTIVE" },
    include: { images: true },
    take: 4,
  });

  return NextResponse.json({ success: true, message: "Product fetched", data: { product, relatedProducts } });
}

export const PUT = withAdminAuth(async (req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const body = await req.json();
  const parsed = updateProductSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { images, ...rest } = parsed.data;

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...rest,
      ...(images && {
        images: {
          deleteMany: {},
          create: images.map((url) => ({ url })),
        },
      }),
    },
    include: { images: true },
  });

  return NextResponse.json({ success: true, message: "Product updated", data: product });
});

export const DELETE = withAdminAuth(async (_req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  await prisma.product.update({ where: { id }, data: { status: "DELETED" } });

  return NextResponse.json({ success: true, message: "Product deleted" });
});