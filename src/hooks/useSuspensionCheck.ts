import { useAuthStore } from '@/stores/authStore';
import { useMemo } from 'react';

/**
 * Hook to check if the current user's account is suspended
 * @returns {boolean} true if account is suspended (isSuspended === 1 or "1")
 */
export const useSuspensionCheck = () => {
  const user = useAuthStore((state) => state.user);
  
  const isSuspended = useMemo(() => {
    if (!user) return false;
    const suspended = user.isSuspended;
    // Check if isSuspended is 1, "1", or true
    return suspended === 1 || suspended === "1" || suspended === true;
  }, [user]);

  return {
    isSuspended,
  };
};


