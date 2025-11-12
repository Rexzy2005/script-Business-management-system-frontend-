import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  getBookings,
  updateBooking,
  getServices,
  addBooking,
} from "@/lib/data";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { toast } from "sonner";
import BookingFilters from "@/components/bookings/BookingFilters";
import BookingTable from "@/components/bookings/BookingTable";
import { useTranslation } from "@/hooks/useTranslation";

export default function Schedule() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);

  const [showNewBooking, setShowNewBooking] = useState(false);
  const [newBooking, setNewBooking] = useState({
    clientName: "",
    serviceId: "",
    date: new Date().toISOString().slice(0, 10),
    time: "09:00",
    amount: 0,
    status: "pending",
    hasPaid: false,
    paymentMethod: "",
  });

  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const loadData = async () => {
      const bookingsData = await getBookings();
      const servicesData = await getServices();
      setBookings(bookingsData);
      setServices(servicesData);
      // preselect first service for new booking
      if (servicesData && servicesData.length > 0) {
        const first = servicesData[0];
        setNewBooking((b) => ({
          ...b,
          serviceId: first.id,
          amount: first.price || 0,
        }));
      }
    };
    loadData();
  }, []);

  const openNewBooking = () => {
    const first = services[0];
    setNewBooking((b) => ({
      ...b,
      clientName: "",
      serviceId: first?.id || b.serviceId || "",
      amount: first?.price || b.amount || 0,
      date: new Date().toISOString().slice(0, 10),
      time: "09:00",
      status: "pending",
      hasPaid: false,
      paymentMethod: "",
    }));
    setShowNewBooking(true);
  };

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setShowBookingDetails(true);
  };

  const handleStatusChange = async (status) => {
    if (selectedBooking) {
      await updateBooking(selectedBooking.id, { status });
      const updatedBookings = await getBookings();
      setBookings(updatedBookings);
      setSelectedBooking({ ...selectedBooking, status });
      toast.success(`Booking status updated to ${status}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "canceled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Simple metrics for bookings list
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(
    (b) => b.status === "confirmed",
  ).length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const totalRevenue = bookings.reduce(
    (sum, b) => sum + (Number(b.amount) || 0),
    0,
  );

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus !== "all" && b.status !== filterStatus) return false;
    if (query && query.trim().length > 0) {
      const service = services.find((s) => s.id === b.serviceId);
      const hay =
        `${b.clientName || ""} ${b.id || ""} ${service?.name || ""}`.toLowerCase();
      if (!hay.includes(query.toLowerCase())) return false;
    }
    return true;
  });

  const [isLoading, setIsLoading] = useState(false);

  const refresh = async () => {
    setIsLoading(true);
    try {
      const [b, s] = await Promise.all([getBookings(), getServices()]);
      setBookings(b);
      setServices(s);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // initial load handled earlier; ensure refresh is available
  }, []);

  function BookingStats() {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-3 bg-card border border-border rounded-lg">
          <div className="text-xs text-muted-foreground">Total bookings</div>
          <div className="text-xl font-bold">{totalBookings}</div>
        </div>
        <div className="p-3 bg-card border border-border rounded-lg">
          <div className="text-xs text-muted-foreground">Confirmed</div>
          <div className="text-xl font-bold">{confirmedBookings}</div>
        </div>
        <div className="p-3 bg-card border border-border rounded-lg">
          <div className="text-xs text-muted-foreground">Pending</div>
          <div className="text-xl font-bold">{pendingBookings}</div>
        </div>
      </div>
    );
  }

  return (
    <Layout fullWidth>
      <div className="w-full px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">Bookings</h1>
            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
              Manage your bookings and appointments.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/dashboard")}
            >
              Back to dashboard
            </Button>
            <Button size="sm" onClick={openNewBooking}>
              New booking
            </Button>
          </div>
        </div>

        {/* Stats and Actions */}
        <div className="mb-6">
          <BookingStats />
        </div>

        {/* Filters + Table */}
        <div className="bg-card border border-border rounded-lg p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <BookingFilters
                query={query}
                setQuery={setQuery}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                onClear={() => {
                  setQuery("");
                  setFilterStatus("all");
                }}
                onRefresh={async () => {
                  await refresh();
                  toast.success("Refreshed");
                }}
                onNew={openNewBooking}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-muted-foreground mr-2">
                Total revenue
              </div>
              <div className="font-semibold">
                ₦{totalRevenue.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <BookingTable
              bookings={filteredBookings}
              services={services}
              isLoading={isLoading}
              onConfirm={async (b) => {
                try {
                  await updateBooking(b.id, { status: "confirmed" });
                  await refresh();
                  toast.success("Confirmed");
                } catch (err) {
                  console.error(err);
                  toast.error("Failed to confirm");
                }
              }}
              onView={(b) => handleBookingClick(b)}
            />
          </div>
        </div>

        {/* Details modal */}
        {showBookingDetails && selectedBooking && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
            <div className="bg-card border border-border rounded-lg p-6 w-full max-w-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Booking details</h3>
                <button onClick={() => setShowBookingDetails(false)}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground">Client</div>
                    <div className="text-sm font-medium">
                      {selectedBooking.clientName}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground">Service</div>
                    <div className="text-sm font-medium">
                      {
                        services.find((s) => s.id === selectedBooking.serviceId)
                          ?.name
                      }
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground">Date</div>
                      <div className="text-sm font-medium">
                        {selectedBooking.date}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Time</div>
                      <div className="text-sm font-medium">
                        {selectedBooking.time}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground">Amount</div>
                    <div className="text-lg font-bold">
                      ₦{selectedBooking.amount}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground">Payment</div>
                    <div className="text-sm">
                      {selectedBooking.hasPaid ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
                            Paid
                          </span>
                          {selectedBooking.paymentMethod && (
                            <span className="text-muted-foreground">
                              {selectedBooking.paymentMethod}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                          Not paid
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-1">
                  <div className="text-xs text-muted-foreground mb-2">
                    Status
                  </div>
                  <div
                    className={`text-xs px-2 py-1 rounded border ${getStatusColor(selectedBooking.status)}`}
                  >
                    {selectedBooking.status}
                  </div>

                  <div className="mt-4 space-y-2">
                    <Button
                      size="sm"
                      variant={
                        selectedBooking.status === "confirmed"
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handleStatusChange("confirmed")}
                      className="w-full"
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        selectedBooking.status === "pending"
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handleStatusChange("pending")}
                      className="w-full"
                    >
                      Mark pending
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        selectedBooking.status === "canceled"
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handleStatusChange("canceled")}
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBookingDetails(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* New booking modal (unchanged) */}
        {showNewBooking && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  // derive amount from selected service to ensure consistency
                  const svc =
                    services.find((s) => s.id === newBooking.serviceId) || {};
                  await addBooking({
                    clientName: newBooking.clientName,
                    serviceId: newBooking.serviceId,
                    date: newBooking.date,
                    time: newBooking.time,
                    amount: Number(svc.price || newBooking.amount) || 0,
                    status: newBooking.status,
                    hasPaid: !!newBooking.hasPaid,
                    paymentMethod: newBooking.paymentMethod || "",
                  });
                  await refresh();
                  setShowNewBooking(false);
                  setNewBooking({
                    clientName: "",
                    serviceId: services[0]?.id || "",
                    date: new Date().toISOString().slice(0, 10),
                    time: "09:00",
                    amount: services[0]?.price || 0,
                    status: "pending",
                    hasPaid: false,
                    paymentMethod: "",
                  });
                  toast.success("Booking created");
                } catch (err) {
                  console.error(err);
                  toast.error("Failed to create booking");
                }
              }}
              className="bg-card border border-border rounded-lg p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-semibold">New booking</h3>

              <label className="block mt-3 text-xs">
                <div className="font-medium mb-1">Service</div>
                <select
                  value={newBooking.serviceId}
                  onChange={(e) => {
                    const sid = e.target.value;
                    const svc = services.find((s) => s.id === sid) || {};
                    setNewBooking((b) => ({
                      ...b,
                      serviceId: sid,
                      amount: svc.price || 0,
                    }));
                  }}
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm"
                  required
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — ₦{s.price}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block mt-3 text-xs">
                <div className="font-medium mb-1">Client name</div>
                <input
                  value={newBooking.clientName}
                  onChange={(e) =>
                    setNewBooking((b) => ({ ...b, clientName: e.target.value }))
                  }
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm"
                  required
                />
              </label>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <label className="text-xs">
                  <div className="font-medium mb-1">Date</div>
                  <input
                    type="date"
                    value={newBooking.date}
                    onChange={(e) =>
                      setNewBooking((b) => ({ ...b, date: e.target.value }))
                    }
                    className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm"
                    required
                  />
                </label>

                <label className="text-xs">
                  <div className="font-medium mb-1">Time</div>
                  <input
                    type="time"
                    value={newBooking.time}
                    onChange={(e) =>
                      setNewBooking((b) => ({ ...b, time: e.target.value }))
                    }
                    className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm"
                    required
                  />
                </label>
              </div>

              <label className="block mt-3 text-xs">
                <div className="font-medium mb-1">Amount (NGN)</div>
                <input
                  type="number"
                  value={newBooking.amount}
                  readOnly
                  className="w-full rounded-md border border-border px-3 py-2 bg-muted/10 text-xs md:text-sm"
                />
              </label>

              {/* Payment info */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="text-xs flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newBooking.hasPaid}
                    onChange={(e) =>
                      setNewBooking((b) => ({
                        ...b,
                        hasPaid: e.target.checked,
                        paymentMethod: e.target.checked ? b.paymentMethod : "",
                      }))
                    }
                  />
                  <span className="font-medium">Client has paid</span>
                </label>

                <label className="text-xs">
                  <div className="font-medium mb-1">Payment method</div>
                  <select
                    value={newBooking.paymentMethod}
                    onChange={(e) =>
                      setNewBooking((b) => ({
                        ...b,
                        paymentMethod: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm"
                    disabled={!newBooking.hasPaid}
                  >
                    <option value="">Select method</option>
                    <option value="cash">Cash</option>
                    <option value="transfer">Transfer</option>
                  </select>
                </label>
              </div>

              <div className="mt-4 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewBooking(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Create booking
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}
