import { apiGet, apiPost, apiDelete } from "./api";
import { API_ENDPOINTS } from "./apiConfig";

export async function createExpense(expenseData) {
  try {
    const response = await apiPost(
      API_ENDPOINTS.EXPENSES_CREATE || "/api/expenses",
      {
        amount: expenseData.amount,
        category: expenseData.category,
        description: expenseData.description,
        date: expenseData.date,
        receiptUrl: expenseData.receiptUrl,
      },
    );
    return response?.data || response || null;
  } catch (error) {
    throw new Error(error?.message || "Failed to create expense");
  }
}

export async function getExpensesFromApi(params = {}) {
  try {
    let url = API_ENDPOINTS.EXPENSES_LIST || "/api/expenses";
    const qs = new URLSearchParams();
    if (params.page) qs.append("page", params.page);
    if (params.limit) qs.append("limit", params.limit);
    if (params.startDate) qs.append("startDate", params.startDate);
    if (params.endDate) qs.append("endDate", params.endDate);
    if (qs.toString()) url += `?${qs.toString()}`;
    const response = await apiGet(url);
    return response?.data || [];
  } catch (error) {
    console.warn(`Failed to fetch expenses: ${error?.message || error}`);
    return [];
  }
}

export async function deleteExpenseApi(id) {
  try {
    const response = await apiDelete(
      (API_ENDPOINTS.EXPENSES_DELETE || "/api/expenses/:id").replace(":id", id),
    );
    return response?.data || response || null;
  } catch (error) {
    throw new Error(error?.message || "Failed to delete expense");
  }
}
