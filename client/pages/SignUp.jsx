import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { isAuthenticated, getUser } from "@/lib/auth";

export default function SignUp() {
  const [business, setBusiness] = useState("");
  const [businessType] = useState("product provider seller");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!business || !email || !password) {
      return toast.error("Please fill required fields");
    }
    handleSignUp();
  };

  const handleSignUp = async () => {
    // Instead of immediately registering, navigate to plan confirmation
    // where the user can review the plan and click Pay.
    // Pass form data via location state.
    setIsLoading(true);
    try {
      navigate("/signup/plan", {
        state: {
          name: business,
          email,
          phone,
          password,
          businessName: business,
          businessType: businessType || "product provider seller",
          plan: "standard",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const plans = [
    {
      id: "standard",
      name: "Standard",
      price: "₦200 / month or ₦2,000 / year",
      description:
        "Full features with unlimited inventory and advanced analytics",
      features: [
        "Unlimited inventory tracking",
        "Advanced analytics & reporting",
        "Invoicing & payments",
        "Customer management",
        "Team collaboration",
        "Priority support",
      ],
    },
  ];

  return (
    <Layout>
      <div className="w-full h-screen">
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch h-full transition-all duration-500 ease-in-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          {/* Left side - Form */}
          <div className="flex items-center justify-center p-6 md:p-8">
            <div className="bg-card border border-border md:rounded-r-lg p-6 md:p-8 w-full max-w-lg">
              <img src="/logo g.svg" alt="Logo" className="h-8 mb-6" />
              <h2 className="text-2xl md:text-3xl font-semibold">
                Get started with Script
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Complete business management for ₦200/month or ₦2,000/year
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-8 grid grid-cols-1 gap-4"
              >
              <label>
                <div className="text-xs md:text-sm font-medium mb-2">
                  Business name *
                </div>
                <input
                  value={business}
                  onChange={(e) => setBusiness(e.target.value)}
                  aria-label="Business name"
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Lagos Market Co."
                  required
                />
              </label>

              <label>
                <div className="text-xs md:text-sm font-medium mb-2">
                  Email address *
                </div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  autoComplete="email"
                  aria-label="Email address"
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="you@business.com"
                  required
                />
              </label>

              <label>
                <div className="text-xs md:text-sm font-medium mb-2">
                  Phone number (optional)
                </div>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  aria-label="Phone number"
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0801 234 5678"
                />
              </label>

              <label>
                <div className="text-xs md:text-sm font-medium mb-2">
                  Password *
                </div>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    aria-label="Password"
                    className="w-full rounded-md border border-border px-3 py-2 pr-20 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Choose a secure password"
                    required
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
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Use at least 8 characters with a mix of letters and numbers.
                </p>
              </label>

              <div className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </div>
              </form>

                <div className="mt-4 text-xs md:text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/signin"
                    className="text-primary underline hover:no-underline"
                  >
                    Sign in
                  </Link>
                </div>
            </div>
          </div>

          <div className="hidden md:block relative bg-cover bg-center border-r border-border p-6 md:p-8 h-full" style={{ backgroundImage: "url('/img3.jpg')" }}>
            <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
