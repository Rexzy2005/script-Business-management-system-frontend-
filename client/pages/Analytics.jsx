import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useTranslation } from "@/hooks/useTranslation";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getStatistics, getTopSelling } from "@/lib/apiInventory";
import { getUser } from "@/lib/auth";
import { on } from "@/lib/eventBus";

const COLORS = ["#2D7C35", "#F97316", "#06B6D4"];

export default function Analytics() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [topSelling, setTopSelling] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const s = await getStatistics();
        setStats(s || {});
        const top = await getTopSelling();
        setTopSelling(Array.isArray(top) ? top : []);
        // dev debug: print raw payloads
        try {
          if (
            typeof window !== "undefined" &&
            process?.env?.NODE_ENV === "development"
          ) {
            console.debug("[analytics] raw stats:", s);
            console.debug("[analytics] raw topSelling:", top);
          }
        } catch (e) {
          /* ignore */
        }
      } catch (e) {
        console.warn(`Failed to load inventory analytics: ${e?.message || e}`);
      } finally {
        setLoading(false);
      }
    })();

    // Subscribe to sale-added event to refresh analytics when sales are added
    const unsubscribe = on("sale-added", async () => {
      try {
        const s = await getStatistics();
        setStats(s || {});
        const top = await getTopSelling();
        setTopSelling(Array.isArray(top) ? top : []);
      } catch (e) {
        console.warn(`Failed to refresh analytics: ${e?.message || e}`);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  const monthlyData = Array.isArray(stats?.monthly) ? stats.monthly : [];

  const totalSales =
    Number(stats?.overview?.totalRevenue) ||
    (monthlyData.length > 0
      ? monthlyData.reduce((acc, m) => acc + (Number(m.sales) || 0), 0)
      : 0);

  const avgMonthlySales = Math.round(totalSales / (monthlyData.length || 12));

  const highestMonth =
    monthlyData.length > 0
      ? monthlyData.reduce((prev, current) =>
          (Number(current.sales) || 0) > (Number(prev.sales) || 0)
            ? current
            : prev,
        )
      : { month: "", sales: 0, target: 0 };

  const lowestMonth =
    monthlyData.length > 0
      ? monthlyData.reduce((prev, current) =>
          (Number(current.sales) || 0) < (Number(prev.sales) || 0)
            ? current
            : prev,
        )
      : { month: "", sales: 0, target: 0 };

  const productSalesData =
    Array.isArray(topSelling) && topSelling.length > 0
      ? topSelling.map((p) => ({
          name: p.name || "Unnamed",
          value: Number(p.analytics?.totalRevenue) || 0,
          items: Number(p.analytics?.totalSold) || 0,
        }))
      : [];

  const totalProductSales = productSalesData.reduce(
    (acc, p) => acc + p.value,
    0,
  );

  // Normalize monthly data into chart-friendly shape
  const monthlyChartData = (Array.isArray(monthlyData) ? monthlyData : []).map(
    (m) => {
      // m.month might be '2025-06' or a numeric month index. Normalize to readable label.
      let monthLabel = m.month || m.label || "";
      if (!monthLabel && typeof m.month === "number") {
        const date = new Date();
        date.setMonth(m.month - 1);
        monthLabel = date.toLocaleString(undefined, { month: "short" });
      }
      return {
        month: String(monthLabel),
        sales: Number(m.sales) || 0,
        target: Number(m.target) || 0,
      };
    },
  );

  const formatCurrencyShort = (value) => {
    const v = Number(value) || 0;
    if (v === 0) return "₦0";
    if (Math.abs(v) >= 1_000_000) return `₦${(v / 1_000_000).toFixed(1)}M`;
    if (Math.abs(v) >= 1_000) return `₦${(v / 1_000).toFixed(0)}k`;
    return `₦${v.toLocaleString()}`;
  };

  const formatCurrencyFull = (value) => {
    const v = Number(value) || 0;
    return `₦${v.toLocaleString()}`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto p-8 text-center text-muted-foreground">
          {t("Loading analytics")}...
        </div>
      </Layout>
    );
  }

  // always render the analytics shell; charts will show empty data if no stats available
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold">{t("Analytics")}</h1>
          <p className="mt-1 text-xs md:text-sm text-muted-foreground">
            {t("Comprehensive business metrics and sales performance analysis")}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="text-xs md:text-sm text-muted-foreground">
              {t("Total Annual Sales")}
            </div>
            <div className="text-xl md:text-2xl font-bold mt-2">
              {formatCurrencyFull(totalSales)}
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              {t("Across 12 months")}
            </div>
          </div>

          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="text-xs md:text-sm text-muted-foreground">
              {t("Average Monthly Sales")}
            </div>
            <div className="text-xl md:text-2xl font-bold mt-2">
              {formatCurrencyFull(avgMonthlySales)}
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              {t("Year to date average")}
            </div>
          </div>

          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="text-xs md:text-sm text-muted-foreground">
              {t("Best Performing Month")}
            </div>
            <div className="text-xl md:text-2xl font-bold mt-2">
              {formatCurrencyFull(highestMonth.sales)}
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              {highestMonth.month} -{" "}
              {highestMonth.sales > highestMonth.target
                ? "✓ Above target"
                : "✗ Below target"}
            </div>
          </div>

          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="text-xs md:text-sm text-muted-foreground">
              {t("Lowest Performing Month")}
            </div>
            <div className="text-xl md:text-2xl font-bold mt-2">
              {formatCurrencyFull(lowestMonth.sales)}
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              {lowestMonth.month}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Monthly Sales Chart */}
          <div className="lg:col-span-2 p-4 md:p-6 bg-card border border-border rounded-lg">
            <h3 className="font-semibold text-sm md:text-base mb-4">
              Monthly Sales Performance
            </h3>
            <div className="w-full h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyChartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                    formatter={(value) => formatCurrencyFull(value)}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#2D7C35"
                    strokeWidth={2}
                    dot={{ fill: "#2D7C35" }}
                    name="Actual Sales"
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#F97316"
                    strokeWidth={2}
                    dot={{ fill: "#F97316" }}
                    name="Target"
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sales Distribution Pie Chart */}
          <div className="p-4 md:p-6 bg-card border border-border rounded-lg">
            <h3 className="font-semibold text-sm md:text-base mb-4">
              Sales by Product
            </h3>
            <div className="w-full h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productSalesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {productSalesData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrencyFull(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Products Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart for Product Comparison */}
          <div className="p-4 md:p-6 bg-card border border-border rounded-lg">
            <h3 className="font-semibold text-sm md:text-base mb-4">
              Product Sales Comparison
            </h3>
            <div className="w-full h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productSalesData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                    formatter={(value) => formatCurrencyFull(value)}
                  />
                  <Bar dataKey="value" fill="#2D7C35" name="Total Sales" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Product Details Table */}
          <div className="p-4 md:p-6 bg-card border border-border rounded-lg">
            <h3 className="font-semibold text-sm md:text-base mb-4">
              Top Products
            </h3>
            <div className="space-y-3">
              {productSalesData.map((product) => (
                <div
                  key={product.name}
                  className="p-3 rounded-lg bg-accent/50 border border-border"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-sm">
                        {product.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {product.items.toLocaleString()} units sold
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm">
                        {formatCurrencyFull(product.value)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {totalProductSales > 0
                          ? ((product.value / totalProductSales) * 100).toFixed(
                              1,
                            )
                          : "0.0"}
                        % of total
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
