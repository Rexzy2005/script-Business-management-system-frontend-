Payment integration details — Flutterwave (app-specific)

This document maps the payment flow, reference formats, endpoints, webhook setup, payload structure, and environment variables to the exact implementation used in this application.

1. Reference / transaction ID (tx_ref) used by the app

- In the app (client/pages/ProductProviderProfile.jsx and similar flows) the tx_ref is generated client-side as:
  - `const txRef = `upgrade*${user?.id || "guest"}*${Date.now()}``
  - Example produced: `upgrade_12345_1700000000000`
- Recommendation:
  - Keep this pattern for readability and mapping to user records.
  - Enforce uniqueness in your payments table and treat tx_ref as the primary mapping key for webhooks and verification.

2. Public & secret keys used by the app

- Public key (client-side): stored in client/lib/paymentConfig.js as FLW_PUBLIC_KEY.
  - Current value in repo: FLWPUBK-f924db2b324104ba75fd9090a1074995-X (public keys are safe to include in client code)
  - Accessor: getFlutterwavePublicKey()
- Secret key (server-side): expected by serverless verify function and should NEVER be committed to source.
  - Env var name used by existing Netlify function: FLW_SECRET_KEY
  - Webhook HMAC secret (recommended): FLW_WEBHOOK_SECRET (used to validate incoming webhook signatures)
- Do not commit secrets. Set them in your deployment environment (Netlify/Vercel) or use DevServerControl for local dev.

3. Existing server endpoints in this repo

- Verification endpoint (serverless) in this repo:
  - POST /.netlify/functions/api/verify-flutterwave
  - Behavior: accepts JSON body with { id, tx_ref }. If id present, calls Flutterwave verify by transaction id; otherwise verifies by tx_ref.
  - Requires: process.env.FLW_SECRET_KEY to be set (used as Bearer token when calling Flutterwave verify API).
  - Response on success: { status: 'success', data: <flutterwave data object> }
  - Error/failed response: { status: 'failed', data: ... } or appropriate HTTP status codes.

- Recommended webhook receiver (not present by default):
  - POST /api/payments/webhook (or Netlify function mapping: /.netlify/functions/api/payments-webhook)
  - Purpose: accept asynchronous events from Flutterwave and update payment records reliably.

4. Frontend ↔ backend flow used in the app

- Client-side checkout (client/lib/flutterwave.js):
  - The app uses flutterwaveCheckout({ amount, currency, tx_ref, customer, ... }) which loads the Flutterwave JS SDK and opens the checkout modal using the public key from paymentConfig.js.
  - Callback behavior (on success): the checkout callback receives data with transaction_id and tx_ref. The client then POSTs to /.netlify/functions/api/verify-flutterwave with body { id: data.transaction_id, tx_ref: data.tx_ref } to confirm the transaction.
  - Example POST from client (already implemented):
    fetch("/.netlify/functions/api/verify-flutterwave", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: data.transaction_id, tx_ref: data.tx_ref }) })
  - The client relies on the serverless verify function to confirm the transaction with Flutterwave using FLW_SECRET_KEY.

- Server-side verification (/.netlify/functions/api/verify-flutterwave):
  - If id provided: calls `GET https://api.flutterwave.com/v3/transactions/{id}/verify` with Authorization: `Bearer ${FLW_SECRET_KEY}`.
  - If tx_ref provided: calls `GET https://api.flutterwave.com/v3/transactions/verify?tx_ref={tx_ref}`.
  - On success the function returns { status: 'success', data: data.data } where data.data is Flutterwave's transaction object.

- Create flow (not fully implemented in repo):
  - Option A (current app): the client generates tx*ref locally (`upgrade*${userId}_${Date.now()}`) and opens checkout directly with that tx_ref.
  - Option B (recommended server-driven): implement POST /.netlify/functions/api/payments-create which will create a pending payment record server-side and return tx_ref for the client to use. This centralizes id generation and persistence.

5. Webhook payload & what fields to extract (Flutterwave standard)

- Typical webhook payload (simplified):
  {
  "event": "charge.completed",
  "data": {
  "id": 123456789,
  "tx_ref": "upgrade_12345_1700000000000",
  "flw_ref": "FLW-abc123",
  "amount": 1000,
  "currency": "NGN",
  "charged_amount": 1000,
  "status": "successful",
  "created_at": "2024-01-01T12:34:56Z",
  "customer": { "id": 98765, "name": "Jane Doe", "phone": "08031234567", "email": "jane@example.com" },
  "meta": { "user_id": "12345", "tenant": "acme" }
  }
  }

- Fields the app should extract and persist (mapping to the payments table):
  - tx_ref (primary mapping)
  - flw_ref or id (Flutterwave transaction id)
  - amount, currency
  - status (successful | failed | pending)
  - customer.email, customer.phone, customer.name (optional)
  - meta (JSON) — if you included user_id/tenant when initiating the charge
  - raw webhook payload (store as debugging/audit info)

6. Security & verification (how to validate the webhook)

- Recommendation (HMAC): configure Flutterwave webhook secret value in the dashboard and set the same in your environment as FLW_WEBHOOK_SECRET.
- Webhook handler should:
  - Read the raw request body (string) and compute HMAC SHA256 using FLW_WEBHOOK_SECRET.
  - Compare the computed digest (hex) to the incoming header (common header used in examples: `verif-hash`). If mismatch, return 401.
  - Proceed to parse payload and update DB if signature valid.

7. Database mapping suggestion (existing app expectations)

- Minimal payments table columns expected by the app or recommended for easy integration:
  - id (internal uuid)
  - user_id (string)
  - tx_ref (string, UNIQUE)
  - flw_ref (string)
  - amount (decimal)
  - currency (string)
  - status (enum: pending, successful, failed)
  - metadata (json)
  - raw_response (json) — optional, store full verify/webhook response
  - created_at, updated_at, verified_at timestamps

8. Example calls (app-specific)

- Client after checkout (already used in app):
  POST /.netlify/functions/api/verify-flutterwave
  Body: { "id": 123456789, "tx_ref": "upgrade_12345_1700000000000" }

- Serverless verify function behavior (implemented): uses process.env.FLW_SECRET_KEY when calling Flutterwave verify endpoints.

- Recommended webhook test (example curl):
  curl -X POST https://your-backend.example.com/api/payments/webhook \
   -H 'Content-Type: application/json' \
   -H 'verif-hash: <your-webhook-secret>' \
   -d '{ "event": "charge.completed", "data": { "tx_ref": "upgrade_12345_1700000000000", "flw_ref": "FLW-abc123", "amount": 1000, "status": "successful", "customer": { "email": "jane@example.com" } } }'

9. Notes & next steps (actionable)

- Server environment variables to set (recommended names used by this repo):
  - FLW_SECRET_KEY — used by /.netlify/functions/api/verify-flutterwave to call Flutterwave verify APIs. (SECRET — do not commit)
  - FLW_WEBHOOK_SECRET — used to validate incoming webhook signatures (HMAC). (SECRET)
  - FLW_PUBLIC_KEY — already stored in client/lib/paymentConfig.js for client use (public key)

- Optional implementation tasks I can add:
  - Add a serverless `/.netlify/functions/api/payments-create` that persists a pending payment record and returns a server-generated tx_ref.
  - Add a serverless `/.netlify/functions/api/payments-webhook` that validates `verif-hash` (using FLW_WEBHOOK_SECRET), finds your payment record by tx_ref, updates status, and performs post-payment actions (activate plan, send receipt).

If you want me to implement the create/webhook Netlify functions (mocked using local storage or wired to a DB), tell me which behavior you prefer and whether to store payments in localStorage or add a simple JSON file-based mock. Also confirm you want me to set FLW_SECRET_KEY and FLW_WEBHOOK_SECRET in the dev environment (I will not commit the values).
