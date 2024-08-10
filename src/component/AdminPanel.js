// src/components/AdminPanel.js
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";

function AdminPanel() {
  const { token, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user.type == "doctor") {
      navigate("consultantList");
    } else {
      navigate("doctorList");
    }
  }, [user]);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
          <Outlet /> {/* Renders nested routes */}
        </main>
      </div>
    </div>
  );
}

export default AdminPanel;
