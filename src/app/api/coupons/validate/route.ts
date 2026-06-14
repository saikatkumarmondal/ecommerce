import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, AuthenticatedRequest } from "@/lib/auth-middleware";
import { z } from "zod";

const validateSchema = z.object({
  code: z.string().min(1),
  orderTotal: z.number().positive(),
});

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  const body = await req.json();
  const parsed = validateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false, message: "Validation failed" }, { status: 400 });

  const { code, orderTotal } = parsed.data;

  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

  if (!coupon || !coupon.isActive) {
    return NextResponse.json({ success: false, message: "Invalid or inactive coupon" }, { status: 400 });
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return NextResponse.json({ success: false, message: "Coupon has expired" }, { status: 400 });
  }

  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json({ success: false, message: "Coupon usage limit reached" }, { status: 400 });
  }

  if (coupon.minOrderAmt && orderTotal < Number(coupon.minOrderAmt)) {
    return NextResponse.json(
      { success: false, message: `Minimum order amount is $${coupon.minOrderAmt}` },
      { status: 400 }
    );
  }

  let discountAmount =
    coupon.type === "PERCENTAGE"
      ? (orderTotal * Number(coupon.value)) / 100
      : Number(coupon.value);

  discountAmount = Math.min(discountAmount, orderTotal);

  return NextResponse.json({
    success: true,
    message: "Coupon applied",
    data: { coupon, discountAmount, finalTotal: orderTotal - discountAmount },
  });
});