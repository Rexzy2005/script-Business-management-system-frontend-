import { setAuthToken, clearAuthToken, getAuthToken } from "./api";
import {
  register as apiRegister,
  login as apiLogin,
  logout as apiLogout,
  getCurrentUser as apiGetCurrentUser,
} from "./apiAuth";

const STORAGE_KEY = "script_user";
const ADMIN_ROLE_KEY = "script_admin_role";

let currentUser = null;

export function setCurrentUser(user) {
  currentUser = user;
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
  window.dispatchEvent(new Event("script-auth"));
}

export function getCurrentUserSync() {
  return currentUser || loadUserFromStorage();
}

function loadUserFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    currentUser = JSON.parse(raw);
    return currentUser;
  } catch (e) {
    return null;
  }
}

export async function register(userData) {
  try {
    const response = await apiRegister(userData);
    // Ensure token is stored (apiRegister may already set it, but be defensive)
    if (response?.token) setAuthToken(response.token);

    // If backend returned nested tokens object, try to set accessToken
    if (!response?.token && response?.data?.tokens?.accessToken) {
      setAuthToken(response.data.tokens.accessToken);
    }

    // Ensure current user is set; if missing, attempt to fetch from API
    if (response.user) {
      setCurrentUser(response.user);
    } else {
      try {
        const fetched = await apiGetCurrentUser();
        if (fetched) setCurrentUser(fetched);
      } catch (e) {
        // ignore - user will remain unauthenticated
      }
    }
    return response;
  } catch (error) {
    throw error;
  }
}

export async function login(email, password) {
  try {
    const response = await apiLogin(email, password);
    // Ensure token is stored (apiLogin may already set it)
    if (response?.token) setAuthToken(response.token);
    if (!response?.token && response?.data?.tokens?.accessToken) {
      setAuthToken(response.data.tokens.accessToken);
    }

    if (response.user) {
      setCurrentUser(response.user);
    } else {
      try {
        const fetched = await apiGetCurrentUser();
        if (fetched) setCurrentUser(fetched);
      } catch (e) {
        // ignore - user will remain unauthenticated
      }
    }
    return response;
  } catch (error) {
    throw error;
  }
}

export async function signOut() {
  try {
    await apiLogout();
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    clearAuthToken();
    setCurrentUser(null);
    localStorage.removeItem(ADMIN_ROLE_KEY);
  }
}

export async function fetchCurrentUser() {
  try {
    const user = await apiGetCurrentUser();
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  } catch (error) {
    console.warn("Failed to fetch current user:", error.message);
    return null;
  }
}

export function getUser() {
  return getCurrentUserSync();
}

export function isAuthenticated() {
  const user = getUser();
  const token = getAuthToken();
  return !!(user || token);
}

export function getAdminRole() {
  return localStorage.getItem(ADMIN_ROLE_KEY);
}

export function isAdmin() {
  const user = getUser();
  return (
    user?.isAdmin === true ||
    user?.role === "super-admin" ||
    user?.role === "admin"
  );
}

export function isSuperAdmin() {
  return getAdminRole() === "super-admin";
}

export function hasAdminPermission(permission) {
  const role = getAdminRole();
  const permissions = {
    "super-admin": ["*"],
    admin: [
      "view_dashboard",
      "manage_tenants",
      "manage_users",
      "view_billing",
      "view_support",
    ],
    moderator: ["view_dashboard", "manage_users", "view_support"],
  };

  const userPermissions = permissions[role] || [];
  return userPermissions.includes("*") || userPermissions.includes(permission);
}

export function requireAdminPermission(permission) {
  if (!hasAdminPermission(permission)) {
    throw new Error(`Permission denied: ${permission}`);
  }
}
