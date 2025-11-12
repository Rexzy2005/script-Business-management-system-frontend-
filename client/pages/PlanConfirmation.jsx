import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { flutterwaveCheckout } from "@/lib/flutterwave";
import { PLAN_AMOUNTS } from "@/lib/paymentConfig";
import { registerWithPayment, verifySignupPayment } from "@/lib/apiAuth";
import { getApiBaseUrl } from "@/lib/api";
import { Check } from "lucide-react";
import { PLANS, PLAN_TYPES, getPlanAmount } from "@/lib/plans";

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

  const handlePaymentAndRegistration = async () => {
    if (!state) return;

    setIsLoading(true);
    try {
      // Get plan type from state or default to monthly
      const planType = state.planType || PLAN_TYPES.MONTHLY;

      // Step 1: Register user and initialize payment on backend
      // Backend creates pending user account and returns payment details
      const signupPayload = {
        businessName: state.businessName || state.name,
        email: state.email,
        phone: state.phone || "",
        password: state.password,
        planType: planType,
      };

      const registerData = await registerWithPayment(signupPayload);
      
      if (!registerData.success || !registerData.payment) {
        throw new Error(registerData.message || "Payment initialization failed");
      }

      const { payment } = registerData;
      const { tx_ref, amount, customer } = payment;

      // Step 2: Open Flutterwave checkout modal
      await flutterwaveCheckout({
        amount: amount, // Amount in Naira (200)
        currency: "NGN",
        tx_ref: tx_ref,
        customer: {
          email: customer.email,
          phone: customer.phone,
          name: customer.name,
        },
        onSuccess: async (data) => {
          // data contains transaction_id and tx_ref from Flutterwave
          try {
            // Step 3: Verify payment with backend and activate account
            const verifyData = await verifySignupPayment(
              data.transaction_id || data.id,
              data.tx_ref || tx_ref
            );
            
            if (verifyData.success) {
              // Import auth functions to properly set user state
              const { setCurrentUser } = await import("@/lib/auth");
              const { getAuthToken } = await import("@/lib/api");
              
              // Store user data if provided
              if (verifyData.user) {
                setCurrentUser(verifyData.user);
              }
              
              // Verify token is stored before redirecting
              let tokenStored = false;
              for (let i = 0; i < 10; i++) {
                await new Promise(resolve => setTimeout(resolve, 50));
                const token = getAuthToken();
                if (token) {
                  tokenStored = true;
                  break;
                }
              }
              
              if (!tokenStored) {
                console.warn("Token not stored after payment verification, but proceeding with redirect");
              }
              
              toast.success("Payment verified! Your account has been activated.");
              
              // Small delay to ensure toast is visible, then redirect
              setTimeout(() => {
                // Use window.location for full page reload to ensure fresh auth state
                window.location.href = "/dashboard";
              }, 1000);
            } else {
              toast.error(verifyData.message || "Payment verification failed");
            }
          } catch (e) {
            console.error("Verification error:", e);
            toast.error("Failed to verify payment. Please contact support.");
          }
        },
        onClose: () => {
          // User closed modal without completing payment
          toast.info("Payment cancelled. You can try again later.");
        },
      });
    } catch (err) {
      console.error("Payment error:", err);
      toast.error(err?.message || "Failed to process payment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto my-12">
        <div className="bg-card border border-border rounded-lg p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Confirm your plan</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Review the plan below and click Pay to finish creating your
                account. Your subscription will activate immediately after payment.
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">
                {state?.planType === PLAN_TYPES.YEARLY ? "Yearly" : "Monthly"} Premium
              </div>
              <div className="text-2xl font-extrabold">
                ₦{getPlanAmount(state?.planType || PLAN_TYPES.MONTHLY).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                /{state?.planType === PLAN_TYPES.YEARLY ? "year" : "month"}
              </div>
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
              <div className="text-sm font-semibold mb-2">Account details</div>
              <div className="text-sm text-muted-foreground space-y-2">
                <div>
                  <div className="font-medium text-foreground">
                    {state?.businessName}
                  </div>
                  <div className="text-xs">{state?.email}</div>
                  {state?.phone && <div className="text-xs">{state?.phone}</div>}
                </div>
              </div>

              <div className="mt-6 flex gap-2 flex-col sm:flex-row">
                <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="w-full"
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button
                  onClick={handlePaymentAndRegistration}
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Processing..."
                    : `Pay ₦${getPlanAmount(state?.planType || PLAN_TYPES.MONTHLY).toLocaleString()} & Activate Account`}
                </Button>
              </div>

              <div className="mt-4 text-xs text-muted-foreground">
                ✓ Secure payment powered by Flutterwave
                <br />
                ✓ Your data is encrypted and safe
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
