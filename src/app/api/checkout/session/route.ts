import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { withAuth, AuthenticatedRequest } from "@/lib/auth-middleware";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const { items, shippingAddress, couponCode } = body;

    if (!items?.length) {
      return NextResponse.json({ success: false, message: "Cart is empty" }, { status: 400 });
    }

    const productIds = items.map((i: any) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { images: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) continue;

      const price = Number(product.discountPrice ?? product.price);
      subtotal += price * item.quantity;

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
          },
          unit_amount: Math.round(price * 100),
        },
        quantity: item.quantity,
      });
    }

    const SHIPPING_COST = Number(process.env.SHIPPING_COST ?? "20");
    const TAX_RATE = Number(process.env.TAX_RATE ?? "0.05");

    let discount = 0;
    let coupon = null;

    if (couponCode) {
      coupon = await prisma.coupon.findFirst({
        where: {
          code: couponCode.toUpperCase(),
          isActive: true,
          expiresAt: { gt: new Date() },
        },
      });

      if (coupon) {
        if (coupon.type === "PERCENTAGE") {
          discount = subtotal * (Number(coupon.value) / 100);
        } else {
          discount = Number(coupon.value);
        }
      }
    }

    const tax = subtotal * TAX_RATE;
    const total = subtotal - discount + SHIPPING_COST + tax;

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: req.user.userId,
        subtotal,
        shipping: SHIPPING_COST,
        tax,
        discount,
        total,
        orderStatus: "PENDING",
        paymentStatus: "UNPAID",
        shippingAddress,
        couponCode: coupon?.code,
        items: {
          create: items.map((item: any) => {
            const product = productMap.get(item.productId)!;
            const price = Number(product.discountPrice ?? product.price);
            return {
              productId: item.productId,
              quantity: item.quantity,
              price,
            };
          }),
        },
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?cancelled=true`,
      metadata: {
        orderId: order.id,
        userId: req.user.userId,
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({
      success: true,
      message: "Checkout session created",
      data: {
        sessionUrl: session.url,
        sessionId: session.id,
        orderId: order.id,
      },
    });
  } catch (error) {
    console.error("CHECKOUT_ERROR:", error);
    return NextResponse.json({ success: false, message: "Checkout failed" }, { status: 500 });
  }
});