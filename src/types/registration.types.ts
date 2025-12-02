export interface RegistrationStep1Data {
  emailAddress: string;
  password: string;
  confirmPassword: string;
}

export interface RegistrationStep2Data {
  emailAddress: string;
  fullName: string;
  businessName: string;
  businessCategory: number; // API expects number, not string
  phoneNumber: string;
}

export interface RegistrationStep3Data {
  emailAddress: string;
  businessRegNumber: string;
  storeName: string;
  businessAddress: string;
  taxIdNumber: string;
  idDocument: File;
  businessRegCertificate: File;
}

export interface RegistrationFormData {
  // Step 1
  emailAddress: string;
  password: string;
  confirmPassword: string;

  // Step 2
  fullName: string;
  businessName: string;
  businessCategory: string; // UI uses string, converted to number for API
  businessCategoryId: number; // Actual category ID for API
  phoneNumber: string;

  // Step 3
  businessRegNumber: string;
  storeName: string;
  businessAddress: string;
  taxIdNumber: string;
  idDocument: File | null;
  businessRegCertificate: File | null;
}

export interface RegistrationState {
  currentStep: number;
  formData: Partial<RegistrationFormData>;
  isLoading: boolean;
  error: string | null;
  completedSteps: number[];
}

export interface CompleteRegistrationData {
  // Basic account info
  emailAddress: string;
  password: string;
  fullName: string;
  businessName: string;
  businessCategory: number;
  phoneNumber: string;

  // Business details
  businessRegNumber: string;
  storeName: string;
  businessAddress: string;
  taxIdNumber: string;

  // Documents
  idDocument: File;
  businessRegCertificate: File;
}

export interface RegistrationApiResponse {
  status: number;
  error: boolean;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

export interface RegistrationApiError {
  status: number;
  error: number;
  messages: Record<string, string>;
}

export interface RegistrationFieldErrors {
  emailAddress?: string;
  password?: string;
  confirmPassword?: string;
  fullName?: string;
  businessName?: string;
  businessCategory?: string;
  phoneNumber?: string;
  storeName?: string;
  businessAddress?: string;
  businessRegNumber?: string;
  taxIdNumber?: string;
  idDocument?: string;
  businessRegCertificate?: string;
}
