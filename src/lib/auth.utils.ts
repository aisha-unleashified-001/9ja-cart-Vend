import { STORAGE_KEYS } from './constants';
import type { User } from '@/types';

export const tokenStorage = {
  get: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error getting token from storage:', error);
      return null;
    }
  },

  set: (token: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.error('Error setting token in storage:', error);
    }
  },

  remove: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error removing token from storage:', error);
    }
  },
};

export const userStorage = {
  get: (): User | null => {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data from storage:', error);
      return null;
    }
  },

  set: (user: User): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    } catch (error) {
      console.error('Error setting user data in storage:', error);
    }
  },

  remove: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
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
      const time = localStorage.getItem(STORAGE_KEYS.SESSION_START_TIME);
      return time ? parseInt(time, 10) : null;
    } catch (error) {
      console.error('Error getting session start time from storage:', error);
      return null;
    }
  },

  set: (timestamp: number): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSION_START_TIME, timestamp.toString());
    } catch (error) {
      console.error('Error setting session start time in storage:', error);
    }
  },

  remove: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSION_START_TIME);
    } catch (error) {
      console.error('Error removing session start time from storage:', error);
    }
  },
};

export const clearAuthData = (): void => {
  tokenStorage.remove();
  userStorage.remove();
  sessionStartTimeStorage.remove();
};