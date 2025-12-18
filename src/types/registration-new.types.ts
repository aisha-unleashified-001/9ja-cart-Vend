// New registration types - implement from scratch

export interface VendorFormData {
  businessDetails?: {
    businessName?: string;
    businessType?: string;
    countryState?: string;
  };
  contactPerson?: {
    fullName?: string;
    phoneNumber?: string;
    emailAddress?: string;
  };
  productDetails?: {
    categories?: any[];
    productOrigin?: string;
    specialHandling?: string;
  };
  experience?: {
    sellsOnline?: boolean;
    platforms?: string[];
  };
  notifications?: {
    wantsNotifications?: boolean;
  };
}

export interface FormErrors {
  [fieldName: string]: string;
}