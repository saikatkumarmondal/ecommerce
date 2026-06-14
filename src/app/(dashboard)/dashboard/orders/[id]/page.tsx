"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, Package, MapPin,
  CreditCard, Calendar, Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOrderByIdQuery } from "@/services/orderApi";
import {
  formatDate, formatPrice, getOrderStatusColor,
} from "@/lib/utils";

const ORDER_TIMELINE = [
  "PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED",
];

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: order, isLoading } = useGetOrderByIdQuery(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Order not found.</p>
        <Link href="/dashboard/orders">
          <Button variant="outline" className="mt-4">
            Back to Orders
          </Button>
        </Link>
      </div>
    );
  }

  const currentStep = ORDER_TIMELINE.indexOf(order.orderStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link href="/dashboard/orders">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-black">{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <Badge
          className={`ml-auto text-sm px-3 py-1 ${getOrderStatusColor(order.orderStatus)}`}
        >
          {order.orderStatus}
        </Badge>
      </motion.div>

      {/* Timeline */}
      {order.orderStatus !== "CANCELLED" &&
        order.orderStatus !== "REFUNDED" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border rounded-2xl p-6"
          >
            <h3 className="font-bold mb-5">Order Progress</h3>
            <div className="flex items-center">
              {ORDER_TIMELINE.map((step, idx) => {
                const isCompleted = idx <= currentStep;
                const isActive = idx === currentStep;
                return (
                  <div key={step} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1.5">
                      <motion.div
                        animate={{
                          backgroundColor: isCompleted
                            ? "hsl(var(--primary))"
                            : "hsl(var(--muted))",
                          scale: isActive ? 1.15 : 1,
                        }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          isCompleted ? "text-white" : "text-muted-foreground"
                        }`}
                      >
                        {idx + 1}
                      </motion.div>
                      <span
                        className={`text-[10px] font-medium text-center whitespace-nowrap ${
                          isActive
                            ? "text-primary"
                            : isCompleted
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                    {idx < ORDER_TIMELINE.length - 1 && (
                      <div className="flex-1 mx-2 mb-5">
                        <div className="h-0.5 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: "0%" }}
                            animate={{
                              width: idx < currentStep ? "100%" : "0%",
                            }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="h-full bg-primary rounded-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card border rounded-2xl p-6"
          >
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Order Items ({order.items?.length})
            </h3>
            <div className="space-y-4">
              {order.items?.map((item, idx) => (
                <div key={item.id}>
                  {idx > 0 && <Separator className="mb-4" />}
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                      {item.product?.images?.[0]?.url && (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm line-clamp-2">
                        {item.product?.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Qty: {item.quantity} ×{" "}
                        {formatPrice(Number(item.price))}
                      </p>
                    </div>
                    <p className="font-bold text-sm flex-shrink-0">
                      {formatPrice(Number(item.price) * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Shipping Address */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border rounded-2xl p-6"
          >
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Shipping Address
            </h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">
                {(order.shippingAddress as any)?.fullName}
              </p>
              <p>{(order.shippingAddress as any)?.address}</p>
              <p>
                {(order.shippingAddress as any)?.city},{" "}
                {(order.shippingAddress as any)?.zipCode}
              </p>
              <p>{(order.shippingAddress as any)?.country}</p>
              <p>{(order.shippingAddress as any)?.phone}</p>
            </div>
          </motion.div>
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-4"
        >
          {/* Price Breakdown */}
          <div className="bg-card border rounded-2xl p-5 space-y-3">
            <h3 className="font-bold flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              Payment Summary
            </h3>
            <div className="space-y-2 text-sm">
              {[
                { label: "Subtotal", value: order.subtotal },
                { label: "Shipping", value: order.shipping },
                { label: "Tax", value: order.tax },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">
                    {formatPrice(Number(value))}
                  </span>
                </div>
              ))}
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">
                    -{formatPrice(Number(order.discount))}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-primary">
                  {formatPrice(Number(order.total))}
                </span>
              </div>
            </div>
            <Badge
              className={`w-full justify-center ${
                order.paymentStatus === "PAID"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              Payment: {order.paymentStatus}
            </Badge>
          </div>

          {/* Order Meta */}
          <div className="bg-card border rounded-2xl p-5 space-y-3">
            <h3 className="font-bold">Order Info</h3>
            <div className="space-y-2 text-sm">
              {[
                {
                  icon: Hash,
                  label: "Order ID",
                  value: order.orderNumber,
                },
                {
                  icon: Calendar,
                  label: "Date",
                  value: formatDate(order.createdAt),
                },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="font-medium truncate">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}