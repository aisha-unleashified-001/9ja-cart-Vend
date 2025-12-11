export type OrderSort = "recent" | "oldest";

export interface OrdersQuery {
  page: number;
  perPage: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  customerName?: string;
  orderNo?: string;
  paymentMethod?: string;
  sortBy?: string; 
}

export interface Order {
  orderNo: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus?: string;
  customerName: string;
  orderEarning?: number;
  createdAt: string;
  totalItemsCount: number;
}

export interface OrdersMetrics {
  totalOrders?: number;
  deliveredOrders?: number;
  returnedOrders?: number;
  cancelledOrders?: number;
  pendingOrders?: number;
}

export interface Pagination {
  currentPage: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  count?: number;
  metrics?: OrdersMetrics;
}

export interface OrdersResponse {
  status: number;
  error: boolean;
  message: string;
  data: Order[];
  pagination: Pagination;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
}
