export interface Product {
  productId: string;
  productName: string;
  categoryId: string;
  categoryName: string | null;
  productDescription: string;
  productTags: string[];
  unitPrice: string;
  discountType: string;
  discountValue: string;
  discountPrice: string;
  stock: string;
  minStock: string;
  images: string[];
  isActive: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsApiResponse {
  data: Product[];
  pagination: {
    currentPage: number;
    perPage: number;
    totalPages: number;
    totalItems: number;
  };
}

// This is what we use internally in the store
export interface ProductsResponse {
  data: Product[];
  pagination: {
    currentPage: number;
    perPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface ProductsQuery {
  page?: number;
  perPage?: number;
  search?: string;
  categoryId?: string;
  isActive?: string;
  statusFilter?: 'all' | 'active' | 'deactivated' | 'out_of_stock' | 'archived';
}

export interface CreateProductRequest {
  productName: string;
  categoryId: string;
  productDescription: string;
  productTags: string[];
  unitPrice: string;
  discountType?: string;
  discountValue?: string;
  stock: string;
  minStock: string;
  images: File[];
  isActive?: string;
}

// New interface for JSON-only product creation (Step 1)
export interface CreateProductPayload {
  productName: string;
  productCategory: string; // UUID string, not number
  unitPrice: number;
  discountType?: number;
  discountValue?: number;
  productDescription: string;
  stock: number;
  minStock: number;
  tag: string[];
}

// Interface for image upload (Step 2)
export interface UploadProductImagesRequest {
  productId: string;
  // existingImages: string[];
  images: File[];
}

export interface CreateProductFormData {
  productName: string;
  productCategory: string; // API uses different field name
  productDescription: string;
  unitPrice: string;
  discountType: string;
  discountValue: string;
  stock: string;
  minStock: string;
  tags: string[]; // Will be converted to tag[0], tag[1], etc.
  images: File[]; // Will be converted to productImage[0], productImage[1], etc.
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  productId: string;
}

// New interface for product edit (Step 3)
export interface EditProductPayload {
  productName?: string;
  productCategory?: string; // UUID string, not number
  unitPrice?: number;
  discountType?: number;
  discountValue?: number;
  productDescription?: string;
  stock?: number;
  minStock?: number;
  tag?: string[];
}

export interface ProductsState {
  products: Product[];
  currentProduct: Product | null;
  pagination: {
    currentPage: number;
    perPage: number;
    totalPages: number;
    totalItems: number;
  } | null;
  isLoading: boolean;
  error: string | null;
  query: ProductsQuery;
}
