"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ShoppingCart, Heart, MessageCircle, User,
  Menu, X, ChevronDown, Package, LayoutDashboard,
  LogOut, Settings, ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { clearCart } from "@/store/slices/cartSlice";
import { MegaMenu } from "./MegaMenu";
import { MobileDrawer } from "./MobileDrawer";
import { useDebounce } from "@/hooks/useDebounce";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const cartItems = useAppSelector((s) => s.cart.items);
  const wishlistIds = useAppSelector((s) => s.wishlist.productIds);

  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(searchQuery, 500);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setIsMegaMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-sm"
            : "bg-white dark:bg-gray-950"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16 gap-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileDrawerOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold hidden sm:block">{APP_NAME}</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 ml-2">
              <Link href="/">
                <Button variant="ghost" size="sm">Home</Button>
              </Link>
              <Link href="/products">
                <Button variant="ghost" size="sm">Products</Button>
              </Link>

              {/* Categories Mega Menu Trigger */}
              <div ref={megaMenuRef} className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                  onMouseEnter={() => setIsMegaMenuOpen(true)}
                  onClick={() => setIsMegaMenuOpen((v) => !v)}
                >
                  Categories
                  <motion.div
                    animate={{ rotate: isMegaMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </motion.div>
                </Button>

                <div onMouseLeave={() => setIsMegaMenuOpen(false)}>
                  <MegaMenu isOpen={isMegaMenuOpen} />
                </div>
              </div>
            </nav>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className={cn(
                "flex-1 max-w-xl transition-all duration-300",
                isSearchExpanded ? "max-w-2xl" : ""
              )}
            >
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products, brands, categories..."
                  className="pl-9 pr-4 h-10 bg-muted/50 border-0 focus-visible:ring-1 rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchExpanded(true)}
                  onBlur={() => setIsSearchExpanded(false)}
                />
                {searchQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </form>

            {/* Right Side Icons */}
            <div className="flex items-center gap-1 ml-auto">
              {/* Mobile Search */}
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden"
                onClick={() => router.push("/products")}
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* AI Chat */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex"
                onClick={() => {
                  const event = new CustomEvent("openAIChat");
                  window.dispatchEvent(event);
                }}
              >
                <MessageCircle className="w-5 h-5" />
              </Button>

              {/* Wishlist */}
              {isAuthenticated && (
                <Link href="/wishlist">
                  <Button variant="ghost" size="icon" className="relative">
                    <Heart className="w-5 h-5" />
                    <AnimatePresence>
                      {wishlistIds.length > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-1 -right-1"
                        >
                          <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px] rounded-full">
                            {wishlistIds.length}
                          </Badge>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </Link>
              )}

              {/* Cart */}
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  <AnimatePresence>
                    {cartItems.length > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1"
                      >
                        <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px] rounded-full bg-red-500">
                          {cartItems.reduce((sum, i) => sum + i.quantity, 0)}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary text-white text-xs">
                          {user?.name?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                      <p className="font-medium text-sm">{user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">
                        <User className="w-4 h-4 mr-2" /> My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/orders">
                        <Package className="w-4 h-4 mr-2" /> My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/wishlist">
                        <Heart className="w-4 h-4 mr-2" /> Wishlist
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === "ADMIN" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin">
                            <LayoutDashboard className="w-4 h-4 mr-2" /> Admin Panel
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings">
                        <Settings className="w-4 h-4 mr-2" /> Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-500 focus:text-red-500"
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Login</Button>
                  </Link>
                  <Link href="/register" className="hidden sm:block">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />
    </>
  );
}