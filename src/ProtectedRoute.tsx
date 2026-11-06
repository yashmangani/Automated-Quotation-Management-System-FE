// ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext";

export default function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: string }) {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" />;
  if (role && user?.role !== role) return <Navigate to="/dashboard" />;
  return <>{children}</>;
}
