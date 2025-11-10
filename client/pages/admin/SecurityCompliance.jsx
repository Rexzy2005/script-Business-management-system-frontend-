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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertCircle,
  CheckCircle,
  Download,
  Shield,
  Lock,
  Eye,
} from "lucide-react";

const SecurityCompliance = () => {
  const [auditLogs] = useState([]);

  const [complianceStatus] = useState({});

  const [backups] = useState([]);

  const [securityEvents] = useState([]);

  const getStatusColor = (status) => {
    switch (status) {
      case "compliant":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "not-started":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AdminLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Security & Compliance
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage security, compliance, and audit trails
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="audit-logs" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="backups">Backups</TabsTrigger>
            <TabsTrigger value="security">Security Events</TabsTrigger>
          </TabsList>

          {/* Audit Logs Tab */}
          <TabsContent value="audit-logs" className="space-y-6">
            <div className="flex justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Download size={18} />
                    Export Logs
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Export Audit Logs</DialogTitle>
                    <DialogDescription>
                      Download audit logs in your preferred format
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Download size={16} className="mr-2" />
                      CSV Format
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download size={16} className="mr-2" />
                      JSON Format
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download size={16} className="mr-2" />
                      PDF Report
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Admin Activity Log</CardTitle>
                <CardDescription>
                  Complete record of all admin actions with IP tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Admin</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Resource</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-xs">
                            {log.timestamp}
                          </TableCell>
                          <TableCell>{log.admin}</TableCell>
                          <TableCell className="text-sm">
                            {log.action}
                          </TableCell>
                          <TableCell className="text-sm">
                            {log.resource}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {log.ipAddress}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">
                              {log.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">SOC 2 Type II</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Badge
                    className={getStatusColor(complianceStatus.soc2.status)}
                  >
                    {complianceStatus.soc2.status.replace("-", " ")}
                  </Badge>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Progress
                      </span>
                      <span className="text-sm font-semibold">
                        {complianceStatus.soc2.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{
                          width: `${complianceStatus.soc2.percentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full text-xs">
                    View Assessment
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">GDPR Compliance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Badge
                    className={getStatusColor(complianceStatus.gdpr.status)}
                  >
                    {complianceStatus.gdpr.status}
                  </Badge>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Progress
                      </span>
                      <span className="text-sm font-semibold">
                        {complianceStatus.gdpr.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${complianceStatus.gdpr.percentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full text-xs">
                    View Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">HIPAA Compliance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Badge
                    className={getStatusColor(complianceStatus.hipaa.status)}
                  >
                    {complianceStatus.hipaa.status.replace("-", " ")}
                  </Badge>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Progress
                      </span>
                      <span className="text-sm font-semibold">
                        {complianceStatus.hipaa.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{
                          width: `${complianceStatus.hipaa.percentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full text-xs">
                    Start Assessment
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Checklist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { item: "Data Encryption at Rest", completed: true },
                  { item: "TLS/SSL in Transit", completed: true },
                  { item: "Regular Security Audits", completed: true },
                  { item: "Incident Response Plan", completed: true },
                  { item: "Employee Training", completed: false },
                  { item: "Third-Party Vendor Review", completed: false },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 border border-border rounded-lg"
                  >
                    <span className="text-sm">{item.item}</span>
                    {item.completed ? (
                      <CheckCircle size={20} className="text-green-600" />
                    ) : (
                      <AlertCircle size={20} className="text-yellow-600" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Backups Tab */}
          <TabsContent value="backups" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Last Backup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2 hours ago</div>
                  <p className="text-xs text-muted-foreground mt-1">45.2 GB</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Backup Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                  <p className="text-xs text-muted-foreground mt-2">
                    All backups verified
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Recovery Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">~2 hours</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    RTO target
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Backup History</CardTitle>
                <CardDescription>
                  Recent database and file backups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Verified</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {backups.map((backup) => (
                        <TableRow key={backup.id}>
                          <TableCell className="font-mono text-xs">
                            {backup.timestamp}
                          </TableCell>
                          <TableCell>{backup.size}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">
                              {backup.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {backup.verified ? (
                              <CheckCircle
                                size={16}
                                className="text-green-600"
                              />
                            ) : (
                              <AlertCircle
                                size={16}
                                className="text-yellow-600"
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs"
                            >
                              Restore
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button className="gap-2">
                <Download size={18} />
                Start Manual Backup
              </Button>
              <Button variant="outline">Configure Schedule</Button>
            </div>
          </TabsContent>

          {/* Security Events Tab */}
          <TabsContent value="security" className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You have 1 high-severity security event that requires attention
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Recent Security Events</CardTitle>
                <CardDescription>
                  Suspicious activity and security alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {securityEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold capitalize">
                              {event.type.replace("-", " ")}
                            </p>
                            <Badge className={getSeverityColor(event.severity)}>
                              {event.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            {event.timestamp}
                          </p>
                          <Badge className="mt-2 bg-blue-100 text-blue-800">
                            {event.status}
                          </Badge>
                        </div>
                      </div>
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

export default SecurityCompliance;
