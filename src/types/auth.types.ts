import type { CompleteRegistrationData } from "./registration.types";

export interface User {
  userId?: string;
  vendorId?: string;
  fullName: string;
  emailAddress: string;
  phoneNumber?: string;
  storeName?: string;
  businessName?: string;
  isSuspended?: string | number | boolean;
  avatarUrl?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  emailAddress: string;
  password: string;
}

export type RegisterRequest = CompleteRegistrationData;

export interface LoginResponse extends User {
  token: string;
  expiresIn?: number | string;
}





