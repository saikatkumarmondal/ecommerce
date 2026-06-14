export interface ProductImage {
  id: string;
  url: string;
  productId: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  _count?: { products: number };
}

export interface Brand {
  id: string;
  name: string;
  logo?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  sku: string;
  price: number;
  discountPrice?: number;
  stock: number;
  isFeatured: boolean;
  status: string;
  rating: number;
  totalReviews: number;
  soldCount: number;
  categoryId: string;
  brandId: string;
  category: Category;
  brand: Brand;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
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

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  user: { name: string };
}