import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  getServices,
  addService,
  updateService,
  deleteService,
} from "@/lib/data";
import { useNavigate } from "react-router-dom";
import { X, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";

export default function Services() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    status: "active",
  });

  useEffect(() => {
    const loadServices = async () => {
      const servicesData = await getServices();
      setServices(servicesData);
    };
    loadServices();
  }, []);

  const handleOpenForm = (service = null) => {
    if (service) {
      setEditingId(service.id);
      setFormData({
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
        status: service.status,
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        duration: "",
        status: "active",
      });
    }
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.duration) {
      return toast.error("Please fill all required fields");
    }

    if (editingId) {
      await updateService(editingId, formData);
      toast.success("Service updated successfully");
    } else {
      await addService(formData);
      toast.success("Service added successfully");
    }

    const servicesData = await getServices();
    setServices(servicesData);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this service?")) {
      await deleteService(id);
      const servicesData = await getServices();
      setServices(servicesData);
      toast.success("Service deleted successfully");
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">Services</h1>
            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
              Manage your services and pricing.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full md:w-auto">
            <Button
              size="sm"
              onClick={() => handleOpenForm()}
              className="w-full md:w-auto text-xs md:text-sm"
            >
              Add service
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

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="p-4 bg-card border border-border rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-sm md:text-base">
                    {service.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {service.description}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    service.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {service.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">Price</div>
                  <div className="text-lg font-bold">
                    ₦{service.price.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                  <div className="text-sm font-semibold">
                    {service.duration} min
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenForm(service)}
                  className="flex-1 text-xs"
                >
                  <Edit2 className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(service.id)}
                  className="flex-1 text-xs"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              No services yet. Add your first service to get started.
            </p>
            <Button onClick={() => handleOpenForm()} className="mt-4">
              Add your first service
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
              <h3 className="text-lg font-semibold">
                {editingId ? "Edit service" : "Add new service"}
              </h3>
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
                Service name
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. Hair Styling"
              />
            </label>

            <label className="block mt-3">
              <div className="text-xs md:text-sm font-medium mb-2">
                Description
              </div>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Describe your service..."
                rows="3"
              />
            </label>

            <label className="block mt-3">
              <div className="text-xs md:text-sm font-medium mb-2">
                Price (₦)
              </div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0.00"
              />
            </label>

            <label className="block mt-3">
              <div className="text-xs md:text-sm font-medium mb-2">
                Duration (minutes)
              </div>
              <input
                type="number"
                min="15"
                step="15"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: Number(e.target.value) })
                }
                className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="60"
              />
            </label>

            <label className="block mt-3">
              <div className="text-xs md:text-sm font-medium mb-2">Status</div>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
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
                {editingId ? "Update service" : "Add service"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
}
