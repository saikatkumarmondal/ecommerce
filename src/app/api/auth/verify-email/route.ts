import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ success: false, message: "Token missing" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({ where: { emailVerifyToken: token } });

  if (!user) {
    return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { isEmailVerified: true, emailVerifyToken: null },
  });

  return NextResponse.json({ success: true, message: "Email verified successfully" });
}