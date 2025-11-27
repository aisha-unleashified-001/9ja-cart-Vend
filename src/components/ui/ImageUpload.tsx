import React, { useState, useRef } from 'react';
import { validateProductImages, createImagePreview, revokeImagePreview } from '@/lib/formData.utils';

interface ImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
  className?: string;
  disabled?: boolean;
  disabledMessage?: string;
}

interface ImagePreview {
  file: File;
  url: string;
}

export function ImageUpload({
  images,
  onImagesChange,
  maxImages = 5,
  className = '',
  disabled = false,
  disabledMessage,
}: ImageUploadProps) {
  const [previews, setPreviews] = useState<ImagePreview[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }

    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate files
    const validationErrors = validateProductImages([...images, ...files]);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear errors
    setErrors([]);

    // Create new previews
    const newPreviews = files.map(file => ({
      file,
      url: createImagePreview(file)
    }));

    // Update state
    const updatedImages = [...images, ...files];
    const updatedPreviews = [...previews, ...newPreviews];

    onImagesChange(updatedImages);
    setPreviews(updatedPreviews);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    // Revoke preview URL to prevent memory leaks
    revokeImagePreview(previews[index].url);

    // Update state
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);

    onImagesChange(updatedImages);
    setPreviews(updatedPreviews);
    setErrors([]);
  };

  const hasRemainingSlots = images.length < maxImages;
  const canAddMore = !disabled && hasRemainingSlots;

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Upload Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={!hasRemainingSlots || disabled}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={!canAddMore}
            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {disabled ? (
              <div className="text-center">
                <p className="text-sm font-semibold">Uploads unavailable</p>
                <p className="text-xs text-gray-500 mt-1">
                  {disabledMessage ?? "Image uploads are currently disabled."}
                </p>
              </div>
            ) : images.length === 0 ? (
              <div className="text-center">
                <div className="text-4xl mb-2">📷</div>
                <p className="text-sm">Click to upload product images</p>
                <p className="text-xs text-gray-500 mt-1">
                  JPEG, PNG, WebP up to 5MB each (max {maxImages} images)
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm">Add more images ({images.length}/{maxImages})</p>
              </div>
            )}
          </button>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="space-y-1">
            {errors.map((error, index) => (
              <p key={index} className="text-sm text-red-600">{error}</p>
            ))}
          </div>
        )}

        {/* Image Previews */}
        {previews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={preview.url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  ×
                </button>
                <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-50 text-white text-xs p-1 rounded truncate opacity-0 group-hover:opacity-100 transition-opacity">
                  {preview.file.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}