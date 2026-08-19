import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { FiSearch, FiRefreshCw, FiTrash2, FiCalendar, FiAlertCircle } from "react-icons/fi";
import * as bookingService from "../services/bookingService";
import DashboardLayout from "../layouts/DashboardLayout";
import StatusBadge from "../components/ui/StatusBadge";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import SearchBar from "../components/ui/SearchBar";
import FilterSelect from "../components/ui/FilterSelect";
import Pagination from "../components/ui/Pagination";
import Loader from "../components/ui/Loader";

export const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const limit = 8;

  // Cancellation Modal State
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getMyBookings();
      if (data.success) {
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load booking history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Client Side Filtering
  const filteredBookings = bookings.filter((booking) => {
    const resourceName = booking.resource?.name?.toLowerCase() || "";
    const matchesSearch = resourceName.includes(search.toLowerCase());
    const matchesStatus = status ? booking.status === status : true;
    return matchesSearch && matchesStatus;
  });

  // Client Side Pagination
  const totalCount = filteredBookings.length;
  const totalPages = Math.ceil(totalCount / limit);
  const paginatedBookings = filteredBookings.slice((page - 1) * limit, page * limit);

  const handleOpenCancelModal = (booking) => {
    setSelectedBooking(booking);
    setIsCancelModalOpen(true);
  };

  const handleCloseCancelModal = () => {
    setSelectedBooking(null);
    setIsCancelModalOpen(false);
  };

  const handleCancelConfirm = async () => {
    if (!selectedBooking) return;
    setCancelLoading(true);
    try {
      const data = await bookingService.cancelBooking(selectedBooking._id);
      if (data.success) {
        toast.success("Booking cancelled successfully.");
        fetchBookings();
      }
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || "Failed to cancel booking.";
      toast.error(errMsg);
    } finally {
      setCancelLoading(false);
      handleCloseCancelModal();
    }
  };

  const statusOptions = ["Pending", "Approved", "Rejected", "Cancelled"];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Title */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-black uppercase text-red-600 dark:text-red-400 tracking-widest mb-1">
            PERSONAL RESERVATIONS
          </div>
          <h1 className="text-2xl font-black text-blue-950 dark:text-white uppercase tracking-tight">
            MY BOOKING HISTORY & STATUS LOG
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-bold">
            Track real-time approval status, review booking details, or cancel upcoming reservation slots.
          </p>
        </div>

        {/* Filter controls */}
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
              placeholder="Search by resource name..."
            />
          </div>
          <div className="w-full md:w-48">
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
              setPage(1);
            }}
            className="p-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-full md:w-auto flex items-center justify-center space-x-1.5 cursor-pointer font-bold text-xs"
          >
            <FiRefreshCw size={14} />
            <span className="block md:hidden">Reset</span>
          </button>
        </div>

        {/* Bookings Table */}
        {loading ? (
          <Loader />
        ) : paginatedBookings.length > 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-widest text-[10px] font-black">
                    <th className="py-4 px-6">Resource</th>
                    <th className="py-4 px-4">Date</th>
                    <th className="py-4 px-4">Timing</th>
                    <th className="py-4 px-4">Purpose</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4">Approval Info / Reason</th>
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

                    // Cancellable states: Pending, Approved
                    const isCancellable = ["Pending", "Approved"].includes(booking.status);

                    return (
                      <tr key={booking._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                        <td className="py-4 px-6 font-black text-blue-950 dark:text-white">
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
                        <td className="py-4 px-4 max-w-xs truncate">
                          {booking.status === "Approved" ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">Approved by Admin</span>
                          ) : booking.status === "Rejected" ? (
                            <span className="text-red-600 dark:text-red-400 font-bold italic" title={booking.rejectionReason}>
                              Reason: {booking.rejectionReason || "None provided"}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          {isCancellable ? (
                            <button
                              onClick={() => handleOpenCancelModal(booking)}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all text-xs font-black uppercase shadow cursor-pointer flex items-center gap-1 ml-auto"
                              title="Cancel booking slot"
                            >
                              <FiTrash2 size={12} />
                              <span>Cancel</span>
                            </button>
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

            {/* Pagination Controls */}
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
              No Bookings Found
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto font-medium">
              We couldn't locate any reservations matching the current criteria.
            </p>
          </div>
        )}

        {/* Cancellation Confirmation Modal */}
        <Modal
          isOpen={isCancelModalOpen}
          onClose={handleCloseCancelModal}
          title="Cancel Reservation Slot"
        >
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3.5 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-lg text-xs leading-relaxed">
              <FiAlertCircle size={22} className="flex-shrink-0 mt-0.5 text-amber-500" />
              <span>
                <strong>Warning:</strong> You are about to cancel your reservation for{" "}
                <strong>{selectedBooking?.resource?.name}</strong> scheduled on{" "}
                <strong>
                  {selectedBooking &&
                    new Date(selectedBooking.startDateTime).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                </strong>
                . This action will release the slot for other students and cannot be undone.
              </span>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <Button variant="outline" size="sm" onClick={handleCloseCancelModal}>
                Keep Booking
              </Button>
              <Button
                variant="danger"
                size="sm"
                loading={cancelLoading}
                onClick={handleCancelConfirm}
              >
                Yes, Cancel Slot
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default BookingHistory;