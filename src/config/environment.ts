interface Environment {
  apiBaseUrl: string;
  basicAuthUsername: string;
  basicAuthPassword: string;
  basicAuthHeader: string;
}

const validateEnvVar = (name: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
};

const createBasicAuthHeader = (username: string, password: string): string => {
  const credentials = `${username}:${password}`;
  const encoded = btoa(credentials);
  return `Basic ${encoded}`;
};

export const environment: Environment = {
  apiBaseUrl: validateEnvVar('VITE_API_BASE_URL', import.meta.env.VITE_API_BASE_URL),
  basicAuthUsername: validateEnvVar('VITE_API_BASIC_AUTH_USERNAME', import.meta.env.VITE_API_BASIC_AUTH_USERNAME),
  basicAuthPassword: validateEnvVar('VITE_API_BASIC_AUTH_PASSWORD', import.meta.env.VITE_API_BASIC_AUTH_PASSWORD),
  basicAuthHeader: createBasicAuthHeader(
    validateEnvVar('VITE_API_BASIC_AUTH_USERNAME', import.meta.env.VITE_API_BASIC_AUTH_USERNAME),
    validateEnvVar('VITE_API_BASIC_AUTH_PASSWORD', import.meta.env.VITE_API_BASIC_AUTH_PASSWORD)
  ),
};