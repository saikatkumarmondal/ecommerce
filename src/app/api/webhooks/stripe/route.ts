import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";   // Prisma পাথ যদি ভুল হয় তাহলে পরিবর্তন করুন

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const { orderNumber } = session.metadata || {};

    if (orderNumber) {
      try {
        const order = await prisma.order.findFirst({
          where: { orderNumber },
        });

        if (order) {
          // ✅ Prisma schema অনুসারে সঠিক ফিল্ড আপডেট
          await prisma.order.update({
            where: { id: order.id },
            data: {
              orderStatus: "PAID",
              paymentStatus: "PAID",
              stripeSessionId: session.id,
            },
          });

          // Optional: Payment মডেলেও রেকর্ড তৈরি করুন
          await prisma.payment.upsert({
            where: { orderId: order.id },
            update: {
              stripePaymentId: session.payment_intent as string,
              status: "PAID",
              amount: order.total,
            },
            create: {
              orderId: order.id,
              stripePaymentId: session.payment_intent as string,
              amount: order.total,
              status: "PAID",
            },
          });

          console.log("✅ Order updated successfully:", orderNumber);
        }
      } catch (dbError) {
        console.error("Database update error:", dbError);
      }
    }
  }

  return NextResponse.json({ received: true });
}