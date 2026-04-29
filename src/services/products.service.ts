import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/constants";
import { environment } from "@/config/environment";
import { tokenStorage, userStorage } from "@/lib/auth.utils";
import { getVendorStorefrontUrl } from "@/lib/vendor.utils";
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
import type { ProductVariation, ProductFeature } from "@/types";

// Local storage helpers for caching product extras (variations/features) per product ID.
// This is a non-breaking enhancement used to ensure that variations/features entered
// during product creation/editing remain visible on view/edit pages even if
// the backend doesn't yet include them in all responses.
const LOCAL_EXTRAS_KEY = "product_variations_by_id";

type ProductExtras = {
  productVariations?: ProductVariation[];
  productFeatures?: ProductFeature[];
};

type ProductExtrasMap = Record<string, ProductExtras>;

const loadLocalExtras = (): ProductExtrasMap => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LOCAL_EXTRAS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};

    const map = parsed as Record<string, unknown>;
    const normalized: ProductExtrasMap = {};

    Object.keys(map).forEach((key) => {
      const value = map[key];
      if (Array.isArray(value)) {
        // Legacy shape: array of variations only
        normalized[key] = { productVariations: value as ProductVariation[] };
      } else if (value && typeof value === "object") {
        const obj = value as ProductExtras;
        normalized[key] = {
          productVariations: Array.isArray(obj.productVariations)
            ? obj.productVariations
            : undefined,
          productFeatures: Array.isArray(obj.productFeatures)
            ? obj.productFeatures
            : undefined,
        };
      }
    });

    return normalized;
  } catch (error) {
    console.warn("Failed to load local product extras cache:", error);
  }
  return {};
};

const saveLocalExtras = (map: ProductExtrasMap) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_EXTRAS_KEY, JSON.stringify(map));
  } catch (error) {
    console.warn("Failed to save local product extras cache:", error);
  }
};

const attachLocalExtrasIfMissing = (product: Product): Product => {
  if (typeof product.productId !== "string") {
    return product;
  }

  const map = loadLocalExtras();
  const cached = map[product.productId];

  if (!cached) {
    return product;
  }

  let updated = product;

  // Only attach variations if backend didn't send any but cache has some.
  if (
    (!product.productVariations || product.productVariations.length === 0) &&
    cached.productVariations &&
    cached.productVariations.length > 0
  ) {
    updated = {
      ...updated,
      productVariations: cached.productVariations,
    };
  }

  // Only attach features if backend didn't send any but cache has some.
  if (
    (!product.productFeatures || product.productFeatures.length === 0) &&
    cached.productFeatures &&
    cached.productFeatures.length > 0
  ) {
    updated = {
      ...updated,
      productFeatures: cached.productFeatures,
    };
  }

  return updated;
};

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

      // Get vendorId from current user to enrich products with storefront URL
      const currentUser = userStorage.get();
      const vendorId = currentUser?.vendorId || currentUser?.userId;

      // Enrich products with vendorStorefrontUrl if vendorId is available
      const enrichedProducts = vendorId
        ? productsData.map((product) =>
            attachLocalExtrasIfMissing({
              ...product,
              vendorId: product.vendorId || vendorId,
              vendorStorefrontUrl: getVendorStorefrontUrl(
                product.vendorId || vendorId
              ),
            })
          )
        : productsData.map((product) =>
            attachLocalExtrasIfMissing({
              ...product,
              vendorId: product.vendorId,
              vendorStorefrontUrl: product.vendorId
                ? getVendorStorefrontUrl(product.vendorId)
                : undefined,
            })
          );

      return {
        data: enrichedProducts,
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

      // Enrich product with vendorStorefrontUrl
      const product = response.data;
      const currentUser = userStorage.get();
      const vendorId = product.vendorId || currentUser?.vendorId || currentUser?.userId;
      
      const enrichedProduct: Product = attachLocalExtrasIfMissing({
        ...product,
        vendorId: product.vendorId || vendorId,
        vendorStorefrontUrl: vendorId
          ? getVendorStorefrontUrl(vendorId)
          : undefined,
      });

      return enrichedProduct;
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
      const product = response.data as Product;

      // Enrich product with vendorStorefrontUrl
      const currentUser = userStorage.get();
      const vendorId = product.vendorId || currentUser?.vendorId || currentUser?.userId;

      const enrichedProduct: Product = attachLocalExtrasIfMissing({
        ...product,
        vendorId: product.vendorId || vendorId,
        vendorStorefrontUrl: vendorId
          ? getVendorStorefrontUrl(vendorId)
          : undefined,
      });

      return enrichedProduct;
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

      // Validate categoryId format (should be a non-empty string)
      if (!productData.categoryId || productData.categoryId.trim() === "") {
        throw new Error("Category is required. Please select a valid category.");
      }

      // Create product (JSON only - no images)
      const productPayload = createProductPayload(productData);
      
      // Log the payload for debugging
      console.log("📦 CREATE PRODUCT — exact outbound JSON:");
      console.log(JSON.stringify(productPayload, null, 2));
      
      const createResponse = await apiClient.post<Product>(
        API_ENDPOINTS.PRODUCTS.CREATE,
        productPayload,
        { requiresAuth: true }
      );

      if (createResponse.error || !createResponse.data) {
        throw new Error(createResponse.message || "Failed to create product");
      }

      // Enrich product with vendorStorefrontUrl
      const product = createResponse.data;
      const currentUser = userStorage.get();
      const vendorId = product.vendorId || currentUser?.vendorId || currentUser?.userId;
      
      const enrichedProduct: Product = attachLocalExtrasIfMissing({
        ...product,
        vendorId: product.vendorId || vendorId,
        vendorStorefrontUrl: vendorId
          ? getVendorStorefrontUrl(vendorId)
          : undefined,
      });

      // Cache variations/features locally if they were part of the creation payload.
      if (enrichedProduct.productId) {
        const map = loadLocalExtras();
        const existing = map[enrichedProduct.productId] || {};
        const updatedExtras: ProductExtras = { ...existing };

        if (
          productData.productVariations &&
          productData.productVariations.length > 0
        ) {
          updatedExtras.productVariations = productData.productVariations;
        }

        if (
          productData.productFeatures &&
          productData.productFeatures.length > 0
        ) {
          updatedExtras.productFeatures = productData.productFeatures;
        }

        if (
          updatedExtras.productVariations ||
          updatedExtras.productFeatures
        ) {
          map[enrichedProduct.productId] = updatedExtras;
          saveLocalExtras(map);
        }
      }

      return enrichedProduct;
    } catch (error) {
      // Extract detailed error message from API response
      let errorMessage = "Failed to create product";
      
      if (error instanceof Error) {
        // Check if it's an ApiClientError with detailed error data
        const apiError = error as any;
        if (apiError.data?.messages?.error) {
          errorMessage = apiError.data.messages.error;
        } else if (apiError.message) {
          errorMessage = apiError.message;
        }
      }
      
      console.error("❌ Product creation error:", {
        error,
        message: errorMessage,
        productData: productData,
        categoryId: productData.categoryId,
      });
      
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
      console.log("📦 UPDATE PRODUCT — exact outbound JSON:");
      console.log(JSON.stringify(editPayload, null, 2));
      const response = await apiClient.put<Product>(
        `${API_ENDPOINTS.PRODUCTS.EDIT}/${productId}`,
        editPayload,
        { requiresAuth: true }
      );

      if (response.error || !response.data) {
        throw new Error(response.message || "Failed to update product");
      }

      // Enrich product with vendorStorefrontUrl
      const product = response.data;
      const currentUser = userStorage.get();
      const vendorId = product.vendorId || currentUser?.vendorId || currentUser?.userId;
      
      const enrichedProduct: Product = attachLocalExtrasIfMissing({
        ...product,
        vendorId: product.vendorId || vendorId,
        vendorStorefrontUrl: vendorId
          ? getVendorStorefrontUrl(vendorId)
          : undefined,
      });

      // If variations/features were edited, keep them in the local cache as well.
      if (enrichedProduct.productId) {
        const map = loadLocalExtras();
        const existing = map[enrichedProduct.productId] || {};
        const updatedExtras: ProductExtras = { ...existing };

        if (
          productData.productVariations &&
          productData.productVariations.length > 0
        ) {
          updatedExtras.productVariations = productData.productVariations;
        }

        if (
          productData.productFeatures &&
          productData.productFeatures.length > 0
        ) {
          updatedExtras.productFeatures = productData.productFeatures;
        }

        if (
          updatedExtras.productVariations ||
          updatedExtras.productFeatures
        ) {
          map[enrichedProduct.productId] = updatedExtras;
          saveLocalExtras(map);
        }
      }

      return enrichedProduct;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update product";
      throw new Error(errorMessage);
    }
  }

  async deleteProduct(productId: string): Promise<{ wasArchived: boolean; message: string }> {
    try {
      const response = await apiClient.delete(
        `${API_ENDPOINTS.PRODUCTS.DELETE}/${productId}`,
        { requiresAuth: true }
      );

      if (response.error) {
        throw new Error(response.message || "Failed to delete product");
      }

      // Check if the product was archived (based on backend message)
      // Backend will send a message indicating if it was archived or deleted
      // Products with active orders or in cart will be archived instead of deleted
      const message = response.message || "";
      const messageLower = message.toLowerCase();
      
      // Check for various indicators that the product was archived
      // Backend may mention: archive, archived, order, orders, cart, purchase, bought
      const wasArchived = 
        messageLower.includes("archive") || 
        messageLower.includes("archived") ||
        messageLower.includes("cannot be deleted") ||
        messageLower.includes("has active orders") ||
        messageLower.includes("in cart") ||
        messageLower.includes("has been purchased") ||
        messageLower.includes("has orders");

      // Log for debugging
      console.log("🗑️ Delete product response:", {
        productId,
        message,
        wasArchived,
        fullResponse: response
      });

      return {
        wasArchived,
        message: message || (wasArchived ? "Product archived successfully" : "Product deleted successfully")
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete product";
      throw new Error(errorMessage);
    }
  }

  async archiveProduct(productId: string): Promise<void> {
    try {
      // Archive is handled via DELETE /product/delete/:id per latest API docs
      const response = await apiClient.delete(
        `${API_ENDPOINTS.PRODUCTS.DELETE}/${productId}`,
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

      // Enrich product with vendorStorefrontUrl
      const product = response.data;
      const currentUser = userStorage.get();
      const vendorId = product.vendorId || currentUser?.vendorId || currentUser?.userId;
      
      const enrichedProduct: Product = {
        ...product,
        vendorId: product.vendorId || vendorId,
        vendorStorefrontUrl: vendorId ? getVendorStorefrontUrl(vendorId) : undefined,
      };

      return enrichedProduct;
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
