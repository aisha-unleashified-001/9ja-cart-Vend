export interface LoginRequest {
  emailAddress: string;
  password: string;
}

export interface LoginResponse {
  vendorId: string;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  businessName: string;
  storeName: string;
  token: string;
}

export interface RegisterRequest {
  emailAddress: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  businessName: string;
  businessCategory?: string;
}

export interface User {
  vendorId: string;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  businessName: string;
  storeName: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}