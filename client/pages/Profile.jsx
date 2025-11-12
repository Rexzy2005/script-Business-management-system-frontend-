import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCurrentUser, updateProfile } from "@/lib/apiAuth";
import { setCurrentUser } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Clock,
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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const result = await updateProfile({
        businessName: formData.businessName,
        phone: formData.phone,
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

        {/* Subscription Plan */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-lg mb-6">Subscription Plan</h3>

          {(() => {
            // Determine plan type and status from database
            const isActive = subscription?.status === "active" || user.plan?.status === "active";
            const planType = subscription?.planType || (user.plan?.type === "premium" ? "monthly" : null);
            const planName = subscription?.planName || "Premium";
            const amount = subscription?.amount || 0;
            const currency = subscription?.currency || "NGN";
            const endDate = subscription?.endDate;
            const daysRemaining = subscription?.daysRemaining;
            const autoRenew = subscription?.autoRenew !== false;

            // Calculate days remaining if not provided
            let calculatedDaysRemaining = 0;
            if (endDate && isActive) {
              const now = new Date();
              const end = new Date(endDate);
              const diffTime = end - now;
              calculatedDaysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              calculatedDaysRemaining = calculatedDaysRemaining > 0 ? calculatedDaysRemaining : 0;
            }

            return (
              <div className="space-y-6">
                {/* Plan Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs md:text-sm text-muted-foreground mb-2">
                      Current Plan
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-primary capitalize">
                      {planType ? `${planType} ${planName}` : "Free Plan"}
                    </div>
                    {planType && (
                      <div className="text-xs md:text-sm text-muted-foreground mt-2">
                        {currency === "NGN" ? "₦" : currency} {amount.toLocaleString()}
                        {planType === "monthly" ? "/month" : "/year"}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-xs md:text-sm text-muted-foreground mb-2">
                      Status
                    </div>
                    <div className="flex items-center gap-2">
                      {isActive ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-base md:text-lg font-semibold text-green-600">
                            Active
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-amber-600" />
                          <span className="text-base md:text-lg font-semibold text-amber-600 capitalize">
                            {subscription?.status || user.plan?.status || "Inactive"}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Subscription Details */}
                {isActive && planType && (
                  <div className="pt-4 border-t border-border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {endDate && (
                        <div>
                          <div className="text-xs md:text-sm text-muted-foreground mb-2">
                            {planType === "monthly" ? "Renews On" : "Expires On"}
                          </div>
                          <div className="text-base md:text-lg font-semibold">
                            {formatDate(endDate)}
                          </div>
                        </div>
                      )}

                      {(daysRemaining !== undefined || calculatedDaysRemaining > 0) && (
                        <div>
                          <div className="text-xs md:text-sm text-muted-foreground mb-2">
                            Days Remaining
                          </div>
                          <div className="text-base md:text-lg font-semibold">
                            {daysRemaining !== undefined ? daysRemaining : calculatedDaysRemaining} days
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="text-xs md:text-sm text-muted-foreground mb-2">
                          Auto Renewal
                        </div>
                        <div className="text-base md:text-lg font-semibold capitalize">
                          {autoRenew ? "Enabled" : "Disabled"}
                        </div>
                      </div>

                      {subscription?.startDate && (
                        <div>
                          <div className="text-xs md:text-sm text-muted-foreground mb-2">
                            Started On
                          </div>
                          <div className="text-base md:text-lg font-semibold">
                            {formatDate(subscription.startDate)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Plan Benefits */}
                {isActive && (
                  <div className="pt-4 border-t border-border">
                    <div className="text-sm font-medium mb-3">Plan Benefits:</div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs md:text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        Unlimited invoices
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        Unlimited inventory management
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        Advanced analytics
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        Team collaboration
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        Priority support
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        Data exports
                      </li>
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-4 border-t border-border flex flex-col sm:flex-row gap-3">
                  {!isActive ? (
                    <Button
                      size="sm"
                      onClick={() => navigate("/pricing")}
                      className="w-full sm:w-auto"
                    >
                      Upgrade to Premium
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/pricing")}
                        className="w-full sm:w-auto"
                      >
                        Manage Plan
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.info("Billing management coming soon...")}
                        className="w-full sm:w-auto"
                      >
                        Manage Billing
                      </Button>
                    </>
                  )}
                </div>
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
