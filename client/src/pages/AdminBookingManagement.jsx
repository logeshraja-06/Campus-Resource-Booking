import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { FiSearch, FiRefreshCw, FiCheckCircle, FiXCircle, FiCalendar, FiThumbsUp, FiThumbsDown, FiAlertCircle } from "react-icons/fi";
import * as bookingService from "../services/bookingService";
import DashboardLayout from "../layouts/DashboardLayout";
import StatusBadge from "../components/ui/StatusBadge";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import SearchBar from "../components/ui/SearchBar";
import FilterSelect from "../components/ui/FilterSelect";
import Pagination from "../components/ui/Pagination";
import InputField from "../components/ui/InputField";
import Loader from "../components/ui/Loader";

export const AdminBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters State
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [page, setPage] = useState(1);
  const limit = 8;

  // Action Modals State
  const [approveTarget, setApproveTarget] = useState(null);
  const [approving, setApproving] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getAllBookings();
      if (data.success) {
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to retrieve campus bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Client Side Filtering
  const filteredBookings = bookings.filter((booking) => {
    const studentName = booking.student?.fullName?.toLowerCase() || "";
    const resourceName = booking.resource?.name?.toLowerCase() || "";
    const matchesSearch =
      studentName.includes(search.toLowerCase()) ||
      resourceName.includes(search.toLowerCase());

    const matchesStatus = status ? booking.status === status : true;

    let matchesDate = true;
    if (bookingDate) {
      const bDateStr = new Date(booking.startDateTime).toISOString().split("T")[0];
      matchesDate = bDateStr === bookingDate;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalCount = filteredBookings.length;
  const totalPages = Math.ceil(totalCount / limit);
  const paginatedBookings = filteredBookings.slice((page - 1) * limit, page * limit);

  // Approve Actions
  const handleOpenApproveModal = (booking) => {
    setApproveTarget(booking);
    setIsApproveModalOpen(true);
  };

  const handleCloseApproveModal = () => {
    setApproveTarget(null);
    setIsApproveModalOpen(false);
  };

  const handleApproveConfirm = async () => {
    if (!approveTarget) return;
    setApproving(true);
    try {
      const data = await bookingService.approveBooking(approveTarget._id);
      if (data.success) {
        toast.success("Booking request approved successfully.");
        fetchBookings();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Approve failed.");
    } finally {
      setApproving(false);
      handleCloseApproveModal();
    }
  };

  // Reject Actions
  const handleOpenRejectModal = (booking) => {
    setRejectTarget(booking);
    setRejectionReason("");
    setIsRejectModalOpen(true);
  };

  const handleCloseRejectModal = () => {
    setRejectTarget(null);
    setIsRejectModalOpen(false);
  };

  const handleRejectConfirm = async (e) => {
    e.preventDefault();
    if (!rejectTarget) return;
    if (!rejectionReason.trim()) {
      toast.error("Please enter a rejection reason.");
      return;
    }
    setRejecting(true);
    try {
      const data = await bookingService.rejectBooking(rejectTarget._id, rejectionReason);
      if (data.success) {
        toast.success("Booking request rejected.");
        fetchBookings();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Rejection failed.");
    } finally {
      setRejecting(false);
      handleCloseRejectModal();
    }
  };

  const statusOptions = ["Pending", "Approved", "Rejected", "Cancelled"];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Title */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-black uppercase text-red-600 dark:text-red-400 tracking-widest mb-1">
            RESERVATION MANAGEMENT
          </div>
          <h1 className="text-2xl font-black text-blue-950 dark:text-white uppercase tracking-tight">
            STUDENT BOOKINGS CONTROL LOG
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-bold">
            Review scheduling requests, approve slots, or decline overlaps with feedback.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={(val) => {
                setSearch(val);
                setPage(1);
              }}
              onClear={() => {
                setSearch("");
                setPage(1);
              }}
              placeholder="Search student or resource name..."
            />
          </div>
          <div className="w-full md:w-44">
            <InputField
              label="Booking Date"
              type="date"
              name="bookingDate"
              value={bookingDate}
              onChange={(e) => {
                setBookingDate(e.target.value);
                setPage(1);
              }}
              className="!mb-0"
            />
          </div>
          <div className="w-full md:w-44">
            <FilterSelect
              value={status}
              onChange={(val) => {
                setStatus(val);
                setPage(1);
              }}
              options={statusOptions}
              defaultLabel="All Statuses"
            />
          </div>
          <button
            onClick={() => {
              setSearch("");
              setStatus("");
              setBookingDate("");
              setPage(1);
            }}
            className="p-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-full md:w-auto flex items-center justify-center space-x-1.5 cursor-pointer font-bold text-xs"
          >
            <FiRefreshCw size={14} />
            <span className="block md:hidden">Reset</span>
          </button>
        </div>

        {/* Table representation */}
        {loading ? (
          <Loader />
        ) : paginatedBookings.length > 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-widest text-[10px] font-black">
                    <th className="py-4 px-6">Student details</th>
                    <th className="py-4 px-4">Resource</th>
                    <th className="py-4 px-4">Booking Date</th>
                    <th className="py-4 px-4">Timing</th>
                    <th className="py-4 px-4">Purpose</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {paginatedBookings.map((booking) => {
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

                    const isPending = booking.status === "Pending";

                    return (
                      <tr key={booking._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                        <td className="py-4 px-6">
                          <div className="font-black text-blue-950 dark:text-white text-sm">
                            {booking.student?.fullName || "Guest Student"}
                          </div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase">
                            {booking.student?.department || "GENERAL"} · Year {booking.student?.year || 1}
                          </div>
                        </td>
                        <td className="py-4 px-4 font-bold text-slate-900 dark:text-slate-100">
                          {booking.resource?.name || (
                            <span className="text-red-500 italic">Deleted Resource</span>
                          )}
                        </td>
                        <td className="py-4 px-4 font-bold">{formattedDate}</td>
                        <td className="py-4 px-4 font-bold">
                          {startTime} - {endTime}
                        </td>
                        <td className="py-4 px-4 max-w-xs truncate" title={booking.purpose}>
                          {booking.purpose}
                        </td>
                        <td className="py-4 px-4">
                          <StatusBadge status={booking.status} />
                        </td>
                        <td className="py-4 px-6 text-right">
                          {isPending ? (
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleOpenApproveModal(booking)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase shadow transition-all cursor-pointer flex items-center gap-1"
                                title="Approve Reservation"
                              >
                                <FiThumbsUp size={14} />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => handleOpenRejectModal(booking)}
                                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase shadow transition-all cursor-pointer flex items-center gap-1"
                                title="Reject Reservation"
                              >
                                <FiThumbsDown size={14} />
                                <span>Decline</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-600 text-xs font-bold">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="py-4 border-t border-slate-200 dark:border-slate-800">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(pageNum) => setPage(pageNum)}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <FiCalendar className="mx-auto text-slate-400 animate-pulse" size={48} />
            <h3 className="text-base font-black text-blue-950 dark:text-white mt-4 uppercase tracking-wider">
              No Booking Log Entries
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto font-medium">
              No student scheduling requests match the current selection filters.
            </p>
          </div>
        )}

        {/* Approve Confirm Modal */}
        <Modal
          isOpen={isApproveModalOpen}
          onClose={handleCloseApproveModal}
          title="Approve Reservation Slot"
        >
          <div className="space-y-4">
            <p className="text-sm">
              Are you sure you want to <strong>APPROVE</strong> the booking for{" "}
              <strong>{approveTarget?.resource?.name}</strong> by student{" "}
              <strong>{approveTarget?.student?.fullName}</strong>?
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <Button variant="outline" size="sm" onClick={handleCloseApproveModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                loading={approving}
                onClick={handleApproveConfirm}
              >
                Confirm Approve
              </Button>
            </div>
          </div>
        </Modal>

        {/* Reject Dialog Reason Modal */}
        <Modal
          isOpen={isRejectModalOpen}
          onClose={handleCloseRejectModal}
          title="Decline Reservation Request"
        >
          <form onSubmit={handleRejectConfirm} className="space-y-4">
            <p className="text-sm">
              Provide a reason for declining the reservation request for{" "}
              <strong>{rejectTarget?.resource?.name}</strong> by student{" "}
              <strong>{rejectTarget?.student?.fullName}</strong>:
            </p>
            
            <InputField
              label="Rejection Reason"
              type="text"
              name="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Schedule overlaps with exam period"
              required
            />

            <div className="flex justify-end space-x-3 pt-2">
              <Button variant="outline" size="sm" onClick={handleCloseRejectModal}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                type="submit"
                loading={rejecting}
              >
                Decline Request
              </Button>
            </div>
          </form>
        </Modal>

      </div>
    </DashboardLayout>
  );
};

export default AdminBookingManagement;
