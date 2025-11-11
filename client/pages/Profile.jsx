import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCurrentUser, updateProfile } from "@/lib/apiAuth";
import { setCurrentUser } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Clock,
  Globe,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Edit,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { getCurrentSubscription } from "@/lib/apiSubscriptions";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    phone: "",
    settings: {
      currency: "NGN",
      timezone: "Africa/Lagos",
      dateFormat: "DD/MM/YYYY",
      language: "en",
      notifications: {
        email: true,
        sms: false,
        lowStock: true,
        invoiceDue: true,
      },
    },
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const userData = await getCurrentUser();
      
      // getCurrentUser already extracts the user object
      const user = userData;
      
      if (user) {
        setUser(user);
        setFormData({
          businessName: user.businessName || "",
          phone: user.phone || "",
          settings: {
            currency: user.settings?.currency || "NGN",
            timezone: user.settings?.timezone || "Africa/Lagos",
            dateFormat: user.settings?.dateFormat || "DD/MM/YYYY",
            language: user.settings?.language || "en",
            notifications: {
              email: user.settings?.notifications?.email ?? true,
              sms: user.settings?.notifications?.sms ?? false,
              lowStock: user.settings?.notifications?.lowStock ?? true,
              invoiceDue: user.settings?.notifications?.invoiceDue ?? true,
            },
          },
        });
      }

      // Try to fetch subscription info
      try {
        const subData = await getCurrentSubscription();
        if (subData.success && subData.subscription) {
          setSubscription(subData.subscription);
        }
      } catch (e) {
        // Subscription fetch is optional, don't fail if it errors
        console.log("Could not fetch subscription:", e);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error(error?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child, subChild] = field.split(".");
      if (subChild) {
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [subChild]: value,
            },
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleNotificationChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        notifications: {
          ...prev.settings.notifications,
          [key]: value,
        },
      },
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const result = await updateProfile({
        businessName: formData.businessName,
        phone: formData.phone,
        settings: formData.settings,
      });

      if (result.success) {
        const updatedUser = result.user || user;
        setUser(updatedUser);
        setCurrentUser(updatedUser);
        setIsEditing(false);
        toast.success("Profile updated successfully");
      } else {
        throw new Error(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    if (user) {
      setFormData({
        businessName: user.businessName || "",
        phone: user.phone || "",
        settings: {
          currency: user.settings?.currency || "NGN",
          timezone: user.settings?.timezone || "Africa/Lagos",
          dateFormat: user.settings?.dateFormat || "DD/MM/YYYY",
          language: user.settings?.language || "en",
          notifications: {
            email: user.settings?.notifications?.email ?? true,
            sms: user.settings?.notifications?.sms ?? false,
            lowStock: user.settings?.notifications?.lowStock ?? true,
            invoiceDue: user.settings?.notifications?.invoiceDue ?? true,
          },
        },
      });
    }
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Unable to load profile</p>
            <Button onClick={() => navigate("/dashboard")}>
              Back to dashboard
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">Profile</h1>
            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
              View and manage your account information
            </p>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="w-full md:w-auto text-xs md:text-sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={saving}
                  className="w-full md:w-auto text-xs md:text-sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full md:w-auto text-xs md:text-sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Business Information */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-lg mb-6">Business Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-xs md:text-sm text-muted-foreground mb-2">
                Email
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div className="text-base md:text-lg font-semibold">
                  {user.email}
                </div>
              </div>
              {user.emailVerified ? (
                <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </div>
              ) : (
                <div className="flex items-center gap-1 mt-2 text-xs text-amber-600">
                  <AlertCircle className="w-3 h-3" />
                  Not verified
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs md:text-sm text-muted-foreground">
                  Phone Number
                </span>
              </div>
              {isEditing ? (
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                />
              ) : (
                <div className="text-base md:text-lg font-semibold">
                  {user.phone || "Not provided"}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs md:text-sm text-muted-foreground">
                  Business Name
                </span>
              </div>
              {isEditing ? (
                <Input
                  value={formData.businessName}
                  onChange={(e) =>
                    handleInputChange("businessName", e.target.value)
                  }
                  placeholder="Enter business name"
                />
              ) : (
                <div className="text-base md:text-lg font-semibold">
                  {user.businessName}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Settings & Preferences */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-lg mb-6">Settings & Preferences</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs md:text-sm text-muted-foreground">
                  Currency
                </span>
              </div>
              {isEditing ? (
                <Select
                  value={formData.settings.currency}
                  onValueChange={(value) =>
                    handleInputChange("settings.currency", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NGN">NGN (₦)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-base md:text-lg font-semibold">
                  {user.settings?.currency || "NGN"}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs md:text-sm text-muted-foreground">
                  Timezone
                </span>
              </div>
              {isEditing ? (
                <Select
                  value={formData.settings.timezone}
                  onValueChange={(value) =>
                    handleInputChange("settings.timezone", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Africa/Lagos">Africa/Lagos (WAT)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                    <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-base md:text-lg font-semibold">
                  {user.settings?.timezone || "Africa/Lagos"}
                </div>
              )}
            </div>

            <div>
              <div className="text-xs md:text-sm text-muted-foreground mb-2">
                Date Format
              </div>
              {isEditing ? (
                <Select
                  value={formData.settings.dateFormat}
                  onValueChange={(value) =>
                    handleInputChange("settings.dateFormat", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-base md:text-lg font-semibold">
                  {user.settings?.dateFormat || "DD/MM/YYYY"}
                </div>
              )}
            </div>

            <div>
              <div className="text-xs md:text-sm text-muted-foreground mb-2">
                Language
              </div>
              {isEditing ? (
                <Select
                  value={formData.settings.language}
                  onValueChange={(value) =>
                    handleInputChange("settings.language", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-base md:text-lg font-semibold capitalize">
                  {user.settings?.language || "English"}
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="md:col-span-2">
              <div className="text-xs md:text-sm text-muted-foreground mb-3">
                Notifications
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.settings.notifications.email}
                    onChange={(e) =>
                      handleNotificationChange("email", e.target.checked)
                    }
                    disabled={!isEditing}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Email</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.settings.notifications.sms}
                    onChange={(e) =>
                      handleNotificationChange("sms", e.target.checked)
                    }
                    disabled={!isEditing}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">SMS</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.settings.notifications.lowStock}
                    onChange={(e) =>
                      handleNotificationChange("lowStock", e.target.checked)
                    }
                    disabled={!isEditing}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Low Stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.settings.notifications.invoiceDue}
                    onChange={(e) =>
                      handleNotificationChange("invoiceDue", e.target.checked)
                    }
                    disabled={!isEditing}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Invoice Due</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Info */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-lg mb-6">Subscription</h3>

          {(() => {
            // Determine plan type based on subscription status
            const isActive = subscription?.status === "active" || user.plan?.status === "active";
            let planType = "Free";
            
            if (isActive) {
              if (subscription?.planType === "yearly") {
                planType = "Yearly";
              } else if (subscription?.planType === "monthly") {
                planType = "Monthly";
              } else if (user.plan?.type === "premium") {
                // Legacy plan - check if it's yearly or monthly based on amount
                planType = "Monthly"; // Default to monthly for legacy plans
              }
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-xs md:text-sm text-muted-foreground mb-2">
                    Plan Type
                  </div>
                  <div className="text-base md:text-lg font-semibold capitalize">
                    {planType}
                  </div>
                </div>

                <div>
                  <div className="text-xs md:text-sm text-muted-foreground mb-2">
                    Status
                  </div>
                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-base md:text-lg font-semibold text-green-600">
                          Active
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span className="text-base md:text-lg font-semibold text-amber-600">
                          {subscription?.status || user.plan?.status || "Inactive"}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {isActive && subscription?.endDate && (
                  <div>
                    <div className="text-xs md:text-sm text-muted-foreground mb-2">
                      Expires On
                    </div>
                    <div className="text-base md:text-lg font-semibold">
                      {formatDate(subscription.endDate)}
                    </div>
                  </div>
                )}

                {isActive && subscription?.daysRemaining !== undefined && (
                  <div>
                    <div className="text-xs md:text-sm text-muted-foreground mb-2">
                      Days Remaining
                    </div>
                    <div className="text-base md:text-lg font-semibold">
                      {subscription.daysRemaining} days
                    </div>
                  </div>
                )}

                {!isActive && (
                  <div className="md:col-span-2">
                    <div className="text-xs md:text-sm text-muted-foreground mb-2">
                      Upgrade to Premium
                    </div>
                    <Button
                      size="sm"
                      onClick={() => navigate("/pricing")}
                      className="mt-2"
                    >
                      View Plans
                    </Button>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Account Activity */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-6">Account Activity</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs md:text-sm text-muted-foreground">
                  Account Created
                </span>
              </div>
              <div className="text-base md:text-lg font-semibold">
                {formatDate(user.createdAt)}
              </div>
            </div>

            <div>
              <div className="text-xs md:text-sm text-muted-foreground mb-2">
                Last Updated
              </div>
              <div className="text-base md:text-lg font-semibold">
                {formatDate(user.updatedAt)}
              </div>
            </div>

            {user.lastLogin && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs md:text-sm text-muted-foreground">
                    Last Login
                  </span>
                </div>
                <div className="text-base md:text-lg font-semibold">
                  {formatDate(user.lastLogin)} at {formatTime(user.lastLogin)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
