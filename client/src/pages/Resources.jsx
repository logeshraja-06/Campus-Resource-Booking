import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiRefreshCw, FiBookOpen } from "react-icons/fi";
import * as resourceService from "../services/resourceService";
import ResourceCard from "../components/ResourceCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SearchBar from "../components/ui/SearchBar";
import FilterSelect from "../components/ui/FilterSelect";
import Pagination from "../components/ui/Pagination";
import SkeletonCard from "../components/ui/SkeletonCard";
import EmptyState from "../components/ui/EmptyState";
import ScrollToTop from "../components/ui/ScrollToTop";

export const Resources = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  // Get initial values from URL search params
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [department, setDepartment] = useState(searchParams.get("department") || "");
  const [building, setBuilding] = useState(searchParams.get("building") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const limit = 6;

  // Resource options
  const categoryOptions = [
    "Seminar Hall",
    "Computer Lab",
    "Physics Lab",
    "Chemistry Lab",
    "Smart Classroom",
    "Projector",
    "Auditorium",
    "Sports Ground",
    "Classroom",
    "Meeting Room",
  ];

  const departmentOptions = [
    "CSE",
    "ECE",
    "EEE",
    "MECH",
    "CIVIL",
    "Physics",
    "Chemistry",
    "General",
  ];

  const buildingOptions = [
    "Ramanujan Block",
    "Einstein Block",
    "Newton Block",
    "Admin Block",
    "Main Building",
    "PG Block",
  ];

  const statusOptions = ["Available", "Maintenance", "Unavailable"];

  // Fetch resources with filters
  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search,
        category,
        department,
        buildingName: building,
        status,
        page,
        limit,
        sort: "newest",
      };
      
      const data = await resourceService.getResources(params);
      if (data.success) {
        setResources(data.resources || []);
        setTotalCount(data.total || 0);
        setTotalPages(data.pages || 1);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load resources. Try again.");
    } finally {
      setLoading(false);
    }
  }, [search, category, department, building, status, page]);

  // Sync state filters to search URL params
  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (department) params.department = department;
    if (building) params.building = building;
    if (status) params.status = status;
    if (page > 1) params.page = page;

    setSearchParams(params);
    fetchResources();
  }, [search, category, department, building, status, page, setSearchParams, fetchResources]);

  // Reset filters
  const handleResetFilters = () => {
    setSearch("");
    setCategory("");
    setDepartment("");
    setBuilding("");
    setStatus("");
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
        
        {/* Glow Spheres */}
        <div className="glow-bg top-[10%] left-[2%] opacity-40"></div>
        <div className="glow-bg-blue bottom-[10%] right-[2%] opacity-40"></div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Explore Campus Resources
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search and book computer labs, seminar halls, auditoriums, and other tools instantly.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="glass-panel p-6 rounded-xl border border-slate-200/50 dark:border-navy-900/50 shadow-xs mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            
            {/* Search Input */}
            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                Search
              </label>
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

            {/* Category Filter */}
            <div className="md:col-span-2">
              <FilterSelect
                label="Resource Type"
                value={category}
                onChange={(val) => {
                  setCategory(val);
                  setPage(1);
                }}
                options={categoryOptions}
              />
            </div>

            {/* Department Filter */}
            <div className="md:col-span-2">
              <FilterSelect
                label="Department"
                value={department}
                onChange={(val) => {
                  setDepartment(val);
                  setPage(1);
                }}
                options={departmentOptions}
              />
            </div>

            {/* Building Filter */}
            <div className="md:col-span-2">
              <FilterSelect
                label="Building"
                value={building}
                onChange={(val) => {
                  setBuilding(val);
                  setPage(1);
                }}
                options={buildingOptions}
              />
            </div>

            {/* Status Filter */}
            <div className="md:col-span-2">
              <FilterSelect
                label="Status"
                value={status}
                onChange={(val) => {
                  setStatus(val);
                  setPage(1);
                }}
                options={statusOptions}
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200/50 dark:border-navy-800/50 pt-4 flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Showing {resources.length} of {totalCount} matching resources
            </span>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center space-x-2 text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors py-2 px-3 hover:bg-rose-500/10 rounded-lg cursor-pointer"
            >
              <FiRefreshCw size={14} className="animate-spin-slow" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: limit }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : resources.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {resources.map((resource) => (
                <ResourceCard key={resource._id} resource={resource} />
              ))}
            </div>
            
            {/* Pagination */}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(pageNum) => setPage(pageNum)}
            />
          </>
        ) : (
          <EmptyState
            title="No Resources Found"
            message="No campus resources matched your current selection filters. Try resetting or adjusting criteria."
            actionText="Reset Filters"
            onAction={handleResetFilters}
            icon={FiBookOpen}
          />
        )}
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Resources;