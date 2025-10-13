import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistration } from '@/hooks/useRegistration';

import { ErrorMessage } from '@/components/ui/ErrorMessage';

interface BusinessVerificationDetailsProps {
  onNext?: (data: any) => void;
}

export default function BusinessVerificationDetails({ onNext }: BusinessVerificationDetailsProps) {
  const { 
    formData, 
    error, 
    setFormData, 
    clearError 
  } = useRegistration();

  const [businessRegNumber, setBusinessRegNumber] = useState(formData.businessRegNumber || '');
  const [storeName, setStoreName] = useState(formData.storeName || '');
  const [businessAddress, setBusinessAddress] = useState(formData.businessAddress || '');
  const [taxId, setTaxId] = useState(formData.taxIdNumber || '');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  // Clear API errors when user starts typing
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [businessRegNumber, storeName, businessAddress, taxId, clearError]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!storeName.trim()) {
      newErrors.storeName = 'Store name is required';
    }

    if (!businessAddress.trim()) {
      newErrors.businessAddress = 'Business address is required';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const data = { 
        businessRegNumber, 
        storeName, 
        businessAddress, 
        taxIdNumber: taxId 
      };
      
      // Save data to registration store
      setFormData(data);
      
      if (onNext) {
        onNext(data);
      } else {
        // Navigate to document upload step
        navigate('/register/business-verification/documents');
      }
    }
  };

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} className="mb-4" />}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="businessRegNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Business Registration Number{' '}
            <span className="text-xs text-gray-500">(optional but recommended)</span>
          </label>
          <input
            id="businessRegNumber"
            type="text"
            value={businessRegNumber}
            onChange={(e) => setBusinessRegNumber(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="RC-12345"
          />
          {formErrors.businessRegNumber && <p className="mt-1 text-sm text-red-600">{formErrors.businessRegNumber}</p>}
        </div>

        <div>
          <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-2">
            Store Name{' '}
            <span className="text-xs text-gray-500">(Public Name)</span>
          </label>
          <input
            id="storeName"
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Your Store Name"
          />
          {formErrors.storeName && <p className="mt-1 text-sm text-red-600">{formErrors.storeName}</p>}
        </div>

        <div>
          <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700 mb-2">
            Business Address
          </label>
          <textarea
            id="businessAddress"
            rows={3}
            value={businessAddress}
            onChange={(e) => setBusinessAddress(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter your complete business address"
          />
          {formErrors.businessAddress && <p className="mt-1 text-sm text-red-600">{formErrors.businessAddress}</p>}
        </div>

        <div>
          <label htmlFor="taxId" className="block text-sm font-medium text-gray-700 mb-2">
            Tax Identification Number{' '}
            <span className="text-xs text-gray-500">(if applicable)</span>
          </label>
          <input
            id="taxId"
            type="text"
            value={taxId}
            onChange={(e) => setTaxId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter your TIN if available"
          />
          {formErrors.taxId && <p className="mt-1 text-sm text-red-600">{formErrors.taxId}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-green-700 hover:bg-green-800 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Continue
        </button>
      </form>

      <div className="text-center text-xs text-gray-500">
        By continuing, you agree to 9ja-cart's Conditions of Use and Privacy Notice.
      </div>
    </div>
  );
}