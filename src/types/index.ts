export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  onSale?: boolean;
  isFeatured?: boolean;
  sortBy?: "newest" | "price_asc" | "price_desc" | "best_selling" | "top_rated";
  page?: number;
  limit?: number;
}