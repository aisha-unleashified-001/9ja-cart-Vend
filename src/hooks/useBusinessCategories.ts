import { useState, useCallback } from "react";
import { businessCategoriesService } from "@/services/business-categories.service";
import type { BusinessCategory } from "@/types/business-category.types";

export const useBusinessCategories = () => {
  const [categories, setCategories] = useState<BusinessCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    if (categories.length > 0) {
      // Categories already loaded
      console.log("🏷️ Categories already loaded:", categories);
      return;
    }

    console.log("🏷️ Fetching business categories...");
    setIsLoading(true);
    setError(null);

    try {
      const fetchedCategories =
        await businessCategoriesService.getBusinessCategories();
      console.log("🏷️ Fetched categories:", fetchedCategories);
      setCategories(fetchedCategories);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to load business categories";
      console.error("🏷️ Error fetching categories:", err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [categories]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setCategories([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
    clearError,
    reset,
  };
};
