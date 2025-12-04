import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { dashboardService } from '@/services/dashboard.service';
import { validateProductImage, createImagePreview, revokeImagePreview } from '@/lib/imageUpload.utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ProfileImageUploadProps {
  currentImageUrl?: string;
  onUploadSuccess?: () => void;
  disabled?: boolean;
}

export function ProfileImageUpload({
  currentImageUrl,
  onUploadSuccess,
  disabled = false,
}: ProfileImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      toast.error(validationError);
      return;
    }

    // Create preview
    const preview = createImagePreview(file);
    setSelectedFile(file);
    setPreviewUrl(preview);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
      await dashboardService.uploadProfileImage(selectedFile);
      toast.success('Profile image uploaded successfully!');
      
      // Clean up preview
      if (previewUrl) {
        revokeImagePreview(previewUrl);
      }
      
      setSelectedFile(null);
      setPreviewUrl(null);
      
      // Refresh profile data
      onUploadSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to upload profile image';
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const displayImage = previewUrl || currentImageUrl;
  const hasChanges = selectedFile !== null;

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-6">
        {/* Image Display/Upload Area */}
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-secondary border-2 border-border flex items-center justify-center">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-4xl text-muted-foreground">👤</div>
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
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isUploading}
                className="px-4 py-2 text-sm border border-border rounded-md text-foreground hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentImageUrl ? 'Change Photo' : 'Upload Photo'}
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
                    className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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


