// src/components/layouts/Topbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus } from "lucide-react";

export default function Topbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-3 sm:px-6 py-2 sticky top-0 z-50">
      {/* Left: Logo */}
      <div className="flex items-center flex-shrink-0">
        <img
          src="/logo.png" // replace with your ARDU logo path
          alt="ARDU Logo"
          className="h-8 w-auto object-contain"
        />
      </div>

      {/* Center: Tabs */}
      <div className="flex items-center gap-5 sm:gap-8 justify-center">
        <Link
          to="/feed"
          className={`text-sm font-semibold transition-all ${
            isActive("/feed")
              ? "text-red-700 border-b-2 border-red-700 pb-1"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          For You
        </Link>

        <Link
          to="/community"
          className={`text-sm font-semibold transition-all ${
            isActive("/community")
              ? "text-red-700 border-b-2 border-red-700 pb-1"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Community
        </Link>
      </div>

      {/* Right: Upload Button */}
      <Link
        to="/upload"
        className="bg-red-700 text-white p-2 rounded-full flex items-center justify-center hover:bg-red-800 transition"
      >
        <Plus className="w-5 h-5" />
      </Link>
    </nav>
  );
}
