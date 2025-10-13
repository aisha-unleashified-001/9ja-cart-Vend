import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRegistration } from '@/hooks/useRegistration';
import { useCategories } from '@/hooks/useCategories';
import { LoadingButton } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

interface RegisterBasicInfoProps {
  onNext: (data: { fullName: string; businessName: string; businessCategory: string; phone: string }) => void;
  onBack: () => void;
  initialData?: { fullName: string; businessName: string; businessCategory: string; phone: string };
}

export default function RegisterBasicInfo({ onNext, onBack, initialData }: RegisterBasicInfoProps) {
  const { 
    formData, 
    isLoading, 
    error, 
    submitStep2, 
    clearError 
  } = useRegistration();
  
  const { 
    categories, 
    isLoading: categoriesLoading, 
    fetchCategories 
  } = useCategories();

  const [fullName, setFullName] = useState(initialData?.fullName || formData.fullName || '');
  const [businessName, setBusinessName] = useState(initialData?.businessName || formData.businessName || '');
  const [businessCategory, setBusinessCategory] = useState(initialData?.businessCategory || formData.businessCategory || '');
  const [phone, setPhone] = useState(initialData?.phone || formData.phoneNumber || '');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Clear API errors when user starts typing
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [fullName, businessName, businessCategory, phone, clearError]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!businessCategory) {
      newErrors.businessCategory = 'Business category is required';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      // Nigerian phone number validation
      const phoneRegex = /^(\+234|234|0)?[789][01]\d{8}$/;
      if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Please enter a valid Nigerian phone number';
      }
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Submit to API via registration store
      await submitStep2({
        emailAddress: formData.emailAddress || '',
        fullName,
        businessName,
        businessCategory, // This will be converted to ID in the store
        phoneNumber: phone,
      }, categories);

      // Success - call onNext for UI navigation
      toast.success("Business information saved successfully!");
      onNext({ fullName, businessName, businessCategory, phone });
    } catch (error) {
      // Error is handled by the registration store
      console.error("Step 2 submission failed:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Basic Information</h2>
      </div>
      
      {error && <ErrorMessage message={error} className="mb-4" />}
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
            placeholder="Enter your full name"
          />
          {formErrors.fullName && <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>}
        </div>

        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
            Business Name
          </label>
          <input
            id="businessName"
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
            placeholder="Enter your business name"
          />
          {formErrors.businessName && <p className="mt-1 text-sm text-red-600">{formErrors.businessName}</p>}
        </div>

        <div>
          <label htmlFor="businessCategory" className="block text-sm font-medium text-gray-700 mb-2">
            Business Category
          </label>
          {categoriesLoading ? (
            <div className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500 mr-2"></div>
              <span className="text-gray-500">Loading categories...</span>
            </div>
          ) : (
            <select
              id="businessCategory"
              value={businessCategory}
              onChange={(e) => setBusinessCategory(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryName}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          )}
          {formErrors.businessCategory && <p className="mt-1 text-sm text-red-600">{formErrors.businessCategory}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
            placeholder="e.g. 08012345678"
          />
          {formErrors.phone && <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>}
          <p className="mt-1 text-xs text-gray-500">
            Enter a valid Nigerian phone number
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="flex-1 py-3 px-4 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Back
          </button>
          <LoadingButton
            type="submit"
            isLoading={isLoading}
            className="flex-1 py-3 px-4 bg-green-700 hover:bg-green-800 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {isLoading ? "Saving..." : "Continue"}
          </LoadingButton>
        </div>
      </form>
    </div>
  );
}