import React from "react";

export const StatusBadge = ({ status }) => {
  const statusConfig = {
    // Bookings
    Pending: {
      text: "Pending",
      classes: "bg-amber-100/80 text-amber-850 border-amber-200/50 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    },
    Approved: {
      text: "Approved",
      classes: "bg-emerald-100/80 text-emerald-850 border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    },
    Rejected: {
      text: "Rejected",
      classes: "bg-rose-100/80 text-rose-850 border-rose-200/50 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    },
    Cancelled: {
      text: "Cancelled",
      classes: "bg-slate-100/80 text-slate-850 border-slate-200/50 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20",
    },
    // Resources
    Available: {
      text: "Available",
      classes: "bg-emerald-100/80 text-emerald-850 border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    },
    Maintenance: {
      text: "Maintenance",
      classes: "bg-amber-100/80 text-amber-850 border-amber-200/50 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    },
    Unavailable: {
      text: "Unavailable",
      classes: "bg-rose-100/80 text-rose-850 border-rose-200/50 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    },
  };

  const config = statusConfig[status] || {
    text: status || "Unknown",
    classes: "bg-slate-100/80 text-slate-850 border-slate-200/50 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.classes}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse"></span>
      {config.text}
    </span>
  );
};

export default StatusBadge;
