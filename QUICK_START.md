# Frontend Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
cd scriptFrontend
npm install
```

### Step 2: Choose Your Environment

**For Local Development (Recommended for Testing)**

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000` (must be running)

**For Production Build**

```bash
npm run build
npm run preview
```

- Uses `https://script-backend-ojlh.onrender.com` as API base

### Step 3: Verify Configuration

Open browser console and check:

```javascript
import { API_BASE_URL } from "./lib/apiConfig";
console.log("API URL:", API_BASE_URL);
```

---

## 📡 API Usage in Components

### Example: Fetch Products

```javascript
import { getAllProducts } from "./lib/apiInventory";

export function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      }
    };
    loadProducts();
  }, []);

  return (
    <ul>
      {products.map((p) => (
        <li key={p._id}>{p.name}</li>
      ))}
    </ul>
  );
}
```

### Example: Record a Sale

```javascript
import { createSale } from "./lib/apiSales";

async function handleSale(saleData) {
  try {
    const result = await createSale({
      items: saleData.items,
      subtotal: 1000,
      tax: 100,
      total: 1100,
      paymentMethod: "cash",
      paymentStatus: "paid",
    });
    console.log("Sale recorded:", result);
  } catch (error) {
    console.error("Failed to record sale:", error);
  }
}
```

### Example: Authenticate User

```javascript
import { login } from "./lib/apiAuth";

async function handleLogin(email, password) {
  try {
    const response = await login(email, password);
    console.log("Logged in:", response.user);
    // Token is automatically stored
  } catch (error) {
    console.error("Login failed:", error);
  }
}
```

---

## 🔧 Available API Functions

### Authentication (`apiAuth.js`)

```javascript
import {
  register,
  login,
  logout,
  getCurrentUser,
  updateCurrentUser,
  updatePassword,
} from "./lib/apiAuth";
```

### Products/Inventory (`apiInventory.js`)

```javascript
import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getLowStock,
  getStatistics,
} from "./lib/apiInventory";
```

### Sales (`apiSales.js`)

```javascript
import {
  createSale,
  getAllSales,
  getSale,
  updateSalePayment,
  cancelSale,
  getSalesStats,
  getTodaySales,
} from "./lib/apiSales";
```

### Transactions (`apiTransactions.js`)

```javascript
import {
  createTransaction,
  getAllTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getCashFlowSummary,
  getCashFlowTrends,
  getTodayCashFlow,
} from "./lib/apiTransactions";
```

### Business (`apiBusiness.js`)

```javascript
import {
  getBusinessProfile,
  updateBusinessProfile,
  getBusinessPreferences,
  updateBusinessPreferences,
} from "./lib/apiBusiness";
```

### Notifications (`apiNotifications.js`)

```javascript
import {
  getNotifications,
  getNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  sendNotification,
  getNotificationStats,
} from "./lib/apiNotifications";
```

---

## ⚙️ Configuration Files

### `.env` (Development)

```env
VITE_API_URL=http://localhost:5000
```

### `.env.production` (Production)

```env
VITE_API_URL=https://script-backend-ojlh.onrender.com
```

To use different settings:

1. Edit the appropriate `.env` file
2. Restart the dev server: `npm run dev`

---

## 🐛 Common Issues

### Issue: API calls return 404

**Solution**: Ensure backend is running on `http://localhost:5000`

```bash
cd backend
npm run dev
```

### Issue: "CORS error"

**Solution**: Backend CORS must be configured for your frontend origin

- Check backend `.env` file
- Ensure `CORS_ORIGIN` includes your frontend URL

### Issue: "Unauthorized (401)"

**Solution**:

1. Clear browser storage: `localStorage.clear()`
2. Log out and log back in
3. Check token expiration

### Issue: "Rate limit exceeded (429)"

**Solution**: Wait a moment before making more requests

- Limit: 60 requests per minute
- Client-side backoff is automatic

---

## 📝 API Request/Response Pattern

All API functions follow this pattern:

```javascript
export async function myFunction(params) {
  try {
    const response = await apiGet("/api/endpoint");
    return response?.data || response || null;
  } catch (error) {
    throw new Error(error.message || "Operation failed");
  }
}
```

**Usage:**

```javascript
try {
  const result = await myFunction();
  console.log("Success:", result);
} catch (error) {
  console.error("Error:", error.message);
}
```

---

## 🔑 Authentication

### Login

```javascript
import { login, setAuthToken } from "./lib/apiAuth";

const response = await login("user@example.com", "password");
// Token is automatically saved
```

### Access Stored Token

```javascript
import { getAuthToken } from "./lib/api";

const token = getAuthToken();
```

### Logout

```javascript
import { logout, clearAuthToken } from "./lib/apiAuth";

await logout();
// Token is automatically cleared
```

---

## 📊 Example: Dashboard Data Loading

```javascript
import { getSalesStats } from "./lib/apiSales";
import { getStatistics } from "./lib/apiInventory";
import { getCashFlowSummary } from "./lib/apiTransactions";

export function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [sales, inventory, cashFlow] = await Promise.all([
          getSalesStats(),
          getStatistics(),
          getCashFlowSummary(),
        ]);
        setStats({ sales, inventory, cashFlow });
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    };
    loadStats();
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div>
      <h2>Sales: {stats.sales.totalRevenue}</h2>
      <h2>Inventory: {stats.inventory.totalProducts}</h2>
      <h2>Cash Flow: {stats.cashFlow.totalIncome}</h2>
    </div>
  );
}
```

---

## 🎯 Next Steps

1. ✅ Run `npm install` to install dependencies
2. ✅ Start backend: `cd backend && npm run dev`
3. ✅ Start frontend: `npm run dev`
4. ✅ Open `http://localhost:5173` in browser
5. ✅ Import and use API functions in components
6. ✅ Build for production: `npm run build`

---

## 📖 For More Details

See:

- `API_CONFIGURATION.md` - Complete configuration guide
- `scriptFrontend/client/lib/` - All API service files
- `backend/src/routes/routeDoc.md` - Backend endpoints

---

## ✅ You're Ready!

Start building with the API functions. All endpoints are configured and ready to use! 🚀
