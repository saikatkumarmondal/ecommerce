import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, AuthenticatedRequest } from "@/lib/auth-middleware";
import { z } from "zod";

const updateQtySchema = z.object({ quantity: z.number().int().min(1) });

export const PUT = withAuth(async (req: AuthenticatedRequest, { params }: { params: Promise<{ itemId: string }> }) => {
  const { itemId } = await params;
  const body = await req.json();
  const parsed = updateQtySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false, message: "Validation failed" }, { status: 400 });

  const item = await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: parsed.data.quantity },
    include: { product: true },
  });

  return NextResponse.json({ success: true, message: "Cart updated", data: item });
});

export const DELETE = withAuth(async (_req: AuthenticatedRequest, { params }: { params: Promise<{ itemId: string }> }) => {
  const { itemId } = await params;
  await prisma.cartItem.delete({ where: { id: itemId } });
  return NextResponse.json({ success: true, message: "Item removed from cart" });
});