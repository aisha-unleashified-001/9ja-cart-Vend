import { motion } from 'framer-motion';
import { useState } from 'react';
// import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import ImagePlaceholder from './image-placeholder';

interface EnhancedImageProps {
  src?: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showPlaceholder?: boolean;
  animate?: boolean;
  fallbackContent?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
}

const EnhancedImage = ({
  src,
  alt,
  className,
  aspectRatio = 'video',
  size,
  showPlaceholder = true,
  animate = true,
  fallbackContent,
  onLoad,
  onError
}: EnhancedImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleImageError = () => {
    setImageError(true);
    onError?.();
  };

  // If no src provided or image failed to load, show placeholder
  if (!src || imageError) {
    if (!showPlaceholder) {
      return null;
    }
    
    return (
      <ImagePlaceholder
        className={className}
        aspectRatio={aspectRatio}
        size={size}
        animate={animate}
        alt={alt}
      >
        {fallbackContent}
      </ImagePlaceholder>
    );
  }

  return (
    <motion.div
      className={cn('relative overflow-hidden', className)}
      initial={animate ? { opacity: 0, scale: 0.95 } : undefined}
      animate={animate ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Loading placeholder */}
      {!imageLoaded && showPlaceholder && (
        <div className="absolute inset-0 z-10">
          <ImagePlaceholder
            aspectRatio={aspectRatio}
            size={size}
            animate={false}
            alt={`Loading ${alt}`}
            loading={true}
          />
        </div>
      )}

      {/* Actual image */}
      <motion.img
        src={src}
        alt={alt}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-500',
          imageLoaded ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={handleImageLoad}
        onError={handleImageError}
        initial={animate ? { scale: 1.1 } : undefined}
        animate={animate && imageLoaded ? { scale: 1 } : undefined}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      />

      {/* Hover overlay */}
      <motion.div
        className="absolute inset-0 bg-primary/5 opacity-0 hover:opacity-100 transition-opacity duration-300"
        initial={false}
      />
    </motion.div>
  );
};

export default EnhancedImage;