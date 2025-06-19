import React from "react";
import { Outlet } from "react-router-dom";
import StudentHeader from "./StudentHeader";
import StudentFooter from "./StudentFooter";

export default function UserLayout() {
  return (
    <div className="layout">
      <StudentHeader />
      <main className="main-content">
        <Outlet />
      </main>
      <StudentFooter />
    </div>
  );
} 