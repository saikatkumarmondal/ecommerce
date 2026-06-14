"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Package, ChevronRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { useGetOrdersQuery } from "@/services/orderApi";
import { formatDate, formatPrice, getOrderStatusColor } from "@/lib/utils";

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetOrdersQuery({ page, limit: 10 });

  const orders = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-black">My Orders</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track and manage your orders
        </p>
      </motion.div>

      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="When you place an order, it will appear here."
          actionLabel="Start Shopping"
          actionHref="/products"
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="bg-card border rounded-2xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                {/* Order Info */}
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-sm">{order.orderNumber}</p>
                    <Badge
                      className={`text-xs ${getOrderStatusColor(order.orderStatus)}`}
                      variant="outline"
                    >
                      {order.orderStatus}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        order.paymentStatus === "PAID"
                          ? "text-green-600 border-green-200 bg-green-50"
                          : "text-red-600 border-red-200 bg-red-50"
                      }`}
                    >
                      {order.paymentStatus}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.items?.length ?? 0} item(s)
                  </p>
                </div>

                {/* Price + Action */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="font-black text-lg text-primary">
                      {formatPrice(Number(order.total))}
                    </p>
                    {order.discount > 0 && (
                      <p className="text-xs text-green-600">
                        Saved {formatPrice(Number(order.discount))}
                      </p>
                    )}
                  </div>
                  <Link href={`/dashboard/orders/${order.id}`}>
                    <Button size="sm" variant="outline" className="gap-1.5 rounded-xl">
                      <Eye className="w-3.5 h-3.5" />
                      Details
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Items Preview */}
              {order.items && order.items.length > 0 && (
                <div className="mt-4 pt-4 border-t flex items-center gap-2 overflow-x-auto">
                  {order.items.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted overflow-hidden border"
                      title={item.product?.name}
                    >
                      {item.product?.images?.[0]?.url && (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted border flex items-center justify-center text-xs font-bold text-muted-foreground">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}

          {meta && (
            <Pagination meta={meta} onPageChange={setPage} />
          )}
        </div>
      )}
    </div>
  );
}