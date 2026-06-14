import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, withAdminAuth, AuthenticatedRequest } from "@/lib/auth-middleware";
import { z } from "zod";

const updateStatusSchema = z.object({
  orderStatus: z.enum(["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"]),
});

export const GET = withAuth(async (req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const order = await prisma.order.findFirst({
    where: req.user.role === "ADMIN" ? { id } : { id, userId: req.user.userId },
    include: {
      items: { include: { product: { include: { images: { take: 1 } } } } },
      payment: true,
    },
  });

  if (!order) return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });

  return NextResponse.json({ success: true, message: "Order fetched", data: order });
});

export const PUT = withAdminAuth(async (req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const body = await req.json();
  const parsed = updateStatusSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false, message: "Validation failed" }, { status: 400 });

  const order = await prisma.order.update({
    where: { id },
    data: { orderStatus: parsed.data.orderStatus },
  });

  return NextResponse.json({ success: true, message: "Order status updated", data: order });
});