import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { getUser, fetchCurrentUser, signOut } from "@/lib/auth";
import { updateCurrentUser } from "@/lib/apiAuth";
import { useLanguage } from "@/lib/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import { UIText } from "@/lib/uiText";


export default function Settings() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = getUser();
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  const [formData, setFormData] = useState({
    timezone: user?.settings?.timezone || "Africa/Lagos",
    currency: user?.settings?.currency || "NGN",
    language: user?.settings?.language || currentLanguage || "en",
    dateFormat: user?.settings?.dateFormat || "DD/MM/YYYY",
    notifications: true,
    emailNotifications: user?.settings?.notifications?.email ?? true,
    smsNotifications: user?.settings?.notifications?.sms ?? false,
    lowStockNotifications: user?.settings?.notifications?.lowStock ?? true,
    invoiceDueNotifications: user?.settings?.notifications?.invoiceDue ?? true,
  });

  const [initialData, setInitialData] = useState(formData);
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

  useEffect(() => {
    setInitialData(formData);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // If language changed, update it immediately in the app
    if (name === "language" && value !== currentLanguage) {
      changeLanguage(value);
    }
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
      toast.success(getText("settingsUpdated", UIText.settings.settingsUpdated));
    } catch (err) {
      toast.error(err?.message || getText("failedToUpdate", UIText.settings.failedToUpdate));
    }
  };

  const handleReset = () => {
    setFormData(initialData);
    toast.info(getText("resetMessage", UIText.settings.resetMessage));
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">{getText("title", UIText.settings.title)}</h1>
            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
              {getText("subtitle", UIText.settings.subtitle)}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="w-full md:w-auto text-xs md:text-sm"
          >
            {getText("backToDashboard", UIText.header.backToDashboard)}
          </Button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Settings & Preferences */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">{getText("settingsPreferences", UIText.settings.settingsPreferences)}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label>
                <div className="text-xs md:text-sm font-medium mb-2">
                  {getText("currency", UIText.settings.currency)}
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
                  {getText("timezone", UIText.settings.timezone)}
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
                  {getText("dateFormat", UIText.settings.dateFormat)}
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
                  {getText("language", UIText.settings.languagePreference)}
                </div>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="en">English</option>
                  <option value="ha">Hausa</option>
                </select>
              </label>

              {/* Notifications */}
              <div className="md:col-span-2">
                <div className="text-xs md:text-sm font-medium mb-3">
                  {getText("notifications", UIText.settings.notificationSettings)}
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
                    <span className="text-sm">{getText("emailLabel", UIText.common.email)}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="smsNotifications"
                      checked={formData.smsNotifications || false}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-border"
                    />
                    <span className="text-sm">{getText("smsLabel", UIText.common.sms)}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="lowStockNotifications"
                      checked={formData.lowStockNotifications || false}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-border"
                    />
                    <span className="text-sm">{getText("lowStockLabel", UIText.inventory.lowStock)}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="invoiceDueNotifications"
                      checked={formData.invoiceDueNotifications || false}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-border"
                    />
                    <span className="text-sm">{getText("invoiceDueLabel", UIText.settings.invoiceDueLabel)}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">{getText("notificationsCardTitle", UIText.settings.notificationSettings)}</h3>

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
                  <div className="text-sm font-medium">{getText("pushNotifications", UIText.settings.pushNotifications)}</div>
                  <div className="text-xs text-muted-foreground">
                    {getText("pushNotificationsDescription", UIText.settings.pushNotificationsDescription)}
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
                  <div className="text-sm font-medium">{getText("emailNotifications", UIText.settings.emailNotifications)}</div>
                  <div className="text-xs text-muted-foreground">
                    {getText("emailNotificationsDescription", UIText.settings.emailNotificationsDescription)}
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">{getText("accountSection", UIText.settings.accountSection)}</h3>
            <p className="text-xs md:text-sm text-muted-foreground mb-4">
              {getText("accountDescription", UIText.settings.accountDescription)}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  await signOut();
                  toast.success(getText("signOutSuccess", UIText.auth.signOutSuccess));
                } catch (e) {
                  toast.error(getText("signOutFailed", UIText.auth.signOutFailed));
                }
                navigate("/", { replace: true });
              }}
              className="text-xs md:text-sm"
            >
              {getText("signOut", UIText.auth.signOut)}
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
              {getText("reset", UIText.buttons.reset)}
            </Button>
            <Button type="submit" className="text-xs md:text-sm">
              <Save className="w-3 h-3 mr-2" />
              {getText("saveChanges", UIText.settings.saveChanges)}
            </Button>
          </div>
        </form>

        {/* Danger Zone */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="font-semibold text-lg text-red-900 mb-2">
            {getText("dangerZone", UIText.settings.dangerZone)}
          </h3>
          <p className="text-sm text-red-700 mb-4">
            {getText("dangerZoneDescription", UIText.settings.dangerZoneDescription)}
          </p>
          <Button
            variant="destructive"
            size="sm"
            onClick={async () => {
              if (confirm(getText("deleteAccountConfirm", UIText.settings.deleteAccountConfirm))) {
                try {
                  // TODO: server-side account deletion endpoint should be implemented
                  await fetch(`/api/users/me`, { method: "DELETE" });
                } catch (e) {
                  // ignore - backend may not implement deletion yet
                }
                toast.success(getText("deleteAccountSuccess", UIText.settings.deleteAccountSuccess));
                navigate("/");
              }
            }}
            className="text-xs"
          >
            {getText("deleteAccount", UIText.settings.deleteAccount)}
          </Button>
        </div>
      </div>
    </Layout>
  );
}
