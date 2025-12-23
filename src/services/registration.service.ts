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
   * Send OTP to email address
   */
  async sendOTP(emailAddress: string): Promise<any> {
    try {
      const formData = new FormData();
      formData.append("emailAddress", emailAddress);
      // API docs use "identifier" for OTP flows; send both for compatibility.
      formData.append("identifier", emailAddress);

      const url = `${environment.apiBaseUrl}${API_ENDPOINTS.REGISTRATION.SEND_OTP}`;
      console.log('📤 Sending OTP request to:', url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Authorization': environment.basicAuthHeader,
        },
        body: formData,
      });

      console.log('📥 OTP response status:', response.status, response.statusText);

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        const errorMsg = result.message || result.error || `Server returned ${response.status}: ${response.statusText}`;
        throw new Error(errorMsg);
      }

      // Some environments return JSON containing verificationId; return it to caller.
      const result = await response.json().catch(() => ({}));
      return result;
    } catch (error) {
      console.error("Send OTP error:", error);
      
      // Provide more specific error messages for common issues
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error("Network error: Unable to connect to the server. Please check your internet connection or contact support if the problem persists.");
      }
      
      const errorMessage = error instanceof Error ? error.message : "Failed to send OTP";
      throw new Error(errorMessage);
    }
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(identifier: string, otp: string, verificationId: string): Promise<void> {
    try {
      const formData = new FormData();
      // API expects: otp, identifier, verificationId (multipart/form-data)
      formData.append("identifier", identifier);
      formData.append("otp", otp);
      formData.append("verificationId", verificationId);

      const response = await fetch(
        `${environment.apiBaseUrl}${API_ENDPOINTS.REGISTRATION.VERIFY_OTP}`,
        {
          method: "POST",
          headers: {
            'Authorization': environment.basicAuthHeader,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const result = await response.json().catch(() => ({} as any));
        const messagesObj = result?.messages && typeof result.messages === "object" ? result.messages : null;
        const messagesText = messagesObj
          ? Object.values(messagesObj).filter(Boolean).join(" ")
          : "";
        throw new Error(result?.message || messagesText || "Invalid OTP code. Please try again.");
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      const errorMessage = error instanceof Error ? error.message : "Invalid OTP code";
      throw new Error(errorMessage);
    }
  }

  /**
   * Check if email is already registered by making a lightweight call
   * to the signup endpoint with placeholder data. The API returns
   * validation messages for duplicate emails before other fields.
   */
  async checkEmailAvailability(email: string): Promise<{ available: boolean; message?: string }> {
    try {
      const formData = new FormData();
      formData.append("emailAddress", email);
      formData.append("password", "TempCheck123!");
      formData.append("fullName", "Email Check");
      formData.append("businessName", "Email Check");
      formData.append("businessCategory", "1");
      formData.append("phoneNumber", "08000000000");
      formData.append("businessRegNumber", "");
      formData.append("storeName", "Email Check");
      formData.append("businessAddress", "placeholder");
      formData.append("taxIdNumber", "");

      const response = await fetch(
        `${environment.apiBaseUrl}${API_ENDPOINTS.REGISTRATION.SIGNUP}`,
        {
          method: "POST",
          headers: {
            Authorization: environment.basicAuthHeader,
          },
          body: formData,
        }
      );

      let result: any = {};
      try {
        result = await response.json();
      } catch (error) {
        console.warn("Email check could not parse response:", error);
      }

      if (!response.ok) {
        const emailError =
          result?.messages?.emailAddress ||
          result?.message ||
          "";

        if (
          typeof emailError === "string" &&
          /unique|already|exist/i.test(emailError)
        ) {
          return {
            available: false,
            message: "Email already exists",
          };
        }

        // Any other validation error likely means email is available.
        return { available: true };
      }

      // If the API somehow accepts the placeholder data, treat as available
      return { available: true };
    } catch (error) {
      console.error("Email check error:", error);
      // On network issues, allow flow to continue; final submission will fail if needed.
      return { available: true };
    }
  }

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
      formData.append("accountNumber", data.accountNumber);
      formData.append("settlementBank", data.settlementBank);
      formData.append("settlementBankName", data.settlementBankName);
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
            let errorMessage = Array.isArray(message)
              ? message.join(" ")
              : String(message);
            
            // Transform generic unique value error to user-friendly message
            if (field === 'emailAddress' && errorMessage.toLowerCase().includes('unique')) {
              errorMessage = 'Email already exists';
            }

            if (field === 'phoneNumber' && (
              errorMessage.toLowerCase().includes('unique') ||
              errorMessage.toLowerCase().includes('already') ||
              errorMessage.toLowerCase().includes('exist')
            )) {
              errorMessage = "You can't use an already existing phone number.";
            }

            if (field === "password") {
              const normalized = errorMessage.toLowerCase();
              if (
                normalized.includes("not in the correct format") ||
                normalized.includes("format") ||
                normalized.includes("complexity")
              ) {
                errorMessage = this.buildPasswordRequirementMessage(data.password);
              }
            }
            
            fieldErrors[field as keyof RegistrationFieldErrors] = errorMessage;
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
   * Validate password strength and requirements
   * Returns error message if invalid, null if valid
   */
  validatePassword(password: string): string | null {
    if (!password?.trim()) {
      return "Password is required";
    }
    
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    
    const missingRequirements = this.getMissingPasswordRequirements(password);
    if (missingRequirements.length > 0) {
      return this.formatPasswordRequirementMessage(missingRequirements);
    }
    
    return null;
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
    const passwordError = this.validatePassword(data.password || '');
    if (passwordError) {
      errors.password = passwordError;
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
  getMissingPasswordRequirements(password: string): string[] {
    const requirements = [
      { regex: /[A-Z]/, label: "an uppercase letter" },
      { regex: /[a-z]/, label: "a lowercase letter" },
      { regex: /\d/, label: "a number" },
      { regex: /[^A-Za-z0-9]/, label: "a special character" },
    ];

    return requirements
      .filter((requirement) => !requirement.regex.test(password))
      .map((requirement) => requirement.label);
  }

  private buildPasswordRequirementMessage(password: string): string {
    const missingRequirements = this.getMissingPasswordRequirements(password);
    return this.formatPasswordRequirementMessage(missingRequirements);
  }

  formatPasswordRequirementMessage(missingRequirements: string[]): string {
    if (missingRequirements.length === 0) {
      return "Password must include upper & lowercase letters, a number, and a special character.";
    }

    if (missingRequirements.length === 1) {
      return `Password must include ${missingRequirements[0]}.`;
    }

    if (missingRequirements.length === 2) {
      return `Password must include ${missingRequirements[0]} and ${missingRequirements[1]}.`;
    }

    const lastRequirement = missingRequirements.pop()!;
    return `Password must include ${missingRequirements.join(
      ", "
    )}, and ${lastRequirement}.`;
  }
}

// Export singleton instance
export const registrationService = new RegistrationService();
