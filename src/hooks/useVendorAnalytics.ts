import { useCallback, useState } from "react";
import { analyticsService } from "@/services/analytics.service";
import type { AnalyticsData } from "@/types";

interface UseVendorAnalyticsReturn {
  analyticsData: Partial<AnalyticsData> | null;
  isLoading: boolean;
  error: string | null;
  fetchVendorAnalytics: () => Promise<void>;
}

export const useVendorAnalytics = (): UseVendorAnalyticsReturn => {
  const [analyticsData, setAnalyticsData] = useState<Partial<AnalyticsData> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVendorAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await analyticsService.getVendorAnalytics();
      setAnalyticsData(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch vendor analytics";
      setError(errorMessage);
      console.error("Vendor analytics fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    analyticsData,
    isLoading,
    error,
    fetchVendorAnalytics,
  };
};
