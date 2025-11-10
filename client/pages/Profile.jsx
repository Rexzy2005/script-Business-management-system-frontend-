import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { fetchCurrentUser, getUser } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Clock,
  Globe,
  DollarSign,
  BarChart3,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        await fetchCurrentUser();
        const currentUser = getUser();
        setUser(currentUser);
      } catch (error) {
        toast.error(error?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

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
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/settings")}
            className="w-full md:w-auto text-xs md:text-sm"
          >
            Edit settings
          </Button>
        </div>

        {/* Personal Information */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-lg mb-6">Personal Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-xs md:text-sm text-muted-foreground mb-2">
                Full Name
              </div>
              <div className="text-base md:text-lg font-semibold">
                {user.name}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs md:text-sm text-muted-foreground">
                  Email
                </span>
              </div>
              <div className="text-base md:text-lg font-semibold">
                {user.email}
              </div>
              {user.isEmailVerified && (
                <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </div>
              )}
              {!user.isEmailVerified && (
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
              <div className="text-base md:text-lg font-semibold">
                {user.phone || "Not provided"}
              </div>
              {user.isPhoneVerified && (
                <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </div>
              )}
              {!user.isPhoneVerified && (
                <div className="flex items-center gap-1 mt-2 text-xs text-amber-600">
                  <AlertCircle className="w-3 h-3" />
                  Not verified
                </div>
              )}
            </div>

            <div>
              <div className="text-xs md:text-sm text-muted-foreground mb-2">
                User Role
              </div>
              <div className="text-base md:text-lg font-semibold capitalize">
                {user.role}
              </div>
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-lg mb-6">Business Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs md:text-sm text-muted-foreground">
                  Business Name
                </span>
              </div>
              <div className="text-base md:text-lg font-semibold">
                {user.businessName}
              </div>
            </div>

            <div>
              <div className="text-xs md:text-sm text-muted-foreground mb-2">
                Business Type
              </div>
              <div className="text-base md:text-lg font-semibold capitalize">
                {user.businessType?.replace(/_/g, " ")}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs md:text-sm text-muted-foreground">
                  Total Sales
                </span>
              </div>
              <div className="text-base md:text-lg font-semibold">
                ₦{(user.totalSales || 0).toLocaleString()}
              </div>
            </div>

            <div>
              <div className="text-xs md:text-sm text-muted-foreground mb-2">
                Total Expenses
              </div>
              <div className="text-base md:text-lg font-semibold">
                ₦{(user.totalExpenses || 0).toLocaleString()}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs md:text-sm text-muted-foreground">
                  Wallet Balance
                </span>
              </div>
              <div className="text-base md:text-lg font-semibold">
                ₦{(user.walletBalance || 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Settings & Preferences */}
        {user.settings && (
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-lg mb-6">
              Settings & Preferences
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.settings.timezone && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs md:text-sm text-muted-foreground">
                      Timezone
                    </span>
                  </div>
                  <div className="text-base md:text-lg font-semibold">
                    {user.settings.timezone}
                  </div>
                </div>
              )}

              {user.settings.currency && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs md:text-sm text-muted-foreground">
                      Currency
                    </span>
                  </div>
                  <div className="text-base md:text-lg font-semibold">
                    {user.settings.currency}
                  </div>
                </div>
              )}

              {user.settings.language && (
                <div>
                  <div className="text-xs md:text-sm text-muted-foreground mb-2">
                    Language
                  </div>
                  <div className="text-base md:text-lg font-semibold capitalize">
                    {user.settings.language}
                  </div>
                </div>
              )}

              {user.settings.workingHours && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs md:text-sm text-muted-foreground">
                      Working Hours
                    </span>
                  </div>
                  <div className="text-base md:text-lg font-semibold">
                    {user.settings.workingHours.start} -{" "}
                    {user.settings.workingHours.end}
                  </div>
                </div>
              )}

              {user.settings.notifications && (
                <div>
                  <div className="text-xs md:text-sm text-muted-foreground mb-2">
                    Notifications
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground">Push</div>
                      <div className="text-sm font-semibold">
                        {user.settings.notifications.push
                          ? "Enabled"
                          : "Disabled"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Email</div>
                      <div className="text-sm font-semibold">
                        {user.settings.notifications.email
                          ? "Enabled"
                          : "Disabled"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Subscription Info */}
        {user.subscription && (
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-lg mb-6">Subscription</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-xs md:text-sm text-muted-foreground mb-2">
                  Plan
                </div>
                <div className="text-base md:text-lg font-semibold capitalize">
                  {user.subscription.plan}
                </div>
              </div>

              <div>
                <div className="text-xs md:text-sm text-muted-foreground mb-2">
                  Status
                </div>
                <div className="flex items-center gap-2">
                  {user.subscription.isActive ? (
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
                        Inactive
                      </span>
                    </>
                  )}
                </div>
              </div>

              {user.subscription.features && (
                <div className="md:col-span-2">
                  <div className="text-xs md:text-sm text-muted-foreground mb-3">
                    Available Features
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2">
                      {user.subscription.features.unlimitedInvoices ? (
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      )}
                      <span className="text-sm">Unlimited Invoices</span>
                    </div>
                    <div className="flex items-start gap-2">
                      {user.subscription.features.prioritySupport ? (
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      )}
                      <span className="text-sm">Priority Support</span>
                    </div>
                    <div className="flex items-start gap-2">
                      {user.subscription.features.advancedReporting ? (
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      )}
                      <span className="text-sm">Advanced Reporting</span>
                    </div>
                    {user.subscription.features.maxCustomerRecords && (
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">
                          Up to {user.subscription.features.maxCustomerRecords}{" "}
                          Customer Records
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Account Stats */}
        {user.profile && (
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-lg mb-6">Account Statistics</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {user.profile.totalOrders || 0}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mt-2">
                  Total Orders
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  ₦{(user.profile.totalRevenue || 0).toLocaleString()}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mt-2">
                  Total Revenue
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {user.profile.rating || 0}⭐
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mt-2">
                  Rating
                </div>
              </div>
            </div>
          </div>
        )}

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

            <div>
              <div className="text-xs md:text-sm text-muted-foreground mb-2">
                Account Status
              </div>
              <div className="flex items-center gap-2">
                {user.isActive ? (
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
                      Inactive
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
