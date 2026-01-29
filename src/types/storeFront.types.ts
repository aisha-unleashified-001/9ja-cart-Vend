export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  image: string;
  isNew?: boolean;
  colors?: string[];
  category?: string;
  description?: string;
  /** When present, only active products are shown in "All Products" */
  status?: string;
  isActive?: string | number | boolean;
  productId?: string;
  productName?: string;
  productImages?: string[];
  currentPrice?: number;
  shortDescription?: string;
  inventory?: { inStock?: boolean };
}

export interface Category {
  id: string;
  categoryName: string; // Updated to match your component usage
  image?: string;
}

export interface StorefrontQuery {
  vendorId?: string; // Added
  page: number;
  perPage: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}

export interface ContactVendorPayload {
  vendorId: string;
  name: string;
  email: string;
  message: string;
  phone?: string;
}

export interface BestSellerQuery {
  vendorId?: string; // Added
  limit: number;
  period: "week" | "month" | "year";
  category?: string;
}
