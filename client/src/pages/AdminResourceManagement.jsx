import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiEdit, FiTrash2, FiPlus, FiBox, FiSearch, FiRefreshCw, FiAlertTriangle } from "react-icons/fi";
import * as resourceService from "../services/resourceService";
import DashboardLayout from "../layouts/DashboardLayout";
import StatusBadge from "../components/ui/StatusBadge";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import SearchBar from "../components/ui/SearchBar";
import FilterSelect from "../components/ui/FilterSelect";
import Pagination from "../components/ui/Pagination";
import Loader from "../components/ui/Loader";

export const AdminResourceManagement = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Search/Filters State
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const limit = 8;

  // Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = {
        search,
        category,
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
      toast.error("Failed to load campus resources list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [search, category, status, page]);

  const handleOpenDeleteModal = (resource) => {
    setDeleteTarget(resource);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteTarget(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const data = await resourceService.deleteResource(deleteTarget._id);
      if (data.success) {
        toast.success("Resource deleted successfully.");
        fetchResources();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Deletion failed.");
    } finally {
      setDeleting(false);
      handleCloseDeleteModal();
    }
  };

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

  const statusOptions = ["Available", "Maintenance", "Unavailable"];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header Block */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-xs font-black uppercase text-red-600 dark:text-red-400 tracking-widest mb-1">
              RESOURCE CATALOG MANAGEMENT
            </div>
            <h1 className="text-2xl font-black text-blue-950 dark:text-white uppercase tracking-tight">
              MANAGE CAMPUS ASSETS & FACILITIES
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-bold">
              Create, modify, or deactivate auditoriums, laboratories, smart classrooms, and technology assets.
            </p>
          </div>
          <Link to="/admin/resources/create" className="flex-shrink-0">
            <button className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer">
              <FiPlus size={16} />
              <span>CREATE NEW RESOURCE</span>
            </button>
          </Link>
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
              placeholder="Search resource name..."
            />
          </div>
          <div className="w-full md:w-48">
            <FilterSelect
              value={category}
              onChange={(val) => {
                setCategory(val);
                setPage(1);
              }}
              options={categoryOptions}
              defaultLabel="All Types"
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
              setCategory("");
              setStatus("");
              setPage(1);
            }}
            className="p-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-full md:w-auto flex items-center justify-center space-x-1.5 cursor-pointer font-bold text-xs"
          >
            <FiRefreshCw size={14} />
            <span className="block md:hidden">Reset</span>
          </button>
        </div>

        {/* Table/List */}
        {loading ? (
          <Loader />
        ) : resources.length > 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-widest text-[10px] font-black">
                    <th className="py-4 px-6">Resource Name</th>
                    <th className="py-4 px-4">Type</th>
                    <th className="py-4 px-4">Capacity</th>
                    <th className="py-4 px-4">Location</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {resources.map((res) => {
                    const defaultImg = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=150&q=80";
                    return (
                      <tr key={res._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                        <td className="py-4 px-6 flex items-center space-x-3.5">
                          <img
                            src={res.image || defaultImg}
                            alt={res.name}
                            className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                            onError={(e) => { e.target.src = defaultImg; }}
                          />
                          <span className="font-black text-blue-950 dark:text-white text-sm">{res.name}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 rounded bg-blue-900/10 text-blue-900 dark:text-amber-300 font-extrabold text-[10px] uppercase border border-blue-900/20">
                            {res.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-bold text-slate-900 dark:text-slate-100">{res.capacity} seats</td>
                        <td className="py-4 px-4 font-bold">
                          {res.buildingName || "Main Building"}{res.roomNumber ? `, Room ${res.roomNumber}` : ""}
                        </td>
                        <td className="py-4 px-4">
                          <StatusBadge status={res.status} />
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link to={`/admin/resources/edit/${res._id}`}>
                              <button
                                className="p-2 rounded-lg bg-blue-950 hover:bg-blue-900 text-white transition-all cursor-pointer shadow"
                                title="Edit Resource"
                              >
                                <FiEdit size={14} />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleOpenDeleteModal(res)}
                              className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all cursor-pointer shadow"
                              title="Delete Resource"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
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
            <FiBox className="mx-auto text-slate-400 animate-pulse" size={48} />
            <h3 className="text-base font-black text-blue-950 dark:text-white mt-4 uppercase tracking-wider">
              No Resources cataloged
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto font-medium">
              We couldn't find any resources in the workspace matching the selected filters.
            </p>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} title="Confirm Deletion">
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-xs leading-relaxed">
              <FiAlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
              <span>
                <strong>Warning:</strong> You are about to permanently delete <strong>{deleteTarget?.name}</strong>.
                This action will delete all existing schedule slots associated with it, and it cannot be undone.
              </span>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <Button variant="outline" size="sm" onClick={handleCloseDeleteModal}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" loading={deleting} onClick={handleDeleteConfirm}>
                Confirm Delete
              </Button>
            </div>
          </div>
        </Modal>

      </div>
    </DashboardLayout>
  );
};

export default AdminResourceManagement;
