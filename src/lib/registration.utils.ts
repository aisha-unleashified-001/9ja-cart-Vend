import type { RegistrationStep3Data } from '@/types';

/**
 * Convert registration step 3 data to FormData for API submission
 */
export const createRegistrationFormData = (data: RegistrationStep3Data): FormData => {
  const formData = new FormData();

  // Basic fields
  formData.append('emailAddress', data.emailAddress);
  formData.append('businessRegNumber', data.businessRegNumber);
  formData.append('storeName', data.storeName);
  formData.append('businessAddress', data.businessAddress);
  formData.append('taxIdNumber', data.taxIdNumber);

  // File uploads
  formData.append('idDocument', data.idDocument, data.idDocument.name);
  formData.append('businessRegCertificate', data.businessRegCertificate, data.businessRegCertificate.name);

  return formData;
};

/**
 * Validate document file for registration
 */
export const validateRegistrationDocument = (file: File): string | null => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'image/jpeg', 
    'image/jpg', 
    'image/png', 
    'image/webp',
    'application/pdf'
  ];

  if (!allowedTypes.includes(file.type)) {
    return 'Please select a valid document file (JPEG, PNG, WebP, or PDF)';
  }

  if (file.size > maxSize) {
    return 'Document size must be less than 10MB';
  }

  return null;
};

/**
 * Validate both required documents
 */
export const validateRegistrationDocuments = (
  idDocument: File | null, 
  businessRegCertificate: File | null
): string[] => {
  const errors: string[] = [];

  if (!idDocument) {
    errors.push('ID document is required');
  } else {
    const idError = validateRegistrationDocument(idDocument);
    if (idError) {
      errors.push(`ID Document: ${idError}`);
    }
  }

  if (!businessRegCertificate) {
    errors.push('Business registration certificate is required');
  } else {
    const certError = validateRegistrationDocument(businessRegCertificate);
    if (certError) {
      errors.push(`Business Certificate: ${certError}`);
    }
  }

  return errors;
};

/**
 * Get category ID from category name
 */
export const getCategoryIdByName = (categoryName: string, categories: any[]): number | null => {
  const category = categories.find(cat => cat.categoryName === categoryName);
  return category ? parseInt(category.categoryId) : null;
};

/**
 * Validate phone number format
 */
export const validatePhoneNumber = (phone: string): boolean => {
  // Nigerian phone number validation
  const phoneRegex = /^(\+234|234|0)?[789][01]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Format phone number for API
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove spaces and format for Nigerian numbers
  const cleaned = phone.replace(/\s/g, '');
  
  // If starts with 0, replace with +234
  if (cleaned.startsWith('0')) {
    return '+234' + cleaned.substring(1);
  }
  
  // If starts with 234, add +
  if (cleaned.startsWith('234')) {
    return '+' + cleaned;
  }
  
  // If already starts with +234, return as is
  if (cleaned.startsWith('+234')) {
    return cleaned;
  }
  
  // Otherwise, assume it's a local number and add +234
  return '+234' + cleaned;
};