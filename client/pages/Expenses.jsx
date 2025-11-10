import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { getExpenses, addExpense, deleteExpense } from "@/lib/data";
import { toast } from "sonner";

const EXPENSE_CATEGORIES = [
  { id: "utilities", label: "Utilities", icon: "⚡" },
  { id: "rent", label: "Rent", icon: "🏢" },
  { id: "supplies", label: "Supplies", icon: "📦" },
  { id: "equipment", label: "Equipment", icon: "🔧" },
  { id: "transportation", label: "Transportation", icon: "🚗" },
  { id: "advertising", label: "Advertising", icon: "📢" },
  { id: "salary", label: "Salary", icon: "💼" },
  { id: "maintenance", label: "Maintenance", icon: "🔨" },
  { id: "other", label: "Other", icon: "📝" },
];

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "supplies",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    const loadExpenses = async () => {
      const expensesData = await getExpenses();
      setExpenses(expensesData);
    };
    loadExpenses();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description.trim() || !formData.amount) {
      toast.error("Please fill in all fields");
      return;
    }

    const newExpense = addExpense({
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
    });

    setExpenses([newExpense, ...expenses]);
    setFormData({
      description: "",
      amount: "",
      category: "supplies",
      date: new Date().toISOString().split("T")[0],
    });
    setShowForm(false);
    toast.success("Expense added successfully");
  };

  const handleDelete = (id) => {
    deleteExpense(id);
    setExpenses(expenses.filter((e) => e.id !== id));
    toast.success("Expense deleted");
  };

  const calculateMonthlyTotal = (month) => {
    return expenses
      .filter((e) => e.date.startsWith(month))
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyTotal = calculateMonthlyTotal(currentMonth);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const expensesByCategory = EXPENSE_CATEGORIES.map((cat) => ({
    ...cat,
    total: expenses
      .filter((e) => e.category === cat.id)
      .reduce((sum, e) => sum + e.amount, 0),
  })).filter((cat) => cat.total > 0);

  const getCategoryLabel = (catId) => {
    return EXPENSE_CATEGORIES.find((c) => c.id === catId)?.label || catId;
  };

  const getCategoryIcon = (catId) => {
    return EXPENSE_CATEGORIES.find((c) => c.id === catId)?.icon || "📝";
  };

  const formatCurrency = (value) => {
    return `₦${value.toLocaleString()}`;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">Expenses</h1>
            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
              Track and manage your business expenses
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            size="sm"
            className="w-full md:w-auto text-xs md:text-sm"
          >
            {showForm ? "Cancel" : "Add Expense"}
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="text-xs md:text-sm text-muted-foreground">
              This Month
            </div>
            <div className="text-xl md:text-2xl font-bold mt-2">
              {formatCurrency(monthlyTotal)}
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              {expenses.filter((e) => e.date.startsWith(currentMonth)).length}{" "}
              expenses
            </div>
          </div>

          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="text-xs md:text-sm text-muted-foreground">
              Total Expenses
            </div>
            <div className="text-xl md:text-2xl font-bold mt-2">
              {formatCurrency(totalExpenses)}
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              {expenses.length} expenses recorded
            </div>
          </div>

          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="text-xs md:text-sm text-muted-foreground">
              Average per Expense
            </div>
            <div className="text-xl md:text-2xl font-bold mt-2">
              {formatCurrency(
                expenses.length > 0 ? totalExpenses / expenses.length : 0,
              )}
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              All time average
            </div>
          </div>
        </div>

        {/* Add Expense Modal */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>New Expense</DialogTitle>
              <DialogDescription>
                Add a new expense to track your costs.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="e.g., Monthly electricity bill"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs md:text-sm"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" size="sm" className="text-xs md:text-sm">
                  Save Expense
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Expenses by Category */}
        {expensesByCategory.length > 0 && (
          <div className="mb-8">
            <h3 className="font-semibold text-sm md:text-base mb-4">
              Expenses by Category
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {expensesByCategory.map((cat) => (
                <div
                  key={cat.id}
                  className="p-4 bg-card border border-border rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl">{cat.icon}</div>
                      <div className="mt-2">
                        <div className="font-semibold text-sm">{cat.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {expenses.filter((e) => e.category === cat.id).length}{" "}
                          transactions
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        {formatCurrency(cat.total)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {((cat.total / totalExpenses) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expenses List */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {expenses.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-2xl mb-2">📊</div>
              <p className="text-sm text-muted-foreground">
                No expenses recorded yet. Add your first expense to get started.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border bg-accent/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold">
                        Category
                      </th>
                      <th className="px-4 py-3 text-right text-xs md:text-sm font-semibold">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-center text-xs md:text-sm font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {expenses.map((expense) => (
                      <tr
                        key={expense.id}
                        className="hover:bg-accent/50 transition-colors"
                      >
                        <td className="px-4 py-3 text-xs md:text-sm">
                          {formatDate(expense.date)}
                        </td>
                        <td className="px-4 py-3 text-xs md:text-sm">
                          {expense.description}
                        </td>
                        <td className="px-4 py-3 text-xs md:text-sm">
                          <span className="inline-flex items-center gap-2">
                            {getCategoryIcon(expense.category)}{" "}
                            {getCategoryLabel(expense.category)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs md:text-sm text-right font-semibold">
                          {formatCurrency(expense.amount)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleDelete(expense.id)}
                            className="text-xs md:text-sm px-2 py-1 rounded text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
