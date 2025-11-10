import { getFlutterwavePublicKey } from "./paymentConfig";
import { getApiBaseUrl } from "./api";
import { API_ENDPOINTS } from "./apiConfig";

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.body.appendChild(s);
  });
}

export async function flutterwaveCheckout({
  amount = 1000,
  currency = "NGN",
  tx_ref,
  customer = {},
  onSuccess,
  onClose,
}) {
  const publicKey = getFlutterwavePublicKey();
  if (!publicKey) throw new Error("Flutterwave public key is not configured");

  await loadScript("https://checkout.flutterwave.com/v3.js");

  return new Promise((resolve, reject) => {
    try {
      const handler = window.FlutterwaveCheckout({
        public_key: publicKey,
        tx_ref: tx_ref || `tx-${Date.now()}`,
        amount,
        currency,
        customer: {
          email: customer.email || undefined,
          phone_number: customer.phone || undefined,
          name: customer.name || undefined,
        },
        callback: async function (data) {
          // data contains transaction_id and status
          try {
            // Verify on server via Express endpoint
            const body = { id: data.transaction_id, tx_ref: data.tx_ref };
            const base = getApiBaseUrl();
            const res = await fetch(`${base}${API_ENDPOINTS.PAYMENT_VERIFY}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            });
            const verified = await res.json().catch(() => null);
            if (verified && verified.status === "success") {
              onSuccess && onSuccess(verified);
              resolve(verified);
            } else {
              onClose && onClose(verified);
              reject(new Error("Payment verification failed"));
            }
          } catch (e) {
            reject(e);
          }
        },
        onclose: function () {
          onClose && onClose();
          reject(new Error("Payment closed by user"));
        },
        customizations: {
          title: "Script - Upgrade",
          description: "Premium plan subscription",
          logo: "",
        },
      });
      // handler opens the modal automatically
    } catch (e) {
      reject(e);
    }
  });
}
