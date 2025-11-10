import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { getInventory, getSales, getClients, getExpenses } from "@/lib/data";
import { useNavigate } from "react-router-dom";

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
  const [inventory, setInventory] = useState([]);
  const [sales, setSales] = useState([]);
  const [clients, setClients] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const inv = await getInventory();
        const s = getSales();
        const c = getClients();
        const e = getExpenses();
        if (!mounted) return;
        setInventory(inv || []);
        setSales(s || []);
        setClients(c || []);
        setExpenses(e || []);
      } catch (e) {
        console.warn(`Failed to load dashboard data: ${e?.message || e}`);
      }
    })();
    return () => {
      mounted = false;
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
    .reduce((sum, s) => sum + (parseCurrencyValue(s.amount) || 0), 0);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const monthlyExpenses = (expenses || [])
    .filter((e) => e?.date && String(e.date).startsWith(currentMonth))
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const monthlyProfit = monthlySales - monthlyExpenses;

  const lowCount = (inventory || []).filter((i) => Number(i.qty) <= 5).length;
  const okCount = (inventory || []).filter(
    (i) => Number(i.qty) > 5 && Number(i.qty) < 50,
  ).length;
  const fullCount = (inventory || []).filter((i) => Number(i.qty) >= 50).length;

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

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold">Welcome back!</h1>
          <p className="mt-1 text-xs md:text-sm text-muted-foreground">
            Here's a quick look at your product business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="text-xs md:text-sm text-muted-foreground">
              Sales (This Month)
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
              sales
            </div>
          </div>

          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="text-xs md:text-sm text-muted-foreground">
              Expenses (This Month)
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
              expenses
            </div>
          </div>

          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="text-xs md:text-sm text-muted-foreground">
              Stock levels
            </div>
            <div className="text-sm md:text-base font-semibold mt-2">
              Low: {lowCount} · Okay: {okCount} · Full: {fullCount}
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Total items: {inventory.length}
            </div>
          </div>

          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="text-xs md:text-sm text-muted-foreground">
              Profit (This Month)
            </div>
            <div className="text-xl md:text-2xl font-bold mt-2">
              {formatCurrency(monthlyProfit)}
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Sales − Expenses
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="p-4 md:p-6 bg-card border border-border rounded-lg">
            <h3 className="font-semibold text-sm md:text-base">
              Recent activity
            </h3>
            <ul className="mt-4 space-y-3 text-xs md:text-sm text-muted-foreground">
              {recentSales.length > 0 ? (
                recentSales.map((s) => (
                  <li key={s.id || s.transactionId || Math.random()}>
                    Sale {s.id || s.transactionId || ""} —{" "}
                    {formatCurrency(parseCurrencyValue(s.amount))}
                    {s.customer ? ` — ${s.customer}` : ""}
                  </li>
                ))
              ) : (
                <>
                  <li>No recent sales</li>
                </>
              )}
            </ul>
          </div>

          <div className="p-4 md:p-6 bg-card border border-border rounded-lg">
            <h3 className="font-semibold text-sm md:text-base">
              Quick actions
            </h3>
            <div className="mt-4 flex flex-col gap-2 md:gap-3">
              <Button
                size="sm"
                onClick={() => navigate("/inventory")}
                className="w-full text-xs md:text-sm"
              >
                Add New Product
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/expenses")}
                className="w-full text-xs md:text-sm"
              >
                See Expenses
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/sales")}
                className="w-full text-xs md:text-sm"
              >
                Add New Sale
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
