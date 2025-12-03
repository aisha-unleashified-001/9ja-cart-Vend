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


      console.log("📦 Categories API Response:", response.data);
      // Extract categories and pagination from the response
      const responseData = response as unknown as ProductsApiResponseWrapper;
      const rawData = responseData.data as any[];
      
      if (rawData.length > 0) {
        console.log("🔍 Raw Category Keys:", Object.keys(rawData[0]));
      }

      const categoriesData = rawData.map((item) => ({
        ...item,
        id: item.id || item._id || item.categoryId || item.uuid || String(item.key || ""), // Map various ID fields to id
        categoryName: item.categoryName || item.name || "Unknown Category",
      })) as Category[];

      const paginationData = responseData.pagination;

      console.log("📋 Parsed categories:", categoriesData.map(c => ({ 
        id: c.id, 
        name: c.categoryName, 
        idType: typeof c.id 
      })));

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