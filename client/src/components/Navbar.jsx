import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiLogOut,
  FiUser,
  FiGrid,
  FiCalendar,
  FiBookOpen,
  FiLayers
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const { isAuthenticated, user, role, logout } = useAuth();
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

  const navLinkClass = ({ isActive }) =>
    `text-xs sm:text-sm font-bold uppercase tracking-wide transition-all duration-200 py-3 px-4 flex items-center gap-1.5 ${
      isActive
        ? "bg-red-800 text-amber-300 border-b-4 border-amber-400"
        : "text-white hover:bg-red-700 hover:text-amber-200"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block text-sm font-bold py-2.5 px-4 rounded-md transition-colors ${
      isActive
        ? "bg-red-700 text-amber-300 font-extrabold"
        : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
    }`;

  return (
    <header className="w-full z-50 sticky top-0 shadow-md">
      {/* 1. CLEAN TOP INSTITUTIONAL BAR */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2.5">
          
          {/* Logo & Resource Booking Title */}
          <Link to="/" className="flex items-center gap-3 py-0.5 text-left group">
            {/* Emblem Logo Badge */}
            <div className="w-11 h-11 sm:w-13 sm:h-13 flex-shrink-0 bg-gradient-to-br from-amber-400 via-amber-500 to-red-600 rounded-full p-1 shadow-md flex items-center justify-center border-2 border-amber-300">
              <div className="w-full h-full bg-blue-950 rounded-full flex flex-col items-center justify-center text-white text-[9px] font-black leading-tight text-center p-0.5">
                <FiCalendar className="text-amber-400 text-sm" />
                <span className="text-amber-400 font-extrabold text-[8px] tracking-tighter">CRBS</span>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-2xl font-black text-red-600 dark:text-red-500 tracking-tight leading-none">
                  CAMPUS
                </span>
                <span className="text-sm sm:text-lg font-extrabold text-blue-950 dark:text-blue-400 tracking-tight leading-none">
                  RESOURCE BOOKING SYSTEM
                </span>
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-amber-600 dark:text-amber-400 tracking-wide uppercase">
                INSTITUTIONAL INFRASTRUCTURE RESERVATION PORTAL
              </span>
            </div>
          </Link>

          {/* Quick Header Actions (Theme & Auth) */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="w-7 h-7 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center shadow">
                  {user?.fullName?.charAt(0) || "U"}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-blue-950 dark:text-white leading-tight">
                    {user?.fullName || "User"}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-red-600 dark:text-amber-400">
                    {role || "Student"}
                  </span>
                </div>
              </div>
            ) : null}
          </div>

        </div>
      </div>

      {/* 2. MAIN RED NAVIGATION BAR */}
      <nav className="institutional-nav text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            
            {/* Essential Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              <NavLink to="/" className={navLinkClass}>
                HOME
              </NavLink>
              
              <NavLink to="/resources" className={navLinkClass}>
                <FiGrid className="text-amber-300" />
                ALL RESOURCES
              </NavLink>

              {isAuthenticated ? (
                <>
                  {role === "admin" ? (
                    <>
                      <NavLink to="/admin-dashboard" className={navLinkClass}>
                        ADMIN DASHBOARD
                      </NavLink>
                      <NavLink to="/admin/resources" className={navLinkClass}>
                        MANAGE RESOURCES
                      </NavLink>
                      <NavLink to="/admin/bookings" className={navLinkClass}>
                        BOOKING REQUESTS
                      </NavLink>
                    </>
                  ) : (
                    <>
                      <NavLink to="/student-dashboard" className={navLinkClass}>
                        MY DASHBOARD
                      </NavLink>
                      <NavLink to="/booking-history" className={navLinkClass}>
                        MY BOOKINGS
                      </NavLink>
                    </>
                  )}
                </>
              ) : null}
            </div>

            {/* Right Action Controls: Dark Mode Toggle & Auth Buttons */}
            <div className="flex items-center space-x-3 ml-auto">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-1.5 bg-red-700 hover:bg-red-800 text-amber-300 rounded-md transition-colors cursor-pointer"
                title="Toggle Dark/Light Mode"
              >
                {theme === "dark" ? <FiSun size={16} /> : <FiMoon size={16} />}
              </button>

              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 bg-red-900 hover:bg-red-950 text-white text-xs font-black px-3.5 py-1.5 rounded-md shadow transition-colors cursor-pointer"
                >
                  <FiLogOut size={14} />
                  <span>LOGOUT</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-4 py-1.5 rounded-md shadow transition-colors flex items-center gap-1"
                  >
                    <FiUser size={14} />
                    <span>LOGIN</span>
                  </Link>
                  <Link
                    to="/register"
                    className="bg-red-900 hover:bg-red-950 text-white text-xs font-bold px-3.5 py-1.5 rounded-md shadow transition-colors hidden sm:inline-block"
                  >
                    REGISTER
                  </Link>
                </div>
              )}

              {/* Mobile Drawer Trigger */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-1.5 bg-red-800 text-white rounded-md hover:bg-red-900"
              >
                {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 space-y-2 text-slate-800 dark:text-slate-100">
            <NavLink to="/" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>
              HOME
            </NavLink>
            <NavLink to="/resources" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>
              ALL RESOURCES
            </NavLink>

            {isAuthenticated ? (
              <>
                {role === "admin" ? (
                  <>
                    <NavLink to="/admin-dashboard" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>
                      ADMIN DASHBOARD
                    </NavLink>
                    <NavLink to="/admin/resources" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>
                      MANAGE RESOURCES
                    </NavLink>
                    <NavLink to="/admin/bookings" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>
                      BOOKING REQUESTS
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink to="/student-dashboard" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>
                      MY DASHBOARD
                    </NavLink>
                    <NavLink to="/booking-history" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>
                      MY BOOKINGS
                    </NavLink>
                  </>
                )}

                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="w-full mt-2 flex items-center justify-center gap-2 bg-red-600 text-white text-sm font-bold py-2 px-4 rounded-md"
                >
                  <FiLogOut size={16} />
                  <span>LOGOUT</span>
                </button>
              </>
            ) : (
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center bg-amber-400 text-slate-950 font-bold py-2 rounded-md"
                >
                  LOGIN
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center bg-blue-900 text-white font-bold py-2 rounded-md"
                >
                  REGISTER
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;