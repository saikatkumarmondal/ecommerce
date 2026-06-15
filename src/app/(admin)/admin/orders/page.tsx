"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/shared/Pagination";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/services/orderApi";
import { formatDate, formatPrice, getOrderStatusColor } from "@/lib/utils";
import { ORDER_STATUSES } from "@/lib/constants";
import { toast } from "sonner";

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetOrdersQuery({ page, limit: 10 });
  const [updateStatus] = useUpdateOrderStatusMutation();

  const orders = data?.data ?? [];
  const meta = data?.meta;

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await updateStatus({ id: orderId, orderStatus: status }).unwrap();
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-black">Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {meta?.total ?? 0} total orders
          </p>
        </div>
      </motion.div>

      {isLoading ? (
        <TableSkeleton rows={8} />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="No orders yet"
          description="Orders will appear here when customers make purchases."
        />
      ) : (
        <div className="bg-card border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  {["Order", "Customer", "Items", "Total", "Payment", "Status", "Date", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order, idx) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <p className="text-sm font-bold">{order.orderNumber}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-medium">
                          {(order as any).user?.name ?? "N/A"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(order as any).user?.email ?? ""}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm">
                        {order.items?.length ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-bold">
                        {formatPrice(Number(order.total))}
                      </span>
                    </td>
                    <td className="px-4 py-4">
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
                    </td>
                    <td className="px-4 py-4">
                      <Select
                        value={order.orderStatus}
                        onValueChange={(val) =>
                          handleStatusChange(order.id, val)
                        }
                      >
                        <SelectTrigger
                          className={`h-8 w-36 text-xs rounded-lg ${getOrderStatusColor(order.orderStatus)}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ORDER_STATUSES.map((s) => (
                            <SelectItem key={s} value={s} className="text-xs">
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {meta && <Pagination meta={meta} onPageChange={setPage} />}
    </div>
  );
}