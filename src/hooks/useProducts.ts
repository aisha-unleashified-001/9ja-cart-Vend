import { useProductsStore } from '@/stores/productsStore';

// Main products hook with full interface
export const useProducts = () => {
  const store = useProductsStore();
  
  return {
    // State
    products: store.products || [],
    currentProduct: store.currentProduct,
    pagination: store.pagination,
    isLoading: store.isLoading,
    error: store.error,
    query: store.query,
    
    // Actions
    fetchProducts: store.fetchProducts,
    fetchProduct: store.fetchProduct,
    createProduct: store.createProduct,
    updateProduct: store.updateProduct,
    deleteProduct: store.deleteProduct,
    toggleProductStatus: store.toggleProductStatus,
    setQuery: store.setQuery,
    clearError: store.clearError,
    clearCurrentProduct: store.clearCurrentProduct,
    reset: store.reset,
  };
};

// Hook for components that only need products state
export const useProductsState = () => {
  const products = useProductsStore((state) => state.products || []);
  const currentProduct = useProductsStore((state) => state.currentProduct);
  const pagination = useProductsStore((state) => state.pagination);
  const isLoading = useProductsStore((state) => state.isLoading);
  const error = useProductsStore((state) => state.error);
  const query = useProductsStore((state) => state.query);

  return {
    products,
    currentProduct,
    pagination,
    isLoading,
    error,
    query,
  };
};

// Hook for components that only need products actions
export const useProductsActions = () => {
  const fetchProducts = useProductsStore((state) => state.fetchProducts);
  const fetchProduct = useProductsStore((state) => state.fetchProduct);
  const createProduct = useProductsStore((state) => state.createProduct);
  const updateProduct = useProductsStore((state) => state.updateProduct);
  const deleteProduct = useProductsStore((state) => state.deleteProduct);
  const toggleProductStatus = useProductsStore((state) => state.toggleProductStatus);
  const setQuery = useProductsStore((state) => state.setQuery);
  const clearError = useProductsStore((state) => state.clearError);
  const clearCurrentProduct = useProductsStore((state) => state.clearCurrentProduct);
  const reset = useProductsStore((state) => state.reset);

  return {
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    setQuery,
    clearError,
    clearCurrentProduct,
    reset,
  };
};

// Pagination helper hook
export const useProductsPagination = () => {
  const pagination = useProductsStore((state) => state.pagination);
  const query = useProductsStore((state) => state.query);
  const setQuery = useProductsStore((state) => state.setQuery);
  const fetchProducts = useProductsStore((state) => state.fetchProducts);

  const goToPage = (page: number) => {
    setQuery({ page });
    fetchProducts({ page });
  };

  const changePerPage = (perPage: number) => {
    setQuery({ page: 1, perPage });
    fetchProducts({ page: 1, perPage });
  };

  const nextPage = () => {
    if (pagination && query.page && query.page < pagination.totalPages) {
      goToPage(query.page + 1);
    }
  };

  const prevPage = () => {
    if (query.page && query.page > 1) {
      goToPage(query.page - 1);
    }
  };

  return {
    pagination,
    currentPage: query.page || 1,
    perPage: query.perPage || 10,
    goToPage,
    changePerPage,
    nextPage,
    prevPage,
    hasNextPage: pagination ? (query.page || 1) < pagination.totalPages : false,
    hasPrevPage: (query.page || 1) > 1,
  };
};