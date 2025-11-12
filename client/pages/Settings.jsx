import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { getUser, fetchCurrentUser, signOut } from "@/lib/auth";
import { updateCurrentUser } from "@/lib/apiAuth";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
import { Save, X } from "lucide-react";
import { toast } from "sonner";
=======
import { useLanguage } from "@/lib/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import { UIText } from "@/lib/uiText";
>>>>>>> 8340a82 (language toggle)

export default function Settings() {
  const navigate = useNavigate();
  const user = getUser();
<<<<<<< HEAD
  const [formData, setFormData] = useState({
    timezone: user?.settings?.timezone || "Africa/Lagos",
    currency: user?.settings?.currency || "NGN",
    language: user?.settings?.language || "en",
=======
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  const [formData, setFormData] = useState({
    timezone: user?.settings?.timezone || "Africa/Lagos",
    currency: user?.settings?.currency || "NGN",
    language: user?.settings?.language || currentLanguage || "en",
>>>>>>> 8340a82 (language toggle)
    dateFormat: user?.settings?.dateFormat || "DD/MM/YYYY",
    notifications: true,
    emailNotifications: user?.settings?.notifications?.email ?? true,
    smsNotifications: user?.settings?.notifications?.sms ?? false,
    lowStockNotifications: user?.settings?.notifications?.lowStock ?? true,
    invoiceDueNotifications: user?.settings?.notifications?.invoiceDue ?? true,
  });

  const [initialData, setInitialData] = useState(formData);
<<<<<<< HEAD
=======
  const translationSource = React.useMemo(
    () => ({
      title: UIText.settings.title,
      subtitle: UIText.settings.subtitle,
      backToDashboard: UIText.header.backToDashboard,
      settingsPreferences: UIText.settings.settingsPreferences,
      currency: UIText.settings.currency,
      timezone: UIText.settings.timezone,
      dateFormat: UIText.settings.dateFormat,
      language: UIText.settings.languagePreference,
      selectLanguage: UIText.settings.selectLanguage,
      notifications: UIText.settings.notificationSettings,
      emailLabel: UIText.common.email,
      smsLabel: UIText.common.sms,
      lowStockLabel: UIText.inventory.lowStock,
      invoiceDueLabel: UIText.settings.invoiceDueLabel,
      toggleNotifications: UIText.settings.enableNotifications,
      notificationsCardTitle: UIText.settings.notificationSettings,
      pushNotifications: UIText.settings.pushNotifications,
      pushNotificationsDescription: UIText.settings.pushNotificationsDescription,
      emailNotifications: UIText.settings.emailNotifications,
      emailNotificationsDescription: UIText.settings.emailNotificationsDescription,
      accountSection: UIText.settings.accountSection,
      accountDescription: UIText.settings.accountDescription,
      signOut: UIText.auth.signOut,
      signOutSuccess: UIText.auth.signOutSuccess,
      signOutFailed: UIText.auth.signOutFailed,
      reset: UIText.buttons.reset,
      saveChanges: UIText.settings.saveChanges,
      settingsUpdated: UIText.settings.settingsUpdated,
      failedToUpdate: UIText.settings.failedToUpdate,
      resetMessage: UIText.settings.resetMessage,
      dangerZone: UIText.settings.dangerZone,
      dangerZoneDescription: UIText.settings.dangerZoneDescription,
      deleteAccount: UIText.settings.deleteAccount,
      deleteAccountConfirm: UIText.settings.deleteAccountConfirm,
      deleteAccountSuccess: UIText.settings.deleteAccountSuccess,
    }),
    [],
  );
  const { translatedText: settingsText } = useTranslation(translationSource);
  const getText = React.useCallback(
    (key, fallback) => (settingsText && settingsText[key] ? settingsText[key] : fallback),
    [settingsText],
  );
>>>>>>> 8340a82 (language toggle)

  useEffect(() => {
    setInitialData(formData);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
<<<<<<< HEAD
=======

    // If language changed, update it immediately in the app
    if (name === "language" && value !== currentLanguage) {
      changeLanguage(value);
    }
>>>>>>> 8340a82 (language toggle)
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateCurrentUser({
        settings: {
          timezone: formData.timezone,
          currency: formData.currency,
          language: formData.language,
          dateFormat: formData.dateFormat,
          notifications: {
            email: formData.emailNotifications,
            sms: formData.smsNotifications,
            lowStock: formData.lowStockNotifications,
            invoiceDue: formData.invoiceDueNotifications,
          },
        },
      });
      await fetchCurrentUser();
<<<<<<< HEAD
      toast.success("Settings updated successfully");
    } catch (err) {
      toast.error(err?.message || "Failed to update settings");
=======
      toast.success(getText("settingsUpdated", UIText.settings.settingsUpdated));
    } catch (err) {
      toast.error(err?.message || getText("failedToUpdate", UIText.settings.failedToUpdate));
>>>>>>> 8340a82 (language toggle)
    }
  };

  const handleReset = () => {
    setFormData(initialData);
<<<<<<< HEAD
    toast.info("Settings reset to last saved");
=======
    toast.info(getText("resetMessage", UIText.settings.resetMessage));
>>>>>>> 8340a82 (language toggle)
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
<<<<<<< HEAD
            <h1 className="text-2xl md:text-3xl font-extrabold">Settings</h1>
            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
              Manage your business configuration and preferences.
=======
            <h1 className="text-2xl md:text-3xl font-extrabold">{getText("title", UIText.settings.title)}</h1>
            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
              {getText("subtitle", UIText.settings.subtitle)}
>>>>>>> 8340a82 (language toggle)
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="w-full md:w-auto text-xs md:text-sm"
          >
<<<<<<< HEAD
            Back to dashboard
=======
            {getText("backToDashboard", UIText.header.backToDashboard)}
>>>>>>> 8340a82 (language toggle)
          </Button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Settings & Preferences */}
          <div className="bg-card border border-border rounded-lg p-6">
<<<<<<< HEAD
            <h3 className="font-semibold text-lg mb-4">Settings & Preferences</h3>
=======
            <h3 className="font-semibold text-lg mb-4">{getText("settingsPreferences", UIText.settings.settingsPreferences)}</h3>
>>>>>>> 8340a82 (language toggle)

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label>
                <div className="text-xs md:text-sm font-medium mb-2">
<<<<<<< HEAD
                  Currency
=======
                  {getText("currency", UIText.settings.currency)}
>>>>>>> 8340a82 (language toggle)
                </div>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="NGN">NGN (₦)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </label>

              <label>
                <div className="text-xs md:text-sm font-medium mb-2">
<<<<<<< HEAD
                  Timezone
=======
                  {getText("timezone", UIText.settings.timezone)}
>>>>>>> 8340a82 (language toggle)
                </div>
                <select
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                </select>
              </label>

              <label>
                <div className="text-xs md:text-sm font-medium mb-2">
<<<<<<< HEAD
                  Date Format
=======
                  {getText("dateFormat", UIText.settings.dateFormat)}
>>>>>>> 8340a82 (language toggle)
                </div>
                <select
                  name="dateFormat"
                  value={formData.dateFormat || "DD/MM/YYYY"}
                  onChange={handleChange}
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </label>

              <label>
                <div className="text-xs md:text-sm font-medium mb-2">
<<<<<<< HEAD
                  Language
=======
                  {getText("language", UIText.settings.languagePreference)}
>>>>>>> 8340a82 (language toggle)
                </div>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="en">English</option>
                  <option value="ha">Hausa</option>
<<<<<<< HEAD
                  <option value="ig">Igbo</option>
                  <option value="yo">Yoruba</option>
=======
>>>>>>> 8340a82 (language toggle)
                </select>
              </label>

              {/* Notifications */}
              <div className="md:col-span-2">
                <div className="text-xs md:text-sm font-medium mb-3">
<<<<<<< HEAD
                  Notifications
=======
                  {getText("notifications", UIText.settings.notificationSettings)}
>>>>>>> 8340a82 (language toggle)
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={formData.emailNotifications}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-border"
                    />
<<<<<<< HEAD
                    <span className="text-sm">Email</span>
=======
                    <span className="text-sm">{getText("emailLabel", UIText.common.email)}</span>
>>>>>>> 8340a82 (language toggle)
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="smsNotifications"
                      checked={formData.smsNotifications || false}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-border"
                    />
<<<<<<< HEAD
                    <span className="text-sm">SMS</span>
=======
                    <span className="text-sm">{getText("smsLabel", UIText.common.sms)}</span>
>>>>>>> 8340a82 (language toggle)
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="lowStockNotifications"
                      checked={formData.lowStockNotifications || false}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-border"
                    />
<<<<<<< HEAD
                    <span className="text-sm">Low Stock</span>
=======
                    <span className="text-sm">{getText("lowStockLabel", UIText.inventory.lowStock)}</span>
>>>>>>> 8340a82 (language toggle)
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="invoiceDueNotifications"
                      checked={formData.invoiceDueNotifications || false}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-border"
                    />
<<<<<<< HEAD
                    <span className="text-sm">Invoice Due</span>
=======
                    <span className="text-sm">{getText("invoiceDueLabel", UIText.settings.invoiceDueLabel)}</span>
>>>>>>> 8340a82 (language toggle)
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-card border border-border rounded-lg p-6">
<<<<<<< HEAD
            <h3 className="font-semibold text-lg mb-4">Notifications</h3>
=======
            <h3 className="font-semibold text-lg mb-4">{getText("notificationsCardTitle", UIText.settings.notificationSettings)}</h3>
>>>>>>> 8340a82 (language toggle)

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
<<<<<<< HEAD
                  <div className="text-sm font-medium">Push notifications</div>
                  <div className="text-xs text-muted-foreground">
                    Get notified of new bookings and messages
=======
                  <div className="text-sm font-medium">{getText("pushNotifications", UIText.settings.pushNotifications)}</div>
                  <div className="text-xs text-muted-foreground">
                    {getText("pushNotificationsDescription", UIText.settings.pushNotificationsDescription)}
>>>>>>> 8340a82 (language toggle)
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
<<<<<<< HEAD
                  <div className="text-sm font-medium">Email notifications</div>
                  <div className="text-xs text-muted-foreground">
                    Receive email updates and daily summary
=======
                  <div className="text-sm font-medium">{getText("emailNotifications", UIText.settings.emailNotifications)}</div>
                  <div className="text-xs text-muted-foreground">
                    {getText("emailNotificationsDescription", UIText.settings.emailNotificationsDescription)}
>>>>>>> 8340a82 (language toggle)
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-card border border-border rounded-lg p-6">
<<<<<<< HEAD
            <h3 className="font-semibold text-lg mb-4">Account</h3>
            <p className="text-xs md:text-sm text-muted-foreground mb-4">
              Manage your account and session.
=======
            <h3 className="font-semibold text-lg mb-4">{getText("accountSection", UIText.settings.accountSection)}</h3>
            <p className="text-xs md:text-sm text-muted-foreground mb-4">
              {getText("accountDescription", UIText.settings.accountDescription)}
>>>>>>> 8340a82 (language toggle)
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  await signOut();
<<<<<<< HEAD
                  toast.success("Signed out");
                } catch (e) {
                  toast.error("Sign out failed");
=======
                  toast.success(getText("signOutSuccess", UIText.auth.signOutSuccess));
                } catch (e) {
                  toast.error(getText("signOutFailed", UIText.auth.signOutFailed));
>>>>>>> 8340a82 (language toggle)
                }
                navigate("/", { replace: true });
              }}
              className="text-xs md:text-sm"
            >
<<<<<<< HEAD
              Sign out
=======
              {getText("signOut", UIText.auth.signOut)}
>>>>>>> 8340a82 (language toggle)
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
<<<<<<< HEAD
              Reset
            </Button>
            <Button type="submit" className="text-xs md:text-sm">
              <Save className="w-3 h-3 mr-2" />
              Save changes
=======
              {getText("reset", UIText.buttons.reset)}
            </Button>
            <Button type="submit" className="text-xs md:text-sm">
              <Save className="w-3 h-3 mr-2" />
              {getText("saveChanges", UIText.settings.saveChanges)}
>>>>>>> 8340a82 (language toggle)
            </Button>
          </div>
        </form>

        {/* Danger Zone */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="font-semibold text-lg text-red-900 mb-2">
<<<<<<< HEAD
            Danger zone
          </h3>
          <p className="text-sm text-red-700 mb-4">
            These actions cannot be undone.
=======
            {getText("dangerZone", UIText.settings.dangerZone)}
          </h3>
          <p className="text-sm text-red-700 mb-4">
            {getText("dangerZoneDescription", UIText.settings.dangerZoneDescription)}
>>>>>>> 8340a82 (language toggle)
          </p>
          <Button
            variant="destructive"
            size="sm"
            onClick={async () => {
<<<<<<< HEAD
              if (confirm("Are you sure? This will delete all your data?")) {
=======
              if (confirm(getText("deleteAccountConfirm", UIText.settings.deleteAccountConfirm))) {
>>>>>>> 8340a82 (language toggle)
                try {
                  // TODO: server-side account deletion endpoint should be implemented
                  await fetch(`/api/users/me`, { method: "DELETE" });
                } catch (e) {
                  // ignore - backend may not implement deletion yet
                }
<<<<<<< HEAD
                toast.success("Account deletion initiated");
=======
                toast.success(getText("deleteAccountSuccess", UIText.settings.deleteAccountSuccess));
>>>>>>> 8340a82 (language toggle)
                navigate("/");
              }
            }}
            className="text-xs"
          >
<<<<<<< HEAD
            Delete account
=======
            {getText("deleteAccount", UIText.settings.deleteAccount)}
>>>>>>> 8340a82 (language toggle)
          </Button>
        </div>
      </div>
    </Layout>
  );
}
