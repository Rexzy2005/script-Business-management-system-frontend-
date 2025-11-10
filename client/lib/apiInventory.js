import { API_ENDPOINTS } from "./apiConfig";
import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  getApiBaseUrl,
  getAuthToken,
} from "./api";

export async function getAllProducts() {
  try {
    const response = await apiGet(API_ENDPOINTS.INVENTORY_LIST);
    return response.data || [];
  } catch (error) {
    console.warn(`Failed to get products: ${error?.message || error}`);
    return [];
  }
}

export async function getOutOfStock() {
  try {
    const response = await apiGet(API_ENDPOINTS.INVENTORY_OUT_OF_STOCK);
    return response.data || [];
  } catch (error) {
    console.warn(
      `Failed to get out-of-stock products: ${error?.message || error}`,
    );
    return [];
  }
}

export async function getLowStock() {
  try {
    const response = await apiGet(API_ENDPOINTS.INVENTORY_LOW_STOCK);
    return response.data || [];
  } catch (error) {
    console.warn(
      `Failed to get low-stock products: ${error?.message || error}`,
    );
    return [];
  }
}

export async function getProduct(id) {
  try {
    const response = await apiGet(
      API_ENDPOINTS.INVENTORY_GET.replace(":id", id),
    );
    return response.data || null;
  } catch (error) {
    throw new Error(error.message || "Failed to get product");
  }
}

export async function updateProduct(id, productData) {
  try {
    const response = await apiPut(
      API_ENDPOINTS.INVENTORY_UPDATE.replace(":id", id),
      {
        productId: productData.productId,
        name: productData.name,
        description: productData.description,
        category: productData.category,
        saleType: productData.saleType,
        unitPrice: productData.unitPrice,
        costPrice: productData.costPrice,
        quantity: productData.quantity,
        minStockLevel: productData.minStockLevel,
        unit: productData.unit,
      },
    );

    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to update product");
  }
}

export async function deleteProduct(id) {
  try {
    const response = await apiDelete(
      API_ENDPOINTS.INVENTORY_DELETE.replace(":id", id),
    );
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to delete product");
  }
}

export async function removeStock(id, quantity, reason) {
  try {
    const response = await apiPost(
      API_ENDPOINTS.INVENTORY_REMOVE_STOCK.replace(":id", id),
      {
        quantity,
        reason,
      },
    );

    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to remove stock");
  }
}

export async function exportInventory() {
  try {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}${API_ENDPOINTS.INVENTORY_EXPORT}`;

    const headers = {};
    const token = getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(url, { method: "GET", headers });
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(text || `Export failed: ${response.status}`);
    }

    const csv = await response.text();
    return csv;
  } catch (error) {
    throw new Error(error.message || "Failed to export inventory");
  }
}

export async function getStatistics() {
  try {
    const response = await apiGet(API_ENDPOINTS.INVENTORY_STATISTICS);
    return response.data || {};
  } catch (error) {
    console.warn(
      `Failed to fetch inventory statistics: ${error?.message || error}`,
    );
    return {};
  }
}

export async function getTopSelling() {
  try {
    const response = await apiGet(API_ENDPOINTS.INVENTORY_TOP_SELLING);
    return response.data || [];
  } catch (error) {
    console.warn(
      `Failed to fetch top-selling products: ${error?.message || error}`,
    );
    return [];
  }
}
