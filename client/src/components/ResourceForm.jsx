import React, { useState, useEffect } from "react";
import { FiBox, FiSave } from "react-icons/fi";
import InputField from "./ui/InputField";
import Button from "./ui/Button";

export const ResourceForm = ({ initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "Seminar Hall",
    capacity: "",
    buildingName: "",
    floorNumber: 0,
    roomNumber: "",
    description: "",
    image: "",
    department: "",
    openingTime: "08:00",
    closingTime: "18:00",
    maxDuration: 8,
    approvalRequired: true,
    status: "Available",
    facilities: [],
    allowedUsers: ["student", "faculty", "admin"],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        // Make sure arrays are populated correctly
        facilities: initialData.facilities || [],
        allowedUsers: initialData.allowedUsers || ["student", "faculty", "admin"],
      }));
    }
  }, [initialData]);

  const facilityOptions = [
    "Projector",
    "AC",
    "WiFi",
    "Smart Board",
    "Sound System",
    "Computers",
    "White Board",
  ];

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
  
  const userRolesOptions = ["student", "faculty", "admin"];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalVal = type === "checkbox" ? checked : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" || name === "floorNumber" || name === "maxDuration"
        ? (value === "" ? "" : Number(value))
        : finalVal,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckboxChange = (fieldName, optionVal, checked) => {
    setFormData((prev) => {
      const currentList = prev[fieldName] || [];
      const updatedList = checked
        ? [...currentList, optionVal]
        : currentList.filter((x) => x !== optionVal);
      return { ...prev, [fieldName]: updatedList };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Resource name is required";
    if (!formData.capacity) {
      newErrors.capacity = "Capacity is required";
    } else if (Number(formData.capacity) < 1) {
      newErrors.capacity = "Capacity must be greater than 0";
    }
    if (!formData.buildingName.trim()) newErrors.buildingName = "Building name is required";
    if (formData.floorNumber === "") newErrors.floorNumber = "Floor number is required";
    if (!formData.roomNumber.trim()) newErrors.roomNumber = "Room number is required";
    if (!formData.openingTime) newErrors.openingTime = "Opening time is required";
    if (!formData.closingTime) newErrors.closingTime = "Closing time is required";
    if (!formData.maxDuration || Number(formData.maxDuration) < 1) {
      newErrors.maxDuration = "Max duration must be at least 1 hour";
    }
    if (formData.allowedUsers.length === 0) {
      newErrors.allowedUsers = "Select at least one allowed user role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* 2-column input block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputField
          label="Resource Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="e.g. Einstein Computing Lab"
          error={errors.name}
          required
        />

        <div className="w-full">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Resource Type (Category)
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="block w-full py-2.5 px-3 border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 text-sm transition-all shadow-xs"
          >
            {categoryOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <InputField
          label="Capacity (Seats)"
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={handleInputChange}
          placeholder="e.g. 50"
          error={errors.capacity}
          required
          min="1"
        />

        <InputField
          label="Building Name"
          type="text"
          name="buildingName"
          value={formData.buildingName}
          onChange={handleInputChange}
          placeholder="e.g. Ramanujan Block"
          error={errors.buildingName}
          required
        />

        <InputField
          label="Floor Number"
          type="number"
          name="floorNumber"
          value={formData.floorNumber}
          onChange={handleInputChange}
          placeholder="e.g. 2"
          error={errors.floorNumber}
          required
        />

        <InputField
          label="Room Number"
          type="text"
          name="roomNumber"
          value={formData.roomNumber}
          onChange={handleInputChange}
          placeholder="e.g. 204-A"
          error={errors.roomNumber}
          required
        />

        <InputField
          label="Department Liaison"
          type="text"
          name="department"
          value={formData.department}
          onChange={handleInputChange}
          placeholder="e.g. CSE / Chemistry"
        />

        <div className="w-full">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Resource Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="block w-full py-2.5 px-3 border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 text-sm transition-all shadow-xs"
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <InputField
          label="Opening Time"
          type="time"
          name="openingTime"
          value={formData.openingTime}
          onChange={handleInputChange}
          required
        />

        <InputField
          label="Closing Time"
          type="time"
          name="closingTime"
          value={formData.closingTime}
          onChange={handleInputChange}
          required
        />

        <InputField
          label="Max Booking Duration (Hours)"
          type="number"
          name="maxDuration"
          value={formData.maxDuration}
          onChange={handleInputChange}
          required
          min="1"
          max="24"
        />

        <InputField
          label="Image URL"
          type="text"
          name="image"
          value={formData.image}
          onChange={handleInputChange}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
          Resource Description
        </label>
        <textarea
          name="description"
          rows="3"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter a brief summary of the resource facilities, guidelines, etc."
          className="block w-full py-2.5 px-3 border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 text-sm transition-all"
        ></textarea>
      </div>

      {/* Facilities Checkboxes */}
      <div className="space-y-2 border-t border-slate-200/50 dark:border-navy-900/50 pt-4">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Select Facilities
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {facilityOptions.map((fac) => (
            <label
              key={fac}
              className="flex items-center space-x-2 text-sm font-semibold text-slate-600 dark:text-slate-350 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={formData.facilities.includes(fac)}
                onChange={(e) => handleCheckboxChange("facilities", fac, e.target.checked)}
                className="rounded text-cyan-500 focus:ring-cyan-500 dark:bg-navy-800 border-slate-300 dark:border-navy-700"
              />
              <span>{fac}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Allowed Users Checkboxes */}
      <div className="space-y-2 border-t border-slate-200/50 dark:border-navy-900/50 pt-4">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Allowed User Roles
        </label>
        <div className="flex space-x-6">
          {userRolesOptions.map((role) => (
            <label
              key={role}
              className="flex items-center space-x-2 text-sm font-semibold text-slate-600 dark:text-slate-350 uppercase cursor-pointer"
            >
              <input
                type="checkbox"
                checked={formData.allowedUsers.includes(role)}
                onChange={(e) => handleCheckboxChange("allowedUsers", role, e.target.checked)}
                className="rounded text-cyan-500 focus:ring-cyan-500 dark:bg-navy-800 border-slate-300 dark:border-navy-700"
              />
              <span>{role}</span>
            </label>
          ))}
        </div>
        {errors.allowedUsers && <p className="text-xs text-red-500">{errors.allowedUsers}</p>}
      </div>

      {/* Approval Required Switch */}
      <div className="flex items-center space-x-3 border-t border-slate-200/50 dark:border-navy-900/50 pt-4">
        <input
          type="checkbox"
          id="approvalRequired"
          name="approvalRequired"
          checked={formData.approvalRequired}
          onChange={handleInputChange}
          className="rounded text-cyan-500 focus:ring-cyan-500 dark:bg-navy-800 border-slate-300 dark:border-navy-700 w-4 h-4 cursor-pointer"
        />
        <label
          htmlFor="approvalRequired"
          className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          Requires Administrator Approval For Reservation
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-slate-200/50 dark:border-navy-900/50">
        <Button type="submit" variant="primary" loading={loading} className="w-full sm:w-auto px-6">
          <FiSave className="mr-2" />
          <span>Save Resource Details</span>
        </Button>
      </div>

    </form>
  );
};

export default ResourceForm;
