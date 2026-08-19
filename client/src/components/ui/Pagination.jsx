import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-slate-300 dark:border-navy-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors cursor-pointer"
      >
        <FiChevronLeft size={16} />
      </button>

      <div className="flex items-center space-x-1.5">
        {Array.from({ length: totalPages }, (_, idx) => {
          const pageNum = idx + 1;
          const isCurrent = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all border cursor-pointer ${
                isCurrent
                  ? "bg-cyan-500 border-cyan-500 text-white shadow-md shadow-cyan-500/20"
                  : "border-slate-300 dark:border-navy-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-navy-800"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-slate-300 dark:border-navy-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors cursor-pointer"
      >
        <FiChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
