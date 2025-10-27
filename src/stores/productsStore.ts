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

interface ProductsStore extends ProductsState {
  // Extended state
  loadingStep: string | null;
  // Actions
  fetchProducts: (query?: ProductsQuery) => Promise<void>;
  fetchProduct: (productId: string) => Promise<void>;
  fetchProductDetails: (productId: string) => Promise<void>;
  createProduct: (productData: CreateProductRequest) => Promise<Product>;
  updateProduct: (productData: UpdateProductRequest) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
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
  },
};



export const useProductsStore = create<ProductsStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      loadingStep: null,

      fetchProducts: async (query?: ProductsQuery) => {
        console.log('🚨 fetchProducts called with query:', query);
        console.trace('🚨 fetchProducts call stack');
        set({ isLoading: true, error: null });

        try {
          const currentQuery = { ...get().query, ...query };
          const response = await productsService.getProducts(currentQuery);

          set({
            products: response.data,
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

      toggleProductStatus: async (productId: string, isActive: boolean) => {
        try {
          const updatedProduct = await productsService.toggleProductStatus(
            productId,
            isActive
          );

          // Update in products list
          const currentState = get();
          const updatedProducts = currentState.products.map((product) =>
            product.productId === productId ? updatedProduct : product
          );

          set({
            products: updatedProducts,
            currentProduct:
              currentState.currentProduct?.productId === productId
                ? updatedProduct
                : currentState.currentProduct,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to update product status";
          set({ error: errorMessage });
          throw error;
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
        set({ ...initialState, loadingStep: null });
      },
    }),
    {
      name: "products-store",
    }
  )
);
