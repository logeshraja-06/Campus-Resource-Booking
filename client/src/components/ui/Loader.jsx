import React from "react";

export const Loader = ({ fullScreen = false, size = "md" }) => {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-12 w-12 border-4",
    lg: "h-16 w-16 border-4",
  };

  const loaderContent = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div
        className={`animate-spin rounded-full border-slate-300 dark:border-navy-700 border-t-cyan-500 ${sizeClasses[size]}`}
      ></div>
      <p className="text-xs font-semibold text-slate-500 dark:text-cyan-400 animate-pulse tracking-wider uppercase">
        Loading...
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-100/60 dark:bg-navy-950/80 backdrop-blur-md">
        {loaderContent}
      </div>
    );
  }

  return <div className="p-8 flex justify-center items-center w-full">{loaderContent}</div>;
};

export default Loader;
