export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/vendor/login",
    REGISTER: "/vendor/register",
    LOGOUT: "/vendor/logout",
    REFRESH: "/vendor/refresh",
  },
  REGISTRATION: {
    SIGNUP: "/vendor/signup", // Single endpoint for complete registration
  },
  VENDOR: {
    PROFILE: "/vendor/profile",
    UPDATE_PROFILE: "/vendor/profile",
    DASHBOARD_SUMMARY: "/vendor/dashboard-summary",
  },
  PRODUCTS: {
    LIST: "/product/vendor",
    CREATE: "/product/create",
    UPLOAD_IMAGES: "/product/upload-images",
    UPDATE: "/product/vendor",
    EDIT: "/product/edit",
    DELETE: "/product/delete",
    ARCHIVE: "/product/archive",
    RESTORE: "/product/restore",
    STATUS: "/product/status", // Activate product endpoint
    DETAIL: "/product/vendor",
    ITEM_INFO: "/product/vendor/item-info", // New detailed product endpoint
  },
  CATEGORIES: {
    LIST: "/product/category",
  },
  BUSINESS: {
    CATEGORIES: "/business/get-categories",
  },
  ORDERS: {
    LIST: "/vendor/orders",
    UPDATE: "/vendor/orders",
  },
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_DATA: "user_data",
  REFRESH_TOKEN: "refresh_token",
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
