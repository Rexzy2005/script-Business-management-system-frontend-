import React from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isAuthenticated, getUser, signOut } from "@/lib/auth";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";

export default function Header({ onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [authed, setAuthed] = React.useState(isAuthenticated());
  const user = getUser();
  const { t, language, changeLanguage, supportedLanguages } = useTranslation();

  React.useEffect(() => {
    const onAuth = () => setAuthed(isAuthenticated());
    window.addEventListener("script-auth", onAuth);
    return () => window.removeEventListener("script-auth", onAuth);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out");
    } catch (e) {
      toast.error("Sign out failed");
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
              {t("Features")}
            </NavLink>
            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                isActive
                  ? "text-primary font-medium text-sm"
                  : "text-muted-foreground hover:text-foreground text-sm"
              }
            >
              {t("Pricing")}
            </NavLink>
            <NavLink
              to="/solutions"
              className={({ isActive }) =>
                isActive
                  ? "text-primary font-medium text-sm"
                  : "text-muted-foreground hover:text-foreground text-sm"
              }
            >
              {t("Solutions")}
            </NavLink>
          </nav>
        )}

        <div className="flex items-center gap-2 md:gap-3">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs md:text-sm">
                {language.toUpperCase()}
              </Button>
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

          {authed ? (
            <>
              <Link
                to="/dashboard"
                className="hidden md:inline text-xs md:text-sm text-muted-foreground hover:text-foreground"
              >
                {t("Dashboard")}
              </Link>
              <div className="hidden md:flex items-center gap-2 md:gap-3">
                <div className="text-xs md:text-sm text-muted-foreground truncate">
                  {user?.name}
                </div>
                <Button size="sm" variant="outline" onClick={handleSignOut}>
                  {t("Sign out")}
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
                {t("Sign in")}
              </Link>
              <Link to="/signup">
                <Button size="sm" className="text-xs md:text-sm px-2 md:px-4">
                  {t("Get Started")}
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
