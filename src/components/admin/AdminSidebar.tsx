"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tags,
  ShoppingBag,
  Users,
  LogOut,
  ShoppingBag as Logo,
  Menu,
  X,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Brands", href: "/admin/brands", icon: Tags },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Reviews", href: "/admin/reviews", icon: MessageSquare },
];

const sidebarVariants = {
  hidden: {
    x: -280,
  },
  visible: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 280,
      damping: 30,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    x: -15,
  },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.35,
    },
  }),
};

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-[60] w-11 h-11 rounded-xl bg-gray-950 text-white flex items-center justify-center shadow-xl backdrop-blur-sm"
      >
        <Menu className="w-5 h-5" />
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            onClick={() => setMobileOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="hidden"
        animate={mobileOpen || typeof window !== "undefined" ? "visible" : "hidden"}
        className={`fixed top-0 left-0 z-50 h-screen
          w-[280px] sm:w-[280px] md:w-[280px] lg:w-64
          bg-gradient-to-b from-gray-950 via-gray-950 to-gray-900
          text-white border-r border-gray-800/60
          flex flex-col
          transform-gpu
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 lg:px-6 py-5 border-b border-gray-800/60">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{
                rotate: 5,
                scale: 1.05,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
              }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-xl shadow-primary/25"
            >
              <Logo className="w-5 h-5 text-white" />
            </motion.div>

            <div>
              <h2 className="font-bold text-base lg:text-lg tracking-tight">
                Admin Panel
              </h2>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800">
          <div className="space-y-1.5">
            {navItems.map(({ label, href, icon: Icon }, index) => {
              const isActive = pathname === href;

              return (
                <motion.div
                  key={href}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="relative block group"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="admin-active-nav"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 35,
                        }}
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/20"
                      />
                    )}

                    <div
                      className={`relative z-10 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? "text-white"
                          : "text-gray-400 group-hover:text-white group-hover:bg-white/[0.04]"
                      }`}
                    >
                      <motion.div
                        whileHover={{
                          x: 2,
                        }}
                        transition={{
                          duration: 0.2,
                        }}
                      >
                        <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                      </motion.div>

                      <span>{label}</span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-800/60">
          <Link
            href="/"
            className="group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all duration-300"
          >
            <motion.div
              whileHover={{
                x: -2,
              }}
            >
              <LogOut className="w-4.5 h-4.5" />
            </motion.div>

            <span>Back to Store</span>
          </Link>
        </div>
      </motion.aside>
    </>
  );
}