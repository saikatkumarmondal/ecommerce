"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ShoppingCart, Heart, User,
  Menu, X, LogOut, ShoppingBag,
  ChevronDown, Sparkles, Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GeminiIcon } from "@/components/chat/GeminiIcon";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { clearCart } from "@/store/slices/cartSlice";
import { MobileDrawer } from "./MobileDrawer";
import { useDebounce } from "@/hooks/useDebounce";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useGetCategoriesQuery } from "@/services/categoryApi";

/* ── Tactile Icon Button ── */
function TactileIconBtn({
  children, badgeCount, badgeColor, onClick, className, href,
}: {
  children: React.ReactNode;
  badgeCount?: number;
  badgeColor?: string;
  onClick?: () => void;
  className?: string;
  href?: string;
}) {
  const btn = (
    <motion.button
      whileHover={{ scale: 1.08, y: -1 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className={cn(
        "relative h-9 w-9 rounded-xl bg-white/80 backdrop-blur border border-zinc-200 flex items-center justify-center shadow-sm hover:shadow-md hover:bg-white transition-all duration-200",
        className
      )}
    >
      {children}
      {badgeCount !== undefined && badgeCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            "absolute -top-1.5 -right-1.5 h-[18px] min-w-[18px] px-1 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white",
            badgeColor ?? "bg-black text-white"
          )}
        >
          {badgeCount > 99 ? "99+" : badgeCount}
        </motion.span>
      )}
    </motion.button>
  );

  if (href) return <Link href={href}>{btn}</Link>;
  return btn;
}

/* ── Categories Dropdown ── */
function CategoriesDropdown() {
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-zinc-700 hover:text-black hover:bg-white/80 transition-all duration-200"
      >
        Categories
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ type: "spring" as const, stiffness: 400, damping: 30 }}
            className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl border border-zinc-200 shadow-2xl shadow-black/10 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-zinc-100 bg-gradient-to-r from-zinc-50 to-white">
              <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">Browse Categories</p>
            </div>

            {/* Scrollable list */}
            <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-track-zinc-50 scrollbar-thumb-zinc-200 hover:scrollbar-thumb-zinc-300">
              {isLoading ? (
                <div className="p-4 space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 rounded-xl bg-zinc-100 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="p-2">
                  {categories?.map((cat: any, idx: number) => (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                    >
                      <Link
                        href={`/products?categoryId=${cat.id}`}
                        onClick={() => setOpen(false)}
                        className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-zinc-900 hover:to-zinc-700 hover:text-white transition-all duration-200"
                      >
                        {cat.image ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-8 h-8 rounded-lg object-cover flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-zinc-100 group-hover:bg-white/20 flex-shrink-0 transition-colors" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{cat.name}</p>
                          <p className="text-xs text-zinc-400 group-hover:text-white/70 transition-colors">
                            {cat._count?.products ?? 0} products
                          </p>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-3 py-2 border-t border-zinc-100">
              <Link
                href="/products"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-zinc-800 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                View All Products
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Cart Notification ── */
function CartNotification({ count, onDismiss }: { count: number; onDismiss: () => void }) {
  const [show, setShow] = useState(false);
  const prevCount = useRef(count);

  useEffect(() => {
    if (count > prevCount.current) {
      setShow(true);
      const t = setTimeout(() => {
        setShow(false);
        onDismiss();
      }, 3000);
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count, onDismiss]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="absolute top-12 right-0 bg-zinc-900 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-xl whitespace-nowrap z-50 flex items-center gap-2"
        >
          <ShoppingCart className="w-3.5 h-3.5 text-green-400" />
          Item added to cart!
          <div className="absolute -top-1.5 right-3 w-3 h-3 bg-zinc-900 rotate-45" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Main Navbar ── */
export function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const cartItems = useAppSelector((s) => s.cart.items);
  const wishlistIds = useAppSelector((s) => s.wishlist.productIds);

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartNotifDismissed, setCartNotifDismissed] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 500);
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    setCartNotifDismissed(false);
  }, [cartCount]);

  useEffect(() => {
    if (debouncedSearch.trim()) {
      router.push(`/products?search=${encodeURIComponent(debouncedSearch)}`);
    }
  }, [debouncedSearch, router]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-500 border-b",
          isScrolled
            ? "bg-zinc-100/95 backdrop-blur-xl shadow-sm border-zinc-200/80 py-1.5"
            : "bg-zinc-100 border-zinc-200/60 py-2"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center h-12 gap-3">

            {/* Mobile Menu */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden h-9 w-9 rounded-xl hover:bg-zinc-200 flex items-center justify-center transition-colors"
            >
              <Menu className="w-5 h-5 text-zinc-700" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.08, rotate: -5 }}
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-700 flex items-center justify-center shadow-md"
              >
                <ShoppingBag className="w-4 h-4 text-white" />
              </motion.div>
              <span className="text-base font-black tracking-tight text-zinc-900 hidden sm:block">
                {APP_NAME}
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5 ml-2">
              <Link href="/">
                <Button variant="ghost" size="sm" className="font-bold text-zinc-700 hover:text-black hover:bg-white/80 rounded-xl text-sm px-3">
                  Home
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="ghost" size="sm" className="font-bold text-zinc-700 hover:text-black hover:bg-white/80 rounded-xl text-sm px-3">
                  Products
                </Button>
              </Link>
              <CategoriesDropdown />
            </nav>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:block px-2">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-zinc-700 transition-colors" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="pl-9 h-9 rounded-xl bg-white/80 border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-zinc-400 placeholder:text-zinc-400 shadow-inner"
                />
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-auto">

              {/* Mobile search */}
              <div className="sm:hidden">
                <TactileIconBtn onClick={() => router.push("/products")}>
                  <Search className="w-4 h-4 text-zinc-700" />
                </TactileIconBtn>
              </div>

              {/* Gemini */}
              <TactileIconBtn onClick={() => window.dispatchEvent(new CustomEvent("openAIChat"))}>
                <GeminiIcon className="w-4.5 h-4.5" />
              </TactileIconBtn>

              {/* Wishlist */}
              {isAuthenticated && (
                <TactileIconBtn href="/wishlist" badgeCount={wishlistIds.length} badgeColor="bg-rose-500 text-white">
                  <Heart className="w-4 h-4 text-zinc-700" />
                </TactileIconBtn>
              )}

              {/* Cart with notification */}
              <div className="relative">
                <TactileIconBtn href="/cart" badgeCount={cartCount} badgeColor="bg-black text-white">
                  <ShoppingCart className="w-4 h-4 text-zinc-700" />
                </TactileIconBtn>
                {!cartNotifDismissed && (
                  <CartNotification
                    count={cartCount}
                    onDismiss={() => setCartNotifDismissed(true)}
                  />
                )}
              </div>

              {/* User */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="h-9 w-9 rounded-xl overflow-hidden border-2 border-zinc-200 hover:border-zinc-400 transition-colors shadow-sm"
                    >
                      <Avatar className="w-full h-full rounded-[10px]">
                        <AvatarFallback className="text-xs font-black bg-gradient-to-br from-zinc-900 to-zinc-700 text-white rounded-[10px]">
                          {user?.name?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </motion.button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl border border-zinc-200 bg-white/95 backdrop-blur p-2 shadow-2xl">
                    <div className="px-3 py-2 mb-1">
                      <p className="text-sm font-bold truncate">{user?.name}</p>
                      <p className="text-xs text-zinc-400 truncate">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-zinc-100 mb-1" />
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5 focus:bg-zinc-100">
                      <Link href="/dashboard" className="flex items-center gap-2 font-medium text-sm">
                        <User className="w-4 h-4 text-zinc-500" />
                        My Dashboard
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === "ADMIN" && (
                      <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5 focus:bg-purple-50">
                        <Link href="/admin" className="flex items-center gap-2 font-medium text-sm text-purple-700">
                          <Sparkles className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-zinc-100 my-1" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="rounded-xl cursor-pointer py-2.5 focus:bg-red-50 focus:text-red-600 text-red-600 font-medium text-sm"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden sm:flex gap-2">
                  <Link href="/login">
                    <Button size="sm" className="bg-black text-white hover:bg-zinc-800 rounded-xl font-bold px-4 h-9">
                      Login
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <MobileDrawer isOpen={isMobileDrawerOpen} onClose={() => setIsMobileDrawerOpen(false)} />
    </>
  );
}
