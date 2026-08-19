import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiChevronLeft } from "react-icons/fi";
import * as resourceService from "../services/resourceService";
import DashboardLayout from "../layouts/DashboardLayout";
import ResourceForm from "../components/ResourceForm";

export const CreateResource = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    try {
      const data = await resourceService.createResource(formData);
      if (data.success) {
        toast.success("Resource created successfully.");
        navigate("/admin/resources");
      } else {
        toast.error(data.message || "Failed to create resource.");
      }
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || "Server error while creating resource.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Back navigation */}
        <Link
          to="/admin/resources"
          className="inline-flex items-center space-x-1.5 text-xs font-black text-red-600 hover:text-red-700 dark:text-amber-400 uppercase tracking-wide transition-colors"
        >
          <FiChevronLeft size={16} />
          <span>BACK TO RESOURCE MANAGEMENT</span>
        </Link>

        {/* Title Banner */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-black uppercase text-red-600 dark:text-red-400 tracking-widest mb-1">
            RESOURCE REGISTRATION FORM
          </div>
          <h1 className="text-2xl font-black text-blue-950 dark:text-white uppercase tracking-tight">
            CREATE NEW CAMPUS RESOURCE
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-bold">
            Define facility parameters, seating capacity, locations, and amenities to register in the catalog.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <ResourceForm onSubmit={handleFormSubmit} loading={loading} />
        </div>

      </div>
    </DashboardLayout>
  );
};

export default CreateResource;
