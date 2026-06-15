"use client";

import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, Tooltip,
  Legend, ResponsiveContainer,
} from "recharts";
import { Order } from "@/types/order.types";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  PAID: "#3b82f6",
  PROCESSING: "#8b5cf6",
  SHIPPED: "#06b6d4",
  DELIVERED: "#22c55e",
  CANCELLED: "#ef4444",
  REFUNDED: "#6b7280",
};

interface OrderStatusChartProps {
  orders: Order[];
}

export function OrderStatusChart({ orders }: OrderStatusChartProps) {
  const statusCounts = orders.reduce(
    (acc: Record<string, number>, order) => {
      acc[order.orderStatus] = (acc[order.orderStatus] ?? 0) + 1;
      return acc;
    },
    {}
  );

  const data = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  if (data.length === 0) {
    return (
      <div className="bg-card border rounded-2xl p-6 flex items-center justify-center h-72">
        <p className="text-muted-foreground text-sm">No order data yet</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card border rounded-2xl p-6"
    >
      <h3 className="font-bold mb-1">Order Status Distribution</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Breakdown of all orders by status
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={STATUS_COLORS[entry.name] ?? "#94a3b8"}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "12px",
              fontSize: "12px",
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-xs text-muted-foreground">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}