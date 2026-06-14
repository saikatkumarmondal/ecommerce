import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, AuthenticatedRequest } from "@/lib/auth-middleware";
import { createReviewSchema } from "@/lib/validators/review.validator";

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  const body = await req.json();
  const parsed = createReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { productId, rating, title, comment } = parsed.data;

  // শুধু যে customer এই product কিনেছে সে review দিতে পারবে
  const hasPurchased = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: { userId: req.user.userId, paymentStatus: "PAID" },
    },
  });

  if (!hasPurchased) {
    return NextResponse.json({ success: false, message: "Only verified buyers can review" }, { status: 403 });
  }

  const existingReview = await prisma.review.findUnique({
    where: { userId_productId: { userId: req.user.userId, productId } },
  });

  if (existingReview) {
    return NextResponse.json({ success: false, message: "You already reviewed this product" }, { status: 409 });
  }

  const review = await prisma.review.create({
    data: { userId: req.user.userId, productId, rating, title, comment },
  });

  // Product rating recalculate করো
  const allReviews = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: allReviews._avg.rating ?? 0,
      totalReviews: allReviews._count.rating,
    },
  });

  return NextResponse.json({ success: true, message: "Review submitted", data: review }, { status: 201 });
});