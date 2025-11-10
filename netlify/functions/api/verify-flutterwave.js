const fetch = globalThis.fetch || require("node-fetch");

exports.handler = async function (event) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const { id, tx_ref } = body;
    const FLW_SECRET = process.env.FLW_SECRET_KEY;
    if (!FLW_SECRET) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "FLW_SECRET_KEY not configured" }),
      };
    }

    let url = null;
    if (id) {
      url = `https://api.flutterwave.com/v3/transactions/${id}/verify`;
    } else if (tx_ref) {
      // endpoint to verify by reference
      url =
        `https://api.flutterwave.com/v3/transactions/verify` +
        `?tx_ref=${encodeURIComponent(tx_ref)}`;
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing transaction id or tx_ref" }),
      };
    }

    const resp = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${FLW_SECRET}`,
        "Content-Type": "application/json",
      },
    });

    const data = await resp.json().catch(() => null);
    if (!resp.ok) {
      return {
        statusCode: resp.status || 500,
        body: JSON.stringify({ error: data || "Verification failed" }),
      };
    }

    // Flutterwave returns {status: 'success', data: {}} on success
    if (data && data.status === "success") {
      return {
        statusCode: 200,
        body: JSON.stringify({ status: "success", data: data.data }),
      };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ status: "failed", data }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || String(error) }),
    };
  }
};
