import { apiGet, apiPost, apiPut, apiPatch } from "./api";
import { API_ENDPOINTS } from "./apiConfig";

export async function createSale(saleData) {
  try {
    const response = await apiPost(API_ENDPOINTS.SALES_CREATE, {
      items: saleData.items,
      subtotal: saleData.subtotal,
      discount: saleData.discount || 0,
      tax: saleData.tax || 0,
      total: saleData.total,
      paymentMethod: saleData.paymentMethod,
      paymentStatus: saleData.paymentStatus || "pending",
      amountPaid: saleData.amountPaid || 0,
      amountDue: saleData.amountDue || 0,
      customerName: saleData.customerName || "",
      notes: saleData.notes || "",
    });
    return response?.data || response || null;
  } catch (error) {
    throw new Error(error.message || "Failed to create sale");
  }
}

export async function getAllSales(filters = {}) {
  try {
    let url = API_ENDPOINTS.SALES_LIST;
    const params = new URLSearchParams();

    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.paymentStatus)
      params.append("paymentStatus", filters.paymentStatus);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await apiGet(url);
    return response?.data || [];
  } catch (error) {
    console.warn(`Failed to get sales: ${error?.message || error}`);
    return [];
  }
}

export async function getSale(id) {
  try {
    const response = await apiGet(API_ENDPOINTS.SALES_GET.replace(":id", id));
    return response?.data || null;
  } catch (error) {
    throw new Error(error.message || "Failed to get sale");
  }
}

export async function updateSalePayment(id, paymentData) {
  try {
    const response = await apiPatch(
      API_ENDPOINTS.SALES_UPDATE_PAYMENT.replace(":id", id),
      {
        paymentStatus: paymentData.paymentStatus,
        amountPaid: paymentData.amountPaid,
      },
    );
    return response?.data || response || null;
  } catch (error) {
    throw new Error(error.message || "Failed to update sale payment");
  }
}

export async function cancelSale(id) {
  try {
    const response = await apiPatch(
      API_ENDPOINTS.SALES_CANCEL.replace(":id", id),
      {},
    );
    return response?.data || response || null;
  } catch (error) {
    throw new Error(error.message || "Failed to cancel sale");
  }
}

export async function getSalesStats() {
  try {
    const response = await apiGet(API_ENDPOINTS.SALES_STATS);
    return response?.data || {};
  } catch (error) {
    console.warn(`Failed to get sales stats: ${error?.message || error}`);
    return {};
  }
}

export async function getTodaySales() {
  try {
    const response = await apiGet(API_ENDPOINTS.SALES_TODAY);
    return response?.data || [];
  } catch (error) {
    console.warn(`Failed to get today's sales: ${error?.message || error}`);
    return [];
  }
}
