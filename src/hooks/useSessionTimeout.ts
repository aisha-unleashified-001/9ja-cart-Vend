import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { sessionStartTimeStorage } from '@/lib/auth.utils';
import { SESSION_TIMEOUT_MS } from '@/lib/constants';

/**
 * Hook to check session timeout and automatically logout user after 1 hour
 * This runs silently without showing any messages
 */
export function useSessionTimeout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const checkCountRef = useRef(0);
  const isLoggingOutRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      checkCountRef.current = 0;
      isLoggingOutRef.current = false;
      return;
    }

    // Prevent multiple simultaneous logout attempts
    if (isLoggingOutRef.current) {
      return;
    }

    // Skip if we're already on the login page
    if (location.pathname === '/login') {
      return;
    }

    const checkSessionTimeout = async () => {
      const sessionStartTime = sessionStartTimeStorage.get();
      
      // If no session start time exists, wait a few checks before logging out
      // This gives time for the session start time to be set after login
      if (!sessionStartTime) {
        checkCountRef.current++;
        // Wait for up to 3 checks (90 seconds) before logging out
        // This handles cases where session start time might be set slightly after login
        if (checkCountRef.current >= 3) {
          console.warn('⚠️ No session start time found after multiple checks, logging out for safety');
          isLoggingOutRef.current = true;
          await logout();
          navigate('/login', { replace: true });
        }
        return;
      }

      // Reset check count once we have a session start time
      checkCountRef.current = 0;

      const currentTime = Date.now();
      const elapsedTime = currentTime - sessionStartTime;

      // Debug logging (can be removed later)
      const remainingTime = SESSION_TIMEOUT_MS - elapsedTime;
      const remainingMinutes = Math.floor(remainingTime / 60000);
      
      // Only log every 5 minutes to avoid console spam
      if (remainingMinutes % 5 === 0 && remainingMinutes > 0 && remainingMinutes < 60) {
        console.log(`⏰ Session timeout check: ${remainingMinutes} minutes remaining`);
      }

      // If 1 hour has passed, logout silently
      if (elapsedTime >= SESSION_TIMEOUT_MS) {
        console.log('⏰ Session expired after 1 hour, logging out...');
        isLoggingOutRef.current = true;
        await logout();
        navigate('/login', { replace: true });
      }
    };

    // Add a delay on first check to ensure session start time is set after login
    const initialDelay = checkCountRef.current === 0 ? 2000 : 0;
    
    const timeoutId = setTimeout(() => {
      checkSessionTimeout();
    }, initialDelay);

    // Check every 30 seconds to catch timeout
    const interval = setInterval(checkSessionTimeout, 30000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, [isAuthenticated, logout, navigate, location.pathname]);
}

