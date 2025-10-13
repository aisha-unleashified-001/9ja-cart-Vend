import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import type { Category, CategoriesApiResponse } from '@/types';
import type { ProductsApiResponseWrapper } from '@/types/api.types';

export class CategoriesService {
  async getCategories(): Promise<CategoriesApiResponse> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.LIST, {
        requiresAuth: false, // Uses Basic Auth from config, not Bearer token
      });

      // The response structure is the same as products API
      if (response.error) {
        throw new Error(response.message || 'Failed to fetch categories');
      }

      // Extract categories and pagination from the response
      const responseData = response as unknown as ProductsApiResponseWrapper;
      const categoriesData = responseData.data as Category[];
      const paginationData = responseData.pagination;

      return {
        data: categoriesData,
        pagination: paginationData
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories';
      throw new Error(errorMessage);
    }
  }
}

// Export singleton instance
export const categoriesService = new CategoriesService();