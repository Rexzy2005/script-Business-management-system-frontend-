import { apiPost, apiGet, apiPut, setAuthToken, clearAuthToken } from "./api";
import { API_ENDPOINTS } from "./apiConfig";

/**
 * Registers a new user
 */
export async function register(userData) {
  try {
    const response = await apiPost(API_ENDPOINTS.AUTH_REGISTER, {
      name: userData.name,
      email: userData.email,
      phone: userData.phone || "",
      password: userData.password,
      businessName: userData.businessName,
      businessType: userData.businessType,
    });

    // Extract tokens safely
    const token =
      response?.token ||
      response?.data?.token ||
      response?.data?.accessToken ||
      response?.data?.tokens?.accessToken;

    if (token) setAuthToken(token);

    const refreshToken =
      response?.refreshToken ||
      response?.data?.refreshToken ||
      response?.data?.tokens?.refreshToken;

    if (refreshToken) {
      localStorage.setItem(
        "script_refresh_token",
        JSON.stringify(refreshToken),
      );
    }

    return {
      ...response,
      user: response?.user || response?.data?.user || response?.data || null,
      token: token || null,
      refreshToken: refreshToken || null,
    };
  } catch (error) {
    throw new Error(error?.message || "Registration failed");
  }
}

/**
 * Logs in a user
 */
export async function login(email, password) {
  try {
    const response = await apiPost(API_ENDPOINTS.AUTH_LOGIN, {
      email,
      password,
    });

    const token =
      response?.token ||
      response?.data?.token ||
      response?.data?.accessToken ||
      response?.data?.tokens?.accessToken;

    if (token) setAuthToken(token);

    const refreshToken =
      response?.refreshToken ||
      response?.data?.refreshToken ||
      response?.data?.tokens?.refreshToken;

    if (refreshToken) {
      localStorage.setItem(
        "script_refresh_token",
        JSON.stringify(refreshToken),
      );
    }

    return {
      ...response,
      user: response?.user || response?.data?.user || response?.data || null,
      token: token || null,
      refreshToken: refreshToken || null,
    };
  } catch (error) {
    throw new Error(error?.message || "Login failed");
  }
}

/**
 * Logs out the user
 */
export async function logout() {
  try {
    await apiPost(API_ENDPOINTS.AUTH_LOGOUT, {});
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    clearAuthToken();
    localStorage.removeItem("script_refresh_token");
  }
}

/**
 * Gets the currently logged-in user
 */
export async function getCurrentUser() {
  try {
    const response = await apiGet(API_ENDPOINTS.AUTH_ME);
    return response?.data || response?.user || null;
  } catch (error) {
    clearAuthToken();
    throw new Error(error?.message || "Failed to get current user");
  }
}

/**
 * Updates current user data
 */
export async function updateCurrentUser(updates) {
  try {
    const response = await apiPut(API_ENDPOINTS.AUTH_ME, updates);
    return response?.data || response?.user || response || null;
  } catch (error) {
    throw new Error(error?.message || "Failed to update current user");
  }
}

/**
 * Updates current user password
 */
export async function updatePassword(currentPassword, newPassword) {
  try {
    const response = await apiPut(API_ENDPOINTS.AUTH_UPDATE_PASSWORD, {
      currentPassword,
      newPassword,
    });
    return response;
  } catch (error) {
    throw new Error(error?.message || "Failed to update password");
  }
}
