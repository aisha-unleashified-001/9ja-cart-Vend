import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '@/services/dashboard.service';
import { formatImageUrl } from '@/lib/image.utils';

interface UseBusinessLogoReturn {
  logoUrl: string | null;
  isLoading: boolean;
  error: string | null;
  refreshLogo: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage business logo
 * Provides logo URL with fallback support for components
 */
export const useBusinessLogo = (): UseBusinessLogoReturn => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogo = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const logo = await dashboardService.getLogo();
      if (logo) {
        setLogoUrl(formatImageUrl(logo));
      } else {
        setLogoUrl(null);
      }
    } catch (err) {
      // Silently fail - logo might not exist yet
      setLogoUrl(null);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch logo';
      setError(errorMessage);
      console.error('Logo fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogo();
  }, [fetchLogo]);

  return {
    logoUrl,
    isLoading,
    error,
    refreshLogo: fetchLogo,
  };
};













