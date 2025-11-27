import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { authService } from '@/services/auth.service';
import { dashboardService } from '@/services/dashboard.service';
import type { User, LoginRequest, RegisterRequest } from '@/types';

const SUSPENDED_VALUES = new Set([true, 1, '1']);
const normalizeSuspensionFlag = (value: User['isSuspended']) =>
  SUSPENDED_VALUES.has(value ?? false);
const withNormalizedSuspension = (user: User): User => ({
  ...user,
  isSuspended: normalizeSuspensionFlag(user.isSuspended),
});

interface AuthStore {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  initialize: () => void;
  syncSuspensionStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          const { user, token } = await authService.login(credentials);
          const normalizedUser = withNormalizedSuspension(user);
          
          // Debug: Log the user object being set in the store
          console.log('🔍 AuthStore - Setting user in store:', user);
          console.log('🔍 AuthStore - isSuspended in user:', user?.isSuspended);
          
          set({
            user: normalizedUser,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          // Debug: Verify what was actually set
          const currentState = useAuthStore.getState();
          console.log('🔍 AuthStore - User after set:', currentState.user);
          console.log('🔍 AuthStore - isSuspended after set:', currentState.user?.isSuspended);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      register: async (userData: RegisterRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          const { user, token } = await authService.register(userData);
          const normalizedUser = withNormalizedSuspension(user);
          set({
            user: normalizedUser,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Registration failed';
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.warn('Logout error:', error);
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setUser: (user: User) => {
        set({ user: withNormalizedSuspension(user), isAuthenticated: true });
      },

      setToken: (token: string) => {
        set({ token });
      },

      initialize: () => {
        const token = authService.getCurrentToken();
        const storedUser = authService.getCurrentUser();
        const user = storedUser ? withNormalizedSuspension(storedUser) : null;
        
        if (token && user && authService.isAuthenticated()) {
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      syncSuspensionStatus: async () => {
        try {
          const { accountStatus, isSuspended } =
            await dashboardService.getDashboardSummary();

          const accountStatusSuspension =
            typeof accountStatus === 'string'
              ? ['suspended', 'deactivated'].includes(
                  accountStatus.toLowerCase()
                )
              : undefined;

          const derivedSuspension =
            typeof isSuspended === 'boolean'
              ? isSuspended
              : accountStatusSuspension;

          if (typeof derivedSuspension !== 'boolean') {
            return;
          }

          const currentUser = get().user;
          if (!currentUser) {
            return;
          }

          const currentSuspension = normalizeSuspensionFlag(
            currentUser.isSuspended
          );

          if (currentSuspension === derivedSuspension) {
            return;
          }

          set({
            user: {
              ...currentUser,
              isSuspended: derivedSuspension,
            },
          });
        } catch (error) {
          console.error('Failed to sync suspension status:', error);
        }
      },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
);