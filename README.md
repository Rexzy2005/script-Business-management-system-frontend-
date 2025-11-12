# Script - Business Management System Frontend

A comprehensive React-based frontend for the Script business management platform, designed for Nigerian SMEs. This application provides an all-in-one solution for managing sales, inventory, cash flow, expenses, and customer relationships.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Installation & Setup](#installation--setup)
6. [Configuration](#configuration)
7. [Authentication](#authentication)
8. [Internationalization](#internationalization)
9. [API Integration](#api-integration)
10. [Component Architecture](#component-architecture)
11. [State Management](#state-management)
12. [Styling](#styling)
13. [Key Features Documentation](#key-features-documentation)
14. [Deployment](#deployment)
15. [Performance Optimization](#performance-optimization)
16. [Troubleshooting](#troubleshooting)
17. [Contributing](#contributing)

---

## Overview

Script is a business management platform built specifically for Nigerian entrepreneurs and SMEs. The frontend is built with React, Vite, and Tailwind CSS, offering a responsive, fast, and intuitive interface for managing business operations.

### Key Highlights

- **Multi-language Support**: English and Hausa translations throughout the app
- **Responsive Design**: Mobile-first approach with full desktop support
- **Real-time Updates**: Event-driven architecture for live data synchronization
- **Offline Support**: Progressive Web App capabilities for areas with unreliable internet
- **Nigerian Localization**: Support for Naira currency, local payment methods, and local workflows

---

## Features

### Core Modules

#### 1. **Sales Management**
- Create and record sales transactions
- Track payment status and history
- Generate sales reports and insights
- Support for bulk and per-piece sales
- Automatic inventory updates on sale completion

#### 2. **Inventory Management**
- Real-time stock level tracking
- Low stock alerts and monitoring
- Product categorization and tagging
- Bulk import capabilities (premium)
- Export inventory data as CSV
- Support for product variations

#### 3. **Expense Tracking**
- Categorize and record business expenses
- Track expenses by category with visual breakdown
- Monthly and yearly expense analysis
- Expense filtering and search
- Budget monitoring and alerts

#### 4. **Analytics & Reporting**
- Sales performance metrics
- Revenue trends and forecasting
- Inventory value tracking
- Customer acquisition and retention analytics
- Detailed business KPIs
- Export reports (premium feature)

#### 5. **Customer Management**
- Centralized customer database
- Track customer communication history
- Customer purchase history
- Segmentation and tagging
- Customer lifetime value tracking

#### 6. **Team Collaboration**
- Multi-user support with role-based access
- Team member management
- Task assignment and delegation
- Activity logs and audit trails
- Permission management

#### 7. **Payment Integration**
- Flutterwave payment gateway
- Multiple payment methods support
- Payment tracking and reconciliation
- Invoice generation
- Receipt management

#### 8. **Settings & Configuration**
- User profile management
- Business information configuration
- Subscription and billing settings
- Notification preferences
- Language and timezone settings

---

## Tech Stack

### Frontend Framework & Build
- **React 18+**: UI framework
- **Vite**: Fast build tool and dev server
- **TypeScript**: Type safety (optional)
- **JavaScript (ES6+)**: Primary language

### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing
- **Shadcn/ui**: Pre-built, accessible UI components
- **Lucide React**: Icon library

### State Management & Data
- **React Hooks**: State management (useState, useContext, useEffect)
- **React Router v6**: Client-side routing
- **Event Bus**: Custom event system for cross-component communication
- **LocalStorage**: Client-side data persistence

### API & HTTP
- **Fetch API**: HTTP requests
- **Custom API wrappers**: Modular API client functions

### Internationalization
- **Custom Translation System**: Lightweight i18n solution
- **LocalStorage**: Language preference persistence
- **Real-time Translation Updates**: Live language switching

### Payment & Integrations
- **Flutterwave SDK**: Payment processing
- **Nigerian Bank APIs**: Direct bank transfers

### Development Tools
- **ESLint**: Code quality
- **Prettier**: Code formatting
- **Vercel**: Deployment platform

---

## Project Structure

```
script-Business-management-system-frontend/
├── client/
│   ├── components/
│   │   ├── Layout.jsx                    # Main layout wrapper with sidebar
│   │   ├── Header.jsx                    # Top navigation and language switcher
│   │   ├── Footer.jsx                    # Footer component
│   │   ├── ProtectedRoute.jsx            # Route protection wrapper
│   │   ├── AdminRoute.jsx                # Admin-only route protection
│   │   ├── RateLimitWarning.jsx          # Rate limit notification
│   │   ├── admin/
│   │   │   └── AdminLayout.jsx           # Admin-specific layout
│   │   ├── bookings/
│   │   │   ├── BookingFilters.jsx        # Booking filter controls
│   │   │   └── BookingTable.jsx          # Booking table display
│   │   └── ui/
│   │       ├── accordion.jsx
│   │       ├── alert.jsx
│   │       ├── avatar.jsx
│   │       ├── badge.jsx
│   │       ├── breadcrumb.jsx
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── dialog.jsx
│   │       ├── dropdown-menu.jsx
│   │       ├── input.jsx
│   │       ├── label.jsx
│   │       ├── scroll-area.jsx
│   │       ├── select.jsx
│   │       ├── sonner.jsx
│   │       ├── switch.jsx
│   │       ├── table.jsx
│   │       ├── tabs.jsx
│   │       ├── textarea.jsx
│   │       ├── toast.jsx
│   │       ├── toaster.jsx
│   │       └── tooltip.jsx
│   ├── hooks/
│   │   ├── use-mobile.js                 # Mobile detection hook
│   │   ├── use-toast.js                  # Toast notification hook
│   │   ├── useRateLimiter.js             # Rate limiting hook
│   │   └── useTranslation.js             # Translation hook (custom)
│   ├── lib/
│   │   ├── api.js                        # General API client
│   │   ├── apiAuth.js                    # Authentication API
│   │   ├── apiBookings.js                # Bookings API
│   │   ├── apiBusiness.js                # Business info API
│   │   ├── apiConfig.js                  # API configuration
│   │   ├── apiExpenses.js                # Expenses API
│   │   ├── apiInventory.js               # Inventory API
│   │   ├── apiNotifications.js           # Notifications API
│   │   ├── apiSales.js                   # Sales API
│   │   ├── apiServices.js                # Services API
│   │   ├── apiSubscriptions.js           # Subscriptions API
│   │   ├── apiTransactions.js            # Transactions API
│   │   ├── auth.js                       # Authentication utilities
│   │   ├── data.js                       # Local data utilities
│   │   ├── eventBus.js                   # Event management system
│   │   ├── flutterwave.js                # Flutterwave integration
│   │   ├── paymentConfig.js              # Payment configuration
│   │   ├── plans.js                      # Subscription plans
│   │   ├── rateLimiter.js                # Rate limiting logic
│   │   ├── stockMonitor.js               # Stock monitoring system
│   │   ├── translationService.js         # Translation service
│   │   ├── uiText.js                     # Translation dictionary (EN/HA)
│   │   └── utils.js                      # Utility functions
│   ├── pages/
│   │   ├── Index.jsx                     # Landing page
│   │   ├── Dashboard.jsx                 # Main dashboard
│   │   ├── Sales.jsx                     # Sales page
│   │   ├── Inventory.jsx                 # Inventory management
│   │   ├── Expenses.jsx                  # Expense tracking
│   │   ├── Analytics.jsx                 # Analytics & reporting
│   │   ├── Customers.jsx                 # Customer management
│   │   ├── Clients.jsx                   # Clients page
│   │   ├── Reports.jsx                   # Reports page
│   │   ├── Payments.jsx                  # Payment history
│   │   ├── Settings.jsx                  # User settings
│   │   ├── Profile.jsx                   # User profile
│   │   ├── Schedule.jsx                  # Schedule/Bookings
│   │   ├── Services.jsx                  # Services management
│   │   ├── Team.jsx                      # Team management
│   │   ├── Features.jsx                  # Features page
│   │   ├── Pricing.jsx                   # Pricing page
│   │   ├── Solutions.jsx                 # Solutions page
│   │   ├── PublicListings.jsx            # Public listings
│   │   ├── PlanConfirmation.jsx          # Plan confirmation
│   │   ├── SignIn.jsx                    # Login page
│   │   ├── SignUp.jsx                    # Registration page
│   │   ├── NotFound.jsx                  # 404 page
│   │   └── admin/
│   │       ├── SuperAdminDashboard.jsx   # Admin dashboard
│   │       ├── UserManagement.jsx        # User management (admin)
│   │       ├── TenantManagement.jsx      # Tenant management (admin)
│   │       ├── APIManagement.jsx         # API management (admin)
│   │       ├── SecurityCompliance.jsx    # Security settings (admin)
│   │       ├── BillingControl.jsx        # Billing control (admin)
│   │       ├── SystemConfig.jsx          # System configuration (admin)
│   │       ├── SupportCenter.jsx         # Support center (admin)
│   │       └── Analytics.jsx             # Admin analytics
│   ├── App.jsx                           # Main app component
│   ├── global.css                        # Global styles
│   └── main.jsx                          # React entry point
├── public/
│   └── robots.txt                        # SEO robots file
├── server/
│   ├── lib/
│   │   └── mongo.js                      # MongoDB connection
│   └── routes/
│       └── payments.js                   # Payment routes
├── index.html                            # HTML entry point
├── vite.config.js                        # Vite configuration
├── tailwind.config.js                    # Tailwind CSS config
├── postcss.config.js                     # PostCSS config
├── eslint.config.js                      # ESLint configuration
├── components.json                       # Shadcn/ui components config
├── package.json                          # Dependencies & scripts
└── vercel.json                           # Vercel deployment config
```

---

## Installation & Setup

### Prerequisites
- Node.js 16.0.0 or higher
- npm or yarn package manager
- Git for version control

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd script-Business-management-system-frontend
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 3: Setup Environment Variables
Create a `.env.local` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=30000

# Authentication
VITE_AUTH_TOKEN_KEY=script_auth_token
VITE_AUTH_USER_KEY=script_user_data

# Payment Gateway (Flutterwave)
VITE_FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_key_here
VITE_FLUTTERWAVE_MERCHANT_ID=your_merchant_id

# Feature Flags
VITE_ENABLE_OFFLINE_MODE=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true

# Rate Limiting
VITE_RATE_LIMIT_REQUESTS=100
VITE_RATE_LIMIT_WINDOW_MS=60000

# Application
VITE_APP_NAME=Script
VITE_APP_VERSION=1.0.0
```

### Step 4: Start Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### Step 5: Build for Production
```bash
npm run build
# or
yarn build
```

---

## Configuration

### Vite Configuration (`vite.config.js`)
Customizes build output and dev server settings.

### Tailwind CSS (`tailwind.config.js`)
Extends default Tailwind theme with custom colors and spacing.

### API Configuration (`client/lib/apiConfig.js`)
Centralized API endpoint configuration with baseURL, headers, and interceptors.

### Payment Configuration (`client/lib/paymentConfig.js`)
Configures payment gateway settings for Flutterwave integration.

### Subscription Plans (`client/lib/plans.js`)
Defines available subscription tiers and their features.

---

## Authentication

### Auth Flow
1. User signs up or logs in
2. Backend returns JWT token and user data
3. Token stored in localStorage
4. Token included in subsequent API requests
5. On token expiration, user is logged out

### Implementation

**Login** (`SignIn.jsx`):
```javascript
import { signIn } from "@/lib/auth";

const handleLogin = async (email, password) => {
  try {
    await signIn(email, password);
    navigate("/dashboard");
  } catch (error) {
    toast.error("Login failed");
  }
};
```

**Protected Routes** (`ProtectedRoute.jsx`):
```javascript
<Route element={<ProtectedRoute><Dashboard /></ProtectedRoute>} path="/dashboard" />
```

**Token Management** (`client/lib/auth.js`):
- `setCurrentUser()` - Store user in localStorage
- `getUser()` - Retrieve user from localStorage
- `getToken()` - Get auth token
- `isAuthenticated()` - Check if user is logged in
- `signOut()` - Clear auth data

---

## Internationalization

### Translation System

The app supports English (en) and Hausa (ha) with a custom translation system.

### Translation Dictionary (`client/lib/uiText.js`)

```javascript
export const STATIC_TRANSLATIONS = {
  en: {
    "Dashboard": "Dashboard",
    "Sales": "Sales",
    // ... 300+ English translations
  },
  ha: {
    "Dashboard": "Gida",
    "Sales": "Siyarwa",
    // ... 300+ Hausa translations
  }
}
```

### Translation Hook (`client/hooks/useTranslation.js`)

```javascript
import { useTranslation } from "@/hooks/useTranslation";

export default function MyComponent() {
  const { t, language, changeLanguage } = useTranslation();
  
  return (
    <div>
      <h1>{t("Dashboard")}</h1>
      <button onClick={() => changeLanguage("ha")}>
        Hausa
      </button>
    </div>
  );
}
```

### How It Works

1. **Translation Service** loads the dictionary
2. **useTranslation Hook** provides `t()` function
3. `t()` looks up translation key in current language
4. Falls back to English if translation not found
5. Language preference saved to localStorage
6. All components re-render on language change

### Adding New Translations

1. Add key-value pairs to `uiText.js`:
```javascript
"New Feature": "New Feature",  // English
"New Feature": "Sabuwar Fasali",  // Hausa
```

2. Use in component:
```javascript
<h1>{t("New Feature")}</h1>
```

---

## API Integration

### API Client Structure

API is organized into modular files, one per resource:

- `apiAuth.js` - User authentication
- `apiSales.js` - Sales operations
- `apiInventory.js` - Inventory management
- `apiExpenses.js` - Expense tracking
- `apiCustomers.js` - Customer data
- `apiSubscriptions.js` - Subscription management

### Example API Call

```javascript
import { getSales } from "@/lib/apiSales";

useEffect(() => {
  const loadSales = async () => {
    try {
      const data = await getSales();
      setSales(data);
    } catch (error) {
      toast.error("Failed to load sales");
    }
  };
  loadSales();
}, []);
```

### API Configuration

```javascript
// client/lib/apiConfig.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT;

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json"
  }
};
```

### Rate Limiting

API calls are rate-limited per user to prevent abuse:

```javascript
import { useRateLimiter } from "@/hooks/useRateLimiter";

const { isLimited, attempt } = useRateLimiter(100, 60000); // 100 requests per minute

const handleApiCall = async () => {
  if (attempt()) {
    // Make API call
  } else {
    toast.error("Too many requests. Please wait.");
  }
};
```

---

## Component Architecture

### Layout Components

#### `Layout.jsx` - Main wrapper
```javascript
<Layout>
  <YourPage />
</Layout>
```

Provides:
- Sidebar navigation (desktop)
- Mobile hamburger menu
- Language switcher
- User profile dropdown
- Sign out functionality

#### `Header.jsx` - Top navigation
```javascript
<Header onToggle={toggleSidebar} />
```

Features:
- Logo and branding
- Navigation links
- Language toggle (EN/HA)
- User authentication info

#### `AdminLayout.jsx` - Admin-specific layout
```javascript
<AdminLayout>
  <AdminPage />
</AdminLayout>
```

### Page Components

Each page follows a consistent structure:

```javascript
import { useTranslation } from "@/hooks/useTranslation";
import Layout from "@/components/Layout";

export default function MyPage() {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // API call
    } catch (error) {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1>{t("Page Title")}</h1>
        {/* Page content */}
      </div>
    </Layout>
  );
}
```

### UI Components

Pre-built components from Shadcn/ui:

```javascript
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead } from "@/components/ui/table";

// Usage
<Button size="lg" variant="outline">
  Click me
</Button>

<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

---

## State Management

### React Hooks
The app primarily uses React Hooks for state management:

```javascript
// Local component state
const [count, setCount] = useState(0);

// Side effects
useEffect(() => {
  loadData();
}, []);

// Context for global state
const { t, language } = useTranslation();
```

### Event Bus
Custom event system for cross-component communication:

```javascript
import { emit, on } from "@/lib/eventBus";

// Emit event
emit("sale-added", {id: 1, amount: 5000});

// Subscribe to event
const unsubscribe = on("sale-added", (data) => {
  console.log("New sale:", data);
});

// Cleanup
unsubscribe();
```

### LocalStorage
Client-side persistence:

```javascript
// Save
localStorage.setItem("preferred_language", "ha");

// Retrieve
const language = localStorage.getItem("preferred_language");

// Remove
localStorage.removeItem("auth_token");
```

---

## Styling

### Tailwind CSS
Utility-first CSS framework for rapid UI development:

```jsx
<div className="p-4 bg-card border border-border rounded-lg">
  <h2 className="text-2xl font-bold">Title</h2>
  <p className="text-sm text-muted-foreground">Description</p>
</div>
```

### Custom Theme
Extended in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#2D7C35",
        secondary: "#F97316",
        // Custom colors
      },
      spacing: {
        // Custom spacing
      }
    }
  }
}
```

### Responsive Design
Mobile-first approach:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards automatically stack on small screens */}
</div>
```

---

## Key Features Documentation

### 1. Sales Management

**File**: `client/pages/Sales.jsx`

Features:
- Record sales with item details
- Track payment methods
- Generate sales receipts
- Inventory auto-update
- Sales history and filtering

```javascript
// Create a sale
const submitSaleForm = async (formData) => {
  const result = await addSale({
    items: formData.items,
    customer: formData.customer,
    totalAmount: formData.amount,
    paymentMethod: formData.method
  });
  
  if (result) {
    emit("sale-added", result);
    toast.success("Sale recorded");
  }
};
```

### 2. Inventory Management

**File**: `client/pages/Inventory.jsx`

Features:
- Add/edit products
- Track stock levels
- Set reorder points
- Monitor low stock
- Bulk operations
- Export data

```javascript
// Add inventory item
const handleAddItem = async (itemData) => {
  const totalQty = itemData.totalProducts * itemData.piecesPerProduct;
  const result = await addInventoryItem({
    name: itemData.name,
    qty: totalQty,
    price: itemData.pricePerPiece
  });
};
```

### 3. Expense Tracking

**File**: `client/pages/Expenses.jsx`

Features:
- Categorize expenses
- Track by category
- Monthly analysis
- Budget monitoring
- Expense filtering

```javascript
// Add expense
const handleSubmit = async (e) => {
  e.preventDefault();
  const expense = await addExpense({
    description: formData.description,
    amount: formData.amount,
    category: formData.category,
    date: formData.date
  });
};
```

### 4. Analytics & Reports

**File**: `client/pages/Analytics.jsx`

Features:
- Sales trends
- Revenue metrics
- Expense analysis
- Customer insights
- Chart visualizations

```javascript
// Fetch analytics
useEffect(() => {
  const loadStats = async () => {
    const stats = await getStatistics();
    setStats(stats);
  };
  loadStats();
}, []);
```

### 5. Customer Management

**File**: `client/pages/Customers.jsx`

Features:
- Centralized customer database
- Purchase history
- Contact management
- Segmentation
- Communication tracking

### 6. Settings

**File**: `client/pages/Settings.jsx`

Features:
- User preferences
- Business info
- Timezone/currency settings
- Notification preferences
- Security settings

### 7. Admin Dashboard

**Files**: `client/pages/admin/*.jsx`

Features:
- User management
- System configuration
- Billing control
- Security compliance
- API management
- Support tickets

---

## Deployment

### Vercel (Recommended)

1. Connect repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add environment variables in Vercel dashboard
4. Deploy on push to main branch

### Manual Deployment

1. Build application:
```bash
npm run build
```

2. Deploy `dist` folder to hosting:
```bash
# Using surge.sh
surge dist

# Using netlify
netlify deploy --prod --dir dist

# Using vercel CLI
vercel deploy
```

### Environment Variables for Production
```env
VITE_API_BASE_URL=https://api.scriptapp.ng/api
VITE_FLUTTERWAVE_PUBLIC_KEY=prod_key_here
VITE_APP_ENV=production
```

---

## Performance Optimization

### Code Splitting
Routes are automatically code-split by Vite.

### Image Optimization
- Use optimized image formats (WebP)
- Lazy load images
- Use responsive image sizes

### Caching Strategy
- Static assets cached by CDN
- API responses cached in localStorage
- Service Workers for offline support

### Bundle Analysis
```bash
npm run build -- --analyze
```

### Lighthouse Metrics
Target scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

---

## Troubleshooting

### Common Issues

#### 1. "Cannot find module" errors
**Solution**: Clear node_modules and reinstall:
```bash
rm -rf node_modules
npm install
```

#### 2. Blank page on load
**Solution**: Check browser console for errors, verify API configuration

#### 3. API calls failing
**Solution**: Ensure backend is running, check CORS headers

#### 4. Translations not working
**Solution**: Verify language codes (en/ha), check useTranslation hook

#### 5. Build fails
**Solution**: Update dependencies, check for deprecated code

### Debug Mode
Enable debug logging:
```javascript
localStorage.setItem("debug", "true");
```

### Browser DevTools
- Use React DevTools extension
- Check Network tab for API calls
- Monitor Console for errors
- Use Lighthouse for performance

---

## Contributing

### Code Standards
- Follow existing code style
- Use functional components with hooks
- Write meaningful variable names
- Add comments for complex logic
- Test before submitting PR

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes
git add .

# Commit with meaningful message
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/your-feature

# Create pull request
```

### Code Review Checklist
- [ ] Code follows project style guide
- [ ] No console errors or warnings
- [ ] Changes tested locally
- [ ] Translations added for new text
- [ ] Mobile responsiveness checked
- [ ] Performance impact assessed

---

## Support & Documentation

### Resources
- **API Documentation**: `/docs/api.md`
- **Component Library**: Shadcn/ui (shadcn/ui.com)
- **Tailwind CSS**: tailwindcss.com
- **React Documentation**: react.dev
- **Vite Documentation**: vitejs.dev

### Getting Help
- Check existing GitHub issues
- Create detailed bug reports
- Include steps to reproduce
- Provide environment details

### Community
- Discord: [Join our community]
- Twitter: [@ScriptApp]
- Email: support@scriptapp.ng

---

## License

This project is proprietary software. Unauthorized copying or distribution is prohibited.

© 2025 Script Business Management. All rights reserved.

---

## Version History

### v1.0.0 (Current)
- Initial release
- Full feature set for SME management
- Multi-language support (EN/HA)
- Payment gateway integration
- Admin dashboard
- Analytics and reporting

### Roadmap
- [ ] Mobile app (React Native)
- [ ] Offline-first sync
- [ ] Advanced forecasting
- [ ] Multi-business support
- [ ] API for third-party integrations
- [ ] WhatsApp integration
- [ ] SMS notifications
- [ ] Voice-based commands

---

**Last Updated**: November 12, 2025
**Maintained By**: Script Development Team
**Status**: Active Development
