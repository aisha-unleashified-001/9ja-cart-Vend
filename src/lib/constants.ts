export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/vendor/login",
    REGISTER: "/vendor/register",
    LOGOUT: "/vendor/logout",
    REFRESH: "/vendor/refresh",
    FORGOT: "/vendor/forgot-password",
    RESET: "/vendor/reset-password",
  },
  REGISTRATION: {
    SIGNUP: "/vendor/signup", // Single endpoint for complete registration
    SEND_OTP: "/vendor/send-otp",
    VERIFY_OTP: "/vendor/verify-otp",
  },
  VENDOR: {
    PROFILE: "/vendor/profile",
    UPDATE_PROFILE: "/vendor/profile/edit",
    UPDATE_ACCOUNT_INFO: "/vendor/account-info", // TODO: Backend endpoint to be implemented
    UPLOAD_PROFILE_IMAGE: "/vendor/profile-image", // TODO: Backend endpoint to be implemented
    DASHBOARD_SUMMARY: "/vendor/dashboard-summary",
    CONTACT_ADMIN: "/ticket/contact-admin",
    GET_LOGO: "/vendor/get-logo",
    UPLOAD_LOGO: "/vendor/upload-logo",
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
  NOTIFICATIONS: {
    LIST: "/notification",
    MARK_READ: "/notification/:id/read",
  },
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_DATA: "user_data",
  REFRESH_TOKEN: "refresh_token",
  SESSION_START_TIME: "session_start_time",
  REMEMBER_ME_EMAIL: "remember_me_email",
} as const;

// Session timeout: 1 hour in milliseconds
export const SESSION_TIMEOUT_MS = 60 * 60 * 1000; // 1 hour

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
