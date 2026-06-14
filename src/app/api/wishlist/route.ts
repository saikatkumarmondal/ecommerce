import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, AuthenticatedRequest } from "@/lib/auth-middleware";
import { z } from "zod";

const addSchema = z.object({ productId: z.string().min(1) });

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId: req.user.userId },
    include: { items: { include: { product: { include: { images: { take: 1 } } } } } },
  });

  return NextResponse.json({ success: true, message: "Wishlist fetched", data: wishlist?.items ?? [] });
});

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  const body = await req.json();
  const parsed = addSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false, message: "Validation failed" }, { status: 400 });

  let wishlist = await prisma.wishlist.findUnique({ where: { userId: req.user.userId } });
  if (!wishlist) {
    wishlist = await prisma.wishlist.create({ data: { userId: req.user.userId } });
  }

  const item = await prisma.wishlistItem.upsert({
    where: { wishlistId_productId: { wishlistId: wishlist.id, productId: parsed.data.productId } },
    update: {},
    create: { wishlistId: wishlist.id, productId: parsed.data.productId },
  });

  return NextResponse.json({ success: true, message: "Added to wishlist", data: item }, { status: 201 });
});