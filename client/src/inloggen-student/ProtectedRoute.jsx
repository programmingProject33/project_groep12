import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthLoading } = useAuth();
  const location = useLocation();
  
  console.log("ProtectedRoute checking user:", user);
  console.log("Current location:", location.pathname);
  
  if (isAuthLoading) return null; // of een loader
  
  if (!user) {
    console.log("No user found, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Als er allowedRoles zijn gespecificeerd, controleer dan of de gebruiker de juiste rol heeft
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.type)) {
    console.log("User role not allowed, redirecting to appropriate dashboard");
    return <Navigate to={user.type === 'student' ? '/student-dashboard' : '/bedrijf/home'} replace />;
  }
  
  console.log("User found and role allowed, rendering protected content");
  return children;
} 