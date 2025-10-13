import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import { createRegistrationFormData, formatPhoneNumber } from '@/lib/registration.utils';
import type { 
  RegistrationStep1Data, 
  RegistrationStep2Data, 
  RegistrationStep3Data,
  RegistrationApiResponse 
} from '@/types';

export class RegistrationService {
  /**
   * Step 1: Create initial account with email and password
   */
  async signup(data: RegistrationStep1Data): Promise<RegistrationApiResponse> {
    try {
      const response = await apiClient.post<RegistrationApiResponse>(
        API_ENDPOINTS.REGISTRATION.SIGNUP,
        {
          emailAddress: data.emailAddress,
          password: data.password,
        },
        { requiresAuth: false } // Uses Basic Auth only
      );

      if (response.error) {
        throw new Error(response.message || 'Signup failed');
      }

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      throw new Error(errorMessage);
    }
  }

  /**
   * Step 2: Add business basic information
   */
  async submitBasicInfo(data: RegistrationStep2Data): Promise<RegistrationApiResponse> {
    try {
      const response = await apiClient.post<RegistrationApiResponse>(
        API_ENDPOINTS.REGISTRATION.BASIC_INFO,
        {
          emailAddress: data.emailAddress,
          fullName: data.fullName,
          businessName: data.businessName,
          businessCategory: data.businessCategory, // Should be number
          phoneNumber: formatPhoneNumber(data.phoneNumber),
        },
        { requiresAuth: false } // Uses Basic Auth only
      );

      if (response.error) {
        throw new Error(response.message || 'Failed to submit basic information');
      }

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit basic information';
      throw new Error(errorMessage);
    }
  }

  /**
   * Step 3: Submit business verification with documents
   */
  async submitVerification(data: RegistrationStep3Data): Promise<RegistrationApiResponse> {
    try {
      const formData = createRegistrationFormData(data);

      const response = await apiClient.post<RegistrationApiResponse>(
        API_ENDPOINTS.REGISTRATION.VERIFICATION,
        formData,
        { 
          requiresAuth: false, // Uses Basic Auth only
          isFormData: true 
        }
      );

      if (response.error) {
        throw new Error(response.message || 'Failed to submit verification');
      }

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit verification';
      throw new Error(errorMessage);
    }
  }

  /**
   * Validate step 1 data
   */
  validateStep1(data: Partial<RegistrationStep1Data>): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!data.emailAddress?.trim()) {
      errors.emailAddress = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.emailAddress)) {
      errors.emailAddress = 'Please enter a valid email address';
    }

    if (!data.password?.trim()) {
      errors.password = 'Password is required';
    } else if (data.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (!data.confirmPassword?.trim()) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  }

  /**
   * Validate step 2 data
   */
  validateStep2(data: Partial<RegistrationStep2Data>): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!data.fullName?.trim()) {
      errors.fullName = 'Full name is required';
    }

    if (!data.businessName?.trim()) {
      errors.businessName = 'Business name is required';
    }

    if (!data.businessCategory) {
      errors.businessCategory = 'Please select a business category';
    }

    if (!data.phoneNumber?.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else {
      const phoneRegex = /^(\+234|234|0)?[789][01]\d{8}$/;
      if (!phoneRegex.test(data.phoneNumber.replace(/\s/g, ''))) {
        errors.phoneNumber = 'Please enter a valid Nigerian phone number';
      }
    }

    return errors;
  }

  /**
   * Validate step 3 data
   */
  validateStep3(data: Partial<RegistrationStep3Data>): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!data.storeName?.trim()) {
      errors.storeName = 'Store name is required';
    }

    if (!data.businessAddress?.trim()) {
      errors.businessAddress = 'Business address is required';
    }

    if (!data.idDocument) {
      errors.idDocument = 'ID document is required';
    }

    if (!data.businessRegCertificate) {
      errors.businessRegCertificate = 'Business registration certificate is required';
    }

    return errors;
  }
}

// Export singleton instance
export const registrationService = new RegistrationService();