import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, getUser } from "@/lib/auth";

export default function Solutions() {
  const navigate = useNavigate();
  const [solutions, setSolutions] = useState([]);

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

  useEffect(() => {
    // Load solutions from API
  }, []);

  return (
    <Layout>
      <section className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold">
          Solutions for common Nigerian businesses
        </h2>
        <p className="mt-3 text-xs md:text-base text-muted-foreground px-4">
          Whether you run a shop, restaurant, or a services business, Script
          adapts to your workflow.
        </p>

        {solutions.length === 0 ? (
          <div className="mt-8 p-8 text-center border border-dashed border-border rounded-lg">
            <p className="text-sm text-muted-foreground">
              Solutions are being loaded. Check back soon for industry-specific
              options.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {solutions.map((s) => (
              <div
                key={s.title}
                className="p-4 md:p-6 bg-card border border-border rounded-lg text-left"
              >
                <h3 className="font-semibold text-sm md:text-base">
                  {s.title}
                </h3>
                <p className="mt-2 text-xs md:text-sm text-muted-foreground">
                  {s.desc}
                </p>
                <div className="mt-4">
                  <Link to="/features">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs md:text-sm"
                    >
                      See features
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-xs md:text-sm text-muted-foreground">
          Want a tailored solution?{" "}
          <a href="#" className="text-primary underline hover:no-underline">
            Talk to us
          </a>
        </div>
      </section>
    </Layout>
  );
}
