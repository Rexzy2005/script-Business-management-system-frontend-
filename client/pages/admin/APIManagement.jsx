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
import { Plus, Copy, Trash2, Eye, EyeOff, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const APIManagement = () => {
  const [apiKeys, setApiKeys] = useState([]);

  const [webhooks] = useState([]);

  const [usageData] = useState([]);

  const [showSecret, setShowSecret] = useState({});

  const toggleSecretVisibility = (id) => {
    setShowSecret((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDeleteKey = (id) => {
    if (confirm("Are you sure? This cannot be undone.")) {
      setApiKeys(apiKeys.filter((k) => k.id !== id));
    }
  };

  const totalRequests = usageData.reduce((sum, d) => sum + d.requests, 0);
  const totalErrors = usageData.reduce((sum, d) => sum + d.errors, 0);
  const errorRate = ((totalErrors / totalRequests) * 100).toFixed(2);

  return (
    <AdminLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">API Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage API keys, webhooks, and developer tools
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="api-keys" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="usage">Usage & Logs</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
          </TabsList>

          {/* API Keys Tab */}
          <TabsContent value="api-keys" className="space-y-6">
            <div className="flex justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus size={18} />
                    Generate API Key
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generate New API Key</DialogTitle>
                    <DialogDescription>
                      Create a new API key for programmatic access
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Key Name</label>
                      <Input placeholder="e.g., Production API" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Tenant</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tenant" />
                        </SelectTrigger>
                        <SelectContent>
                          {apiKeys.map((k) => (
                            <SelectItem key={k.id} value={k.tenant}>
                              {k.tenant}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Permissions</label>
                      <div className="space-y-2 mt-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          Read
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          Write
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" />
                          Delete
                        </label>
                      </div>
                    </div>
                    <Button className="w-full">Generate Key</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Active API Keys</CardTitle>
                <CardDescription>
                  Manage API keys for developers and integrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Tenant</TableHead>
                        <TableHead>Key</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead>Requests</TableHead>
                        <TableHead>Last Used</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {apiKeys.map((key) => (
                        <TableRow key={key.id}>
                          <TableCell className="font-medium">
                            {key.name}
                          </TableCell>
                          <TableCell>{key.tenant}</TableCell>
                          <TableCell className="font-mono text-xs">
                            <div className="flex items-center gap-2">
                              {showSecret[key.id]
                                ? key.key
                                : key.key.slice(0, 10) + "..."}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleSecretVisibility(key.id)}
                              >
                                {showSecret[key.id] ? (
                                  <EyeOff size={14} />
                                ) : (
                                  <Eye size={14} />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  navigator.clipboard.writeText(key.key)
                                }
                              >
                                <Copy size={14} />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {key.permissions.map((perm) => (
                                <Badge key={perm} variant="outline">
                                  {perm}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{key.requests.toLocaleString()}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {key.lastUsed}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  Edit Permissions
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteKey(key.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 size={16} className="mr-2" />
                                  Revoke Key
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Webhooks Tab */}
          <TabsContent value="webhooks" className="space-y-6">
            <div className="flex justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus size={18} />
                    Create Webhook
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Webhook Endpoint</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Tenant</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tenant" />
                        </SelectTrigger>
                        <SelectContent>
                          {webhooks.map((w) => (
                            <SelectItem key={w.id} value={w.tenant}>
                              {w.tenant}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Endpoint URL
                      </label>
                      <Input placeholder="https://example.com/webhook" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Events</label>
                      <div className="space-y-2 mt-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          invoice.created
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" />
                          payment.completed
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" />
                          user.created
                        </label>
                      </div>
                    </div>
                    <Button className="w-full">Create Webhook</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Webhook Endpoints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tenant</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>Events</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Success Rate</TableHead>
                        <TableHead>Last Triggered</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {webhooks.map((webhook) => (
                        <TableRow key={webhook.id}>
                          <TableCell className="font-medium">
                            {webhook.tenant}
                          </TableCell>
                          <TableCell className="font-mono text-xs max-w-xs truncate">
                            {webhook.url}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {webhook.events.slice(0, 2).map((evt) => (
                                <Badge
                                  key={evt}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {evt}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">
                              {webhook.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{webhook.successRate}%</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {webhook.lastTriggered}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalRequests.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last 24 hours
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Errors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {totalErrors}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last 24 hours
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Error Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{errorRate}%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {totalErrors}/{totalRequests} requests
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>API Usage Trend</CardTitle>
                <CardDescription>Requests and errors over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="requests"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Requests"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="errors"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="Errors"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documentation Tab */}
          <TabsContent value="documentation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
                <CardDescription>
                  Complete API reference and integration guides
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    {
                      title: "Getting Started",
                      description: "Quick start guide for API integration",
                    },
                    {
                      title: "Authentication",
                      description: "Learn how to authenticate your requests",
                    },
                    {
                      title: "Webhooks Guide",
                      description: "Set up and manage webhook endpoints",
                    },
                    {
                      title: "API Reference",
                      description: "Complete endpoint documentation",
                    },
                  ].map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-4 border border-border rounded-lg hover:bg-muted cursor-pointer transition"
                    >
                      <h4 className="font-semibold">{doc.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {doc.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default APIManagement;
