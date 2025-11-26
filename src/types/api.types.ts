export interface ApiPaginationMeta {
  currentPage: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
}

export interface ApiResponse<T = unknown> {
  status: number;
  error: boolean;
  message: string;
  data?: T;
  pagination?: ApiPaginationMeta;
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

export interface PaginatedResponse<T> {
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
