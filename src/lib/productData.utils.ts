import type { CreateProductRequest, CreateProductPayload, EditProductPayload } from '@/types';

/**
 * Convert CreateProductRequest to CreateProductPayload for JSON API
 */
export const createProductPayload = (request: CreateProductRequest): CreateProductPayload => {
  return {
    productName: request.productName,
    productCategory: request.categoryId, // Send UUID string directly
    unitPrice: parseFloat(request.unitPrice),
    discountType: request.discountType ? parseInt(request.discountType) : undefined,
    discountValue: request.discountValue ? parseFloat(request.discountValue) : undefined,
    productDescription: request.productDescription,
    stock: parseInt(request.stock),
    minStock: parseInt(request.minStock),
    tag: request.productTags,
  };
};

/**
 * Convert UpdateProductRequest to EditProductPayload for JSON API
 */
export const createEditProductPayload = (request: Partial<CreateProductRequest>): EditProductPayload => {
  const payload: EditProductPayload = {};

  if (request.productName) payload.productName = request.productName;
  if (request.categoryId) payload.productCategory = request.categoryId;
  if (request.unitPrice) payload.unitPrice = parseFloat(request.unitPrice);
  if (request.discountType) payload.discountType = parseInt(request.discountType);
  if (request.discountValue) payload.discountValue = parseFloat(request.discountValue);
  if (request.productDescription) payload.productDescription = request.productDescription;
  if (request.stock) payload.stock = parseInt(request.stock);
  if (request.minStock) payload.minStock = parseInt(request.minStock);
  if (request.productTags) payload.tag = request.productTags;

  return payload;
};

/**
 * Validate product data before API submission
 */
export const validateProductData = (request: CreateProductRequest): string[] => {
  const errors: string[] = [];

  if (!request.productName.trim()) {
    errors.push('Product name is required');
  }

  if (!request.categoryId) {
    errors.push('Category is required');
  }

  if (!request.productDescription.trim()) {
    errors.push('Product description is required');
  }

  if (!request.unitPrice || parseFloat(request.unitPrice) <= 0) {
    errors.push('Valid unit price is required');
  }

  if (!request.stock || parseInt(request.stock) < 0) {
    errors.push('Valid stock quantity is required');
  }

  if (!request.minStock || parseInt(request.minStock) < 0) {
    errors.push('Valid minimum stock is required');
  }

  if (request.productTags.length === 0) {
    errors.push('At least one tag is required');
  }

  // Validate discount only when discount type is not "No Discount"
  if (request.discountType && request.discountType !== '0') {
    if (!request.discountValue || parseFloat(request.discountValue) <= 0) {
      errors.push('Discount value is required when discount type is selected');
    } else {
      if (request.discountType === '1' && parseFloat(request.discountValue) > 100) {
        errors.push('Percentage discount cannot exceed 100%');
      }
      if (request.discountType === '2' && parseFloat(request.discountValue) >= parseFloat(request.unitPrice)) {
        errors.push('Fixed discount cannot be greater than or equal to the price');
      }
    }
  }

  return errors;
};