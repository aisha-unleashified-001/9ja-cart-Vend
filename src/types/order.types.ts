export type OrderSort = "recent" | "oldest";

export interface OrdersQuery {
  page: number;
  perPage?: number;
  status?: string;
  search?: string;
  sortBy?: OrderSort;
}

export interface Order {
  orderNo: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  customerName: string;
  createdAt: string;
  totalItemsCount: number;
}

export interface OrdersMetrics {
  totalOrders?: number;
  delivered?: number;
  returns?: number;
  cancelled?: number;
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
