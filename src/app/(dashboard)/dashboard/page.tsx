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
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1], // Custom smooth ease-out cubic
    },
  },
};

const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 22,
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
      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50",
    },
    {
      label: "Wishlist Items",
      value: wishlistItems.length,
      icon: Heart,
      color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="relative space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-primary/10 blur-[100px] opacity-70" />
        <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-blue-500/10 blur-[100px] opacity-70" />
      </div>

      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="rounded-3xl border border-border/60 bg-gradient-to-r from-primary/10 via-background to-primary/5 p-6 md:p-8 backdrop-blur-sm"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          My Profile
        </h1>
        <p className="text-muted-foreground text-sm md:text-base mt-1.5">
          Manage your account information and view statistics.
        </p>
      </motion.div>

      {/* Profile Card */}
      <motion.div variants={itemVariants}>
        <Card className="group relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-background via-background to-muted/40 p-6 md:p-8 shadow-xl transition-colors duration-300">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
            <motion.div whileHover={{ scale: 1.05, rotate: 2 }} transition={springTransition}>
              <Avatar className="h-24 w-24 border-4 border-background shadow-xl ring-4 ring-primary/20">
                <AvatarFallback className="bg-gradient-to-tr from-primary to-primary/80 text-primary-foreground text-3xl font-black">
                  {user?.name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </motion.div>

            <div className="flex-1 min-w-0 w-full">
              <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-3 mb-4">
                <h2 className="text-2xl font-bold tracking-tight text-foreground truncate max-w-full">
                  {user?.name}
                </h2>
                <Badge
                  variant={user?.role === "ADMIN" ? "default" : "secondary"}
                  className="px-2.5 py-0.5 font-semibold text-xs tracking-wide uppercase shadow-sm"
                >
                  {user?.role}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-sm text-muted-foreground border-t border-border/40 pt-4">
                {[
                  { icon: Mail, label: user?.email, title: "Email Address" },
                  { icon: Shield, label: `Role: ${user?.role}`, title: "Access Level" },
                  {
                    icon: Calendar,
                    label: `Member since ${new Date().getFullYear()}`,
                    title: "Registration",
                  },
                ].map(({ icon: Icon, label, title }) => (
                  <div
                    key={label}
                    title={title}
                    className="flex items-center gap-3 bg-muted/30 dark:bg-muted/10 rounded-xl p-2.5 border border-border/20 hover:text-foreground transition-colors"
                  >
                    <Icon className="w-4 h-4 text-primary shrink-0" />
                    <span className="truncate font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <motion.div
            key={label}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={springTransition}
          >
            <Card className="group rounded-3xl border border-border/40 bg-gradient-to-br from-background to-muted/20 p-6 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-3xl font-extrabold tracking-tight text-foreground">{value}</p>
                  <p className="text-sm font-medium text-muted-foreground mt-0.5">{label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="rounded-3xl border border-border/40 bg-gradient-to-br from-background to-muted/10 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-foreground tracking-tight">Recent Orders</h3>

              <Link
                href="/dashboard/orders"
                className="text-xs md:text-sm text-primary hover:text-primary/80 transition-colors font-semibold bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/10"
              >
                View all
              </Link>
            </div>

            <div className="space-y-1">
              {recentOrders.map((order, idx) => (
                <div key={order.id}>
                  {idx > 0 && <Separator className="my-1 opacity-60" />}

                  <motion.div
                    whileHover={{ x: 4, backgroundColor: "rgba(var(--muted), 0.15)" }}
                    transition={{ type: "tween", duration: 0.2 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl p-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">
                        {order.orderNumber}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex sm:flex-col justify-between sm:justify-center items-center sm:items-end gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-border/30">
                      <p className="text-sm font-extrabold text-foreground">
                        ${Number(order.total).toFixed(2)}
                      </p>

                      <span
                        className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold tracking-wide ${
                          order.orderStatus === "DELIVERED"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : order.orderStatus === "CANCELLED"
                            ? "bg-destructive/10 text-destructive border border-destructive/20"
                            : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
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