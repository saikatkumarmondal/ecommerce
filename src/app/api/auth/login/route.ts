import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { loginSchema } from "@/lib/validators/auth.validator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    // if (!user.isEmailVerified) {
    //   return NextResponse.json({ success: false, message: "Please verify your email first" }, { status: 403 });
    // }

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    return NextResponse.json({
      success: true,
      message: "Login successful",
      data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } },
    });
  } catch (error) {
  console.error("LOGIN_ERROR:", error)
  return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
}
}