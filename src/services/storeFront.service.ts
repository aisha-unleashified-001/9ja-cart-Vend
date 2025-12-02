import { apiClient } from "@/lib/api/client";
import type {
  BestSellerQuery,
  ContactVendorPayload,
  StorefrontQuery,
} from "@/types/storeFront.types";

export const storefrontService = {
  getVendorBestSellers: async (query: BestSellerQuery) => {
    const response = await apiClient.get(`/vendor/${query.vendorId}/best-sellers`, {
      params: query,
    });
    return response;
  },

  getVendorProducts: async (query: StorefrontQuery) => {
    const response = await apiClient.get(`/vendor/${query.vendorId}/products`, {
      params: query,
    });
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
