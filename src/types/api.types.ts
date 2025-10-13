export interface ApiResponse<T = any> {
  status: number;
  error: boolean;
  message: string;
  data?: T;
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