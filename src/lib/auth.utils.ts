import { STORAGE_KEYS } from './constants';
import type { User } from '@/types';

/** Returns the storage to use for auth data. Defaults to localStorage when flag is unset (backwards compat). */
function getAuthStorage(): Storage {
  try {
    const flag = localStorage.getItem(STORAGE_KEYS.AUTH_REMEMBER_ME);
    return flag === 'false' ? sessionStorage : localStorage;
  } catch {
    return localStorage;
  }
}

/** Set whether to persist auth across browser sessions. Call before token/user set on login. */
export function setRememberMe(remember: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.AUTH_REMEMBER_ME, remember ? 'true' : 'false');
  } catch (error) {
    console.error('Error setting remember me:', error);
  }
}

function clearAuthFromStorage(storage: Storage): void {
  try {
    storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    storage.removeItem(STORAGE_KEYS.USER_DATA);
    storage.removeItem(STORAGE_KEYS.SESSION_START_TIME);
  } catch {
    // ignore
  }
}

export const tokenStorage = {
  get: (): string | null => {
    try {
      return getAuthStorage().getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error getting token from storage:', error);
      return null;
    }
  },

  set: (token: string): void => {
    try {
      const storage = getAuthStorage();
      clearAuthFromStorage(storage === localStorage ? sessionStorage : localStorage);
      storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.error('Error setting token in storage:', error);
    }
  },

  remove: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error removing token from storage:', error);
    }
  },
};

export const userStorage = {
  get: (): User | null => {
    try {
      const userData = getAuthStorage().getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data from storage:', error);
      return null;
    }
  },

  set: (user: User): void => {
    try {
      const storage = getAuthStorage();
      clearAuthFromStorage(storage === localStorage ? sessionStorage : localStorage);
      storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    } catch (error) {
      console.error('Error setting user data in storage:', error);
    }
  },

  remove: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      sessionStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Error removing user data from storage:', error);
    }
  },
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

export const sessionStartTimeStorage = {
  get: (): number | null => {
    try {
      const time = getAuthStorage().getItem(STORAGE_KEYS.SESSION_START_TIME);
      return time ? parseInt(time, 10) : null;
    } catch (error) {
      console.error('Error getting session start time from storage:', error);
      return null;
    }
  },

  set: (timestamp: number): void => {
    try {
      getAuthStorage().setItem(STORAGE_KEYS.SESSION_START_TIME, timestamp.toString());
    } catch (error) {
      console.error('Error setting session start time in storage:', error);
    }
  },

  remove: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSION_START_TIME);
      sessionStorage.removeItem(STORAGE_KEYS.SESSION_START_TIME);
    } catch (error) {
      console.error('Error removing session start time from storage:', error);
    }
  },
};

export const clearAuthData = (): void => {
  tokenStorage.remove();
  userStorage.remove();
  sessionStartTimeStorage.remove();
  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH_REMEMBER_ME);
  } catch {
    // ignore
  }
};