import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { isAuthenticated, getUser, signOut } from "@/lib/auth";
import { toast } from "sonner";
import { Globe } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Layout({ children, fullWidth = false }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const navigate = useNavigate();
  const authed = isAuthenticated();
  const user = getUser();
  const location = useLocation();
  const { language, changeLanguage, supportedLanguages, t } = useTranslation();

  React.useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out");
    } catch (e) {
      toast.error("Sign out failed");
    } finally {
      setSidebarOpen(false);
      navigate("/", { replace: true });
    }
  };

  const protectedLinks = [
    { to: "/dashboard", labelKey: "Dashboard" },
    { to: "/profile", labelKey: "Profile" },
    { to: "/analytics", labelKey: "Analytics" },
    { to: "/inventory", labelKey: "Inventory" },
    { to: "/sales", labelKey: "Sales" },
    { to: "/expenses", labelKey: "Expenses" },
    { to: "/team", labelKey: "Team" },
    { to: "/settings", labelKey: "Settings" },
  ];

  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      {authed ? (
        <div className="md:hidden">
          <Header onToggle={() => setSidebarOpen((s) => !s)} />
        </div>
      ) : (
        <Header onToggle={() => setSidebarOpen((s) => !s)} />
      )}

      <div className="flex flex-1 overflow-hidden">
        {authed && (
          <>
            <aside className="hidden md:flex md:flex-col h-full w-56 lg:w-64 border-r border-border bg-sidebar p-4 overflow-hidden">
              <div className="mb-6">
                <img src="/logo g.svg" alt="Script logo" className="w-14 h-auto mb-3" />
                <div className="text-xs md:text-sm text-muted-foreground">
                  Business toolkit
                </div>
              </div>

              <nav className="flex flex-col gap-1 flex-1">
                {protectedLinks.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-xs md:text-sm transition-colors ${isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`
                    }
                  >
                    {t(l.labelKey)}
                  </NavLink>
                ))}
              </nav>

              <div className="border-t border-border pt-4 mt-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-full flex items-center justify-between px-3 py-2 rounded-md text-xs md:text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors mb-2">
                      <Globe size={16} />
                      <span>{language.toUpperCase()}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {Object.entries(supportedLanguages).map(([code, name]) => (
                      <DropdownMenuItem
                        key={code}
                        onClick={() => changeLanguage(code)}
                        className={language === code ? "bg-accent" : ""}
                      >
                        {name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <button
                  onClick={handleSignOut}
                  className="w-full px-3 py-2 rounded-md text-xs md:text-sm text-destructive hover:bg-destructive/10 transition-colors text-left"
                >
                  {t("Sign out")}
                </button>
              </div>
            </aside>

            {sidebarOpen && (
              <>
                <div
                  className="md:hidden fixed inset-0 z-40 bg-black/50"
                  onClick={() => setSidebarOpen(false)}
                />
                <div className="md:hidden fixed inset-0 z-50 bg-sidebar flex flex-col">
                  <div className="p-4 flex items-center justify-between border-b border-border">
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors" aria-label="Change language">
                            <Globe size={18} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {Object.entries(supportedLanguages).map(([code, name]) => (
                            <DropdownMenuItem
                              key={code}
                              onClick={() => changeLanguage(code)}
                              className={language === code ? "bg-accent" : ""}
                            >
                              {name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-2 rounded-md bg-card border border-border text-foreground hover:bg-accent"
                      aria-label="Close menu"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18 6L6 18M6 6l12 12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="p-4 overflow-y-auto flex-1">
                    <nav className="flex flex-col gap-1">
                      {protectedLinks.map((l) => (
                        <NavLink
                          key={l.to}
                          to={l.to}
                          onClick={() => setSidebarOpen(false)}
                          className={({ isActive }) =>
                            `px-3 py-2 rounded-md text-sm transition-colors ${isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`
                          }
                        >
                          {t(l.labelKey)}
                        </NavLink>
                      ))}
                    </nav>
                  </div>
                  <div className="p-4 border-t border-border">
                    <button
                      onClick={handleSignOut}
                      className="w-full px-3 py-2 rounded-md text-sm text-destructive hover:bg-destructive/10 transition-colors text-left"
                    >
                      {t("Sign out")}
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        <main className="flex-1 w-full overflow-y-auto flex flex-col">
          {/*
            Use a consistent responsive container across the app.
            Best practice: cap content to a readable width (screen-xl ~1280px)
            while providing sensible horizontal padding at different breakpoints.
            Preserve `fullWidth` prop to allow pages that require edge-to-edge layouts.
          */}
          {(() => {
            const containerClass = fullWidth
              ? "max-w-full mx-0 px-0 md:py-8"
              : "max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8";

            return (
              <div className={`flex-1 w-full ${containerClass}`}>
                {children}
              </div>
            );
          })()}
          {location.pathname === "/" && <Footer />}
        </main>
      </div>
    </div>
  );
}
