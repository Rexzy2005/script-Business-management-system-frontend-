import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RateLimitWarning } from "@/components/RateLimitWarning";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/lib/LanguageContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Solutions from "./pages/Solutions";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PlanConfirmation from "./pages/PlanConfirmation";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Inventory from "./pages/Inventory";
import Analytics from "./pages/Analytics";
import Expenses from "./pages/Expenses";
import Team from "./pages/Team";
import Sales from "./pages/Sales";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import SuperAdminDashboard from "./pages/admin/SuperAdminDashboard";
import TenantManagement from "./pages/admin/TenantManagement";
import UserManagement from "./pages/admin/UserManagement";
import BillingControl from "./pages/admin/BillingControl";
import AnalyticsReports from "./pages/admin/Analytics";
import SupportCenter from "./pages/admin/SupportCenter";
import APIManagement from "./pages/admin/APIManagement";
import SystemConfig from "./pages/admin/SystemConfig";
import SecurityCompliance from "./pages/admin/SecurityCompliance";
import { createRoot } from "react-dom/client";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>

    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RateLimitWarning />
      <BrowserRouter>

    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RateLimitWarning />
        <BrowserRouter>

        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signup/plan" element={<PlanConfirmation />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <Inventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <Expenses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team"
            element={
              <ProtectedRoute>
                <Team />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <ProtectedRoute>
                <Sales />
              </ProtectedRoute>
            }
          />
          {/* Super Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <SuperAdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/tenants"
            element={
              <AdminRoute>
                <TenantManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/billing"
            element={
              <AdminRoute>
                <BillingControl />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <AdminRoute>
                <AnalyticsReports />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/support"
            element={
              <AdminRoute>
                <SupportCenter />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/api-management"
            element={
              <AdminRoute>
                <APIManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/config"
            element={
              <AdminRoute>
                <SystemConfig />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/security"
            element={
              <AdminRoute>
                <SecurityCompliance />
              </AdminRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

    </TooltipProvider>

        </TooltipProvider>
    </LanguageProvider>

  </QueryClientProvider>
);

export default App;

createRoot(document.getElementById("root")).render(<App />);
