import { API_ENDPOINTS } from "./apiConfig";
import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  apiCall,
  getApiBaseUrl,
  getAuthToken,
} from "./api";

/**
 * Create a new product
 */
export async function createProduct(productData) {
  try {
    const response = await apiPost(API_ENDPOINTS.PRODUCTS_CREATE, {
      name: productData.name,
      description: productData.description,
      category: productData.category,
      sku: productData.sku,
      unitPrice: productData.unitPrice,
      costPrice: productData.costPrice,
      quantityInStock: productData.quantityInStock,
      unitType: productData.unitType,
      lowStockThreshold: productData.lowStockThreshold,
    });
    return response?.data || response || null;
  } catch (error) {
    throw new Error(error.message || "Failed to create product");
  }
}

/**
 * Get all products
 */
export async function getAllProducts() {
  try {
    const response = await apiGet(API_ENDPOINTS.PRODUCTS_LIST);
    return response?.data || [];
  } catch (error) {
    console.warn(`Failed to get products: ${error?.message || error}`);
    return [];
  }
}

/**
 * Get out of stock products (using low-stock endpoint)
 */
export async function getOutOfStock() {
  try {
    const response = await apiGet(API_ENDPOINTS.PRODUCTS_LOW_STOCK);
    return response?.data || [];
  } catch (error) {
    console.warn(
      `Failed to get out-of-stock products: ${error?.message || error}`,
    );
    return [];
  }
}

/**
 * Get low stock products
 */
export async function getLowStock() {
  try {
    const response = await apiGet(API_ENDPOINTS.PRODUCTS_LOW_STOCK);
    return response?.data || [];
  } catch (error) {
    console.warn(
      `Failed to get low-stock products: ${error?.message || error}`,
    );
    return [];
  }
}

/**
 * Get single product by ID
 */
export async function getProduct(id) {
  try {
    const response = await apiGet(
      API_ENDPOINTS.PRODUCTS_GET.replace(":id", id),
    );
    return response?.data || null;
  } catch (error) {
    throw new Error(error.message || "Failed to get product");
  }
}

/**
 * Update product information
 */
export async function updateProduct(id, productData) {
  try {
    const response = await apiPut(
      API_ENDPOINTS.PRODUCTS_UPDATE.replace(":id", id),
      {
        name: productData.name,
        description: productData.description,
        category: productData.category,
        sku: productData.sku,
        unitPrice: productData.unitPrice,
        costPrice: productData.costPrice,
        unitType: productData.unitType,
        lowStockThreshold: productData.lowStockThreshold,
      },
    );
    return response?.data || response || null;
  } catch (error) {
    throw new Error(error.message || "Failed to update product");
  }
}

/**
 * Delete product (soft delete)
 */
export async function deleteProduct(id) {
  try {
    const response = await apiDelete(
      API_ENDPOINTS.PRODUCTS_DELETE.replace(":id", id),
    );
    return response || null;
  } catch (error) {
    throw new Error(error.message || "Failed to delete product");
  }
}

/**
 * Update product stock (PATCH request)
 */
export async function updateStock(id, quantityChange, reason = "") {
  try {
    const response = await apiCall(
      API_ENDPOINTS.PRODUCTS_STOCK_UPDATE.replace(":id", id),
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantityChange,
          reason,
        }),
      },
    );
    return response?.data || response || null;
  } catch (error) {
    throw new Error(error.message || "Failed to update stock");
  }
}

/**
 * Get product statistics
 */
export async function getStatistics() {
  try {
    const response = await apiGet(API_ENDPOINTS.PRODUCTS_STATS);
    return response?.data || {};
  } catch (error) {
    console.warn(
      `Failed to fetch inventory statistics: ${error?.message || error}`,
    );
    return {};
  }
}

/**
 * Export inventory as CSV string
 * This builds a CSV from the products list so the frontend can trigger a download.
 */
export async function exportInventory() {
  try {
    const response = await apiGet(API_ENDPOINTS.PRODUCTS_LIST);
    const items = response?.data || [];

    // Define CSV headers
    const headers = [
      "sku",
      "name",
      "qty",
      "unitType",
      "pricePerPiece",
      "bulkPrice",
      "value",
      "lowStockThreshold",
      "saleType",
    ];

    const escapeCsv = (val) => {
      if (val === null || typeof val === "undefined") return "";
      const s = String(val);
      // escape double quotes
      if (s.includes(",") || s.includes("\n") || s.includes('"')) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };

    const rows = items.map((it) =>
      headers.map((h) => escapeCsv(it[h] ?? "")).join(","),
    );

    return [headers.join(","), ...rows].join("\n");
  } catch (error) {
    throw new Error(error?.message || "Failed to export inventory");
  }
}

/**
 * Get top selling products (if backend provides it under products stats)
 */
export async function getTopSelling() {
  try {
    const response = await apiGet(API_ENDPOINTS.PRODUCTS_STATS);
    return response?.data?.topSelling || [];
  } catch (error) {
    console.warn(
      `Failed to get top selling products: ${error?.message || error}`,
    );
    return [];
  }
}
