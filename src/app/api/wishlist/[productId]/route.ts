import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, AuthenticatedRequest } from "@/lib/auth-middleware";

export const DELETE = withAuth(async (req: AuthenticatedRequest, { params }: { params: Promise<{ productId: string }> }) => {
  const { productId } = await params;

  const wishlist = await prisma.wishlist.findUnique({ where: { userId: req.user.userId } });
  if (!wishlist) return NextResponse.json({ success: false, message: "Wishlist not found" }, { status: 404 });

  await prisma.wishlistItem.deleteMany({ where: { wishlistId: wishlist.id, productId } });

  return NextResponse.json({ success: true, message: "Removed from wishlist" });
});