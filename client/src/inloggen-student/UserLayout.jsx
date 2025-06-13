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
      
    </div>
  );
} 