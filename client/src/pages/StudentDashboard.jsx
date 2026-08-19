import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiClock, FiAlertTriangle, FiBook, FiPlus, FiArrowRight } from "react-icons/fi";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { useAuth } from "../context/AuthContext";
import * as bookingService from "../services/bookingService";
import DashboardLayout from "../layouts/DashboardLayout";
import StatusBadge from "../components/ui/StatusBadge";
import Loader from "../components/ui/Loader";

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Statistics State
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await bookingService.getMyBookings();
        if (data.success) {
          const list = data.bookings || [];
          setBookings(list);

          // Calculate statistics
          const total = list.length;
          const pending = list.filter((b) => b.status === "Pending").length;
          const approved = list.filter((b) => b.status === "Approved").length;
          const rejected = list.filter((b) => b.status === "Rejected").length;
          
          setStats({ total, pending, approved, rejected });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Total Bookings",
      value: stats.total,
      icon: FiBook,
      color: "text-blue-900 bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    },
    {
      title: "Pending Approval",
      value: stats.pending,
      icon: FiClock,
      color: "text-amber-700 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    },
    {
      title: "Approved Requests",
      value: stats.approved,
      icon: FiCheckCircle,
      color: "text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    },
    {
      title: "Rejected Requests",
      value: stats.rejected,
      icon: FiAlertTriangle,
      color: "text-red-700 bg-red-100 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800",
    },
  ];

  // Recharts Pie Chart Data
  const chartData = [
    { name: "Pending", value: stats.pending, color: "#f59e0b" },
    { name: "Approved", value: stats.approved, color: "#10b981" },
    { name: "Rejected", value: stats.rejected, color: "#dc2626" },
    { name: "Cancelled", value: stats.total - (stats.pending + stats.approved + stats.rejected), color: "#64748b" },
  ].filter((item) => item.value > 0);

  const defaultChartData = [{ name: "No Bookings", value: 1, color: "#334155" }];
  const useDefaultChart = chartData.length === 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Welcome Banner */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-xs font-black uppercase text-red-600 dark:text-red-400 tracking-widest mb-1">
              STUDENT RESERVATION PORTAL
            </div>
            <h1 className="text-2xl font-black text-blue-950 dark:text-white uppercase tracking-tight">
              WELCOME BACK, {user?.fullName || "STUDENT"}!
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-bold tracking-wide">
              DEPARTMENT: <span className="text-blue-900 dark:text-amber-300">{user?.department || "GENERAL"}</span> · ACADEMIC YEAR: <span className="text-blue-900 dark:text-amber-300">{user?.year ? `YEAR ${user.year}` : "N/A"}</span>
            </p>
          </div>
          <Link to="/resources" className="flex-shrink-0">
            <button className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer">
              <FiPlus size={16} />
              <span>NEW RESERVATION</span>
            </button>
          </Link>
        </div>

        {/* Dashboard Grid Loading */}
        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {statCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] sm:text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                          {card.title}
                        </span>
                        <p className="text-2xl sm:text-3xl font-black text-blue-950 dark:text-white mt-1">
                          {card.value}
                        </p>
                      </div>
                      <div className={`p-3 rounded-xl border ${card.color}`}>
                        <Icon size={20} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dashboard Graphs & Recents */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Recent Bookings Table (8 columns) */}
              <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <h3 className="text-xs font-black text-blue-950 dark:text-white uppercase tracking-wider">
                      RECENT RESERVATION REQUESTS
                    </h3>
                    <Link to="/booking-history" className="inline-flex items-center space-x-1 text-xs font-bold text-red-600 hover:text-red-700 dark:text-amber-400 uppercase tracking-wide">
                      <span>VIEW ALL</span>
                      <FiArrowRight size={14} />
                    </Link>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-semibold border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-widest text-[10px] font-black">
                          <th className="py-3 px-2">Resource</th>
                          <th className="py-3 px-2">Date</th>
                          <th className="py-3 px-2">Timing</th>
                          <th className="py-3 px-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                        {bookings.slice(0, 5).map((booking) => {
                          const dateObj = new Date(booking.startDateTime);
                          const formattedDate = dateObj.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          });
                          const startTime = new Date(booking.startDateTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          });
                          const endTime = new Date(booking.endDateTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          });

                          return (
                            <tr key={booking._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                              <td className="py-3.5 px-2 font-black text-blue-950 dark:text-white">
                                {booking.resource?.name || "Deleted Resource"}
                              </td>
                              <td className="py-3.5 px-2">{formattedDate}</td>
                              <td className="py-3.5 px-2">
                                {startTime} - {endTime}
                              </td>
                              <td className="py-3.5 px-2 text-right">
                                <StatusBadge status={booking.status} />
                              </td>
                            </tr>
                          );
                        })}
                        {bookings.length === 0 && (
                          <tr>
                            <td colSpan="4" className="py-8 text-center text-slate-500 font-bold uppercase tracking-wider">
                              No reservation history recorded yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Status Pie Chart (4 columns) */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center">
                <h3 className="text-xs font-black text-blue-950 dark:text-white uppercase tracking-wider mb-4 self-start border-b border-slate-200 dark:border-slate-800 pb-3 w-full">
                  STATUS BREAKDOWN
                </h3>
                <div className="h-60 w-full relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={useDefaultChart ? defaultChartData : chartData}
                        cx="50%"
                        cy="45%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {(useDefaultChart ? defaultChartData : chartData).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" align="center" iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;