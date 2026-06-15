"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  DollarSign, ShoppingCart, Package,
  Users, ArrowRight, TrendingUp,
} from "lucide-react";
import { StatsCard } from "@/components/admin/StatsCard";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { OrderStatusChart } from "@/components/admin/OrderStatusChart";
import { useGetAnalyticsQuery } from "@/services/adminApi";
import { useGetOrdersQuery } from "@/services/orderApi";
import { StatCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { formatPrice, formatDate, getOrderStatusColor } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const { data: analytics, isLoading } = useGetAnalyticsQuery();
  const { data: ordersData } = useGetOrdersQuery({ page: 1, limit: 100 });
  const allOrders = ordersData?.data ?? [];

  const STATS = [
    {
      title: "Total Revenue",
      value: isLoading ? "..." : formatPrice(Number(analytics?.totalRevenue ?? 0)),
      icon: DollarSign,
      trend: "+12.5%",
      trendUp: true,
      color: "bg-green-100 text-green-600 dark:bg-green-950/40",
    },
    {
      title: "Total Orders",
      value: analytics?.totalOrders ?? 0,
      icon: ShoppingCart,
      trend: "+8.2%",
      trendUp: true,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-950/40",
    },
    {
      title: "Total Products",
      value: analytics?.totalProducts ?? 0,
      icon: Package,
      trend: "+3.1%",
      trendUp: true,
      color: "bg-purple-100 text-purple-600 dark:bg-purple-950/40",
    },
    {
      title: "Total Customers",
      value: analytics?.totalCustomers ?? 0,
      icon: Users,
      trend: "+15.3%",
      trendUp: true,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-950/40",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-black">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))
          : STATS.map((stat, idx) => (
              <StatsCard
                key={stat.title}
                {...stat}
                delay={idx * 0.06}
              />
            ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart orders={allOrders} />
        </div>
        <div>
          <OrderStatusChart orders={allOrders} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-card border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold">Recent Orders</h3>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {(analytics?.recentOrders ?? []).slice(0, 5).map((order: any) => (
              <Link key={order.id} href={`/admin/orders/${order.id}`}>
                <div className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {order.orderNumber}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.user?.name} · {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm font-bold">
                      {formatPrice(Number(order.total))}
                    </span>
                    <Badge
                      className={`text-xs ${getOrderStatusColor(order.orderStatus)}`}
                    >
                      {order.orderStatus}
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold">Top Products</h3>
            <Link href="/admin/products">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {(analytics?.topProducts ?? []).slice(0, 5).map(
              (product: any, idx: number) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors"
                >
                  <span className="w-6 text-sm font-black text-muted-foreground text-center">
                    {idx + 1}
                  </span>
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {product.images?.[0]?.url && (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.soldCount} sold
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600 font-semibold flex-shrink-0">
                    <TrendingUp className="w-3 h-3" />
                    {product.soldCount}
                  </div>
                </div>
              )
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}