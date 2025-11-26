export interface ApiResponse<T = any> {
  status: number;
  error: boolean;
  message: string;
  data?: T;
  pagination: {
    currentPage: number;
    perPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface ProductsApiResponseWrapper {
  status: number;
  error: boolean;
  message: string;
  data: unknown[];
  pagination: {
    currentPage: number;
    perPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface ApiError {
  status: number;
  error: number;
  messages: {
    error: string;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OrdersQuery {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
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

export interface OrdersResponse extends ApiResponse<Order[]> {
  pagination: Pagination;
}
