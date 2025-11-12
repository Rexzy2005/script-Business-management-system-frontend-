I want to integrate the NativeAI translation API (https://nativeai.icirnigeria.org/api/translate) into my dashboard app.
The goal is to automatically translate all static UI text — including forms, buttons, menus, and labels — across all dashboard pages.

Key requirements:

The translation should only affect the UI layer (not database content or dynamic data).

Supported languages: English, Hausa, Igbo, Yoruba.

Users should be able to switch languages from two places:

The Settings page (language dropdown or toggle)

A language icon on the dashboard navigation bar

Clicking it opens a dropdown showing the four languages.

The icon should clearly represent language switching (e.g., a globe 🌐 or “A↔文” symbol) and fit the dashboard style.

Once a user selects a language, all UI text updates instantly using the NativeAI API.

The app should remember the user’s last selected language (store in localStorage or Supabase user preferences).

Implement caching so the app doesn’t re-translate the same text repeatedly.

Bonus (optional but preferred):

Provide a fallback to English if the API fails or the translation isn’t available.

Keep translations smooth and efficient (no reloads if possible).



# ============================================
# SERVER CONFIGURATION
# ============================================
NODE_ENV=development
PORT=5000
API_VERSION=v1

# DATABASE CONFIGURATION
# ============================================
MONGODB_URI=mongodb+srv://timothypererat2004_db_user:password1%40@cluster0.st9ccex.mongodb.net/hackJos2025?appName=Cluster0

# ============================================
# JWT AUTHENTICATION
# ============================================
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-change-this-in-production
JWT_REFRESH_EXPIRES_IN=30d

# ============================================
# FLUTTERWAVE PAYMENT GATEWAY
# ============================================
FLUTTERWAVE_SECRET_KEY=FLWSECK-ea68f56dba2b673271cbd72e2be6814c-19a694da32evt-X
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-f924db2b324104ba75fd9090a1074995-X
FLUTTERWAVE_ENCRYPTION_KEY=ea68f56dba2bdfe855e2d692
FLUTTERWAVE_BASE_URL=https://api.flutterwave.com/v3

# ============================================
# FRONTEND CONFIGURATION
# ============================================
FRONTEND_URL=http://localhost:8080
CORS_ORIGIN=http://localhost:3000,http://localhost:8080

# ============================================
# RATE LIMITING
# ============================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_AUTH_WINDOW_MS=300000
RATE_LIMIT_AUTH_MAX_REQUESTS=5

# ============================================
# SECURITY
# ============================================
BCRYPT_SALT_ROUNDS=12

# ============================================
# BUSINESS CONFIGURATION
# ============================================
INVOICE_PREFIX=INV
CURRENCY=NGN
TAX_RATE=7.5
LOW_STOCK_THRESHOLD=10

# ============================================
# LOGGING
# ============================================
LOG_LEVEL=info
MORGAN_FORMAT=dev
