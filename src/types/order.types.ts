export interface OrdersQuery {
  limit?: number;
  offset?: number;
  status?: string;
  search?: string;
  perPage?: string;
  page: number;
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

export interface Pagination {
  currentPage: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
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
