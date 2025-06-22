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
  if (allowedRoles.length > 0 && (!user.type || !allowedRoles.includes(user.type))) {
    console.log("User role not allowed, redirecting to appropriate dashboard");
    // Redirect naar het juiste dashboard op basis van het type gebruiker
    if (user.type === 'student') {
      return <Navigate to="/student/dashboard" replace />;
    } else if (user.type === 'bedrijf') {
      return <Navigate to="/bedrijf/home" replace />;
    }
    // Fallback voor onbekende gebruikerstypes - clear invalid user data
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
  
  console.log("User found and role allowed, rendering protected content");
  return children;
} 