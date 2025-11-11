import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background mt-12 md:mt-20 px-4 py-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="w-full md:w-auto">
          <div className="flex items-center gap-3">
            <img src="/logo g.svg" alt="Script logo" className="w-9 h-auto" />
          </div>
          <p className="mt-3 text-xs md:text-sm text-muted-foreground max-w-md">
            Helping Nigerian SMEs run, grow and scale with simple, local-first
            business tools.
          </p>
        </div>

        <div className="flex gap-6 md:gap-8 w-full md:w-auto">
          <div>
            <h4 className="font-medium text-sm mb-2">Product</h4>
            <ul className="space-y-1 text-xs md:text-sm text-muted-foreground">
              <li>
                <Link
                  to="/features"
                  className="hover:text-foreground transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="hover:text-foreground transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/solutions"
                  className="hover:text-foreground transition-colors"
                >
                  Solutions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-2">Company</h4>
            <ul className="space-y-1 text-xs md:text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-xs md:text-sm text-muted-foreground w-full md:w-auto text-right">
          © {new Date().getFullYear()} Script. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
