/**
 * API Configuration
 *
 * Set your backend API base URL here.
 * Example: https://api.example.com
 *
 * You can also use environment variables:
 * - REACT_APP_API_URL (recommended for production)
 * - VITE_API_URL (for Vite projects)
 */

/**
 * Get the appropriate API base URL based on environment
 * Production: https://script-backend-ojlh.onrender.com
 * Development: http://localhost:5000
 */
export const API_BASE_URL = (() => {
  // Check Vite environment variables first (for Vite projects)
  if (import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Check Node/process environment variables
  if (
    typeof process !== "undefined" &&
    process.env &&
    (process.env.REACT_APP_API_URL || process.env.VITE_API_URL)
  ) {
    return process.env.REACT_APP_API_URL || process.env.VITE_API_URL;
  }

  // Default: Use production URL
  return "https://script-backend-ojlh.onrender.com";
})();

export const API_ENDPOINTS = {
  // Health Check
  HEALTH: "/api/health",
  HEALTH_DB: "/api/health/db",

  // Authentication
  AUTH_REGISTER: "/api/auth/register",
  AUTH_LOGIN: "/api/auth/login",
  AUTH_LOGOUT: "/api/auth/logout",
  AUTH_ME: "/api/auth/me",
  AUTH_UPDATE_PASSWORD: "/api/auth/update-password",

  // Business
  BUSINESS_PROFILE: "/api/business/profile",
  BUSINESS_PREFERENCES: "/api/business/preferences",

  // Products/Inventory
  PRODUCTS_LIST: "/api/products",
  PRODUCTS_CREATE: "/api/products",
  PRODUCTS_GET: "/api/products/:id",
  PRODUCTS_UPDATE: "/api/products/:id",
  PRODUCTS_DELETE: "/api/products/:id",
  PRODUCTS_STOCK_UPDATE: "/api/products/:id/stock",
  PRODUCTS_STATS: "/api/products/stats",
  PRODUCTS_LOW_STOCK: "/api/products/low-stock",

  // Sales
  SALES_CREATE: "/api/sales",
  SALES_LIST: "/api/sales",
  SALES_GET: "/api/sales/:id",
  SALES_UPDATE_PAYMENT: "/api/sales/:id/payment",
  SALES_CANCEL: "/api/sales/:id/cancel",
  SALES_STATS: "/api/sales/stats",
  SALES_TODAY: "/api/sales/today",

  // Transactions
  TRANSACTIONS_CREATE: "/api/transactions",
  TRANSACTIONS_LIST: "/api/transactions",
  TRANSACTIONS_GET: "/api/transactions/:id",
  TRANSACTIONS_UPDATE: "/api/transactions/:id",
  TRANSACTIONS_DELETE: "/api/transactions/:id",
  TRANSACTIONS_SUMMARY: "/api/transactions/summary",
  TRANSACTIONS_TRENDS: "/api/transactions/trends",
  TRANSACTIONS_TODAY: "/api/transactions/today",

  // Notifications
  NOTIFICATIONS_LIST: "/api/notifications",
  NOTIFICATIONS_GET: "/api/notifications/:id",
  NOTIFICATIONS_READ: "/api/notifications/:id/read",
  NOTIFICATIONS_READ_ALL: "/api/notifications/read-all",
  NOTIFICATIONS_DELETE: "/api/notifications/:id",
  NOTIFICATIONS_SEND: "/api/notifications/send",
  NOTIFICATIONS_STATS: "/api/notifications/stats",

  // Legacy endpoints (kept for backward compatibility)
  INVENTORY_LIST: "/api/products",
  INVENTORY_GET: "/api/products/:id",
  INVENTORY_UPDATE: "/api/products/:id",
  INVENTORY_DELETE: "/api/products/:id",
  INVENTORY_OUT_OF_STOCK: "/api/products/low-stock",
  INVENTORY_LOW_STOCK: "/api/products/low-stock",
  INVENTORY_STATISTICS: "/api/products/stats",

  // Services (if implemented)
  SERVICES_LIST: "/api/services",
  SERVICES_GET: "/api/services/:id",
  SERVICES_CREATE: "/api/services",
  SERVICES_UPDATE: "/api/services/:id",
  SERVICES_DELETE: "/api/services/:id",

  // Bookings (if implemented)
  BOOKINGS_CREATE: "/api/bookings",
  BOOKINGS_LIST: "/api/bookings",
  BOOKINGS_UPDATE: "/api/bookings/:id",

  // Payments
  PAYMENT_VERIFY: "/api/payments/verify",
  PAYMENTS_WEBHOOK: "/api/payments/webhook",
};
