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
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
      <div className="max-w-md mx-auto bg-card border border-border rounded-lg p-6 md:p-8 my-8 md:my-16">
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
              className="w-full rounded-md border border-border px-3 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="you@business.com"
            />
          </label>

          <label className="block">
            <div className="text-xs md:text-sm font-medium mb-2">Password</div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full rounded-md border border-border px-3 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
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
