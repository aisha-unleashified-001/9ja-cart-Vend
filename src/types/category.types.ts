export interface Category {
  categoryId: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesApiResponse {
  data: Category[];
  pagination: {
    currentPage: number;
    perPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}