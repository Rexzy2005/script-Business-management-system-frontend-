export const PLANS = {
  STANDARD: {
    id: "standard",
    name: "Standard",
    description: "Full features, advanced inventory, analytics and exports",
    monthlyNaira: 200,
    yearlyNaira: 2000,
  },
};

// Limits & capability helpers
export function getPlanForUser(user) {
  return PLANS.STANDARD;
}

export function isPremium(user) {
  return true;
}

export function inventoryLimit(user) {
  return Infinity;
}

export function canAccessStats(user) {
  return true;
}

export function formatCurrencyNaira(value) {
  return `₦${Number(value || 0).toLocaleString()}`;
}

export function formatCurrencyUSD(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}
