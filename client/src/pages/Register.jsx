import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiCalendar, FiBookOpen } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";

export const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    department: "",
    year: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }
    if (!formData.year) {
      newErrors.year = "Academic year is required";
    } else {
      const yr = Number(formData.year);
      if (isNaN(yr) || yr < 1 || yr > 5) {
        newErrors.year = "Enter a valid year (1 to 5)";
      }
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    // Student registration defaults role to "student"
    const result = await register(
      formData.fullName,
      formData.email,
      formData.password,
      "student",
      formData.department,
      Number(formData.year)
    );
    setLoading(false);

    if (result.success) {
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } else {
      toast.error(result.message || "Registration failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-navy-950 transition-colors duration-300">
      
      {/* Left Panel: App Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-blue-900 via-navy-950 to-cyan-900 items-center justify-center p-12 relative overflow-hidden">
        <div className="glow-bg top-[-50px] left-[-50px]"></div>
        <div className="glow-bg-blue bottom-[-50px] right-[-50px]"></div>
        
        <div className="max-w-md w-full space-y-8 text-center z-10">
          <div className="inline-flex p-4 bg-white/10 rounded-2xl border border-white/10 text-white backdrop-blur-md shadow-lg">
            <FiUser size={36} className="animate-pulse" />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent leading-snug">
              Begin Booking Campus Resources
            </h1>
            <p className="text-sm text-slate-350 leading-relaxed font-medium">
              Create your profile to search and reserve labs, projectors, sports grounds, smart classrooms, and lecture halls.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel: Glassmorphism Register Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute inset-0 block lg:hidden bg-gradient-to-br from-blue-900/10 to-cyan-900/10 -z-10"></div>
        
        <div className="w-full max-w-md glass-panel p-8 rounded-2xl shadow-xl border border-slate-200/50 dark:border-navy-900/50 my-8">
          <div className="flex flex-col items-center mb-6">
            <div className="p-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl text-white shadow-md block lg:hidden mb-4">
              <FiCalendar size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Create Student Account
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">
              Fill in your academic profile details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Full Name"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="e.g. John Doe"
              icon={FiUser}
              error={errors.fullName}
              required
            />
            
            <InputField
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="e.g. john@university.edu"
              icon={FiMail}
              error={errors.email}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Department"
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="e.g. CSE"
                icon={FiBookOpen}
                error={errors.department}
                required
              />
              <InputField
                label="Academic Year"
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                placeholder="e.g. 3"
                icon={FiCalendar}
                error={errors.year}
                required
                min="1"
                max="5"
              />
            </div>
            
            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Min 6 characters"
              icon={FiLock}
              error={errors.password}
              required
            />

            <InputField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Re-enter password"
              icon={FiLock}
              error={errors.confirmPassword}
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full py-3"
              >
                Sign Up
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400 font-medium">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300 font-bold transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;