// src/components/Sidebar.js
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Sidebar() {
  const { user } = useSelector((store) => store.auth);

  return (
    <nav className="bg-gray-800 text-white w-64 h-full p-4">
      <ul>
        {user.type != "doctor" && (
          <li>
            <Link
              to="/admin/doctorList"
              className="block py-2 px-4 hover:bg-gray-700 rounded">
              Doctor List
            </Link>
          </li>
        )}
        <li>
          <Link
            to="/admin/consultantList"
            className="block py-2 px-4 hover:bg-gray-700 rounded">
            Consultant Form list
          </Link>
        </li>
        <li>
          <Link
            to="/admin/profile"
            className="block py-2 px-4 hover:bg-gray-700 rounded">
            Profile
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;
