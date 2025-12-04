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

      return response.data;
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
      const response = await apiClient.put<VendorProfile>(
        API_ENDPOINTS.VENDOR.UPDATE_PROFILE,
        profileData,
        { requiresAuth: true }
      );

      if (response.error || !response.data) {
        throw new Error(response.message || "Failed to update vendor profile");
      }

      return response.data;
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
      const response = await apiClient.put<VendorProfile>(
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
}

// Export singleton instance
export const dashboardService = new DashboardService();
