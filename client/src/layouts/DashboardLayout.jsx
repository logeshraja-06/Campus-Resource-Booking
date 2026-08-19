import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiBookOpen,
  FiList,
  FiLogOut,
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiCalendar,
  FiPlusCircle,
  FiUser,
  FiHome,
  FiLayers
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export const DashboardLayout = ({ children }) => {
  const { user, role, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const navigate = useNavigate();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const studentLinks = [
    { name: "My Dashboard", path: "/student-dashboard", icon: FiGrid },
    { name: "Browse Resources", path: "/resources", icon: FiBookOpen },
    { name: "My Booking History", path: "/booking-history", icon: FiList },
  ];

  const adminLinks = [
    { name: "Admin Dashboard", path: "/admin-dashboard", icon: FiGrid },
    { name: "Manage Resources", path: "/admin/resources", icon: FiBookOpen },
    { name: "Add Resource", path: "/admin/resources/create", icon: FiPlusCircle },
    { name: "Booking Approvals", path: "/admin/bookings", icon: FiList },
  ];

  const links = role === "admin" ? adminLinks : studentLinks;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      
      {/* 1. TOP INSTITUTIONAL DASHBOARD HEADER */}
      <header className="sticky top-0 z-50 shadow-md">
        {/* Top Strip */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 bg-red-600 text-white rounded-md md:hidden hover:bg-red-700"
            >
              {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
            
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-blue-950 rounded-full p-1 border-2 border-amber-400 flex items-center justify-center text-amber-400 font-black text-xs">
                CRBS
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black text-blue-950 dark:text-white leading-tight">
                  CAMPUS<span className="text-red-600">BOOKING</span>
                </span>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                  INSTITUTIONAL DASHBOARD PORTAL
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-amber-300 px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <FiHome size={14} />
              <span>MAIN PORTAL</span>
            </Link>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-red-600 hover:text-white text-slate-700 dark:text-slate-300 rounded-md transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {theme === "dark" ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center space-x-2 pl-3 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-xs shadow">
                {user?.fullName?.charAt(0) || "U"}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-black text-blue-950 dark:text-white leading-tight">
                  {user?.fullName || "User"}
                </p>
                <span className="text-[9px] uppercase font-extrabold bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded inline-block">
                  {role || "Student"}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-2 text-red-600 hover:bg-red-600 hover:text-white rounded-md transition-colors"
              title="Logout"
            >
              <FiLogOut size={16} />
            </button>
          </div>
        </div>

        {/* Red Navigation Bar Banner */}
        <div className="institutional-nav h-2 w-full" />
      </header>

      {/* 2. SIDEBAR + MAIN CONTENT LAYOUT */}
      <div className="flex flex-1 relative">
        
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-xs md:hidden"
          />
        )}

        {/* Sidebar Navigation */}
        <aside
          className={`fixed md:sticky top-16 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between py-6 px-4 transition-transform duration-300 h-[calc(100vh-4rem)] ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="space-y-6">
            <div className="px-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400">
                NAVIGATION MENU
              </span>
            </div>

            <nav className="space-y-1.5">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                        isActive
                          ? "bg-red-600 text-white shadow-md border-l-4 border-amber-400"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-red-600 dark:hover:text-amber-300"
                      }`
                    }
                  >
                    <Icon size={16} />
                    <span>{link.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <Link
              to="/resources"
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-950 hover:bg-blue-900 text-amber-300 text-xs font-black uppercase rounded-xl transition-colors shadow"
            >
              <FiLayers size={14} />
              <span>RESOURCE CATALOG</span>
            </Link>

            <button
              onClick={logout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-xs font-extrabold uppercase text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
            >
              <FiLogOut size={14} />
              <span>LOGOUT</span>
            </button>
          </div>
        </aside>

        {/* Main Workspace Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;
