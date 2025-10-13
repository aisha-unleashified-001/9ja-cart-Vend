import { useCategoriesStore } from '@/stores/categoriesStore';

// Main categories hook with full interface
export const useCategories = () => {
  const store = useCategoriesStore();
  
  return {
    // State
    categories: store.categories || [],
    isLoading: store.isLoading,
    error: store.error,
    
    // Actions
    fetchCategories: store.fetchCategories,
    clearError: store.clearError,
    reset: store.reset,
  };
};

// Hook for components that only need categories state
export const useCategoriesState = () => {
  const categories = useCategoriesStore((state) => state.categories || []);
  const isLoading = useCategoriesStore((state) => state.isLoading);
  const error = useCategoriesStore((state) => state.error);

  return {
    categories,
    isLoading,
    error,
  };
};

// Hook for components that only need categories actions
export const useCategoriesActions = () => {
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);
  const clearError = useCategoriesStore((state) => state.clearError);
  const reset = useCategoriesStore((state) => state.reset);

  return {
    fetchCategories,
    clearError,
    reset,
  };
};