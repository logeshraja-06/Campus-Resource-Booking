import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FiClock,
  FiMapPin,
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiActivity,
  FiCalendar,
  FiBookOpen,
  FiChevronLeft,
  FiInfo,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import * as resourceService from "../services/resourceService";
import * as bookingService from "../services/bookingService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";

export const ResourceDetails = () => {
  const { id } = useParams();
  const { isAuthenticated, role, user } = useAuth();
  const navigate = useNavigate();

  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchResourceDetails = async () => {
      try {
        const data = await resourceService.getResourceById(id);
        if (data.success) {
          setResource(data.resource);
        } else {
          toast.error("Resource details could not be retrieved.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error loading resource details.");
      } finally {
        setLoading(false);
      }
    };

    fetchResourceDetails();
  }, [id]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingDate || !startTime || !endTime || !purpose.trim()) {
      toast.error("Please fill in all booking fields.");
      return;
    }

    const startDateTime = new Date(`${bookingDate}T${startTime}`);
    const endDateTime = new Date(`${bookingDate}T${endTime}`);
    const now = new Date();

    if (startDateTime < now) {
      toast.error("Past booking dates and times are not allowed.");
      return;
    }

    if (startDateTime >= endDateTime) {
      toast.error("End time must be after the start time.");
      return;
    }

    const durationHours = (endDateTime - startDateTime) / (1000 * 60 * 60);
    if (durationHours > 8) {
      toast.error("Maximum booking duration is 8 hours.");
      return;
    }

    setBookingLoading(true);
    try {
      const payload = {
        resource: id,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        purpose,
      };

      const data = await bookingService.createBooking(payload);
      if (data.success) {
        toast.success("Booking Request Submitted Successfully!");
        // Clear fields
        setBookingDate("");
        setStartTime("");
        setEndTime("");
        setPurpose("");
        // Redirect to booking history page
        navigate("/booking-history");
      }
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || "Booking creation failed.";
      toast.error(errMsg);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
          <FiXCircle size={48} className="text-red-500 mb-4 animate-bounce" />
          <h2 className="text-xl font-bold">Resource Not Found</h2>
          <p className="text-sm text-slate-500 mt-2">The requested resource could not be located in our database.</p>
          <Link to="/resources" className="mt-6">
            <Button variant="primary">Back to Resources</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const {
    name,
    category,
    buildingName,
    floorNumber,
    roomNumber,
    capacity,
    facilities = [],
    image,
    description,
    department,
    openingTime = "08:00",
    closingTime = "18:00",
    maxDuration = 8,
    approvalRequired,
    status,
  } = resource;

  const defaultImg = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
        
        {/* Back Link */}
        <Link
          to="/resources"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400 mb-6 transition-colors"
        >
          <FiChevronLeft size={16} />
          <span>Back to Browse Catalog</span>
        </Link>

        {/* Grid Setup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Block: Resource Show Info (7 columns) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Image Box */}
            <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden border border-slate-200/50 dark:border-navy-700/50 shadow-md">
              <img
                src={image || defaultImg}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = defaultImg;
                }}
              />
              <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-[#05070c]/70 text-xs font-bold text-cyan-400 uppercase tracking-widest border border-cyan-400/20 backdrop-blur-xs">
                  {category}
                </span>
                {department && (
                  <span className="px-3 py-1.5 rounded-lg bg-[#05070c]/70 text-xs font-bold text-white uppercase tracking-widest border border-white/10 backdrop-blur-xs">
                    {department}
                  </span>
                )}
              </div>
            </div>

            {/* General Specs */}
            <Card className="border border-slate-200/50 dark:border-navy-900/50 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200/50 dark:border-navy-800/50 pb-4 gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                    {name}
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-1.5 flex items-center space-x-1.5">
                    <FiMapPin className="text-cyan-500" />
                    <span>{buildingName || "Main Campus"} · Floor {floorNumber} · Room {roomNumber}</span>
                  </p>
                </div>
                <div className="flex-shrink-0 flex items-center space-x-1.5 px-3 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-lg text-xs font-bold border border-cyan-500/20">
                  <FiUsers />
                  <span>{capacity} Seats</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                  Description
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                  {description || "No description provided for this resource."}
                </p>
              </div>

              {/* Time slots & specs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-200/50 dark:border-navy-800/50">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Opening Time</span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                    <FiClock className="text-cyan-500" />
                    <span>{openingTime}</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Closing Time</span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                    <FiClock className="text-cyan-500" />
                    <span>{closingTime}</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Max Duration</span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {maxDuration} Hours
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Requires Approval</span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {approvalRequired ? (
                      <span className="text-cyan-500">Yes</span>
                    ) : (
                      <span className="text-emerald-500">No (Auto-approved)</span>
                    )}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</span>
                  <div className="pt-0.5">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                      status === "Available"
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : status === "Maintenance"
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        : "bg-red-500/10 text-red-500 border-red-500/20"
                    }`}>
                      {status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Facilities */}
              {facilities.length > 0 && (
                <div className="space-y-3 pt-6 border-t border-slate-200/50 dark:border-navy-800/50">
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                    Available Facilities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {facilities.map((fac, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-navy-850 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-800 font-semibold flex items-center space-x-1.5"
                      >
                        <FiCheckCircle className="text-cyan-500" />
                        <span>{fac}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right Block: Booking Form Panel (5 columns) */}
          <div className="lg:col-span-5">
            {role === "admin" ? (
              <Card className="border border-slate-200/50 dark:border-navy-900/50 text-center py-8 space-y-4">
                <FiInfo className="mx-auto text-cyan-500 animate-pulse" size={32} />
                <h3 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                  Admin Dashboard View
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold max-w-xs mx-auto leading-relaxed">
                  As an administrator, you cannot book resources. Use the Manage Resources tab to edit, deactivate, or review booking slots.
                </p>
                <Link to="/admin-dashboard" className="block pt-2">
                  <Button variant="outline" size="sm">Go to Dashboard</Button>
                </Link>
              </Card>
            ) : !isAuthenticated ? (
              <Card className="border border-slate-200/50 dark:border-navy-900/50 text-center py-8 space-y-4">
                <FiInfo className="mx-auto text-cyan-500" size={32} />
                <h3 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                  Authentication Required
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold max-w-xs mx-auto leading-relaxed">
                  You must be logged in as a student to schedule reservations for this resource.
                </p>
                <Link to="/login" className="block pt-2">
                  <Button variant="primary" size="sm">Sign In Now</Button>
                </Link>
              </Card>
            ) : status !== "Available" ? (
              <Card className="border border-red-500/10 dark:border-red-500/20 text-center py-8 bg-red-500/5 space-y-4 rounded-xl">
                <FiXCircle className="mx-auto text-red-500" size={36} />
                <h3 className="text-base font-bold text-red-500 uppercase tracking-wider">
                  Resource Unavailable
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold max-w-xs mx-auto leading-relaxed">
                  This resource is currently under maintenance or has been deactivated. Booking is disabled.
                </p>
              </Card>
            ) : (
              <Card className="border border-slate-200/50 dark:border-navy-900/50 shadow-lg">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-6 uppercase tracking-wider border-b border-slate-200/50 dark:border-navy-800/50 pb-3 flex items-center space-x-2">
                  <FiCalendar className="text-cyan-500" />
                  <span>Reserve Resource</span>
                </h3>

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <InputField
                    label="Booking Date"
                    type="date"
                    name="bookingDate"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="Start Time"
                      type="time"
                      name="startTime"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />
                    <InputField
                      label="End Time"
                      type="time"
                      name="endTime"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                      Purpose of Booking
                    </label>
                    <textarea
                      rows="3"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      placeholder="e.g. Conduct CSE Practical Exam / Club Meeting"
                      required
                      className="block w-full py-2.5 px-3 border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 text-sm transition-all"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      loading={bookingLoading}
                      className="w-full py-3"
                    >
                      Submit Reservation
                    </Button>
                  </div>
                </form>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResourceDetails;
