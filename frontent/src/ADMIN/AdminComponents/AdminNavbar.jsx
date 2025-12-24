// src/ADMIN/AdminComponents/AdminHeader.jsx
import React from "react";
import { FaBell, FaUserCircle, FaSearch } from "react-icons/fa";

const AdminNavbar = () => {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-[#0a0a0a] border-b border-gray-800 flex items-center justify-between px-8 z-20">
      {/* 1. Dashboard Title & Search */}
      <div className="flex items-center space-x-6">
        <h1 className="text-lg font-black text-white uppercase tracking-tighter">
          Admin <span className="text-red-600">Dashboard</span>
        </h1>

        {/* Simple Search Bar for Movies */}
        <div className="hidden md:flex items-center bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-gray-700">
          <FaSearch className="text-gray-500 text-sm" />
          <input
            type="text"
            placeholder="Search movies..."
            className="bg-transparent border-none outline-none text-sm text-gray-300 ml-2 w-48"
          />
        </div>
      </div>

      {/* 2. Admin Actions */}
      <div className="flex items-center space-x-6">
        {/* Notification with Badge */}
        <button className="relative text-gray-400 hover:text-red-500 transition-colors duration-200">
          <FaBell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] text-white w-4 h-4 rounded-full flex items-center justify-center font-bold">
            3
          </span>
        </button>

        {/* Admin Profile */}
        <div className="flex items-center space-x-3 group cursor-pointer border-l border-gray-800 pl-6">
          <div className="text-right">
            <p className="text-sm font-bold text-white leading-none">
              Admin Name
            </p>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">
              Super Admin
            </p>
          </div>
          <div className="relative">
            <FaUserCircle className="w-9 h-9 text-gray-600 group-hover:text-red-600 transition-colors shadow-lg" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0a0a0a] rounded-full"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
