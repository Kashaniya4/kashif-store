export interface ProductSpecs {
  [key: string]: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  isFeatured?: boolean;
  description: string;
  image: string;
  specs: ProductSpecs;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = 
  | 'jazzcash'
  | 'easypaisa'
  | 'sadapay'
  | 'nayapay'
  | 'cod'
  | 'bank_transfer'
  | 'card';

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type CourierName = 
  | 'TCS Express'
  | 'Leopards Courier'
  | 'Trax Logistics'
  | 'PostEx'
  | 'CallCourier';

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  isGuest: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  customer: CustomerDetails;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'unpaid' | 'pending_verification';
  transactionId?: string;
  paymentProofUrl?: string;
  status: OrderStatus;
  courier?: CourierName;
  trackingNumber?: string;
  promoCodeApplied?: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  provider: 'guest' | 'google' | 'facebook' | 'apple' | 'email';
}

export interface PromoCode {
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minSpend?: number;
  description: string;
}
