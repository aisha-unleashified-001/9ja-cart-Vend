import type { CreateProductFormData, CreateProductRequest } from '@/types';

/**
 * Convert CreateProductFormData to FormData for API submission
 */
export const createProductFormData = (data: CreateProductFormData): FormData => {
  const formData = new FormData();

  // Basic fields
  formData.append('productName', data.productName);
  formData.append('productCategory', data.productCategory);
  formData.append('productDescription', data.productDescription);
  formData.append('unitPrice', data.unitPrice);
  formData.append('discountType', data.discountType);
  formData.append('discountValue', data.discountValue);
  formData.append('stock', data.stock);
  formData.append('minStock', data.minStock);

  // Tags as indexed array
  data.tags.forEach((tag, index) => {
    formData.append(`tag[${index}]`, tag);
  });

  // Images as indexed array
  data.images.forEach((image, index) => {
    formData.append(`productImage[${index}]`, image, image.name);
  });

  return formData;
};

/**
 * Validate file for product image upload
 */
export const validateProductImage = (file: File): string | null => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return 'Please select a valid image file (JPEG, PNG, or WebP)';
  }

  if (file.size > maxSize) {
    return 'Image size must be less than 5MB';
  }

  return null;
};

/**
 * Validate multiple product images
 */
export const validateProductImages = (files: File[]): string[] => {
  const errors: string[] = [];
  const maxImages = 5;

  if (files.length === 0) {
    errors.push('At least one product image is required');
    return errors;
  }

  if (files.length > maxImages) {
    errors.push(`Maximum ${maxImages} images allowed`);
  }

  files.forEach((file, index) => {
    const error = validateProductImage(file);
    if (error) {
      errors.push(`Image ${index + 1}: ${error}`);
    }
  });

  return errors;
};

/**
 * Create preview URL for uploaded image
 */
export const createImagePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Clean up image preview URL
 */
export const revokeImagePreview = (url: string): void => {
  URL.revokeObjectURL(url);
};

/**
 * Convert CreateProductRequest to CreateProductFormData
 */
export const mapToFormData = (request: CreateProductRequest): CreateProductFormData => {
  return {
    productName: request.productName,
    productCategory: request.categoryId, // Map categoryId to productCategory
    productDescription: request.productDescription,
    unitPrice: request.unitPrice,
    discountType: request.discountType || '1',
    discountValue: request.discountValue || '0',
    stock: request.stock,
    minStock: request.minStock,
    tags: request.productTags,
    images: request.images,
  };
};