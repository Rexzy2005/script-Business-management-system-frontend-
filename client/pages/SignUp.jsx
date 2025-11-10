import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { register, isAuthenticated, getUser } from "@/lib/auth";
import { Check } from "lucide-react";

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
    setIsLoading(true);
    try {
      const response = await register({
        name: business,
        email,
        phone,
        password,
        businessName: business,
        businessType: "product_seller",
        plan: "standard",
      });

      if (!response.success) {
        throw new Error(response.message || "Registration failed");
      }

      toast.success("Account created successfully!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 600);
    } catch (error) {
      toast.error(error.message || "Registration failed");
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

          {/* Right side - Plan Details */}
          <div className="md:sticky md:top-20">
            <div className="border border-primary bg-primary/5 rounded-lg p-6 md:p-8">
              <div className="text-sm font-semibold text-primary mb-4">
                Standard Plan
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2">
                ₦500
                <span className="text-lg text-muted-foreground">/month</span>
              </div>
              <div className="text-sm text-muted-foreground mb-6">
                or ₦5,000/year (billed annually)
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    <strong>Unlimited invoicing</strong> — Create and send
                    professional invoices
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    <strong>Complete inventory management</strong> — Track
                    unlimited items and stock levels
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    <strong>Advanced analytics</strong> — Detailed insights into
                    sales, expenses, and cash flow
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    <strong>Client & customer management</strong> — Centralized
                    database for all your contacts
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    <strong>Team collaboration</strong> — Add team members and
                    assign tasks
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    <strong>Payment tracking</strong> — Monitor all transactions
                    and payment status
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    <strong>Reports & exports</strong> — Generate detailed
                    reports and export data
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    <strong>Priority support</strong> — Get help when you need
                    it
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
