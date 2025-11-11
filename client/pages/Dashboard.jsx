import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import ProductDashboard from "@/pages/ProductDashboard";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { getStatistics } from "@/lib/apiInventory";
import { getClients } from "@/lib/data";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [stats, setStats] = useState(null);
  const [clientsCount, setClientsCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);

  // Always render ProductDashboard
  return <ProductDashboard />;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const s = await getStatistics();
        const clients = await getClients();
        if (!mounted) return;
        setStats(s || {});
        setClientsCount((clients || []).length || 0);

        // build recentActivity from stats if available
        const recent =
          s?.recentActivity && Array.isArray(s.recentActivity)
            ? s.recentActivity.slice(0, 5)
            : [];
        setRecentActivity(recent);
      } catch (e) {
        console.warn(`Failed to load dashboard metrics: ${e?.message || e}`);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const monthlyRevenue = stats?.overview?.totalRevenue || 0;
  const totalCustomers = clientsCount;
  const stockValue = stats?.overview?.totalValue || 0;
  const lowStockCount = stats?.overview?.lowStockCount || 0;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold">
            Welcome CEO{user?.businessName ? ` - ${user.businessName}` : ""}
          </h1>
          <p className="mt-1 text-xs md:text-sm text-muted-foreground">
            Here's a quick look at your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="text-xs md:text-sm text-muted-foreground">
              Monthly revenue
            </div>
            <div className="text-xl md:text-2xl font-bold mt-2">
              {monthlyRevenue ? `₦${monthlyRevenue.toLocaleString()}` : "₦0"}
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              {stats?.overview?.changeLabel || ""}
            </div>
          </div>

          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="text-xs md:text-sm text-muted-foreground">
              Total customers
            </div>
            <div className="text-xl md:text-2xl font-bold mt-2">
              {totalCustomers}
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              {stats?.overview?.newCustomersText || ""}
            </div>
          </div>

          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="text-xs md:text-sm text-muted-foreground">
              Stock value
            </div>
            <div className="text-xl md:text-2xl font-bold mt-2">
              {stockValue ? `₦${stockValue.toLocaleString()}` : "₦0"}
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Low stock alerts: {lowStockCount}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="p-4 md:p-6 bg-card border border-border rounded-lg">
            <h3 className="font-semibold text-sm md:text-base">
              Recent activity
            </h3>
            <ul className="mt-4 space-y-3 text-xs md:text-sm text-muted-foreground">
              {recentActivity.length > 0 ? (
                recentActivity.map((a, idx) => <li key={idx}>{a}</li>)
              ) : (
                <li>No recent activity</li>
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
                onClick={() => {}}
                className="w-full text-xs md:text-sm"
              >
                View reports
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/inventory")}
                className="w-full text-xs md:text-sm"
              >
                Create payment link
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/customers")}
                className="w-full text-xs md:text-sm"
              >
                Import customers
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
