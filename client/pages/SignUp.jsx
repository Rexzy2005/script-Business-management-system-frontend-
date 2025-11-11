import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { isAuthenticated, getUser } from "@/lib/auth";

export default function SignUp() {
  const [business, setBusiness] = useState("");
  const [businessType, setBusinessType] = useState("product_seller");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
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
          businessType: businessType || "product_seller",
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
      price: "₦500 / month or ₦5,000 / year",
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
      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start my-8 md:my-16">
          {/* Left side - Form */}
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">
              Get started with Script
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Complete business management for ₦500/month or ₦5,000/year
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
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0801 234 5678"
                />
              </label>

              <label>
                <div className="text-xs md:text-sm font-medium mb-2">
                  Password *
                </div>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Choose a secure password"
                  required
                />
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

          {/* Right side intentionally removed — plan details will be shown after clicking Create account */}
        </div>
      </div>
    </Layout>
  );
}
