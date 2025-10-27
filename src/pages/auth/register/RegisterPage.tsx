import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useBusinessCategories } from '@/hooks/useBusinessCategories';
import { registrationService, RegistrationError } from '@/services/registration.service';
import { LoadingButton } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { DocumentUpload } from '@/components/ui/DocumentUpload';
import type { CompleteRegistrationData, RegistrationFieldErrors } from '@/types';

interface FormData {
  // Step 1: Account Info
  emailAddress: string;
  password: string;
  confirmPassword: string;
  
  // Step 2: Personal & Business Info
  fullName: string;
  businessName: string;
  businessCategory: string;
  businessCategoryId: number;
  phoneNumber: string;
  
  // Step 3: Business Details & Documents
  businessRegNumber: string;
  storeName: string;
  businessAddress: string;
  taxIdNumber: string;
  idDocument: File | null;
  businessRegCertificate: File | null;
}

const initialFormData: FormData = {
  emailAddress: '',
  password: '',
  confirmPassword: '',
  fullName: '',
  businessName: '',
  businessCategory: '',
  businessCategoryId: 0,
  phoneNumber: '',
  businessRegNumber: '',
  storeName: '',
  businessAddress: '',
  taxIdNumber: '',
  idDocument: null,
  businessRegCertificate: null,
};

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<RegistrationFieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { categories, isLoading: categoriesLoading, fetchCategories } = useBusinessCategories();

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Clear API errors and field errors when user starts typing
  useEffect(() => {
    if (apiError) {
      setApiError(null);
    }
    // Clear field errors when user starts typing
    setFormErrors({});
  }, [formData, apiError]);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const validateStep = (step: number): boolean => {
    // Basic validation for UI flow - detailed validation handled by API
    if (step === 1) {
      const isValid = !!(formData.emailAddress && formData.password && formData.confirmPassword);
      if (!isValid) {
        toast.error('Please fill in all required fields');
      }
      if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return false;
      }
      return isValid;
    }
    
    if (step === 2) {
      const isValid = !!(formData.fullName && formData.businessName && formData.businessCategory && formData.phoneNumber);
      if (!isValid) {
        toast.error('Please fill in all required fields');
      }
      return isValid;
    }
    
    if (step === 3) {
      const isValid = !!(formData.storeName && formData.businessAddress && formData.idDocument && formData.businessRegCertificate);
      if (!isValid) {
        toast.error('Please fill in all required fields and upload documents');
      }
      return isValid;
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(prev => prev + 1);
        toast.success(`Step ${currentStep} completed!`);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleCategoryChange = (categoryName: string) => {
    const selectedCategory = categories.find(cat => cat.categoryName === categoryName);
    const categoryId = parseInt(selectedCategory?.id || '0');
    
    console.log('🏷️ Category Selection:', {
      categoryName,
      selectedCategory,
      categoryId,
      isValidNumber: Number.isInteger(categoryId) && categoryId > 0
    });
    
    updateFormData({
      businessCategory: categoryName,
      businessCategoryId: categoryId,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      toast.error('Please complete all required fields');
      return;
    }

    // Validate required files
    if (!formData.idDocument || !formData.businessRegCertificate) {
      toast.error('Please upload both required documents');
      return;
    }

    setIsLoading(true);
    setApiError(null);
    setFormErrors({});

    try {
      // Prepare complete registration data
      const registrationData: CompleteRegistrationData = {
        emailAddress: formData.emailAddress,
        password: formData.password,
        fullName: formData.fullName,
        businessName: formData.businessName,
        businessCategory: formData.businessCategoryId,
        phoneNumber: formData.phoneNumber,
        businessRegNumber: formData.businessRegNumber || '',
        storeName: formData.storeName,
        businessAddress: formData.businessAddress,
        taxIdNumber: formData.taxIdNumber || '',
        idDocument: formData.idDocument,
        businessRegCertificate: formData.businessRegCertificate,
      };

      console.log('🚀 Submitting registration with data:', {
        ...registrationData,
        idDocument: registrationData.idDocument ? `File: ${registrationData.idDocument.name}` : 'None',
        businessRegCertificate: registrationData.businessRegCertificate ? `File: ${registrationData.businessRegCertificate.name}` : 'None',
      });

      // Submit to API
      const result = await registrationService.submitCompleteRegistration(registrationData);
      
      console.log('✅ Registration successful:', result);

      // Success
      toast.success('Registration completed successfully!');
      navigate('/register/success');
    } catch (error) {
      console.error('❌ Registration failed:', error);
      
      if (error instanceof RegistrationError) {
        // Handle field-specific validation errors
        setFormErrors(error.fieldErrors);
        setApiError(error.message);
        
        // Show specific error message
        const errorCount = Object.keys(error.fieldErrors).length;
        if (errorCount > 0) {
          toast.error(`Please fix ${errorCount} error${errorCount > 1 ? 's' : ''} in the form`);
        } else {
          toast.error(error.message);
        }
      } else {
        // Handle general errors
        const errorMessage = error instanceof Error ? error.message : 'Registration failed';
        setApiError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step}
          </div>
          {step < 3 && (
            <div
              className={`w-16 h-1 mx-2 ${
                step < currentStep ? 'bg-primary' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">
          Get started selling <br /> on 9ja-cart
        </h2>
        <p className="text-[#182F38BF]">
          Welcome to 9ja-cart - Let's create your account
        </p>
      </div>

      <div>
        <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700 mb-2">
          Email address
        </label>
        <input
          id="emailAddress"
          type="email"
          value={formData.emailAddress}
          onChange={(e) => updateFormData({ emailAddress: e.target.value })}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
          placeholder="Enter your email"
        />
        {formErrors.emailAddress && (
          <p className="mt-1 text-sm text-red-600">{formErrors.emailAddress}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => updateFormData({ password: e.target.value })}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
          placeholder="Create a password"
        />
        {formErrors.password && (
          <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => updateFormData({ confirmPassword: e.target.value })}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
          placeholder="Confirm your password"
        />
        {formErrors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Personal & Business Information</h2>
        <p className="text-gray-600">Tell us about yourself and your business</p>
      </div>

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={(e) => updateFormData({ fullName: e.target.value })}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
          placeholder="Enter your full name"
        />
        {formErrors.fullName && (
          <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>
        )}
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          id="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => updateFormData({ phoneNumber: e.target.value })}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
          placeholder="e.g. 08012345678"
        />
        {formErrors.phoneNumber && (
          <p className="mt-1 text-sm text-red-600">{formErrors.phoneNumber}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Enter a valid Nigerian phone number
        </p>
      </div>

      <div>
        <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
          Business Name
        </label>
        <input
          id="businessName"
          type="text"
          value={formData.businessName}
          onChange={(e) => updateFormData({ businessName: e.target.value })}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
          placeholder="Enter your business name"
        />
        {formErrors.businessName && (
          <p className="mt-1 text-sm text-red-600">{formErrors.businessName}</p>
        )}
      </div>

      <div>
        <label htmlFor="businessCategory" className="block text-sm font-medium text-gray-700 mb-2">
          Business Category
        </label>
        {categoriesLoading ? (
          <div className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
            <span className="text-gray-500">Loading categories...</span>
          </div>
        ) : (
          <select
            id="businessCategory"
            value={formData.businessCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.categoryName}>
                {category.categoryName}
              </option>
            ))}
          </select>
        )}
        {formErrors.businessCategory && (
          <p className="mt-1 text-sm text-red-600">{formErrors.businessCategory}</p>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Business Details & Documents</h2>
        <p className="text-gray-600">Complete your business verification</p>
      </div>

      <div>
        <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-2">
          Store Name <span className="text-xs text-gray-500">(Public Name)</span>
        </label>
        <input
          id="storeName"
          type="text"
          value={formData.storeName}
          onChange={(e) => updateFormData({ storeName: e.target.value })}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
          placeholder="Your Store Name"
        />
        {formErrors.storeName && (
          <p className="mt-1 text-sm text-red-600">{formErrors.storeName}</p>
        )}
      </div>

      <div>
        <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700 mb-2">
          Business Address
        </label>
        <textarea
          id="businessAddress"
          rows={3}
          value={formData.businessAddress}
          onChange={(e) => updateFormData({ businessAddress: e.target.value })}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
          placeholder="Enter your complete business address"
        />
        {formErrors.businessAddress && (
          <p className="mt-1 text-sm text-red-600">{formErrors.businessAddress}</p>
        )}
      </div>

      <div>
        <label htmlFor="businessRegNumber" className="block text-sm font-medium text-gray-700 mb-2">
          Business Registration Number{' '}
          <span className="text-xs text-gray-500">(optional but recommended)</span>
        </label>
        <input
          id="businessRegNumber"
          type="text"
          value={formData.businessRegNumber}
          onChange={(e) => updateFormData({ businessRegNumber: e.target.value })}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
          placeholder="RC-12345"
        />
        {formErrors.businessRegNumber && (
          <p className="mt-1 text-sm text-red-600">{formErrors.businessRegNumber}</p>
        )}
      </div>

      <div>
        <label htmlFor="taxIdNumber" className="block text-sm font-medium text-gray-700 mb-2">
          Tax Identification Number{' '}
          <span className="text-xs text-gray-500">(if applicable)</span>
        </label>
        <input
          id="taxIdNumber"
          type="text"
          value={formData.taxIdNumber}
          onChange={(e) => updateFormData({ taxIdNumber: e.target.value })}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
          placeholder="Enter your TIN if available"
        />
        {formErrors.taxIdNumber && (
          <p className="mt-1 text-sm text-red-600">{formErrors.taxIdNumber}</p>
        )}
      </div>

      <DocumentUpload
        label="ID Document"
        file={formData.idDocument}
        onFileChange={(file) => updateFormData({ idDocument: file })}
        accept="image/*,.pdf"
        required
      />
      {formErrors.idDocument && (
        <p className="mt-1 text-sm text-red-600">{formErrors.idDocument}</p>
      )}

      <DocumentUpload
        label="Business Registration Certificate"
        file={formData.businessRegCertificate}
        onFileChange={(file) => updateFormData({ businessRegCertificate: file })}
        accept="image/*,.pdf"
        required
      />
      {formErrors.businessRegCertificate && (
        <p className="mt-1 text-sm text-red-600">{formErrors.businessRegCertificate}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {renderStepIndicator()}
      
      {apiError && <ErrorMessage message={apiError} className="mb-4" />}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        <div className="flex space-x-4">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              disabled={isLoading}
              className="flex-1 py-3 px-4 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Back
            </button>
          )}
          
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
            >
              Continue
            </button>
          ) : (
            <LoadingButton
              type="submit"
              isLoading={isLoading}
              disabled={!formData.idDocument || !formData.businessRegCertificate}
              className="flex-1 py-3 px-4 bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {isLoading ? "Submitting..." : "Complete Registration"}
            </LoadingButton>
          )}
        </div>
      </form>

      {currentStep === 1 && (
        <>
          <button
            type="button"
            className="w-full py-3 px-4 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Register with Google</span>
          </button>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary font-medium">
              Sign in here
            </Link>
          </div>
        </>
      )}

      {currentStep === 3 && (
        <div className="text-center text-xs text-gray-500">
          By continuing, you agree to 9ja-cart's Conditions of Use and Privacy Notice.
        </div>
      )}
    </div>
  );
}