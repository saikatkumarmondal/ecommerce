"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Package,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingBag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { GeminiIcon } from "@/components/chat/GeminiIcon";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { clearCart } from "@/store/slices/cartSlice";

import { MegaMenu } from "./MegaMenu";
import { MobileDrawer } from "./MobileDrawer";
import { useDebounce } from "@/hooks/useDebounce";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                     SUB-COMPONENT: 3D TACTILE ICON BUTTON                   */
/* -------------------------------------------------------------------------- */
interface TactileIconBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  badgeCount?: number;
  badgeColor?: string;
}

function TactileIconBtn({ children, badgeCount, badgeColor, className, ...props }: TactileIconBtnProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.08, y: -2, rotateX: 8, rotateY: -8 }}
      whileTap={{ scale: 0.95, y: 1 }}
      className={cn(
        "relative h-9 w-9 rounded-xl bg-white text-black border border-zinc-300/60 flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.05),0_1px_0_rgba(0,0,0,0.1)_inside] hover:shadow-[0_8px_16px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.05)] transition-shadow duration-200 [transform-style:preserve-3d]",
        className
      )}
      {...props}
    >
      <div className="[transform:translateZ(10px)] flex items-center justify-center text-zinc-900">
        {children}
      </div>
      {badgeCount !== undefined && badgeCount > 0 && (
        <Badge className={cn("absolute -top-1.5 -right-1.5 h-4.5 min-w-[18px] px-1 text-[10px] font-bold rounded-full flex items-center justify-center border border-white shadow-sm [transform:translateZ(15px)]", badgeColor || "bg-black text-white")}>
          {badgeCount}
        </Badge>
      )}
    </motion.button>
  );
}

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
  const [isChatOpen, setIsChatOpen] = useState(false);

  const megaMenuRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(searchQuery, 500);

  /* ---------------- SEARCH ---------------- */
  useEffect(() => {
    if (debouncedSearch.trim()) {
      router.push(`/products?search=${encodeURIComponent(debouncedSearch)}`);
    }
  }, [debouncedSearch, router]);

  /* ---------------- SCROLL ---------------- */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------------- OUTSIDE CLICK ---------------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setIsMegaMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- GEMINI CHAT OPEN ---------------- */
  useEffect(() => {
    const handler = () => setIsChatOpen(true);
    window.addEventListener("openAIChat", handler);
    return () => window.removeEventListener("openAIChat", handler);
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
      {/* PREMIUM STYLISH CLOSE CHAT BUTTON */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => setIsChatOpen(false)}
            className="fixed top-4 right-[430px] sm:right-[430px] z-[99999] h-10 w-10 rounded-xl bg-zinc-900 text-white shadow-[0_10px_25px_rgba(0,0,0,0.25)] flex items-center justify-center border border-zinc-800 hover:bg-black group transition-all duration-300"
          >
            <X className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90 text-zinc-200" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* NAVBAR CONTAINER */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-500 ease-out border-b border-zinc-200/60 text-black",
          isScrolled
            ? "bg-zinc-100/90 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] py-2"
            : "bg-zinc-100 py-3",
          isChatOpen && "translate-y-[30px]"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center h-14 sm:h-12 gap-4 justify-between">

            {/* LEFT AREA: MOBILE DRAWER MENU & LOGO */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-9 w-9 rounded-xl hover:bg-zinc-200 text-black transition-colors"
                onClick={() => setIsMobileDrawerOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>

              {/* LOGO WITH 3D POP EFFECT */}
              <Link href="/" className="flex items-center gap-2.5 group">
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: -4 }}
                  className="w-8.5 h-8.5 rounded-xl bg-black flex items-center justify-center shadow-md shadow-black/10"
                >
                  <ShoppingBag className="w-4 h-4 text-white" />
                </motion.div>
                <span className="text-lg font-black tracking-tight text-black hidden sm:block">
                  {APP_NAME}
                </span>
              </Link>

              {/* DESKTOP NAV */}
              <nav className="hidden lg:flex items-center gap-1 ml-4">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="font-bold text-zinc-800 hover:text-black hover:bg-zinc-200 rounded-lg px-4">
                    Home
                  </Button>
                </Link>
                <Link href="/products">
                  <Button variant="ghost" size="sm" className="font-bold text-zinc-800 hover:text-black hover:bg-zinc-200 rounded-lg px-4">
                    Products
                  </Button>
                </Link>
              </nav>
            </div>

            {/* CENTER AREA: MODERN SEARCH BAR */}
            <form
              onSubmit={handleSearch}
              className="flex-1 max-w-lg hidden sm:block px-2"
            >
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search premium products..."
                  className="pl-10 pr-4 h-10 rounded-xl bg-white border border-zinc-300/70 text-black placeholder:text-zinc-400 focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:border-zinc-400 text-sm shadow-inner transition-all duration-200"
                />
              </div>
            </form>

            {/* RIGHT SIDE AREA: ACTIONS & USER CONTEXT */}
            <div className="flex items-center gap-2.5">

              {/* MOBILE SEARCH TACTILE TOGGLE */}
              <div className="sm:hidden">
                <TactileIconBtn onClick={() => router.push("/products")}>
                  <Search className="w-4.5 h-4.5" />
                </TactileIconBtn>
              </div>

              {/* GEMINI CHAT OVERLAY DISPATCHER */}
              <TactileIconBtn 
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("openAIChat"));
                }}
              >
                <GeminiIcon className="w-5 h-5" />
              </TactileIconBtn>

              {/* WISHLIST SELECTION AREA */}
              {isAuthenticated && (
                <Link href="/wishlist">
                  <TactileIconBtn badgeCount={wishlistIds.length} badgeColor="bg-black text-white">
                    <Heart className="w-4.5 h-4.5" />
                  </TactileIconBtn>
                </Link>
              )}

              {/* SHOPPING CART AREA */}
              <Link href="/cart">
                <TactileIconBtn 
                  badgeCount={cartItems.reduce((s, i) => s + i.quantity, 0)} 
                  badgeColor="bg-red-500 text-white"
                >
                  <ShoppingCart className="w-4.5 h-4.5" />
                </TactileIconBtn>
              </Link>

              {/* USER PROFILE REGION (SAFELY COMPLIANT WITH LOGOUT/VISIBILITY LAYOUTS) */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="h-9 w-9 rounded-xl overflow-hidden border border-zinc-300 bg-white p-0.5 flex items-center justify-center shadow-sm cursor-pointer"
                    >
                      <Avatar className="w-full h-full rounded-lg">
                        <AvatarFallback className="text-xs font-black bg-zinc-900 text-white uppercase rounded-lg">
                          {user?.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </motion.button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl text-black">
                    <DropdownMenuItem asChild className="focus:bg-zinc-100 rounded-xl cursor-pointer py-2.5">
                      <Link href="/dashboard" className="flex items-center gap-2 font-medium">
                        <User className="w-4 h-4 text-zinc-600" />
                        Profile Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-zinc-100 my-1" />
                    <DropdownMenuItem onClick={handleLogout} className="focus:bg-red-50 focus:text-red-600 text-red-600 rounded-xl cursor-pointer py-2.5 font-medium">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden sm:flex gap-2">
                  <Link href="/login">
                    <Button variant="default" size="sm" className="bg-black text-white hover:bg-zinc-800 rounded-xl font-bold px-4 h-9 shadow-sm">
                      Login
                    </Button>
                  </Link>
                </div>
              )}

            </div>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER PORTAL */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />
    </>
  );
}