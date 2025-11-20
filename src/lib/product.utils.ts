import type { Product } from '@/types';

// Format price from string to number
export const formatPrice = (price: string): number => {
  return parseFloat(price) || 0;
};

// Format price for display
export const formatPriceDisplay = (price: string): string => {
  const numPrice = formatPrice(price);
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(numPrice);
};

// Calculate discount percentage
export const calculateDiscountPercentage = (unitPrice: string, discountPrice: string): number => {
  const original = formatPrice(unitPrice);
  const discounted = formatPrice(discountPrice);
  
  if (original === 0) return 0;
  
  return Math.round(((original - discounted) / original) * 100);
};

// Check if product has discount
export const hasDiscount = (product: Product): boolean => {
  const unitPrice = formatPrice(product.unitPrice);
  const discountPrice = formatPrice(product.discountPrice);
  return discountPrice < unitPrice && discountPrice > 0;
};

// Get product status
export const getProductStatus = (product: Product): 'active' | 'deactivated' | 'out_of_stock' => {
  // Check isActive first to ensure active products show correct status
  if (product.isActive === '0' || product.isActive === 0) {
    return 'deactivated';
  }

  const stockCount = Number.parseInt(product.stock, 10);

  if (!Number.isNaN(stockCount) && stockCount <= 0) {
    return 'out_of_stock';
  }

  // If isActive is '1' or 1 and stock > 0, it's active
  if (product.isActive === '1' || product.isActive === 1) {
    return 'active';
  }

  // Default to active if isActive is not explicitly '0'
  return 'active';
};

// Get status color class
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'deactivated':
      return 'bg-gray-100 text-gray-800';
    case 'out_of_stock':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Get stock status
export const getStockStatus = (product: Product): 'in_stock' | 'low_stock' | 'out_of_stock' => {
  const stock = parseInt(product.stock);
  const minStock = parseInt(product.minStock);
  
  if (stock <= 0) return 'out_of_stock';
  if (stock <= minStock) return 'low_stock';
  return 'in_stock';
};

// Get stock status color
export const getStockStatusColor = (status: string): string => {
  switch (status) {
    case 'in_stock':
      return 'text-green-600';
    case 'low_stock':
      return 'text-orange-600';
    case 'out_of_stock':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

// Get primary image
export const getPrimaryImage = (product: Product): string => {
  return product.images && product.images.length > 0 
    ? product.images[0] 
    : '/api/placeholder/300/300';
};

// Format product tags for display
export const formatTags = (tags: string[]): string => {
  return tags.join(', ');
};

// Truncate text
export const truncateText = (text: string | undefined | null, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get discount type label
export const getDiscountTypeLabel = (discountType: string): string => {
  switch (discountType) {
    case "0": return "No Discount";
    case "1": return "Percentage";
    case "2": return "Fixed Amount";
    default: return "Unknown";
  }
};

// Format discount display
export const formatDiscountDisplay = (discountType: string, discountValue: string): string => {
  if (discountType === "0") return "No Discount";
  if (discountType === "1") return `${discountValue}%`;
  if (discountType === "2") return `₦${parseFloat(discountValue).toLocaleString()}`;
  return "Unknown";
};

// Check if product has discount (updated logic)
export const hasDiscountNew = (product: Product): boolean => {
  return product.discountType !== "0" && !!product.discountValue && parseFloat(product.discountValue) > 0;
};

// Get the main display price (unit price when no discount, discount price when there is discount)
export const getMainDisplayPrice = (product: Product): string => {
  return product.discountType === "0" ? product.unitPrice : product.discountPrice;
};

// Get the original price for strikethrough (only when there's a discount)
export const getOriginalPrice = (product: Product): string | null => {
  return product.discountType !== "0" ? product.unitPrice : null;
};

// Check if we should show strikethrough price
export const shouldShowStrikethrough = (product: Product): boolean => {
  return product.discountType !== "0" && product.unitPrice !== product.discountPrice;
};

// Calculate savings amount
export const calculateSavings = (product: Product): number => {
  if (product.discountType === "0") return 0;
  return parseFloat(product.unitPrice) - parseFloat(product.discountPrice);
};

// Format savings display
export const formatSavingsDisplay = (product: Product): string => {
  const savings = calculateSavings(product);
  return `You save ₦${savings.toLocaleString()}`;
};