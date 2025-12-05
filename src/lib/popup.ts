import type { PopupConfig, PopupType } from '@/components/ui/Popup';

// Global popup instance - will be set by PopupProvider
let globalPopupInstance: {
  showPopup: (config: PopupConfig) => void;
  hidePopup: () => void;
} | null = null;

export function setPopupInstance(instance: {
  showPopup: (config: PopupConfig) => void;
  hidePopup: () => void;
}) {
  globalPopupInstance = instance;
}

function showPopup(config: PopupConfig) {
  if (!globalPopupInstance) {
    console.warn('Popup instance not initialized. Make sure PopupProvider is mounted.');
    return;
  }
  globalPopupInstance.showPopup(config);
}


// Create a callable object with methods (like toast API)
function createPopup() {
  const popupFn = (message: string, duration?: number) => {
    showPopup({ message, type: 'info', duration });
  };

  popupFn.success = (message: string, duration?: number) => {
    showPopup({ message, type: 'success', duration });
  };

  popupFn.error = (message: string, duration?: number) => {
    showPopup({ message, type: 'error', duration });
  };

  popupFn.info = (message: string, duration?: number) => {
    showPopup({ message, type: 'info', duration });
  };

  popupFn.warning = (message: string, duration?: number) => {
    showPopup({ message, type: 'warning', duration });
  };

  return popupFn;
}

// Toast-like API for easy migration
export const popup = createPopup();

// Export types for use in other files
export type { PopupConfig, PopupType };

