# Frontend API Configuration Guide

## Overview

This document outlines how the frontend is configured to communicate with the backend API. The frontend supports both local development and production deployments.

---

## API Base URLs

### Production

- **URL**: `https://script-backend-ojlh.onrender.com`
- **Environment**: Deployed on Render
- **Status**: Live

### Development (Local)

- **URL**: `http://localhost:5000`
- **Environment**: Local backend running on your machine
- **Frontend**: Usually runs on `http://localhost:5173` (Vite default)

---

## Environment Configuration

### .env (Development)

```env
VITE_API_URL=http://localhost:5000
```

Used when running `npm run dev`

### .env.production (Production)

```env
VITE_API_URL=https://script-backend-ojlh.onrender.com
```

Used when building with `npm run build`

### .env.development (Alternative)

```env
VITE_API_URL=http://localhost:5000
```

Optional, provides explicit development configuration

---

## How to Switch Between Environments

### For Local Development

```bash
npm run dev
```

This automatically loads `.env` and uses `http://localhost:5000`

### For Production Build

```bash
npm run build
```

This automatically loads `.env.production` and uses the Render URL

### Override at Runtime

You can also set environment variables before running:

**Bash/Linux/macOS:**

```bash
export VITE_API_URL=http://localhost:5000
npm run dev
```

**PowerShell (Windows):**

```powershell
$env:VITE_API_URL = "http://localhost:5000"
npm run dev
```

---

## API Configuration Files

### `client/lib/apiConfig.js`

Main configuration file that defines:

- Base URL selection logic
- All API endpoints

**Key exports:**

- `API_BASE_URL` - The active base URL
- `API_ENDPOINTS` - Object containing all endpoint paths

### `client/lib/api.js`

Core API communication layer that handles:

- HTTP requests (GET, POST, PUT, DELETE, PATCH)
- Authentication token management
- Rate limiting
- Error handling

**Key exports:**

- `apiGet()` - GET request
- `apiPost()` - POST request
- `apiPut()` - PUT request
- `apiDelete()` - DELETE request
- `apiCall()` - Raw API call with options
- `getAuthToken()` - Retrieve stored auth token
- `setAuthToken()` - Store auth token
- `clearAuthToken()` - Remove auth token

---

## API Service Modules

All API service modules import from `api.js` and `apiConfig.js`:

### `client/lib/apiAuth.js`

**Functions:**

- `register(userData)` - Register new user and business
- `login(email, password)` - Authenticate user
- `logout()` - Logout user
- `getCurrentUser()` - Fetch current user
- `updateCurrentUser(updates)` - Update user profile
- `updatePassword(currentPassword, newPassword)` - Change password

### `client/lib/apiInventory.js`

**Functions:**

- `createProduct(productData)` - Create new product
- `getAllProducts()` - List all products
- `getProduct(id)` - Get single product
- `updateProduct(id, productData)` - Update product
- `deleteProduct(id)` - Delete product
- `updateStock(id, quantityChange, reason)` - Update product stock
- `getLowStock()` - Get low-stock products
- `getStatistics()` - Get product statistics

### `client/lib/apiSales.js`

**Functions:**

- `createSale(saleData)` - Record new sale
- `getAllSales(filters)` - List sales with filters
- `getSale(id)` - Get single sale
- `updateSalePayment(id, paymentData)` - Update payment status
- `cancelSale(id)` - Cancel a sale
- `getSalesStats()` - Get sales statistics
- `getTodaySales()` - Get today's sales

### `client/lib/apiTransactions.js`

**Functions:**

- `createTransaction(transactionData)` - Record income/expense
- `getAllTransactions(filters)` - List transactions
- `getTransaction(id)` - Get single transaction
- `updateTransaction(id, transactionData)` - Update transaction
- `deleteTransaction(id)` - Delete transaction
- `getCashFlowSummary(filters)` - Get summary
- `getCashFlowTrends(filters)` - Get trends
- `getTodayCashFlow()` - Get today's cash flow

### `client/lib/apiBusiness.js`

**Functions:**

- `getBusinessProfile()` - Get business profile
- `updateBusinessProfile(profileData)` - Update profile
- `getBusinessPreferences()` - Get preferences
- `updateBusinessPreferences(preferences)` - Update preferences

### `client/lib/apiNotifications.js`

**Functions:**

- `getNotifications(filters)` - List notifications
- `getNotification(id)` - Get single notification
- `markAsRead(id)` - Mark as read
- `markAllAsRead()` - Mark all as read
- `deleteNotification(id)` - Delete notification
- `sendNotification(notificationData)` - Send notification
- `getNotificationStats()` - Get statistics

---

## API Endpoints Reference

### Authentication (`/api/auth`)

| Method | Endpoint                    | Purpose           |
| ------ | --------------------------- | ----------------- |
| POST   | `/api/auth/register`        | Register new user |
| POST   | `/api/auth/login`           | Login user        |
| POST   | `/api/auth/logout`          | Logout user       |
| GET    | `/api/auth/me`              | Get current user  |
| PUT    | `/api/auth/update-password` | Update password   |

### Business (`/api/business`)

| Method | Endpoint                    | Purpose            |
| ------ | --------------------------- | ------------------ |
| GET    | `/api/business/profile`     | Get profile        |
| PUT    | `/api/business/profile`     | Update profile     |
| GET    | `/api/business/preferences` | Get preferences    |
| PUT    | `/api/business/preferences` | Update preferences |

### Products (`/api/products`)

| Method | Endpoint                  | Purpose            |
| ------ | ------------------------- | ------------------ |
| POST   | `/api/products`           | Create product     |
| GET    | `/api/products`           | List products      |
| GET    | `/api/products/:id`       | Get product        |
| PUT    | `/api/products/:id`       | Update product     |
| DELETE | `/api/products/:id`       | Delete product     |
| PATCH  | `/api/products/:id/stock` | Update stock       |
| GET    | `/api/products/stats`     | Get statistics     |
| GET    | `/api/products/low-stock` | Low-stock products |

### Sales (`/api/sales`)

| Method | Endpoint                 | Purpose        |
| ------ | ------------------------ | -------------- |
| POST   | `/api/sales`             | Create sale    |
| GET    | `/api/sales`             | List sales     |
| GET    | `/api/sales/:id`         | Get sale       |
| PATCH  | `/api/sales/:id/payment` | Update payment |
| PATCH  | `/api/sales/:id/cancel`  | Cancel sale    |
| GET    | `/api/sales/stats`       | Get statistics |
| GET    | `/api/sales/today`       | Today's sales  |

### Transactions (`/api/transactions`)

| Method | Endpoint                    | Purpose            |
| ------ | --------------------------- | ------------------ |
| POST   | `/api/transactions`         | Create transaction |
| GET    | `/api/transactions`         | List transactions  |
| GET    | `/api/transactions/:id`     | Get transaction    |
| PUT    | `/api/transactions/:id`     | Update transaction |
| DELETE | `/api/transactions/:id`     | Delete transaction |
| GET    | `/api/transactions/summary` | Cash flow summary  |
| GET    | `/api/transactions/trends`  | Cash flow trends   |
| GET    | `/api/transactions/today`   | Today's cash flow  |

### Notifications (`/api/notifications`)

| Method | Endpoint                      | Purpose             |
| ------ | ----------------------------- | ------------------- |
| GET    | `/api/notifications`          | List notifications  |
| GET    | `/api/notifications/:id`      | Get notification    |
| PUT    | `/api/notifications/:id/read` | Mark as read        |
| PUT    | `/api/notifications/read-all` | Mark all as read    |
| DELETE | `/api/notifications/:id`      | Delete notification |
| POST   | `/api/notifications/send`     | Send notification   |
| GET    | `/api/notifications/stats`    | Get statistics      |

---

## Authentication

### Token Storage

- Tokens are stored in `localStorage` as `script_auth_token`
- Refresh tokens are stored as `script_refresh_token`

### Request Headers

All authenticated requests include:

```
Authorization: Bearer <token>
Content-Type: application/json
```

### Token Management

```javascript
import { getAuthToken, setAuthToken, clearAuthToken } from "./lib/api";

// Get stored token
const token = getAuthToken();

// Store new token
setAuthToken(newToken);

// Clear token on logout
clearAuthToken();
```

---

## Rate Limiting

The frontend implements client-side rate limiting to prevent server overload:

- **Requests per minute**: 60
- **Backoff strategy**: Exponential backoff on 429 errors
- **Max retries**: 3

Configure in `client/lib/rateLimiter.js`

---

## Error Handling

All API calls return `throw Error` on failure. Catch errors in components:

```javascript
try {
  const products = await getAllProducts();
  // Handle success
} catch (error) {
  console.error("Failed to load products:", error.message);
  // Handle error (e.g., show toast notification)
}
```

---

## Testing the Configuration

### Test Development Setup

1. Start your backend:

   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. Start your frontend:

   ```bash
   cd scriptFrontend
   npm install
   npm run dev
   ```

3. Check console for API calls - they should go to `http://localhost:5000`

### Test Production Configuration

1. Build the frontend:

   ```bash
   npm run build
   ```

2. The built app will use `https://script-backend-ojlh.onrender.com` as the API base URL

### Verify API Connection

Add this to check the active API base URL:

```javascript
import { API_BASE_URL } from "./lib/apiConfig";
console.log("Active API URL:", API_BASE_URL);
```

---

## Troubleshooting

### Issue: API calls fail with 404

- Verify the backend is running on the correct URL
- Check that `VITE_API_URL` is set correctly
- Ensure endpoints in `apiConfig.js` match your backend routes

### Issue: CORS errors

- Backend must have CORS enabled for your frontend origin
- Check `.env` file in backend for `CORS_ORIGIN`

### Issue: 401 Unauthorized

- Token may be expired or invalid
- Clear `script_auth_token` from localStorage
- Log out and log back in

### Issue: Rate limit errors (429)

- Wait before making new requests
- Check rate limiter configuration in `client/lib/rateLimiter.js`
- Consider reducing request frequency

---

## Quick Reference

### Switching to localhost

```bash
# Edit .env file
VITE_API_URL=http://localhost:5000

# Restart dev server
npm run dev
```

### Switching to production

```bash
# Edit .env.production file
VITE_API_URL=https://script-backend-ojlh.onrender.com

# Build for production
npm run build
```

### Check active URL

```javascript
import { API_BASE_URL } from "@/lib/apiConfig";
console.log("API:", API_BASE_URL);
```

---

## Support

For issues or questions about API configuration, check:

1. `.env` files for correct URLs
2. Browser console for error messages
3. Network tab in DevTools to inspect requests
4. Backend logs for server-side errors
