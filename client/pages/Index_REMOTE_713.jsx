import React, { useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Check, Zap, TrendingUp, Users, BarChart3, Lock } from "lucide-react";
import { isAuthenticated, getUser } from "@/lib/auth";

export default function Index() {
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

  return (
    <Layout>
      {/* Hero Section */}
      <section className="grid gap-8 md:gap-16 lg:grid-cols-2 items-center mb-16 md:mb-24">
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
            Script — Smart Business Management System for Nigerian SMEs
          </h1>
          <p className="mt-4 md:mt-6 text-base md:text-lg text-muted-foreground max-w-xl">
            All-in-one platform to manage sales, inventory, cash flow, and
            customer relationships — built for businesses in
            Nigeria with local payments and practical workflows.
          </p>

          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                Get started 
              </Button>
            </Link>
            <Link to="/features" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                See all features
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative mt-8 md:mt-0 w-full">
          <div className="rounded-xl overflow-visible aspect-[4/3] md:aspect-[16/10] lg:aspect-auto lg:h-[600px]">
            <img
              src="/Group 7.png"
              alt="Script business management dashboard with Nigerian entrepreneurs"
              className="w-full h-full object-contain"
              style={{
                filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.15)) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
              }}
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-16 md:mb-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
          Everything you need to run your business
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="p-4 md:p-6 bg-card border border-border rounded-lg">
            <Zap className="w-6 h-6 text-primary mb-3" />
            <h4 className="font-semibold text-sm md:text-base">
              Sales Management
            </h4>
            <p className="text-xs md:text-sm text-muted-foreground mt-2">
              Create sales, track payments,
              and manage stock levels reminders.
            </p>
          </div>
          <div className="p-4 md:p-6 bg-card border border-border rounded-lg">
            <BarChart3 className="w-6 h-6 text-primary mb-3" />
            <h4 className="font-semibold text-sm md:text-base">
              Inventory Tracking
            </h4>
            <p className="text-xs md:text-sm text-muted-foreground mt-2">
              Monitor stock levels, set reorder points, track inventory value,
              and manage product variations.
            </p>
          </div>
          <div className="p-4 md:p-6 bg-card border border-border rounded-lg">
            <TrendingUp className="w-6 h-6 text-primary mb-3" />
            <h4 className="font-semibold text-sm md:text-base">
              Advanced Analytics
            </h4>
            <p className="text-xs md:text-sm text-muted-foreground mt-2">
              Get detailed insights into sales trends, revenue, expenses, and
              business performance metrics.
            </p>
          </div>
          <div className="p-4 md:p-6 bg-card border border-border rounded-lg">
            <Users className="w-6 h-6 text-primary mb-3" />
            <h4 className="font-semibold text-sm md:text-base">
              Customer Management
            </h4>
            <p className="text-xs md:text-sm text-muted-foreground mt-2">
              Centralize customer data, track communication history, and manage
              customer relationships.
            </p>
          </div>
          <div className="p-4 md:p-6 bg-card border border-border rounded-lg">
            <Users className="w-6 h-6 text-primary mb-3" />
            <h4 className="font-semibold text-sm md:text-base">
              Team Collaboration
            </h4>
            <p className="text-xs md:text-sm text-muted-foreground mt-2">
              Add team members, assign roles, delegate tasks, and collaborate
              seamlessly with your team.
            </p>
          </div>
          <div className="p-4 md:p-6 bg-card border border-border rounded-lg">
            <Lock className="w-6 h-6 text-primary mb-3" />
            <h4 className="font-semibold text-sm md:text-base">
              Secure & Reliable
            </h4>
            <p className="text-xs md:text-sm text-muted-foreground mt-2">
              Enterprise-grade security, regular backups, and 99.9% uptime
              guarantee for your business data.
            </p>
          </div>
        </div>
      </section>

      {/* Trust & Benefits Section */}
      <section className="grid gap-8 md:gap-12 lg:grid-cols-2 items-center mb-16 md:mb-24">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Built for Nigerian businesses
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm md:text-base">
                Local payment integration with Nigerian banks and Flutterwave
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm md:text-base">
                Support for Nigerian Naira (₦) currency and local tax formats
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm md:text-base">
                Optimized for slow internet with offline-capable features
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm md:text-base">
                Practical workflows designed from real Nigerian business needs
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm md:text-base">
                Affordable pricing that grows with your business
              </span>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-center">
            <p className="text-3xl font-bold text-primary">500+</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-2">
              Active businesses
            </p>
          </div>
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-center">
            <p className="text-3xl font-bold text-primary">₦2B+</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-2">
              Tracked in sales
            </p>
          </div>
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-center">
            <p className="text-3xl font-bold text-primary">99.9%</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-2">
              Uptime guarantee
            </p>
          </div>
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-center">
            <p className="text-3xl font-bold text-primary">24/7</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-2">
              Priority support
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="mb-16 md:mb-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold">
            Simple, transparent pricing
          </h2>
          <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            One powerful plan with everything you need. No hidden fees, no
            complicated tiers. Cancel anytime.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="border border-primary bg-primary/5 rounded-lg p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold">Standard Plan</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Everything your business needs
              </p>
            </div>

            <div className="flex items-baseline justify-center gap-2 mb-8">
              <span className="text-5xl font-bold">₦200</span>
              <span className="text-muted-foreground">/month</span>
            </div>

            <p className="text-center text-sm text-muted-foreground mb-8">
              or <strong className="text-foreground">₦2,000/year</strong> and
              save ₦400
            </p>

            <Link to="/signup" className="block mb-8">
              <Button size="lg" className="w-full">
                Get started
              </Button>
            </Link>

            <div className="space-y-4 border-t border-border pt-8">
              <h4 className="font-semibold text-sm mb-4">
                Included in every plan:
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  Unlimited invoices and invoicing templates
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  Unlimited inventory management and product tracking
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  Advanced analytics with detailed reports and insights
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  Complete customer and client management system
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  Team collaboration and role-based permissions
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  Payment tracking and sales reporting
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  Expense tracking and budget management
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  24/7 priority support and email help
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  Regular updates and new features
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  99.9% uptime guarantee
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary/5 border border-border rounded-lg p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg md:text-xl font-semibold">
              Ready to simplify your business?
            </h3>
            <p className="mt-2 text-xs md:text-sm text-muted-foreground">
              Join hundreds of Nigerian businesses managing their entire
              operation with Script.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <Link to="/signup" className="w-full md:w-auto block">
              <Button size="lg" className="w-full md:w-auto">
                Start your free trial
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
