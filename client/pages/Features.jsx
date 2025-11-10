import React, { useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, getUser } from "@/lib/auth";
import {
  FileText,
  Package,
  BarChart3,
  Users,
  Clock,
  Lock,
  TrendingUp,
  CreditCard,
  Target,
  Bell,
  Download,
  Share2,
} from "lucide-react";

export default function Features() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      const user = getUser();
      if (
        user?.isAdmin ||
        user?.role === "super-admin" ||
        user?.role === "admin"
      ) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [navigate]);

  const features = [
    {
      title: "Professional Invoicing",
      desc: "Create branded invoices, send digitally, and track payment status in real-time. Automated reminders for overdue payments.",
      icon: FileText,
    },
    {
      title: "Inventory Management",
      desc: "Track stock levels, manage product variations, set reorder points, and monitor inventory value with ease.",
      icon: Package,
    },
    {
      title: "Advanced Analytics",
      desc: "Get detailed insights into sales trends, revenue patterns, expenses, and business performance with visual reports.",
      icon: BarChart3,
    },
    {
      title: "Customer Database",
      desc: "Centralize all customer information, track communication history, and manage customer relationships effectively.",
      icon: Users,
    },
    {
      title: "Team Collaboration",
      desc: "Add unlimited team members, assign roles with specific permissions, and work together seamlessly.",
      icon: Clock,
    },
    {
      title: "Payment Tracking",
      desc: "Monitor all transactions, track payment status, and reconcile payments with invoices automatically.",
      icon: CreditCard,
    },
    {
      title: "Sales Management",
      desc: "Track sales by product, category, and time period. Identify your top-selling products and optimize inventory.",
      icon: TrendingUp,
    },
    {
      title: "Expense Tracking",
      desc: "Record and categorize business expenses to monitor spending and understand your true business profitability.",
      icon: Target,
    },
    {
      title: "Automated Alerts",
      desc: "Get notified about low stock levels, overdue payments, and important business milestones automatically.",
      icon: Bell,
    },
    {
      title: "Reports & Exports",
      desc: "Generate comprehensive business reports and export data in multiple formats for analysis and sharing.",
      icon: Download,
    },
    {
      title: "Data Security",
      desc: "Enterprise-grade encryption, regular backups, and role-based access controls to keep your data safe.",
      icon: Lock,
    },
    {
      title: "Easy Sharing",
      desc: "Share business profile with customers, generate QR codes, and showcase your products with a public storefront.",
      icon: Share2,
    },
  ];

  return (
    <Layout>
      <section className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold">
            Everything you need to manage your business
          </h1>
          <p className="mt-4 md:mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Script combines invoicing, inventory, analytics, team management,
            and customer tools into one simple platform — designed specifically
            for Nigerian product sellers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-base mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Feature Highlights Section */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Built for Nigerian businesses
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold mb-4">
                Local Payment Integration
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                Seamlessly integrate with Nigerian payment systems including
                Flutterwave, local bank transfers, and USSD payments.
              </p>
              <ul className="space-y-2 text-sm">
                <li>✓ Naira (₦) currency support</li>
                <li>✓ Local tax format compliance</li>
                <li>✓ Multiple payment gateway options</li>
              </ul>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold mb-4">
                Optimized Performance
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                Designed to work efficiently even with slower internet
                connections. Lightweight, fast, and reliable.
              </p>
              <ul className="space-y-2 text-sm">
                <li>✓ Works offline with sync</li>
                <li>✓ Mobile-optimized interface</li>
                <li>✓ Fast loading times</li>
              </ul>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold mb-4">
                Practical Workflows
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                Built from real feedback from Nigerian business owners.
                Workflows designed for practical, everyday business needs.
              </p>
              <ul className="space-y-2 text-sm">
                <li>✓ Quick data entry</li>
                <li>✓ Bulk operations</li>
                <li>✓ Smart defaults</li>
              </ul>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold mb-4">
                Enterprise Security
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                Your business data is protected with bank-level security,
                regular backups, and compliance standards.
              </p>
              <ul className="space-y-2 text-sm">
                <li>✓ 99.9% uptime guarantee</li>
                <li>✓ Automatic daily backups</li>
                <li>✓ Role-based access control</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Everything in one place
          </h2>

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-card border-b border-border">
                    <th className="text-left p-4 font-semibold">Feature</th>
                    <th className="text-center p-4 font-semibold">Included</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    "Unlimited invoice creation and templates",
                    "Unlimited inventory management",
                    "Advanced analytics and reports",
                    "Customer database and management",
                    "Up to unlimited team members",
                    "Payment and transaction tracking",
                    "Expense management and budgeting",
                    "Sales analytics and insights",
                    "Mobile app access",
                    "API access for integrations",
                    "Data export in multiple formats",
                    "24/7 priority support",
                  ].map((feature, idx) => (
                    <tr
                      key={idx}
                      className={`border-b border-border ${
                        idx % 2 === 0 ? "bg-background" : ""
                      }`}
                    >
                      <td className="p-4 text-sm md:text-base">{feature}</td>
                      <td className="text-center p-4">
                        <span className="text-primary font-bold">✓</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="text-center bg-secondary/5 border border-border rounded-lg p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to transform your business?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start managing your business with Script today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get started
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
