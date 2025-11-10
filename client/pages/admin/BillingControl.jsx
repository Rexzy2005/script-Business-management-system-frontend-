import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Download, TrendingUp, AlertCircle, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const BillingControl = () => {
  const [plans, setPlans] = useState([]);

  const [editingPlan, setEditingPlan] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    monthlyPrice: 0,
    annualPrice: 0,
  });
  const [deleteConfirmPlan, setDeleteConfirmPlan] = useState(null);

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setEditFormData({
      name: plan.name,
      monthlyPrice: plan.monthlyPrice,
      annualPrice: plan.annualPrice,
    });
  };

  const handleSaveEdit = () => {
    setPlans(
      plans.map((p) =>
        p.id === editingPlan.id
          ? {
              ...p,
              name: editFormData.name,
              monthlyPrice: editFormData.monthlyPrice,
              annualPrice: editFormData.annualPrice,
            }
          : p,
      ),
    );
    setEditingPlan(null);
  };

  const handleDeletePlan = (planId) => {
    setPlans(plans.filter((p) => p.id !== planId));
    setDeleteConfirmPlan(null);
  };

  const [billingRecords] = useState([]);

  const revenueData = [];

  const planDistribution = plans.map((p) => ({
    name: p.name,
    value: p.activeSubscriptions,
    color: ["#3b82f6", "#10b981", "#f59e0b"][plans.indexOf(p)],
  }));

  const totalRevenue = plans.reduce((sum, p) => sum + p.revenue, 0);
  const totalSubscriptions = plans.reduce(
    (sum, p) => sum + p.activeSubscriptions,
    0,
  );
  const overduePayments = billingRecords.filter(
    (b) => b.status === "overdue",
  ).length;

  return (
    <AdminLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Billing & Revenue Control
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage subscriptions, plans, and payment processing
          </p>
        </div>

        {/* Alerts */}
        {overduePayments > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {overduePayments} overdue payment(s) that need attention
            </AlertDescription>
          </Alert>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₦{(totalRevenue / 1000).toFixed(1)}K
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Monthly recurring
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Active Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSubscriptions}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all plans
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Overdue Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${overduePayments > 0 ? "text-red-600" : "text-green-600"}`}
              >
                {overduePayments}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Need attention
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Order Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₦{(totalRevenue / totalSubscriptions).toFixed(0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Per subscription
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="plans">Pricing Plans</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3b82f6"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Plan Distribution</CardTitle>
                  <CardDescription>Subscriptions by plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={planDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {planDistribution.map((entry) => (
                          <Cell key={`cell-${entry.name}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Subscription Growth</CardTitle>
                <CardDescription>New subscriptions per month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="subscriptions" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plans Tab */}
          <TabsContent value="plans" className="space-y-6">
            <div className="flex justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus size={18} />
                    Create Plan
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Pricing Plan</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Plan Name</label>
                      <Input placeholder="e.g., Growth" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">
                          Monthly Price
                        </label>
                        <Input type="number" placeholder="199" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Annual Price
                        </label>
                        <Input type="number" placeholder="1990" />
                      </div>
                    </div>
                    <Button className="w-full">Create Plan</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card key={plan.id}>
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-2xl font-bold">
                        ₦{plan.monthlyPrice}
                      </div>
                      <p className="text-sm text-muted-foreground">per month</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Features:</p>
                      <ul className="space-y-1">
                        {plan.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-muted-foreground"
                          >
                            • {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-4 border-t border-border space-y-2">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Active Subscriptions
                        </p>
                        <p className="font-bold">{plan.activeSubscriptions}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Monthly Revenue
                        </p>
                        <p className="font-bold">
                          ₦{(plan.revenue / 1000).toFixed(1)}K
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full">
                      <Dialog
                        open={editingPlan?.id === plan.id}
                        onOpenChange={(open) => {
                          if (!open) setEditingPlan(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleEditPlan(plan)}
                          >
                            Edit Plan
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Pricing Plan</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">
                                Plan Name
                              </label>
                              <Input
                                value={editFormData.name}
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData,
                                    name: e.target.value,
                                  })
                                }
                                placeholder="e.g., Growth"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">
                                  Monthly Price
                                </label>
                                <Input
                                  type="number"
                                  value={editFormData.monthlyPrice}
                                  onChange={(e) =>
                                    setEditFormData({
                                      ...editFormData,
                                      monthlyPrice: Number(e.target.value),
                                    })
                                  }
                                  placeholder="199"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Annual Price
                                </label>
                                <Input
                                  type="number"
                                  value={editFormData.annualPrice}
                                  onChange={(e) =>
                                    setEditFormData({
                                      ...editFormData,
                                      annualPrice: Number(e.target.value),
                                    })
                                  }
                                  placeholder="1990"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                onClick={() => setEditingPlan(null)}
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleSaveEdit}>
                                Save Changes
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Dialog
                        open={deleteConfirmPlan?.id === plan.id}
                        onOpenChange={(open) => {
                          if (!open) setDeleteConfirmPlan(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            className="flex-1"
                            onClick={() => setDeleteConfirmPlan(plan)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Plan</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete the {plan.name}{" "}
                              plan? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              onClick={() => setDeleteConfirmPlan(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeletePlan(plan.id)}
                            >
                              Delete Plan
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">Recent Payment Records</h3>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Plus size={18} />
                    Record Payment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Record Manual Payment</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Tenant</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tenant" />
                        </SelectTrigger>
                        <SelectContent>
                          {billingRecords.map((b) => (
                            <SelectItem key={b.id} value={b.tenant}>
                              {b.tenant}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Amount</label>
                      <Input type="number" placeholder="0.00" />
                    </div>
                    <Button className="w-full">Record Payment</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tenant</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Paid Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {billingRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">
                            {record.tenant}
                          </TableCell>
                          <TableCell>{record.plan}</TableCell>
                          <TableCell className="font-semibold">
                            ₦{record.amount}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                record.status === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {record.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{record.dueDate}</TableCell>
                          <TableCell>{record.paidDate || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default BillingControl;
