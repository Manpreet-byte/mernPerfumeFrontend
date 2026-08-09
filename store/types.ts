export type Product = {
  _id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  rating: number;
  totalReviews?: number;
  reviews?: number;
  fragranceNotes: string[];
  gender: string;
  volume: string;
  featured?: boolean;
  bestseller?: boolean;
  category?: { _id?: string; name: string; slug?: string };
  createdAt?: string;
};

export type CartItem = {
  _id: string;
  productId: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  quantity: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  authProvider?: 'local' | 'google';
  phone?: string;
  addresses?: Array<{
    _id?: string;
    label?: string;
    recipient: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
  }>;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
};

export type Review = {
  _id: string;
  user: { _id?: string; name: string; email?: string };
  product?: { _id?: string; name: string; slug?: string };
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Coupon = {
  id: string;
  _id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumPurchaseAmount: number;
  maximumDiscount: number | null;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  expiryDate: string;
  isActive: boolean;
  status: 'active' | 'inactive' | 'expired' | 'scheduled';
  createdAt?: string;
  updatedAt?: string;
};

export type CouponFormValues = {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumPurchaseAmount: number;
  maximumDiscount: number | null;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  expiryDate: string;
  isActive: boolean;
};

export type CouponValidationResponse = {
  message: string;
  coupon: Coupon;
  subtotal: number;
  discountAmount: number;
  finalAmount: number;
};
