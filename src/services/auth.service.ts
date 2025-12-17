import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import { tokenStorage, userStorage } from '@/lib/auth.utils';
import type { LoginRequest, LoginResponse, RegisterRequest, User, VendorProfile } from '@/types';

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
      
      // Store auth data
      tokenStorage.set(token);
      userStorage.set(userData);

      return {
        user: userData,
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

      return response.data;
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
      
      // Store auth data
      tokenStorage.set(token);
      userStorage.set(user);

      return {
        user,
        token,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
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