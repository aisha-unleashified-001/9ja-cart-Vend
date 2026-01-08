import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface DocumentViewerModalProps {
  documentUrl: string;
  documentName: string;
  onClose: () => void;
}

export default function DocumentViewerModal({
  documentUrl,
  documentName,
  onClose,
}: DocumentViewerModalProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isPdf, setIsPdf] = useState(false);

  useEffect(() => {
    // Check if the document is a PDF
    const urlLower = documentUrl.toLowerCase();
    setIsPdf(urlLower.includes('.pdf') || urlLower.includes('application/pdf'));
  }, [documentUrl]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isHovering) {
      onClose();
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setError(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white w-full max-w-4xl h-[90vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-[#182F38]">{documentName}</h2>
            <p className="text-xs text-gray-400">Document viewer</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50 flex items-center justify-center">
          {isLoading && !error && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-500">Loading document...</p>
            </div>
          )}

          {error && (
            <div className="text-center">
              <p className="text-red-500 mb-4">Failed to load document</p>
              <a
                href={documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 underline"
              >
                Open in new tab
              </a>
            </div>
          )}

          {!error && (
            <>
              {isPdf ? (
                <iframe
                  src={documentUrl}
                  className="w-full h-full min-h-[600px] border-0 rounded-lg"
                  onLoad={handleImageLoad}
                  title={documentName}
                />
              ) : (
                <img
                  src={documentUrl}
                  alt={documentName}
                  className={`max-w-full max-h-full object-contain rounded-lg shadow-lg ${
                    isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'
                  }`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#8DEB6E] text-primary rounded-md hover:bg-[#8DEB6E]/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
