import { apiPost, apiGet, getApiBaseUrl } from "./api";

const BASE_URL = getApiBaseUrl();

/**
 * Get current user's subscription
 */
export async function getCurrentSubscription() {
  try {
    const response = await fetch(`${BASE_URL}/api/subscriptions/current`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("script_token")}`,
      },
    });

    const data = await response.json();
    return {
      success: data.success !== false,
      subscription: data.data?.subscription || null,
      message: data.message || null,
    };
  } catch (error) {
    throw new Error(error?.message || "Failed to get subscription");
  }
}

/**
 * Get subscription status
 */
export async function getSubscriptionStatus() {
  try {
    const response = await fetch(`${BASE_URL}/api/subscriptions/status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("script_token")}`,
      },
    });

    const data = await response.json();
    return {
      success: data.success !== false,
      hasActiveSubscription: data.data?.hasActiveSubscription || false,
      subscription: data.data?.subscription || null,
      message: data.message || null,
    };
  } catch (error) {
    throw new Error(error?.message || "Failed to get subscription status");
  }
}

/**
 * Initialize subscription payment
 */
export async function initializeSubscription(planType) {
  try {
    const response = await fetch(`${BASE_URL}/api/subscriptions/initialize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("script_token")}`,
      },
      body: JSON.stringify({ planType }),
    });

    const data = await response.json();
    return {
      success: data.success !== false,
      subscription: data.data?.subscription || null,
      payment: data.data?.payment || null,
      message: data.message || null,
    };
  } catch (error) {
    throw new Error(error?.message || "Failed to initialize subscription");
  }
}

/**
 * Verify subscription payment
 */
export async function verifySubscription(transactionId, txRef) {
  try {
    const response = await fetch(`${BASE_URL}/api/subscriptions/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("script_token")}`,
      },
      body: JSON.stringify({
        transaction_id: transactionId,
        tx_ref: txRef,
      }),
    });

    const data = await response.json();
    return {
      success: data.success !== false,
      subscription: data.data?.subscription || null,
      message: data.message || null,
    };
  } catch (error) {
    throw new Error(error?.message || "Failed to verify subscription");
  }
}

/**
 * Renew subscription
 */
export async function renewSubscription(planType) {
  try {
    const response = await fetch(`${BASE_URL}/api/subscriptions/renew`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("script_token")}`,
      },
      body: JSON.stringify({ planType }),
    });

    const data = await response.json();
    return {
      success: data.success !== false,
      subscription: data.data?.subscription || null,
      payment: data.data?.payment || null,
      message: data.message || null,
    };
  } catch (error) {
    throw new Error(error?.message || "Failed to renew subscription");
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(reason = "") {
  try {
    const response = await fetch(`${BASE_URL}/api/subscriptions/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("script_token")}`,
      },
      body: JSON.stringify({ reason }),
    });

    const data = await response.json();
    return {
      success: data.success !== false,
      subscription: data.data?.subscription || null,
      message: data.message || null,
    };
  } catch (error) {
    throw new Error(error?.message || "Failed to cancel subscription");
  }
}

