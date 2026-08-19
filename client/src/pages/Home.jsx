import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingWidgets from "../components/FloatingWidgets";
import ResourceCard from "../components/ResourceCard";
import { getResources } from "../services/resourceService";
import {
  FiArrowRight,
  FiSearch,
  FiAlertCircle,
  FiRefreshCw,
  FiLayers,
  FiUsers,
  FiCheckCircle,
  FiShield,
  FiClock,
  FiAward
} from "react-icons/fi";

export const Home = () => {
  const [featuredResources, setFeaturedResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);

  const fetchFeatured = async () => {
    setLoading(true);
    setNetworkError(false);
    try {
      const data = await getResources({ limit: 6 });
      if (data.success) {
        setFeaturedResources(data.resources || data.data || []);
      } else {
        setFeaturedResources([]);
      }
    } catch (err) {
      console.error("Home page fetch error:", err);
      setNetworkError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      {/* Network Connection Refused / Backend Warning Banner */}
      {networkError && (
        <div className="bg-amber-500 text-slate-950 px-4 py-3 shadow-md flex items-center justify-between border-b border-amber-600">
          <div className="flex items-center space-x-2 text-sm font-bold">
            <FiAlertCircle size={20} className="text-slate-950 flex-shrink-0 animate-bounce" />
            <span>
              Backend API Warning: Unable to reach Express server on port 5000 (net::ERR_CONNECTION_REFUSED).
              Please verify backend service status.
            </span>
          </div>
          <button
            onClick={fetchFeatured}
            className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-amber-400 font-extrabold text-xs px-3 py-1.5 rounded-md transition-colors cursor-pointer"
          >
            <FiRefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>RETRY API</span>
          </button>
        </div>
      )}

      {/* HERO SECTION (Using layout & colors from reference UI, content dedicated strictly to Campus Resource Booking) */}
      <section className="relative min-h-[540px] lg:min-h-[620px] flex items-center justify-center bg-slate-900 overflow-hidden text-white">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80"
            alt="Campus Facility Booking"
            className="w-full h-full object-cover object-center opacity-30 transform scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-slate-900/85 to-red-950/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left w-full">
          <div className="max-w-3xl space-y-6">
            
            {/* Top Tagline Badge */}
            <div className="inline-flex items-center gap-2 bg-red-600/90 backdrop-blur-md text-white text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-red-400/40 shadow-lg">
              <FiAward className="text-amber-300" size={16} />
              INSTITUTIONAL CAMPUS RESOURCE BOOKING PORTAL
            </div>

            {/* Hero Title with Amber Yellow Highlight */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight drop-shadow-md">
              SMART & AUTOMATED{" "}
              <span className="text-amber-400 drop-shadow-lg underline decoration-red-600 decoration-4 underline-offset-8">
                CAMPUS RESOURCE
              </span>{" "}
              RESERVATION
            </h1>

            <p className="text-base sm:text-xl text-slate-200 font-medium max-w-2xl leading-relaxed">
              Instantly check slot availability and schedule Seminar Halls, Advanced Computer Labs, Smart Classrooms, Projectors, and Auditoriums across departments.
            </p>

            {/* CTA Buttons (Red pill button matching reference UI design) */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/resources"
                className="bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base font-extrabold uppercase px-8 py-3.5 rounded-full shadow-2xl transition-all transform hover:scale-105 hover:shadow-red-600/40 flex items-center gap-2 border-2 border-red-500 cursor-pointer"
              >
                <span>EXPLORE CAMPUS RESOURCES</span>
                <FiArrowRight size={18} />
              </Link>
              
              <Link
                to="/login"
                className="bg-blue-900/80 hover:bg-blue-900 text-amber-300 text-sm sm:text-base font-extrabold uppercase px-7 py-3.5 rounded-full shadow-lg transition-all border border-amber-400/40 flex items-center gap-2 cursor-pointer"
              >
                <span>STUDENT / FACULTY LOGIN</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* QUICK STATS COUNTER BAR */}
      <section className="bg-blue-950 text-white py-8 border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="text-3xl sm:text-4xl font-black text-amber-400">45+</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mt-1">High-Tech Computer Labs</div>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="text-3xl sm:text-4xl font-black text-amber-400">12+</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mt-1">Seminar Halls & Auditoriums</div>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="text-3xl sm:text-4xl font-black text-amber-400">3000+</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mt-1">Seating Capacity</div>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="text-3xl sm:text-4xl font-black text-amber-400">100%</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mt-1">Digital Reservation System</div>
          </div>
        </div>
      </section>

      {/* FEATURED CAMPUS RESOURCES SECTION */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-grow w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs font-extrabold text-red-600 dark:text-red-500 uppercase tracking-widest mb-1">
              CAMPUS INFRASTRUCTURE
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-blue-950 dark:text-white uppercase tracking-tight">
              AVAILABLE CAMPUS FACILITIES
            </h2>
          </div>
          
          <Link
            to="/resources"
            className="mt-4 md:mt-0 text-sm font-bold text-red-600 hover:text-red-700 dark:text-red-400 flex items-center gap-1 uppercase tracking-wide group"
          >
            <span>VIEW ALL RESOURCES</span>
            <FiArrowRight className="transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Loading Skeleton Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="glass-card rounded-xl p-5 space-y-4">
                <div className="h-48 skeleton-shimmer rounded-lg w-full" />
                <div className="h-6 skeleton-shimmer rounded w-3/4" />
                <div className="h-4 skeleton-shimmer rounded w-1/2" />
                <div className="h-10 skeleton-shimmer rounded-lg w-full" />
              </div>
            ))}
          </div>
        ) : featuredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredResources.map((resource) => (
              <ResourceCard key={resource._id || resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <FiLayers size={48} className="mx-auto text-slate-400 mb-3" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No Resources Found</h3>
            <p className="text-sm text-slate-500 mt-1">Please make sure the MongoDB backend server is initialized and seeded.</p>
          </div>
        )}

        {/* CAMPUS RESOURCE SYSTEM FEATURES */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-950/50 text-red-600 rounded-lg flex items-center justify-center mb-4 font-bold text-xl">
              <FiClock size={24} />
            </div>
            <h3 className="text-lg font-extrabold text-blue-950 dark:text-white uppercase mb-2">Real-Time Booking</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Check slot availability, request booking dates, and avoid schedule conflicts across departments.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-400 rounded-lg flex items-center justify-center mb-4 font-bold text-xl">
              <FiShield size={24} />
            </div>
            <h3 className="text-lg font-extrabold text-blue-950 dark:text-white uppercase mb-2">Automated Approval</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Requests are logged and verified by department admins with instant notification updates.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/50 text-amber-600 rounded-lg flex items-center justify-center mb-4 font-bold text-xl">
              <FiCheckCircle size={24} />
            </div>
            <h3 className="text-lg font-extrabold text-blue-950 dark:text-white uppercase mb-2">Smart Amenities</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Filter by facility requirement—Projectors, High-Speed WiFi, Air Conditioning, and Audio Systems.
            </p>
          </div>
        </div>
      </main>

      {/* Floating Widgets */}
      <FloatingWidgets />

      <Footer />
    </div>
  );
};

export default Home;