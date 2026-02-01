import { useAuthStore } from '@/stores/authStore';

// Custom hook that provides the same interface as before
export const useAuth = () => {
  const store = useAuthStore();
  
  return {
    // State
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    
    // Actions
    login: store.login,
    register: store.register,
    logout: store.logout,
    clearError: store.clearError,
    forgotPassword: store.forgotPassword,
    resetPassword: store.resetPassword,
  };
};