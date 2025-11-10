import React, { useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { isAuthenticated, getUser } from "@/lib/auth";

export default function Pricing() {
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
  const plan = {
    name: "Standard",
    monthlyPrice: "₦500",
    yearlyPrice: "₦5,000",
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
                <span className="text-4xl font-bold">{plan.monthlyPrice}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">{plan.yearlyPrice}</span>
                <span className="text-muted-foreground">/year</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Save 17% with annual billing
              </p>
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
              <Link to="/signup" className="w-full block">
                <Button size="lg" className="w-full h-12 text-base">
                  Get started with {plan.name}
                </Button>
              </Link>
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
