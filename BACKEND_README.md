# Script - Backend Configuration & Setup Guide

This document provides detailed instructions for configuring and implementing the backend server for the Script platform. The frontend application expects a REST API that handles authentication, data management, payments, and business operations.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack Requirements](#technology-stack-requirements)
3. [Environment Configuration](#environment-configuration)
4. [API Endpoints](#api-endpoints)
5. [Database Schema](#database-schema)
6. [Authentication & Authorization](#authentication--authorization)
7. [Payment Integration](#payment-integration)
8. [Rate Limiting](#rate-limiting)
9. [Error Handling](#error-handling)
10. [Deployment](#deployment)

---

## Architecture Overview

The Script platform follows a **client-server architecture**:

- **Frontend**: React 18 + React Router 6 SPA (Single Page Application)
- **Backend**: REST API server handling all business logic
- **Database**: Relational database (PostgreSQL recommended)
- **Payment Gateway**: Flutterwave integration for Nigerian payments

### Key Principles

- All sensitive operations must be handled server-side
- Authentication via JWT tokens with expiration
- Rate limiting to prevent abuse
- Comprehensive error handling and logging
- CORS enabled for frontend domain

---

## Technology Stack Requirements

### Recommended Stack

- **Runtime**: Node.js (v16+) or Python (3.9+)
- **Framework**: Express.js, Django, FastAPI, or similar
- **Database**: PostgreSQL (recommended) or MongoDB
- **ORM/Query Builder**: Sequelize, TypeORM, SQLAlchemy, or Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Payment Integration**: Flutterwave SDK
- **Hosting**: AWS, DigitalOcean, Hercel, or similar
- **Environment**: Docker (recommended for containerization)

### Alternative Stacks

**Python/Django**

```
Python 3.9+
Django 4.0+
Django REST Framework
psycopg2 (PostgreSQL adapter)
djangorestframework-simplejwt
requests (for external APIs)
```

**Node.js/Express**

```
Node.js 16+
Express 4.18+
TypeORM or Sequelize (ORM)
jsonwebtoken
bcryptjs
flutterwave-node (payment SDK)
cors
dotenv
```

---

## Environment Configuration

### Required Environment Variables

Create a `.env` file in your backend root directory with the following variables:

```env
# Server Configuration
NODE_ENV=production
PORT=3000
API_URL=https://your-api-domain.com
FRONTEND_URL=https://your-frontend-domain.com

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=script_production
DB_USER=postgres
DB_PASSWORD=your_secure_password
DATABASE_URL=postgresql://postgres:password@localhost:5432/script_production

# JWT Authentication
JWT_SECRET=your_long_secure_secret_key_min_32_characters
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=your_long_refresh_secret_key
JWT_REFRESH_EXPIRATION=7d

# Flutterwave Payment Integration
FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_public_key
FLUTTERWAVE_SECRET_KEY=your_flutterwave_secret_key
FLUTTERWAVE_ENCRYPTION_KEY=your_encryption_key

# Email Service (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_email_password
EMAIL_FROM=noreply@script.app

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# CORS
CORS_ORIGIN=https://your-frontend-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

### Local Development Setup

```env
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=5432
DB_NAME=script_dev
DB_USER=postgres
DB_PASSWORD=dev_password

JWT_SECRET=dev_secret_key_only_for_development
JWT_EXPIRATION=24h
```

---

## API Endpoints

### Base URL

```
Production: https://api.script.app/api
Development: http://localhost:5000/api
```

### Authentication Endpoints

#### Register User

```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "08012345678",
  "password": "secure_password_min_8_chars",
  "businessName": "John's Store",
  "businessType": "product_seller",
  "plan": "standard"
}

Response: 201 Created
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "businessName": "John's Store",
    "role": "user",
    "isAdmin": false,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "Account created successfully"
}
```

#### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure_password_min_8_chars"
}

Response: 200 OK
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "businessName": "John's Store",
    "role": "user"
  }
}
```

#### Get Current User

```
GET /api/auth/me
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "user": {
    "id": "user_uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "08012345678",
    "businessName": "John's Store",
    "businessType": "product_seller",
    "plan": "standard",
    "role": "user",
    "isAdmin": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-16T14:22:00Z"
  }
}
```

#### Logout

```
POST /api/auth/logout
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Invoices Endpoints

#### List Invoices

```
GET /api/invoices
Authorization: Bearer {token}
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 20)
  - status: draft|sent|paid|overdue
  - startDate: ISO date
  - endDate: ISO date

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "invoice_uuid",
      "number": "INV-001",
      "clientId": "client_uuid",
      "clientName": "ABC Company",
      "items": [
        {
          "description": "Product A",
          "quantity": 2,
          "unitPrice": 5000,
          "subtotal": 10000
        }
      ],
      "subtotal": 10000,
      "tax": 1000,
      "total": 11000,
      "status": "paid",
      "issueDate": "2024-01-15",
      "dueDate": "2024-02-15",
      "paidDate": "2024-01-20",
      "notes": "Payment terms: Net 30",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T14:22:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

#### Create Invoice

```
POST /api/invoices
Authorization: Bearer {token}
Content-Type: application/json

{
  "clientId": "client_uuid",
  "items": [
    {
      "description": "Product A",
      "quantity": 2,
      "unitPrice": 5000
    }
  ],
  "tax": 1000,
  "issueDate": "2024-01-15",
  "dueDate": "2024-02-15",
  "notes": "Payment terms: Net 30"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": "invoice_uuid",
    "number": "INV-001",
    "clientId": "client_uuid",
    "items": [...],
    "total": 11000,
    "status": "draft",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Update Invoice

```
PUT /api/invoices/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "sent",
  "items": [...],
  "tax": 1000,
  "dueDate": "2024-02-15"
}

Response: 200 OK
{
  "success": true,
  "data": { /* updated invoice */ }
}
```

#### Delete Invoice

```
DELETE /api/invoices/{id}
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Invoice deleted successfully"
}
```

### Inventory Endpoints

#### List Inventory

```
GET /api/inventory
Authorization: Bearer {token}
Query Parameters:
  - page: number
  - limit: number
  - category: string
  - search: string

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "item_uuid",
      "name": "Product A",
      "sku": "SKU-001",
      "category": "Electronics",
      "qty": 50,
      "unitCost": 3000,
      "retailPrice": 5000,
      "value": "₦150,000",
      "reorderPoint": 10,
      "supplier": "Supplier ABC",
      "lastRestocked": "2024-01-10",
      "status": "active",
      "createdAt": "2024-01-01T10:00:00Z"
    }
  ],
  "pagination": { /* ... */ }
}
```

#### Create Inventory Item

```
POST /api/inventory
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Product A",
  "sku": "SKU-001",
  "category": "Electronics",
  "qty": 50,
  "unitCost": 3000,
  "retailPrice": 5000,
  "reorderPoint": 10,
  "supplier": "Supplier ABC"
}

Response: 201 Created
{
  "success": true,
  "data": { /* created item */ }
}
```

#### Update Inventory Item

```
PUT /api/inventory/{id}
Authorization: Bearer {token}

{
  "qty": 45,
  "retailPrice": 5500
}

Response: 200 OK
{
  "success": true,
  "data": { /* updated item */ }
}
```

### Clients Endpoints

#### List Clients

```
GET /api/clients
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "client_uuid",
      "name": "ABC Company",
      "email": "contact@abc.com",
      "phone": "08012345678",
      "address": "123 Main St",
      "city": "Lagos",
      "contactPerson": "John Smith",
      "createdAt": "2024-01-01T10:00:00Z"
    }
  ]
}
```

#### Create Client

```
POST /api/clients
Authorization: Bearer {token}

{
  "name": "ABC Company",
  "email": "contact@abc.com",
  "phone": "08012345678",
  "address": "123 Main St",
  "city": "Lagos",
  "contactPerson": "John Smith"
}

Response: 201 Created
```

### Payments Endpoints

#### List Payments

```
GET /api/payments
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "payment_uuid",
      "invoiceId": "invoice_uuid",
      "amount": 11000,
      "method": "flutterwave",
      "status": "completed",
      "transactionRef": "fw_tx_12345",
      "paymentDate": "2024-01-20T10:30:00Z"
    }
  ]
}
```

#### Create Payment

```
POST /api/payments
Authorization: Bearer {token}

{
  "invoiceId": "invoice_uuid",
  "amount": 11000,
  "method": "flutterwave"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": "payment_uuid",
    "invoiceId": "invoice_uuid",
    "amount": 11000,
    "status": "pending",
    "authorizationUrl": "https://checkout.flutterwave.com/..."
  }
}
```

#### Verify Payment

```
POST /api/payments/{id}/verify
Authorization: Bearer {token}

{
  "flutterwave_transaction_id": "fw_tx_12345"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "payment_uuid",
    "status": "completed",
    "amount": 11000,
    "verifiedAt": "2024-01-20T10:35:00Z"
  }
}
```

### Analytics Endpoints

#### Get Statistics

```
GET /api/analytics/statistics
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "overview": {
      "totalRevenue": 500000,
      "totalCustomers": 45,
      "totalInvoices": 120,
      "totalValue": 1500000,
      "lowStockCount": 3,
      "changeLabel": "+15% from last month"
    },
    "monthly": [
      {
        "month": "Jan",
        "revenue": 150000,
        "expenses": 50000,
        "profit": 100000
      }
    ],
    "recentActivity": [
      "Invoice INV-045 paid",
      "Inventory updated: Product A",
      "New client added: XYZ Corp"
    ]
  }
}
```

---

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  business_type VARCHAR(50) NOT NULL DEFAULT 'product_seller',
  plan VARCHAR(50) NOT NULL DEFAULT 'standard',
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  is_admin BOOLEAN DEFAULT FALSE,
  is_super_admin BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
```

### Invoices Table

```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE SET NULL,
  subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0,
  tax DECIMAL(12, 2) NOT NULL DEFAULT 0,
  total DECIMAL(12, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invoices_user ON invoices(user_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_date ON invoices(issue_date);
```

### Invoice Items Table

```sql
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description VARCHAR(255) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit_price DECIMAL(12, 2) NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invoice_items_invoice ON invoice_items(invoice_id);
```

### Inventory Table

```sql
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(100),
  qty DECIMAL(10, 2) NOT NULL,
  unit_cost DECIMAL(12, 2) NOT NULL,
  retail_price DECIMAL(12, 2) NOT NULL,
  reorder_point DECIMAL(10, 2) DEFAULT 10,
  supplier VARCHAR(255),
  last_restocked DATE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inventory_user ON inventory(user_id);
CREATE INDEX idx_inventory_sku ON inventory(sku);
CREATE INDEX idx_inventory_status ON inventory(status);
```

### Clients Table

```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  contact_person VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_clients_user ON clients(user_id);
CREATE INDEX idx_clients_email ON clients(email);
```

### Payments Table

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  amount DECIMAL(12, 2) NOT NULL,
  method VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  transaction_ref VARCHAR(255),
  payment_date TIMESTAMP,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_payments_status ON payments(status);
```

---

## Authentication & Authorization

### JWT Token Strategy

1. **Access Token**: Short-lived (24 hours), used for API requests
2. **Refresh Token**: Long-lived (7 days), used to obtain new access tokens
3. **Token Format**: Bearer token in Authorization header

### Token Payload

```json
{
  "iss": "https://script.app",
  "sub": "user_uuid",
  "email": "user@example.com",
  "role": "user",
  "isAdmin": false,
  "iat": 1705312200,
  "exp": 1705398600
}
```

### Implementation Example (Node.js)

```javascript
const jwt = require("jsonwebtoken");

// Generate tokens
function generateTokens(user) {
  const accessToken = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION || "24h" },
  );

  const refreshToken = jwt.sign(
    { sub: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRATION || "7d" },
  );

  return { accessToken, refreshToken };
}

// Verify token middleware
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}
```

### Role-Based Access Control

```javascript
// Admin middleware
function requireAdmin(req, res, next) {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

// User ownership verification
async function verifyOwnership(req, res, next) {
  const resource = await getResource(req.params.id);
  if (resource.userId !== req.user.sub) {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
}
```

---

## Payment Integration

### Flutterwave Setup

1. **Create Account**: Sign up at https://dashboard.flutterwave.com
2. **Get Credentials**:
   - Public Key
   - Secret Key
   - Encryption Key
3. **Set Webhook**: Configure webhook URL for payment notifications
4. **Test Mode**: Use test credentials during development

### Webhook Implementation

```javascript
app.post("/api/webhooks/flutterwave", (req, res) => {
  const secret = process.env.FLUTTERWAVE_SECRET_KEY;
  const hash = req.headers["verif-hash"];

  // Verify webhook signature
  if (hash !== secret) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const { data, event } = req.body;

  if (event === "charge.completed") {
    // Update payment status to completed
    updatePaymentStatus(data.id, "completed");

    // Update invoice status
    updateInvoiceStatus(data.meta.invoiceId, "paid");
  }

  res.json({ success: true });
});
```

---

## Rate Limiting

### Implementation Strategy

Use token bucket algorithm with the following limits:

- **Global**: 10 requests/second per IP
- **Per-Minute**: 300 requests/minute per user
- **Per-Endpoint**: Custom limits for sensitive operations

### Redis-Based Rate Limiter

```javascript
const redis = require("redis");
const client = redis.createClient();

async function checkRateLimit(userId, endpoint) {
  const key = `ratelimit:${userId}:${endpoint}`;
  const count = await client.incr(key);

  if (count === 1) {
    await client.expire(key, 60); // 1 minute window
  }

  if (count > 300) {
    throw new Error("Rate limit exceeded");
  }
}
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error)
- **401**: Unauthorized (invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **409**: Conflict (duplicate email, etc.)
- **429**: Too Many Requests (rate limit)
- **500**: Internal Server Error

### Implementation Example

```javascript
function handleError(error, res) {
  console.error("Error:", error);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: error.message,
        details: error.details,
      },
    });
  }

  if (error.name === "UnauthorizedError") {
    return res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Invalid credentials" },
    });
  }

  res.status(500).json({
    success: false,
    error: { code: "INTERNAL_ERROR", message: "An error occurred" },
  });
}
```

---

## Deployment

### Docker Setup

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
version: "3.8"

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/script
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=script
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

### Production Deployment Checklist

- [ ] Set all environment variables securely
- [ ] Use HTTPS only
- [ ] Enable CORS for frontend domain only
- [ ] Configure rate limiting
- [ ] Set up database backups
- [ ] Configure error logging (Sentry, DataDog, etc.)
- [ ] Set up monitoring and alerting
- [ ] Configure CDN for static assets
- [ ] Enable database connection pooling
- [ ] Set up staging environment for testing
- [ ] Configure CI/CD pipeline
- [ ] Enable security headers (CSP, X-Frame-Options, etc.)

---

## Testing

### Unit Tests

```javascript
describe("Auth Service", () => {
  describe("register", () => {
    it("should create a new user with hashed password", async () => {
      const user = await registerUser({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      });

      expect(user.email).toBe("john@example.com");
      expect(user.passwordHash).not.toBe("password123");
    });

    it("should reject duplicate email", async () => {
      await expect(
        registerUser({
          email: "existing@example.com",
          password: "password123",
        }),
      ).rejects.toThrow("Email already registered");
    });
  });
});
```

### Integration Tests

```javascript
describe("Invoice API", () => {
  it("should list user invoices", async () => {
    const response = await request(app)
      .get("/api/invoices")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
```

---

## Support & Documentation

For additional support or questions about backend configuration:

1. Check the API documentation at `/api/docs` (if Swagger is configured)
2. Review error logs for debugging
3. Consult the frontend source code at `client/lib/api*.js` for expected API contracts
4. Check environment variable requirements in `.env.example`

---

## Summary

The Script backend must implement a robust REST API that handles:

1. ✅ User authentication with JWT tokens
2. ✅ Complete CRUD operations for invoices, inventory, clients, and payments
3. ✅ Integration with Flutterwave for payments
4. ✅ Proper authorization and role-based access control
5. ✅ Rate limiting to prevent abuse
6. ✅ Comprehensive error handling
7. ✅ Secure data storage and validation
8. ✅ Webhook support for payment notifications

Follow this guide to implement a production-ready backend that integrates seamlessly with the Script frontend application.
