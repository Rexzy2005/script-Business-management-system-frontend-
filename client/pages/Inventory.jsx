import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  addInventoryItem,
  getInventory,
  updateInventoryQty,
  addSale,
} from "@/lib/data";
import { getUser } from "@/lib/auth";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";
import { startStockMonitor, stopStockMonitor } from "@/lib/stockMonitor";
import {
  exportInventory,
  getStatistics,
  getTopSelling,
} from "@/lib/apiInventory";
import { inventoryLimit, canAccessStats } from "@/lib/plans";
import { emit, on } from "@/lib/eventBus";
import { getCurrentSubscription } from "@/lib/apiSubscriptions";

export default function Inventory() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [topSelling, setTopSelling] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState({
    addItem: false,
    submitSale: false,
    bulkAdd: false,
    export: false,
    remove: {},
    addStock: {},
  });
  const [newItem, setNewItem] = useState({
    name: "",
    totalProducts: "",
    piecesPerProduct: "",
    bulkPrice: "",
    pricePerPiece: "",
    saleType: "",
  });
  const [showSale, setShowSale] = useState(false);
  const [saleForm, setSaleForm] = useState({
    sku: "",
    name: "",
    qty: 1,
    amount: 0,
    customer: "",
    saleType: "",
  });
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [bulkQty, setBulkQty] = useState(1);
  const [bulkSku, setBulkSku] = useState("");

  useEffect(() => {
    let mounted = true;
    
    // Stagger API calls to avoid rate limiting
    const loadInventory = async () => {
      try {
        const items = await getInventory();
        if (mounted) setItems(items);
      } catch (e) {
        console.error("Failed to load inventory:", e);
      }
    };
    
    // Load inventory first (most important)
    loadInventory();

    // Fetch subscription info to check premium status (only once on mount)
    // Cache subscription to avoid repeated API calls
    const loadSubscription = async () => {
      // Delay subscription fetch to avoid simultaneous calls
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!mounted) return;
      
      try {
        // Check if subscription is already cached in localStorage
        const cachedSub = localStorage.getItem("script_subscription_cache");
        const cacheTime = localStorage.getItem("script_subscription_cache_time");
        const now = Date.now();
        
        // Use cached subscription if less than 5 minutes old
        if (cachedSub && cacheTime && (now - Number(cacheTime)) < 5 * 60 * 1000) {
          try {
            const parsed = JSON.parse(cachedSub);
            if (mounted) {
              setSubscription(parsed);
              // Load stats if premium (with delay)
              const user = getUser();
              const userWithSubscription = { ...user, subscription: parsed };
              const statsAllowed = canAccessStats(userWithSubscription);
              if (statsAllowed) {
                // Delay stats loading to avoid rate limits
                setTimeout(() => {
                  if (mounted) loadStats();
                }, 1000);
              }
            }
            return;
          } catch (e) {
            // Cache invalid, fetch fresh
          }
        }
        
        // Fetch fresh subscription (with delay)
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (!mounted) return;
        
        const subData = await getCurrentSubscription();
        if (subData.success && subData.subscription) {
          // Cache the subscription
          localStorage.setItem("script_subscription_cache", JSON.stringify(subData.subscription));
          localStorage.setItem("script_subscription_cache_time", String(now));
          
          if (mounted) {
            setSubscription(subData.subscription);
            
            // After subscription is loaded, check if user can access stats
            const user = getUser();
            const userWithSubscription = { ...user, subscription: subData.subscription };
            const statsAllowed = canAccessStats(userWithSubscription);
            if (statsAllowed) {
              // Delay stats loading to avoid rate limits
              setTimeout(() => {
                if (mounted) loadStats();
              }, 1500);
            }
          }
        }
      } catch (e) {
        // Subscription fetch is optional
        console.log("Could not fetch subscription:", e);
      }
    };
    
    const loadStats = async () => {
      if (!mounted) return;
      try {
        const [s, top] = await Promise.all([
          getStatistics(),
          getTopSelling(),
        ]);
        if (mounted) {
          setStats(s);
          setTopSelling(top);
        }
      } catch (e) {
        // Silently fail stats - not critical
        console.warn(
          `Failed to load inventory stats/top-selling: ${e?.message || e}`,
        );
      }
    };
    
    loadSubscription();

    // Start background stock monitor with delay (don't run immediately)
    // Delay initial run by 5 seconds to avoid rate limits on page load
    const stockMonitorTimeout = setTimeout(() => {
      if (mounted) {
        startStockMonitor({ intervalMs: 1000 * 60 * 60 * 12, skipInitialRun: true });
      }
    }, 5000);

    // Subscribe to sale-added event to refresh inventory when sales are added from Sales page
    const unsubscribe = on("sale-added", async () => {
      try {
        const items = await getInventory();
        if (mounted) setItems(items);
      } catch (e) {
        console.error("Failed to refresh inventory:", e);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(stockMonitorTimeout);
      stopStockMonitor();
      unsubscribe();
    };
  }, []);

  const refresh = async () => {
    const items = await getInventory();
    setItems(items);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (loading.addItem) return;
    
    setLoading((prev) => ({ ...prev, addItem: true }));
    
    try {
      const user = getUser();
      // Merge subscription with user object for premium check
      const userWithSubscription = subscription 
        ? { ...user, subscription } 
        : user;
      const limit = inventoryLimit(userWithSubscription);
      if (!newItem.name || !newItem.totalProducts || !newItem.saleType) {
        toast.error("Please fill all required fields");
        return;
      }

      if (limit !== -1 && items.length >= limit) {
        toast.error(
          `Inventory limit reached for your plan. Upgrade to Premium for unlimited inventory.`,
        );
        return;
      }

      if (newItem.saleType === "pieces" && !newItem.piecesPerProduct) {
        toast.error("Please specify pieces per product");
        return;
      }
      if (newItem.saleType === "pieces" && !newItem.pricePerPiece) {
        toast.error("Please specify price per piece");
        return;
      }
      if (
        (newItem.saleType === "bulk" || newItem.saleType === "both") &&
        !newItem.bulkPrice
      ) {
        toast.error("Please specify bulk price");
        return;
      }

      const totalQty =
        Number(newItem.totalProducts) * (Number(newItem.piecesPerProduct) || 1);

      await addInventoryItem({
        name: newItem.name,
        totalProducts: Number(newItem.totalProducts),
        piecesPerProduct: Number(newItem.piecesPerProduct) || 1,
        bulkPrice: Number(newItem.bulkPrice) || 0,
        pricePerPiece: Number(newItem.pricePerPiece) || 0,
        qty: totalQty,
        saleType: newItem.saleType,
        value: `₦${(totalQty * (Number(newItem.pricePerPiece) || Number(newItem.bulkPrice) / (Number(newItem.piecesPerProduct) || 1))).toLocaleString()}`,
      });
      
      // Reset form
      setNewItem({
        name: "",
        totalProducts: "",
        piecesPerProduct: "",
        bulkPrice: "",
        pricePerPiece: "",
        saleType: "",
      });
      setShowNew(false);
      await refresh();
      toast.success("Product added to inventory");
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error(error?.message || "Failed to add product");
    } finally {
      setLoading((prev) => ({ ...prev, addItem: false }));
    }
  };

  const determineSaleType = (item) => {
    if (!item) return "";
    // Prefer explicit saleType if present
    if (item.saleType) return item.saleType;
    const hasBulk =
      (item.bulkPrice || item.bulkPrice === 0) && item.bulkPrice !== "";
    const hasPieces =
      (item.pricePerPiece || item.pricePerPiece === 0) &&
      (item.piecesPerProduct || item.piecesPerProduct === 0);
    if (hasBulk && hasPieces) return "both";
    if (hasPieces) return "pieces";
    return hasBulk ? "bulk" : "bulk";
  };

  const openSaleForItem = (item) => {
    setSaleForm({
      sku: item.sku,
      name: item.name,
      qty: 1,
      amount: 0,
      customer: "",
      saleType: determineSaleType(item),
    });
    setShowSale(true);
  };

  // Auto-calculate sale amount when saleForm.sku, saleForm.qty, or saleForm.saleType changes
  // Debounced to prevent excessive calculations
  useEffect(() => {
    if (!saleForm.sku || !saleForm.qty) return;
    
    const timeoutId = setTimeout(() => {
      const item = items.find((i) => i.sku === saleForm.sku);
      if (!item) return;
      const qty = Number(saleForm.qty) || 0;
      const pricePerPiece = Number(
        item.pricePerPiece ?? item.unitPrice ?? item.retailPrice ?? 0,
      );
      const bulkPrice = Number(item.bulkPrice ?? item.wholesalePrice ?? 0);
      
      // Use selected sale type, or determine from item
      const saleType = saleForm.saleType || determineSaleType(item);
      
      let unit = 0;
      if (saleType === "pieces" && pricePerPiece > 0) {
        unit = pricePerPiece;
      } else if (saleType === "bulk" && bulkPrice > 0) {
        unit = bulkPrice;
      } else if (saleType === "both") {
        // If both, prefer pieces if available, otherwise bulk
        unit = pricePerPiece > 0 ? pricePerPiece : bulkPrice;
      } else {
        // Fallback: use whichever is available
        unit = pricePerPiece > 0 ? pricePerPiece : bulkPrice;
      }
      
      const computed = qty * (unit || 0);
      setSaleForm((s) => ({ ...s, amount: computed }));
    }, 300); // 300ms debounce
    
    return () => clearTimeout(timeoutId);
  }, [saleForm.sku, saleForm.qty, saleForm.saleType, items]);

  const handleSubmitSale = async (e) => {
    e.preventDefault();
    if (loading.submitSale) return;
    
    setLoading((prev) => ({ ...prev, submitSale: true }));
    
    try {
      const item = items.find((i) => i.sku === saleForm.sku);
      if (!item) {
        toast.error("Item not found");
        return;
      }
      if (!saleForm.qty || saleForm.qty <= 0) {
        toast.error("Enter a valid quantity");
        return;
      }
      if (saleForm.qty > item.qty) {
        toast.error("Not enough stock");
        return;
      }
      if (!saleForm.saleType) {
        toast.error("Please select a sale type");
        return;
      }

      const user = getUser();
      // Use the selected sale type from the form
      const record = await addSale({
        itemSku: saleForm.sku,
        itemName: saleForm.name,
        qty: saleForm.qty,
        amount: saleForm.amount,
        customer: saleForm.customer || undefined,
        saleType: saleForm.saleType,
        createdBy: user || null,
      });

      await updateInventoryQty(saleForm.sku, -saleForm.qty);
      await refresh();
      
      // Reset form
      setSaleForm({
        sku: "",
        name: "",
        qty: 1,
        amount: 0,
        customer: "",
        saleType: "",
      });
      setShowSale(false);
      toast.success(`Sale recorded: ${record.id}`);
      // Emit event so other pages (Dashboard, Sales, Analytics) refresh their data
      emit("sale-added", record);
    } catch (error) {
      console.error("Error submitting sale:", error);
      toast.error(error?.message || "Failed to record sale");
    } finally {
      setLoading((prev) => ({ ...prev, submitSale: false }));
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">{t("Inventory")}</h1>
            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
              {t("Track stock levels and manage products")}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full md:w-auto">
            <Button
              size="sm"
              onClick={() => {
                const user = getUser();
                // Use cached subscription instead of fetching
                const userWithSubscription = subscription 
                  ? { ...user, subscription } 
                  : user;
                const limit = inventoryLimit(userWithSubscription);
                if (limit !== -1 && items.length >= limit) {
                  return toast.error(
                    t("Inventory limit reached for your plan. Upgrade to Premium to add more products"),
                  );
                }
                setShowNew(true);
              }}
              className="w-full md:w-auto text-xs md:text-sm"
            >
              {t("New product")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={loading.export}
              onClick={async () => {
                if (loading.export) return;
                setLoading((prev) => ({ ...prev, export: true }));
                
                try {
                  const user = getUser();
                  // Merge subscription with user object for premium check
                  const userWithSubscription = subscription 
                    ? { ...user, subscription } 
                    : user;
                  if (!canAccessStats(userWithSubscription)) {
                    toast.error(
                      t("Export and detailed statistics are available on Premium only. Upgrade to access"),
                    );
                    return;
                  }
                  const csv = await exportInventory();
                  const blob = new Blob([csv], { type: "text/csv" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `inventory-${new Date().toISOString().slice(0, 10)}.csv`;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  URL.revokeObjectURL(url);
                  toast.success("Inventory CSV downloaded");
                } catch (e) {
                  console.warn(
                    `Failed to export inventory: ${e?.message || e}`,
                  );
                  toast.error("Failed to export inventory");
                } finally {
                  setLoading((prev) => ({ ...prev, export: false }));
                }
              }}
              className="w-full md:w-auto text-xs md:text-sm"
            >
              {loading.export ? "Exporting..." : "Export CSV"}
            </Button>
          </div>
        </div>

        {stats && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-card border border-border rounded-lg">
              <div className="text-xs text-muted-foreground">
                Total products
              </div>
              <div className="font-semibold text-lg">
                {stats.overview?.totalProducts ?? 0}
              </div>
            </div>
            <div className="p-4 bg-card border border-border rounded-lg">
              <div className="text-xs text-muted-foreground">
                Total quantity
              </div>
              <div className="font-semibold text-lg">
                {stats.overview?.totalQuantity ?? 0}
              </div>
            </div>
            <div className="p-4 bg-card border border-border rounded-lg">
              <div className="text-xs text-muted-foreground">Total value</div>
              <div className="font-semibold text-lg">
                ₦{(stats.overview?.totalValue ?? 0).toLocaleString()}
              </div>
            </div>
            <div className="p-4 bg-card border border-border rounded-lg">
              <div className="text-xs text-muted-foreground">Low / Out</div>
              <div className="font-semibold text-lg">
                {stats.overview?.lowStockCount ?? 0} /{" "}
                {stats.overview?.outOfStockCount ?? 0}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => (
            <div
              key={it.sku}
              className="p-4 bg-card border border-border rounded-lg"
            >
              <div className="text-xs text-muted-foreground">{it.sku}</div>
              <div className="flex items-center gap-2">
                <div className="font-semibold text-sm md:text-base mt-1">
                  {it.name}
                </div>
                {it.isOutOfStock ? (
                  <span className="text-[10px] px-2 py-1 rounded bg-red-100 text-red-800 font-medium">
                    Out of stock
                  </span>
                ) : it.isLowStock ? (
                  <span className="text-[10px] px-2 py-1 rounded bg-yellow-100 text-yellow-800 font-medium">
                    Low stock
                  </span>
                ) : null}
              </div>
              <div className="text-xs md:text-sm mt-2">
                Qty: <span className="font-semibold">{it.qty.toLocaleString()}</span>
              </div>
              <div className="text-xs md:text-sm">
                Value: <span className="font-semibold">{it.value}</span>
              </div>
              {it.bulkPrice && (
                <div className="text-xs text-muted-foreground mt-1">
                  Bulk: ₦{Number(it.bulkPrice).toLocaleString()}
                </div>
              )}
              {it.pricePerPiece && (
                <div className="text-xs text-muted-foreground">
                  Per Piece: ₦{Number(it.pricePerPiece).toLocaleString()}
                </div>
              )}

              <div className="mt-4 flex flex-col gap-2">
                <Button
                  size="xs"
                  disabled={loading.addStock[it.sku]}
                  onClick={() => {
                    setBulkSku(it.sku);
                    setBulkQty(1);
                    setShowBulkAdd(true);
                  }}
                  className="text-xs w-full"
                >
                  + Add stock
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  disabled={loading.remove[it.sku]}
                  onClick={async () => {
                    if (loading.remove[it.sku]) return;
                    if (confirm("Remove 1 unit from stock?")) {
                      setLoading((prev) => ({ ...prev, remove: { ...prev.remove, [it.sku]: true } }));
                      try {
                        await updateInventoryQty(it.sku, -1);
                        await refresh();
                        toast.success("Removed 1 unit");
                      } catch (error) {
                        console.error("Error removing unit:", error);
                        toast.error("Failed to remove unit");
                      } finally {
                        setLoading((prev) => ({ ...prev, remove: { ...prev.remove, [it.sku]: false } }));
                      }
                    }
                  }}
                  className="text-xs w-full"
                >
                  {loading.remove[it.sku] ? "Removing..." : "- Remove"}
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => openSaleForItem(it)}
                  className="text-xs w-full"
                >
                  Record sale
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {topSelling && topSelling.length > 0 && (
        <div className="mt-6 max-w-6xl mx-auto px-4">
          <h3 className="text-lg font-semibold mb-2">Top selling</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topSelling.map((p) => (
              <div
                key={p._id || p.id}
                className="p-4 bg-card border border-border rounded-lg"
              >
                <div className="font-semibold">{p.name}</div>
                <div className="text-xs text-muted-foreground">
                  Sold: {p.analytics?.totalSold ?? 0} • Revenue: ₦
                  {(p.analytics?.totalRevenue ?? 0).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showNew && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
          <form
            onSubmit={handleAddItem}
            className="bg-card border border-border rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-lg font-semibold mb-2">Add New Product</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Enter product details below. All fields marked with * are required.
            </p>
            
            <label className="block mt-4">
              <div className="text-xs md:text-sm font-medium mb-2">
                Product Name <span className="text-red-500">*</span>
              </div>
              <input
                value={newItem.name}
                onChange={(e) =>
                  setNewItem((s) => ({ ...s, name: e.target.value }))
                }
                className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. Rice, Beans, Sugar"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter the name of the product you want to add to inventory
              </p>
            </label>

            <label className="block mt-4">
              <div className="text-xs md:text-sm font-medium mb-2">
                Sale Type <span className="text-red-500">*</span>
              </div>
              <select
                value={newItem.saleType}
                onChange={(e) =>
                  setNewItem((s) => ({ ...s, saleType: e.target.value }))
                }
                className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select how you sell this product</option>
                <option value="bulk">Bulk Sale Only</option>
                <option value="pieces">Pieces Sale Only</option>
                <option value="both">Both (Bulk & Pieces)</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                <strong>Bulk:</strong> Sell entire products (e.g., 1 bag of rice) | 
                <strong> Pieces:</strong> Sell individual pieces (e.g., 1 cup of rice) | 
                <strong> Both:</strong> Allow both selling methods
              </p>
            </label>

            <label className="block mt-4">
              <div className="text-xs md:text-sm font-medium mb-2">
                Total Number of Products <span className="text-red-500">*</span>
              </div>
              <input
                type="text"
                min="1"
                value={newItem.totalProducts ? Number(newItem.totalProducts).toLocaleString() : ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/,/g, '');
                  if (value === '' || /^\d+$/.test(value)) {
                    setNewItem((s) => ({ ...s, totalProducts: value }));
                  }
                }}
                className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                <strong>Example:</strong> If you have 50 bags of rice in stock, enter <strong>50</strong>
              </p>
            </label>
            
            {/* Calculated Summary */}
            {newItem.totalProducts && newItem.saleType && (
              <div className="mt-4 p-3 bg-accent/50 rounded-lg border border-border">
                <div className="text-xs font-medium mb-2">Summary</div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  {newItem.saleType === "pieces" || newItem.saleType === "both" ? (
                    <>
                      {newItem.piecesPerProduct && (
                        <div>
                          Total Pieces: <span className="font-semibold text-foreground">
                            {(Number(newItem.totalProducts) * Number(newItem.piecesPerProduct || 1)).toLocaleString()}
                          </span>
                        </div>
                      )}
                      {newItem.pricePerPiece && (
                        <div>
                          Total Value (Pieces): <span className="font-semibold text-foreground">
                            ₦{((Number(newItem.totalProducts) * Number(newItem.piecesPerProduct || 1)) * Number(newItem.pricePerPiece)).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </>
                  ) : null}
                  {newItem.saleType === "bulk" || newItem.saleType === "both" ? (
                    <>
                      {newItem.bulkPrice && (
                        <div>
                          Total Value (Bulk): <span className="font-semibold text-foreground">
                            ₦{(Number(newItem.totalProducts) * Number(newItem.bulkPrice)).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </>
                  ) : null}
                </div>
              </div>
            )}

            {(newItem.saleType === "pieces" || newItem.saleType === "both") && (
              <>
                <label className="block mt-4">
                  <div className="text-xs md:text-sm font-medium mb-2">
                    Pieces Per Product <span className="text-red-500">*</span>
                  </div>
                  <input
                    type="text"
                    min="1"
                    value={newItem.piecesPerProduct ? Number(newItem.piecesPerProduct).toLocaleString() : ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/,/g, '');
                      if (value === '' || /^\d+$/.test(value)) {
                        setNewItem((s) => ({
                          ...s,
                          piecesPerProduct: value,
                        }));
                      }
                    }}
                    className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0"
                    required={newItem.saleType === "pieces" || newItem.saleType === "both"}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    <strong>Example:</strong> If 1 bag contains 12 cups, enter <strong>12</strong>
                  </p>
                </label>

                <label className="block mt-4">
                  <div className="text-xs md:text-sm font-medium mb-2">
                    Price Per Piece (₦) <span className="text-red-500">*</span>
                  </div>
                  <input
                    type="text"
                    value={newItem.pricePerPiece ? Number(newItem.pricePerPiece).toLocaleString() : ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/,/g, '');
                      if (value === '' || /^\d*\.?\d*$/.test(value)) {
                        setNewItem((s) => ({
                          ...s,
                          pricePerPiece: value,
                        }));
                      }
                    }}
                    className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0"
                    required={newItem.saleType === "pieces" || newItem.saleType === "both"}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    <strong>Example:</strong> If you sell 1 cup for ₦500, enter <strong>500</strong>
                  </p>
                </label>
              </>
            )}

            {(newItem.saleType === "bulk" || newItem.saleType === "both") && (
              <label className="block mt-4">
                <div className="text-xs md:text-sm font-medium mb-2">
                  Bulk Price Per Product (₦) <span className="text-red-500">*</span>
                </div>
                <input
                  type="text"
                  value={newItem.bulkPrice ? Number(newItem.bulkPrice).toLocaleString() : ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/,/g, '');
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      setNewItem((s) => ({ ...s, bulkPrice: value }));
                    }
                  }}
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0"
                  required={newItem.saleType === "bulk" || newItem.saleType === "both"}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  <strong>Example:</strong> If you sell 1 bag for ₦5,000, enter <strong>5000</strong>
                </p>
              </label>
            )}

            <div className="mt-4 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowNew(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={loading.addItem}>
                {loading.addItem ? "Adding..." : "Add product"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {showSale && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
          <form
            onSubmit={handleSubmitSale}
            className="bg-card border border-border rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-lg font-semibold mb-2">Record Sale</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Record a sale transaction for a product in your inventory
            </p>

            <label className="block mt-4">
              <div className="text-xs md:text-sm font-medium mb-2">
                Select Product <span className="text-red-500">*</span>
              </div>
              <select
                value={saleForm.sku}
                onChange={(e) => {
                  const sku = e.target.value;
                  const item = items.find((i) => i.sku === sku);
                  setSaleForm((s) => ({
                    ...s,
                    sku,
                    name: item?.name || "",
                    qty: 1,
                    saleType: determineSaleType(item),
                  }));
                }}
                className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Choose a product...</option>
                {items.map((i) => (
                  <option key={i.sku} value={i.sku}>
                    {i.sku} — {i.name} (Available: {i.qty.toLocaleString()})
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Select the product you sold from the dropdown
              </p>
            </label>

            {saleForm.sku && (() => {
              const selectedItem = items.find((i) => i.sku === saleForm.sku);
              const canSellBulk = selectedItem && (selectedItem.saleType === "bulk" || selectedItem.saleType === "both");
              const canSellPieces = selectedItem && (selectedItem.saleType === "pieces" || selectedItem.saleType === "both");
              
              return (
                <label className="block mt-4">
                  <div className="text-xs md:text-sm font-medium mb-2">
                    Sale Type <span className="text-red-500">*</span>
                  </div>
                  <select
                    value={saleForm.saleType}
                    onChange={(e) => {
                      setSaleForm((s) => ({ ...s, saleType: e.target.value }));
                    }}
                    className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    {canSellBulk && canSellPieces ? (
                      <>
                        <option value="bulk">Bulk Sale</option>
                        <option value="pieces">Pieces Sale</option>
                      </>
                    ) : canSellBulk ? (
                      <option value="bulk">Bulk Sale</option>
                    ) : canSellPieces ? (
                      <option value="pieces">Pieces Sale</option>
                    ) : (
                      <option value="bulk">Bulk Sale</option>
                    )}
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {canSellBulk && canSellPieces 
                      ? "Choose whether you sold in bulk or by pieces"
                      : canSellBulk 
                        ? "This product is sold in bulk only"
                        : "This product is sold by pieces only"}
                  </p>
                </label>
              );
            })()}

            <label className="block mt-4">
              <div className="text-xs md:text-sm font-medium mb-2">
                Quantity Sold <span className="text-red-500">*</span>
              </div>
              <input
                type="text"
                min={1}
                value={saleForm.qty ? Number(saleForm.qty).toLocaleString() : ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/,/g, '');
                  if (value === '' || /^\d+$/.test(value)) {
                    setSaleForm((s) => ({ ...s, qty: value === '' ? 1 : Number(value) }));
                  }
                }}
                className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                {saleForm.saleType === "pieces" 
                  ? "Enter the number of pieces sold (e.g., 5 pieces)"
                  : "Enter the number of products sold (e.g., 2 bags)"}
              </p>
            </label>

            <label className="block mt-4">
              <div className="text-xs md:text-sm font-medium mb-2">
                Total Amount (₦) <span className="text-red-500">*</span>
              </div>
              <input
                type="text"
                value={saleForm.amount ? Number(saleForm.amount).toLocaleString() : ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/,/g, '');
                  if (value === '' || /^\d*\.?\d*$/.test(value)) {
                    setSaleForm((s) => ({ ...s, amount: Number(value) }));
                  }
                }}
                className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Total amount received for this sale. Amount is auto-calculated based on quantity and price.
              </p>
            </label>

            <label className="block mt-4">
              <div className="text-xs md:text-sm font-medium mb-2">
                Customer Name (Optional)
              </div>
              <input
                value={saleForm.customer}
                onChange={(e) =>
                  setSaleForm((s) => ({ ...s, customer: e.target.value }))
                }
                className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. John Doe"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Optional: Enter the customer's name for record keeping
              </p>
            </label>

            {/* Sale Summary */}
            {saleForm.sku && saleForm.qty > 0 && saleForm.amount > 0 && (() => {
              const selectedItem = items.find((i) => i.sku === saleForm.sku);
              return (
                <div className="mt-4 p-3 bg-accent/50 rounded-lg border border-border">
                  <div className="text-xs font-medium mb-2">Sale Summary</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Product:</span>
                      <span className="font-semibold">{saleForm.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sale Type:</span>
                      <span className="font-semibold capitalize">{saleForm.saleType || "bulk"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="font-semibold">{saleForm.qty.toLocaleString()}</span>
                    </div>
                    {selectedItem && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Unit Price:</span>
                        <span className="font-semibold">
                          ₦{saleForm.saleType === "pieces" && selectedItem.pricePerPiece
                            ? Number(selectedItem.pricePerPiece).toLocaleString()
                            : selectedItem.bulkPrice
                            ? Number(selectedItem.bulkPrice).toLocaleString()
                            : "0"}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-border">
                      <span className="text-muted-foreground font-medium">Total Amount:</span>
                      <span className="font-bold text-primary">₦{saleForm.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="mt-4 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowSale(false)}
                disabled={loading.submitSale}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={loading.submitSale}>
                {loading.submitSale ? "Recording..." : "Record sale"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {showBulkAdd && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (loading.bulkAdd) return;
              
              setLoading((prev) => ({ ...prev, bulkAdd: true }));
              
              try {
                const q = Number(bulkQty);
                if (!q || q <= 0) {
                  toast.error("Enter a valid quantity");
                  return;
                }
                await updateInventoryQty(bulkSku, q);
                await refresh();
                setBulkQty(1);
                setShowBulkAdd(false);
                toast.success(`Added ${q.toLocaleString()} units`);
              } catch (error) {
                console.error("Error adding stock:", error);
                toast.error(error?.message || "Failed to add stock");
              } finally {
                setLoading((prev) => ({ ...prev, bulkAdd: false }));
              }
            }}
            className="bg-card border border-border rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold mb-2">Add Stock</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Add more units to an existing product in your inventory
            </p>
            
            <div className="mb-4 p-3 bg-accent/50 rounded-lg">
              <div className="text-xs text-muted-foreground">Product SKU</div>
              <div className="text-sm font-semibold">{bulkSku}</div>
            </div>

            <label className="block mt-4">
              <div className="text-xs md:text-sm font-medium mb-2">
                Quantity to Add <span className="text-red-500">*</span>
              </div>
              <input
                type="text"
                value={bulkQty ? Number(bulkQty).toLocaleString() : "1"}
                onChange={(e) => {
                  const value = e.target.value.replace(/,/g, '');
                  if (value === '' || /^\d+$/.test(value)) {
                    setBulkQty(value === '' ? 1 : Number(value));
                  }
                }}
                className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter the number of units you want to add to this product's stock
              </p>
            </label>

            <div className="mt-4 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setBulkQty(1);
                  setShowBulkAdd(false);
                }}
                disabled={loading.bulkAdd}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={loading.bulkAdd}>
                {loading.bulkAdd ? "Adding..." : "Add stock"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
}
