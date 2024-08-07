// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <nav className="bg-gray-800 text-white w-64 h-full p-4">
      <ul>
        <li>
          <Link to="/admin/home" className="block py-2 px-4 hover:bg-gray-700 rounded">
            Home
          </Link>
        </li>
        <li>
          <Link to="/admin/users" className="block py-2 px-4 hover:bg-gray-700 rounded">
            Users
          </Link>
        </li>
        <li>
          <Link to="/admin/settings" className="block py-2 px-4 hover:bg-gray-700 rounded">
            Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;
