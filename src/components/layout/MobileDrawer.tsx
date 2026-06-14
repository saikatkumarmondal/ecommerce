"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X, Home, ShoppingBag, Heart, Package, User,
  LayoutDashboard, LogOut, ChevronRight, Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { clearCart } from "@/store/slices/cartSlice";
import { useGetCategoriesQuery } from "@/services/categoryApi";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const drawerVariants = {
  closed: { x: "-100%" },
  open: { x: 0 },
};

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const { data: categories = [] } = useGetCategoriesQuery();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    onClose();
    router.push("/");
  };

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "All Products", href: "/products", icon: ShoppingBag },
    { label: "Wishlist", href: "/wishlist", icon: Heart },
    { label: "My Orders", href: "/dashboard/orders", icon: Package },
    { label: "My Profile", href: "/dashboard", icon: User },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-950 z-50 shadow-2xl lg:hidden flex flex-col overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <span className="text-lg font-bold">Menu</span>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* User Info */}
            {isAuthenticated ? (
              <div className="p-4 bg-muted/30">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary text-white">
                      {user?.name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 flex gap-3">
                <Link href="/login" onClick={onClose} className="flex-1">
                  <Button variant="outline" className="w-full" size="sm">Login</Button>
                </Link>
                <Link href="/register" onClick={onClose} className="flex-1">
                  <Button className="w-full" size="sm">Sign Up</Button>
                </Link>
              </div>
            )}

            <Separator />

            {/* Nav Links */}
            <nav className="flex-1 p-3">
              <div className="space-y-1">
                {navItems.map(({ label, href, icon: Icon }) => (
                  <Link key={href} href={href} onClick={onClose}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                    >
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium text-sm">{label}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                    </motion.div>
                  </Link>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Categories */}
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-3 mb-3">
                Categories
              </p>
              <div className="space-y-1">
                {categories.slice(0, 6).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?categoryId=${cat.id}`}
                    onClick={onClose}
                  >
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                    >
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{cat.name}</span>
                    </motion.div>
                  </Link>
                ))}
              </div>

              {/* Admin Link */}
              {user?.role === "ADMIN" && (
                <>
                  <Separator className="my-4" />
                  <Link href="/admin" onClick={onClose}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary/10 text-primary transition-colors cursor-pointer"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      <span className="font-medium text-sm">Admin Dashboard</span>
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </motion.div>
                  </Link>
                </>
              )}
            </nav>

            {/* Logout */}
            {isAuthenticated && (
              <div className="p-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full text-red-500 hover:text-red-500 hover:bg-red-50 justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}