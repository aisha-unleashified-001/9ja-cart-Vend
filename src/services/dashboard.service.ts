import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/constants";
import { parseBooleanish } from "@/lib/boolean.utils";
import { validateProductImage } from "@/lib/imageUpload.utils";
import { tokenStorage } from "@/lib/auth.utils";
import { environment } from "@/config/environment";
import type {
  DashboardSummary,
  DashboardSummaryResponse,
  VendorProfile,
} from "@/types";

const normalizeDashboardSummary = (
  data: DashboardSummaryResponse
): DashboardSummary => ({
  ...data,
  isActive: parseBooleanish(data.isActive),
  isSuspended: parseBooleanish(data.isSuspended),
});

// Normalize vendor profile response to handle different API field names
const normalizeVendorProfile = (data: any): VendorProfile => {
  // Helper to check if a value is meaningful (not null, undefined, or empty string)
  const hasValue = (val: any): boolean => {
    return val !== null && val !== undefined && val !== '';
  };

  // API returns accountNumber, accountName (or acccountName with typo), and settlementBank inside data.account
  // Priority: data.account fields > root-level fields > accountInfo object fields
  let accountInfo: { accountName?: string; accountNumber?: string; bank?: string } | undefined;
  
  // First, check if account fields exist inside data.account (this is where the API actually returns them)
  const account = data.account || {};
  const hasAccountFields = hasValue(account.accountNumber) || hasValue(account.accountName) || hasValue(account.acccountName) || hasValue(account.settlementBank);
  
  if (hasAccountFields) {
    // Extract from data.account object
    // Note: API has a typo "acccountName" (three c's), handle both spellings
    accountInfo = {
      accountName: hasValue(account.accountName) ? account.accountName : 
                   (hasValue(account.acccountName) ? account.acccountName : undefined),
      accountNumber: hasValue(account.accountNumber) ? account.accountNumber : undefined,
      bank: hasValue(account.settlementBank) ? account.settlementBank : 
            (hasValue(account.bank) ? account.bank : undefined),
    };
  } else if (hasValue(data.accountNumber) || hasValue(data.accountName) || hasValue(data.settlementBank)) {
    // Fallback to root-level fields if they exist
    accountInfo = {
      accountName: hasValue(data.accountName) ? data.accountName : undefined,
      accountNumber: hasValue(data.accountNumber) ? data.accountNumber : undefined,
      bank: hasValue(data.settlementBank) ? data.settlementBank : (hasValue(data.bank) ? data.bank : undefined),
    };
  } else if (data.accountInfo && typeof data.accountInfo === 'object') {
    // Fallback to accountInfo object if neither account nor root-level fields exist
    accountInfo = {
      accountName: hasValue(data.accountInfo.accountName) ? data.accountInfo.accountName : 
                   (hasValue(data.accountInfo.settlementAccountName) ? data.accountInfo.settlementAccountName : undefined),
      accountNumber: hasValue(data.accountInfo.accountNumber) ? data.accountInfo.accountNumber : undefined,
      bank: hasValue(data.accountInfo.bank) ? data.accountInfo.bank : 
            (hasValue(data.accountInfo.settlementBank) ? data.accountInfo.settlementBank : 
             (hasValue(data.accountInfo.settlementBankName) ? data.accountInfo.settlementBankName : undefined)),
    };
  }

  // Only include accountInfo if it has at least one field
  if (accountInfo && !hasValue(accountInfo.accountName) && !hasValue(accountInfo.accountNumber) && !hasValue(accountInfo.bank)) {
    accountInfo = undefined;
  }

  // Create account object, excluding account-related fields (they go in accountInfo)
  const accountData = data.account || {};
  const normalizedAccount = {
    emailAddress: accountData.emailAddress || data.emailAddress || '',
    fullName: accountData.fullName || data.fullName || '',
    phoneNumber: accountData.phoneNumber || data.phoneNumber || '',
    profileImage: accountData.profileImage || data.profileImage,
  };

  const normalized: VendorProfile = {
    account: normalizedAccount,
    accountInfo,
    business: data.business || {
      businessName: data.businessName || '',
      businessCategory: data.businessCategory || '',
      businessRegNumber: data.businessRegNumber || '',
      storeName: data.storeName || '',
      businessAddress: data.businessAddress || '',
      taxIdNumber: data.taxIdNumber || '',
      idDocument: data.idDocument || '',
      businessRegCertificate: data.businessRegCertificate || '',
    },
    createdAt: data.createdAt || '',
    updatedAt: data.updatedAt || '',
  };

  return normalized;
};

export class DashboardService {
  async getDashboardSummary(): Promise<DashboardSummary> {
    try {
      const response = await apiClient.get<DashboardSummaryResponse>(
        API_ENDPOINTS.VENDOR.DASHBOARD_SUMMARY,
        { requiresAuth: true }
      );

      if (response.error || !response.data) {
        throw new Error(
          response.message || "Failed to fetch dashboard summary"
        );
      }

      return normalizeDashboardSummary(response.data);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch dashboard summary";
      throw new Error(errorMessage);
    }
  }

  async getVendorProfile(): Promise<VendorProfile> {
    try {
      const response = await apiClient.get<VendorProfile>(
        API_ENDPOINTS.VENDOR.PROFILE,
        { requiresAuth: true }
      );

      if (response.error || !response.data) {
        throw new Error(response.message || "Failed to fetch vendor profile");
      }

      // Normalize the response to handle different API field names
      return normalizeVendorProfile(response.data);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch vendor profile";
      throw new Error(errorMessage);
    }
  }

  async updateVendorProfile(
    profileData: Partial<VendorProfile>
  ): Promise<VendorProfile> {
    try {
      // API requires POST with FormData format
      const formData = new FormData();

      // Map profile data to FormData fields expected by the API
      if (profileData.account?.fullName) {
        formData.append("fullName", profileData.account.fullName);
      }
      if (profileData.account?.phoneNumber) {
        formData.append("phoneNumber", profileData.account.phoneNumber);
      }
      if (profileData.business?.businessName) {
        formData.append("businessName", profileData.business.businessName);
      }
      if (profileData.business?.businessCategory) {
        formData.append("businessCategory", profileData.business.businessCategory);
      }
      if (profileData.business?.businessRegNumber) {
        formData.append("businessRegNumber", profileData.business.businessRegNumber);
      }
      if (profileData.business?.storeName) {
        formData.append("storeName", profileData.business.storeName);
      }
      if (profileData.business?.businessAddress) {
        formData.append("businessAddress", profileData.business.businessAddress);
      }
      if (profileData.business?.taxIdNumber) {
        formData.append("taxIdNumber", profileData.business.taxIdNumber);
      }

      // Note: File uploads (idDocument, businessRegCertificate) are handled separately
      // If files need to be updated, they should be provided in the profileData
      // For now, we only send text fields

      // Use fetch directly for FormData upload (similar to logo upload)
      const token = tokenStorage.get();
      if (!token) {
        throw new Error("Authentication required for profile update");
      }

      const response = await fetch(
        `${environment.apiBaseUrl}${API_ENDPOINTS.VENDOR.UPDATE_PROFILE}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        // Try to parse error message if response has content
        let errorMessage = "Failed to update vendor profile";
        try {
          const text = await response.text();
          if (text) {
            const result = JSON.parse(text);
            errorMessage = result.message || result.messages?.error || errorMessage;
          }
        } catch {
          // If parsing fails or response is empty, use default error message
        }
        throw new Error(errorMessage);
      }

      // The API returns no response body according to documentation
      // So we fetch the updated profile after successful update (which will be normalized)
      return await this.getVendorProfile();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update vendor profile";
      throw new Error(errorMessage);
    }
  }

  /**
   * Update account information (account name, account number, bank)
   * TODO: Backend endpoint to be implemented - endpoint: /vendor/account-info
   * Expected request body: { accountName?: string; accountNumber?: string; bank?: string; }
   * Expected response: Updated VendorProfile or accountInfo object
   */
  async updateAccountInfo(
    accountInfo: {
      accountName?: string;
      accountNumber?: string;
      bank?: string;
    }
  ): Promise<VendorProfile> {
    try {
      // TODO: Replace with actual endpoint once backend is ready
      // For now, this will use the general profile update endpoint as a fallback
      // Use PATCH instead of PUT for partial updates
      const response = await apiClient.patch<VendorProfile>(
        API_ENDPOINTS.VENDOR.UPDATE_ACCOUNT_INFO,
        { accountInfo },
        { requiresAuth: true }
      );

      if (response.error || !response.data) {
        throw new Error(
          response.message || "Failed to update account information"
        );
      }

      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update account information";
      throw new Error(errorMessage);
    }
  }

  /**
   * Upload vendor profile image
   * TODO: Backend endpoint to be implemented - endpoint: /vendor/profile-image
   * Expected request: POST with FormData containing the image file
   * Expected field name: "profileImage" (single file)
   * Expected response: Updated VendorProfile with profileImage URL
   */
  async uploadProfileImage(imageFile: File): Promise<VendorProfile> {
    try {
      // Validate image
      const validationError = validateProductImage(imageFile);
      if (validationError) {
        throw new Error(validationError);
      }

      // Create FormData
      const formData = new FormData();
      formData.append("profileImage", imageFile);

      // Get current user token
      const token = tokenStorage.get();
      if (!token) {
        throw new Error("Authentication required for image upload");
      }

      // Use fetch directly for FormData upload (similar to product images)
      const response = await fetch(
        `${environment.apiBaseUrl}${API_ENDPOINTS.VENDOR.UPLOAD_PROFILE_IMAGE}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to upload profile image");
      }

      // Return updated profile (assuming backend returns VendorProfile)
      if (result.data) {
        return result.data;
      } else if (result.profileImage) {
        // If backend returns just the image URL, we'd need to update the profile
        // For now, throw an error to indicate the response format is unexpected
        throw new Error("Unexpected response format from server");
      } else {
        throw new Error("Failed to upload profile image");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to upload profile image";
      throw new Error(errorMessage);
    }
  }

  /**
   * Get business logo
   * GET /vendor/get-logo
   * Expected response: { logo: string } or { data: { logo: string } }
   */
  async getLogo(): Promise<string | null> {
    try {
      // Get current user token
      const token = tokenStorage.get();
      if (!token) {
        throw new Error("Authentication required to fetch logo");
      }

      const response = await fetch(
        `${environment.apiBaseUrl}${API_ENDPOINTS.VENDOR.GET_LOGO}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        // If 404, return null (no logo uploaded yet)
        if (response.status === 404) {
          return null;
        }
        // Try to parse error message
        try {
          const text = await response.text();
          if (text) {
            const result = JSON.parse(text);
            throw new Error(result.message || "Failed to fetch logo");
          }
        } catch {
          // If parsing fails, use default error
        }
        throw new Error("Failed to fetch logo");
      }

      // Parse response
      try {
        const text = await response.text();
        if (!text) {
          return null;
        }
        const result = JSON.parse(text);

        // Handle the actual API response structure:
        // { status: 200, error: false, message: "...", data: { hasLogo: true, logoUrls: { large, medium, original, thumbnail }, storeName: "..." } }
        if (result.data?.logoUrls) {
          // Prefer medium size for display, fallback to large, then original, then thumbnail
          return result.data.logoUrls.medium || 
                 result.data.logoUrls.large || 
                 result.data.logoUrls.original || 
                 result.data.logoUrls.thumbnail || 
                 null;
        }
        
        // Handle legacy/alternative response formats
        if (result.data?.logo) {
          return result.data.logo;
        } else if (result.logo) {
          return result.logo;
        } else {
          return null;
        }
      } catch (parseError) {
        // If response is not valid JSON, return null
        console.warn("Failed to parse logo response:", parseError);
        return null;
      }
    } catch (error) {
      // If error is 404 or similar, return null (no logo exists)
      if (error instanceof Error) {
        if (error.message.includes("404") || error.message.includes("Not Found")) {
          return null;
        }
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch logo";
      throw new Error(errorMessage);
    }
  }

  /**
   * Upload business logo
   * POST /vendor/upload-logo
   * Expected request: POST with FormData containing the image file
   * Expected field name: "logo" (single file)
   * Expected response: 200 OK with no response body (empty response)
   */
  async uploadLogo(logoFile: File): Promise<void> {
    try {
      // Validate image
      const validationError = validateProductImage(logoFile);
      if (validationError) {
        throw new Error(validationError);
      }

      // Create FormData
      const formData = new FormData();
      formData.append("logo", logoFile);

      // Get current user token
      const token = tokenStorage.get();
      if (!token) {
        throw new Error("Authentication required for logo upload");
      }

      // Use fetch directly for FormData upload
      const response = await fetch(
        `${environment.apiBaseUrl}${API_ENDPOINTS.VENDOR.UPLOAD_LOGO}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        // Try to parse error message if response has content
        let errorMessage = "Failed to upload logo";
        try {
          const text = await response.text();
          if (text) {
            const result = JSON.parse(text);
            errorMessage = result.message || errorMessage;
          }
        } catch {
          // If parsing fails, use default error message
        }
        throw new Error(errorMessage);
      }

      // API returns 200 OK with no response body - this is success
      // The logo has been uploaded successfully
      return;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload logo";
      throw new Error(errorMessage);
    }
  }
}

// Export singleton instance
export const dashboardService = new DashboardService();
