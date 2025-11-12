import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { isAuthenticated, getUser, signOut } from "@/lib/auth";
import { toast } from "sonner";
<<<<<<< HEAD
=======
import { useTranslation } from "@/hooks/useTranslation";
import { UIText } from "@/lib/uiText";
import AutoTranslate from "@/components/AutoTranslate";
import LanguageSwitcher from "@/components/LanguageSwitcher";
>>>>>>> 8340a82 (language toggle)

export default function Layout({ children, fullWidth = false }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const navigate = useNavigate();
  const authed = isAuthenticated();
  const user = getUser();
  const location = useLocation();
<<<<<<< HEAD
=======
  const navItems = React.useMemo(
    () => [
      { id: "dashboard", to: "/dashboard", defaultText: UIText.header.dashboard },
      { id: "profile", to: "/profile", defaultText: UIText.common.profile },
      { id: "analytics", to: "/analytics", defaultText: UIText.header.analytics },
      { id: "inventory", to: "/inventory", defaultText: UIText.header.inventory },
      { id: "sales", to: "/sales", defaultText: UIText.header.sales },
      { id: "expenses", to: "/expenses", defaultText: UIText.header.expenses },
      { id: "team", to: "/team", defaultText: UIText.header.team },
      { id: "settings", to: "/settings", defaultText: UIText.common.settings },
    ],
    [],
  );
  const translationSource = React.useMemo(() => {
    const base = {
      businessToolkit: UIText.layout.businessToolkit,
      openMenu: UIText.layout.openMenu,
      closeMenu: UIText.layout.closeMenu,
      signOut: UIText.auth.signOut,
      signOutSuccess: UIText.auth.signOutSuccess,
      signOutFailed: UIText.auth.signOutFailed,
    };

    navItems.forEach((item) => {
      base[item.id] = item.defaultText;
    });

    return base;
  }, [navItems]);
  const { translatedText: layoutText } = useTranslation(translationSource);
  const protectedLinks = React.useMemo(
    () =>
      navItems.map((item) => ({
        to: item.to,
        label: layoutText?.[item.id] ?? item.defaultText,
      })),
    [navItems, layoutText],
  );
>>>>>>> 8340a82 (language toggle)

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
<<<<<<< HEAD
      toast.success("Signed out");
    } catch (e) {
      toast.error("Sign out failed");
=======
      toast.success(layoutText?.signOutSuccess ?? UIText.auth.signOutSuccess);
    } catch (e) {
      toast.error(layoutText?.signOutFailed ?? UIText.auth.signOutFailed);
>>>>>>> 8340a82 (language toggle)
    } finally {
      setSidebarOpen(false);
      navigate("/", { replace: true });
    }
  };

<<<<<<< HEAD
  const protectedLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/profile", label: "Profile" },
    { to: "/analytics", label: "Analytics" },
    { to: "/inventory", label: "Inventory" },
    { to: "/sales", label: "Sales" },
    { to: "/expenses", label: "Expenses" },
    { to: "/team", label: "Team" },
    { to: "/settings", label: "Settings" },
  ];

=======
>>>>>>> 8340a82 (language toggle)
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
<<<<<<< HEAD
                  Business toolkit
=======
                  {layoutText?.businessToolkit ?? UIText.layout.businessToolkit}
>>>>>>> 8340a82 (language toggle)
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
                    {l.label}
                  </NavLink>
                ))}
              </nav>

              <div className="border-t border-border pt-4 mt-4">
<<<<<<< HEAD
                <button
                  onClick={handleSignOut}
                  className="w-full px-3 py-2 rounded-md text-xs md:text-sm text-destructive hover:bg-destructive/10 transition-colors text-left"
                >
                  Sign out
                </button>
=======
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={handleSignOut}
                    className="px-3 py-2 rounded-md text-xs md:text-sm text-destructive hover:bg-destructive/10 transition-colors text-left flex-1"
                  >
                    {layoutText?.signOut ?? UIText.auth.signOut}
                  </button>
                  <div className="hidden md:block">
                    <LanguageSwitcher />
                  </div>
                </div>
>>>>>>> 8340a82 (language toggle)
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
                      <img src="/logo g.svg" alt="Script logo" className="w-10 h-auto" />
                    </div>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-2 rounded-md bg-card border border-border text-foreground hover:bg-accent"
<<<<<<< HEAD
                      aria-label="Close menu"
=======
                      aria-label={layoutText?.closeMenu ?? UIText.layout.closeMenu}
>>>>>>> 8340a82 (language toggle)
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
                          {l.label}
                        </NavLink>
                      ))}
                    </nav>
                  </div>
                  <div className="p-4 border-t border-border">
                    <button
                      onClick={handleSignOut}
                      className="w-full px-3 py-2 rounded-md text-sm text-destructive hover:bg-destructive/10 transition-colors text-left"
                    >
<<<<<<< HEAD
                      Sign out
=======
                      {layoutText?.signOut ?? UIText.auth.signOut}
>>>>>>> 8340a82 (language toggle)
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        <main className="flex-1 w-full overflow-y-auto flex flex-col">
<<<<<<< HEAD
          <div
            className={`flex-1 ${fullWidth ? "px-0 md:py-8" : "px-4 py-6 md:py-8"} w-full ${fullWidth ? "max-w-full mx-0" : "max-w-7xl mx-auto"}`}
          >
            {children}
          </div>
=======
          <AutoTranslate
            as="div"
            className={`flex-1 ${fullWidth ? "px-0 md:py-8" : "px-4 py-6 md:py-8"} w-full ${fullWidth ? "max-w-full mx-0" : "max-w-7xl mx-auto"}`}
          >
            {children}
          </AutoTranslate>
>>>>>>> 8340a82 (language toggle)
          {location.pathname === "/" && <Footer />}
        </main>
      </div>
    </div>
  );
}
