import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/constants";
import { environment } from "@/config/environment";
import { tokenStorage } from "@/lib/auth.utils";
import {
  createProductPayload,
  createEditProductPayload,
  validateProductData,
} from "@/lib/productData.utils";
import {
  createImageFormData,
  validateProductImages,
} from "@/lib/imageUpload.utils";
import type {
  Product,
  ProductsResponse,
  ProductsQuery,
  CreateProductRequest,
  UpdateProductRequest,
  UploadProductImagesRequest,
} from "@/types";
import type { ProductsApiResponseWrapper } from "@/types/api.types";

export class ProductsService {
  async getProducts(query: ProductsQuery = {}): Promise<ProductsResponse> {
    try {
      const params = new URLSearchParams();

      // Add query parameters
      if (query.page) params.append("page", query.page.toString());
      if (query.perPage) params.append("perPage", query.perPage.toString());
      if (query.search) params.append("search", query.search);
      if (query.categoryId) params.append("categoryId", query.categoryId);
      if (query.isActive) params.append("isActive", query.isActive);

      const url = `${API_ENDPOINTS.PRODUCTS.LIST}?${params.toString()}`;
      const response = await apiClient.get(url, {
        requiresAuth: true,
      });

      // The response from apiClient.get() is the full axios response.data
      // which has the structure: { status, error, message, data: Product[], pagination }
      if (response.error) {
        throw new Error(response.message || "Failed to fetch products");
      }

      // Extract the products and pagination from the response
      const responseData = response as unknown as ProductsApiResponseWrapper;
      const productsData = responseData.data as Product[];
      const paginationData = responseData.pagination;

      return {
        data: productsData,
        pagination: paginationData,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch products";
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
        throw new Error(response.message || "Failed to fetch product");
      }

      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch product";
      throw new Error(errorMessage);
    }
  }

  async getProductDetails(productId: string): Promise<Product> {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.PRODUCTS.ITEM_INFO}/${productId}`,
        { requiresAuth: true }
      );

      if (response.error || !response.data) {
        throw new Error(response.message || "Failed to fetch product details");
      }

      // The API returns { status, error, message, data: Product }
      // apiClient.get returns the full response, so response.data contains the Product
      return response.data as Product;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch product details";
      throw new Error(errorMessage);
    }
  }

  async createProduct(productData: CreateProductRequest): Promise<Product> {
    try {
      // Validate product data (excluding images for now)
      const validationErrors = validateProductData(productData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(", "));
      }

      // Create product (JSON only - no images)
      const productPayload = createProductPayload(productData);
      const createResponse = await apiClient.post<Product>(
        API_ENDPOINTS.PRODUCTS.CREATE,
        productPayload,
        { requiresAuth: true }
      );

      if (createResponse.error || !createResponse.data) {
        throw new Error(createResponse.message || "Failed to create product");
      }

      return createResponse.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create product";
      throw new Error(errorMessage);
    }
  }

  async uploadProductImages(
    uploadData: UploadProductImagesRequest
  ): Promise<void> {
    try {
      // Validate inputs
      if (!uploadData.productId) {
        throw new Error("Product ID is required for image upload");
      }

      if (!uploadData.images || uploadData.images.length === 0) {
        throw new Error("No images provided for upload");
      }

      // Validate images
      const imageErrors = validateProductImages(uploadData.images);
      if (imageErrors.length > 0) {
        throw new Error(imageErrors.join(", "));
      }

      // Create FormData with indexed field names like the working test
      const formData = createImageFormData(uploadData.images);

      console.log("🔍 Uploading images for product:", uploadData.productId);
      console.log("🔍 Number of images:", uploadData.images.length);

      // Get current user token
      const token = tokenStorage.get();
      if (!token) {
        throw new Error("Authentication required for image upload");
      }

      // Use fetch directly like the working test for reliability
      const response = await fetch(
        `${environment.apiBaseUrl}${API_ENDPOINTS.PRODUCTS.UPLOAD_IMAGES}/${uploadData.productId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to upload product images");
      }

      console.log("✅ Images uploaded successfully");
    } catch (error) {
      console.error("❌ Image upload error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to upload product images";
      throw new Error(errorMessage);
    }
  }

  async updateProduct(productData: UpdateProductRequest): Promise<Product> {
    try {
      const { productId, ...updateData } = productData;

      // Update product data (JSON only - images handled separately)
      const editPayload = createEditProductPayload(updateData);
      const response = await apiClient.put<Product>(
        `${API_ENDPOINTS.PRODUCTS.EDIT}/${productId}`,
        editPayload,
        { requiresAuth: true }
      );

      if (response.error || !response.data) {
        throw new Error(response.message || "Failed to update product");
      }

      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update product";
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
        throw new Error(response.message || "Failed to delete product");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete product";
      throw new Error(errorMessage);
    }
  }

  async archiveProduct(productId: string): Promise<void> {
    try {
      // PUT /product/archive/:id is used for archiving products
      const response = await apiClient.put(
        `${API_ENDPOINTS.PRODUCTS.ARCHIVE}/${productId}`,
        {},
        { requiresAuth: true }
      );

      if (response.error) {
        throw new Error(response.message || "Failed to archive product");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to archive product";
      throw new Error(errorMessage);
    }
  }

  async restoreProduct(productId: string): Promise<void> {
    try {
      // PUT /product/restore/:id is used for restoring archived products
      const response = await apiClient.put(
        `${API_ENDPOINTS.PRODUCTS.RESTORE}/${productId}`,
        {},
        { requiresAuth: true }
      );

      if (response.error) {
        throw new Error(response.message || "Failed to restore product");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to restore product";
      throw new Error(errorMessage);
    }
  }

  async toggleProductStatus(
    productId: string,
    isActive: boolean
  ): Promise<Product> {
    try {
      // Use POST to /product/status/:productId for both activate and deactivate
      // isActive: 1 for activate, 0 for deactivate
      const response = await apiClient.post<Product>(
        `${API_ENDPOINTS.PRODUCTS.STATUS}/${productId}`,
        { isActive: isActive ? 1 : 0 },
        { requiresAuth: true }
      );

      if (response.error || !response.data) {
        throw new Error(response.message || "Failed to update product status");
      }

      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update product status";
      throw new Error(errorMessage);
    }
  }
}

// Export singleton instance
export const productsService = new ProductsService();
