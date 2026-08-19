import React from "react";
import { FiInbox } from "react-icons/fi";
import { Button } from "./Button";

export const EmptyState = ({
  title = "No data found",
  message = "Try adjusting your filters or search term.",
  actionText,
  onAction,
  icon: Icon = FiInbox,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center glass-panel rounded-xl max-w-md mx-auto my-8 border border-slate-200/50 dark:border-navy-700/50 shadow-md">
      <div className="p-4 bg-slate-100 dark:bg-navy-800 rounded-full text-slate-400 dark:text-cyan-400 mb-4">
        <Icon size={36} />
      </div>
      <h3 className="text-base font-bold text-slate-850 dark:text-white mb-2 uppercase tracking-wide">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-xs leading-relaxed">
        {message}
      </p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
