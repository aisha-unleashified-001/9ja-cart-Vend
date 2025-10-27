import { environment } from "@/config/environment";
import { API_ENDPOINTS } from "@/lib/constants";
import type {
  CompleteRegistrationData,
  RegistrationApiResponse,
  RegistrationFieldErrors,
} from "@/types";

export class RegistrationError extends Error {
  public fieldErrors: RegistrationFieldErrors;
  public status: number;

  constructor(message: string, fieldErrors: RegistrationFieldErrors = {}, status: number = 400) {
    super(message);
    this.name = 'RegistrationError';
    this.fieldErrors = fieldErrors;
    this.status = status;
  }
}

export class RegistrationService {
  /**
   * Complete registration with all data in single request
   * Simplified implementation based on working SignupTest.tsx
   */
  async submitCompleteRegistration(
    data: CompleteRegistrationData
  ): Promise<RegistrationApiResponse> {
    try {
      // Create FormData - simple approach like SignupTest.tsx
      const formData = new FormData();

      // Append all text fields directly (no complex formatting)
      formData.append("emailAddress", data.emailAddress);
      formData.append("password", data.password);
      formData.append("fullName", data.fullName);
      formData.append("businessName", data.businessName);
      formData.append("businessCategory", data.businessCategory.toString());
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("businessRegNumber", data.businessRegNumber || "");
      formData.append("storeName", data.storeName);
      formData.append("businessAddress", data.businessAddress);
      formData.append("taxIdNumber", data.taxIdNumber || "");

      // Append files
      if (data.idDocument) {
        formData.append("idDocument", data.idDocument);
      }
      if (data.businessRegCertificate) {
        formData.append("businessRegCertificate", data.businessRegCertificate);
      }

      // Log what we're sending (simplified)
      console.log("📤 Registration FormData:");
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: [FILE] ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`  ${key}: "${value}"`);
        }
      }

      // Use fetch directly like SignupTest.tsx for reliability
      const response = await fetch(`${environment.apiBaseUrl}${API_ENDPOINTS.REGISTRATION.SIGNUP}`, {
        method: 'POST',
        headers: {
          'Authorization': environment.basicAuthHeader
        },
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle API errors
        if (result.messages && typeof result.messages === 'object') {
          const fieldErrors: RegistrationFieldErrors = {};
          
          Object.entries(result.messages).forEach(([field, message]) => {
            fieldErrors[field as keyof RegistrationFieldErrors] = message as string;
          });

          throw new RegistrationError(
            result.message || "Please fix the following errors:",
            fieldErrors,
            response.status
          );
        }
        
        throw new RegistrationError(
          result.message || "Registration failed. Please try again.",
          {},
          response.status
        );
      }

      return result;
    } catch (error) {
      console.error('Registration error:', error);
      
      // Re-throw RegistrationError as-is
      if (error instanceof RegistrationError) {
        throw error;
      }

      // Handle network/other errors
      const errorMessage = error instanceof Error ? error.message : "Registration failed";
      throw new RegistrationError(errorMessage);
    }
  }

  /**
   * Validate complete registration data
   */
  validateCompleteRegistration(
    data: Partial<CompleteRegistrationData>
  ): Record<string, string> {
    const errors: Record<string, string> = {};

    // Email validation
    if (!data.emailAddress?.trim()) {
      errors.emailAddress = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.emailAddress)) {
      errors.emailAddress = "Please enter a valid email address";
    }

    // Password validation
    if (!data.password?.trim()) {
      errors.password = "Password is required";
    } else if (data.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    // Personal info validation
    if (!data.fullName?.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!data.businessName?.trim()) {
      errors.businessName = "Business name is required";
    }

    if (!data.businessCategory) {
      errors.businessCategory = "Please select a business category";
    }

    // Phone validation
    if (!data.phoneNumber?.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else {
      const phoneRegex = /^(\+234|234|0)?[789][01]\d{8}$/;
      if (!phoneRegex.test(data.phoneNumber.replace(/\s/g, ""))) {
        errors.phoneNumber = "Please enter a valid Nigerian phone number";
      }
    }

    // Business details validation
    if (!data.storeName?.trim()) {
      errors.storeName = "Store name is required";
    }

    if (!data.businessAddress?.trim()) {
      errors.businessAddress = "Business address is required";
    }

    // Document validation
    if (!data.idDocument) {
      errors.idDocument = "ID document is required";
    }

    if (!data.businessRegCertificate) {
      errors.businessRegCertificate =
        "Business registration certificate is required";
    }

    return errors;
  }
}

// Export singleton instance
export const registrationService = new RegistrationService();
