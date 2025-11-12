/**
 * UI Text Constants
 * Centralized strings for all dashboard UI elements that need translation
 * This makes it easy to identify and manage translatable content
 */

export const UIText = {
  // Common/General
  common: {
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    create: "Create",
    update: "Update",
    close: "Close",
    search: "Search",
    filter: "Filter",
    export: "Export",
    import: "Import",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    warning: "Warning",
    confirm: "Confirm",
    back: "Back",
    next: "Next",
    previous: "Previous",
    settings: "Settings",
    profile: "Profile",
    logout: "Logout",
    signIn: "Sign In",
    signUp: "Sign Up",
    email: "Email",
    password: "Password",
    language: "Language",
    theme: "Theme",
    getStarted: "Get Started",
    sms: "SMS",
  },

  // Header/Navigation
  header: {
    dashboard: "Dashboard",
    features: "Features",
    pricing: "Pricing",
    solutions: "Solutions",
    inventory: "Inventory",
    analytics: "Analytics",
    expenses: "Expenses",
    sales: "Sales",
    team: "Team",
    backToDashboard: "Back to dashboard",
    selectLanguage: "Select Language",
    changeLanguage: "Change Language",
    currentLanguagePrefix: "Current:",
    changingLanguage: "Changing language...",
    languageMenuTitle: "Language options",
  },

  layout: {
    businessToolkit: "Business toolkit",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },

  // Dashboard
  dashboard: {
    title: "Dashboard",
    welcome: "Welcome to your Dashboard",
    overview: "Overview",
    recentActivity: "Recent Activity",
    quickActions: "Quick Actions",
    totalRevenue: "Total Revenue",
    totalExpenses: "Total Expenses",
    totalSales: "Total Sales",
    totalInventory: "Total Inventory",
    viewAll: "View All",
    noData: "No data available",
  },

  // Settings Page
  settings: {
    title: "Settings",
    subtitle: "Manage your business configuration and preferences",
    settingsPreferences: "Settings & Preferences",
    currency: "Currency",
    timezone: "Timezone",
    dateFormat: "Date Format",
    languagePreference: "Language Preference",
    selectLanguage: "Select your preferred language",
    notificationSettings: "Notification Settings",
    emailNotifications: "Email Notifications",
    smsNotifications: "SMS Notifications",
    lowStockNotifications: "Low Stock Notifications",
    invoiceDueNotifications: "Invoice Due Notifications",
    enableNotifications: "Enable Notifications",
    saveSettings: "Save Settings",
    resetSettings: "Reset Settings",
    settingsUpdated: "Settings updated successfully",
    failedToUpdate: "Failed to update settings",
    resetMessage: "Settings reset to last saved",
    pushNotifications: "Push notifications",
    pushNotificationsDescription: "Get notified of new bookings and messages",
    emailNotificationsDescription: "Receive email updates and daily summary",
    invoiceDueLabel: "Invoice Due",
    accountSection: "Account",
    accountDescription: "Manage your account and session.",
    saveChanges: "Save changes",
    dangerZone: "Danger zone",
    dangerZoneDescription: "These actions cannot be undone.",
    deleteAccount: "Delete account",
    deleteAccountConfirm: "Are you sure? This will delete all your data?",
    deleteAccountSuccess: "Account deletion initiated",
  },

  // Inventory
  inventory: {
    title: "Inventory",
    addItem: "Add Item",
    editItem: "Edit Item",
    deleteItem: "Delete Item",
    itemName: "Item Name",
    quantity: "Quantity",
    price: "Price",
    category: "Category",
    sku: "SKU",
    description: "Description",
    lastUpdated: "Last Updated",
    lowStock: "Low Stock",
    outOfStock: "Out of Stock",
    inStock: "In Stock",
    reorderLevel: "Reorder Level",
    supplier: "Supplier",
  },

  // Sales
  sales: {
    title: "Sales",
    addSale: "Add Sale",
    editSale: "Edit Sale",
    deleteSale: "Delete Sale",
    saleDate: "Sale Date",
    customer: "Customer",
    items: "Items",
    total: "Total",
    status: "Status",
    completed: "Completed",
    pending: "Pending",
    cancelled: "Cancelled",
    quantity: "Quantity",
    unitPrice: "Unit Price",
    discount: "Discount",
    tax: "Tax",
    subtotal: "Subtotal",
  },

  // Expenses
  expenses: {
    title: "Expenses",
    addExpense: "Add Expense",
    editExpense: "Edit Expense",
    deleteExpense: "Delete Expense",
    expenseDate: "Expense Date",
    category: "Category",
    amount: "Amount",
    description: "Description",
    paymentMethod: "Payment Method",
    vendor: "Vendor",
    receipt: "Receipt",
    status: "Status",
    approved: "Approved",
    rejected: "Rejected",
    pending: "Pending",
  },

  // Invoices
  invoices: {
    title: "Invoices",
    createInvoice: "Create Invoice",
    editInvoice: "Edit Invoice",
    deleteInvoice: "Delete Invoice",
    viewInvoice: "View Invoice",
    invoiceNumber: "Invoice Number",
    invoiceDate: "Invoice Date",
    dueDate: "Due Date",
    customer: "Customer",
    items: "Items",
    subtotal: "Subtotal",
    tax: "Tax",
    total: "Total",
    paid: "Paid",
    pending: "Pending",
    overdue: "Overdue",
    sendInvoice: "Send Invoice",
    downloadPDF: "Download PDF",
    markAsPaid: "Mark as Paid",
  },

  // Payments
  payments: {
    title: "Payments",
    processPayment: "Process Payment",
    paymentDate: "Payment Date",
    amount: "Amount",
    method: "Payment Method",
    status: "Status",
    completed: "Completed",
    failed: "Failed",
    pending: "Pending",
    reference: "Reference",
    invoice: "Invoice",
    customer: "Customer",
  },

  // Analytics/Reports
  analytics: {
    title: "Analytics",
    reports: "Reports",
    revenue: "Revenue",
    expenses: "Expenses",
    profit: "Profit",
    sales: "Sales",
    dateRange: "Date Range",
    filter: "Filter",
    export: "Export",
    chartType: "Chart Type",
    monthlyRevenue: "Monthly Revenue",
    salesTrend: "Sales Trend",
    expenseBreakdown: "Expense Breakdown",
    topProducts: "Top Products",
    topCustomers: "Top Customers",
  },

  // Clients/Customers
  clients: {
    title: "Clients",
    addClient: "Add Client",
    editClient: "Edit Client",
    deleteClient: "Delete Client",
    clientName: "Client Name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    city: "City",
    state: "State",
    country: "Country",
    zipCode: "Zip Code",
    businessName: "Business Name",
    taxId: "Tax ID",
    creditLimit: "Credit Limit",
    paymentTerms: "Payment Terms",
  },

  // Profile
  profile: {
    title: "Profile",
    editProfile: "Edit Profile",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone",
    businessName: "Business Name",
    businessAddress: "Business Address",
    businessPhone: "Business Phone",
    businessEmail: "Business Email",
    profilePicture: "Profile Picture",
    changePassword: "Change Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    updateProfile: "Update Profile",
    profileUpdated: "Profile updated successfully",
  },

  // Forms & Validation
  forms: {
    required: "This field is required",
    invalidEmail: "Invalid email address",
    passwordMismatch: "Passwords do not match",
    minLength: "Minimum length is",
    maxLength: "Maximum length is",
    invalidPhone: "Invalid phone number",
    invalidNumber: "Invalid number",
    submit: "Submit",
    reset: "Reset",
    clear: "Clear",
  },

  // Messages/Notifications
  messages: {
    confirmDelete: "Are you sure you want to delete this item?",
    deleteSuccess: "Item deleted successfully",
    deleteFailed: "Failed to delete item",
    addSuccess: "Item added successfully",
    addFailed: "Failed to add item",
    updateSuccess: "Item updated successfully",
    updateFailed: "Failed to update item",
    noResults: "No results found",
    loading: "Loading...",
    error: "An error occurred",
    tryAgain: "Try again",
  },

  // Admin Dashboard
  admin: {
    title: "Admin Dashboard",
    superAdmin: "Super Admin",
    tenantManagement: "Tenant Management",
    userManagement: "User Management",
    billingControl: "Billing Control",
    analytics: "Analytics",
    supportCenter: "Support Center",
    apiManagement: "API Management",
    systemConfig: "System Configuration",
    securityCompliance: "Security & Compliance",
    users: "Users",
    tenants: "Tenants",
    subscriptions: "Subscriptions",
    revenue: "Revenue",
    reports: "Reports",
  },

  // Pricing/Subscriptions
  pricing: {
    title: "Pricing",
    plans: "Plans",
    basic: "Basic",
    professional: "Professional",
    enterprise: "Enterprise",
    monthly: "Monthly",
    yearly: "Yearly",
    perMonth: "per month",
    perYear: "per year",
    features: "Features",
    selectPlan: "Select Plan",
    upgrade: "Upgrade",
    downgrade: "Downgrade",
    currentPlan: "Current Plan",
    upgradeNow: "Upgrade Now",
  },

  // Authentication
  auth: {
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    createAccount: "Create account",
    signInNow: "Sign in now",
    signInSuccess: "Signed in successfully",
    signOutSuccess: "Signed out successfully",
    signOutFailed: "Sign out failed",
    signUpSuccess: "Account created successfully",
    invalidCredentials: "Invalid email or password",
    emailAlreadyExists: "Email already exists",
  },

  // Table Headers & Columns
  table: {
    action: "Action",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    download: "Download",
    print: "Print",
    noDataAvailable: "No data available",
    showing: "Showing",
    of: "of",
    entries: "entries",
    search: "Search",
    sort: "Sort",
    ascending: "Ascending",
    descending: "Descending",
  },

  // Buttons
  buttons: {
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    create: "Create",
    update: "Update",
    submit: "Submit",
    reset: "Reset",
    close: "Close",
    back: "Back",
    next: "Next",
    previous: "Previous",
    export: "Export",
    import: "Import",
    print: "Print",
    download: "Download",
    upload: "Upload",
    ok: "OK",
    yes: "Yes",
    no: "No",
  },

  // Modals & Dialogs
  modals: {
    confirm: "Confirm",
    confirmAction: "Are you sure?",
    warning: "Warning",
    error: "Error",
    success: "Success",
    info: "Information",
    delete: "Delete",
    confirmDelete: "Are you sure you want to delete this?",
  },
};

// Helper function to get nested UI text
export const getUIText = (path) => {
  const keys = path.split(".");
  let value = UIText;

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = value[key];
    } else {
      console.warn(`UI text path not found: ${path}`);
      return path; // Return the path itself as fallback
    }
  }

  return value;
};

export default UIText;
