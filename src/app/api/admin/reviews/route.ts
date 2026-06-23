import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdminAuth } from "@/lib/auth-middleware";

export const GET = withAdminAuth(async (req: any) => {
  const page = Number(req.nextUrl.searchParams.get("page") ?? "1");
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? "10");
  const status = req.nextUrl.searchParams.get("status") ?? "pending";
  const skip = (page - 1) * limit;

  const where =
    status === "pending"
      ? { isApproved: false }
      : status === "approved"
      ? { isApproved: true }
      : {};

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.review.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    message: "Reviews fetched",
    data: reviews,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
});