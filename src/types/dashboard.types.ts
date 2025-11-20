export type AccountStatus = "active" | "pending" | "suspended" | "deactivated";

export interface DashboardSummary {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
  accountStatus?: AccountStatus;
}

export interface RecentOrder {
  orderNo: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  products: OrderProduct[];
}

export interface OrderProduct {
  product_name: string;
  quantity: string;
  price: string;
  subtotal: string;
}

export interface TopProduct {
  productId: string;
  productName: string;
  totalSold: number;
  totalRevenue: number;
  totalOrders: number;
}

export interface VendorProfile {
  account: {
    emailAddress: string;
    fullName: string;
    phoneNumber: string;
  };
  business: {
    businessName: string;
    businessCategory: string;
    businessRegNumber: string;
    storeName: string;
    businessAddress: string;
    taxIdNumber: string;
    idDocument: string;
    businessRegCertificate: string;
  };
  createdAt: string;
  updatedAt: string;
}