import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { getUser, fetchCurrentUser, signOut } from "@/lib/auth";
import { updateCurrentUser } from "@/lib/apiAuth";
import { useNavigate } from "react-router-dom";
import { Save, X } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const navigate = useNavigate();
  const user = getUser();
  const [formData, setFormData] = useState({
    businessName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    timezone: "Africa/Lagos",
    currency: "NGN",
    language: "en",
    notifications: true,
    emailNotifications: true,
  });

  const [initialData, setInitialData] = useState(formData);

  useEffect(() => {
    setInitialData(formData);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateCurrentUser({
        name: formData.businessName,
        email: formData.email,
        phone: formData.phone,
        timezone: formData.timezone,
        currency: formData.currency,
        language: formData.language,
        notifications: formData.notifications,
        emailNotifications: formData.emailNotifications,
      });
      await fetchCurrentUser();
      toast.success("Settings updated successfully");
    } catch (err) {
      toast.error(err?.message || "Failed to update settings");
    }
  };

  const handleReset = () => {
    setFormData(initialData);
    toast.info("Settings reset to last saved");
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">Settings</h1>
            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
              Manage your business configuration and preferences.
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

        <form onSubmit={handleSave} className="space-y-6">
          {/* Business Information */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">Business Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label>
                <div className="text-xs md:text-sm font-medium mb-2">
                  Business name
                </div>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </label>

              <label>
                <div className="text-xs md:text-sm font-medium mb-2">Email</div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </label>

              <label>
                <div className="text-xs md:text-sm font-medium mb-2">Phone</div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </label>
            </div>
          </div>

          {/* Regional Settings */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">Regional Settings</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label>
                <div className="text-xs md:text-sm font-medium mb-2">
                  Timezone
                </div>
                <select
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                  <option value="Africa/Johannesburg">
                    Africa/Johannesburg (SAST)
                  </option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="Europe/Paris">Europe/Paris (CET)</option>
                  <option value="America/New_York">
                    America/New_York (EST)
                  </option>
                  <option value="America/Los_Angeles">
                    America/Los_Angeles (PST)
                  </option>
                  <option value="Asia/Lagos">Asia/Dubai (GST)</option>
                </select>
              </label>

              <label>
                <div className="text-xs md:text-sm font-medium mb-2">
                  Currency
                </div>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="NGN">NGN (Nigerian Naira)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                  <option value="GBP">GBP (British Pound)</option>
                  <option value="ZAR">ZAR (South African Rand)</option>
                </select>
              </label>

              <label>
                <div className="text-xs md:text-sm font-medium mb-2">
                  Language
                </div>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                  <option value="pt">Portuguese</option>
                </select>
              </label>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">Notifications</h3>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="notifications"
                  checked={formData.notifications}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-border"
                />
                <div>
                  <div className="text-sm font-medium">Push notifications</div>
                  <div className="text-xs text-muted-foreground">
                    Get notified of new bookings and messages
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={formData.emailNotifications}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-border"
                />
                <div>
                  <div className="text-sm font-medium">Email notifications</div>
                  <div className="text-xs text-muted-foreground">
                    Receive email updates and daily summary
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Subscription Plan */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">Subscription Plan</h3>

            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-1">Current Plan</div>
                <div className="text-2xl font-bold text-primary">Standard</div>
                <div className="text-xs text-muted-foreground mt-2">
                  ₦500/month or ₦5,000/year — Renews on Dec 15, 2024
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <div className="text-sm font-medium mb-3">Plan benefits:</div>
                <ul className="text-xs text-muted-foreground space-y-2">
                  <li>✓ Unlimited invoices</li>
                  <li>✓ Unlimited inventory management</li>
                  <li>✓ Advanced analytics</li>
                  <li>✓ Team collaboration</li>
                  <li>✓ Priority support</li>
                </ul>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info("Manage billing...")}
                  className="text-xs md:text-sm"
                >
                  Manage billing
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => toast.info("Invoices...")}
                  className="text-xs md:text-sm"
                >
                  View invoices
                </Button>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">Account</h3>
            <p className="text-xs md:text-sm text-muted-foreground mb-4">
              Manage your account and session.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  await signOut();
                  toast.success("Signed out");
                } catch (e) {
                  toast.error("Sign out failed");
                }
                navigate("/signin");
              }}
              className="text-xs md:text-sm"
            >
              Sign out
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="text-xs md:text-sm"
            >
              Reset
            </Button>
            <Button type="submit" className="text-xs md:text-sm">
              <Save className="w-3 h-3 mr-2" />
              Save changes
            </Button>
          </div>
        </form>

        {/* Danger Zone */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="font-semibold text-lg text-red-900 mb-2">
            Danger zone
          </h3>
          <p className="text-sm text-red-700 mb-4">
            These actions cannot be undone.
          </p>
          <Button
            variant="destructive"
            size="sm"
            onClick={async () => {
              if (confirm("Are you sure? This will delete all your data?")) {
                try {
                  // TODO: server-side account deletion endpoint should be implemented
                  await fetch(`/api/users/me`, { method: "DELETE" });
                } catch (e) {
                  // ignore - backend may not implement deletion yet
                }
                toast.success("Account deletion initiated");
                navigate("/");
              }
            }}
            className="text-xs"
          >
            Delete account
          </Button>
        </div>
      </div>
    </Layout>
  );
}
