import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { popup } from '@/lib/popup';
import { Eye, EyeOff, X, Ban } from 'lucide-react';
import { useBusinessCategories } from '@/hooks/useBusinessCategories';
import { registrationService, RegistrationError } from '@/services/registration.service';
import { LoadingButton } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { DocumentUpload } from '@/components/ui/DocumentUpload';
import { searchBanks, type Bank } from '@/lib/banks.data';
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
  accountNumber: string;
  bank: string;
  settlementBank: string;
  settlementBankName: string;
  
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
  accountNumber: '',
  bank: '',
  settlementBank: '',
  settlementBankName: '',
  businessRegNumber: '',
  storeName: '',
  businessAddress: '',
  taxIdNumber: '',
  idDocument: null,
  businessRegCertificate: null,
};

const businessRegPattern = /^RC-?\d{7}$/i;

const FIELD_STEP_MAP: Record<keyof RegistrationFieldErrors, number> = {
  emailAddress: 1,
  password: 1,
  confirmPassword: 1,
  fullName: 3,
  businessName: 3,
  businessCategory: 3,
  phoneNumber: 3,
  accountNumber: 3,
  bank: 3,
  settlementBank: 3,
  settlementBankName: 3,
  storeName: 4,
  businessAddress: 4,
  businessRegNumber: 4,
  taxIdNumber: 4,
  idDocument: 4,
  businessRegCertificate: 4,
};

const getFirstErrorStep = (errors: RegistrationFieldErrors): number | null => {
  const steps = Object.keys(errors).map((field) => FIELD_STEP_MAP[field as keyof RegistrationFieldErrors] ?? 4);
  return steps.length ? Math.min(...steps) : null;
};

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(2);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<RegistrationFieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isHoveringDialog, setIsHoveringDialog] = useState(false);
  const [bankSuggestions, setBankSuggestions] = useState<Bank[]>([]);
  const [showBankSuggestions, setShowBankSuggestions] = useState(false);
  const bankInputRef = useRef<HTMLInputElement>(null);
  const bankSuggestionsRef = useRef<HTMLDivElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);
  
  // OTP verification state
  const [otpCode, setOtpCode] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpVerificationId, setOtpVerificationId] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { categories, isLoading: categoriesLoading, fetchCategories } = useBusinessCategories();

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Scroll to top when step changes
  useEffect(() => {
    // Scroll window first
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Find and scroll the scrollable parent container (the left side div in AuthLayout)
    const scrollableParent = formContainerRef.current?.closest('.overflow-y-auto');
    if (scrollableParent) {
      // Small delay to ensure DOM is ready, then scroll to top
      setTimeout(() => {
        scrollableParent.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }
  }, [currentStep]);

  // Handle click outside bank suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        bankSuggestionsRef.current &&
        !bankSuggestionsRef.current.contains(event.target as Node) &&
        bankInputRef.current &&
        !bankInputRef.current.contains(event.target as Node)
      ) {
        setShowBankSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const updateFormData = (updates: Partial<FormData>) => {
    if (apiError) {
      setApiError(null);
    }

    const fieldsToClear = Object.keys(updates) as (keyof RegistrationFieldErrors)[];
    
    if (fieldsToClear.length) {
      setFormErrors(prev => {
        let hasChanges = false;
        const nextErrors = { ...prev };

        fieldsToClear.forEach((field) => {
          if (nextErrors[field]) {
            delete nextErrors[field];
            hasChanges = true;
          }
        });

        return hasChanges ? nextErrors : prev;
      });
    }

    setFormData(prev => ({ ...prev, ...updates }));
  };

  const validateAdvancedStep3Fields = (): RegistrationFieldErrors => {
    const errors: RegistrationFieldErrors = {};

    if (formData.businessRegNumber?.trim()) {
      const formattedValue = formData.businessRegNumber.trim().toUpperCase();
      if (!businessRegPattern.test(formattedValue)) {
        errors.businessRegNumber = 'Use RC1234567 or RC-1234567 (7 digits after RC).';
      }
    }

    if (formData.taxIdNumber?.trim()) {
      const rawValue = formData.taxIdNumber.trim();
      const digitsOnly = rawValue.replace(/-/g, '');
      const hasValidCharacters = /^[0-9-]+$/.test(rawValue);

      if (!hasValidCharacters || !/^\d+$/.test(digitsOnly)) {
        errors.taxIdNumber = 'Tax ID can only include digits and hyphens.';
      } else if (digitsOnly.length !== 10 && digitsOnly.length !== 12) {
        errors.taxIdNumber = 'Tax ID must contain exactly 10 or 12 digits.';
      }
    }

    return errors;
  };

  const validateStep = (step: number): boolean => {
    // Basic validation for UI flow - detailed validation handled by API
    if (step === 1) {
      // Check if all fields are filled
      if (!formData.emailAddress || !formData.password || !formData.confirmPassword) {
        popup.error('Please fill in all required fields');
        return false;
      }

      // Validate email format
      if (!/\S+@\S+\.\S+/.test(formData.emailAddress)) {
        setFormErrors({ emailAddress: 'Please enter a valid email address' });
        popup.error('Please enter a valid email address');
        return false;
      }

      // Validate password strength and requirements
      const passwordError = registrationService.validatePassword(formData.password);
      if (passwordError) {
        setFormErrors({ password: passwordError });
        popup.error(passwordError);
        return false;
      }

      // Check if passwords match
      if (formData.password !== formData.confirmPassword) {
        setFormErrors({ confirmPassword: 'Passwords do not match' });
        popup.error('Passwords do not match');
        return false;
      }

      // Clear any previous errors if validation passes
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.emailAddress;
        delete newErrors.password;
        delete newErrors.confirmPassword;
        return Object.keys(newErrors).length > 0 ? newErrors : {};
      });

      return true;
    }
    
    if (step === 2) {
      // OTP verification step - validation handled by verifyOTP
      return isOtpVerified;
    }
    
    if (step === 3) {
      const errors: RegistrationFieldErrors = {};
      
      // Check if all required fields are filled
      if (!formData.fullName || !formData.businessName || !formData.businessCategory || !formData.phoneNumber || !formData.accountNumber || !formData.bank || !formData.settlementBank) {
        popup.error('Please fill in all required fields');
        return false;
      }
      
      // Validate account number - must be exactly 10 characters
      if (formData.accountNumber) {
        const accountNumberTrimmed = formData.accountNumber.trim();
        if (accountNumberTrimmed.length !== 10) {
          errors.accountNumber = 'Account number must be exactly 10 digits';
          setFormErrors(prev => ({ ...prev, ...errors }));
          popup.error('Account number must be exactly 10 digits');
          return false;
        }
        // Check if it contains only digits
        if (!/^\d+$/.test(accountNumberTrimmed)) {
          errors.accountNumber = 'Account number must contain only digits';
          setFormErrors(prev => ({ ...prev, ...errors }));
          popup.error('Account number must contain only digits');
          return false;
        }
      }
      
      // Clear account number error if validation passes
      if (formErrors.accountNumber && !errors.accountNumber) {
        setFormErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.accountNumber;
          return newErrors;
        });
      }
      
      return true;
    }
    
    if (step === 4) {
      const isValid = !!(formData.storeName && formData.businessAddress && formData.taxIdNumber && formData.idDocument && formData.businessRegCertificate);
      if (!isValid) {
        popup.error('Please fill in all required fields and upload documents');
      }
      return isValid;
    }
    
    return true;
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    // On step 1, send OTP before proceeding to step 2
    if (currentStep === 1) {
      setIsLoading(true);
      setIsSendingOtp(true);
      setOtpError(null);
      try {
        // Check email availability first
        const { available, message } = await registrationService.checkEmailAvailability(formData.emailAddress);
        
        if (!available) {
          setFormErrors({ emailAddress: message || 'Email already exists' });
          popup.error(message || 'Email already exists');
          setIsLoading(false);
          setIsSendingOtp(false);
          return;
        }

        // Send OTP
        const sendOtpResult = await registrationService.sendOTP(formData.emailAddress);
        const verificationId =
          sendOtpResult?.verificationId ||
          sendOtpResult?.data?.verificationId ||
          sendOtpResult?.verification_id ||
          null;
        setOtpVerificationId(verificationId);
        popup.success('Verification code sent to your email!');
        setCurrentStep(2);
      } catch (error) {
        console.error('Send OTP failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to send verification code';
        setOtpError(errorMessage);
        popup.error(errorMessage);
      } finally {
        setIsLoading(false);
        setIsSendingOtp(false);
      }
      return;
    }

    // On step 2 (OTP), user must verify before continuing
    if (currentStep === 2) {
      if (!isOtpVerified) {
        popup.error('Please verify your email address first');
        return;
      }
      setCurrentStep(3);
      return;
    }

    // Continue to next step for steps 3 and 4
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
      popup.success(`Step ${currentStep} completed!`);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpCode.trim()) {
      setOtpError('Please enter the verification code');
      popup.error('Please enter the verification code');
      return;
    }

    if (otpCode.trim().length !== 5) {
      setOtpError('Verification code must be 5 digits');
      popup.error('Verification code must be 5 digits');
      return;
    }

    if (!otpVerificationId) {
      const msg = 'Verification session expired. Please resend the verification code.';
      setOtpError(msg);
      popup.error(msg);
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError(null);

    try {
      await registrationService.verifyOTP(formData.emailAddress, otpCode.trim(), otpVerificationId);
      setIsOtpVerified(true);
      popup.success('Email verified successfully!');
    } catch (error) {
      console.error('Verify OTP failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Invalid verification code';
      setOtpError(errorMessage);
      popup.error(errorMessage);
      setIsOtpVerified(false);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOTP = async () => {
    setIsSendingOtp(true);
    setOtpError(null);
    setOtpCode('');
    setIsOtpVerified(false);

    try {
      const sendOtpResult = await registrationService.sendOTP(formData.emailAddress);
      const verificationId =
        sendOtpResult?.verificationId ||
        sendOtpResult?.data?.verificationId ||
        sendOtpResult?.verification_id ||
        null;
      setOtpVerificationId(verificationId);
      popup.success('Verification code resent to your email!');
    } catch (error) {
      console.error('Resend OTP failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend verification code';
      setOtpError(errorMessage);
      popup.error(errorMessage);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      // Reset OTP state when going back from step 2
      if (currentStep === 2) {
        setOtpCode('');
        setIsOtpVerified(false);
        setOtpError(null);
        setOtpVerificationId(null);
      }
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

  const handleBankInputChange = (value: string) => {
    updateFormData({ bank: value });
    
    if (value.trim()) {
      const suggestions = searchBanks(value);
      setBankSuggestions(suggestions);
      setShowBankSuggestions(suggestions.length > 0);
    } else {
      setBankSuggestions([]);
      setShowBankSuggestions(false);
      updateFormData({ settlementBank: '', settlementBankName: '' });
    }
  };

  const handleBankSelect = (bank: Bank) => {
    updateFormData({
      bank: bank.name,
      settlementBank: bank.code,
      settlementBankName: bank.name,
    });
    setShowBankSuggestions(false);
    setBankSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all steps before final submission
    if (!validateStep(3)) {
      setCurrentStep(3);
      return;
    }
    
    if (!validateStep(4)) {
      popup.error('Please complete all required fields');
      return;
    }

    // Validate account number one more time before submission
    if (formData.accountNumber) {
      const accountNumberTrimmed = formData.accountNumber.trim();
      if (accountNumberTrimmed.length !== 10) {
        setFormErrors(prev => ({ ...prev, accountNumber: 'Account number must be exactly 10 digits' }));
        setCurrentStep(3);
        popup.error('Account number must be exactly 10 digits');
        return;
      }
      if (!/^\d+$/.test(accountNumberTrimmed)) {
        setFormErrors(prev => ({ ...prev, accountNumber: 'Account number must contain only digits' }));
        setCurrentStep(3);
        popup.error('Account number must contain only digits');
        return;
      }
    }

    // Validate required files
    if (!formData.idDocument || !formData.businessRegCertificate) {
      popup.error('Please upload both required documents');
      return;
    }

    const advancedErrors = validateAdvancedStep3Fields();
    if (Object.keys(advancedErrors).length > 0) {
      setFormErrors(prev => ({ ...prev, ...advancedErrors }));
      setCurrentStep(getFirstErrorStep(advancedErrors) ?? 3);
      popup.error('Please fix the highlighted fields before submitting.');
      return;
    }

    // Show confirmation dialog before submitting
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmDialog(false);
    setIsLoading(true);
    setApiError(null);
    setFormErrors({});

    // Validate required files (should already be validated, but TypeScript needs this)
    if (!formData.idDocument || !formData.businessRegCertificate) {
      popup.error('Please upload both required documents');
      setIsLoading(false);
      return;
    }

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
        accountNumber: formData.accountNumber.trim(),
        settlementBank: formData.settlementBank,
        settlementBankName: formData.settlementBankName,
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
      popup.success('Registration completed successfully!');
      navigate('/register/success');
    } catch (error) {
      console.error('❌ Registration failed:', error);
      
      if (error instanceof RegistrationError) {
        // Handle field-specific validation errors
        setFormErrors(error.fieldErrors);
        setApiError(error.message);
        const errorStep = getFirstErrorStep(error.fieldErrors);
        if (errorStep) {
          setCurrentStep(errorStep);
        } else {
          // Default to step 4 if no specific error step found
          setCurrentStep(4);
        }
        
        // Show specific error message
        const errorCount = Object.keys(error.fieldErrors).length;
        if (errorCount > 0) {
          popup.error(`Please fix ${errorCount} error${errorCount > 1 ? 's' : ''} in the form`);
        } else {
          popup.error(error.message);
        }
      } else {
        // Handle general errors
        const errorMessage = error instanceof Error ? error.message : 'Registration failed';
        setApiError(errorMessage);
        popup.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelDialog = () => {
    setShowConfirmDialog(false);
    setCurrentStep(3);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep
                ? 'bg-[#8DEB6E] text-primary'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step}
          </div>
          {step < 4 && (
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
          className={`w-full px-4 py-3 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 disabled:opacity-50 ${
            formErrors.emailAddress
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary focus:border-transparent'
          }`}
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
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => updateFormData({ password: e.target.value })}
            disabled={isLoading}
            className={`w-full px-4 py-3 pr-10 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 disabled:opacity-50 ${
              formErrors.password
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-primary focus:border-transparent'
            }`}
            placeholder="Create a password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {formErrors.password && (
          <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => updateFormData({ confirmPassword: e.target.value })}
            disabled={isLoading}
            className={`w-full px-4 py-3 pr-10 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 disabled:opacity-50 ${
              formErrors.confirmPassword
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-primary focus:border-transparent'
            }`}
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {formErrors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Email Verification</h2>
        <p className="text-gray-600">We've sent a verification code to your email address.</p>
      </div>

      {/* Email Information Box */}
      <div className="bg-green-100 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700">Check your email</span>
        </div>
        <p className="text-sm text-gray-700">
          We sent a 5-digit verification code to <span className="font-semibold">{formData.emailAddress}</span>
        </p>
      </div>

      {/* OTP Input */}
      <div>
        <label htmlFor="otpCode" className="block text-sm font-medium text-gray-700 mb-2">
          Verification Code
        </label>
        <input
          id="otpCode"
          type="text"
          value={otpCode}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 5);
            setOtpCode(value);
            if (otpError) setOtpError(null);
          }}
          disabled={isVerifyingOtp || isOtpVerified}
          maxLength={5}
          className={`w-full px-4 py-3 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 disabled:opacity-50 text-center text-2xl tracking-widest font-mono ${
            otpError
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary focus:border-transparent'
          }`}
          placeholder="00000"
        />
        {otpError && (
          <p className="mt-1 text-sm text-red-600">{otpError}</p>
        )}
        {isOtpVerified && (
          <p className="mt-1 text-sm text-green-600">Email verified successfully!</p>
        )}
      </div>

      {/* Verify Email Address Button */}
      <LoadingButton
        type="button"
        onClick={handleVerifyOTP}
        isLoading={isVerifyingOtp}
        disabled={isOtpVerified || !otpCode.trim() || otpCode.trim().length !== 5}
        className="w-full py-3 px-4 bg-green-700 hover:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        {isVerifyingOtp ? 'Verifying...' : isOtpVerified ? 'Email Verified' : 'Verify Email Address'}
      </LoadingButton>

      {/* Resend Code Link */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Didn't receive the email?{' '}
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={isSendingOtp}
            className="text-[#1E4700] hover:text-[#1E4700]/80 font-medium focus:outline-none disabled:opacity-50"
          >
            {isSendingOtp ? 'Sending...' : 'Resend verification code'}
          </button>
        </p>
      </div>
    </div>
  );

  const renderStep3 = () => (
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
          className={`w-full px-4 py-3 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 disabled:opacity-50 ${
            formErrors.fullName
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary focus:border-transparent'
          }`}
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
          className={`w-full px-4 py-3 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 disabled:opacity-50 ${
            formErrors.phoneNumber
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary focus:border-transparent'
          }`}
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
          className={`w-full px-4 py-3 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 disabled:opacity-50 ${
            formErrors.businessName
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary focus:border-transparent'
          }`}
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
            className={`w-full px-4 py-3 border rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 disabled:opacity-50 ${
              formErrors.businessCategory
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-primary focus:border-transparent'
            }`}
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

      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
        <p className="text-sm text-gray-600 mb-4">Please provide your bank account details. This information cannot be edited after registration.</p>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Account Number
            </label>
            <input
              id="accountNumber"
              type="text"
              value={formData.accountNumber}
              onChange={(e) => {
                // Only allow digits and limit to 10 characters
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                updateFormData({ accountNumber: value });
                
                // Real-time validation feedback
                if (value && value.length !== 10) {
                  setFormErrors(prev => ({ ...prev, accountNumber: 'Account number must be exactly 10 digits' }));
                } else if (value && value.length === 10) {
                  // Clear error if valid
                  setFormErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.accountNumber;
                    return newErrors;
                  });
                }
              }}
              disabled={isLoading}
              maxLength={10}
              className={`w-full px-4 py-3 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 disabled:opacity-50 ${
                formErrors.accountNumber
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-primary focus:border-transparent'
              }`}
              placeholder="Enter 10-digit account number"
            />
            {formErrors.accountNumber && (
              <p className="mt-1 text-sm text-red-600">{formErrors.accountNumber}</p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="bank" className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name
            </label>
            <input
              ref={bankInputRef}
              id="bank"
              type="text"
              value={formData.bank}
              onChange={(e) => handleBankInputChange(e.target.value)}
              onFocus={() => {
                if (bankSuggestions.length > 0) {
                  setShowBankSuggestions(true);
                }
              }}
              disabled={isLoading}
              className={`w-full px-4 py-3 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 disabled:opacity-50 ${
                formErrors.bank || formErrors.settlementBankName
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-primary focus:border-transparent'
              }`}
              placeholder="Type to search bank name"
            />
            {(formErrors.bank || formErrors.settlementBankName) && (
              <p className="mt-1 text-sm text-red-600">{formErrors.bank || formErrors.settlementBankName}</p>
            )}
            
            {showBankSuggestions && bankSuggestions.length > 0 && (
              <div
                ref={bankSuggestionsRef}
                className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
              >
                {bankSuggestions.map((bank) => (
                  <button
                    key={bank.code}
                    type="button"
                    onClick={() => handleBankSelect(bank)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  >
                    <div className="font-medium text-gray-900">{bank.name}</div>
                    <div className="text-xs text-gray-500">Code: {bank.code}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="settlementBank" className="block text-sm font-medium text-gray-700 mb-2">
              Settlement Bank
            </label>
            <input
              id="settlementBank"
              type="text"
              value={formData.settlementBank}
              onChange={() => {}} // Read-only
              disabled={true}
              className="w-full px-4 py-3 border rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
              placeholder="Will be prefilled when you select a bank"
            />
            {formErrors.settlementBank && (
              <p className="mt-1 text-sm text-red-600">{formErrors.settlementBank}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              This field is automatically filled when you select a bank name above
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
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
          className={`w-full px-4 py-3 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 disabled:opacity-50 ${
            formErrors.storeName
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary focus:border-transparent'
          }`}
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
          className={`w-full px-4 py-3 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 disabled:opacity-50 ${
            formErrors.businessAddress
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary focus:border-transparent'
          }`}
          placeholder="Enter your complete business address"
        />
        {formErrors.businessAddress && (
          <p className="mt-1 text-sm text-red-600">{formErrors.businessAddress}</p>
        )}
      </div>

      <div>
        <label htmlFor="taxIdNumber" className="block text-sm font-medium text-gray-700 mb-2">
          Tax Identification Number <span className="text-red-500">*</span>
        </label>
        <input
          id="taxIdNumber"
          type="text"
          value={formData.taxIdNumber}
          onChange={(e) => updateFormData({ taxIdNumber: e.target.value })}
          disabled={isLoading}
          className={`w-full px-4 py-3 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 disabled:opacity-50 ${
            formErrors.taxIdNumber
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary focus:border-transparent'
          }`}
          placeholder="Enter your TIN"
        />
        {formErrors.taxIdNumber && (
          <p className="mt-1 text-sm text-red-600">{formErrors.taxIdNumber}</p>
        )}
      </div>

      <div>
        <label htmlFor="businessRegNumber" className="block text-sm font-medium text-gray-700 mb-2">
          Business Registration Number{' '}
          <span className="text-xs text-gray-500">(optional)</span>
        </label>
        <input
          id="businessRegNumber"
          type="text"
          value={formData.businessRegNumber}
          onChange={(e) => updateFormData({ businessRegNumber: e.target.value })}
          disabled={isLoading}
          className={`w-full px-4 py-3 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 disabled:opacity-50 ${
            formErrors.businessRegNumber
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary focus:border-transparent'
          }`}
          placeholder="RC-12345"
        />
        {formErrors.businessRegNumber && (
          <p className="mt-1 text-sm text-red-600">{formErrors.businessRegNumber}</p>
        )}
      </div>

      <DocumentUpload
        label="ID Document"
        file={formData.idDocument}
        onFileChange={(file) => updateFormData({ idDocument: file })}
        accept="image/*,.pdf"
        required
        formError={formErrors.idDocument}
      />

      <DocumentUpload
        label="Business Registration Certificate"
        file={formData.businessRegCertificate}
        onFileChange={(file) => updateFormData({ businessRegCertificate: file })}
        accept="image/*,.pdf"
        required
        formError={formErrors.businessRegCertificate}
      />
    </div>
  );

  return (
    <div ref={formContainerRef} className="space-y-8">
      {renderStepIndicator()}
      
      {apiError && <ErrorMessage message={apiError} className="mb-4" />}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}

        <div className="flex space-x-4">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              disabled={isLoading}
              className="flex-1 py-3 px-4 border border-[#2ac12a] bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Back
            </button>
          )}
          
          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={isLoading || isSendingOtp || (currentStep === 2 && !isOtpVerified)}
              className="flex-1 py-3 px-4 bg-[#8DEB6E] hover:bg-[#8DEB6E]/90 text-primary font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
            >
              Continue
            </button>
          ) : (
            <LoadingButton
              type="submit"
              isLoading={isLoading}
              disabled={!formData.idDocument || !formData.businessRegCertificate}
              className="flex-1 py-3 px-4 bg-[#8DEB6E] hover:bg-[#8DEB6E]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-primary font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {isLoading ? "Submitting..." : "Complete Registration"}
            </LoadingButton>
          )}
        </div>
      </form>

      {currentStep === 1 && (
        <>
          <div className="relative group">
            {/* <button
              type="button"
              disabled
              className="w-full py-3 px-4 border border-[#2ac12a] bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
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
            </button> */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100/90 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <Ban className="w-6 h-6 text-red-500" />
            </div>
          </div>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-[#1E4700] hover:text-[#1E4700]/80 font-medium">
              Sign in here
            </Link>
          </div>
        </>
      )}

      {currentStep === 4 && (
        <div className="text-center text-xs text-gray-500">
          By continuing, you agree to 9ja-cart's Conditions of Use and Privacy Notice.
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            if (!isHoveringDialog && e.target === e.currentTarget) {
              handleCancelDialog();
            }
          }}
        >
          <div 
            className="bg-white rounded-lg w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200 relative"
            onMouseEnter={() => setIsHoveringDialog(true)}
            onMouseLeave={() => setIsHoveringDialog(false)}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleCancelDialog}
              disabled={isLoading}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pr-8">
              Confirm Account Information
            </h2>
            <p className="text-gray-700 mb-4">
              Kindly confirm that the account details provided is correct. You will not be able to edit the Account information later.
            </p>
            
            <div className="bg-gray-50 rounded-md p-4 mb-6 space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Account Number</label>
                <p className="text-base font-semibold text-gray-900 mt-1">
                  {formData.accountNumber || 'Not provided'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Bank Name</label>
                <p className="text-base font-semibold text-gray-900 mt-1">
                  {formData.settlementBankName || formData.bank || 'Not provided'}
                </p>
              </div>
              {formData.settlementBank && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Settlement Bank Code</label>
                  <p className="text-base font-semibold text-gray-900 mt-1">
                    {formData.settlementBank}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancelDialog}
                disabled={isLoading}
                className="px-4 py-2 border border-[#2ac12a] rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={isLoading}
                className="px-4 py-2 bg-[#8DEB6E] text-primary rounded-md hover:bg-[#8DEB6E]/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Submitting...' : 'Yes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}