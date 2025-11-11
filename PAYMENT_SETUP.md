# Flutterwave Payment Integration Guide

## Overview

This document describes how to set up Flutterwave payment processing for the Script business management system. The system uses a secure two-phase approach:
1. **Frontend**: Collects payment information and initiates checkout
2. **Backend**: Verifies transactions and completes the payment flow

---

## Flutterwave Credentials

### Your Current Keys
```
Secret Key: FLWSECK-ea68f56dba2b673271cbd72e2be6814c-19a694da32evt-X
Encryption Key: ea68f56dba2bdfe855e2d692
Public Key: FLWPUBK-f924db2b324104ba75fd9090a1074995-X (already configured)
```

### Key Descriptions
- **Public Key**: Used on the frontend (safe to expose in browser code). Handles UI and payment form display.
- **Secret Key**: Used on the backend ONLY. Verifies transactions and accesses the Flutterwave API.
- **Encryption Key**: Used to encrypt sensitive payment data in transit.

---

## Configuration Files

### 1. Frontend Configuration
**File**: `client/lib/paymentConfig.js`

Contains the public Flutterwave key (safe for browser exposure).

```javascript
// Public Flutterwave key (client-side only)
export const FLW_PUBLIC_KEY = "FLWPUBK-f924db2b324104ba75fd9090a1074995-X";

export function getFlutterwavePublicKey() {
  try {
    return FLW_PUBLIC_KEY;
  } catch (e) {
    return "";
  }
}
```

**Note**: This key is intentionally public and cannot be used to verify or access payments. It only initializes the checkout UI.

### 2. Backend Configuration
**File**: `.env` (root directory) — **KEEP SECRET**

Add these keys to your backend environment file (never commit to version control):

```env
# Flutterwave Configuration
FLUTTERWAVE_SECRET_KEY=FLWSECK-ea68f56dba2b673271cbd72e2be6814c-19a694da32evt-X
FLUTTERWAVE_ENCRYPTION_KEY=ea68f56dba2bdfe855e2d692
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-f924db2b324104ba75fd9090a1074995-X
```

Add `.env` to `.gitignore` if not already present:
```
.env
.env.local
.env.*.local
node_modules/
```

---

## Frontend to Backend Data Flow

### Phase 1: Initiate Subscription (Client Side)

**File**: `client/pages/PlanConfirmation.jsx`

User clicks "Pay & Create account". The flow:

1. **Collect User Data**
```javascript
const signupData = {
  name: state.name,               // Business name
  email: state.email,
  phone: state.phone,
  password: state.password,
  businessName: state.businessName,
  businessType: state.businessType,
  plan: state.plan,               // e.g., "standard"
};
```

2. **Call Backend to Create Account + Payment Session**
```javascript
// POST /api/auth/register-with-payment
const payload = {
  ...signupData,
  amount: 50000,                  // Amount in cents (₦500 = 50000)
  currency: "NGN",
  plan: "standard",
};

const response = await fetch("/api/auth/register-with-payment", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

const { tx_ref, amount, customer } = await response.json();
```

3. **Open Flutterwave Checkout Modal (Client)**
```javascript
import { flutterwaveCheckout } from "@/lib/flutterwave";

await flutterwaveCheckout({
  amount,
  currency: "NGN",
  tx_ref,
  customer: {
    email: signupData.email,
    phone: signupData.phone,
    name: signupData.name,
  },
  onSuccess: (verificationResult) => {
    // Payment verified, redirect to dashboard
    navigate("/dashboard");
  },
  onClose: () => {
    // User closed modal without paying
    toast.error("Payment cancelled");
  },
});
```

---

### Phase 2: Verify Payment (Server Side)

**File**: `server/routes/payments.js` (you'll create this)

Backend receives transaction data and verifies it with Flutterwave.

#### Request Flow
```
User → Client (Flutterwave Modal) 
      → Client calls Flutterwave API 
      → Flutterwave returns tx_ref + transaction_id
      → Client sends verify request to Backend
      → Backend verifies with Flutterwave using Secret Key
```

#### Backend Verification Endpoint

**POST** `/api/payments/verify`

Request body:
```json
{
  "id": "transaction_id_from_flutterwave",
  "tx_ref": "tx-1234567890",
  "userId": "user_id",
  "plan": "standard",
  "amount": 50000
}
```

Backend handler pseudo-code:
```javascript
async function verifyPayment(req, res) {
  const { id, tx_ref, userId, plan, amount } = req.body;
  
  try {
    // 1. Verify transaction with Flutterwave using Secret Key
    const flutterwaveResponse = await fetch(
      `https://api.flutterwave.com/v3/transactions/${id}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );
    
    const verification = await flutterwaveResponse.json();
    
    // 2. Check if payment was successful
    if (verification.status !== "success" || verification.data.status !== "successful") {
      return res.status(400).json({ success: false, message: "Payment failed" });
    }
    
    // 3. Verify amount matches
    if (verification.data.amount !== amount / 100) {
      return res.status(400).json({ success: false, message: "Amount mismatch" });
    }
    
    // 4. Update user subscription in database
    await db.users.update(userId, {
      plan: plan,
      subscriptionStatus: "active",
      subscriptionStartDate: new Date(),
      subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      paymentReference: id,
      paymentVerifiedAt: new Date(),
    });
    
    // 5. Create payment record
    await db.payments.create({
      userId,
      transactionId: id,
      txRef: tx_ref,
      amount: amount / 100,
      currency: "NGN",
      status: "successful",
      plan: plan,
      verifiedAt: new Date(),
    });
    
    // 6. Return success response
    return res.json({
      status: "success",
      message: "Payment verified",
      data: {
        userId,
        plan,
        subscriptionStatus: "active",
      },
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
}
```

---

## Complete Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER FLOW                               │
└─────────────────────────────────────────────────────────────────┘

1. USER FILLS SIGNUP FORM
   ↓
   Form Data: { name, email, phone, password, businessType, plan }
   
2. CLICK "Pay & Create Account"
   ↓
   POST /api/auth/register-with-payment
   {
     name, email, phone, password,
     businessType, plan,
     amount: 50000,
     currency: "NGN"
   }
   
3. BACKEND CREATES TEMP ACCOUNT + GENERATES PAYMENT SESSION
   ↓
   Returns: { tx_ref, amount, customer }
   
4. FLUTTERWAVE CHECKOUT MODAL OPENS (Client-side)
   ↓
   User enters card details and completes payment
   
5. FLUTTERWAVE RETURNS SUCCESS
   ↓
   transaction_id, tx_ref, status
   
6. CLIENT VERIFIES WITH BACKEND
   ↓
   POST /api/payments/verify
   {
     id: transaction_id,
     tx_ref,
     userId,
     plan,
     amount
   }
   
7. BACKEND VERIFIES WITH FLUTTERWAVE SERVERS
   ↓
   Uses FLUTTERWAVE_SECRET_KEY to confirm payment
   
8. BACKEND UPDATES USER SUBSCRIPTION + CREATES PAYMENT RECORD
   ↓
   User is now active with their plan
   
9. REDIRECT USER TO DASHBOARD
   ↓
   User can start using the application
```

---

## Subscription Plans Configuration

Map plans to amounts in `client/lib/plans.js` (create or update):

```javascript
export const SUBSCRIPTION_PLANS = {
  standard: {
    name: "Standard",
    amount: 50000,        // ₦500 (in cents)
    currency: "NGN",
    billingCycle: "monthly",
    description: "₦500/month or ₦5,000/year",
    features: [
      "Unlimited invoicing",
      "Complete inventory management",
      "Advanced analytics",
      "Customer management",
      "Team collaboration",
      "Priority support",
    ],
  },
  premium: {
    name: "Premium",
    amount: 100000,       // ₦1000 (in cents)
    currency: "NGN",
    billingCycle: "monthly",
    description: "₦1,000/month",
    features: [
      // ... premium features
    ],
  },
};
```

---

## Security Best Practices

### ✅ DO's
1. **Keep Secret Key in Environment Variables**: Never hardcode or expose `FLUTTERWAVE_SECRET_KEY`
2. **Verify All Payments Server-Side**: Always confirm with Flutterwave API from backend
3. **Use HTTPS**: All payment requests must be over secure connections
4. **Validate Amounts**: Always check that the paid amount matches the expected amount
5. **Log Transactions**: Keep detailed logs of all payment attempts and verifications
6. **Rate Limit Payment Endpoints**: Prevent brute-force attacks on payment endpoints
7. **Store Payment Records**: Keep immutable records of all transactions for audits

### ❌ DON'Ts
1. **Never send Secret Key to frontend**: It will be exposed in browser
2. **Don't trust client-side validation alone**: Always verify on backend
3. **Don't expose encryption keys**: Keep them secure and rotated periodically
4. **Don't skip transaction verification**: Always verify before activating subscriptions
5. **Don't store raw card details**: Use Flutterwave's tokenization instead

---

## Error Handling

### Common Scenarios

| Scenario | Response | Action |
|----------|----------|--------|
| Payment timeout | `status: "timeout"` | Ask user to retry or contact support |
| Invalid card | `status: "failed"` | Ask user to try different card |
| Amount mismatch | `status: "failed"` | Refund and ask user to retry |
| Network error | Backend returns 500 | Retry with exponential backoff |
| User closes modal | `onClose` callback | Save draft and allow retry |

---

## Testing

### Flutterwave Test Cards (Sandbox)
```
Card Number: 4242 4242 4242 4242
Expiry: 09/32
CVV: 812
OTP: 123456
Pin: 1111
```

### Test Transactions
1. Create account with test card
2. Check payment verification logs
3. Confirm user subscription status updated
4. Verify payment record created in database

---

## Environment Setup Checklist

- [ ] Add `FLUTTERWAVE_SECRET_KEY` to `.env`
- [ ] Add `FLUTTERWAVE_ENCRYPTION_KEY` to `.env`
- [ ] Create `/api/auth/register-with-payment` endpoint
- [ ] Create `/api/payments/verify` endpoint
- [ ] Set up database schema for payments table
- [ ] Update PlanConfirmation.jsx to call payment flow
- [ ] Add payment verification logging
- [ ] Test with Flutterwave test cards
- [ ] Deploy to production with live keys
- [ ] Monitor payment transactions in Flutterwave dashboard

---

## Support & References

- **Flutterwave Docs**: https://developer.flutterwave.com/docs/getting-started/
- **Verification API**: https://developer.flutterwave.com/docs/payments/transactions/verify/
- **Error Codes**: https://developer.flutterwave.com/docs/errors-and-troubleshooting/

