export const PLANS = {
  PREMIUM: {
    id: "premium",
    name: "Premium",
    description: "Full features, advanced inventory, analytics and exports",
    monthlyNaira: 200,
    yearlyNaira: 2000,
    features: {
      maxInvoices: -1, // Unlimited
      maxClients: -1, // Unlimited
      maxInventoryItems: -1, // Unlimited
      advancedAnalytics: true,
      multiUser: true,
      prioritySupport: true,
      dataExport: true,
      customBranding: false,
    },
  },
};

// Plan types
export const PLAN_TYPES = {
  MONTHLY: "monthly",
  YEARLY: "yearly",
};

// Get plan amount based on type
export function getPlanAmount(planType) {
  if (planType === PLAN_TYPES.YEARLY) {
    return PLANS.PREMIUM.yearlyNaira;
  }
  return PLANS.PREMIUM.monthlyNaira;
}

// Get plan name based on type
export function getPlanName(planType) {
  return planType === PLAN_TYPES.YEARLY ? "Yearly Premium" : "Monthly Premium";
}

// Limits & capability helpers
export function getPlanForUser(user) {
  // Check if user has active subscription
  if (user?.subscription?.status === "active") {
    return {
      ...PLANS.PREMIUM,
      planType: user.subscription.planType,
      amount: user.subscription.amount,
      endDate: user.subscription.endDate,
    };
  }
  
  // Fallback to premium plan
  return PLANS.PREMIUM;
}

export function isPremium(user) {
  if (!user) return false;
  
  // Check subscription status
  if (user.subscription) {
    return user.subscription.status === "active" && 
           new Date(user.subscription.endDate) > new Date();
  }
  
  // Check legacy plan status
  if (user.plan) {
    return user.plan.status === "active" && 
           user.plan.type === "premium";
  }
  
  return false;
}

export function hasActiveSubscription(user) {
  if (!user) return false;
  
  if (user.subscription) {
    const endDate = new Date(user.subscription.endDate);
    return user.subscription.status === "active" && endDate > new Date();
  }
  
  return false;
}

export function getSubscriptionDaysRemaining(user) {
  if (!user?.subscription) return 0;
  
  const endDate = new Date(user.subscription.endDate);
  const now = new Date();
  const diffTime = endDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
}

export function inventoryLimit(user) {
  if (!isPremium(user)) return 50; // Free tier limit
  return PLANS.PREMIUM.features.maxInventoryItems;
}

export function canAccessStats(user) {
  return isPremium(user);
}

export function canExportData(user) {
  return isPremium(user) && PLANS.PREMIUM.features.dataExport;
}

export function formatCurrencyNaira(value) {
  return `₦${Number(value || 0).toLocaleString()}`;
}

export function formatCurrencyUSD(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

// Calculate savings for yearly plan
export function getYearlySavings() {
  const monthlyTotal = PLANS.PREMIUM.monthlyNaira * 12;
  const yearlyAmount = PLANS.PREMIUM.yearlyNaira;
  const savings = monthlyTotal - yearlyAmount;
  const savingsPercent = Math.round((savings / monthlyTotal) * 100);
  
  return {
    amount: savings,
    percent: savingsPercent,
  };
}
