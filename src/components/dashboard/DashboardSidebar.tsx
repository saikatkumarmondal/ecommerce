"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User, Package, Heart, Settings,
  LogOut, ChevronRight, ShoppingBag,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { clearCart } from "@/store/slices/cartSlice";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "My Profile", href: "/dashboard", icon: User },
  { label: "My Orders", href: "/dashboard/orders", icon: Package },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    router.push("/");
  };

  return (
    <div className="bg-card border rounded-2xl overflow-hidden">
      {/* User Info */}
      <div className="p-5 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 border-2 border-primary/20">
            <AvatarFallback className="bg-primary text-white font-bold text-lg">
              {user?.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-bold truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium mt-0.5 inline-block">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Nav Links */}
      <nav className="p-3">
        <div className="space-y-1">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link key={href} href={href}>
                <motion.div
                  whileHover={{ x: 3 }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer",
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium flex-1">{label}</span>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 opacity-70" />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>

        <Separator className="my-3" />

        <Link href="/products">
          <motion.div
            whileHover={{ x: 3 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-sm font-medium">Continue Shopping</span>
          </motion.div>
        </Link>

        <motion.button
          whileHover={{ x: 3 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 text-muted-foreground hover:text-red-500 transition-all mt-1"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Logout</span>
        </motion.button>
      </nav>
    </div>
  );
}