import React from "react";

export const SkeletonCard = () => {
  return (
    <div className="glass-card rounded-xl overflow-hidden border border-slate-200/50 dark:border-navy-700/50 animate-pulse">
      <div className="h-48 bg-slate-250 dark:bg-navy-800 w-full"></div>
      <div className="p-5 space-y-3.5">
        <div className="h-5 bg-slate-250 dark:bg-navy-800 rounded w-2/3"></div>
        <div className="h-4 bg-slate-250 dark:bg-navy-800 rounded w-1/2"></div>
        <div className="space-y-2 pt-2">
          <div className="h-3.5 bg-slate-250 dark:bg-navy-800 rounded w-full"></div>
          <div className="h-3.5 bg-slate-250 dark:bg-navy-800 rounded w-5/6"></div>
        </div>
        <div className="h-10 bg-slate-250 dark:bg-navy-800 rounded-lg w-full mt-4"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
