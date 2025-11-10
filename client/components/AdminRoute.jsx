import React from "react";
import { Navigate } from "react-router-dom";
import { isAdmin } from "@/lib/auth";

export default function AdminRoute({ children }) {
  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }
  return children;
}
