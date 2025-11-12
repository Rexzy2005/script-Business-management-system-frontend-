import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { getBookings, getServices } from "@/lib/data";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Reports() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [dateRange, setDateRange] = useState("month");

  useEffect(() => {
    const loadData = async () => {
      const bookingsData = await getBookings();
      const servicesData = await getServices();
      setBookings(bookingsData);
      setServices(servicesData);
    };
    loadData();
  }, []);

  // Prepare data for charts
  const getRevenueByDate = () => {
    const revenueMap = {};
    bookings.forEach((booking) => {
      const date = booking.date;
      if (!revenueMap[date]) {
        revenueMap[date] = { date, revenue: 0, bookings: 0 };
      }
      revenueMap[date].revenue += booking.amount;
      revenueMap[date].bookings += 1;
    });
    return Object.values(revenueMap).sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );
  };

  const getRevenueByService = () => {
    const serviceMap = {};
    bookings.forEach((booking) => {
      const service = services.find((s) => s.id === booking.serviceId);
      if (service) {
        if (!serviceMap[service.name]) {
          serviceMap[service.name] = {
            name: service.name,
            value: 0,
            bookings: 0,
          };
        }
        serviceMap[service.name].value += booking.amount;
        serviceMap[service.name].bookings += 1;
      }
    });
    return Object.values(serviceMap);
  };

  const getBookingsByStatus = () => {
    const statusMap = {
      confirmed: { name: "Confirmed", value: 0, fill: "#22c55e" },
      pending: { name: "Pending", value: 0, fill: "#eab308" },
      canceled: { name: "Canceled", value: 0, fill: "#ef4444" },
    };
    bookings.forEach((booking) => {
      if (statusMap[booking.status]) {
        statusMap[booking.status].value += 1;
      }
    });
    return Object.values(statusMap).filter((s) => s.value > 0);
  };

  const revenueByDate = getRevenueByDate();
  const revenueByService = getRevenueByService();
  const bookingsByStatus = getBookingsByStatus();

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);
  const averageBookingValue =
    bookings.length > 0 ? Math.round(totalRevenue / bookings.length) : 0;
  const topService =
    revenueByService.length > 0
      ? revenueByService.reduce((max, s) => (s.value > max.value ? s : max))
      : null;

  const COLORS = ["#22c55e", "#eab308", "#ef4444", "#3b82f6", "#8b5cf6"];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">
              Reports & Analytics
            </h1>
            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
              Analyze your business performance.
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
            <div className="mt-2 text-xs text-muted-foreground">All time</div>
          </div>

          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="text-xs md:text-sm text-muted-foreground">
              Total bookings
            </div>
            <div className="text-xl md:text-2xl font-bold mt-2">
              {bookings.length}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Confirmed:{" "}
              {bookings.filter((b) => b.status === "confirmed").length}
            </div>
          </div>

          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="text-xs md:text-sm text-muted-foreground">
              Average booking
            </div>
            <div className="text-xl md:text-2xl font-bold mt-2">
              ₦{averageBookingValue.toLocaleString()}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Per booking
            </div>
          </div>

          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="text-xs md:text-sm text-muted-foreground">
              Top service
            </div>
            <div className="text-lg font-bold mt-2">
              {topService?.name || "N/A"}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              ₦{topService?.value.toLocaleString() || 0}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-4 bg-card border border-border rounded-lg">
            <h3 className="font-semibold text-sm md:text-base mb-4">
              Revenue trend
            </h3>
            <div className="w-full h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueByDate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" style={{ fontSize: "0.75rem" }} />
                  <YAxis style={{ fontSize: "0.75rem" }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#22c55e" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-4 bg-card border border-border rounded-lg">
            <h3 className="font-semibold text-sm md:text-base mb-4">
              Revenue by service
            </h3>
            {revenueByService.length > 0 ? (
              <div className="w-full h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueByService}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" style={{ fontSize: "0.75rem" }} />
                    <YAxis style={{ fontSize: "0.75rem" }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 md:h-80 flex items-center justify-center text-xs text-muted-foreground">
                No data available
              </div>
            )}
          </div>

          <div className="p-4 bg-card border border-border rounded-lg">
            <h3 className="font-semibold text-sm md:text-base mb-4">
              Bookings by status
            </h3>
            {bookingsByStatus.length > 0 ? (
              <div className="w-full h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bookingsByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {bookingsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 md:h-80 flex items-center justify-center text-xs text-muted-foreground">
                No data available
              </div>
            )}
          </div>

          <div className="p-4 bg-card border border-border rounded-lg">
            <h3 className="font-semibold text-sm md:text-base mb-4">
              Service performance
            </h3>
            <div className="space-y-3">
              {revenueByService.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between p-3 bg-background rounded"
                >
                  <div>
                    <div className="text-sm font-medium">{service.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {service.bookings} bookings
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">
                      ₦{service.value.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((service.value / totalRevenue) * 100)}% of
                      total
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
