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
import { toast } from "sonner";
import { startStockMonitor, stopStockMonitor } from "@/lib/stockMonitor";
import {
  exportInventory,
  getStatistics,
  getTopSelling,
} from "@/lib/apiInventory";
import { inventoryLimit, canAccessStats } from "@/lib/plans";
import { emit, on } from "@/lib/eventBus";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [topSelling, setTopSelling] = useState([]);
  const [showNew, setShowNew] = useState(false);
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
    const loadInventory = async () => {
      const items = await getInventory();
      setItems(items);
    };
    loadInventory();

    // fetch stats and top selling only for premium users
    (async () => {
      try {
        const user = getUser();
        const statsAllowed = canAccessStats(user);
        if (statsAllowed) {
          const s = await getStatistics();
          setStats(s);
          const top = await getTopSelling();
          setTopSelling(top);
        }
      } catch (e) {
        console.warn(
          `Failed to load inventory stats/top-selling: ${e?.message || e}`,
        );
      }
    })();

    // start background stock monitor (runs twice daily by default)
    startStockMonitor({ intervalMs: 1000 * 60 * 60 * 12 });

    // Subscribe to sale-added event to refresh inventory when sales are added from Sales page
    const unsubscribe = on("sale-added", async () => {
      const items = await getInventory();
      setItems(items);
    });

    return () => {
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
    const user = getUser();
    const limit = inventoryLimit(user);
    if (!newItem.name || !newItem.totalProducts || !newItem.saleType)
      return toast.error("Please fill all required fields");

    if (items.length >= limit) {
      return toast.error(
        `Inventory limit reached for your plan. Upgrade to Premium for unlimited inventory.`,
      );
    }

    if (newItem.saleType === "pieces" && !newItem.piecesPerProduct)
      return toast.error("Please specify pieces per product");
    if (newItem.saleType === "pieces" && !newItem.pricePerPiece)
      return toast.error("Please specify price per piece");
    if (
      (newItem.saleType === "bulk" || newItem.saleType === "both") &&
      !newItem.bulkPrice
    )
      return toast.error("Please specify bulk price");

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

  // Auto-calculate sale amount when saleForm.sku or saleForm.qty changes
  useEffect(() => {
    const item = items.find((i) => i.sku === saleForm.sku);
    if (!item) return;
    const qty = Number(saleForm.qty) || 0;
    const pricePerPiece = Number(
      item.pricePerPiece ?? item.unitPrice ?? item.retailPrice ?? 0,
    );
    const bulkPrice = Number(item.bulkPrice ?? item.wholesalePrice ?? 0);
    const usePiece =
      item.saleType === "pieces" ||
      (item.saleType === "both" && pricePerPiece > 0) ||
      (!item.saleType && pricePerPiece > 0);
    const unit = usePiece ? pricePerPiece : bulkPrice;
    const computed = qty * (unit || 0);
    setSaleForm((s) => ({ ...s, amount: computed }));
  }, [saleForm.sku, saleForm.qty, items]);

  const handleSubmitSale = async (e) => {
    e.preventDefault();
    const item = items.find((i) => i.sku === saleForm.sku);
    if (!item) return toast.error("Item not found");
    if (!saleForm.qty || saleForm.qty <= 0)
      return toast.error("Enter a valid quantity");
    if (saleForm.qty > item.qty) return toast.error("Not enough stock");

    const user = getUser();
    const itemSaleType =
      (item && (item.saleType || determineSaleType(item))) ||
      saleForm.saleType ||
      "bulk";
    const record = await addSale({
      itemSku: saleForm.sku,
      itemName: saleForm.name,
      qty: saleForm.qty,
      amount: saleForm.amount,
      customer: saleForm.customer || undefined,
      saleType: itemSaleType,
      createdBy: user || null,
    });

    await updateInventoryQty(saleForm.sku, -saleForm.qty);
    await refresh();
    setShowSale(false);
    toast.success(`Sale recorded: ${record.id}`);
    // Emit event so other pages (Dashboard, Sales, Analytics) refresh their data
    emit("sale-added", record);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">Inventory</h1>
            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
              Track stock levels and manage products.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full md:w-auto">
            <Button
              size="sm"
              onClick={() => {
                const user = getUser();
                const limit = inventoryLimit(user);
                if (items.length >= limit) {
                  return toast.error(
                    "Inventory limit reached for your plan. Upgrade to Premium to add more products.",
                  );
                }
                setShowNew(true);
              }}
              className="w-full md:w-auto text-xs md:text-sm"
            >
              New product
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const user = getUser();
                if (!canAccessStats(user)) {
                  return toast.error(
                    "Export and detailed statistics are available on Premium only. Upgrade to access.",
                  );
                }
                try {
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
                }
              }}
              className="w-full md:w-auto text-xs md:text-sm"
            >
              Export CSV
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
              <div className="text-xs md:text-sm mt-2">Qty: {it.qty}</div>
              <div className="text-xs md:text-sm">Value: {it.value}</div>

              <div className="mt-4 flex flex-col gap-2">
                <Button
                  size="xs"
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
                  onClick={async () => {
                    if (confirm("Remove 1 unit from stock?")) {
                      await updateInventoryQty(it.sku, -1);
                      await refresh();
                      toast.success("Removed 1 unit");
                    }
                  }}
                  className="text-xs w-full"
                >
                  - Remove
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
            <h3 className="text-lg font-semibold">Add new product</h3>
            <label className="block mt-4">
              <div className="text-xs md:text-sm font-medium mb-2">
                Product name
              </div>
              <input
                value={newItem.name}
                onChange={(e) =>
                  setNewItem((s) => ({ ...s, name: e.target.value }))
                }
                className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. Rice, Beans"
              />
            </label>

            <label className="block mt-3">
              <div className="text-xs md:text-sm font-medium mb-2">
                Sale type
              </div>
              <select
                value={newItem.saleType}
                onChange={(e) =>
                  setNewItem((s) => ({ ...s, saleType: e.target.value }))
                }
                className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select sale type</option>
                <option value="bulk">Bulk Sale</option>
                <option value="pieces">Pieces Sale</option>
                <option value="both">Both (Bulk & Pieces)</option>
              </select>
            </label>

            <label className="block mt-3">
              <div className="text-xs md:text-sm font-medium mb-2">
                Total number of products
              </div>
              <input
                type="number"
                min="1"
                value={newItem.totalProducts}
                onChange={(e) =>
                  setNewItem((s) => ({ ...s, totalProducts: e.target.value }))
                }
                className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. 50 (products in stock)"
              />
              <p className="text-xs text-muted-foreground mt-1">
                How many individual products do you have?
              </p>
            </label>

            {(newItem.saleType === "pieces" || newItem.saleType === "both") && (
              <>
                <label className="block mt-3">
                  <div className="text-xs md:text-sm font-medium mb-2">
                    Pieces per product
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={newItem.piecesPerProduct}
                    onChange={(e) =>
                      setNewItem((s) => ({
                        ...s,
                        piecesPerProduct: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g. 12 (if selling by pieces)"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    How many pieces in each product?
                  </p>
                </label>

                <label className="block mt-3">
                  <div className="text-xs md:text-sm font-medium mb-2">
                    Price per piece (₦)
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newItem.pricePerPiece}
                    onChange={(e) =>
                      setNewItem((s) => ({
                        ...s,
                        pricePerPiece: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0.00"
                  />
                </label>
              </>
            )}

            {(newItem.saleType === "bulk" || newItem.saleType === "both") && (
              <label className="block mt-3">
                <div className="text-xs md:text-sm font-medium mb-2">
                  Bulk price per product (₦)
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newItem.bulkPrice}
                  onChange={(e) =>
                    setNewItem((s) => ({ ...s, bulkPrice: e.target.value }))
                  }
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0.00"
                />
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
              <Button type="submit" size="sm">
                Add product
              </Button>
            </div>
          </form>
        </div>
      )}

      {showSale && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
          <form
            onSubmit={handleSubmitSale}
            className="bg-card border border-border rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold">Record sale</h3>

            <label className="block mt-3">
              <div className="text-xs md:text-sm font-medium mb-2">Item</div>
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
              >
                {items.map((i) => (
                  <option key={i.sku} value={i.sku}>
                    {i.sku} — {i.name} (Available: {i.qty})
                  </option>
                ))}
              </select>
            </label>

            <label className="block mt-3">
              <div className="text-xs md:text-sm font-medium mb-2">
                Quantity
              </div>
              <input
                type="number"
                min={1}
                value={saleForm.qty}
                onChange={(e) =>
                  setSaleForm((s) => ({ ...s, qty: Number(e.target.value) }))
                }
                className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>

            <label className="block mt-3">
              <div className="text-xs md:text-sm font-medium mb-2">
                Amount (NGN)
              </div>
              <input
                type="number"
                min={0}
                value={saleForm.amount}
                onChange={(e) =>
                  setSaleForm((s) => ({ ...s, amount: Number(e.target.value) }))
                }
                className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>

            <label className="block mt-3">
              <div className="text-xs md:text-sm font-medium mb-2">
                Customer (optional)
              </div>
              <input
                value={saleForm.customer}
                onChange={(e) =>
                  setSaleForm((s) => ({ ...s, customer: e.target.value }))
                }
                className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>

            <div className="mt-3">
              <div className="text-xs text-muted-foreground">Type</div>
              <div className="text-sm font-medium">
                {saleForm.saleType || "bulk"}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowSale(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Record sale
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
              const q = Number(bulkQty);
              if (!q || q <= 0) return toast.error("Enter a valid quantity");
              await updateInventoryQty(bulkSku, q);
              await refresh();
              setShowBulkAdd(false);
              toast.success(`Added ${q} units`);
            }}
            className="bg-card border border-border rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold">Add stock (bulk)</h3>
            <p className="text-xs text-muted-foreground mt-1">SKU: {bulkSku}</p>

            <label className="block mt-3">
              <div className="text-xs md:text-sm font-medium mb-2">
                Quantity to add
              </div>
              <input
                type="number"
                min={1}
                value={bulkQty}
                onChange={(e) => setBulkQty(Number(e.target.value))}
                className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>

            <div className="mt-4 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowBulkAdd(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Add stock
              </Button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
}
