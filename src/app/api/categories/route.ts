import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import { prisma } from "@/lib/prisma";
import { withAdminAuth, AuthenticatedRequest } from "@/lib/auth-middleware";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(2),
  image: z.string().url().optional(),
});

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ success: true, message: "Categories fetched", data: categories });
}

export const POST = withAdminAuth(async (req: AuthenticatedRequest) => {
  const body = await req.json();
  const parsed = categorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const slug = slugify(parsed.data.name, { lower: true, strict: true });
  const category = await prisma.category.create({ data: { ...parsed.data, slug } });

  return NextResponse.json({ success: true, message: "Category created", data: category }, { status: 201 });
});