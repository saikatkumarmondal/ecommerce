"use client";

import { motion } from "framer-motion";
import { User, Mail, Shield, Calendar, Package, Heart } from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/store/hooks";
import { useGetOrdersQuery } from "@/services/orderApi";
import { useGetWishlistQuery } from "@/services/wishlistApi";
import { formatDate } from "@/lib/utils";

/* -------------------- Animations -------------------- */
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

export default function ProfilePage() {
  const { user } = useAppSelector((s) => s.auth);
  const { data: ordersData } = useGetOrdersQuery({ page: 1, limit: 3 });
  const { data: wishlistItems = [] } = useGetWishlistQuery();

  const recentOrders = ordersData?.data ?? [];
  const totalOrders = ordersData?.meta?.total ?? 0;

  const stats = [
    {
      label: "Total Orders",
      value: totalOrders,
      icon: Package,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "Wishlist Items",
      value: wishlistItems.length,
      icon: Heart,
      color: "text-red-500 bg-red-50 dark:bg-red-950/30",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="relative space-y-6"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="rounded-3xl border bg-gradient-to-r from-primary/10 via-background to-primary/5 p-6"
      >
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          My Profile
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account information
        </p>
      </motion.div>

      {/* Profile Card */}
      <motion.div variants={itemVariants}>
        <Card className="group relative overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-background to-muted/30 p-6 shadow-xl">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

          <div className="flex items-start gap-5">
            <motion.div whileHover={{ scale: 1.08, rotate: 5 }}>
              <Avatar className="h-20 w-20 border-4 border-primary/20 shadow-lg">
                <AvatarFallback className="bg-primary text-white text-2xl font-black">
                  {user?.name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </motion.div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h2 className="text-xl font-black">{user?.name}</h2>
                <Badge
                  variant={user?.role === "ADMIN" ? "default" : "secondary"}
                >
                  {user?.role}
                </Badge>
              </div>

              <div className="space-y-1.5 mt-3">
                {[
                  { icon: Mail, label: user?.email },
                  { icon: Shield, label: `Role: ${user?.role}` },
                  {
                    icon: Calendar,
                    label: `Member since ${new Date().getFullYear()}`,
                  },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {stats.map(({ label, value, icon: Icon, color }, idx) => (
          <motion.div
            key={label}
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <Card className="group rounded-3xl border-0 bg-gradient-to-br from-background to-muted/30 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-black">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="rounded-3xl border-0 bg-gradient-to-br from-background to-muted/20 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Recent Orders</h3>

              <Link
                href="/dashboard/orders"
                className="text-xs text-primary hover:underline font-medium"
              >
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {recentOrders.map((order, idx) => (
                <div key={order.id}>
                  {idx > 0 && <Separator className="mb-3" />}

                  <motion.div
                    whileHover={{ x: 6 }}
                    className="flex items-center justify-between gap-4 rounded-xl p-2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {order.orderNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold">
                        ${Number(order.total).toFixed(2)}
                      </p>

                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          order.orderStatus === "DELIVERED"
                            ? "bg-green-100 text-green-700"
                            : order.orderStatus === "CANCELLED"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}