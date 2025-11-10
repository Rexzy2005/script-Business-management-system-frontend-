import { apiGet, apiPost, apiPut } from "./api";
import { API_ENDPOINTS } from "./apiConfig";

export async function createBooking(booking) {
  try {
    const payload = {
      serviceId: booking.serviceId,
      bookingDate: booking.bookingDate,
      startTime: booking.startTime,
      endTime: booking.endTime,
      duration: booking.duration,
      customerNotes: booking.customerNotes || "",
      selectedAddOns: booking.selectedAddOns || [],
      location: booking.location || undefined,
    };

    const response = await apiPost(API_ENDPOINTS.BOOKINGS_CREATE, payload);
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to create booking");
  }
}

export async function getBookingsFromApi() {
  try {
    const response = await apiGet(API_ENDPOINTS.BOOKINGS_LIST);
    return response.data || [];
  } catch (error) {
    console.warn(`Failed to fetch bookings: ${error?.message || error}`);
    return [];
  }
}

export async function updateBookingApi(id, updates) {
  try {
    const response = await apiPut(
      API_ENDPOINTS.BOOKINGS_UPDATE.replace(":id", id),
      updates,
    );
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to update booking");
  }
}
