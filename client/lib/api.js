import { API_BASE_URL } from "./apiConfig";
import { globalRateLimiter } from "./rateLimiter";

/**
 * Get API Base URL
 */
export function getApiBaseUrl() {
  return API_BASE_URL || "";
}

/**
 * Get auth token from localStorage
 */
export function getAuthToken() {
  try {
    const raw = localStorage.getItem("script_auth_token");
    if (!raw) return null;
    // If stored as a JSON string (e.g. '{"accessToken":"..."}'), parse and extract
    if (raw.trim().startsWith("{")) {
      try {
        const parsed = JSON.parse(raw);
        return (
          parsed?.accessToken ||
          parsed?.token ||
          parsed?.tokens?.accessToken ||
          null
        );
      } catch (e) {
        // fallthrough to return raw string
      }
    }
    return raw;
  } catch (e) {
    return null;
  }
}

// If token is not stored under script_auth_token, try to extract from script_user
function extractTokenFromUserStorage() {
  try {
    const rawUser = localStorage.getItem("script_user");
    if (!rawUser) return null;
    const parsed = JSON.parse(rawUser);
    return (
      parsed?.tokens?.accessToken ||
      parsed?.accessToken ||
      parsed?.token ||
      null
    );
  } catch (e) {
    return null;
  }
}

/**
 * Set auth token to localStorage (raw string)
 */
export function setAuthToken(token) {
  if (!token) {
    localStorage.removeItem("script_auth_token");
    return;
  }

  // If token is an object, extract accessToken
  try {
    let final = token;
    if (typeof token === "object") {
      final =
        token.accessToken || token.token || token.tokens?.accessToken || "";
    }
    // if token is a JSON string, try to parse and extract
    if (typeof final === "string" && final.trim().startsWith("{")) {
      try {
        const parsed = JSON.parse(final);
        final =
          parsed?.accessToken ||
          parsed?.token ||
          parsed?.tokens?.accessToken ||
          "";
      } catch (e) {
        // keep final as-is
      }
    }

    if (!final) {
      localStorage.removeItem("script_auth_token");
    } else {
      localStorage.setItem("script_auth_token", final);
    }
  } catch (e) {
    // best-effort
    try {
      localStorage.setItem(
        "script_auth_token",
        typeof token === "string" ? token : "",
      );
    } catch (err) {
      /* ignore */
    }
  }
}

/**
 * Remove auth token
 */
export function clearAuthToken() {
  localStorage.removeItem("script_auth_token");
}

/**
 * Core API request function
 */
export async function apiCall(endpoint, options = {}) {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  const maxRetries = options.maxRetries ?? 3;
  let retryCount = 0;

  const makeRequest = async () => {
    // Rate limiter checks
    if (!globalRateLimiter.canMakeRequest()) {
      const waitTime = await globalRateLimiter.waitUntilReady();
      console.debug(`Rate limiter: waited ${waitTime}ms for ${endpoint}`);
    }

    if (!globalRateLimiter.checkPerMinuteLimit()) {
      const status = globalRateLimiter.getStatus();
      throw new Error(
        `Rate limit exceeded: ${status.recentRequestCount}/${status.requestsPerMinute} requests in the last minute`,
      );
    }

    // Headers
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    let token = getAuthToken();
    if (!token) {
      token = extractTokenFromUserStorage();
      if (token) {
        // persist the found token for future calls
        try {
          localStorage.setItem("script_auth_token", token);
        } catch (e) {
          /* ignore */
        }
      }
    }
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Extra debug log for token (masked) to help diagnose 401s. Always print in dev mode.
    try {
      const isDev =
        typeof import.meta !== "undefined" &&
        import.meta.env &&
        import.meta.env.MODE === "development";
      if (isDev) {
        const preview = token
          ? `${String(token).slice(0, 6)}...${String(token).slice(-6)}`
          : "null";
        console.debug(
          `[api] ${options.method || "GET"} ${endpoint} - Authorization: ${token ? "Bearer " + preview : "none"}`,
        );
      }
    } catch (e) {
      // ignore logging errors
    }
    // Debug token in dev
    if (import.meta.env && import.meta.env.MODE === "development") {
      console.debug(
        `[api] ${options.method || "GET"} ${endpoint} - hasToken: ${!!token} tokenPreview: ${token ? `${token.slice(0, 6)}...${token.slice(-6)}` : "null"}`,
      );
    }

    const response = await fetch(url, { ...options, headers });
    const contentType = response.headers.get("content-type") || "";

    // Handle 429 Rate limit
    if (response.status === 429) {
      globalRateLimiter.handleRateLimitError();
      if (retryCount < maxRetries) {
        retryCount++;
        const backoffTime = globalRateLimiter.currentBackoffMs;
        console.warn(
          `429 on ${endpoint}. Retrying in ${backoffTime}ms (attempt ${retryCount}/${maxRetries})`,
        );
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
        return makeRequest();
      }
      let errorBody = contentType.includes("application/json")
        ? await response.json().catch(() => null)
        : await response.text().catch(() => null);
      throw new Error(
        errorBody?.message || "Too many requests, please try again later",
      );
    }

    if (!response.ok) {
      globalRateLimiter.resetBackoff();
      let errorBody = contentType.includes("application/json")
        ? await response.json().catch(() => null)
        : await response.text().catch(() => null);
      throw new Error(
        errorBody?.message ||
          response.statusText ||
          `API Error: ${response.status}`,
      );
    }

    // Success
    globalRateLimiter.resetBackoff();
    globalRateLimiter.recordRequest();

    if (contentType.includes("application/json")) {
      try {
        return await response.json();
      } catch (e) {
        console.warn("Failed to parse JSON response:", e);
        return {};
      }
    }

    return {};
  };

  return makeRequest();
}

/**
 * Shortcut methods
 */
export async function apiGet(endpoint) {
  return apiCall(endpoint, { method: "GET" });
}

export async function apiPost(endpoint, body) {
  return apiCall(endpoint, { method: "POST", body: JSON.stringify(body) });
}

export async function apiPut(endpoint, body) {
  return apiCall(endpoint, { method: "PUT", body: JSON.stringify(body) });
}

export async function apiDelete(endpoint) {
  return apiCall(endpoint, { method: "DELETE" });
}

export async function apiPatch(endpoint, body) {
  return apiCall(endpoint, { method: "PATCH", body: JSON.stringify(body) });
}
