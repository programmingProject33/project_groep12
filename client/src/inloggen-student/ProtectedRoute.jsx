import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user");
  const location = useLocation();
  
  console.log("ProtectedRoute checking user:", user);
  console.log("Current location:", location.pathname);
  
  if (!user) {
    console.log("No user found, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  console.log("User found, rendering protected content");
  return children;
} 