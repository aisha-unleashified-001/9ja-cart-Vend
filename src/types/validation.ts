// Form validation utilities

import type { FormErrors, VendorFormData } from ".";

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationRules {
  [fieldName: string]: ValidationRule;
}

// Email validation regex
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Nigerian phone number validation (supports both local and international formats)
export const PHONE_REGEX = /^(\+234|0)[789][01]\d{8}$/;

// Validation rules for each form field
export const validationRules: ValidationRules = {
  // Business Details
  businessName: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  businessType: {
    required: true,
  },
  countryState: {
    required: true,
  },
  
  // Contact Information
  fullName: {
    required: true,
    minLength: 2,
    maxLength: 100,
    custom: (value: string) => {
      if (value && !/^[a-zA-Z\s'-]+$/.test(value.trim())) {
        return 'Full name can only contain letters, spaces, hyphens, and apostrophes';
      }
      return null;
    }
  },
  phoneNumber: {
    required: true,
    pattern: PHONE_REGEX,
    custom: (value: string) => {
      if (!value) return null;
      const cleaned = value.replace(/\s/g, '');
      if (!PHONE_REGEX.test(cleaned)) {
        return 'Please enter a valid Nigerian phone number (e.g., 08012345678 or +2348012345678)';
      }
      return null;
    }
  },
  emailAddress: {
    required: true,
    pattern: EMAIL_REGEX,
    custom: (value: string) => {
      if (!value) return null;
      if (!EMAIL_REGEX.test(value)) {
        return 'Please enter a valid email address';
      }
      return null;
    }
  },
  
  // Product Details
  categories: {
    required: true,
    custom: (value: any[]) => {
      if (!value || value.length === 0) {
        return 'Please select at least one product category';
      }
      return null;
    }
  },
  productOrigin: {
    required: true,
  },

  // Notifications (optional in new form)
  wantsNotifications: {
    required: false,
    custom: (_value: boolean | null) => {
      // Allow null/undefined for optional notification preference
      return null;
    }
  }
};

// Validate a single field
export const validateField = (fieldName: string, value: any): string | null => {
  const rule = validationRules[fieldName];
  if (!rule) return null;

  // Required validation
  if (rule.required) {
    if (value === undefined || value === null || value === '' || 
        (Array.isArray(value) && value.length === 0)) {
      return `${getFieldDisplayName(fieldName)} is required`;
    }
  }

  // Skip other validations if field is empty and not required
  if (!rule.required && (!value || (Array.isArray(value) && value.length === 0))) {
    return null;
  }

  // String validations
  if (typeof value === 'string') {
    // Min length validation
    if (rule.minLength && value.trim().length < rule.minLength) {
      return `${getFieldDisplayName(fieldName)} must be at least ${rule.minLength} characters`;
    }

    // Max length validation
    if (rule.maxLength && value.trim().length > rule.maxLength) {
      return `${getFieldDisplayName(fieldName)} must not exceed ${rule.maxLength} characters`;
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      return `Please enter a valid ${getFieldDisplayName(fieldName).toLowerCase()}`;
    }
  }

  // Custom validation
  if (rule.custom) {
    const customError = rule.custom(value);
    if (customError) return customError;
  }

  return null;
};

// Validate multiple fields
export const validateFields = (data: Partial<VendorFormData>, fieldNames: string[]): FormErrors => {
  const errors: FormErrors = {};
  
  fieldNames.forEach(fieldName => {
    const value = getNestedValue(data, fieldName);
    const error = validateField(fieldName, value);
    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
};

// Validate entire form
export const validateForm = (data: VendorFormData): FormErrors => {
  const errors: FormErrors = {};

  // Business Details
  const businessErrors = validateFields(data, ['businessName', 'businessType', 'countryState']);
  Object.assign(errors, businessErrors);

  // Contact Information
  const contactErrors = validateFields(data, ['fullName', 'phoneNumber', 'emailAddress']);
  Object.assign(errors, contactErrors);

  // Product Details
  const productErrors = validateFields(data, ['categories', 'productOrigin']);
  Object.assign(errors, productErrors);

  // Notifications (optional in new form)
  // const notificationErrors = validateFields(data, ['wantsNotifications']);
  // Object.assign(errors, notificationErrors);

  return errors;
};

// Validate specific form step
export const validateStep = (data: VendorFormData, step: number): FormErrors => {
  switch (step) {
    case 0: // Business Details
      return validateFields(data, ['businessName', 'businessType', 'countryState']);
    case 1: // Contact Information
      return validateFields(data, ['fullName', 'phoneNumber', 'emailAddress']);
    case 2: // Product Details
      return validateFields(data, ['categories', 'productOrigin']);
    case 3: // Experience (optional)
      return {}; // No required fields in experience section
    case 4: // Final Review (no additional validation needed)
      return {};
    default:
      return {};
  }
};

// Helper function to get nested values from form data
const getNestedValue = (obj: any, path: string): any => {
  switch (path) {
    case 'businessType':
      return obj.businessDetails?.businessType;
    case 'countryState':
      return obj.businessDetails?.countryState;
    case 'businessName':
      return obj.businessDetails?.businessName;
    case 'fullName':
      return obj.contactPerson?.fullName;
    case 'phoneNumber':
      return obj.contactPerson?.phoneNumber;
    case 'emailAddress':
      return obj.contactPerson?.emailAddress;
    case 'categories':
      return obj.productDetails?.categories;
    case 'productOrigin':
      return obj.productDetails?.productOrigin;
    case 'specialHandling':
      return obj.productDetails?.specialHandling;
    case 'sellsOnline':
      return obj.experience?.sellsOnline;
    case 'platforms':
      return obj.experience?.platforms;
    case 'wantsNotifications':
      return obj.notifications?.wantsNotifications;
    default:
      return undefined;
  }
};

// Helper function to get user-friendly field names
const getFieldDisplayName = (fieldName: string): string => {
  const displayNames: { [key: string]: string } = {
    businessType: 'Business type',
    countryState: 'State of operation',
    businessName: 'Business name',
    fullName: 'Full name',
    phoneNumber: 'Phone number',
    emailAddress: 'Email address',
    categories: 'Product categories',
    productOrigin: 'Product origin',
    specialHandling: 'Special handling',
    sellsOnline: 'Online selling status',
    platforms: 'Platforms',
    wantsNotifications: 'Notification preference'
  };
  
  return displayNames[fieldName] || fieldName;
};

// Real-time validation hook
export const useRealTimeValidation = () => {
  const validateFieldRealTime = (fieldName: string, value: unknown) => {
    return validateField(fieldName, value);
  };

  return { validateFieldRealTime };
};

// Contact form validation
export const validateContactForm = (data: {
  fullName: string;
  emailAddress: string;
  subject: string;
  message: string;
}): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  // Full name validation
  if (!data.fullName?.trim()) {
    errors.fullName = 'Full name is required';
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters';
  } else if (data.fullName.trim().length > 100) {
    errors.fullName = 'Full name must not exceed 100 characters';
  } else if (!/^[a-zA-Z\s'-]+$/.test(data.fullName.trim())) {
    errors.fullName = 'Full name can only contain letters, spaces, hyphens, and apostrophes';
  }

  // Email validation
  if (!data.emailAddress?.trim()) {
    errors.emailAddress = 'Email address is required';
  } else if (!EMAIL_REGEX.test(data.emailAddress.trim())) {
    errors.emailAddress = 'Please enter a valid email address';
  }

  // Subject validation
  if (!data.subject?.trim()) {
    errors.subject = 'Subject is required';
  } else if (data.subject.trim().length < 3) {
    errors.subject = 'Subject must be at least 3 characters';
  } else if (data.subject.trim().length > 200) {
    errors.subject = 'Subject must not exceed 200 characters';
  }

  // Message validation
  if (!data.message?.trim()) {
    errors.message = 'Message is required';
  } else if (data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  } else if (data.message.trim().length > 2000) {
    errors.message = 'Message must not exceed 2000 characters';
  }

  return errors;
};

// Validate single contact form field
export const validateContactField = (fieldName: string, value: string): string | null => {
  const data = { fullName: '', emailAddress: '', subject: '', message: '', [fieldName]: value };
  const errors = validateContactForm(data);
  return errors[fieldName] || null;
};