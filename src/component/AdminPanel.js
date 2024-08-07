// src/components/AdminPanel.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function AdminPanel() {
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