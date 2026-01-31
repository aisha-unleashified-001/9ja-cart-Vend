import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { popup } from '@/lib/popup';
import { Eye, EyeOff, Ban } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { LoadingButton } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export default function LoginPage() {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  // Add a small delay to prevent redirect loops if API calls fail immediately after login
  useEffect(() => {
    if (isAuthenticated) {
      // Small delay to allow any initial API calls to complete
      const redirectTimer = setTimeout(() => {
        // Double-check authentication is still valid before redirecting
        if (isAuthenticated) {
          const from = location.state?.from?.pathname || '/dashboard';
          navigate(from, { replace: true });
        }
      }, 500);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated, navigate, location]);

  // Clear errors when component mounts or form changes
  useEffect(() => {
    clearError();
  }, [clearError]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!emailAddress.trim()) {
      errors.emailAddress = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(emailAddress)) {
      errors.emailAddress = 'Please enter a valid email address';
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await login({ emailAddress, password });
      popup.success('Login successful!');
      
      // Navigation is handled by the useEffect above
    } catch (error) {
      // Error is handled by the auth context and displayed via the error state
      console.error('Login failed:', error);
    }
  };

  // const handleGoogleLogin = () => {
  //   // Handle Google login logic here
  //   popup.info('Google login coming soon!');
  // };

  return (
    <div className="space-y-8">
      <div className="text-left">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
      </div>

      {error && <ErrorMessage message={error} />}
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700 mb-2">
            Email address
          </label>
          <input
            id="emailAddress"
            name="emailAddress"
            type="email"
            value={emailAddress}
            onChange={(e) => {
              setEmailAddress(e.target.value);
              if (formErrors.emailAddress) {
                setFormErrors(prev => ({ ...prev, emailAddress: '' }));
              }
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="john.doe@example.com"
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
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (formErrors.password) {
                  setFormErrors(prev => ({ ...prev, password: '' }));
                }
              }}
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
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

        <LoadingButton
          type="submit"
          isLoading={isLoading}
          className="w-full py-3 px-4 border border-[#2ac12a] bg-[#8DEB6E] hover:bg-[#8DEB6E]/90 text-primary font-medium rounded-md transition-colors focus:outline-none"
        >
          {isLoading ? 'Signing in...' : 'Login'}
        </LoadingButton>

        <div className="relative group">
          {/* <button
            type="button"
            disabled
            onClick={handleGoogleLogin}
            className="w-full py-3 px-4 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Login with Google</span>
          </button> */}
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100/90 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <Ban className="w-6 h-6 text-red-500" />
          </div>
        </div>
      </form>

      <div className="text-center text-sm text-gray-600">
        Not registered yet?{' '}
        <Link to="/register" className="text-[#1E4700] hover:text-[#1E4700]/80 font-medium">
          Create an account
        </Link>
      </div>
    </div>
  );
}