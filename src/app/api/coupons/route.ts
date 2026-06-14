import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdminAuth, AuthenticatedRequest } from "@/lib/auth-middleware";
import { z } from "zod";

const couponSchema = z.object({
  code: z.string().min(3).max(20),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().positive(),
  minOrderAmt: z.number().positive().optional(),
  maxUses: z.number().int().positive().optional(),
  expiresAt: z.string().datetime().optional(),
});

export const GET = withAdminAuth(async () => {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ success: true, message: "Coupons fetched", data: coupons });
});

export const POST = withAdminAuth(async (req: AuthenticatedRequest) => {
  const body = await req.json();
  const parsed = couponSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false, message: "Validation failed" }, { status: 400 });

  const coupon = await prisma.coupon.create({
    data: { ...parsed.data, code: parsed.data.code.toUpperCase() },
  });

  return NextResponse.json({ success: true, message: "Coupon created", data: coupon }, { status: 201 });
});