
import { Link } from 'react-router-dom';
import type { Product } from '@/types';
import { 
  formatPriceDisplay, 
  getProductStatus, 
  getStatusColor, 
  getStockStatus,
  getStockStatusColor,
  getPrimaryImage,
  truncateText,
  hasDiscount,
  calculateDiscountPercentage
} from '@/lib/product.utils';

interface ProductCardProps {
  product: Product;
  onToggleStatus?: (productId: string, currentStatus: string) => void;
  isLoading?: boolean;
}

export function ProductCard({ product, onToggleStatus, isLoading = false }: ProductCardProps) {
  const status = getProductStatus(product);
  const stockStatus = getStockStatus(product);
  const primaryImage = getPrimaryImage(product);
  const showDiscount = hasDiscount(product);
  const discountPercentage = showDiscount ? calculateDiscountPercentage(product.unitPrice, product.discountPrice) : 0;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-square bg-secondary/20 flex items-center justify-center overflow-hidden">
        <img 
          src={primaryImage} 
          alt={product.productName}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/api/placeholder/300/300';
          }}
        />
        
        {/* Discount Badge */}
        {showDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            -{discountPercentage}%
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(status)}`}>
            {status.replace('_', ' ')}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-foreground" title={product.productName}>
            {truncateText(product.productName, 25)}
          </h3>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3" title={product.productDescription}>
          {truncateText(product.productDescription, 50)}
        </p>
        
        {/* Price Section */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">
              {formatPriceDisplay(product.discountPrice)}
            </span>
            {showDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPriceDisplay(product.unitPrice)}
              </span>
            )}
          </div>
          <div className="text-right">
            <span className={`text-sm font-medium ${getStockStatusColor(stockStatus)}`}>
              Stock: {product.stock}
            </span>
            {stockStatus === 'low_stock' && (
              <p className="text-xs text-orange-600">Low stock!</p>
            )}
          </div>
        </div>
        
        {/* Category and Tags */}
        <div className="mb-4">
          <span className="text-sm text-muted-foreground">
            Category: {product.categoryName || 'Uncategorized'}
          </span>
          {product.productTags && product.productTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {product.productTags.slice(0, 2).map((tag, index) => (
                <span key={index} className="text-xs bg-secondary px-2 py-1 rounded-full text-muted-foreground">
                  {tag}
                </span>
              ))}
              {product.productTags.length > 2 && (
                <span className="text-xs text-muted-foreground">
                  +{product.productTags.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          {onToggleStatus && (
            <button
              onClick={() => onToggleStatus(product.productId, status)}
              disabled={isLoading}
              className="flex-1 px-3 py-2 text-center border border-border rounded-md text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
            >
              {status === 'active' ? 'Deactivate' : 'Activate'}
            </button>
          )}
          <Link
            to={`/products/${product.productId}`}
            className="flex-1 px-3 py-2 text-center bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}