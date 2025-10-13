import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { categoriesService } from '@/services/categories.service';
import type { CategoriesState } from '@/types';

interface CategoriesStore extends CategoriesState {
  // Actions
  fetchCategories: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

const initialState: CategoriesState = {
  categories: [],
  isLoading: false,
  error: null,
};

export const useCategoriesStore = create<CategoriesStore>()(
  devtools(
    (set) => ({
      ...initialState,

      fetchCategories: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await categoriesService.getCategories();
          
          set({
            categories: response.data,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories';
          set({
            categories: [],
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'categories-store',
    }
  )
);