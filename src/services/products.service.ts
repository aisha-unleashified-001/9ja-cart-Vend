import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import type { 
  Product, 
  ProductsResponse, 
  ProductsQuery, 
  CreateProductRequest, 
  UpdateProductRequest 
} from '@/types';
import type { ProductsApiResponseWrapper } from '@/types/api.types';

export class ProductsService {
  async getProducts(query: ProductsQuery = {}): Promise<ProductsResponse> {
    try {
      const params = new URLSearchParams();
      
      // Add query parameters
      if (query.page) params.append('page', query.page.toString());
      if (query.perPage) params.append('perPage', query.perPage.toString());
      if (query.search) params.append('search', query.search);
      if (query.categoryId) params.append('categoryId', query.categoryId);
      if (query.isActive) params.append('isActive', query.isActive);

      const url = `${API_ENDPOINTS.PRODUCTS.LIST}?${params.toString()}`;
      const response = await apiClient.get(url, {
        requiresAuth: true,
      });

      // The response from apiClient.get() is the full axios response.data
      // which has the structure: { status, error, message, data: Product[], pagination }
      if (response.error) {
        throw new Error(response.message || 'Failed to fetch products');
      }

      // Extract the products and pagination from the response
      const responseData = response as unknown as ProductsApiResponseWrapper;
      const productsData = responseData.data as Product[];
      const paginationData = responseData.pagination;

      return {
        data: productsData,
        pagination: paginationData
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
      throw new Error(errorMessage);
    }
  }

  async getProduct(productId: string): Promise<Product> {
    try {
      const response = await apiClient.get<Product>(
        `${API_ENDPOINTS.PRODUCTS.DETAIL}/${productId}`,
        { requiresAuth: true }
      );

      if (response.error || !response.data) {
        throw new Error(response.message || 'Failed to fetch product');
      }

      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch product';
      throw new Error(errorMessage);
    }
  }

  async createProduct(productData: CreateProductRequest): Promise<Product> {
    try {
      // Convert to FormData format
      const { createProductFormData, mapToFormData } = await import('@/lib/formData.utils');
      const formDataRequest = mapToFormData(productData);
      const formData = createProductFormData(formDataRequest);

      const response = await apiClient.post<Product>(
        API_ENDPOINTS.PRODUCTS.CREATE,
        formData,
        { 
          requiresAuth: true,
          isFormData: true
        }
      );

      if (response.error || !response.data) {
        throw new Error(response.message || 'Failed to create product');
      }

      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create product';
      throw new Error(errorMessage);
    }
  }

  async updateProduct(productData: UpdateProductRequest): Promise<Product> {
    try {
      const { productId, ...updateData } = productData;
      const response = await apiClient.put<Product>(
        `${API_ENDPOINTS.PRODUCTS.UPDATE}/${productId}`,
        updateData,
        { requiresAuth: true }
      );

      if (response.error || !response.data) {
        throw new Error(response.message || 'Failed to update product');
      }

      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update product';
      throw new Error(errorMessage);
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      const response = await apiClient.delete(
        `${API_ENDPOINTS.PRODUCTS.DELETE}/${productId}`,
        { requiresAuth: true }
      );

      if (response.error) {
        throw new Error(response.message || 'Failed to delete product');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete product';
      throw new Error(errorMessage);
    }
  }

  async toggleProductStatus(productId: string, isActive: boolean): Promise<Product> {
    try {
      const response = await apiClient.patch<Product>(
        `${API_ENDPOINTS.PRODUCTS.UPDATE}/${productId}`,
        { isActive: isActive ? '1' : '0' },
        { requiresAuth: true }
      );

      if (response.error || !response.data) {
        throw new Error(response.message || 'Failed to update product status');
      }

      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update product status';
      throw new Error(errorMessage);
    }
  }
}

// Export singleton instance
export const productsService = new ProductsService();