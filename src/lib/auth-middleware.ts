import { NextRequest, NextResponse } from "next/server";
import { verifyToken, JwtPayload } from "./jwt";

export type AuthenticatedRequest = NextRequest & { user: JwtPayload };

type RouteHandler = (req: AuthenticatedRequest, ctx?: any) => Promise<NextResponse>;

export const withAuth = (handler: RouteHandler) => {
  return async (req: NextRequest, ctx?: any) => {
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = verifyToken(token);
      (req as AuthenticatedRequest).user = decoded;
      return handler(req as AuthenticatedRequest, ctx);
    } catch {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }
  };
};

export const withAdminAuth = (handler: RouteHandler) => {
  return withAuth(async (req: AuthenticatedRequest, ctx?: any) => {
    if (req.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Forbidden: Admin only" }, { status: 403 });
    }
    return handler(req, ctx);
  });
};