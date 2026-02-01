/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import { tokenStorage, userStorage } from '@/lib/auth.utils';
import { getVendorStorefrontUrl } from '@/lib/vendor.utils';
import type { LoginRequest, LoginResponse, RegisterRequest, User, VendorProfile } from '@/types';
import type { ResetPasswordRequest } from '@/stores/authStore';

export interface ForgotPasswordResponse {
  status: number;
  error: boolean;
  message: string;
  data?: {
    identifier: string;
    verificationId?: string;
    messageId?: string | null;
  };
}
// {
//     "status": 200,
//     "error": false,
//     "message": "Password reset OTP sent successfully. Please check your email.",
//     "data": {
//         "identifier": "jejraenterprises@gmail.com",
//         "messageId": null,
//         "verificationId": "1d14b016-f4ee-4c4a-b528-7bbdd586743b"
//     }
// }
export class AuthService {
  async login(credentials: LoginRequest): Promise<{ user: User; token: string }> {
    try {
      const response = await apiClient.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials,
        // Login uses Basic Auth (apiConfig). Do not attach Bearer token even if one exists in storage.
        { requiresAuth: false }
      );

      if (response.error || !response.data) {
        throw new Error(response.message || 'Login failed');
      }

      const { token, ...userData } = response.data;
      
      // Enrich user data with storefront URL if vendorId is available
      const enrichedUser = userData.vendorId || userData.userId
        ? {
            ...userData,
            storefrontUrl: getVendorStorefrontUrl(userData.vendorId || userData.userId || ''),
          }
        : userData;
      
      // Store auth data
      tokenStorage.set(token);
      userStorage.set(enrichedUser);

      return {
        user: enrichedUser,
        token,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      throw new Error(errorMessage);
    }
  }

  async getProfile(): Promise<VendorProfile> {
    try {
      const response = await apiClient.get<VendorProfile>(
        API_ENDPOINTS.VENDOR.PROFILE,
        { requiresAuth: true }
      );

      if (response.error || !response.data) {
        throw new Error(response.message || 'Failed to fetch profile');
      }

      // Enrich profile with storefront URL if vendorId is available
      const profile = response.data;
      const vendorId = profile.vendorId || (profile as any).account?.vendorId;
      const enrichedProfile = vendorId
        ? {
            ...profile,
            vendorId,
            storefrontUrl: getVendorStorefrontUrl(vendorId),
          }
        : profile;

      return enrichedProfile;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
      throw new Error(errorMessage);
    }
  }

  async register(userData: RegisterRequest): Promise<{ user: User; token: string }> {
    try {
      const response = await apiClient.post<LoginResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        userData,
        // Register uses Basic Auth (apiConfig). Do not attach Bearer token even if one exists in storage.
        { requiresAuth: false }
      );

      if (response.error || !response.data) {
        throw new Error(response.message || 'Registration failed');
      }

      const { token, ...user } = response.data;
      
      // Enrich user data with storefront URL if vendorId is available
      const enrichedUser = user.vendorId || user.userId
        ? {
            ...user,
            storefrontUrl: getVendorStorefrontUrl(user.vendorId || user.userId || ''),
          }
        : user;
      
      // Store auth data
      tokenStorage.set(token);
      userStorage.set(enrichedUser);

      return {
        user: enrichedUser,
        token,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      throw new Error(errorMessage);
    }
  }

  async forgotPassword(emailAddress: string): Promise<ForgotPasswordResponse> {
    try {
      const response = await apiClient.post<ForgotPasswordResponse>(
        API_ENDPOINTS.AUTH.FORGOT,
        { emailAddress },
        { requiresAuth: false }
      );

      // Even if data is empty, check for error flags from your apiClient wrapper
      if (response.error) {
        throw new Error(response.message || 'Failed to request password reset');
      }

      return response as ForgotPasswordResponse;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Forgot password request failed';
      throw new Error(errorMessage);
    }
  }

  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.AUTH.RESET,
        data,
        { requiresAuth: false }
      );

      if (response.error) {
        throw new Error(response.message || 'Failed to reset password');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Reset password failed';
      throw new Error(errorMessage);
    }
  }

  async logout(): Promise<void> {
    // Since there's no backend logout endpoint, just clear local storage
    tokenStorage.remove();
    userStorage.remove();
  }

  getCurrentUser(): User | null {
    return userStorage.get();
  }

  getCurrentToken(): string | null {
    return tokenStorage.get();
  }

  isAuthenticated(): boolean {
    const token = tokenStorage.get();
    const user = userStorage.get();
    return !!(token && user);
  }
}

// Export singleton instance
export const authService = new AuthService();