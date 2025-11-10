import { API_BASE_URL as CONFIG_API_BASE_URL } from "./apiConfig";
import { globalRateLimiter } from "./rateLimiter";

import { API_BASE_URL } from "./apiConfig";

export function getApiBaseUrl() {
  return API_BASE_URL || "";
}

export function getAuthToken() {
  try {
    const raw = localStorage.getItem("script_auth_token");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem("script_auth_token", JSON.stringify(token));
  } else {
    localStorage.removeItem("script_auth_token");
  }
}

export function clearAuthToken() {
  localStorage.removeItem("script_auth_token");
}

export async function apiCall(endpoint, options = {}) {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  const maxRetries = options.maxRetries ?? 3;
  let retryCount = 0;

  const makeRequest = async () => {
    // Check rate limiting before making request
    if (!globalRateLimiter.canMakeRequest()) {
      const waitTime = await globalRateLimiter.waitUntilReady();
      console.debug(
        `Rate limiter: waited ${waitTime}ms before request to ${endpoint}`
      );
    }

    // Check per-minute limit
    if (!globalRateLimiter.checkPerMinuteLimit()) {
      const status = globalRateLimiter.getStatus();
      throw new Error(
        `Rate limit exceeded: ${status.recentRequestCount}/${status.requestsPerMinute} requests in the last minute`
      );
    }

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = response.headers.get("content-type") || "";

    // Handle rate limit response
    if (response.status === 429) {
      globalRateLimiter.handleRateLimitError();

      if (retryCount < maxRetries) {
        retryCount++;
        const backoffTime = globalRateLimiter.currentBackoffMs;
        console.warn(
          `Rate limited (429) on ${endpoint}. Retrying in ${backoffTime}ms (attempt ${retryCount}/${maxRetries})`
        );
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
        return makeRequest();
      }

      let errorBody = null;
      if (contentType.includes("application/json")) {
        errorBody = await response.json().catch(() => null);
      } else {
        errorBody = await response.text().catch(() => null);
      }
      const errorMessage =
        (errorBody && (errorBody.message || JSON.stringify(errorBody))) ||
        "Too many requests, please try again later";
      throw new Error(errorMessage);
    }

    if (!response.ok) {
      // Reset backoff on non-429 errors
      globalRateLimiter.resetBackoff();

      let errorBody = null;
      if (contentType.includes("application/json")) {
        errorBody = await response.json().catch(() => null);
      } else {
        errorBody = await response.text().catch(() => null);
      }
      const errorMessage =
        (errorBody && (errorBody.message || JSON.stringify(errorBody))) ||
        response.statusText ||
        `API Error: ${response.status}`;
      throw new Error(errorMessage);
    }

    // Success: reset backoff
    globalRateLimiter.resetBackoff();
    globalRateLimiter.recordRequest();

    // parse JSON when possible, otherwise return empty object
    if (contentType.includes("application/json")) {
      try {
        const data = await response.json();
        return data;
      } catch (e) {
        console.warn("Failed to parse JSON response:", e);
        return {};
      }
    }

    // non-json successful response (e.g., HTML) — return empty object
    return {};
  };

  return makeRequest();
}

export async function apiGet(endpoint) {
  return apiCall(endpoint, { method: "GET" });
}

export async function apiPost(endpoint, body) {
  return apiCall(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function apiPut(endpoint, body) {
  return apiCall(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function apiDelete(endpoint) {
  return apiCall(endpoint, { method: "DELETE" });
}
