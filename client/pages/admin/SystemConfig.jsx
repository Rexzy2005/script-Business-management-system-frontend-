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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, CheckCircle, Save, TestTube } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SystemConfig = () => {
  const [emailConfig, setEmailConfig] = useState({
    host: "",
    port: "",
    username: "",
    password: "",
    senderEmail: "",
    testStatus: null,
  });

  const [smsConfig, setSmsConfig] = useState({
    provider: "",
    accountSid: "",
    authToken: "",
    fromNumber: "",
    testStatus: null,
  });

  const [storageConfig] = useState({
    provider: "",
    bucket: "",
    region: "",
    status: "",
  });

  const [featureFlags, setFeatureFlags] = useState([]);

  const [maintenanceMode, setMaintenanceMode] = useState({
    enabled: false,
    message: "",
  });

  const handleTestEmail = () => {
    setEmailConfig({ ...emailConfig, testStatus: "sending" });
    setTimeout(() => {
      setEmailConfig({ ...emailConfig, testStatus: "success" });
    }, 2000);
  };

  const handleTestSMS = () => {
    setSmsConfig({ ...smsConfig, testStatus: "sending" });
    setTimeout(() => {
      setSmsConfig({ ...smsConfig, testStatus: "success" });
    }, 2000);
  };

  const toggleFeatureFlag = (id) => {
    setFeatureFlags(
      featureFlags.map((ff) =>
        ff.id === id ? { ...ff, enabled: !ff.enabled } : ff,
      ),
    );
  };

  return (
    <AdminLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            System Configuration
          </h1>
          <p className="text-muted-foreground mt-1">
            Global settings and integrations
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="email" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-5">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="flags">Feature Flags</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>

          {/* Email Configuration Tab */}
          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Configuration</CardTitle>
                <CardDescription>
                  Configure SMTP settings for email delivery
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">SMTP Host</Label>
                    <Input
                      value={emailConfig.host}
                      onChange={(e) =>
                        setEmailConfig({ ...emailConfig, host: e.target.value })
                      }
                      placeholder="smtp.mailgun.org"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Port</Label>
                    <Input
                      value={emailConfig.port}
                      onChange={(e) =>
                        setEmailConfig({ ...emailConfig, port: e.target.value })
                      }
                      type="number"
                      placeholder="587"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium">Username</Label>
                    <Input
                      value={emailConfig.username}
                      onChange={(e) =>
                        setEmailConfig({
                          ...emailConfig,
                          username: e.target.value,
                        })
                      }
                      placeholder="postmaster"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium">Password</Label>
                    <Input
                      value={emailConfig.password}
                      onChange={(e) =>
                        setEmailConfig({
                          ...emailConfig,
                          password: e.target.value,
                        })
                      }
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium">Sender Email</Label>
                    <Input
                      value={emailConfig.senderEmail}
                      onChange={(e) =>
                        setEmailConfig({
                          ...emailConfig,
                          senderEmail: e.target.value,
                        })
                      }
                      type="email"
                      placeholder="noreply@platform.com"
                    />
                  </div>
                </div>

                {emailConfig.testStatus && (
                  <Alert
                    className={
                      emailConfig.testStatus === "success"
                        ? "border-green-200 bg-green-50"
                        : ""
                    }
                  >
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription>
                      {emailConfig.testStatus === "success"
                        ? "Test email sent successfully!"
                        : "Sending test email..."}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  <Button onClick={handleTestEmail}>
                    <TestTube size={18} className="mr-2" />
                    Test Email
                  </Button>
                  <Button variant="outline">
                    <Save size={18} className="mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SMS Configuration Tab */}
          <TabsContent value="sms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SMS Configuration</CardTitle>
                <CardDescription>
                  Configure SMS delivery provider
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Provider</Label>
                  <Select value={smsConfig.provider}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="aws_sns">AWS SNS</SelectItem>
                      <SelectItem value="nexmo">Vonage (Nexmo)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {smsConfig.provider === "twilio" && (
                  <>
                    <div>
                      <Label className="text-sm font-medium">Account SID</Label>
                      <Input
                        value={smsConfig.accountSid}
                        onChange={(e) =>
                          setSmsConfig({
                            ...smsConfig,
                            accountSid: e.target.value,
                          })
                        }
                        placeholder="AC****"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Auth Token</Label>
                      <Input
                        value={smsConfig.authToken}
                        onChange={(e) =>
                          setSmsConfig({
                            ...smsConfig,
                            authToken: e.target.value,
                          })
                        }
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                  </>
                )}

                <div>
                  <Label className="text-sm font-medium">From Number</Label>
                  <Input
                    value={smsConfig.fromNumber}
                    onChange={(e) =>
                      setSmsConfig({
                        ...smsConfig,
                        fromNumber: e.target.value,
                      })
                    }
                    placeholder="+1234567890"
                  />
                </div>

                {smsConfig.testStatus && (
                  <Alert
                    className={
                      smsConfig.testStatus === "success"
                        ? "border-green-200 bg-green-50"
                        : ""
                    }
                  >
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription>
                      {smsConfig.testStatus === "success"
                        ? "Test SMS sent successfully!"
                        : "Sending test SMS..."}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  <Button onClick={handleTestSMS}>
                    <TestTube size={18} className="mr-2" />
                    Test SMS
                  </Button>
                  <Button variant="outline">
                    <Save size={18} className="mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Storage Configuration Tab */}
          <TabsContent value="storage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>File Storage Configuration</CardTitle>
                <CardDescription>
                  Configure cloud storage for files and assets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-green-50">
                  <div>
                    <p className="font-semibold">
                      {storageConfig.provider.toUpperCase()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Bucket: {storageConfig.bucket}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Region: {storageConfig.region}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {storageConfig.status}
                  </Badge>
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Max File Size (MB)
                  </Label>
                  <Input type="number" placeholder="100" defaultValue="100" />
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Allowed File Types
                  </Label>
                  <Input
                    placeholder="jpg, png, pdf, docx"
                    defaultValue="jpg, png, pdf, docx, xlsx"
                  />
                </div>

                <Button variant="outline">
                  <Save size={18} className="mr-2" />
                  Update Configuration
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feature Flags Tab */}
          <TabsContent value="flags" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Feature Flags</CardTitle>
                <CardDescription>
                  Control feature availability and rollout
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Feature</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Rollout</TableHead>
                        <TableHead className="w-20">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {featureFlags.map((flag) => (
                        <TableRow key={flag.id}>
                          <TableCell className="font-mono text-sm">
                            {flag.key}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                flag.enabled
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }
                            >
                              {flag.enabled ? "Enabled" : "Disabled"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${flag.rollout}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-semibold w-10">
                                {flag.rollout}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={flag.enabled}
                              onCheckedChange={() => toggleFeatureFlag(flag.id)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maintenance Mode Tab */}
          <TabsContent value="maintenance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Mode</CardTitle>
                <CardDescription>
                  Take platform offline for maintenance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-semibold">Enable Maintenance Mode</p>
                    <p className="text-sm text-muted-foreground">
                      Users will see a maintenance message
                    </p>
                  </div>
                  <Switch
                    checked={maintenanceMode.enabled}
                    onCheckedChange={(checked) =>
                      setMaintenanceMode({
                        ...maintenanceMode,
                        enabled: checked,
                      })
                    }
                  />
                </div>

                {maintenanceMode.enabled && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Platform is currently in maintenance mode
                    </AlertDescription>
                  </Alert>
                )}

                <div>
                  <Label className="text-sm font-medium">
                    Maintenance Message
                  </Label>
                  <Input
                    value={maintenanceMode.message}
                    onChange={(e) =>
                      setMaintenanceMode({
                        ...maintenanceMode,
                        message: e.target.value,
                      })
                    }
                    placeholder="Enter maintenance message"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Whitelist IPs (one per line)
                  </Label>
                  <textarea
                    className="w-full p-2 border border-border rounded-md text-sm"
                    rows={3}
                    placeholder="192.168.1.1&#10;10.0.0.1"
                  />
                </div>

                <Button>
                  <Save size={18} className="mr-2" />
                  Save Configuration
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SystemConfig;
