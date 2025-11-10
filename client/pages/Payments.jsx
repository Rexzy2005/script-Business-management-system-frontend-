import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { getBookings, getServices } from "@/lib/data";
import { useNavigate } from "react-router-dom";
import { Download, Eye, X } from "lucide-react";
import { toast } from "sonner";

export default function Payments() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const bookingsData = await getBookings();
      const servicesData = await getServices();
      setBookings(bookingsData);
      setServices(servicesData);
    };
    loadData();

    const onUpdated = async () => {
      const bookingsData = await getBookings();
      setBookings(bookingsData);
    };
    if (typeof window !== "undefined" && window.addEventListener) {
      window.addEventListener("bookings:updated", onUpdated);
    }
    return () => {
      if (typeof window !== "undefined" && window.removeEventListener) {
        window.removeEventListener("bookings:updated", onUpdated);
      }
    };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatus = (booking) => {
    const bookingDate = new Date(booking.date);
    const today = new Date();
    const daysDifference = Math.floor(
      (today - bookingDate) / (1000 * 60 * 60 * 24),
    );

    if (booking.status === "canceled") return "canceled";
    if (bookingDate > today || daysDifference < 7) return "pending";
    if (daysDifference > 30) return "overdue";
    return "paid";
  };

  const filteredBookings =
    filterStatus === "all"
      ? bookings
      : bookings.filter((b) => getPaymentStatus(b) === filterStatus);

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);
  const paidAmount = bookings
    .filter((b) => getPaymentStatus(b) === "paid")
    .reduce((sum, b) => sum + (b.amount || 0), 0);
  const pendingAmount = bookings
    .filter((b) => getPaymentStatus(b) === "pending")
    .reduce((sum, b) => sum + (b.amount || 0), 0);
  const overdueAmount = bookings
    .filter((b) => getPaymentStatus(b) === "overdue")
    .reduce((sum, b) => sum + (b.amount || 0), 0);

  const handleViewInvoice = (booking) => {
    setSelectedInvoice(booking);
    setShowInvoice(true);
  };

  const handleDownloadInvoice = (booking) => {
    const service = services.find((s) => s.id === booking.serviceId);
    const invoiceContent = `
INVOICE
========
Invoice ID: INV-${booking.id}
Date: ${booking.date}

Client: ${booking.clientName}
Service: ${service?.name}
Amount: ₦${booking.amount}
Status: ${getPaymentStatus(booking)}

Payment Terms: Due within 30 days
    `;

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(invoiceContent),
    );
    element.setAttribute("download", `invoice-${booking.id}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Invoice downloaded");
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">
              Payments & Invoices
            </h1>
            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
              Track and manage your payment history.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="w-full md:w-auto text-xs md:text-sm"
          >
            Back to dashboard
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="text-xs md:text-sm text-muted-foreground">
              Total revenue
            </div>
            <div className="text-xl md:text-2xl font-bold mt-2">
              ₦{totalRevenue.toLocaleString()}
            </div>
          </div>

          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="text-xs md:text-sm text-muted-foreground">Paid</div>
            <div className="text-xl md:text-2xl font-bold mt-2 text-green-600">
              ₦{paidAmount.toLocaleString()}
            </div>
          </div>

          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="text-xs md:text-sm text-muted-foreground">
              Pending
            </div>
            <div className="text-xl md:text-2xl font-bold mt-2 text-yellow-600">
              ₦{pendingAmount.toLocaleString()}
            </div>
          </div>

          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="text-xs md:text-sm text-muted-foreground">
              Overdue
            </div>
            <div className="text-xl md:text-2xl font-bold mt-2 text-red-600">
              ₦{overdueAmount.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Button
              size="sm"
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => setFilterStatus("all")}
              className="text-xs"
            >
              All ({bookings.length})
            </Button>
            <Button
              size="sm"
              variant={filterStatus === "paid" ? "default" : "outline"}
              onClick={() => setFilterStatus("paid")}
              className="text-xs"
            >
              Paid (
              {bookings.filter((b) => getPaymentStatus(b) === "paid").length})
            </Button>
            <Button
              size="sm"
              variant={filterStatus === "pending" ? "default" : "outline"}
              onClick={() => setFilterStatus("pending")}
              className="text-xs"
            >
              Pending (
              {bookings.filter((b) => getPaymentStatus(b) === "pending").length}
              )
            </Button>
            <Button
              size="sm"
              variant={filterStatus === "overdue" ? "default" : "outline"}
              onClick={() => setFilterStatus("overdue")}
              className="text-xs"
            >
              Overdue (
              {bookings.filter((b) => getPaymentStatus(b) === "overdue").length}
              )
            </Button>
          </div>

          <div className="space-y-3">
            {filteredBookings.map((booking) => {
              const service = services.find((s) => s.id === booking.serviceId);
              const status = getPaymentStatus(booking);
              return (
                <div
                  key={booking.id}
                  className="p-4 bg-card border border-border rounded-lg flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm md:text-base">
                      {booking.clientName}
                    </h3>
                    <div className="text-xs md:text-sm text-muted-foreground mt-1">
                      INV-{booking.id} • {service?.name} • {booking.date}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${getStatusColor(status)}`}
                      >
                        {status}
                      </span>
                    </div>
                  </div>

                  <div className="text-right mr-4">
                    <div className="text-xl md:text-2xl font-bold">
                      ₦{booking.amount}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewInvoice(booking)}
                      className="text-xs"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadInvoice(booking)}
                      className="text-xs"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showInvoice && selectedInvoice && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Invoice details</h3>
              <button
                onClick={() => setShowInvoice(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-xs text-muted-foreground">Invoice ID</div>
                <div className="text-sm font-medium">
                  INV-{selectedInvoice.id}
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground">Client</div>
                <div className="text-sm font-medium">
                  {selectedInvoice.clientName}
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground">Service</div>
                <div className="text-sm font-medium">
                  {
                    services.find((s) => s.id === selectedInvoice.serviceId)
                      ?.name
                  }
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Date</div>
                  <div className="text-sm font-medium">
                    {selectedInvoice.date}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Time</div>
                  <div className="text-sm font-medium">
                    {selectedInvoice.time}
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Amount</span>
                  <span className="text-lg font-bold">
                    ₦{selectedInvoice.amount}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground mb-1">Status</div>
                <span
                  className={`text-xs px-2 py-1 rounded ${getStatusColor(getPaymentStatus(selectedInvoice))}`}
                >
                  {getPaymentStatus(selectedInvoice)}
                </span>
              </div>

              <div className="bg-background p-3 rounded text-xs">
                <div className="font-semibold mb-2">Payment terms</div>
                <p>Due within 30 days of invoice date</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadInvoice(selectedInvoice)}
                className="text-xs"
              >
                Download
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInvoice(false)}
                className="text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
