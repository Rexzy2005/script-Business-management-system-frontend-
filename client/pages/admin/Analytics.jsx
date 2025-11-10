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
  ScatterChart,
  Scatter,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, TrendingUp, Users, CreditCard } from "lucide-react";

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("6m");

  const userGrowthData = [];
  const conversionData = [];
  const retentionCohort = [];
  const churnData = [];
  const segmentationData = [];

  return (
    <AdminLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Analytics & Reports
            </h1>
            <p className="text-muted-foreground mt-1">
              Platform insights and performance metrics
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">Last Month</SelectItem>
                <SelectItem value="3m">Last 3 Months</SelectItem>
                <SelectItem value="6m">Last 6 Months</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download size={18} />
              Export
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="retention">Retention</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="segments">Segments</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8,521</div>
                  <p className="text-xs text-green-600 mt-1">
                    ↑ 28.4% vs last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">6,200</div>
                  <p className="text-xs text-green-600 mt-1">
                    ↑ 18.2% vs last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Signup Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+127/day</div>
                  <p className="text-xs text-green-600 mt-1">
                    ↑ 12.3% vs last month
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>User Growth Trend</CardTitle>
                <CardDescription>
                  Total vs active users over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Total Users"
                    />
                    <Line
                      type="monotone"
                      dataKey="activeUsers"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Active Users"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trial to Paid Conversion</CardTitle>
                <CardDescription>
                  Conversion rate trending upward
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={conversionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="trials"
                      fill="#3b82f6"
                      name="Trials"
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="converted"
                      fill="#10b981"
                      name="Converted"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Retention Tab */}
          <TabsContent value="retention" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Retention
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">68.5%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    After 6 months
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Churn Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1.3%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Monthly churn
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Churn Trend</CardTitle>
                <CardDescription>
                  Users and churn rate over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={churnData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="churn"
                      fill="#ef4444"
                      name="Churn Count"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="rate"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      name="Churn Rate %"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cohort Retention Analysis</CardTitle>
                <CardDescription>
                  Percentage of users retained by month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2">Cohort</th>
                        <th className="text-center py-2 px-2">M0</th>
                        <th className="text-center py-2 px-2">M1</th>
                        <th className="text-center py-2 px-2">M2</th>
                        <th className="text-center py-2 px-2">M3</th>
                        <th className="text-center py-2 px-2">M4</th>
                        <th className="text-center py-2 px-2">M5</th>
                      </tr>
                    </thead>
                    <tbody>
                      {retentionCohort.map((row) => (
                        <tr key={row.cohort} className="border-b">
                          <td className="py-2 px-2 font-medium">
                            {row.cohort}
                          </td>
                          {[
                            row.month0,
                            row.month1,
                            row.month2,
                            row.month3,
                            row.month4,
                            row.month5,
                          ].map((val, idx) => (
                            <td
                              key={idx}
                              className={`text-center py-2 px-2 ${
                                val === undefined
                                  ? ""
                                  : val >= 80
                                    ? "bg-green-50"
                                    : val >= 60
                                      ? "bg-yellow-50"
                                      : "bg-red-50"
                              }`}
                            >
                              {val !== undefined ? `${val}%` : "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total MRR
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$189.4K</div>
                  <p className="text-xs text-green-600 mt-1">↑ 48.2% YoY</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Customer LTV
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$4,250</div>
                  <p className="text-xs text-green-600 mt-1">
                    ↑ 18.3% vs last quarter
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    CAC Payback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8.2 months</div>
                  <p className="text-xs text-green-600 mt-1">↓ Improving</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Segments Tab */}
          <TabsContent value="segments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Segmentation</CardTitle>
                <CardDescription>Breakdown by business size</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2">Segment</th>
                        <th className="text-center py-2 px-2">Users</th>
                        <th className="text-center py-2 px-2">Revenue</th>
                        <th className="text-center py-2 px-2">Growth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {segmentationData.map((seg) => (
                        <tr key={seg.segment} className="border-b">
                          <td className="py-2 px-2 font-medium">
                            {seg.segment}
                          </td>
                          <td className="text-center py-2 px-2">
                            {seg.users.toLocaleString()}
                          </td>
                          <td className="text-center py-2 px-2 font-semibold">
                            ${(seg.revenue / 1000).toFixed(0)}K
                          </td>
                          <td className="text-center py-2 px-2 text-green-600">
                            +{seg.growth}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
