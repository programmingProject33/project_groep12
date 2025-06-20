import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function GuestRoute({ children }) {
  const { user, isAuthLoading } = useAuth();
  
  if (isAuthLoading) return null; // of een loader
  
  // Only redirect if user is properly authenticated and has a valid type
  if (user && user.type && (user.type === 'student' || user.type === 'bedrijf')) {
    // Redirect naar het juiste dashboard op basis van het type gebruiker
    const redirectPath = user.type === 'student' ? '/student/dashboard' : '/bedrijf/home';
    return <Navigate to={redirectPath} replace />;
  }
  
  return children;
} 