import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdminAuth } from "@/lib/auth-middleware";

export const PATCH = withAdminAuth(async (
  _req: any,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) {
    return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
  }

  const updated = await prisma.review.update({
    where: { id },
    data: { isApproved: !review.isApproved },
  });

  const allReviews = await prisma.review.aggregate({
    where: { productId: review.productId, isApproved: true },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.product.update({
    where: { id: review.productId },
    data: {
      rating: allReviews._avg.rating ?? 0,
      totalReviews: allReviews._count.rating,
    },
  });

  return NextResponse.json({
    success: true,
    message: updated.isApproved ? "Review approved" : "Review unapproved",
    data: updated,
  });
});

export const DELETE = withAdminAuth(async (
  _req: any,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) {
    return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
  }

  await prisma.review.delete({ where: { id } });

  const allReviews = await prisma.review.aggregate({
    where: { productId: review.productId, isApproved: true },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.product.update({
    where: { id: review.productId },
    data: {
      rating: allReviews._avg.rating ?? 0,
      totalReviews: allReviews._count.rating,
    },
  });

  return NextResponse.json({ success: true, message: "Review deleted" });
});