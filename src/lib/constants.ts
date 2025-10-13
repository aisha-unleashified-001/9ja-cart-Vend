export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/vendor/login',
    REGISTER: '/vendor/register',
    LOGOUT: '/vendor/logout',
    REFRESH: '/vendor/refresh',
  },
  REGISTRATION: {
    SIGNUP: '/vendor/signup',
    BASIC_INFO: '/vendor/business/basic-info',
    VERIFICATION: '/vendor/business/verification',
  },
  VENDOR: {
    PROFILE: '/vendor/profile',
    UPDATE_PROFILE: '/vendor/profile',
  },
  PRODUCTS: {
    LIST: '/product/vendor',
    CREATE: '/product',
    UPDATE: '/product/vendor',
    DELETE: '/product/vendor',
    DETAIL: '/product/vendor',
  },
  CATEGORIES: {
    LIST: '/product/category',
  },
  ORDERS: {
    LIST: '/vendor/orders',
    UPDATE: '/vendor/orders',
  },
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  REFRESH_TOKEN: 'refresh_token',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;