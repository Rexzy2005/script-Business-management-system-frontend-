import { apiGet, apiPost, apiPut, apiDelete } from "./api";
import { API_ENDPOINTS } from "./apiConfig";

export async function createTransaction(transactionData) {
  try {
    const response = await apiPost(API_ENDPOINTS.TRANSACTIONS_CREATE, {
      type: transactionData.type, // 'income' or 'expense'
      amount: transactionData.amount,
      category: transactionData.category,
      description: transactionData.description,
      paymentMethod: transactionData.paymentMethod,
      reference: transactionData.reference || "",
      transactionDate: transactionData.transactionDate,
    });
    return response?.data || response || null;
  } catch (error) {
    throw new Error(error.message || "Failed to create transaction");
  }
}

export async function getAllTransactions(filters = {}) {
  try {
    let url = API_ENDPOINTS.TRANSACTIONS_LIST;
    const params = new URLSearchParams();

    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);
    if (filters.type) params.append("type", filters.type);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.category) params.append("category", filters.category);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await apiGet(url);
    return response?.data || [];
  } catch (error) {
    console.warn(`Failed to get transactions: ${error?.message || error}`);
    return [];
  }
}

export async function getTransaction(id) {
  try {
    const response = await apiGet(
      API_ENDPOINTS.TRANSACTIONS_GET.replace(":id", id),
    );
    return response?.data || null;
  } catch (error) {
    throw new Error(error.message || "Failed to get transaction");
  }
}

export async function updateTransaction(id, transactionData) {
  try {
    const response = await apiPut(
      API_ENDPOINTS.TRANSACTIONS_UPDATE.replace(":id", id),
      {
        amount: transactionData.amount,
        category: transactionData.category,
        description: transactionData.description,
        paymentMethod: transactionData.paymentMethod,
        reference: transactionData.reference,
      },
    );
    return response?.data || response || null;
  } catch (error) {
    throw new Error(error.message || "Failed to update transaction");
  }
}

export async function deleteTransaction(id) {
  try {
    const response = await apiDelete(
      API_ENDPOINTS.TRANSACTIONS_DELETE.replace(":id", id),
    );
    return response || null;
  } catch (error) {
    throw new Error(error.message || "Failed to delete transaction");
  }
}

export async function getCashFlowSummary(filters = {}) {
  try {
    let url = API_ENDPOINTS.TRANSACTIONS_SUMMARY;
    const params = new URLSearchParams();

    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await apiGet(url);
    return response?.data || {};
  } catch (error) {
    console.warn(`Failed to get cash flow summary: ${error?.message || error}`);
    return {};
  }
}

export async function getCashFlowTrends(filters = {}) {
  try {
    let url = API_ENDPOINTS.TRANSACTIONS_TRENDS;
    const params = new URLSearchParams();

    if (filters.period) params.append("period", filters.period); // 'daily', 'weekly', 'monthly'
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await apiGet(url);
    return response?.data || [];
  } catch (error) {
    console.warn(`Failed to get cash flow trends: ${error?.message || error}`);
    return [];
  }
}

export async function getTodayCashFlow() {
  try {
    const response = await apiGet(API_ENDPOINTS.TRANSACTIONS_TODAY);
    return response?.data || {};
  } catch (error) {
    console.warn(`Failed to get today's cash flow: ${error?.message || error}`);
    return {};
  }
}
