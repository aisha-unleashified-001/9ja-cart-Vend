import { useAuthStore } from '@/stores/authStore';

// Hook for components that only need auth actions (no state)
// This prevents unnecessary re-renders
export const useAuthActions = () => {
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const logout = useAuthStore((state) => state.logout);
  const clearError = useAuthStore((state) => state.clearError);

  return {
    login,
    register,
    logout,
    clearError,
  };
};

// Hook for components that only need auth state (no actions)
export const useAuthState = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
  };
};