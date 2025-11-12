import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { isAuthenticated, getUser } from "@/lib/auth";
import { PLANS, PLAN_TYPES, getYearlySavings } from "@/lib/plans";

export default function Pricing() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(PLAN_TYPES.MONTHLY);
  const savings = getYearlySavings();

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

  const plan = {
    name: "Premium",
    monthlyPrice: PLANS.PREMIUM.monthlyNaira,
    yearlyPrice: PLANS.PREMIUM.yearlyNaira,
    features: [
      "Unlimited inventory tracking",
      "Advanced analytics & reporting",
      "Invoicing & payments",
      "Customer management",
      "Team collaboration",
      "Priority email support",
      "Local payment integrations",
      "Data exports",
    ],
  };

  const handleGetStarted = () => {
    navigate("/signup", { 
      state: { planType: selectedPlan } 
    });
  };

  return (
    <Layout>
      <section className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Simple pricing for your business
          </h2>
          <p className="mt-3 text-sm md:text-base text-muted-foreground px-4">
            One plan, designed for Nigerian product businesses. Affordable and
            built to scale with your growth.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Plan Type Toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg border border-border bg-background p-1">
              <button
                onClick={() => setSelectedPlan(PLAN_TYPES.MONTHLY)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedPlan === PLAN_TYPES.MONTHLY
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setSelectedPlan(PLAN_TYPES.YEARLY)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors relative ${
                  selectedPlan === PLAN_TYPES.YEARLY
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Yearly
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  Save {savings.percent}%
                </span>
              </button>
            </div>
          </div>

          <div className="border-2 border-primary bg-primary/5 rounded-lg p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Everything you need to manage your product business
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold">
                  ₦{selectedPlan === PLAN_TYPES.YEARLY ? plan.yearlyPrice.toLocaleString() : plan.monthlyPrice.toLocaleString()}
                </span>
                <span className="text-muted-foreground">
                  /{selectedPlan === PLAN_TYPES.YEARLY ? "year" : "month"}
                </span>
              </div>
              {selectedPlan === PLAN_TYPES.YEARLY && (
                <p className="text-sm text-muted-foreground">
                  Save ₦{savings.amount.toLocaleString()} ({savings.percent}% off) compared to monthly billing
                </p>
              )}
              {selectedPlan === PLAN_TYPES.MONTHLY && (
                <p className="text-sm text-muted-foreground">
                  Billed monthly, cancel anytime
                </p>
              )}
            </div>

            <ul className="mt-10 space-y-4">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 w-full">
              <Button 
                size="lg" 
                className="w-full h-12 text-base"
                onClick={handleGetStarted}
              >
                Get started with {plan.name}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-6">
              No credit card required. Start free for 14 days.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Questions about pricing?{" "}
            <a href="#" className="text-primary underline hover:no-underline">
              Contact us
            </a>
          </p>
        </div>
      </section>
    </Layout>
  );
}
