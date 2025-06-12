import React from "react";
import { Outlet } from "react-router-dom";
import GuestNavbar from "./GuestNavbar";

export default function GuestLayout() {
  return (
    <div>
      <GuestNavbar />
      <main>
        <Outlet />
      </main>
      <footer className="footer guest-footer">
        <div>© {new Date().getFullYear()} Careerlaunch</div>
      </footer>
    </div>
  );
} 