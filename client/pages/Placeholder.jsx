import React from "react";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

export default function Placeholder({ title = "Coming soon" }) {
  return (
    <Layout>
      <div className="py-12 md:py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold">{title}</h2>
        <p className="mt-4 text-xs md:text-sm text-muted-foreground max-w-xl mx-auto px-4">
          This page is a placeholder. Tell me what you'd like to include here
          and I will build it out.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="text-xs md:text-sm text-primary underline hover:no-underline"
          >
            Return home
          </Link>
        </div>
      </div>
    </Layout>
  );
}
