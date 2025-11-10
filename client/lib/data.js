import {
  getAllServices,
  createService as apiCreateService,
  updateService as apiUpdateService,
  deleteService as apiDeleteService,
} from "./apiServices";
import * as apiInventory from "./apiInventory";

import { apiPost } from "./api";
import { API_ENDPOINTS } from "./apiConfig";

const INVENTORY_KEY = "script_inventory";
const SALES_KEY = "script_sales";

let inventoryCache = null;
let salesCache = null;

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export async function getInventory() {
  try {
    const products = await apiInventory.getAllProducts();
    if (products && products.length > 0) {
      inventoryCache = products.map((p) => ({
        sku: p.productId,
        name: p.name,
        qty: p.quantity,
        value: `₦${(p.quantity * p.unitPrice).toLocaleString()}`,
        _id: p._id,
        ...p,
      }));
      return inventoryCache;
    }
  } catch (error) {
    console.warn(
      "Failed to fetch inventory from API, using local storage:",
      error,
    );
  }

  return inventoryCache || read(INVENTORY_KEY, []);
}

export function saveInventory(items) {
  inventoryCache = items;
  write(INVENTORY_KEY, items);
}

export async function addInventoryItem(item) {
  try {
    // map UI item to backend product representation
    const payload = {
      productId: item.productId || item.sku || `P-${Date.now()}`,
      name: item.name,
      quantity: Number(item.qty) || 0,
      unitPrice: Number(item.pricePerPiece) || Number(item.bulkPrice) || 0,
      saleType: item.saleType || "bulk",
      piecesPerProduct: Number(item.piecesPerProduct) || 1,
      costPrice: Number(item.costPrice) || 0,
      category: item.category || "",
      description: item.description || "",
    };
    await apiPost(API_ENDPOINTS.INVENTORY_LIST, payload);
  } catch (err) {
    console.warn(
      "Failed to create product on API, falling back to local cache:",
      err,
    );
    const items = await getInventory();
    items.unshift(item);
    saveInventory(items);
  }
}

export async function updateInventoryQty(sku, delta) {
  const items = await getInventory();
  const idx = items.findIndex((i) => i.sku === sku);
  if (idx === -1) return false;

  const newQty = Math.max(0, items[idx].qty + delta);
  const item = items[idx];

  try {
    if (item._id) {
      if (delta < 0) {
        try {
          // record removal using API that maintains stockHistory
          await apiInventory.removeStock(
            item._id,
            Math.abs(delta),
            "Adjustment from app",
          );
        } catch (e) {
          // fallback to direct update if removeStock not available
          await apiInventory.updateProduct(item._id, {
            ...item,
            quantity: newQty,
          });
        }
      } else {
        await apiInventory.updateProduct(item._id, {
          ...item,
          quantity: newQty,
        });
      }
    }
  } catch (error) {
    console.warn("Failed to update quantity on API, updating locally:", error);
  }

  items[idx].qty = newQty;
  saveInventory(items);
  return true;
}

export function getSales() {
  if (salesCache) return salesCache;
  return read(SALES_KEY, []);
}

export function addSale(sale) {
  const entries = getSales();
  const record = {
    ...sale,
    id: `S-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  entries.unshift(record);
  salesCache = entries;
  write(SALES_KEY, entries);
  return record;
}

const BOOKINGS_KEY = "script_bookings";
const SERVICES_KEY = "script_services";
const CLIENTS_KEY = "script_clients";

const DEFAULT_SERVICES = [];

const DEFAULT_BOOKINGS = [];

const DEFAULT_CLIENTS = [];

let servicesCache = null;
let bookingsCache = null;
let clientsCache = null;

export async function getServices() {
  try {
    const services = await getAllServices();
    if (services && services.length > 0) {
      servicesCache = services.map((s) => ({
        id: s._id || s.id,
        name: s.name,
        description: s.description,
        price: s.basePrice,
        duration: s.duration?.value || 60,
        status: s.isActive ? "active" : "inactive",
        ...s,
      }));
      return servicesCache;
    }
  } catch (error) {
    console.warn(
      "Failed to fetch services from API, using local storage:",
      error,
    );
  }

  return servicesCache || read(SERVICES_KEY, DEFAULT_SERVICES);
}

export function saveServices(services) {
  servicesCache = services;
  write(SERVICES_KEY, services);
}

export async function addService(service) {
  try {
    const response = await apiCreateService({
      name: service.name,
      description: service.description,
      category: service.category || "uncategorized",
      basePrice: service.price,
      currency: "NGN",
      duration: { value: service.duration || 60, unit: "minutes" },
    });

    const newService = {
      id: response.data?._id || `s${Date.now()}`,
      ...service,
    };
    const services = await getServices();
    services.unshift(newService);
    saveServices(services);
    return newService;
  } catch (error) {
    console.warn("Failed to create service on API, creating locally:", error);
    const services = await getServices();
    const newService = { ...service, id: `s${Date.now()}` };
    services.unshift(newService);
    saveServices(services);
    return newService;
  }
}

export async function updateService(id, updates) {
  try {
    await apiUpdateService(id, {
      name: updates.name,
      description: updates.description,
      category: updates.category,
      basePrice: updates.price,
      currency: "NGN",
      duration: { value: updates.duration || 60, unit: "minutes" },
      isActive: updates.status === "active",
    });
  } catch (error) {
    console.warn("Failed to update service on API, updating locally:", error);
  }

  const services = await getServices();
  const idx = services.findIndex((s) => s.id === id);
  if (idx !== -1) {
    services[idx] = { ...services[idx], ...updates };
    saveServices(services);
    return services[idx];
  }
  return null;
}

export async function deleteService(id) {
  try {
    await apiDeleteService(id);
  } catch (error) {
    console.warn("Failed to delete service on API, deleting locally:", error);
  }

  const services = await getServices();
  const filtered = services.filter((s) => s.id !== id);
  saveServices(filtered);
}

import {
  createBooking as apiCreateBooking,
  getBookingsFromApi,
  updateBookingApi,
} from "./apiBookings";

export async function getBookings() {
  if (bookingsCache) return bookingsCache;

  try {
    const apiBookings = await getBookingsFromApi();
    if (apiBookings && apiBookings.length > 0) {
      bookingsCache = apiBookings.map((b) => ({ ...b, id: b._id || b.id }));
      saveBookings(bookingsCache);
      return bookingsCache;
    }
  } catch (e) {
    console.warn("Failed to load bookings from API, falling back to local:", e);
  }

  return read(BOOKINGS_KEY, DEFAULT_BOOKINGS);
}

export function saveBookings(bookings) {
  bookingsCache = bookings;
  write(BOOKINGS_KEY, bookings);
}

export async function addBooking(booking) {
  try {
    const response = await apiCreateBooking(booking);
    const created = response?.data || response?.booking || null;
    if (created) {
      const bookings = (await getBookings()) || [];
      const newBooking = {
        ...created,
        id: created._id || created.id || `b${Date.now()}`,
      };
      bookings.unshift(newBooking);
      saveBookings(bookings);

      // Update client totals when booking is created
      try {
        const clients = (await getClients()) || [];
        const clientIndex = clients.findIndex(
          (c) =>
            c.name &&
            c.name.toLowerCase() ===
              (newBooking.clientName || "").toLowerCase(),
        );
        if (clientIndex !== -1) {
          const client = clients[clientIndex];
          clients[clientIndex] = {
            ...client,
            totalBookings: (client.totalBookings || 0) + 1,
            totalSpent:
              (client.totalSpent || 0) + (Number(newBooking.amount) || 0),
          };
        } else {
          // create a minimal client record if none exists
          clients.unshift({
            id: `c${Date.now()}`,
            name: newBooking.clientName || "",
            email: newBooking.clientEmail || "",
            phone: newBooking.clientPhone || "",
            totalBookings: 1,
            totalSpent: Number(newBooking.amount) || 0,
          });
        }
        saveClients(clients);
      } catch (err) {
        console.warn("Failed to update clients after booking creation:", err);
      }

      // notify UI that bookings and clients changed
      try {
        if (typeof window !== "undefined" && window.dispatchEvent) {
          window.dispatchEvent(
            new CustomEvent("bookings:updated", { detail: newBooking }),
          );
          window.dispatchEvent(
            new CustomEvent("clients:updated", { detail: clients }),
          );
        }
      } catch (e) {
        /* ignore */
      }

      return newBooking;
    }
  } catch (e) {
    console.warn("Failed to create booking via API, creating locally:", e);
  }

  const bookings = await getBookings();
  const newBooking = { ...booking, id: `b${Date.now()}` };
  bookings.unshift(newBooking);
  saveBookings(bookings);

  // Update clients locally as well
  try {
    const clients = getClients() || [];
    const clientIndex = clients.findIndex(
      (c) =>
        c.name &&
        c.name.toLowerCase() === (newBooking.clientName || "").toLowerCase(),
    );
    if (clientIndex !== -1) {
      const client = clients[clientIndex];
      clients[clientIndex] = {
        ...client,
        totalBookings: (client.totalBookings || 0) + 1,
        totalSpent: (client.totalSpent || 0) + (Number(newBooking.amount) || 0),
      };
    } else {
      clients.unshift({
        id: `c${Date.now()}`,
        name: newBooking.clientName || "",
        email: newBooking.clientEmail || "",
        phone: newBooking.clientPhone || "",
        totalBookings: 1,
        totalSpent: Number(newBooking.amount) || 0,
      });
    }
    saveClients(clients);
  } catch (err) {
    console.warn("Failed to update clients after local booking creation:", err);
  }

  return newBooking;
}

export async function updateBooking(id, updates) {
  const bookings = await getBookings();
  const idx = bookings.findIndex((b) => b.id === id);

  try {
    await updateBookingApi(id, updates);
  } catch (e) {
    console.warn("Failed to update booking via API, updating locally:", e);
  }

  if (idx !== -1) {
    bookings[idx] = { ...bookings[idx], ...updates };
    saveBookings(bookings);
    return bookings[idx];
  }
  return null;
}

export function getClients() {
  if (clientsCache) return clientsCache;
  return read(CLIENTS_KEY, DEFAULT_CLIENTS);
}

export function saveClients(clients) {
  clientsCache = clients;
  write(CLIENTS_KEY, clients);
}

export function addClient(client) {
  const clients = getClients();
  const newClient = { ...client, id: `c${Date.now()}` };
  clients.unshift(newClient);
  saveClients(clients);
  return newClient;
}

// Expenses Management
const EXPENSES_KEY = "script_expenses";

export function getExpenses() {
  return read(EXPENSES_KEY, []);
}

export function saveExpenses(expenses) {
  write(EXPENSES_KEY, expenses);
}

export function addExpense(expense) {
  const expenses = getExpenses();
  const newExpense = {
    ...expense,
    id: `e${Date.now()}`,
  };
  expenses.unshift(newExpense);
  saveExpenses(expenses);
  return newExpense;
}

export function deleteExpense(id) {
  const expenses = getExpenses();
  const filtered = expenses.filter((e) => e.id !== id);
  saveExpenses(filtered);
}
