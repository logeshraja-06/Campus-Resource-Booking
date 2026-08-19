import React from "react";
import { Link } from "react-router-dom";
import { FiHome, FiAlertCircle } from "react-icons/fi";
import Button from "../components/ui/Button";

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#05070c] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Glow Effects */}
      <div className="glow-bg top-1/4 left-1/4 opacity-30"></div>
      <div className="glow-bg-blue bottom-1/4 right-1/4 opacity-30"></div>

      <div className="max-w-md w-full text-center space-y-6 z-10 glass-panel p-8 sm:p-10 rounded-2xl border border-red-500/20 shadow-2xl shadow-red-500/5">
        <div className="inline-flex p-4 bg-red-500/10 rounded-full border border-red-500/25 text-red-500 animate-pulse">
          <FiAlertCircle size={48} />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-red-600 tracking-tight">
            404
          </h1>
          <h2 className="text-xl font-bold uppercase tracking-wider text-slate-100">
            Page Not Found
          </h2>
          <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
            The page you are looking for does not exist or has been moved. Let's get you back on track.
          </p>
        </div>

        <div className="pt-4">
          <Link to="/" className="inline-block w-full">
            <Button variant="primary" className="w-full py-3 flex items-center justify-center space-x-2">
              <FiHome size={16} />
              <span>Return Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;