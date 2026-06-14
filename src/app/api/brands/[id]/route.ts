import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdminAuth, AuthenticatedRequest } from "@/lib/auth-middleware";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const brand = await prisma.brand.findUnique({ where: { id } });
  if (!brand) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, message: "Brand fetched", data: brand });
}

export const PUT = withAdminAuth(async (req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const body = await req.json();
  const brand = await prisma.brand.update({ where: { id }, data: body });
  return NextResponse.json({ success: true, message: "Brand updated", data: brand });
});

export const DELETE = withAdminAuth(async (_req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  await prisma.brand.delete({ where: { id } });
  return NextResponse.json({ success: true, message: "Brand deleted" });
});