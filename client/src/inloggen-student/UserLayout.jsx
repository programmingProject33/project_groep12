import React from "react";
import { Outlet } from "react-router-dom";
import UserNavbar from "./UserNavbar";

export default function UserLayout() {
  return (
    <div className="user-layout">
      <UserNavbar />
      <main className="user-main">
        <Outlet />
      </main>
      <footer className="footer user-footer">
        <div>Support: support-careerlaunch@ehb.be | +32 494 77 08 550</div>
      </footer>
    </div>
  );
} 