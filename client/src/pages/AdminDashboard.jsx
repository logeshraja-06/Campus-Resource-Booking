import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FiBox,
  FiActivity,
  FiBookOpen,
  FiClock,
  FiCheckCircle,
  FiUsers,
  FiPlus,
  FiSettings,
  FiList,
  FiThumbsUp,
  FiThumbsDown,
} from "react-icons/fi";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import * as bookingService from "../services/bookingService";
import * as resourceService from "../services/resourceService";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Rejection Dialog State
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  // Approval Modal State
  const [approveTarget, setApproveTarget] = useState(null);
  const [approving, setApproving] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await bookingService.getDashboardStats();
      const bookingsRes = await bookingService.getAllBookings();
      const resourcesRes = await resourceService.getResources({ limit: 1000 });

      if (statsRes.success) {
        setStats(statsRes.stats);
      }
      if (bookingsRes.success) {
        setBookings(bookingsRes.bookings || []);
      }
      if (resourcesRes.success) {
        setResources(resourcesRes.resources || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch dashboard metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApproveClick = (booking) => {
    setApproveTarget(booking);
    setIsApproveModalOpen(true);
  };

  const handleApproveConfirm = async () => {
    if (!approveTarget) return;
    setApproving(true);
    try {
      const data = await bookingService.approveBooking(approveTarget._id);
      if (data.success) {
        toast.success("Booking approved successfully.");
        fetchDashboardData();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Approve request failed.");
    } finally {
      setApproving(false);
      setIsApproveModalOpen(false);
      setApproveTarget(null);
    }
  };

  const handleRejectClick = (booking) => {
    setSelectedBooking(booking);
    setRejectionReason("");
    setIsRejectModalOpen(true);
  };

  const handleRejectConfirm = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;
    if (!rejectionReason.trim()) {
      toast.error("Please enter a reason for rejection.");
      return;
    }
    setRejecting(true);
    try {
      const data = await bookingService.rejectBooking(selectedBooking._id, rejectionReason);
      if (data.success) {
        toast.success("Booking rejected.");
        fetchDashboardData();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Reject request failed.");
    } finally {
      setRejecting(false);
      setIsRejectModalOpen(false);
      setSelectedBooking(null);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  // Calculate Available Resources
  const totalResourcesCount = resources.length;
  const availableResourcesCount = resources.filter((r) => r.status === "Available").length;

  const statCards = [
    {
      title: "Total Resources",
      value: totalResourcesCount || stats?.totalResources || 0,
      icon: FiBox,
      color: "text-blue-900 bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    },
    {
      title: "Available Facilities",
      value: availableResourcesCount,
      icon: FiCheckCircle,
      color: "text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    },
    {
      title: "Total Bookings",
      value: stats?.totalBookings || 0,
      icon: FiBookOpen,
      color: "text-amber-700 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    },
    {
      title: "Pending Approvals",
      value: stats?.pendingBookings || 0,
      icon: FiClock,
      color: "text-red-700 bg-red-100 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800",
    },
    {
      title: "Total Students",
      value: stats?.totalStudents || 0,
      icon: FiUsers,
      color: "text-indigo-900 bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    },
  ];

  // Recharts Pie Chart (Booking Status Breakdown)
  const statusPieData = [
    { name: "Pending", value: stats?.pendingBookings || 0, color: "#f59e0b" },
    { name: "Approved", value: stats?.approvedBookings || 0, color: "#10b981" },
    { name: "Rejected", value: stats?.rejectedBookings || 0, color: "#dc2626" },
  ].filter((item) => item.value > 0);

  // Recharts Bar Chart (Resource Count per Category)
  const categoriesMap = {};
  resources.forEach((r) => {
    categoriesMap[r.category] = (categoriesMap[r.category] || 0) + 1;
  });
  const categoryBarData = Object.keys(categoriesMap).map((catName) => ({
    name: catName,
    count: categoriesMap[catName],
  }));

  const pendingBookingsQueue = bookings.filter((b) => b.status === "Pending");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header Banner */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-xs font-black uppercase text-red-600 dark:text-red-400 tracking-widest mb-1">
              SYSTEM CONTROL CENTER
            </div>
            <h1 className="text-2xl font-black text-blue-950 dark:text-white uppercase tracking-tight">
              ADMINISTRATOR DASHBOARD
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-bold">
              Manage campus infrastructure, approve reservation requests, and control facility access.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to="/admin/resources/create">
              <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer">
                <FiPlus size={16} />
                <span>ADD RESOURCE</span>
              </button>
            </Link>
            <Link to="/admin/resources">
              <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-amber-300 text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer">
                <FiSettings size={14} />
                <span>MANAGE CATALOG</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      {card.title}
                    </span>
                    <p className="text-2xl font-black text-blue-950 dark:text-white mt-1">
                      {card.value}
                    </p>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${card.color}`}>
                    <Icon size={18} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Graphs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center">
            <h3 className="text-xs font-black text-blue-950 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-slate-800 pb-3 w-full self-start">
              RESERVATION STATUS SPLIT
            </h3>
            {statusPieData.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusPieData}
                      cx="50%"
                      cy="45%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {statusPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" align="center" iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-slate-500 py-24 text-xs uppercase font-bold tracking-wider">No bookings recorded.</p>
            )}
          </div>

          {/* Bar Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-black text-blue-950 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-slate-800 pb-3 w-full">
              RESOURCES BY CATEGORY
            </h3>
            {categoryBarData.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#dc2626" radius={[4, 4, 0, 0]}>
                      {categoryBarData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#dc2626" : "#1e3a8a"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-slate-500 py-24 text-center text-xs uppercase font-bold tracking-wider">No resources cataloged.</p>
            )}
          </div>
        </div>

        {/* Pending Requests Queue */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
            <h3 className="text-xs font-black text-blue-950 dark:text-white uppercase tracking-wider">
              PENDING BOOKING APPROVALS QUEUE
            </h3>
            <Link to="/admin/bookings" className="inline-flex items-center space-x-1.5 text-xs font-bold text-red-600 hover:text-red-700 dark:text-amber-400 uppercase tracking-wide">
              <FiList />
              <span>FULL LOG</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-widest text-[10px] font-black">
                  <th className="py-3.5 px-3">Student</th>
                  <th className="py-3.5 px-3">Resource</th>
                  <th className="py-3.5 px-3">Timing</th>
                  <th className="py-3.5 px-3">Purpose</th>
                  <th className="py-3.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {pendingBookingsQueue.slice(0, 5).map((booking) => {
                  const startTime = new Date(booking.startDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                  const endTime = new Date(booking.endDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                  const date = new Date(booking.startDateTime).toLocaleDateString();

                  return (
                    <tr key={booking._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 px-3">
                        <div className="font-black text-blue-950 dark:text-white">{booking.student?.fullName || "Guest User"}</div>
                        <div className="text-[10px] text-slate-500 font-bold">{booking.student?.department || "GENERAL"} · Yr {booking.student?.year || 1}</div>
                      </td>
                      <td className="py-4 px-3 font-bold text-slate-800 dark:text-slate-200">
                        {booking.resource?.name || "Deleted Resource"}
                      </td>
                      <td className="py-4 px-3">
                        <div>{date}</div>
                        <div className="text-[10px] text-slate-500 font-bold">{startTime} - {endTime}</div>
                      </td>
                      <td className="py-4 px-3 max-w-xs truncate" title={booking.purpose}>{booking.purpose}</td>
                      <td className="py-4 px-3 text-right flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleApproveClick(booking)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-black uppercase transition-all cursor-pointer shadow"
                          title="Approve Request"
                        >
                          <FiThumbsUp size={14} />
                        </button>
                        <button
                          onClick={() => handleRejectClick(booking)}
                          className="px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs font-black uppercase transition-all cursor-pointer shadow"
                          title="Reject Request"
                        >
                          <FiThumbsDown size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {pendingBookingsQueue.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-500 font-bold uppercase tracking-wider">
                      No pending approvals in queue.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Approval Modal */}
        <Modal isOpen={isApproveModalOpen} onClose={() => setIsApproveModalOpen(false)} title="Confirm Approval">
          <div className="space-y-4">
            <p className="text-sm">
              Are you sure you want to <strong>APPROVE</strong> the reservation for{" "}
              <strong>{approveTarget?.resource?.name}</strong> by <strong>{approveTarget?.student?.fullName}</strong>?
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setIsApproveModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" loading={approving} onClick={handleApproveConfirm}>
                Confirm Approve
              </Button>
            </div>
          </div>
        </Modal>

        {/* Rejection Modal */}
        <Modal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} title="Decline Reservation">
          <form onSubmit={handleRejectConfirm} className="space-y-4">
            <p className="text-sm">
              Please specify a reason for declining the reservation request for{" "}
              <strong>{selectedBooking?.resource?.name}</strong> by <strong>{selectedBooking?.student?.fullName}</strong>:
            </p>
            <div>
              <InputField
                label="Reason for Rejection"
                type="text"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Conflict with examination schedule / Maintenance"
                required
              />
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setIsRejectModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" type="submit" loading={rejecting}>
                Decline Request
              </Button>
            </div>
          </form>
        </Modal>

      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;