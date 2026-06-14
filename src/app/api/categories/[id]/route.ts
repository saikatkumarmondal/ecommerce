import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdminAuth, AuthenticatedRequest } from "@/lib/auth-middleware";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  image: z.string().url().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, message: "Category fetched", data: category });
}

export const PUT = withAdminAuth(async (req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false, message: "Validation failed" }, { status: 400 });

  const category = await prisma.category.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ success: true, message: "Category updated", data: category });
});

export const DELETE = withAdminAuth(async (_req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ success: true, message: "Category deleted" });
});