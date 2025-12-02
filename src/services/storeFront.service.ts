import { apiClient } from "@/lib/api/client";
import type {
  BestSellerQuery,
  ContactVendorPayload,
  StorefrontQuery,
} from "@/types/storeFront.types";

export const storefrontService = {
  getVendorBestSellers: async (query: BestSellerQuery) => {
    const params = new URLSearchParams();
    if (query.limit) params.append("limit", query.limit.toString());
    if (query.period) params.append("period", query.period);
    if (query.category) params.append("category", query.category);
    
    const url = `/vendor/${query.vendorId}/best-sellers${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get(url);
    return response;
  },

  getVendorProducts: async (query: StorefrontQuery) => {
    const params = new URLSearchParams();
    if (query.page) params.append("page", query.page.toString());
    if (query.perPage) params.append("perPage", query.perPage.toString());
    if (query.search) params.append("search", query.search);
    if (query.category) params.append("category", query.category);
    if (query.minPrice) params.append("minPrice", query.minPrice.toString());
    if (query.maxPrice) params.append("maxPrice", query.maxPrice.toString());
    if (query.sortBy) params.append("sortBy", query.sortBy);
    
    const url = `/vendor/${query.vendorId}/products${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get(url);
    return response;
  },

  getCategories: async () => {
    const response = await apiClient.get(`/business/get-categories`);
    return response;
  },

  contactVendor: async (payload: ContactVendorPayload) => {
    const response = await apiClient.post(`/vendor/contact`, payload);
    return response;
  },
};
