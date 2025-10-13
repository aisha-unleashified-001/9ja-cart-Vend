
import type { ApiError } from '@/types';

export interface ApiClientError extends Error {
  status?: number;
  data?: ApiError;
}

export interface RequestConfig {
  requiresAuth?: boolean;
  customHeaders?: Record<string, string>;
  isFormData?: boolean;
}

export interface ExtendedAxiosConfig extends RequestConfig {
  method?: string;
  url?: string;
  data?: unknown;
  headers?: Record<string, string>;
}

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestOptions extends RequestConfig {
  method: ApiMethod;
  url: string;
  data?: unknown;
  params?: Record<string, unknown>;
}