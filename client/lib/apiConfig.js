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

export const API_BASE_URL =
  (typeof process !== "undefined" &&
    process.env &&
    (process.env.REACT_APP_API_URL || process.env.VITE_API_URL)) ||
  import.meta.env?.VITE_API_URL ||
  "https://hackjos-95g7.onrender.com"; // Default to live backend at hackjos-95g7.onrender.com if no env provided

// Note: `process` is not available in the browser runtime. The typeof guard
// ensures code can run both in Node and in client-side environments (Vite). If
// using Vite, prefer setting VITE_API_URL in .env files.

export const API_ENDPOINTS = {
  // Authentication
  AUTH_REGISTER: "/api/auth/register",
  AUTH_LOGIN: "/api/auth/login",
  AUTH_LOGOUT: "/api/auth/logout",
  AUTH_ME: "/api/users/me",

  // Inventory
  INVENTORY_LIST: "/api/inventory/",
  INVENTORY_GET: "/api/inventory/:id",
  INVENTORY_UPDATE: "/api/inventory/:id",
  INVENTORY_DELETE: "/api/inventory/:id",
  INVENTORY_REMOVE_STOCK: "/api/inventory/:id/remove-stock",
  INVENTORY_OUT_OF_STOCK: "/api/inventory/out-of-stock",
  INVENTORY_LOW_STOCK: "/api/inventory/low-stock",
  INVENTORY_EXPORT: "/api/inventory/export",
  INVENTORY_STATISTICS: "/api/inventory/statistics",
  INVENTORY_TOP_SELLING: "/api/inventory/top-selling",

  // Services
  SERVICES_LIST: "/api/services/",
  SERVICES_GET: "/api/services/:id",
  SERVICES_CREATE: "/api/services/",
  SERVICES_UPDATE: "/api/services/:id",
  SERVICES_DELETE: "/api/services/:id",
  SERVICES_PUBLISHED: "/api/services/published",

  // Bookings
  BOOKINGS_CREATE: "/api/bookings",
  BOOKINGS_LIST: "/api/bookings",
  BOOKINGS_UPDATE: "/api/bookings/:id",
  // Payments
  PAYMENT_VERIFY: "/api/payments/verify",
  PAYMENTS_WEBHOOK: "/api/payments/webhook",
};
