import React, { useState, useRef } from 'react';
import { validateRegistrationDocument } from '@/lib/registration.utils';

interface DocumentUploadProps {
  label: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  accept?: string;
  required?: boolean;
  className?: string;
  formError?: string;
}

export function DocumentUpload({ 
  label, 
  file, 
  onFileChange, 
  accept = "image/*,.pdf",
  required = false,
  className = '',
  formError
}: DocumentUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    
    if (!selectedFile) {
      onFileChange(null);
      setPreview(null);
      setError(null);
      return;
    }

    // Validate file
    const validationError = validateRegistrationDocument(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Clear error and set file
    setError(null);
    onFileChange(selectedFile);

    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    } else {
      setPreview(null);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = () => {
    onFileChange(null);
    setPreview(null);
    setError(null);
    if (preview) {
      URL.revokeObjectURL(preview);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType === 'application/pdf') return '📄';
    return '📎';
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-foreground mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {!file ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`w-full px-4 py-6 border-2 border-dashed rounded-lg text-gray-600 transition-colors ${
              error || formError
                ? 'border-red-500 hover:border-red-600 text-red-600'
                : 'border-gray-300 hover:border-primary hover:text-primary'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">📎</div>
              <p className="text-sm font-medium">Click to upload {label.toLowerCase()}</p>
              <p className="text-xs text-gray-500 mt-1">
                Supports: JPEG, PNG, WebP, PDF (max 10MB)
              </p>
            </div>
          </button>
        </div>
      ) : (
        <div className={`border rounded-lg p-4 ${
          error || formError ? 'border-red-500' : 'border-border'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getFileIcon(file.type)}</span>
              <div>
                <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Image Preview */}
          {preview && (
            <div className="mt-3">
              <img 
                src={preview} 
                alt="Document preview" 
                className="max-w-full h-32 object-contain rounded border"
              />
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {(error || formError) && (
        <p className="mt-1 text-sm text-red-600">{error || formError}</p>
      )}

      {/* Helper Text */}
      <p className="mt-1 text-xs text-muted-foreground">
        Upload a clear, readable document. Accepted formats: JPEG, PNG, WebP, PDF
      </p>
    </div>
  );
}