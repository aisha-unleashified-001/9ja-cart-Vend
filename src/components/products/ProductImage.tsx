import { useState } from 'react';
import { formatImageUrls } from '@/lib/image.utils';

interface ProductImageProps {
  images: string[];
  productName: string;
  className?: string;
  showGallery?: boolean;
}

export function ProductImage({ 
  images, 
  productName, 
  className = '', 
  showGallery = false 
}: ProductImageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState<boolean[]>([]);
  const [imageLoading, setImageLoading] = useState<boolean[]>([]);

  // Format image URLs to be absolute
  const formattedImages = formatImageUrls(images);
  
  // Debug: Log image URLs (only if images exist)
  if (formattedImages.length > 0) {
    console.log('🖼️ ProductImage - Raw images for', productName, ':', images);
    console.log('🖼️ ProductImage - Formatted images for', productName, ':', formattedImages);
  }

  // Handle image load error
  const handleImageError = (index: number) => {
    console.log('❌ Image load error for', productName, 'at index', index, ':', formattedImages[index]);
    setImageError(prev => {
      const newErrors = [...prev];
      newErrors[index] = true;
      return newErrors;
    });
    setImageLoading(prev => {
      const newLoading = [...prev];
      newLoading[index] = false;
      return newLoading;
    });
  };

  // Handle image load start
  const handleImageLoadStart = (index: number) => {
    setImageLoading(prev => {
      const newLoading = [...prev];
      newLoading[index] = true;
      return newLoading;
    });
  };

  // Handle image load success
  const handleImageLoad = (index: number) => {
    console.log('✅ Image loaded successfully for', productName, 'at index', index, ':', formattedImages[index]);
    setImageLoading(prev => {
      const newLoading = [...prev];
      newLoading[index] = false;
      return newLoading;
    });
  };

  // Get the primary image (first valid image or placeholder)
  const getPrimaryImage = () => {
    if (!formattedImages || formattedImages.length === 0) {
      return null;
    }

    // Find first image that hasn't errored
    const validImageIndex = formattedImages.findIndex((_, index) => !imageError[index]);
    return validImageIndex !== -1 ? formattedImages[validImageIndex] : null;
  };

  const primaryImage = getPrimaryImage();
  const hasValidImages = primaryImage !== null;

  // Navigation for gallery
  const nextImage = () => {
    if (formattedImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % formattedImages.length);
    }
  };

  const prevImage = () => {
    if (formattedImages.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + formattedImages.length) % formattedImages.length);
    }
  };

  if (!hasValidImages) {
    // No valid images - show placeholder
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-400">
          <div className="text-4xl mb-2">📦</div>
          <div className="text-sm">No Image</div>
        </div>
      </div>
    );
  }

  if (showGallery && formattedImages.length > 1) {
    // Gallery view with navigation
    return (
      <div className="space-y-4">
        <div className={`relative overflow-hidden ${className}`}>
          <img
            src={formattedImages[currentImageIndex]}
            alt={`${productName} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
            onLoadStart={() => handleImageLoadStart(currentImageIndex)}
            onLoad={() => handleImageLoad(currentImageIndex)}
            onError={() => handleImageError(currentImageIndex)}
          />
          
          {/* Loading indicator */}
          {imageLoading[currentImageIndex] && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto mb-2"></div>
                <div className="text-sm">Loading...</div>
              </div>
            </div>
          )}
          
          {/* Navigation buttons */}
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            aria-label="Previous image"
          >
            ←
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            aria-label="Next image"
          >
            →
          </button>
          
          {/* Image counter */}
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {currentImageIndex + 1} / {formattedImages.length}
          </div>
        </div>

        {/* Thumbnail navigation */}
        <div className="flex space-x-2 overflow-x-auto">
          {formattedImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                index === currentImageIndex
                  ? "border-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onLoadStart={() => handleImageLoadStart(index)}
                onLoad={() => handleImageLoad(index)}
                onError={() => handleImageError(index)}
              />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Simple single image view
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={primaryImage}
        alt={productName}
        className="w-full h-full object-cover"
        onLoadStart={() => handleImageLoadStart(0)}
        onLoad={() => handleImageLoad(0)}
        onError={() => handleImageError(0)}
      />
      
      {/* Loading indicator */}
      {imageLoading[0] && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto mb-2"></div>
            <div className="text-sm">Loading...</div>
          </div>
        </div>
      )}
    </div>
  );
}