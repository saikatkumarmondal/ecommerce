export const APP_NAME = "ShopFlow";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
export const API_BASE = "/api";
export const ITEMS_PER_PAGE = 12;

export const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Best Selling", value: "best_selling" },
  { label: "Top Rated", value: "top_rated" },
] as const;

export const PRICE_RANGES = [
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 – $200", min: 50, max: 200 },
  { label: "$200 – $500", min: 200, max: 500 },
  { label: "$500 – $1000", min: 500, max: 1000 },
  { label: "Over $1000", min: 1000, max: 999999 },
] as const;

export const ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
] as const;