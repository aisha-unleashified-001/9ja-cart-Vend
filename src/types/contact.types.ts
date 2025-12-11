export interface ContactAdminPayload {
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



