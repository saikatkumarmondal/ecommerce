import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, AuthenticatedRequest } from "@/lib/auth-middleware";
import { z } from "zod";

const addToCartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1),
});

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  const cart = await prisma.cart.findUnique({
    where: { userId: req.user.userId },
    include: {
      items: {
        include: {
          product: { include: { images: { take: 1 } } },
        },
      },
    },
  });

  if (!cart) return NextResponse.json({ success: true, message: "Cart is empty", data: { items: [], subtotal: 0 } });

  const subtotal = cart.items.reduce((sum, item) => {
    const price = Number(item.product.discountPrice ?? item.product.price);
    return sum + price * item.quantity;
  }, 0);

  return NextResponse.json({ success: true, message: "Cart fetched", data: { ...cart, subtotal } });
});

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  const body = await req.json();
  const parsed = addToCartSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false, message: "Validation failed" }, { status: 400 });

  const { productId, quantity } = parsed.data;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.stock < quantity) {
    return NextResponse.json({ success: false, message: "Product unavailable or insufficient stock" }, { status: 400 });
  }

  let cart = await prisma.cart.findUnique({ where: { userId: req.user.userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId: req.user.userId } });
  }

  const cartItem = await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    update: { quantity: { increment: quantity } },
    create: { cartId: cart.id, productId, quantity },
    include: { product: { include: { images: { take: 1 } } } },
  });

  return NextResponse.json({ success: true, message: "Added to cart", data: cartItem }, { status: 201 });
});