"use client";

import { motion } from "framer-motion";
import { Settings, User, Bell, Shield, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { useAppSelector } from "@/store/hooks";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAppSelector((s) => s.auth);

  const NOTIFICATION_SETTINGS = [
    {
      id: "orderUpdates",
      label: "Order Updates",
      description: "Get notified when your order status changes",
      defaultChecked: true,
    },
    {
      id: "promotions",
      label: "Promotions & Deals",
      description: "Receive emails about sales and special offers",
      defaultChecked: false,
    },
    {
      id: "newArrivals",
      label: "New Arrivals",
      description: "Be the first to know about new products",
      defaultChecked: false,
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-black flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account preferences
        </p>
      </motion.div>

      {/* Profile Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 rounded-2xl">
          <h2 className="font-bold flex items-center gap-2 mb-5">
            <User className="w-4 h-4 text-primary" />
            Account Information
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input defaultValue={user?.name} disabled />
            </div>
            <div className="space-y-1.5">
              <Label>Email Address</Label>
              <Input defaultValue={user?.email} disabled />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Input defaultValue={user?.role} disabled />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            To update your profile information, please contact support.
          </p>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="p-6 rounded-2xl">
          <h2 className="font-bold flex items-center gap-2 mb-5">
            <Bell className="w-4 h-4 text-primary" />
            Notification Preferences
          </h2>
          <div className="space-y-4">
            {NOTIFICATION_SETTINGS.map((setting, idx) => (
              <div key={setting.id}>
                {idx > 0 && <Separator className="mb-4" />}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">{setting.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {setting.description}
                    </p>
                  </div>
                  <Switch defaultChecked={setting.defaultChecked} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 rounded-2xl">
          <h2 className="font-bold flex items-center gap-2 mb-5">
            <Shield className="w-4 h-4 text-primary" />
            Security
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Change Password</p>
                <p className="text-xs text-muted-foreground">
                  Update your password regularly for security
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info("Password change coming soon")}
              >
                Change
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">
                  Two-Factor Authentication
                </p>
                <p className="text-xs text-muted-foreground">
                  Add an extra layer of security
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Card className="p-6 rounded-2xl border-red-200 dark:border-red-900">
          <h2 className="font-bold text-red-500 flex items-center gap-2 mb-4">
            <Trash2 className="w-4 h-4" />
            Danger Zone
          </h2>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">Delete Account</p>
              <p className="text-xs text-muted-foreground">
                Permanently delete your account and all data
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() =>
                toast.error("Account deletion is disabled in demo")
              }
            >
              Delete Account
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}