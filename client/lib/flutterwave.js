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
        callback: function (data) {
          // data contains transaction_id, tx_ref and status from Flutterwave
          try {
            // Return raw callback data to the caller. The caller (frontend)
            // will then POST to the server's verify endpoint including any
            // signup payload so the server can atomically verify and create
            // the user.
            onSuccess && onSuccess(data);
            resolve(data);
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
