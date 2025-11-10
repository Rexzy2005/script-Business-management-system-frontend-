# API Integration Guide

This guide explains how the frontend has been integrated with the backend API endpoints.

## Overview

The frontend now makes real API calls to the backend instead of using localStorage for persistence. The API client is set up to gracefully fall back to demo data if the backend is unavailable or the base URL is not configured.

## API Client Files Created

### 1. `client/lib/api.js`

Core API client with:

- Base URL configuration
- Authentication token management (stored in localStorage as `script_auth_token`)
- Generic `apiCall()` function that handles headers and error handling
- Helper functions: `apiGet()`, `apiPost()`, `apiPut()`, `apiDelete()`

### 2. `client/lib/apiAuth.js`

Authentication API client with:

- `register(userData)` - Register new user
- `login(email, password)` - Login user
- `logout()` - Logout user
- `getCurrentUser()` - Get current authenticated user

### 3. `client/lib/apiInventory.js`

Inventory API client with:

- `getAllProducts()` - Get all products
- `getProduct(id)` - Get single product
- `updateProduct(id, productData)` - Update product
- `deleteProduct(id)` - Delete product
- `removeStock(id, quantity, reason)` - Remove stock from product

### 4. `client/lib/apiServices.js`

Services API client with:

- `getAllServices()` - Get all services
- `getService(id)` - Get single service
- `createService(serviceData)` - Create new service
- `updateService(id, serviceData)` - Update service
- `deleteService(id)` - Delete service

## Updated Core Files

### `client/lib/auth.js`

Updated to use API calls for authentication:

- `register()` - Now makes API call via `apiAuth.register()`
- `login()` - Now makes API call via `apiAuth.login()`
- `logout()` - Now makes API call via `apiAuth.logout()`
- `fetchCurrentUser()` - New async function to fetch current user from API
- Demo mode preserved: `signInDemo()` still works for offline testing
- Admin mode preserved: `signInAsAdmin()` still works for demo admin login

### `client/lib/data.js`

Updated to use API calls with graceful fallback:

- `getInventory()` - Attempts API call, falls back to localStorage
- `getServices()` - Attempts API call, falls back to localStorage
- `addService()` - Creates service via API, falls back to local storage
- `updateService()` - Updates service via API, falls back to local storage
- `deleteService()` - Deletes service via API, falls back to local storage
- Local-only functions (bookings, clients, expenses) remain unchanged

## Updated Page Components

The following pages have been updated to handle async API calls:

1. **SignIn.jsx** - Login now uses API with fallback to demo mode
2. **SignUp.jsx** - Registration now uses API with fallback to demo mode
3. **Inventory.jsx** - Product operations now use API
4. **Services.jsx** - Service operations now use API
5. **Clients.jsx** - Loads client data asynchronously
6. **Schedule.jsx** - Loads bookings asynchronously
7. **Profile.jsx** - Loads services and clients asynchronously
8. **ServiceDashboard.jsx** - Loads all data asynchronously
9. **Reports.jsx** - Loads bookings and services asynchronously
10. **Payments.jsx** - Loads bookings and services asynchronously
11. **PublicListings.jsx** - Loads inventory/services asynchronously
12. **Expenses.jsx** - Loads expenses asynchronously

## Configuration

### Setting the Backend URL

To connect to your backend, set the API base URL in `client/lib/api.js`:

```javascript
const API_BASE_URL = "https://your-backend-url.com";
```

Or set the environment variable:

```bash
REACT_APP_API_URL=https://your-backend-url.com npm run dev
```

Currently, the base URL is set to empty string (`""`), which means:

- All API calls will fail gracefully
- The app will fall back to localStorage and demo data
- The app remains fully functional in offline mode

### Authentication Flow

1. **Registration**:
   - User fills signup form
   - API call to `POST /api/auth/register`
   - JWT token is stored in localStorage as `script_auth_token`
   - User is redirected to dashboard

2. **Login**:
   - User enters credentials
   - API call to `POST /api/auth/login`
   - JWT token is stored in localStorage as `script_auth_token`
   - User is redirected to dashboard

3. **Protected Routes**:
   - `ProtectedRoute` component checks `isAuthenticated()`
   - Redirects to signin if no token/user found

4. **Logout**:
   - API call to `POST /api/auth/logout`
   - Token is cleared from localStorage
   - User is redirected to signin

## Error Handling

All API calls include error handling:

- Failed requests throw errors with messages
- Pages catch errors and show toast notifications
- Graceful fallback to demo/local data when API is unavailable

## Demo/Offline Mode

The app is designed to work completely offline:

- Demo sign-in still works via `signInDemo()`
- Demo admin login works via `signInAsAdmin()`
- All data operations fall back to localStorage
- Full functionality preserved without backend

## Next Steps

1. Set your backend URL in `client/lib/api.js`
2. Ensure your backend implements all documented endpoints
3. Test the authentication flow
4. Monitor network requests in browser dev tools
5. Check localStorage for token storage

## Notes

- Tokens are stored in localStorage as `script_auth_token`
- Admin token is stored as `script_admin_role`
- All API calls include `Authorization: Bearer <token>` header
- The app maintains backward compatibility with demo mode
