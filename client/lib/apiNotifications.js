import { apiGet, apiPost, apiPut, apiDelete } from "./api";
import { API_ENDPOINTS } from "./apiConfig";

export async function getNotifications(filters = {}) {
  try {
    let url = API_ENDPOINTS.NOTIFICATIONS_LIST;
    const params = new URLSearchParams();

    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);
    if (filters.type) params.append("type", filters.type);
    if (filters.isRead !== undefined) params.append("isRead", filters.isRead);
    if (filters.priority) params.append("priority", filters.priority);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await apiGet(url);
    return response?.data || [];
  } catch (error) {
    console.warn(`Failed to get notifications: ${error?.message || error}`);
    return [];
  }
}

export async function getNotification(id) {
  try {
    const response = await apiGet(
      API_ENDPOINTS.NOTIFICATIONS_GET.replace(":id", id),
    );
    return response?.data || null;
  } catch (error) {
    throw new Error(error.message || "Failed to get notification");
  }
}

export async function markAsRead(id) {
  try {
    const response = await apiPut(
      API_ENDPOINTS.NOTIFICATIONS_READ.replace(":id", id),
      {},
    );
    return response?.data || response || null;
  } catch (error) {
    throw new Error(error.message || "Failed to mark notification as read");
  }
}

export async function markAllAsRead() {
  try {
    const response = await apiPut(API_ENDPOINTS.NOTIFICATIONS_READ_ALL, {});
    return response || null;
  } catch (error) {
    throw new Error(
      error.message || "Failed to mark all notifications as read",
    );
  }
}

export async function deleteNotification(id) {
  try {
    const response = await apiDelete(
      API_ENDPOINTS.NOTIFICATIONS_DELETE.replace(":id", id),
    );
    return response || null;
  } catch (error) {
    throw new Error(error.message || "Failed to delete notification");
  }
}

export async function sendNotification(notificationData) {
  try {
    const response = await apiPost(API_ENDPOINTS.NOTIFICATIONS_SEND, {
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      priority: notificationData.priority || "medium",
      userId: notificationData.userId,
      actionUrl: notificationData.actionUrl,
      actionText: notificationData.actionText,
      sendEmail: notificationData.sendEmail || false,
    });
    return response?.data || response || null;
  } catch (error) {
    throw new Error(error.message || "Failed to send notification");
  }
}

export async function getNotificationStats() {
  try {
    const response = await apiGet(API_ENDPOINTS.NOTIFICATIONS_STATS);
    return response?.data || {};
  } catch (error) {
    console.warn(
      `Failed to get notification stats: ${error?.message || error}`,
    );
    return {};
  }
}
