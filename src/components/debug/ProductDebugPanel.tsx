import { useState } from 'react';
import type { Product } from '@/types';

interface ProductDebugPanelProps {
  product: Product;
}

export function ProductDebugPanel({ product }: ProductDebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors"
      >
        🐛 Debug
      </button>
      
      {isOpen && (
        <div className="absolute bottom-12 right-0 w-96 max-h-96 bg-white border border-gray-300 rounded-lg shadow-lg overflow-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">Product Debug Info</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3 text-sm">
              <div>
                <strong className="text-gray-700">Product ID:</strong>
                <div className="font-mono text-xs bg-gray-100 p-1 rounded mt-1">
                  {product.productId}
                </div>
              </div>
              
              <div>
                <strong className="text-gray-700">Images ({product.images?.length || 0}):</strong>
                <div className="font-mono text-xs bg-gray-100 p-2 rounded mt-1 max-h-32 overflow-auto">
                  {product.images?.length > 0 ? (
                    <pre>{JSON.stringify(product.images, null, 2)}</pre>
                  ) : (
                    <span className="text-gray-500">No images</span>
                  )}
                </div>
              </div>
              
              <div>
                <strong className="text-gray-700">Full Product Data:</strong>
                <div className="font-mono text-xs bg-gray-100 p-2 rounded mt-1 max-h-40 overflow-auto">
                  <pre>{JSON.stringify(product, null, 2)}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}