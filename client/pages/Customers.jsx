import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";

export default function Customers() {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    // Load customers from API
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">{t("Customers")}</h1>
            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
              {t("Manage customer contacts and balances")}.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full md:w-auto">
            <Button size="sm" className="w-full md:w-auto text-xs md:text-sm">
              {t("Add Customer")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full md:w-auto text-xs md:text-sm"
            >
              {t("Import")}
            </Button>
          </div>
        </div>

        {customers.length === 0 ? (
          <div className="mt-6 p-8 text-center border border-dashed border-border rounded-lg">
            <p className="text-sm text-muted-foreground">
              {t("No customers yet. Add your first customer to get started")}.
            </p>
          </div>
        ) : (
          <div className="mt-6 bg-card border border-border rounded-lg overflow-hidden">
            <ul className="divide-y">
              {customers.map((c) => (
                <li
                  key={c.id}
                  className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 hover:bg-accent/50"
                >
                  <div className="w-full sm:w-auto">
                    <div className="font-semibold text-sm md:text-base">
                      {c.name}
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground">
                      {c.email}
                    </div>
                  </div>
                  <div className="text-right w-full sm:w-auto">
                    <div className="font-semibold text-sm md:text-base">
                      {c.total}
                    </div>
                    <div className="text-xs text-muted-foreground">{t("Account Balance")}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
}
