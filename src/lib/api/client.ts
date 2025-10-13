import axios, {
  type AxiosInstance,
  type AxiosResponse,
  AxiosError,
} from "axios";
import toast from "react-hot-toast";
import { apiConfig } from "./config";
import { tokenStorage, clearAuthData, isTokenExpired } from "@/lib/auth.utils";
import type { ApiResponse, ApiError } from "@/types";
import type {
  ApiClientError,
  RequestConfig,
  ExtendedAxiosConfig,
} from "./types";

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create(apiConfig);
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Check if this request requires Bearer token authentication
        const extendedConfig = config as ExtendedAxiosConfig;
        const requiresAuth = extendedConfig?.requiresAuth;

        if (requiresAuth) {
          // Add JWT token for authenticated requests (Bearer token)
          const token = tokenStorage.get();
          if (token && !isTokenExpired(token)) {
            config.headers["Authorization"] = `Bearer ${token}`;
          }
        }
        // If requiresAuth is false, only use Basic Auth from apiConfig headers

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        return response;
      },
      (error: AxiosError<ApiError>) => {
        return this.handleError(error);
      }
    );
  }

  private handleError(error: AxiosError<ApiError>): Promise<never> {
    const apiError: ApiClientError = new Error("API Error");

    if (error.response) {
      const { status, data } = error.response;
      apiError.status = status;
      apiError.data = data;

      // Handle different error scenarios
      switch (status) {
        case 401:
          // Check if it's a token expiration or basic auth issue
          if (data?.messages?.error?.includes("Invalid login credentials")) {
            // User credentials error - don't clear auth data
            apiError.message = data.messages.error;
          } else {
            // Token expired or basic auth failed
            clearAuthData();
            apiError.message = "Session expired. Please login again.";
            // Redirect to login could be handled here or in the component
          }
          break;

        case 400:
          apiError.message = data?.messages?.error || "Bad request";
          break;

        case 403:
          apiError.message = "Access forbidden";
          break;

        case 404:
          apiError.message = "Resource not found";
          break;

        case 500:
          apiError.message = "Internal server error";
          toast.error("Server error. Please try again later.");
          break;

        default:
          apiError.message = data?.messages?.error || "An error occurred";
      }
    } else if (error.request) {
      // Network error
      apiError.message = "Network error. Please check your connection.";
      toast.error(apiError.message);
    } else {
      // Request setup error
      apiError.message = "Request failed";
    }

    return Promise.reject(apiError);
  }

  // Generic request method
  async request<T = unknown>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const requestConfig: Record<string, unknown> = {
      method,
      url,
      data,
      ...config,
      // Pass requiresAuth flag to the interceptor
      requiresAuth: config?.requiresAuth ?? true, // Default to true for backward compatibility
    };

    // Handle FormData - don't set Content-Type, let browser set it with boundary
    if (config?.isFormData && data instanceof FormData) {
      // Remove Content-Type header for FormData to let browser set it with boundary
      if (requestConfig.headers && typeof requestConfig.headers === "object") {
        delete (requestConfig.headers as Record<string, string>)[
          "Content-Type"
        ];
      }
    }

    const response = await this.instance.request<ApiResponse<T>>(requestConfig);
    return response.data;
  }

  // Convenience methods
  async get<T = unknown>(
    url: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>("GET", url, undefined, config);
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>("POST", url, data, config);
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>("PUT", url, data, config);
  }

  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>("PATCH", url, data, config);
  }

  async delete<T = unknown>(
    url: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>("DELETE", url, undefined, config);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
