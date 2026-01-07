import { environment } from '@/config/environment';

/**
 * Generates the full URL to a vendor's storefront page on the buyer app
 * @param vendorId - The vendor's unique identifier
 * @returns The full absolute URL to the vendor's storefront page
 * @example
 * getVendorStorefrontUrl('vendor-123')
 * // Returns: 'https://9ja-cartbuyer.vercel.app/vendor/vendor-123'
 */
export const getVendorStorefrontUrl = (vendorId: string): string => {
  if (!vendorId) {
    throw new Error('Vendor ID is required to generate storefront URL');
  }
  
  const buyerAppUrl = environment.buyerAppUrl.trim();
  // Remove trailing slash if present
  const baseUrl = buyerAppUrl.endsWith('/') ? buyerAppUrl.slice(0, -1) : buyerAppUrl;
  
  return `${baseUrl}/vendor/${vendorId}`;
};










