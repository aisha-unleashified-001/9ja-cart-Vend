import { environment } from '@/config/environment';

export const apiConfig = {
  baseURL: environment.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': environment.basicAuthHeader,
  },
} as const;