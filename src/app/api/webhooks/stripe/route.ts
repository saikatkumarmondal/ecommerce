import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.CheckoutSession;
    const { userId, orderNumber, couponCode } = session.metadata!;

    const order = await prisma.order.findFirst({ where: { orderNumber } });
    if (!order) return NextResponse.json({ received: true });

    // Order status update
    await prisma.order.update({
      where: { id: order.id },
      data: { orderStatus: "PAID", paymentStatus: "PAID" },
    });

    // Payment record create
    await prisma.payment.create({
      data: {
        orderId: order.id,
        stripePaymentId: session.payment_intent as string,
        amount: order.total,
        status: "PAID",
      },
    });

    // Stock কমাও
    const orderItems = await prisma.orderItem.findMany({ where: { orderId: order.id } });
    for (const item of orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
          soldCount: { increment: item.quantity },
        },
      });
    }

    // Cart clear করো
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (cart) await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    // Coupon usedCount বাড়াও
    if (couponCode) {
      await prisma.coupon.updateMany({
        where: { code: couponCode },
        data: { usedCount: { increment: 1 } },
      });
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    await prisma.order.updateMany({
      where: { stripeSessionId: paymentIntent.id },
      data: { paymentStatus: "FAILED" },
    });
  }

  return NextResponse.json({ received: true });
}