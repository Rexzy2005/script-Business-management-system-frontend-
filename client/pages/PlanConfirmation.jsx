import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { register } from "@/lib/auth";
import { Check } from "lucide-react";

export default function PlanConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!state || !state.email) {
      // No signup data — go back to signup
      navigate("/signup", { replace: true });
    }
  }, [state, navigate]);

  const handlePay = async () => {
    if (!state) return;
    setIsLoading(true);
    try {
      const response = await register({
        name: state.name,
        email: state.email,
        phone: state.phone,
        password: state.password,
        businessName: state.businessName,
        businessType: state.businessType || "product_seller",
        plan: state.plan || "standard",
      });

      if (!response || !response.success) {
        throw new Error(response?.message || "Registration failed");
      }

      toast.success("Account created successfully!");
      // Ideally redirect to payment flow here. For now, go to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 600);
    } catch (err) {
      toast.error(err?.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto my-12">
        <div className="bg-card border border-border rounded-lg p-6 md:p-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Confirm your plan</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Review the plan below and click Pay to finish creating your
                account.
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">Standard</div>
              <div className="text-2xl font-extrabold">₦500</div>
              <div className="text-sm text-muted-foreground">/month</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-semibold mb-2">What you get</div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  Unlimited invoicing
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  Complete inventory management
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  Advanced analytics
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  Priority support
                </li>
              </ul>
            </div>

            <div>
              <div className="text-sm font-semibold mb-2">Account</div>
              <div className="text-sm text-muted-foreground">
                <div>{state?.businessName}</div>
                <div>{state?.email}</div>
                <div>{state?.phone}</div>
              </div>

              <div className="mt-6 flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="w-full"
                >
                  Back
                </Button>
                <Button onClick={handlePay} className="w-full" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Pay & Create account"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
