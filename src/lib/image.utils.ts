import { environment } from '@/config/environment';

/**
 * Format image URL to be absolute
 * Handles both relative and absolute URLs
 */
export const formatImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '';
  
  // If already absolute URL, return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If relative URL, prepend base URL
  if (imageUrl.startsWith('/')) {
    return `${environment.apiBaseUrl}${imageUrl}`;
  }
  
  // If no leading slash, add it
  return `${environment.apiBaseUrl}/${imageUrl}`;
};

/**
 * Format multiple image URLs
 */
export const formatImageUrls = (imageUrls: string[]): string[] => {
  return imageUrls.map(formatImageUrl).filter(Boolean);
};

/**
 * Get placeholder image URL
 */
export const getPlaceholderImage = (width = 300, height = 300): string => {
  return `https://via.placeholder.com/${width}x${height}/e5e7eb/9ca3af?text=No+Image`;
};

/**
 * Check if image URL is valid
 */
export const isValidImageUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};