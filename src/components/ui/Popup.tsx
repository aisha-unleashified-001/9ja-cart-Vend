import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { setPopupInstance } from '@/lib/popup';

export type PopupType = 'success' | 'error' | 'info' | 'warning';

export interface PopupConfig {
  message: string;
  type?: PopupType;
  duration?: number;
}

interface PopupContextType {
  showPopup: (config: PopupConfig) => void;
  hidePopup: () => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export function usePopup() {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within PopupProvider');
  }
  return context;
}

interface PopupProviderProps {
  children: ReactNode;
}

export function PopupProvider({ children }: PopupProviderProps) {
  const [popup, setPopup] = useState<PopupConfig | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(0);
  const isHoveringRef = useRef<boolean>(false);

  const hidePopup = useCallback(() => {
    setIsVisible(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    startTimeRef.current = 0;
    durationRef.current = 0;
    isHoveringRef.current = false;
    // Wait for animation to complete before removing from DOM
    setTimeout(() => {
      setPopup(null);
    }, 300);
  }, []);

  const showPopup = useCallback((config: PopupConfig) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setPopup(config);
    setIsVisible(true);
    isHoveringRef.current = false;

    const duration = config.duration ?? 4000;
    durationRef.current = duration;
    if (duration > 0) {
      startTimeRef.current = Date.now();
      timeoutRef.current = setTimeout(() => {
        if (!isHoveringRef.current) {
          hidePopup();
        }
      }, duration);
    }
  }, [hidePopup]);

  const pauseAutoClose = useCallback(() => {
    if (timeoutRef.current && startTimeRef.current > 0 && durationRef.current > 0) {
      clearTimeout(timeoutRef.current);
      const elapsed = Date.now() - startTimeRef.current;
      durationRef.current = Math.max(0, durationRef.current - elapsed);
      startTimeRef.current = 0;
    }
    isHoveringRef.current = true;
  }, []);

  const resumeAutoClose = useCallback(() => {
    isHoveringRef.current = false;
    if (durationRef.current > 0 && popup) {
      startTimeRef.current = Date.now();
      timeoutRef.current = setTimeout(() => {
        hidePopup();
      }, durationRef.current);
    }
  }, [popup, hidePopup]);

  // Register popup instance globally so popup utility functions can use it
  useEffect(() => {
    setPopupInstance({ showPopup, hidePopup });
  }, [showPopup, hidePopup]);

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup }}>
      {children}
      {popup && (
        <PopupComponent
          message={popup.message}
          type={popup.type ?? 'info'}
          isVisible={isVisible}
          onClose={hidePopup}
          onMouseEnter={pauseAutoClose}
          onMouseLeave={resumeAutoClose}
          isHoveringRef={isHoveringRef}
        />
      )}
    </PopupContext.Provider>
  );
}

interface PopupComponentProps {
  message: string;
  type: PopupType;
  isVisible: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isHoveringRef: React.MutableRefObject<boolean>;
}

function PopupComponent({ message, type, isVisible, onClose, onMouseEnter, onMouseLeave, isHoveringRef }: PopupComponentProps) {
  const iconConfig = {
    success: { icon: CheckCircle2, bgColor: 'bg-[#10B981]', textColor: 'text-white' },
    error: { icon: AlertCircle, bgColor: 'bg-[#EF4444]', textColor: 'text-white' },
    info: { icon: Info, bgColor: 'bg-[#363636]', textColor: 'text-white' },
    warning: { icon: AlertTriangle, bgColor: 'bg-[#F59E0B]', textColor: 'text-white' },
  };

  const config = iconConfig[type];
  const Icon = config.icon;

  const handleBackdropClick = (_e: React.MouseEvent) => {
    // Only close if not hovering over the popup
    if (!isHoveringRef.current) {
      onClose();
    }
  };

  // Handle ESC key to close popup
  useEffect(() => {
    if (!isVisible) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-50 transition-opacity duration-300',
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={handleBackdropClick}
      />

      {/* Popup */}
      <div
        className={cn(
          'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
          'min-w-[320px] max-w-[500px] w-full mx-4',
          'bg-white rounded-lg shadow-2xl',
          'transform transition-all duration-300',
          isVisible
            ? 'scale-100 opacity-100'
            : 'scale-95 opacity-0 pointer-events-none'
        )}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 p-6">
          {/* Icon */}
          <div
            className={cn(
              'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
              config.bgColor
            )}
          >
            <Icon className={cn('w-6 h-6', config.textColor)} />
          </div>

          {/* Message */}
          <div className="flex-1 min-w-0">
            <p className="text-gray-900 text-base leading-relaxed">{message}</p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
    </>
  );
}

