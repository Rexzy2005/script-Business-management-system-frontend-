import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import {
  getSales,
  getInventory,
  addSale,
  updateInventoryQty,
} from "@/lib/data";
import { getUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { emit, on } from "@/lib/eventBus";

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [items, setItems] = useState([]);
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [form, setForm] = useState({
    sku: "",
    qty: 1,
    amount: 0,
    customer: "",
  });

  useEffect(() => {
    const loadData = async () => {
      const inventoryData = await getInventory();
      const salesData = await getSales();
      setItems(inventoryData);
      setSales(salesData);
      if (inventoryData.length > 0) {
        setForm((f) => ({ ...f, sku: inventoryData[0].sku }));
      }
    };
    loadData();

    // Subscribe to sale-added event to refresh sales list if a sale is added from Inventory or another page
    const unsubscribe = on("sale-added", async () => {
      const updatedSales = await getSales();
      const updatedItems = await getInventory();
      setSales(updatedSales);
      setItems(updatedItems);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Auto-calculate amount when sku or qty changes
  useEffect(() => {
    const item = items.find((i) => i.sku === form.sku);
    if (!item) return;
    const qty = Number(form.qty) || 0;
    const pricePerPiece = Number(
      item.pricePerPiece ?? item.unitPrice ?? item.retailPrice ?? 0,
    );
    const bulkPrice = Number(item.bulkPrice ?? item.wholesalePrice ?? 0);
    // prefer pricePerPiece when available
    const unit = pricePerPiece > 0 ? pricePerPiece : bulkPrice;
    const computed = qty * (unit || 0);
    setForm((f) => ({ ...f, amount: computed }));
  }, [form.sku, form.qty, items]);

  const openSaleForm = () => {
    setForm({ sku: items[0]?.sku || "", qty: 1, amount: 0, customer: "" });
    setShowSaleForm(true);
  };

  const submitSaleForm = async (e) => {
    e.preventDefault();
    const item = items.find((i) => i.sku === form.sku);
    if (!item) return toast.error("Item not found");
    if (!form.qty || form.qty <= 0)
      return toast.error("Enter a valid quantity");
    if (form.qty > item.qty) return toast.error("Not enough stock");

    const user = getUser();
    const record = await addSale({
      itemSku: item.sku,
      itemName: item.name,
      qty: form.qty,
      amount: form.amount,
      customer: form.customer || undefined,
      createdBy: user || null,
    });
    await updateInventoryQty(item.sku, -form.qty);
    const updatedSales = await getSales();
    const updatedItems = await getInventory();
    setSales(updatedSales);
    setItems(updatedItems);
    setShowSaleForm(false);
    toast.success(`Sale recorded: ${record.id}`);
    // Emit event so other pages (Dashboard, Inventory, Analytics) refresh their data
    emit("sale-added", record);
  };

  const formatCurrency = (n) => {
    if (!n && n !== 0) return "₦0";
    const num = Number(n) || 0;
    return `₦${Math.round(num).toLocaleString()}`;
  };

  const formatDate = (d) => {
    try {
      if (!d) return "";
      const dt = new Date(d);
      if (isNaN(dt.getTime())) return String(d);
      return dt.toLocaleString();
    } catch (e) {
      return String(d);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">Sales</h1>
            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
              Record and review sales. Creating a sale will update inventory
              counts.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full md:w-auto">
            <Button
              size="sm"
              onClick={openSaleForm}
              className="w-full md:w-auto text-xs md:text-sm"
            >
              New sale
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard?.writeText(JSON.stringify(sales));
                toast.success("Sales copied (JSON)");
              }}
              className="w-full md:w-auto text-xs md:text-sm"
            >
              Export
            </Button>
          </div>
        </div>

        <div className="mt-6 bg-card border border-border rounded-lg overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead>
              <tr className="text-muted-foreground text-left border-b border-border">
                <th className="px-3 md:px-4 py-3">ID</th>
                <th className="px-3 md:px-4 py-3">Item</th>
                <th className="px-3 md:px-4 py-3">Qty</th>
                <th className="px-3 md:px-4 py-3">Amount</th>
                <th className="px-3 md:px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s, idx) => {
                // support new Sale model (items array) and legacy single-item sales
                const firstItem =
                  Array.isArray(s.items) && s.items.length > 0
                    ? s.items[0]
                    : null;
                const displayId = s._id || s.id || s.transactionId || "";
                const itemName = firstItem?.name || s.itemName || s.name || "";
                const qty = firstItem?.qty ?? s.qty ?? 0;
                const amount =
                  s.total ??
                  s.subtotal ??
                  s.amount ??
                  (firstItem ? firstItem.lineTotal : 0);
                const date = s.createdAt || s.date || s.created || null;
                const rowNumber = idx + 1;

                return (
                  <tr
                    key={displayId || `sale-${rowNumber}`}
                    className="border-t border-border hover:bg-accent/50"
                  >
                    <td className="px-3 md:px-4 py-3">{rowNumber}</td>
                    <td className="px-3 md:px-4 py-3">{itemName}</td>
                    <td className="px-3 md:px-4 py-3">{qty}</td>
                    <td className="px-3 md:px-4 py-3">
                      {formatCurrency(amount)}
                    </td>
                    <td className="px-3 md:px-4 py-3">{formatDate(date)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showSaleForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
          <form
            onSubmit={submitSaleForm}
            className="bg-card border border-border rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold">Record sale</h3>

            <label className="block mt-3">
              <div className="text-xs md:text-sm font-medium mb-2">Item</div>
              <select
                value={form.sku}
                onChange={(e) =>
                  setForm((s) => ({ ...s, sku: e.target.value }))
                }
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
                value={form.qty}
                onChange={(e) =>
                  setForm((s) => ({ ...s, qty: Number(e.target.value) }))
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
                value={form.amount}
                onChange={(e) =>
                  setForm((s) => ({ ...s, amount: Number(e.target.value) }))
                }
                className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>

            <label className="block mt-3">
              <div className="text-xs md:text-sm font-medium mb-2">
                Customer (optional)
              </div>
              <input
                value={form.customer}
                onChange={(e) =>
                  setForm((s) => ({ ...s, customer: e.target.value }))
                }
                className="w-full rounded-md border border-border px-3 py-2 bg-background text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>

            <div className="mt-4 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowSaleForm(false)}
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
    </Layout>
  );
}
