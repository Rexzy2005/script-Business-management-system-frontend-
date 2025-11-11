import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Link, useNavigate } from "react-router-dom";
import {
  login,
  fetchCurrentUser,
  getUser,
  setCurrentUser,
  isAuthenticated,
} from "@/lib/auth";
import { toast } from "sonner";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      const user = getUser();
      if (
        user?.isAdmin ||
        user?.role === "super-admin" ||
        user?.role === "admin"
      ) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [navigate]);

  useEffect(() => {
    // trigger mount animation
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await login(email, password);

      if (!response.success) {
        throw new Error(response.message || "Login failed");
      }

      // show success toast
      toast.success("Signed in successfully");

      const u = getUser();

      if (!u && response.user) {
        setCurrentUser(response.user);
      }

      setTimeout(() => {
        const currentUser = getUser();
        if (
          currentUser?.isAdmin ||
          currentUser?.role === "super-admin" ||
          currentUser?.role === "admin"
        ) {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }, 500);
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      return;
    }
    setForgotOpen(false);
    setForgotEmail("");
    // show confirmation toast
    toast.success("Password reset link sent");
  };
  return (
    <Layout>
      <div className="w-full h-screen">
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch h-full transition-all duration-500 ease-in-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          <div className="hidden md:block relative bg-cover bg-center border-r border-border p-6 md:p-8 h-full" style={{ backgroundImage: "url('/img2.jpg')" }}>
            <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
          </div>

          <div className="flex items-center justify-center p-6 md:p-8">
            <div className="bg-card border border-border md:rounded-r-lg p-6 md:p-8 w-full max-w-lg">
              <img src="/logo g.svg" alt="Logo" className="h-8 mb-6" />
              <h2 className="text-2xl font-semibold">Sign in to Script</h2>
              <p className="text-xs md:text-sm text-muted-foreground mt-2">
                Enter your credentials to access your dashboard.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <div className="text-xs md:text-sm font-medium mb-2">Email</div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  autoComplete="email"
                  aria-label="Email address"
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="you@business.com"
                />
              </label>

              <label className="block">
                <div className="text-xs md:text-sm font-medium mb-2">Password</div>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    aria-label="Password"
                    className="w-full rounded-md border border-border px-3 py-2 pr-20 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-2 my-1 px-2 text-xs md:text-sm text-muted-foreground hover:text-foreground rounded"
                    aria-pressed={showPassword}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </label>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotOpen(true)}
                  className="text-xs md:text-sm text-primary underline hover:no-underline"
                >
                  Forgot password?
                </button>
                <Button
                  type="submit"
                  size="sm"
                  className="w-full sm:w-auto"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>

                <div className="mt-6 text-xs md:text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-primary underline hover:no-underline"
                  >
                    Create one
                  </Link>
                </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset your password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your
              password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <label className="block">
              <div className="text-xs md:text-sm font-medium mb-2">
                Email address
              </div>
              <input
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                type="email"
                className="w-full rounded-md border border-border px-3 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="you@business.com"
                required
              />
            </label>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setForgotOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Send reset link
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
