import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdminAuth } from "@/lib/auth-middleware";

const ITEMS_PER_PAGE = parseInt(process.env.ITEMS_PER_PAGE ?? "12");

export const GET = withAdminAuth(async (req: any) => {
  const page = Number(req.nextUrl.searchParams.get("page") ?? "1");
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? ITEMS_PER_PAGE);
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, isEmailVerified: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.user.count(),
  ]);

  return NextResponse.json({
    success: true,
    message: "Users fetched",
    data: users,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
});