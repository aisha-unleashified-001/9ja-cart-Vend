/**
 * Create FormData for product image upload
 * Backend expects indexed field names: productImage[0], productImage[1], etc.
 */
export const createImageFormData = (images: File[]): FormData => {
  const formData = new FormData();

  // Use indexed field names like the working test
  images.forEach((image, index) => {
    formData.append(`productImage[${index}]`, image);
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