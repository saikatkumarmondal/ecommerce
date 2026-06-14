export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentStatus = "UNPAID" | "PAID" | "FAILED" | "REFUNDED";

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  zipCode: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    images: { url: string }[];
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  couponCode?: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    discountPrice?: number;
    stock: number;
    images: { url: string }[];
  };
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
}