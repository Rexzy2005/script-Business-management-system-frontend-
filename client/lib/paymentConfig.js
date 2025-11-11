// Public Flutterwave key (client-side only - safe to expose)
// Can be overridden via environment variable: VITE_FLUTTERWAVE_PUBLIC_KEY
export const FLW_PUBLIC_KEY =
  import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY ||
  "FLWPUBK-f924db2b324104ba75fd9090a1074995-X";

// Helper to get key (allows env override)
export function getFlutterwavePublicKey() {
  try {
    return FLW_PUBLIC_KEY;
  } catch (e) {
    console.warn("Flutterwave public key not configured");
    return "";
  }
}

// Subscription plan amounts (in cents, so ₦200 = 20000)
export const PLAN_AMOUNTS = {
  standard: {
    amount: 20000, // ₦200
    currency: "NGN",
    billingCycle: "monthly",
  },
  premium: {
    amount: 100000, // ₦1000
    currency: "NGN",
    billingCycle: "monthly",
  },
  annual: {
    amount: 200000, // ₦2000/year
    currency: "NGN",
    billingCycle: "yearly",
  },
};
