import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { flutterwaveCheckout } from "@/lib/flutterwave";
import { PLAN_AMOUNTS } from "@/lib/paymentConfig";
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

  const handlePaymentAndRegistration = async () => {
    if (!state) return;

    setIsLoading(true);
    try {
      // Step 1: Initialize payment session on backend
      // We do NOT create the user yet. The backend will store the pending
      // signup data together with the tx_ref so that after verification the
      // user is created atomically.
      const initPayload = {
        signup: {
          name: state.name,
          email: state.email,
          phone: state.phone,
          password: state.password,
          businessName: state.businessName,
          businessType: state.businessType || "product_seller",
          plan: state.plan || "standard",
        },
      };

      const paymentInitResponse = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(initPayload),
      });

      if (!paymentInitResponse.ok) {
        throw new Error("Failed to initialize payment");
      }

      const paymentSession = await paymentInitResponse.json();
      if (paymentSession.status !== "success") {
        throw new Error(paymentSession.message || "Payment initialization failed");
      }

      // Step 4: Open Flutterwave checkout modal
      await flutterwaveCheckout({
        amount: paymentSession.amount,
        currency: "NGN",
        tx_ref: paymentSession.tx_ref,
        customer: paymentSession.customer,
        onSuccess: async (data) => {
          // data contains transaction_id and tx_ref
          try {
            // Step 5: Ask backend to verify & finalize signup (create user)
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: data.transaction_id,
                tx_ref: data.tx_ref,
                // include signup payload so backend can create user now
                signup: initPayload.signup,
                amount: paymentSession.amount,
              }),
            });

            const verified = await verifyRes.json().catch(() => null);
            if (verifyRes.ok && verified?.status === "success") {
              toast.success("Payment verified — account created.");
              setTimeout(() => navigate("/dashboard"), 800);
            } else {
              toast.error(verified?.message || "Payment verification failed");
            }
          } catch (e) {
            console.error("Verification error:", e);
            toast.error("Failed to verify payment or create account");
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
                    : "Pay ₦500 & Activate Account"}
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
