import { apiGet, apiPost, getAuthToken } from "./api";

/**
 * Get current user's subscription
 */
export async function getCurrentSubscription() {
  try {
    const response = await apiGet("/api/subscriptions/current");
    return {
      success: response.success !== false,
      subscription: response.data?.subscription || null,
      message: response.message || null,
    };
  } catch (error) {
    // If 401 or 404, return empty subscription (user may not have one)
    if (error?.message?.includes("401") || error?.message?.includes("404")) {
      return {
        success: false,
        subscription: null,
        message: "No subscription found",
      };
    }
    throw new Error(error?.message || "Failed to get subscription");
  }
}

/**
 * Get subscription status
 */
export async function getSubscriptionStatus() {
  try {
    const response = await apiGet("/api/subscriptions/status");
    return {
      success: response.success !== false,
      hasActiveSubscription: response.data?.hasActiveSubscription || false,
      subscription: response.data?.subscription || null,
      message: response.message || null,
    };
  } catch (error) {
    if (error?.message?.includes("401") || error?.message?.includes("404")) {
      return {
        success: false,
        hasActiveSubscription: false,
        subscription: null,
        message: "No subscription found",
      };
    }
    throw new Error(error?.message || "Failed to get subscription status");
  }
}

/**
 * Initialize subscription payment
 */
export async function initializeSubscription(planType) {
  try {
    const response = await apiPost("/api/subscriptions/initialize", {
      planType,
    });
    return {
      success: response.success !== false,
      subscription: response.data?.subscription || null,
      payment: response.data?.payment || null,
      message: response.message || null,
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
    const response = await apiPost("/api/subscriptions/verify", {
      transaction_id: transactionId,
      tx_ref: txRef,
    });
    return {
      success: response.success !== false,
      subscription: response.data?.subscription || null,
      message: response.message || null,
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
    const response = await apiPost("/api/subscriptions/renew", {
      planType,
    });
    return {
      success: response.success !== false,
      subscription: response.data?.subscription || null,
      payment: response.data?.payment || null,
      message: response.message || null,
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
    const response = await apiPost("/api/subscriptions/cancel", {
      reason,
    });
    return {
      success: response.success !== false,
      subscription: response.data?.subscription || null,
      message: response.message || null,
    };
  } catch (error) {
    throw new Error(error?.message || "Failed to cancel subscription");
  }
}

