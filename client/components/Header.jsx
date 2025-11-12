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
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";
import { UIText } from "@/lib/uiText";

export default function Header({ onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [authed, setAuthed] = React.useState(isAuthenticated());
  const user = getUser();
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


  React.useEffect(() => {
    const onAuth = () => setAuthed(isAuthenticated());
    window.addEventListener("script-auth", onAuth);
    return () => window.removeEventListener("script-auth", onAuth);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success(headerText?.signOutSuccess ?? UIText.auth.signOutSuccess);
    } catch (e) {
      toast.error(headerText?.signOutFailed ?? UIText.auth.signOutFailed);
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
              {headerText?.features ?? UIText.header.features}

            </NavLink>
            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                isActive
                  ? "text-primary font-medium text-sm"
                  : "text-muted-foreground hover:text-foreground text-sm"
              }
            >
              {headerText?.pricing ?? UIText.header.pricing}

            </NavLink>
            <NavLink
              to="/solutions"
              className={({ isActive }) =>
                isActive
                  ? "text-primary font-medium text-sm"
                  : "text-muted-foreground hover:text-foreground text-sm"
              }
            >
              {headerText?.solutions ?? UIText.header.solutions}

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
            </>
          )}
        </div>
      </div>
    </header>
  );
}
