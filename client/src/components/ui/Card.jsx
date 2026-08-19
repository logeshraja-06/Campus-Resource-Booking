import React from "react";

export const Card = ({ children, className = "", hover = false, ...props }) => {
  return (
    <div
      className={`glass-card rounded-xl p-6 transition-all duration-300 ${
        hover ? "hover:scale-[1.01] hover:-translate-y-1 hover:border-cyan-500/30" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
