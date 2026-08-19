import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiMail, FiLock, FiCalendar, FiUserCheck, FiShield } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";

export const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const fillDemo = (email, password) => {
    setFormData({ email, password });
    setErrors({});
    toast.success(`Loaded credentials for ${email}`);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      toast.success("Welcome back! Login successful.");
    } else {
      toast.error(result.message || "Invalid credentials.");
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Left Showcase Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-950 via-slate-900 to-red-950 items-center justify-center p-12 relative overflow-hidden text-white">
        <div className="max-w-md w-full space-y-8 text-center z-10">
          
          <div className="inline-flex p-4 bg-red-600/30 rounded-full border-2 border-red-500 text-white backdrop-blur-md shadow-2xl">
            <FiCalendar size={42} className="text-amber-400 animate-pulse" />
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-black uppercase tracking-tight text-white leading-snug">
              AAACET RESOURCE & LABORATORY RESERVATION PORTAL
            </h1>
            <p className="text-sm text-slate-350 leading-relaxed font-medium">
              Seamlessly log in to book seminar halls, advanced computer workstations, smart classrooms, and auditoriums across departments.
            </p>
          </div>

          <div className="pt-8 border-t border-white/10 grid grid-cols-2 gap-4 text-white text-center">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <p className="text-2xl font-black text-amber-400">STUDENT</p>
              <p className="text-[10px] uppercase font-bold text-slate-300">Instant Requests</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <p className="text-2xl font-black text-amber-400">ADMIN</p>
              <p className="text-[10px] uppercase font-bold text-slate-300">Approval Controls</p>
            </div>
          </div>

        </div>
      </div>

      {/* Right Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800">
          
          <div className="flex flex-col items-center mb-6 text-center">
            <span className="text-xs font-black uppercase text-red-600 tracking-widest mb-1">
              AAA COLLEGE PORTAL
            </span>
            <h2 className="text-2xl font-black text-blue-950 dark:text-white uppercase tracking-tight">
              SIGN IN TO YOUR ACCOUNT
            </h2>
          </div>

          {/* Preset Demo Buttons */}
          <div className="mb-6 p-3 bg-blue-50 dark:bg-slate-800/80 rounded-xl border border-blue-200 dark:border-slate-700 space-y-2">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block text-center">
              Demo Credentials Preset
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemo("student@campus.edu", "student123")}
                className="flex items-center justify-center gap-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-800 dark:text-slate-200 text-xs font-bold py-1.5 px-2 rounded-lg transition-all"
              >
                <FiUserCheck className="text-blue-600" />
                <span>Student Login</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo("admin@campus.edu", "admin123")}
                className="flex items-center justify-center gap-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-800 dark:text-slate-200 text-xs font-bold py-1.5 px-2 rounded-lg transition-all"
              >
                <FiShield className="text-red-600" />
                <span>Admin Login</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="e.g. student@campus.edu"
              icon={FiMail}
              error={errors.email}
              required
            />
            
            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              icon={FiLock}
              error={errors.password}
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                loading={loading}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Sign In
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400 font-bold">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-red-600 hover:text-red-700 dark:text-red-400 uppercase tracking-wide underline ml-1"
            >
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;