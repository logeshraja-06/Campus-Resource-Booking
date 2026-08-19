import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiCalendar, FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

export const FloatingWidgets = () => {
  return (
    <>
      {/* Floating WhatsApp Helpdesk Button (Bottom Left) */}
      <a
        href="https://wa.me/?text=Hello!%20I%20have%20an%20inquiry%20regarding%20Campus%20Resource%20Booking."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 group cursor-pointer"
        aria-label="Chat on WhatsApp Help Desk"
      >
        <FaWhatsapp size={32} className="animate-pulse" />
        <span className="absolute left-16 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Resource Booking Help Desk
        </span>
      </a>

      {/* Floating Action Badge (Bottom Right) matching reference UI design style */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
        <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[11px] px-3 py-1 rounded-t-lg shadow-md uppercase tracking-wider flex items-center gap-1.5 animate-bounce">
          <FiCheckCircle size={14} />
          SYSTEM ACTIVE
        </div>
        <Link
          to="/resources"
          className="bg-gradient-to-r from-blue-950 to-indigo-950 border-2 border-amber-400 text-white px-4 py-2.5 rounded-b-xl rounded-tl-xl shadow-2xl flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300 cursor-pointer group"
        >
          <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-widest flex items-center gap-1">
            <FiCalendar size={12} />
            CRBS 2026
          </span>
          <span className="text-xs font-black text-white tracking-wide uppercase group-hover:text-amber-300 transition-colors">
            BOOK RESOURCE NOW
          </span>
        </Link>
      </div>
    </>
  );
};

export default FloatingWidgets;
