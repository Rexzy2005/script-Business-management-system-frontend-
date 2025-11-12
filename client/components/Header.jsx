import React from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { isAuthenticated, getUser, signOut } from "@/lib/auth";
import { toast } from "sonner";
<<<<<<< HEAD
=======
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";
import { UIText } from "@/lib/uiText";
>>>>>>> 8340a82 (language toggle)

export default function Header({ onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [authed, setAuthed] = React.useState(isAuthenticated());
  const user = getUser();
<<<<<<< HEAD
=======
  const { translatedText: headerText } = useTranslation({
    features: UIText.header.features,
    pricing: UIText.header.pricing,
    solutions: UIText.header.solutions,
    dashboard: UIText.header.dashboard,
    signOut: UIText.auth.signOut,
    signOutSuccess: UIText.auth.signOutSuccess,
    signOutFailed: UIText.auth.signOutFailed,
    signIn: UIText.auth.signIn,
    getStarted: UIText.common.getStarted,
    openMenu: UIText.layout.openMenu,
  });
>>>>>>> 8340a82 (language toggle)

  React.useEffect(() => {
    const onAuth = () => setAuthed(isAuthenticated());
    window.addEventListener("script-auth", onAuth);
    return () => window.removeEventListener("script-auth", onAuth);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
<<<<<<< HEAD
      toast.success("Signed out");
    } catch (e) {
      toast.error("Sign out failed");
=======
      toast.success(headerText?.signOutSuccess ?? UIText.auth.signOutSuccess);
    } catch (e) {
      toast.error(headerText?.signOutFailed ?? UIText.auth.signOutFailed);
>>>>>>> 8340a82 (language toggle)
    } finally {
      navigate("/", { replace: true });
    }
  };

  const isHomePage = location.pathname === "/";

  return (
    <header className="w-full border-b border-border bg-background sticky top-0 z-40">
      <div className="container flex items-center justify-between py-3 px-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 md:gap-3" aria-label="Script home">
            <img src="/logo g.svg" alt="Script logo" className="h-8 w-auto" />
          </Link>
        </div>

        {isHomePage && !authed && (
          <nav className="hidden md:flex items-center gap-6">
            <NavLink
              to="/features"
              className={({ isActive }) =>
                isActive
                  ? "text-primary font-medium text-sm"
                  : "text-muted-foreground hover:text-foreground text-sm"
              }
            >
<<<<<<< HEAD
              Features
=======
              {headerText?.features ?? UIText.header.features}
>>>>>>> 8340a82 (language toggle)
            </NavLink>
            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                isActive
                  ? "text-primary font-medium text-sm"
                  : "text-muted-foreground hover:text-foreground text-sm"
              }
            >
<<<<<<< HEAD
              Pricing
=======
              {headerText?.pricing ?? UIText.header.pricing}
>>>>>>> 8340a82 (language toggle)
            </NavLink>
            <NavLink
              to="/solutions"
              className={({ isActive }) =>
                isActive
                  ? "text-primary font-medium text-sm"
                  : "text-muted-foreground hover:text-foreground text-sm"
              }
            >
<<<<<<< HEAD
              Solutions
=======
              {headerText?.solutions ?? UIText.header.solutions}
>>>>>>> 8340a82 (language toggle)
            </NavLink>
          </nav>
        )}

        <div className="flex items-center gap-2 md:gap-3">
          {authed ? (
            <>
<<<<<<< HEAD
              <Link
                to="/dashboard"
                className="hidden md:inline text-xs md:text-sm text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>
              <div className="hidden md:flex items-center gap-2 md:gap-3">
                <div className="text-xs md:text-sm text-muted-foreground truncate">
                  {user?.name}
                </div>
                <Button size="sm" variant="outline" onClick={handleSignOut}>
                  Sign out
                </Button>
              </div>
              <button
                type="button"
                onClick={onToggle}
                aria-label="Open menu"
                className="md:hidden p-2 rounded-md border border-border text-foreground hover:bg-accent"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="text-xs md:text-sm text-muted-foreground hover:text-foreground"
              >
                Sign in
              </Link>
              <Link to="/signup">
                <Button size="sm" className="text-xs md:text-sm px-2 md:px-4">
                  Get Started
                </Button>
              </Link>
=======
              <div className="hidden md:flex items-center gap-2 md:gap-3">
                <Link
                  to="/dashboard"
                  className="text-xs md:text-sm text-muted-foreground hover:text-foreground"
                >
                  {headerText?.dashboard ?? UIText.header.dashboard}
                </Link>
                <LanguageSwitcher />
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="text-xs md:text-sm text-muted-foreground truncate">
                    {user?.name}
                  </div>
                  <Button size="sm" variant="outline" onClick={handleSignOut}>
                    {headerText?.signOut ?? UIText.auth.signOut}
                  </Button>
                </div>
              </div>

              <div className="flex md:hidden items-center gap-2">
                <LanguageSwitcher />
                <button
                  type="button"
                  onClick={onToggle}
                  aria-label={headerText?.openMenu ?? UIText.layout.openMenu}
                  className="p-2 rounded-md border border-border text-foreground hover:bg-accent"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 6h16M4 12h16M4 18h16"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-2 md:gap-3">
                <LanguageSwitcher />
                <Link
                  to="/signin"
                  className="text-xs md:text-sm text-muted-foreground hover:text-foreground"
                >
                  {headerText?.signIn ?? UIText.auth.signIn}
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="text-xs md:text-sm px-2 md:px-4">
                    {headerText?.getStarted ?? UIText.common.getStarted}
                  </Button>
                </Link>
              </div>

              <div className="flex md:hidden items-center gap-2">
                <LanguageSwitcher />
                <Link
                  to="/signin"
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  {headerText?.signIn ?? UIText.auth.signIn}
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="text-xs px-2">
                    {headerText?.getStarted ?? UIText.common.getStarted}
                  </Button>
                </Link>
              </div>
>>>>>>> 8340a82 (language toggle)
            </>
          )}
        </div>
      </div>
    </header>
  );
}
