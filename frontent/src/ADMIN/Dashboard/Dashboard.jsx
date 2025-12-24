// src/ADMIN/Dashboard/Dashboard.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../AdminComponents/AdminNavbar";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-[#0f0f0f]">
      {/* 1. Sidebar (Fixed - Width 64) */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-[#0a0a0a] border-r border-gray-800 z-30">
        <div className="p-6">
          <h2 className="text-2xl font-black text-red-600 tracking-tighter">
            NEXTSHOW
          </h2>
        </div>
        {/* Testing Sidebar Scroll */}
        <div className="h-[1000px] px-6 text-gray-700 text-xs">
          Sidebar Scroll Test...
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col">
        {/* Fixed Header */}
        <AdminNavbar />

        {/* Content Area */}
        {/* mt-16 header space-kaga, p-8 padding-kaga */}
        <div className="p-8 mt-16 text-white">
          {/* --- TESTING SECTION START --- */}
          <div className="bg-gradient-to-b from-purple-900/20 to-transparent p-6 rounded-xl border border-gray-800 mb-6">
            <h3 className="text-xl font-bold">Scroll Testing Mode Active</h3>
            <p className="text-gray-400">
              Killa scroll panni paarunga, Navbar top-la fixed-ah irukanum.
            </p>
          </div>
          <div className="h-[2000px] mt-10 border-l-4 border-dashed border-gray-800 pl-4">
            <p className="text-gray-600 italic">
              Checking Scroll... Content mela poganum, aana Navbar apdiye
              nikanum.
            </p>
          </div>

          <Outlet />

          {/* Dummy Height for testing scroll */}

          {/* --- TESTING SECTION END --- */}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
