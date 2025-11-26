import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { getInventory, getSales, getClients, getExpenses } from "@/lib/data";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { on } from "@/lib/eventBus";
import { getUser } from "@/lib/auth";
import { useTranslation } from "@/hooks/useTranslation";
import { UIText } from "@/lib/uiText";

function parseCurrencyValue(val) {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const digits = String(val).replace(/[^0-9.-]+/g, "");
  const n = Number(digits);
  return Number.isFinite(n) ? n : 0;
}

function formatCurrency(n) {
  if (!Number.isFinite(n)) return "₦0";
  return `₦${Math.round(n).toLocaleString()}`;
}

export default function ProductDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [inventory, setInventory] = useState([]);
  const [sales, setSales] = useState([]);
  const [clients, setClients] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const translationSource = React.useMemo(
    () => ({
      welcomeBack: "Welcome back!",
      welcomeSummary: "Here's a quick look at your product business.",
      salesThisMonth: "Sales (This Month)",
      expensesThisMonth: "Expenses (This Month)",
      profitThisMonth: "Profit (This Month)",
      stockLevels: "Stock levels",
      salesCountLabel: "sales",
      expensesCountLabel: "expenses",
      lowLabel: "Low",
      inStockLabel: "In stock",
      totalItems: "Total items",
      recentActivity: UIText.dashboard.recentActivity,
      quickActions: UIText.dashboard.quickActions,
      noRecentActivity: "No recent activity",
      saleTag: "Sale",
      expenseTag: "Expense",
      unknownItem: "Unknown item",
      expenseFallback: "Expense",
      salesMinusExpenses: "Sales − Expenses",
      addProduct: "Add New Product",
      seeExpenses: "See Expenses",
      addSale: "Add New Sale",
    }),
    [],
  );
  const { translatedText: dashboardText } = useTranslation(translationSource);
  const getText = React.useCallback(
    (key, fallback) => (dashboardText && dashboardText[key] ? dashboardText[key] : fallback),
    [dashboardText],
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Only fetch data if user is authenticated
        const user = getUser();
        if (!user) {
          if (!mounted) return;
          setInventory([]);
          setSales([]);
          setClients([]);
          setExpenses([]);
          return;
        }

        const inv = await getInventory();
        const s = await getSales();
        const c = await getClients();
        const e = await getExpenses();
        if (!mounted) return;
        
        // Only set data if we got valid arrays (not null/undefined)
        setInventory(Array.isArray(inv) ? inv : []);
        setSales(Array.isArray(s) ? s : []);
        setClients(Array.isArray(c) ? c : []);
        setExpenses(Array.isArray(e) ? e : []);
      } catch (e) {
        console.warn(`Failed to load dashboard data: ${e?.message || e}`);
        if (mounted) {
          // Set empty arrays on error to prevent undefined states
          setInventory([]);
          setSales([]);
          setClients([]);
          setExpenses([]);
        }
      }
    })();

    // Subscribe to sale-added and expense-added events to refresh data
    const unsubscribeSale = on("sale-added", async () => {
      try {
        const user = getUser();
        if (!user) return;
        
        const inv = await getInventory();
        const s = await getSales();
        const c = await getClients();
        const e = await getExpenses();
        if (!mounted) return;
        setInventory(Array.isArray(inv) ? inv : []);
        setSales(Array.isArray(s) ? s : []);
        setClients(Array.isArray(c) ? c : []);
        setExpenses(Array.isArray(e) ? e : []);
      } catch (e) {
        console.warn(`Failed to refresh dashboard data: ${e?.message || e}`);
      }
    });

    const unsubscribeExpense = on("expense-added", async () => {
      try {
        const user = getUser();
        if (!user) return;
        
        const inv = await getInventory();
        const s = await getSales();
        const c = await getClients();
        const e = await getExpenses();
        if (!mounted) return;
        setInventory(Array.isArray(inv) ? inv : []);
        setSales(Array.isArray(s) ? s : []);
        setClients(Array.isArray(c) ? c : []);
        setExpenses(Array.isArray(e) ? e : []);
      } catch (e) {
        console.warn(`Failed to refresh dashboard data: ${e?.message || e}`);
      }
    });

    return () => {
      mounted = false;
      unsubscribeSale();
      unsubscribeExpense();
    };
  }, []);

  const now = new Date();
  const monthAgo = new Date();
  monthAgo.setDate(now.getDate() - 30);

  const monthlySales = sales
    .filter((s) => {
      if (!s.createdAt) return true; // include if no timestamp
      const d = new Date(s.createdAt);
      return d >= monthAgo;
    })
    .reduce((sum, s) => {
      // Try multiple fields for amount: amount, total, subtotal
      const amt = s.amount || s.total || s.subtotal || 0;
      return sum + (parseCurrencyValue(amt) || 0);
    }, 0);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const monthlyExpenses = (expenses || [])
    .filter((e) => e?.date && String(e.date).startsWith(currentMonth))
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const monthlyProfit = monthlySales - monthlyExpenses;

  const lowCount = (inventory || []).filter((i) => Number(i.qty) <= 5).length;
  const inStockCount = (inventory || []).filter(
    (i) => Number(i.qty) > 5,
  ).length;

  const totalCustomers = clients.length;

  const stockValue = inventory.reduce((sum, item) => {
    // Try to compute from explicit pricePerPiece or bulkPrice
    const qty = Number(item.qty) || 0;
    let unitPrice = 0;
    if (item.pricePerPiece) unitPrice = parseCurrencyValue(item.pricePerPiece);
    else if (item.bulkPrice && item.piecesPerProduct)
      unitPrice =
        parseCurrencyValue(item.bulkPrice) /
        (Number(item.piecesPerProduct) || 1);
    else if (item.value) {
      // item.value may be total value like "₦75,000"
      const parsed = parseCurrencyValue(item.value);
      if (parsed > 0) return sum + parsed; // treat as total
    }

    return sum + qty * (unitPrice || 0);
  }, 0);

  const recentSales = [...sales]
    .filter((s) => s)
    .sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const db = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return db - da;
    })
    .slice(0, 5);

  // Combine sales and expenses for recent activity
  const allActivities = [
    ...sales.map((s) => ({
      ...s,
      type: "sale",
      timestamp: s.createdAt ? new Date(s.createdAt) : new Date(0),
    })),
    ...expenses.map((e) => ({
      ...e,
      type: "expense",
      timestamp: e.date
        ? new Date(typeof e.date === "string" ? e.date : e.date)
        : new Date(0),
    })),
  ]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold">{getText("welcomeBack", "Welcome back!")}</h1>
          <p className="mt-1 text-xs md:text-sm text-muted-foreground">
            {getText("welcomeSummary", "Here's a quick look at your product business.")}

          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="text-xs md:text-sm text-muted-foreground">
              {getText("salesThisMonth", "Sales (This Month)")}

            </div>
            <div className="text-xl md:text-2xl font-bold mt-2">
              {formatCurrency(monthlySales)}
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              {
                sales.filter(
                  (s) => !s.createdAt || new Date(s.createdAt) >= monthAgo,
                ).length
              }{" "}
              {getText("salesCountLabel", "sales")}

            </div>
          </div>

          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="text-xs md:text-sm text-muted-foreground">
              {getText("expensesThisMonth", "Expenses (This Month)")}

            </div>
            <div className="text-xl md:text-2xl font-bold mt-2">
              {formatCurrency(monthlyExpenses)}
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              {
                expenses.filter(
                  (e) => e?.date && String(e.date).startsWith(currentMonth),
                ).length
              }{" "}
              {getText("expensesCountLabel", "expenses")}

            </div>
          </div>

          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="text-xs md:text-sm text-muted-foreground">
            </div>
            <div className="text-sm md:text-base font-semibold mt-2 flex gap-4">
              <span className="text-red-600">{t("Low")}: {lowCount}</span>
              <span className="text-green-600">{t("InStock")}: {inStockCount}</span>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Total items: {inventory.length}
              {getText("stockLevels", "Stock levels")}
            </div>
            <div className="text-sm md:text-base font-semibold mt-2 flex gap-4">
              <span className="text-red-600">{getText("lowLabel", "Low")}: {lowCount}</span>
              <span className="text-green-600">{getText("inStockLabel", "In stock")}: {inStockCount}</span>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              {getText("totalItems", "Total items")}: {inventory.length}

            </div>
          </div>

          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="text-xs md:text-sm text-muted-foreground">
              {getText("profitThisMonth", "Profit (This Month)")}

            </div>
            <div className="text-xl md:text-2xl font-bold mt-2">
              {formatCurrency(monthlyProfit)}
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              {getText("salesMinusExpenses", "Sales − Expenses")}

            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="p-4 md:p-6 bg-card border border-border rounded-lg">
            <h3 className="font-semibold text-sm md:text-base">
              {getText("recentActivity", UIText.dashboard.recentActivity)}

            </h3>
            <ul className="mt-4 space-y-3 text-xs md:text-sm text-muted-foreground">
              {allActivities.length > 0 ? (
                allActivities.map((activity, idx) => {
                  if (activity.type === "sale") {
                    const saleAmount =
                      activity.amount ||
                      activity.total ||
                      activity.subtotal ||
                      0;
                    const firstItem =
                      Array.isArray(activity.items) && activity.items.length > 0
                        ? activity.items[0]
                        : null;
                    const itemName =
                      firstItem?.name ||
                      activity.itemName ||
                      activity.name ||
                      getText("unknownItem", "Unknown item");

                    return (
                      <li
                        key={`${activity.type}-${activity.id || idx}`}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded mr-2">
                            {getText("saleTag", "Sale")}

                          </span>
                          {itemName} —{" "}
                          {formatCurrency(parseCurrencyValue(saleAmount))}
                        </div>
                      </li>
                    );
                  } else {
                    // Expense
                    const expenseAmount = activity.amount || 0;
                    return (
                      <li
                        key={`${activity.type}-${activity.id || idx}`}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded mr-2">
                            {getText("expenseTag", "Expense")}
                          </span>
                          {activity.description || getText("expenseFallback", "Expense")} —{" "}

                          {formatCurrency(parseCurrencyValue(expenseAmount))}
                        </div>
                      </li>
                    );
                  }
                })
              ) : (
                <>
                  <li>{getText("noRecentActivity", "No recent activity")}</li>

                </>
              )}
            </ul>
          </div>

          <div className="p-4 md:p-6 bg-card border border-border rounded-lg">
            <h3 className="font-semibold text-sm md:text-base">
              {getText("quickActions", UIText.dashboard.quickActions)}

            </h3>
            <div className="mt-4 flex flex-col gap-2 md:gap-3">
              <Button
                size="sm"
                onClick={() => navigate("/inventory")}
                className="w-full text-xs md:text-sm"
              >
                {getText("addProduct", "Add New Product")}

              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/expenses")}
                className="w-full text-xs md:text-sm"
              >
                {getText("seeExpenses", "See Expenses")}

              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/sales")}
                className="w-full text-xs md:text-sm"
              >
                {getText("addSale", "Add New Sale")}

              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
