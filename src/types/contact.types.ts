export interface ContactAdminPayload {
  name: string;
  storeName: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
}

export interface ContactAdminResponse {
  status: number;
  error: boolean;
  message: string;
  data?: {
    id?: string;
    [key: string]: unknown;
  };
}



