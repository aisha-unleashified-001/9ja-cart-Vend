import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { validateProductImages, createImagePreview, revokeImagePreview } from '@/lib/formData.utils';
import { Star } from 'lucide-react';

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
  const previewsMapRef = useRef<Map<File, ImagePreview>>(new Map());
  const APPROVED_SIZE = 743;
  const [croppingFile, setCroppingFile] = useState<File | null>(null);
  const [croppingImageUrl, setCroppingImageUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop | undefined>();
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const cropImageRef = useRef<HTMLImageElement | null>(null);

  // Sync previews with images when images change externally (e.g., reordering)
  useEffect(() => {
    setPreviews(prevPreviews => {
      // Create a map of existing previews by file reference
      const previewMap = new Map<File, ImagePreview>();
      prevPreviews.forEach(preview => {
        previewMap.set(preview.file, preview);
      });

      // Build new previews array matching images order
      const newPreviews: ImagePreview[] = [];
      const imagesToCreatePreviews: File[] = [];

      images.forEach(img => {
        const existingPreview = previewMap.get(img);
        if (existingPreview) {
          newPreviews.push(existingPreview);
        } else {
          // New image, need to create preview
          imagesToCreatePreviews.push(img);
        }
      });

      // Create previews for new images
      imagesToCreatePreviews.forEach(file => {
        const preview = {
          file,
          url: createImagePreview(file)
        };
        newPreviews.push(preview);
        previewMap.set(file, preview);
      });

      // Clean up previews for removed images
      const currentImageSet = new Set(images);
      prevPreviews.forEach(preview => {
        if (!currentImageSet.has(preview.file)) {
          revokeImagePreview(preview.url);
        }
      });

      // Update the ref map
      previewsMapRef.current = previewMap;

      return newPreviews;
    });
  }, [images]);
  
  // When there are pending files and no active crop, start cropping the next one
  useEffect(() => {
    if (!croppingFile && pendingFiles.length > 0) {
      const [next, ...rest] = pendingFiles;
      setPendingFiles(rest);

      if (croppingImageUrl) {
        URL.revokeObjectURL(croppingImageUrl);
      }

      const url = URL.createObjectURL(next);
      setCroppingFile(next);
      setCroppingImageUrl(url);
      setCrop(undefined);
    }
  }, [croppingFile, pendingFiles, croppingImageUrl]);

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

    // Clear previous errors
    setErrors([]);

    setPendingFiles(prev => [...prev, ...files]);

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

  const setPrimaryImage = (index: number) => {
    if (disabled || index === 0) return; // Already primary or disabled

    // Reorder images: move selected image to first position
    const selectedImage = images[index];
    const selectedPreview = previews[index];
    
    const reorderedImages = [
      selectedImage,
      ...images.filter((_, i) => i !== index)
    ];
    
    const reorderedPreviews = [
      selectedPreview,
      ...previews.filter((_, i) => i !== index)
    ];

    onImagesChange(reorderedImages);
    setPreviews(reorderedPreviews);
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
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Click on an image to set it as the primary image (shown first to customers)
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {previews.map((preview, index) => {
                const isPrimary = index === 0;
                return (
                  <div 
                    key={index} 
                    className={`relative group cursor-pointer ${isPrimary ? 'ring-2 ring-[#8DEB6E] ring-offset-2' : ''}`}
                    onClick={() => !disabled && setPrimaryImage(index)}
                  >
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={preview.url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Primary Image Badge */}
                    {isPrimary && (
                      <div className="absolute top-2 left-2 bg-[#8DEB6E] text-black text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-black" />
                        Primary
                      </div>
                    )}
                    
                    {/* Set as Primary Button (for non-primary images) */}
                    {!isPrimary && !disabled && (
                      <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Set Primary
                      </div>
                    )}
                    
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 z-10"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-50 text-white text-xs p-1 rounded truncate opacity-0 group-hover:opacity-100 transition-opacity">
                      {preview.file.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Cropping Modal */}
      {croppingFile && croppingImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg shadow-xl max-w-[90vw] max-h-[90vh] w-full md:w-[720px] p-4 flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Crop image to {APPROVED_SIZE}px × {APPROVED_SIZE}px
            </h3>
            <p className="text-xs text-gray-600">
              Drag to choose the exact square area buyers will see. The final image will be saved at {APPROVED_SIZE}px by {APPROVED_SIZE}px.
            </p>
            <div className="flex-1 overflow-auto flex items-center justify-center">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                aspect={1}
                keepSelection
                ruleOfThirds
              >
                <img
                  src={croppingImageUrl}
                  alt="Crop"
                  className="max-h-[60vh] object-contain"
                  onLoad={(event: React.SyntheticEvent<HTMLImageElement>) => {
                    const img = event.currentTarget;
                    cropImageRef.current = img;
                    const { naturalWidth, naturalHeight } = img;

                    if (
                      naturalWidth < APPROVED_SIZE ||
                      naturalHeight < APPROVED_SIZE
                    ) {
                      setErrors(prev => [
                        ...prev,
                        `${croppingFile.name}: Image must be at least ${APPROVED_SIZE}px by ${APPROVED_SIZE}px`,
                      ]);
                      // Skip this image
                      if (croppingImageUrl) {
                        URL.revokeObjectURL(croppingImageUrl);
                      }
                      setCroppingFile(null);
                      setCroppingImageUrl(null);
                      setCrop(undefined);
                      return;
                    }

                    // Initial centered crop: fixed APPROVED_SIZE x APPROVED_SIZE in image pixels
                    const widthPercent = (APPROVED_SIZE / naturalWidth) * 100;
                    const heightPercent = (APPROVED_SIZE / naturalHeight) * 100;
                    const x = (100 - widthPercent) / 2;
                    const y = (100 - heightPercent) / 2;

                    setCrop({
                      unit: '%',
                      width: widthPercent,
                      height: heightPercent,
                      x,
                      y,
                    });
                  }}
                />
              </ReactCrop>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
              <button
                type="button"
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  if (croppingImageUrl) {
                    URL.revokeObjectURL(croppingImageUrl);
                  }
                  setCroppingFile(null);
                  setCroppingImageUrl(null);
                  setCrop(undefined);
                }}
              >
                Skip image
              </button>
              <button
                type="button"
                className="px-3 py-1.5 text-xs bg-[#8DEB6E] text-black rounded-md hover:bg-[#8DEB6E]/90"
                onClick={async () => {
                  if (!croppingFile || !cropImageRef.current || !crop) return;

                  const image = cropImageRef.current;
                  const naturalWidth = image.naturalWidth;
                  const naturalHeight = image.naturalHeight;

                  const widthPercent = crop.width ?? 0;
                  const heightPercent = crop.height ?? 0;
                  const xPercent = crop.x ?? 0;
                  const yPercent = crop.y ?? 0;

                  const cropWidthPx = (widthPercent / 100) * naturalWidth;
                  const cropHeightPx = (heightPercent / 100) * naturalHeight;

                  if (
                    cropWidthPx < APPROVED_SIZE ||
                    cropHeightPx < APPROVED_SIZE
                  ) {
                    setErrors(prev => [
                      ...prev,
                      `${croppingFile.name}: Please select an area at least ${APPROVED_SIZE}px by ${APPROVED_SIZE}px`,
                    ]);
                    return;
                  }

                  const canvas = document.createElement('canvas');
                  canvas.width = APPROVED_SIZE;
                  canvas.height = APPROVED_SIZE;
                  const ctx = canvas.getContext('2d');
                  if (!ctx) return;

                  const sx = (xPercent / 100) * naturalWidth;
                  const sy = (yPercent / 100) * naturalHeight;

                  ctx.drawImage(
                    image,
                    sx,
                    sy,
                    cropWidthPx,
                    cropHeightPx,
                    0,
                    0,
                    APPROVED_SIZE,
                    APPROVED_SIZE
                  );

                  canvas.toBlob(
                    (blob) => {
                      if (!blob) return;
                      const croppedFile = new File([blob], croppingFile.name, {
                        type: croppingFile.type || 'image/jpeg',
                      });

                      const preview = {
                        file: croppedFile,
                        url: createImagePreview(croppedFile),
                      };

                      const updatedImages = [...images, croppedFile];
                      onImagesChange(updatedImages);
                      setPreviews(prev => [...prev, preview]);

                      if (croppingImageUrl) {
                        URL.revokeObjectURL(croppingImageUrl);
                      }
                      setCroppingFile(null);
                      setCroppingImageUrl(null);
                      setCrop(undefined);
                    },
                    croppingFile.type || 'image/jpeg'
                  );
                }}
              >
                Save crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}