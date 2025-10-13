import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { registrationService } from '@/services/registration.service';
import { getCategoryIdByName } from '@/lib/registration.utils';
import type { 
  RegistrationState, 
  RegistrationFormData, 
  RegistrationStep1Data,
  RegistrationStep2Data,
  RegistrationStep3Data,
  Category
} from '@/types';

interface RegistrationStore extends RegistrationState {
  // Actions
  setFormData: (data: Partial<RegistrationFormData>) => void;
  setCurrentStep: (step: number) => void;
  markStepCompleted: (step: number) => void;
  clearError: () => void;
  reset: () => void;
  
  // API Actions
  submitStep1: (data: RegistrationStep1Data) => Promise<void>;
  submitStep2: (data: Omit<RegistrationStep2Data, 'businessCategory'> & { businessCategory: string }, categories: Category[]) => Promise<void>;
  submitStep3: (data: RegistrationStep3Data) => Promise<void>;
  
  // Validation
  validateCurrentStep: () => Record<string, string>;
  canProceedToStep: (step: number) => boolean;
}

const initialState: RegistrationState = {
  currentStep: 1,
  formData: {},
  isLoading: false,
  error: null,
  completedSteps: [],
};

export const useRegistrationStore = create<RegistrationStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setFormData: (data: Partial<RegistrationFormData>) => {
          set((state) => ({
            formData: { ...state.formData, ...data },
          }));
        },

        setCurrentStep: (step: number) => {
          set({ currentStep: step });
        },

        markStepCompleted: (step: number) => {
          set((state) => ({
            completedSteps: [...new Set([...state.completedSteps, step])],
          }));
        },

        clearError: () => {
          set({ error: null });
        },

        reset: () => {
          set(initialState);
        },

        submitStep1: async (data: RegistrationStep1Data) => {
          set({ isLoading: true, error: null });
          
          try {
            // Validate data
            const errors = registrationService.validateStep1(data);
            if (Object.keys(errors).length > 0) {
              throw new Error(Object.values(errors)[0]);
            }

            // Submit to API
            await registrationService.signup(data);
            
            // Update store
            const { confirmPassword, ...formData } = data;
            set((state) => ({
              formData: { ...state.formData, ...formData },
              completedSteps: [...new Set([...state.completedSteps, 1])],
              currentStep: 2,
              isLoading: false,
              error: null,
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Registration failed';
            set({
              isLoading: false,
              error: errorMessage,
            });
            throw error;
          }
        },

        submitStep2: async (
          data: Omit<RegistrationStep2Data, 'businessCategory'> & { businessCategory: string }, 
          categories: Category[]
        ) => {
          set({ isLoading: true, error: null });
          
          try {
            // Get category ID from name
            const businessCategoryId = getCategoryIdByName(data.businessCategory, categories);
            if (!businessCategoryId) {
              throw new Error('Invalid business category selected');
            }

            const apiData: RegistrationStep2Data = {
              ...data,
              businessCategory: businessCategoryId,
            };

            // Validate data
            const errors = registrationService.validateStep2(apiData);
            if (Object.keys(errors).length > 0) {
              throw new Error(Object.values(errors)[0]);
            }

            // Submit to API
            await registrationService.submitBasicInfo(apiData);
            
            // Update store
            set((state) => ({
              formData: { 
                ...state.formData, 
                ...data,
                businessCategoryId 
              },
              completedSteps: [...new Set([...state.completedSteps, 2])],
              currentStep: 3,
              isLoading: false,
              error: null,
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to submit basic information';
            set({
              isLoading: false,
              error: errorMessage,
            });
            throw error;
          }
        },

        submitStep3: async (data: RegistrationStep3Data) => {
          set({ isLoading: true, error: null });
          
          try {
            // Validate data
            const errors = registrationService.validateStep3(data);
            if (Object.keys(errors).length > 0) {
              throw new Error(Object.values(errors)[0]);
            }

            // Submit to API
            await registrationService.submitVerification(data);
            
            // Update store
            set((state) => ({
              formData: { ...state.formData, ...data },
              completedSteps: [...new Set([...state.completedSteps, 3])],
              currentStep: 4, // Success step
              isLoading: false,
              error: null,
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to submit verification';
            set({
              isLoading: false,
              error: errorMessage,
            });
            throw error;
          }
        },

        validateCurrentStep: () => {
          const state = get();
          const { currentStep, formData } = state;

          switch (currentStep) {
            case 1:
              return registrationService.validateStep1({
                emailAddress: formData.emailAddress || '',
                password: formData.password || '',
                confirmPassword: formData.confirmPassword || '',
              });
            
            case 2:
              return registrationService.validateStep2({
                emailAddress: formData.emailAddress || '',
                fullName: formData.fullName || '',
                businessName: formData.businessName || '',
                businessCategory: formData.businessCategoryId || 0,
                phoneNumber: formData.phoneNumber || '',
              });
            
            case 3:
              return registrationService.validateStep3({
                emailAddress: formData.emailAddress || '',
                businessRegNumber: formData.businessRegNumber || '',
                storeName: formData.storeName || '',
                businessAddress: formData.businessAddress || '',
                taxIdNumber: formData.taxIdNumber || '',
                idDocument: formData.idDocument || null as any,
                businessRegCertificate: formData.businessRegCertificate || null as any,
              });
            
            default:
              return {};
          }
        },

        canProceedToStep: (step: number) => {
          const state = get();
          return state.completedSteps.includes(step - 1) || step === 1;
        },
      }),
      {
        name: 'registration-storage',
        partialize: (state) => ({
          currentStep: state.currentStep,
          formData: {
            // Only persist non-sensitive data
            emailAddress: state.formData.emailAddress,
            fullName: state.formData.fullName,
            businessName: state.formData.businessName,
            businessCategory: state.formData.businessCategory,
            businessCategoryId: state.formData.businessCategoryId,
            phoneNumber: state.formData.phoneNumber,
            businessRegNumber: state.formData.businessRegNumber,
            storeName: state.formData.storeName,
            businessAddress: state.formData.businessAddress,
            taxIdNumber: state.formData.taxIdNumber,
            // Don't persist password or files
          },
          completedSteps: state.completedSteps,
        }),
      }
    ),
    {
      name: 'registration-store',
    }
  )
);