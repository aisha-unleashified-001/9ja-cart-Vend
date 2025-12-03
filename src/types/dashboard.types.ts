import type { Booleanish } from '@/lib/boolean.utils';

export type AccountStatus = "active" | "pending" | "suspended" | "deactivated";

export interface DashboardSummary {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
  accountStatus?: AccountStatus;
  isActive?: boolean;
  isSuspended?: boolean;
}

export interface DashboardSummaryResponse
  extends Omit<DashboardSummary, 'isActive' | 'isSuspended'> {
  isActive?: Booleanish;
  isSuspended?: Booleanish;
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
  accountInfo?: {
    accountName?: string;
    accountNumber?: string;
    bank?: string;
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