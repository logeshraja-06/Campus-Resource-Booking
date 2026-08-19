import React from "react";
import { Link } from "react-router-dom";
import { FiMapPin, FiUsers, FiArrowRight, FiCheckCircle } from "react-icons/fi";

export const ResourceCard = ({ resource }) => {
  const {
    _id,
    name,
    category,
    buildingName,
    roomNumber,
    capacity,
    facilities = [],
    image,
    status,
    department,
  } = resource;

  const defaultImg = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80";

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full group border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300">
      {/* Image Container with Badges */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-900 flex-shrink-0">
        <img
          src={image || defaultImg}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.src = defaultImg;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md ${
              status === "Available"
                ? "bg-emerald-600 text-white"
                : status === "Maintenance"
                ? "bg-amber-500 text-slate-950"
                : "bg-red-600 text-white"
            }`}
          >
            {status || "Available"}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-blue-900/90 text-amber-300 text-[11px] font-black uppercase tracking-wider border border-blue-400/40 backdrop-blur-md shadow-md">
          {category}
        </div>
      </div>

      {/* Details Area */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-2">
          <div className="text-[10px] font-extrabold uppercase text-red-600 dark:text-red-400 tracking-widest">
            {department ? `${department} DEPARTMENT` : "CAMPUS FACILITY"}
          </div>

          <h3 className="text-lg font-black text-blue-950 dark:text-white line-clamp-1 group-hover:text-red-600 transition-colors">
            {name}
          </h3>

          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-350 font-semibold pt-1">
            <div className="flex items-center space-x-2">
              <FiMapPin className="text-red-600 dark:text-red-400 flex-shrink-0" />
              <span>{buildingName || "Main Building"}{roomNumber ? `, Room ${roomNumber}` : ""}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FiUsers className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <span>Capacity: <strong className="text-slate-900 dark:text-white">{capacity} Seats</strong></span>
            </div>
          </div>

          {/* Facility Pills */}
          {facilities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {facilities.slice(0, 3).map((fac, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1"
                >
                  <FiCheckCircle size={10} className="text-emerald-500" />
                  {fac}
                </span>
              ))}
              {facilities.length > 3 && (
                <span className="px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950/40 text-[10px] font-bold text-red-700 dark:text-red-400">
                  +{facilities.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2 mt-auto">
          <Link to={`/resources/${_id}`}>
            <button className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-red-600 text-white text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-md group-hover:shadow-lg cursor-pointer">
              <span>VIEW DETAILS & BOOK</span>
              <FiArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
