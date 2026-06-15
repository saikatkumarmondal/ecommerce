"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Ticket, X, Save, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/shared/EmptyState";
import { useGetCouponsQuery, useCreateCouponMutation } from "@/services/couponApi";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminCouponsPage() {
  const { data: coupons = [], isLoading } = useGetCouponsQuery();
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    type: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
    value: "",
    minOrderAmt: "",
    maxUses: "",
    expiresAt: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.value) return;
    try {
      await createCoupon({
        code: formData.code.toUpperCase(),
        type: formData.type,
        value: Number(formData.value),
        minOrderAmt: formData.minOrderAmt ? Number(formData.minOrderAmt) : undefined,
        maxUses: formData.maxUses ? Number(formData.maxUses) : undefined,
        expiresAt: formData.expiresAt || undefined,
      }).unwrap();
      toast.success("Coupon created!");
      setIsFormOpen(false);
      setFormData({ code: "", type: "PERCENTAGE", value: "", minOrderAmt: "", maxUses: "", expiresAt: "" });
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to create coupon");
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
          <h1 className="text-2xl font-black">Coupons</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {coupons.length} coupons
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2 rounded-xl">
          <Plus className="w-4 h-4" />
          Create Coupon
        </Button>
      </motion.div>

      {/* Form */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card border rounded-2xl p-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold">New Coupon</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsFormOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Coupon Code *</Label>
                <Input
                  placeholder="SAVE10"
                  value={formData.code}
                  onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                  required
                  className="font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v: "PERCENTAGE" | "FIXED") =>
                    setFormData((p) => ({ ...p, type: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                    <SelectItem value="FIXED">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>
                  Value *{" "}
                  <span className="text-muted-foreground">
                    ({formData.type === "PERCENTAGE" ? "%" : "$"})
                  </span>
                </Label>
                <Input
                  type="number"
                  placeholder={formData.type === "PERCENTAGE" ? "10" : "50"}
                  value={formData.value}
                  onChange={(e) => setFormData((p) => ({ ...p, value: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Min Order Amount ($)</Label>
                <Input
                  type="number"
                  placeholder="100 (optional)"
                  value={formData.minOrderAmt}
                  onChange={(e) => setFormData((p) => ({ ...p, minOrderAmt: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Max Uses</Label>
                <Input
                  type="number"
                  placeholder="100 (optional)"
                  value={formData.maxUses}
                  onChange={(e) => setFormData((p) => ({ ...p, maxUses: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Expiry Date</Label>
                <Input
                  type="datetime-local"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData((p) => ({ ...p, expiresAt: e.target.value }))}
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-3 flex gap-3">
                <Button type="submit" disabled={isCreating} className="gap-2 rounded-xl">
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Create Coupon
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} className="rounded-xl">
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coupons Grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-36 bg-muted animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : coupons.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No coupons yet"
          description="Create discount coupons for your customers."
          actionLabel="Create Coupon"
          onAction={() => setIsFormOpen(true)}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((coupon, idx) => (
            <motion.div
              key={coupon.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-card border rounded-2xl p-5 relative overflow-hidden"
            >
              {/* Decorative */}
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-primary/5 to-transparent" />

              <div className="flex items-start justify-between gap-2 mb-3">
                <code className="text-lg font-black tracking-wider text-primary">
                  {coupon.code}
                </code>
                <Badge
                  variant={coupon.isActive ? "default" : "secondary"}
                  className="text-xs flex-shrink-0"
                >
                  {coupon.isActive ? (
                    <><Check className="w-3 h-3 mr-1" />Active</>
                  ) : "Inactive"}
                </Badge>
              </div>

              <div className="space-y-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="font-bold">
                    {coupon.type === "PERCENTAGE"
                      ? `${coupon.value}%`
                      : `$${coupon.value}`}
                  </span>
                </div>
                {coupon.minOrderAmt && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Min Order</span>
                    <span className="font-medium">${coupon.minOrderAmt}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Used</span>
                  <span className="font-medium">
                    {coupon.usedCount}
                    {coupon.maxUses ? ` / ${coupon.maxUses}` : ""}
                  </span>
                </div>
                {coupon.expiresAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Expires</span>
                    <span className="font-medium text-xs">
                      {formatDate(coupon.expiresAt)}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}