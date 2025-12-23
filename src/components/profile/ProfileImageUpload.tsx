import { useState, useRef, useEffect } from 'react';
import { popup } from '@/lib/popup';
import { dashboardService } from '@/services/dashboard.service';
import { validateProductImage, createImagePreview, revokeImagePreview } from '@/lib/imageUpload.utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatImageUrl } from '@/lib/image.utils';

interface ProfileImageUploadProps {
  currentImageUrl?: string;
  onUploadSuccess?: () => void;
  disabled?: boolean;
  storeName?: string;
}

export function ProfileImageUpload({
  currentImageUrl,
  onUploadSuccess,
  disabled = false,
  storeName,
}: ProfileImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoadingLogo, setIsLoadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch logo on mount
  useEffect(() => {
    const fetchLogo = async () => {
      setIsLoadingLogo(true);
      try {
        const logo = await dashboardService.getLogo();
        if (logo) {
          setLogoUrl(formatImageUrl(logo));
        }
      } catch (error) {
        // Silently fail - logo might not exist yet
        console.error('Failed to fetch logo:', error);
      } finally {
        setIsLoadingLogo(false);
      }
    };

    fetchLogo();
  }, []);

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        revokeImagePreview(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validationError = validateProductImage(file);
    if (validationError) {
      popup.error(validationError);
      return;
    }

    // Create preview
    const preview = createImagePreview(file);
    setSelectedFile(file);
    setPreviewUrl(preview);
    
    // Note: Don't reset file input value here - it prevents onChange from firing
    // if the user selects the same file again. The reset happens in the button click handler.
  };

  const handleRemove = () => {
    if (previewUrl) {
      revokeImagePreview(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleUpload = async () => {
    if (!selectedFile || disabled) {
      return;
    }

    setIsUploading(true);

    try {
      // Upload the logo (API returns 200 OK with no response body)
      await dashboardService.uploadLogo(selectedFile);
      
      // After successful upload, fetch the logo to get the updated URL
      // Add a small delay to ensure backend has processed the upload
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let fetchedLogoUrl: string | null = null;
      try {
        const updatedLogo = await dashboardService.getLogo();
        if (updatedLogo) {
          // Format the URL (handles both relative and absolute URLs)
          fetchedLogoUrl = formatImageUrl(updatedLogo);
          setLogoUrl(fetchedLogoUrl);
          console.log('Logo fetched successfully:', fetchedLogoUrl);
        } else {
          console.warn('Logo uploaded but getLogo returned null');
        }
      } catch (fetchError) {
        // If fetching fails, still show success but log the error
        console.error('Logo uploaded but failed to fetch updated URL:', fetchError);
      }
      
      // Clean up preview (do this after setting logoUrl so there's no flicker)
      if (previewUrl) {
        revokeImagePreview(previewUrl);
      }
      
      setSelectedFile(null);
      setPreviewUrl(null);
      
      // Show success message
      popup.success('Business logo uploaded successfully!');
      
      // Refresh profile data
      onUploadSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to upload business logo';
      popup.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const displayImage = previewUrl || logoUrl || currentImageUrl;
  const hasChanges = selectedFile !== null;

  // Get first letter of store name for placeholder
  const getStoreInitial = (name?: string) => {
    if (!name || name.trim().length === 0) return 'S';
    return name.trim().charAt(0).toUpperCase();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-6">
        {/* Image Display/Upload Area */}
        <div className="flex-shrink-0">
          <div className="relative">
            <div className={`w-32 h-32 rounded-full overflow-hidden border-2 border-border flex items-center justify-center ${
              displayImage ? 'bg-secondary' : 'bg-primary'
            }`}>
              {isLoadingLogo ? (
                <LoadingSpinner size="sm" />
              ) : displayImage ? (
                <img
                  src={displayImage}
                  alt="Business Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Failed to load logo image:', displayImage);
                    // Fallback to placeholder if image fails to load
                    e.currentTarget.style.display = 'none';
                  }}
                  onLoad={() => {
                    console.log('Logo image loaded successfully:', displayImage);
                  }}
                />
              ) : (
                <span className="text-primary-foreground text-4xl font-medium">
                  {getStoreInitial(storeName)}
                </span>
              )}
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <LoadingSpinner size="sm" />
              </div>
            )}
          </div>
        </div>

        {/* Upload Controls */}
        <div className="flex-1 space-y-3">
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
              disabled={disabled || isUploading}
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  // Clear any existing preview/selection when changing logo
                  if (previewUrl) {
                    revokeImagePreview(previewUrl);
                    setPreviewUrl(null);
                  }
                  setSelectedFile(null);
                  
                  // Reset file input to allow selecting the same file again
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                  
                  // Trigger file picker
                  fileInputRef.current?.click();
                }}
                disabled={disabled || isUploading}
                className="px-4 py-2 text-sm border border-border rounded-md text-foreground hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {logoUrl || currentImageUrl ? 'Change Business Logo' : 'Upload Business Logo'}
              </button>
              {hasChanges && (
                <>
                  <button
                    type="button"
                    onClick={handleRemove}
                    disabled={isUploading}
                    className="px-4 py-2 text-sm border border-border rounded-md text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={isUploading || !selectedFile}
                    className="px-4 py-2 text-sm bg-[#8DEB6E] text-primary rounded-md hover:bg-[#8DEB6E]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <LoadingSpinner size="sm" />
                        Uploading...
                      </>
                    ) : (
                      'Save Photo'
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            JPG, PNG or WebP. Max size 5MB. Recommended: Square image, at least 200x200px.
          </p>
        </div>
      </div>
    </div>
  );
}



