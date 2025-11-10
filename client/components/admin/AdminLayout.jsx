import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart3,
  Building2,
  Users,
  CreditCard,
  Settings,
  BarChart,
  HelpCircle,
  Code2,
  Shield,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { signOut } from "@/lib/auth";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: BarChart3,
      badge: null,
    },
    {
      label: "Tenants",
      href: "/admin/tenants",
      icon: Building2,
      badge: null,
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: Users,
      badge: null,
    },
    {
      label: "Billing",
      href: "/admin/billing",
      icon: CreditCard,
      badge: null,
    },
    {
      label: "Analytics",
      href: "/admin/analytics",
      icon: BarChart,
      badge: null,
    },
    {
      label: "Support",
      href: "/admin/support",
      icon: HelpCircle,
      badge: "3", // Example: 3 open tickets
    },
    {
      label: "API Management",
      href: "/admin/api-management",
      icon: Code2,
      badge: null,
    },
    {
      label: "Security",
      href: "/admin/security",
      icon: Shield,
      badge: null,
    },
    {
      label: "System Config",
      href: "/admin/config",
      icon: Settings,
      badge: null,
    },
  ];

  const isActive = (href) => location.pathname === href;

  const handleLogout = () => {
    signOut();
    window.location.href = "/signin";
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-card border-r border-border transition-transform duration-300 lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="p-6 border-b border-border">
            <h1 className="text-xl font-bold text-primary flex items-center gap-2">
              <Shield size={24} />
              Super Admin
            </h1>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1">
            <nav className="space-y-2 p-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link key={item.href} to={item.href}>
                    <Button
                      variant={active ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3",
                        active && "bg-primary text-primary-foreground",
                      )}
                    >
                      <Icon size={18} />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-auto">
                          {item.badge}
                        </span>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-border space-y-2">
            <Link to="/admin/profile">
              <Button variant="ghost" className="w-full justify-start">
                <Users size={18} className="mr-2" />
                Profile
              </Button>
            </Link>
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Menu Button */}
        <div className="lg:hidden bg-card border-b border-border p-4 flex items-center justify-between">
          <h1 className="font-bold text-primary">Super Admin</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-background">{children}</main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
