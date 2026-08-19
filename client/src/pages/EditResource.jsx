import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiChevronLeft } from "react-icons/fi";
import * as resourceService from "../services/resourceService";
import DashboardLayout from "../layouts/DashboardLayout";
import ResourceForm from "../components/ResourceForm";
import Loader from "../components/ui/Loader";

export const EditResource = () => {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const data = await resourceService.getResourceById(id);
        if (data.success) {
          setResource(data.resource);
        } else {
          toast.error("Failed to load resource details.");
          navigate("/admin/resources");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error retrieving resource data.");
        navigate("/admin/resources");
      } finally {
        setFetching(false);
      }
    };
    
    fetchResource();
  }, [id, navigate]);

  const handleFormSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const data = await resourceService.updateResource(id, formData);
      if (data.success) {
        toast.success("Resource details updated successfully.");
        navigate("/admin/resources");
      } else {
        toast.error(data.message || "Failed to update resource.");
      }
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || "Server error while updating resource.";
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Back Link */}
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
            RESOURCE UPDATE PANEL
          </div>
          <h1 className="text-2xl font-black text-blue-950 dark:text-white uppercase tracking-tight">
            EDIT RESOURCE DETAILS
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-bold">
            Modify any values for this resource. All changes reflect live instantly.
          </p>
        </div>

        {/* Form panel */}
        {fetching ? (
          <Loader />
        ) : (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <ResourceForm
              initialData={resource}
              onSubmit={handleFormSubmit}
              loading={submitting}
            />
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default EditResource;
