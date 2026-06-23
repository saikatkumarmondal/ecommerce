import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          orderStatus: "PAID",
          paymentStatus: "PAID",
        },
      });

      await prisma.payment.create({
        data: {
          orderId,
          stripePaymentId: session.payment_intent as string,
          amount: (session.amount_total ?? 0) / 100,
          status: "PAID",
        },
      });

      const orderItems = await prisma.orderItem.findMany({
        where: { orderId },
      });

      for (const item of orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            soldCount: { increment: item.quantity },
          },
        });
      }

      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (order?.couponCode) {
        await prisma.coupon.update({
          where: { code: order.couponCode },
          data: { usedCount: { increment: 1 } },
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}