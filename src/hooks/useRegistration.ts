import { useRegistrationStore } from '@/stores/registrationStore';

// Main registration hook with full interface
export const useRegistration = () => {
  const store = useRegistrationStore();
  
  return {
    // State
    currentStep: store.currentStep,
    formData: store.formData,
    isLoading: store.isLoading,
    error: store.error,
    completedSteps: store.completedSteps,
    
    // Actions
    setFormData: store.setFormData,
    setCurrentStep: store.setCurrentStep,
    markStepCompleted: store.markStepCompleted,
    clearError: store.clearError,
    reset: store.reset,
    
    // API Actions
    submitStep1: store.submitStep1,
    submitStep2: store.submitStep2,
    submitStep3: store.submitStep3,
    
    // Validation
    validateCurrentStep: store.validateCurrentStep,
    canProceedToStep: store.canProceedToStep,
  };
};

// Hook for components that only need registration state
export const useRegistrationState = () => {
  const currentStep = useRegistrationStore((state) => state.currentStep);
  const formData = useRegistrationStore((state) => state.formData);
  const isLoading = useRegistrationStore((state) => state.isLoading);
  const error = useRegistrationStore((state) => state.error);
  const completedSteps = useRegistrationStore((state) => state.completedSteps);

  return {
    currentStep,
    formData,
    isLoading,
    error,
    completedSteps,
  };
};

// Hook for components that only need registration actions
export const useRegistrationActions = () => {
  const setFormData = useRegistrationStore((state) => state.setFormData);
  const setCurrentStep = useRegistrationStore((state) => state.setCurrentStep);
  const markStepCompleted = useRegistrationStore((state) => state.markStepCompleted);
  const clearError = useRegistrationStore((state) => state.clearError);
  const reset = useRegistrationStore((state) => state.reset);
  const submitStep1 = useRegistrationStore((state) => state.submitStep1);
  const submitStep2 = useRegistrationStore((state) => state.submitStep2);
  const submitStep3 = useRegistrationStore((state) => state.submitStep3);

  return {
    setFormData,
    setCurrentStep,
    markStepCompleted,
    clearError,
    reset,
    submitStep1,
    submitStep2,
    submitStep3,
  };
};