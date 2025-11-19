import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { productsService } from "@/services/products.service";
import type {
  Product,
  ProductsQuery,
  ProductsState,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/types";

// Helper functions for localStorage persistence
const ARCHIVED_PRODUCTS_KEY = 'archived_products';

const loadArchivedProductIds = (): Set<string> => {
  try {
    const stored = localStorage.getItem(ARCHIVED_PRODUCTS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return new Set<string>(parsed);
    }
  } catch (error) {
    console.error('Failed to load archived products from localStorage:', error);
  }
  return new Set<string>();
};

const saveArchivedProductIds = (ids: Set<string>): void => {
  try {
    localStorage.setItem(ARCHIVED_PRODUCTS_KEY, JSON.stringify(Array.from(ids)));
  } catch (error) {
    console.error('Failed to save archived products to localStorage:', error);
  }
};

interface ProductsStore extends ProductsState {
  // Extended state
  loadingStep: string | null;
  archivedProductIds: Set<string>; // Track archived products to hide them
  // Actions
  fetchProducts: (query?: ProductsQuery) => Promise<void>;
  fetchProduct: (productId: string) => Promise<void>;
  fetchProductDetails: (productId: string) => Promise<void>;
  createProduct: (productData: CreateProductRequest) => Promise<Product>;
  updateProduct: (productData: UpdateProductRequest) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  archiveProduct: (productId: string) => Promise<void>;
  restoreProduct: (productId: string) => Promise<void>;
  toggleProductStatus: (productId: string, isActive: boolean) => Promise<void>;
  setQuery: (query: Partial<ProductsQuery>) => void;
  clearError: () => void;
  clearCurrentProduct: () => void;
  reset: () => void;
  setLoadingStep: (step: string | null) => void;
}

const initialState: ProductsState = {
  products: [],
  currentProduct: null,
  pagination: null,
  isLoading: false,
  error: null,
  query: {
    page: 1,
    perPage: 10,
    // Don't filter by isActive by default - let vendors see all their products
  },
};



export const useProductsStore = create<ProductsStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      loadingStep: null,
      archivedProductIds: loadArchivedProductIds(), // Load from localStorage on init

      fetchProducts: async (query?: ProductsQuery) => {
        console.log('🚨 fetchProducts called with query:', query);
        console.trace('🚨 fetchProducts call stack');
        set({ isLoading: true, error: null });

        try {
          const currentQuery = { ...get().query, ...query };
          const statusFilter = currentQuery.statusFilter || 'all';
          const archivedIds = get().archivedProductIds;

          // Handle archived filter - show only archived products
          if (statusFilter === 'archived') {
            // Fetch all products without isActive filter to get archived ones
            const allProductsQuery = { ...currentQuery };
            delete allProductsQuery.isActive;
            delete allProductsQuery.statusFilter;
            
            const response = await productsService.getProducts(allProductsQuery);
            
            // Filter to show only archived products
            const archivedProducts = response.data.filter(
              product => archivedIds.has(product.productId)
            );

            set({
              products: archivedProducts,
              pagination: {
                ...response.pagination,
                totalItems: archivedProducts.length,
                totalPages: Math.ceil(archivedProducts.length / (currentQuery.perPage || 10)),
              },
              query: currentQuery,
              isLoading: false,
              error: null,
            });
            return;
          }

          // For active/inactive filters
          // Note: We need to handle client-side filtering for some cases
          // because the API only supports isActive filter, not stock level
          let shouldFilterClientSide = false;
          
          if (statusFilter === 'active') {
            // Active = isActive='1' AND stock > 0
            currentQuery.isActive = '1';
            shouldFilterClientSide = true;
          } else if (statusFilter === 'inactive') {
            // Inactive/Out of stock = isActive='0' OR (isActive='1' AND stock <= 0)
            // We need all products to filter client-side
            delete currentQuery.isActive;
            shouldFilterClientSide = true;
          } else {
            // For 'all', don't filter by isActive
            delete currentQuery.isActive;
          }

          // Remove statusFilter from API query
          const apiQuery = { ...currentQuery };
          delete apiQuery.statusFilter;

          const response = await productsService.getProducts(apiQuery);

          // Filter out archived products from the display (unless showing archived)
          let filteredProducts = response.data.filter(
            product => !archivedIds.has(product.productId)
          );

          // Apply client-side filtering for status
          if (shouldFilterClientSide) {
            if (statusFilter === 'active') {
              // Show only products with status 'active' (isActive='1' AND stock > 0)
              filteredProducts = filteredProducts.filter(product => 
                product.isActive === '1' && parseInt(product.stock) > 0
              );
            } else if (statusFilter === 'inactive') {
              // Show products with status 'inactive' or 'out_of_stock'
              filteredProducts = filteredProducts.filter(product => 
                product.isActive === '0' || parseInt(product.stock) <= 0
              );
            }
          }

          set({
            products: filteredProducts,
            pagination: response.pagination,
            query: currentQuery,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch products";
          set({
            products: [],
            pagination: null,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      fetchProduct: async (productId: string) => {
        set({ isLoading: true, error: null });

        try {
          const product = await productsService.getProduct(productId);
          set({
            currentProduct: product,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch product";
          set({
            currentProduct: null,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      fetchProductDetails: async (productId: string) => {
        set({ isLoading: true, error: null });

        try {
          const product = await productsService.getProductDetails(productId);
          set({
            currentProduct: product,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch product details";
          set({
            currentProduct: null,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      createProduct: async (productData: CreateProductRequest): Promise<Product> => {
        set({ isLoading: true, error: null, loadingStep: "Creating product..." });

        try {
          // Step 1: Create product
          set({ loadingStep: "Creating product..." });
          const newProduct = await productsService.createProduct(productData);

          // Add to products list if we're on the first page
          const currentState = get();
          if (currentState.query.page === 1) {
            set({
              products: [newProduct, ...currentState.products],
              isLoading: false,
              loadingStep: null,
              error: null,
            });
          } else {
            set({ 
              isLoading: false, 
              loadingStep: null,
              error: null 
            });
          }

          return newProduct;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to create product";
          set({
            isLoading: false,
            loadingStep: null,
            error: errorMessage,
          });
          throw error;
        }
      },

      updateProduct: async (productData: UpdateProductRequest) => {
        set({ isLoading: true, error: null, loadingStep: "Updating product..." });

        try {
          // Step 1: Update product data
          set({ loadingStep: "Updating product..." });
          
          // Step 2: Upload new images if provided
          if (productData.images && productData.images.length > 0) {
            set({ loadingStep: "Uploading new images..." });
          }

          const updatedProduct = await productsService.updateProduct(
            productData
          );

          // Update in products list
          const currentState = get();
          const updatedProducts = currentState.products.map((product) =>
            product.productId === updatedProduct.productId
              ? updatedProduct
              : product
          );

          set({
            products: updatedProducts,
            currentProduct: updatedProduct,
            isLoading: false,
            loadingStep: null,
            error: null,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to update product";
          set({
            isLoading: false,
            loadingStep: null,
            error: errorMessage,
          });
          throw error;
        }
      },

      deleteProduct: async (productId: string) => {
        set({ isLoading: true, error: null });

        try {
          await productsService.deleteProduct(productId);

          // Remove from products list
          const currentState = get();
          const filteredProducts = currentState.products.filter(
            (product) => product.productId !== productId
          );

          set({
            products: filteredProducts,
            currentProduct:
              currentState.currentProduct?.productId === productId
                ? null
                : currentState.currentProduct,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to delete product";
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      archiveProduct: async (productId: string) => {
        set({ isLoading: true, error: null });

        try {
          await productsService.archiveProduct(productId);

          // Add to archived list and remove from displayed products
          const currentState = get();
          const newArchivedIds = new Set(currentState.archivedProductIds);
          newArchivedIds.add(productId);
          
          // Persist to localStorage
          saveArchivedProductIds(newArchivedIds);

          const filteredProducts = currentState.products.filter(
            (product) => product.productId !== productId
          );

          set({
            products: filteredProducts,
            archivedProductIds: newArchivedIds,
            currentProduct:
              currentState.currentProduct?.productId === productId
                ? null
                : currentState.currentProduct,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to archive product";
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      restoreProduct: async (productId: string) => {
        set({ isLoading: true, error: null });

        try {
          await productsService.restoreProduct(productId);

          // Remove from archived list
          const currentState = get();
          const newArchivedIds = new Set(currentState.archivedProductIds);
          newArchivedIds.delete(productId);
          
          // Persist to localStorage
          saveArchivedProductIds(newArchivedIds);

          set({
            archivedProductIds: newArchivedIds,
          });

          // After restore, refetch products to include the restored product
          // The product will appear in the list again
          const currentQuery = get().query;
          await get().fetchProducts(currentQuery);

          set({
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to restore product";
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      toggleProductStatus: async (productId: string, isActive: boolean) => {
        // Don't set global loading state for quick actions
        try {
          const updatedProduct = await productsService.toggleProductStatus(
            productId,
            isActive
          );

          // Update in products list - merge with existing data to prevent missing fields
          const currentState = get();
          const updatedProducts = currentState.products.map((product) => {
            if (product.productId === productId) {
              // Merge updated data with existing product data to prevent missing fields
              return {
                ...product,
                ...updatedProduct,
                // Ensure critical fields are preserved if missing from response
                productName: updatedProduct.productName || product.productName,
                productDescription: updatedProduct.productDescription || product.productDescription,
                images: updatedProduct.images || product.images || [],
              };
            }
            return product;
          });

          set({
            products: updatedProducts,
            currentProduct:
              currentState.currentProduct?.productId === productId
                ? { ...currentState.currentProduct, ...updatedProduct }
                : currentState.currentProduct,
          });
        } catch (error) {
          // Don't set global error state - let the component handle it
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to update product status";
          throw new Error(errorMessage);
        }
      },

      setQuery: (query: Partial<ProductsQuery>) => {
        const currentQuery = get().query;
        set({ query: { ...currentQuery, ...query } });
      },

      clearError: () => {
        set({ error: null });
      },

      clearCurrentProduct: () => {
        set({ currentProduct: null });
      },

      setLoadingStep: (step: string | null) => {
        set({ loadingStep: step });
      },

      reset: () => {
        set({ ...initialState, loadingStep: null, archivedProductIds: loadArchivedProductIds() });
      },
    }),
    {
      name: "products-store",
    }
  )
);
