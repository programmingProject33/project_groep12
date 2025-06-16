import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function GuestRoute({ children }) {
  const { user, isAuthLoading } = useAuth();
  
  if (isAuthLoading) return null; // of een loader
  
  if (user) {
    // Redirect naar het juiste dashboard op basis van het type gebruiker
    return <Navigate to={user.type === 'student' ? '/student-dashboard' : '/bedrijf/home'} replace />;
  }
  
  return children;
} 