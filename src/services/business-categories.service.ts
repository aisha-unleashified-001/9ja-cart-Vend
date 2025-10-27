import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import type { BusinessCategory } from '@/types/business-category.types';

export class BusinessCategoriesService {
  async getBusinessCategories(): Promise<BusinessCategory[]> {
    try {
      const response = await apiClient.get<BusinessCategory[]>(
        API_ENDPOINTS.BUSINESS.CATEGORIES,
        {
          requiresAuth: false, // Uses Basic Auth from config
        }
      );

      if (response.error) {
        throw new Error(response.message || 'Failed to fetch business categories');
      }

      console.log('🏷️ Business Categories API Response:', {
        status: response.status,
        error: response.error,
        message: response.message,
        rawResponse: response,
        dataCount: response.data?.length || 0,
        sampleCategory: response.data?.[0]
      });

      // The API client returns {status, error, message, data}
      // The categories are in response.data
      return response.data || [];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch business categories';
      throw new Error(errorMessage);
    }
  }
}

// Export singleton instance
export const businessCategoriesService = new BusinessCategoriesService();