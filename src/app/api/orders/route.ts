import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, AuthenticatedRequest } from "@/lib/auth-middleware";

const ITEMS_PER_PAGE = parseInt(process.env.ITEMS_PER_PAGE ?? "12");

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  const page = Number(req.nextUrl.searchParams.get("page") ?? "1");
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? ITEMS_PER_PAGE);
  const skip = (page - 1) * limit;

  const where = req.user.role === "ADMIN" ? {} : { userId: req.user.userId };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: { include: { product: { include: { images: { take: 1 } } } } },
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    message: "Orders fetched",
    data: orders,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
});