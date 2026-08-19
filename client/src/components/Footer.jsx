import React from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiGlobe, FiMail, FiPhone } from "react-icons/fi";

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white border-t-4 border-red-600 py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Portal Branding */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-amber-400 to-red-600 rounded-lg text-slate-950">
              <FiCalendar size={20} className="font-bold" />
            </div>
            <span className="text-lg font-black tracking-tight text-white">
              CAMPUS<span className="text-amber-400">BOOKING</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            Automated campus infrastructure & laboratory scheduling platform. Reserve seminar halls, computer labs, smart classrooms, and auditoriums online.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest mb-4">
            PORTAL NAVIGATION
          </h4>
          <ul className="space-y-2 text-xs font-semibold text-slate-300">
            <li>
              <Link to="/" className="hover:text-amber-300 transition-colors">Home Page</Link>
            </li>
            <li>
              <Link to="/resources" className="hover:text-amber-300 transition-colors">All Campus Resources</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-amber-300 transition-colors">Student Login</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-amber-300 transition-colors">Administrator Portal</Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest mb-4">
            FACILITY TYPES
          </h4>
          <ul className="space-y-2 text-xs font-semibold text-slate-300">
            <li>Seminar & Conference Halls</li>
            <li>Advanced Computer Labs</li>
            <li>Physics & Chemistry Labs</li>
            <li>Smart Classrooms & Projectors</li>
            <li>Central Campus Auditorium</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest mb-4">
            HELP & CONTACT
          </h4>
          <ul className="space-y-2 text-xs font-semibold text-slate-300">
            <li className="flex items-center gap-2">
              <FiMail className="text-red-500" />
              <span>support@campusbooking.edu</span>
            </li>
            <li className="flex items-center gap-2">
              <FiPhone className="text-amber-400" />
              <span>+1 (800) 555-CRBS</span>
            </li>
            <li className="flex items-center gap-2">
              <FiGlobe className="text-blue-400" />
              <span>CRBS Portal 2026</span>
            </li>
          </ul>
          <p className="text-[11px] text-slate-500 mt-4">
            © {new Date().getFullYear()} Campus Resource Booking System. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;