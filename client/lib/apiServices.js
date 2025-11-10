import { apiGet, apiPost, apiPut, apiDelete } from "./api";
import { API_ENDPOINTS } from "./apiConfig";

export async function getService(id) {
  try {
    const response = await apiGet(
      API_ENDPOINTS.SERVICES_GET.replace(":id", id),
    );
    return response.data || null;
  } catch (error) {
    throw new Error(error.message || "Failed to get service");
  }
}

export async function getAllServices() {
  try {
    const response = await apiGet(API_ENDPOINTS.SERVICES_LIST);
    return response.data || [];
  } catch (error) {
    console.warn(`Failed to get services: ${error?.message || error}`);
    return [];
  }
}

export async function getPublishedServices() {
  try {
    const response = await apiGet(API_ENDPOINTS.SERVICES_PUBLISHED);
    return response.data || [];
  } catch (error) {
    console.warn(
      `Failed to get published services: ${error?.message || error}`,
    );
    return [];
  }
}

export async function createService(serviceData) {
  try {
    const response = await apiPost(API_ENDPOINTS.SERVICES_CREATE, {
      name: serviceData.name,
      description: serviceData.description,
      category: serviceData.category,
      basePrice: serviceData.basePrice,
      currency: serviceData.currency,
      duration: serviceData.duration,
      availability: serviceData.availability,
    });

    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to create service");
  }
}

export async function updateService(id, serviceData) {
  try {
    const response = await apiPut(
      API_ENDPOINTS.SERVICES_UPDATE.replace(":id", id),
      {
        name: serviceData.name,
        description: serviceData.description,
        category: serviceData.category,
        basePrice: serviceData.basePrice,
        currency: serviceData.currency,
        duration: serviceData.duration,
        availability: serviceData.availability,
        isActive: serviceData.isActive,
      },
    );

    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to update service");
  }
}

export async function deleteService(id) {
  try {
    const response = await apiDelete(
      API_ENDPOINTS.SERVICES_DELETE.replace(":id", id),
    );
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to delete service");
  }
}
