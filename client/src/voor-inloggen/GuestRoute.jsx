import React from "react";
import { Navigate } from "react-router-dom";

export default function GuestRoute({ children }) {
  const user = localStorage.getItem("user");
  if (user) {
    return <Navigate to="/student-dashboard" replace />;
  }
  return children;
} 