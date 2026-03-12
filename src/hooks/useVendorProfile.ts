import { useState, useCallback } from 'react';
import { dashboardService } from '@/services/dashboard.service';
import type { VendorProfile } from '@/types';

interface UseVendorProfileReturn {
  profile: VendorProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (profileData: Partial<VendorProfile>) => Promise<void>;
  updateAccountInfo: (accountInfo: {
    accountNumber: string;
    settlementBank: string;
    settlementBankName: string;
    securityPin: string;
  }) => Promise<void>;
  changePassword: (params: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<void>;
  setSecurityPin: (securityPin: string) => Promise<void>;
  enable2FA: (securityPin: string) => Promise<void>;
  disable2FA: (securityPin: string) => Promise<void>;
}

export const useVendorProfile = (): UseVendorProfileReturn => {
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await dashboardService.getVendorProfile();
      setProfile(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile data';
      setError(errorMessage);
      console.error('Profile fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(async (profileData: Partial<VendorProfile>) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedProfile = await dashboardService.updateVendorProfile(profileData);
      setProfile(updatedProfile);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      console.error('Profile update error:', err);
      throw err; // Re-throw so the component can handle it
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateAccountInfo = useCallback(async (accountInfo: {
    accountNumber: string;
    settlementBank: string;
    settlementBankName: string;
    securityPin: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedProfile = await dashboardService.updateAccountInfo(accountInfo);
      setProfile(updatedProfile);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update account information';
      setError(errorMessage);
      console.error('Account info update error:', err);
      throw err; // Re-throw so the component can handle it
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (params: {
    currentPassword: string;
    newPassword: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      await dashboardService.changePassword(params);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change password';
      setError(errorMessage);
      console.error('Change password error:', err);
      throw err; // Re-throw so the component can handle it
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setSecurityPin = useCallback(async (securityPin: string) => {
    setError(null);

    try {
      await dashboardService.setSecurityPin(securityPin);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set security PIN';
      setError(errorMessage);
      console.error('Set security PIN error:', err);
      throw err;
    }
  }, []);

  const enable2FA = useCallback(async (securityPin: string) => {
    setError(null);

    try {
      await dashboardService.enable2FA(securityPin);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to enable 2FA';
      setError(errorMessage);
      console.error('Enable 2FA error:', err);
      throw err;
    }
  }, []);

  const disable2FA = useCallback(async (securityPin: string) => {
    setError(null);

    try {
      await dashboardService.disable2FA(securityPin);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to disable 2FA';
      setError(errorMessage);
      console.error('Disable 2FA error:', err);
      throw err;
    }
  }, []);

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    refreshProfile,
    updateProfile,
    updateAccountInfo,
    changePassword,
    setSecurityPin,
    enable2FA,
    disable2FA,
  };
};