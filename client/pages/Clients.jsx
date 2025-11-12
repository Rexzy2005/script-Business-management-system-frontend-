import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { getClients, addClient, getBookings, getServices } from "@/lib/data";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { X, Star, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

export default function Clients() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [clients, setClients] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const loadData = async () => {
      const clientsData = await getClients();
      const bookingsData = await getBookings();
      const servicesData = await getServices();
      setClients(clientsData);
      setBookings(bookingsData);
      setServices(servicesData);
    };
    loadData();

    // listen for updates from bookings creation
    const onUpdated = async () => {
      const clientsData = await getClients();
      const bookingsData = await getBookings();
      setClients(clientsData);
      setBookings(bookingsData);
    };
    if (typeof window !== "undefined" && window.addEventListener) {
      window.addEventListener("bookings:updated", onUpdated);
      window.addEventListener("clients:updated", onUpdated);
    }
    return () => {
      if (typeof window !== "undefined" && window.removeEventListener) {
        window.removeEventListener("bookings:updated", onUpdated);
        window.removeEventListener("clients:updated", onUpdated);
      }
    };
  }, []);

  const handleOpenForm = () => {
    setFormData({ name: "", email: "", phone: "" });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      return toast.error("Please enter client name");
    }

    addClient({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      totalBookings: 0,
      totalSpent: 0,
    });

    const updatedClients = await getClients();
    setClients(updatedClients);
    setShowForm(false);
    toast.success("Client added successfully");
  };

  const handleClientClick = (client) => {
    setSelectedClient(client);
    setShowDetails(true);
  };

  const getClientBookings = (clientName) => {
    return bookings.filter((b) => b.clientName === clientName);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">
              Clients & CRM
            </h1>
            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
              Manage your client relationships and booking history.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full md:w-auto">
            <Button
              size="sm"
              onClick={handleOpenForm}
              className="w-full md:w-auto text-xs md:text-sm"
            >
              Add client
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="w-full md:w-auto text-xs md:text-sm"
            >
              Back to dashboard
            </Button>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {clients.map((client) => {
            const clientBookings = getClientBookings(client.name);
            const totalSpent = clientBookings.reduce(
              (sum, b) => sum + (b.amount || 0),
              0,
            );
            return (
              <div
                key={client.id}
                onClick={() => handleClientClick(client)}
                className="p-4 bg-card border border-border rounded-lg hover:border-primary/50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm md:text-base">
                      {client.name}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {client.email || "No email"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {client.phone || "No phone"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      Total bookings
                    </div>
                    <div className="text-lg font-bold">
                      {clientBookings.length}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Total spent
                  </span>
                  <span className="text-sm font-semibold">
                    ₦{totalSpent.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {clients.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              No clients yet. Add your first client to get started.
            </p>
            <Button onClick={handleOpenForm} className="mt-4">
              Add your first client
            </Button>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-lg p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add new client</h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <label className="block mt-4">
              <div className="text-xs md:text-sm font-medium mb-2">
                Client name
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Full name"
              />
            </label>

            <label className="block mt-3">
              <div className="text-xs md:text-sm font-medium mb-2">Email</div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="client@email.com"
              />
            </label>

            <label className="block mt-3">
              <div className="text-xs md:text-sm font-medium mb-2">Phone</div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0801 234 5678"
              />
            </label>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Add client
              </Button>
            </div>
          </form>
        </div>
      )}

      {showDetails && selectedClient && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Client details</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-xs text-muted-foreground">Name</div>
                <div className="text-sm font-medium">{selectedClient.name}</div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground">Email</div>
                <div className="text-sm font-medium flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  {selectedClient.email || "Not provided"}
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground">Phone</div>
                <div className="text-sm font-medium flex items-center gap-2">
                  <Phone className="w-3 h-3" />
                  {selectedClient.phone || "Not provided"}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="font-semibold text-sm mb-3">Booking history</h4>
                {(() => {
                  const clientBookings = getClientBookings(selectedClient.name);
                  return clientBookings.length > 0 ? (
                    <div className="space-y-2">
                      {clientBookings.map((booking) => {
                        const service = services.find(
                          (s) => s.id === booking.serviceId,
                        );
                        return (
                          <div
                            key={booking.id}
                            className="p-2 bg-background rounded text-xs"
                          >
                            <div className="font-medium">{service?.name}</div>
                            <div className="text-muted-foreground">
                              {booking.date} {booking.time}
                            </div>
                            <div className="font-semibold">
                              ₦{booking.amount}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      No bookings yet
                    </p>
                  );
                })()}
              </div>

              <div className="border-t border-border pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Total bookings
                    </div>
                    <div className="text-lg font-bold">
                      {getClientBookings(selectedClient.name).length}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Total spent
                    </div>
                    <div className="text-lg font-bold">
                      ₦
                      {getClientBookings(selectedClient.name)
                        .reduce((sum, b) => sum + (b.amount || 0), 0)
                        .toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(false)}
              className="w-full mt-4"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </Layout>
  );
}
