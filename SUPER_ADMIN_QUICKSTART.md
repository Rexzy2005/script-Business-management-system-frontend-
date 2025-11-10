# Super Admin Panel - Quick Start Guide

## Overview

This is a quick start guide to access and use the Super Admin Panel in development and production environments.

---

## Development: Quick Start (5 Minutes)

### Step 1: Start the Dev Server

```bash
npm run dev
```

### Step 2: Open Developer Console

Open your browser's developer console (F12 or right-click → Inspect → Console)

### Step 3: Sign In as Admin

Paste this into the console:

```javascript
import { signInAsAdmin } from "./lib/auth.js";
signInAsAdmin("admin@example.com", "super-admin");
```

### Step 4: Navigate to Admin Panel

Go to: `http://localhost:8080/admin`

You should see the Super Admin Dashboard with:

- System health metrics
- Key statistics
- User growth trends
- Revenue analytics

---

## Admin Panel Features Overview

### 📊 Dashboard (`/admin`)

**Main overview of your platform**

- System health status (uptime %)
- Key metrics (tenants, users, revenue)
- Real-time charts and graphs
- Recent activity feed
- Quick action buttons

### 🏢 Tenants (`/admin/tenants`)

**Manage all businesses**

- Register new tenants
- View tenant details
- Suspend/reactivate accounts
- Delete tenants (with confirmation)
- Filter by status and plan
- View usage and revenue

### 👥 Users (`/admin/users`)

**Global user management**

- Search all platform users
- Reset user passwords
- Suspend/ban accounts
- View 2FA status
- Monitor last login
- Track account activity

### 💳 Billing (`/admin/billing`)

**Revenue and subscription control**

- Create/edit pricing plans
- View revenue trends
- Manage payment records
- Track billing analytics
- View plan distribution
- Export billing reports

### 📈 Analytics (`/admin/analytics`)

**Platform insights and metrics**

- User growth trends
- Trial-to-paid conversion
- Churn analysis
- Retention cohorts
- Financial metrics (MRR, LTV, CAC)
- User segmentation

### 🆘 Support (`/admin/support`)

**Help desk and communications**

- Manage support tickets
- Assign to support staff
- Track ticket status
- Send announcements
- Collect feedback
- View SLA metrics

### 🔌 API Management (`/admin/api-management`)

**Developer tools**

- Generate/revoke API keys
- Create webhooks
- Monitor API usage
- View usage logs
- Track error rates

### ⚙️ System Config (`/admin/config`)

**Global settings**

- Email (SMTP) configuration
- SMS gateway setup
- Cloud storage configuration
- Feature flag management
- Maintenance mode control

### 🔒 Security (`/admin/security`)

**Compliance and security**

- View audit logs
- Check compliance status
- Manage backups
- Monitor security events
- Track security incidents

---

## Key Admin Tasks

### Register a New Tenant

1. Go to **Tenants** page
2. Click **"Register Tenant"** button
3. Fill in:
   - Business Name
   - Admin Email
   - Select Plan (Starter/Pro/Enterprise)
4. Click **"Register Tenant"**

### Manage User Access

1. Go to **Users** page
2. Find user in list or search
3. Click the **⋮** (more options) button
4. Choose action:
   - Reset Password
   - Suspend
   - Ban User

### Create Pricing Plan

1. Go to **Billing** page
2. Click **Plans** tab
3. Click **"Create Plan"** button
4. Fill in plan details
5. Save

### Configure Email

1. Go to **System Config** page
2. Click **Email** tab
3. Enter SMTP details:
   - Host, Port
   - Username, Password
   - Sender Email
4. Click **"Test Email"** to verify
5. Save

### View Revenue Metrics

1. Go to **Analytics** page
2. View charts:
   - User Growth (30 days)
   - Revenue Trend (6 months)
   - Plan Distribution
3. Filter by date range
4. Export reports

### Track Audit Logs

1. Go to **Security** page
2. Click **"Audit Logs"** tab
3. View all admin actions
4. Click **"Export Logs"** to download
5. Filter by date, admin, or action

---

## Understanding the Dashboard

### System Health Section

| Metric                 | Meaning                                    |
| ---------------------- | ------------------------------------------ |
| **Uptime %**           | System availability (99%+ is good)         |
| **Response Time**      | Average API response time (lower = better) |
| **Error Rate**         | Percentage of failed requests              |
| **Active Connections** | Current users on platform                  |

### Key Metrics Cards

| Card              | What It Shows                       |
| ----------------- | ----------------------------------- |
| **Total Tenants** | Number of businesses using platform |
| **Total Users**   | Sum of all users across all tenants |
| **MRR**           | Monthly Recurring Revenue           |
| **Transactions**  | Successful payments in last 30 days |

### Charts Explained

**User Growth Trend**

- Shows how many users you've added over 6 months
- Upward trend = healthy growth
- Flat line = growth plateau (investigate why)

**Revenue Trend**

- Shows income growth month-over-month
- Correlates with user growth
- Use to forecast future revenue

**Plan Distribution**

- Shows how many customers on each plan
- Helps identify which plans are popular
- Use for pricing strategy

---

## Common Tasks Workflow

### Creating a New Business Account

**Timeline: 5 minutes**

1. Go to `/admin/tenants`
2. Click "Register Tenant"
3. Enter business details
4. Select pricing plan
5. Click "Register"
6. Business admin receives welcome email
7. They can now sign in and invite users

### Handling Billing Issues

**Timeline: 10 minutes**

1. Go to `/admin/billing`
2. Click "Payments" tab
3. Find the billing record
4. If payment failed:
   - Click "Record Payment" to manually add it
   - Or contact customer to update payment method
5. Mark as resolved

### Investigating User Issues

**Timeline: 15 minutes**

1. Go to `/admin/users`
2. Search for the user
3. View their details:
   - Last login time
   - Account status
   - 2FA status
4. If account locked:
   - Click reset password
   - Send them link via email
5. Check audit logs if suspicious activity

### Responding to Support Ticket

**Timeline: 20 minutes**

1. Go to `/admin/support`
2. Find ticket in "All Tickets" tab
3. Click "View Details"
4. Read customer's message
5. Type your response in message box
6. Click "Send Response"
7. Update ticket status
8. Resolve when done

---

## Permissions & Access

### Admin Roles

| Role            | Can Do                                           |
| --------------- | ------------------------------------------------ |
| **Super Admin** | Everything (all permissions)                     |
| **Admin**       | Dashboard, Tenants, Users, Billing, Support, API |
| **Moderator**   | Dashboard, Users, Support                        |

### How to Change User Role

1. Go to `/admin/users`
2. Find user
3. Click more options (⋮)
4. Select "Change Role"
5. Choose new role
6. Save

---

## Tips & Best Practices

### ✅ Do's

- ✓ Review audit logs regularly
- ✓ Keep backup schedules updated
- ✓ Monitor system health metrics
- ✓ Test email/SMS before using in production
- ✓ Create API keys with limited permissions
- ✓ Set feature flags gradually (don't rollout 100% immediately)

### ❌ Don'ts

- ✗ Don't share API keys in slack/email
- ✗ Don't delete data without backup
- ✗ Don't enable features without testing
- ✗ Don't ignore security alerts
- ✗ Don't modify audit logs
- ✗ Don't use same password for multiple admins

---

## Troubleshooting

### Can't Access Admin Panel

**Problem**: Getting 404 error at `/admin`
**Solution**:

1. Verify you're signed in as admin
2. Check console for errors
3. Refresh page
4. Check AdminRoute component is imported in App.jsx

### Dashboard Loading Slowly

**Problem**: Charts taking >2 seconds to load
**Solution**:

1. Check network requests in DevTools
2. Verify API endpoints are responding
3. Check database performance
4. Look for slow queries in logs

### Features Not Appearing

**Problem**: Can't see certain admin features
**Solution**:

1. Check feature flags in System Config
2. Verify your admin role has permission
3. Check browser cache (Ctrl+Shift+R to hard refresh)
4. Check console for JavaScript errors

### Email/SMS Not Working

**Problem**: Test email/SMS fails
**Solution**:

1. Verify credentials in System Config
2. Check SMTP/API settings
3. Test with a simple message first
4. Check provider account balance/status
5. Review error logs

---

## Keyboard Shortcuts

| Key            | Action                           |
| -------------- | -------------------------------- |
| `Ctrl/Cmd + /` | Search                           |
| `Ctrl/Cmd + K` | Command palette (if implemented) |
| `Esc`          | Close dialogs                    |
| `Enter`        | Submit forms                     |

---

## Getting Help

### Documentation

- **Feature Overview**: See `SUPER_ADMIN_PLAN.md`
- **Implementation Details**: See `SUPER_ADMIN_IMPLEMENTATION.md`
- **Architecture**: See `SUPER_ADMIN_PLAN.md` (Backend Architecture section)

### Debugging

1. Check browser console for errors (F12)
2. Review network requests (DevTools → Network tab)
3. Check React DevTools for component state
4. Review server logs for API errors

### Support

For issues or questions:

1. Check the documentation files
2. Review the component code comments
3. Check your browser's console for errors
4. Verify environment variables are set

---

## Next Steps

### After Setup

1. **Configure Email**: Set up SMTP in System Config
2. **Create Admin Users**: Add team members as admins
3. **Set Feature Flags**: Enable features you want to rollout
4. **Review Security**: Check audit logs and backups
5. **Monitor Dashboard**: Set up metrics alerts

### Production Deployment

1. Implement all backend API endpoints
2. Set up database and migration scripts
3. Configure production environment variables
4. Run security audit
5. Deploy with CI/CD pipeline

---

## Version Info

- **Admin Panel Version**: 1.0.0
- **Last Updated**: July 2024
- **Supported Browsers**: Chrome, Firefox, Safari, Edge (latest versions)

---

## Feedback

Found a bug or have a suggestion?

- Check the issue tracker
- Review existing documentation
- Create detailed bug report with screenshots

Happy administrating! 🎉
