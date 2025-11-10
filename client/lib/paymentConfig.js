// Public Flutterwave key (client-side)
export const FLW_PUBLIC_KEY = "FLWPUBK-f924db2b324104ba75fd9090a1074995-X";

// Helper to get key (allows future env override)
export function getFlutterwavePublicKey() {
  try {
    return FLW_PUBLIC_KEY;
  } catch (e) {
    return "";
  }
}
