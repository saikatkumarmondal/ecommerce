import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdminAuth } from "@/lib/auth-middleware";

export const GET = withAdminAuth(async () => {
  const [totalRevenue, totalOrders, totalProducts, totalCustomers, recentOrders, topProducts] =
    await Promise.all([
      prisma.order.aggregate({
        where: { paymentStatus: "PAID" },
        _sum: { total: true },
      }),
      prisma.order.count(),
      prisma.product.count({ where: { status: "ACTIVE" } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } },
      }),
      prisma.product.findMany({
        take: 5,
        orderBy: { soldCount: "desc" },
        include: { images: { take: 1 } },
      }),
    ]);

  return NextResponse.json({
    success: true,
    message: "Analytics fetched",
    data: {
      totalRevenue: totalRevenue._sum.total ?? 0,
      totalOrders,
      totalProducts,
      totalCustomers,
      recentOrders,
      topProducts,
    },
  });
});