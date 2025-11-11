// Backend: server/routes/payments.js
// This is a template for implementing the payment verification endpoint

import { RequestHandler } from "express";
import { connectToMongo, getDb } from "../lib/mongo.js";
import bcrypt from "bcryptjs";

/**
 * Verify Flutterwave transaction
 * POST /api/payments/verify
 * 
 * Body:
 * {
 *   id: "transaction_id",
 *   tx_ref: "tx-1234567890",
 *   userId: "user_id",
 *   plan: "standard",
 *   amount: 50000 (in cents)
 * }
 */
export const verifyPayment = async (req, res) => {
  // Accept either { id, tx_ref, userId, plan, amount } OR
  // { id, tx_ref, signup: { ... }, amount }
  const { id, tx_ref, userId, plan, amount, signup } = req.body;

  // Derive plan/user info from signup payload if provided
  let resolvedPlan = plan;
  let resolvedUserId = userId;
  if (signup) {
    resolvedPlan = signup.plan || resolvedPlan;
    resolvedUserId = signup.userId || resolvedUserId;
  }

  // Validate input
  if (!id || !tx_ref || !resolvedPlan || !amount) {
    return res.status(400).json({
      status: "error",
      message: "Missing required fields (id, tx_ref, plan, amount)",
    });
  }

  try {
    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("FLUTTERWAVE_SECRET_KEY not configured");
    }

    // Step 1: Verify transaction with Flutterwave using Secret Key
    // This uses the backend Secret Key which is never exposed to client
    const flutterwaveResponse = await fetch(
      `https://api.flutterwave.com/v3/transactions/${id}/verify`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!flutterwaveResponse.ok) {
      console.error(
        "Flutterwave verification failed:",
        flutterwaveResponse.status
      );
      return res.status(400).json({
        status: "error",
        message: "Payment verification failed",
      });
    }

    const verification = await flutterwaveResponse.json();

    // Step 2: Verify response structure and status
    if (!verification.data || verification.status !== "success") {
      console.warn("Payment not successful:", verification);
      return res.status(400).json({
        status: "error",
        message: "Payment was not successful",
        details: verification.data?.status,
      });
    }

    // Step 3: Validate transaction details
    const verifiedData = verification.data;

    // Check if payment status is successful
    if (verifiedData.status !== "successful") {
      console.warn(`Payment status is ${verifiedData.status}, not successful`);
      return res.status(400).json({
        status: "error",
        message: `Payment failed with status: ${verifiedData.status}`,
      });
    }

    // Step 4: Validate amount (the client sends amount in Naira)
    const expectedAmount = Number(amount); // amount in Naira
    const actualAmount = Number(verifiedData.amount);

    if (actualAmount !== expectedAmount) {
      console.error(
        `Amount mismatch: expected ${expectedAmount}, got ${actualAmount}`
      );
      // TODO: Initiate refund or mark for manual review
      return res.status(400).json({
        status: "error",
        message: "Amount mismatch",
        expected: expectedAmount,
        actual: actualAmount,
      });
    }

    // Step 5: Validate tx_ref matches
    if (verifiedData.tx_ref !== tx_ref) {
      console.error(
        `Transaction ref mismatch: expected ${tx_ref}, got ${verifiedData.tx_ref}`
      );
      return res.status(400).json({
        status: "error",
        message: "Transaction reference mismatch",
      });
    }

    // Step 6: Update/create user subscription in database
    const subscriptionStartDate = new Date();
    const subscriptionEndDate = new Date();

    // Set end date based on resolvedPlan
    if (resolvedPlan === "annual") {
      subscriptionEndDate.setFullYear(
        subscriptionEndDate.getFullYear() + 1
      );
    } else {
      // Monthly plans
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
    }

    // Persist verification + create user if signup payload exists
    try {
      await connectToMongo();
      const db = getDb();

      // Find pending payment record
      const pending = await db.collection("payments").findOne({ tx_ref });
      if (!pending) {
        console.warn("No pending payment record found for tx_ref", tx_ref);
      } else if (pending.status === "successful") {
        // Idempotent: already processed
        return res.json({
          status: "success",
          message: "Payment already processed",
          data: { userId: pending.userId },
        });
      }

      let createdUserId = resolvedUserId;
      if (signup) {
        // Create user record (hash password before storing)
        const password = signup.password || "";
        const passwordHash = await bcrypt.hash(password, 10);

        const userDoc = {
          name: signup.name,
          email: signup.email,
          phone: signup.phone || null,
          businessName: signup.businessName || null,
          businessType: signup.businessType || null,
          passwordHash,
          plan: resolvedPlan,
          subscriptionStatus: "active",
          subscriptionStartDate,
          subscriptionEndDate,
          createdAt: new Date(),
        };

        const insertRes = await db.collection("users").insertOne(userDoc);
        createdUserId = insertRes.insertedId;
      }

      // Update payment record to successful
      await db.collection("payments").updateOne(
        { tx_ref },
        {
          $set: {
            status: "successful",
            transactionId: id,
            verifiedAt: new Date(),
            userId: createdUserId || null,
            flutterwaveResponse: verifiedData,
          },
        },
        { upsert: false }
      );
    } catch (dbErr) {
      console.error("DB persistence error during payment verify:", dbErr);
      // proceed — but report to client that verification succeeded but DB failed
      return res.status(500).json({
        status: "error",
        message: "Payment verified but failed to persist user/payment record",
        error: process.env.NODE_ENV === "development" ? dbErr.message : undefined,
      });
    }

    // Step 7: Create payment record
    // TODO: Replace with your actual database insert
    // const payment = await db.payments.create({
    //   userId,
    //   transactionId: id,
    //   txRef: tx_ref,
    //   amount: expectedAmount,
    //   currency: verifiedData.currency,
    //   status: "successful",
    //   plan,
    //   customerEmail: verifiedData.customer?.email,
    //   customerName: verifiedData.customer?.name,
    //   paymentMethod: verifiedData.payment_type,
    //   verifiedAt: new Date(),
    //   metadata: verifiedData, // Store full response for audit
    // });

    // Step 8: Send success response
    return res.json({
      status: "success",
      message: "Payment verified and subscription activated",
      data: {
        userId,
        plan,
        subscriptionStatus: "active",
        subscriptionStartDate,
        subscriptionEndDate,
        transactionId: id,
        txRef: tx_ref,
        amount: expectedAmount,
      },
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    return res.status(500).json({
      status: "error",
      message: "Payment verification failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Create payment session (called before checkout)
 * POST /api/payments/initialize
 * 
 * Body:
 * {
 *   userId: "user_id",
 *   plan: "standard",
 *   email: "user@example.com",
 *   phone: "08012345678",
 *   name: "User Name"
 * }
 */
export const initializePayment = async (req, res) => {
  // Accept either { userId, plan, email, phone, name } OR { signup: { ... } }
  const body = req.body || {};
  const signup = body.signup;

  let userId = body.userId;
  let plan = body.plan;
  let email = body.email;
  let phone = body.phone;
  let name = body.name;

  if (signup) {
    userId = signup.userId || null;
    plan = signup.plan;
    email = signup.email;
    phone = signup.phone;
    name = signup.name || signup.businessName;
  }

  if (!plan || !email || !name) {
    return res.status(400).json({
      status: "error",
      message: "Missing required fields (plan, email, name)",
    });
  }

  try {
    // Validate plan exists and get amount (stored in cents)
    const planAmounts = {
      standard: 50000, // ₦500 in kobo/cents
      premium: 100000, // ₦1000
      annual: 500000, // ₦5000
    };

    if (!planAmounts[plan]) {
      return res.status(400).json({
        status: "error",
        message: "Invalid plan",
      });
    }

    const amountInCents = planAmounts[plan];
    const amount = amountInCents / 100; // convert to Naira for Flutterwave amount
    const tx_ref = `tx-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    // Store pending transaction in MongoDB for audit trail
    try {
      await connectToMongo();
      const db = getDb();
      await db.collection("payments").insertOne({
        tx_ref,
        plan,
        amount_cents: amountInCents,
        amount_display: amount,
        currency: "NGN",
        status: "pending",
        customer: { email, phone, name },
        signupPayload: signup || null,
        createdAt: new Date(),
      });
    } catch (e) {
      console.warn("Warning: failed to persist pending payment", e.message || e);
    }

    return res.json({
      status: "success",
      tx_ref,
      // amount here is in Naira (e.g., 500 for ₦500)
      amount,
      currency: "NGN",
      customer: {
        email,
        phone_number: phone,
        name,
      },
      planDetails: {
        name: plan,
        amount,
      },
    });
  } catch (error) {
    console.error("Payment initialization error:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to initialize payment",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Handle webhook from Flutterwave (optional but recommended)
 * POST /api/payments/webhook
 * 
 * Flutterwave sends transaction updates to this endpoint
 */
export const paymentWebhook = async (req, res) => {
  const { event, data } = req.body;

  // TODO: Verify webhook signature using FLUTTERWAVE_ENCRYPTION_KEY
  // const signature = req.headers["verif-hash"];
  // const encryptionKey = process.env.FLUTTERWAVE_ENCRYPTION_KEY;
  // Verify that: sha256(JSON.stringify(data)) with encryptionKey == signature

  try {
    if (event === "charge.completed") {
      const { id, tx_ref, status, amount } = data;

      if (status === "successful") {
        // Payment successful - update user subscription
        // This is a backup in case the initial verification missed the transaction
        console.log(`Webhook: Payment successful for tx_ref ${tx_ref}`);

        // TODO: Update database with payment confirmation
        // const payment = await db.payments.findOneAndUpdate(
        //   { txRef: tx_ref },
        //   { status: "successful", webhookConfirmedAt: new Date() }
        // );
      }
    }

    // Always return 200 to acknowledge receipt
    return res.json({ status: "success" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return res.status(500).json({
      status: "error",
      message: "Webhook processing failed",
    });
  }
};
