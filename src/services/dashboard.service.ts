import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/constants";
import { parseBooleanish } from "@/lib/boolean.utils";
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
}

// Export singleton instance
export const dashboardService = new DashboardService();
