import { apiGet, apiPut } from "./api";
import { API_ENDPOINTS } from "./apiConfig";

export async function getBusinessProfile() {
  try {
    const response = await apiGet(API_ENDPOINTS.BUSINESS_PROFILE);
    return response?.data || response || null;
  } catch (error) {
    throw new Error(error.message || "Failed to get business profile");
  }
}

export async function updateBusinessProfile(profileData) {
  try {
    const response = await apiPut(API_ENDPOINTS.BUSINESS_PROFILE, profileData);
    return response?.data || response || null;
  } catch (error) {
    throw new Error(error.message || "Failed to update business profile");
  }
}

export async function getBusinessPreferences() {
  try {
    const response = await apiGet(API_ENDPOINTS.BUSINESS_PREFERENCES);
    return response?.data || response || null;
  } catch (error) {
    throw new Error(error.message || "Failed to get business preferences");
  }
}

export async function updateBusinessPreferences(preferences) {
  try {
    const response = await apiPut(
      API_ENDPOINTS.BUSINESS_PREFERENCES,
      preferences,
    );
    return response?.data || response || null;
  } catch (error) {
    throw new Error(error.message || "Failed to update business preferences");
  }
}
