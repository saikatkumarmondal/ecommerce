import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdminAuth, AuthenticatedRequest } from "@/lib/auth-middleware";
import { z } from "zod";

const brandSchema = z.object({
  name: z.string().min(2),
  logo: z.string().url().optional(),
});

export async function GET() {
  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ success: true, message: "Brands fetched", data: brands });
}

export const POST = withAdminAuth(async (req: AuthenticatedRequest) => {
  const body = await req.json();
  const parsed = brandSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false, message: "Validation failed" }, { status: 400 });

  const brand = await prisma.brand.create({ data: parsed.data });
  return NextResponse.json({ success: true, message: "Brand created", data: brand }, { status: 201 });
});