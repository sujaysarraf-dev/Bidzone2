/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Github, Chrome, User, Phone, Building2 } from "lucide-react";
import { motion } from "motion/react";
import { store } from "../store";
import { UserRole } from "../types";
import { clsx } from "clsx";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [role, setRole] = useState<UserRole>(UserRole.BUYER);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const result = await store.signup(formData.email, formData.password, {
        displayName: formData.name,
        phoneNumber: formData.phone,
        role: role,
        institutionName: role === UserRole.INSTITUTION ? formData.name : undefined
      });
      if (result.success) {
        navigate("/dashboard");
      } else {
        alert(result.message || "Signup failed");
      }
    } catch (error: any) {
      alert(error.message || "Signup failed");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-neutral-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-white border border-neutral-200 rounded-[2.5rem] p-8 md:p-12 shadow-sm"
      >
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6">B</div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Create Account</h1>
          <p className="text-neutral-500">Join the intelligent auction platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-700 ml-1">Account Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole(UserRole.BUYER)}
                className={clsx(
                  "flex items-center justify-center gap-2 py-3 rounded-2xl border-2 transition-all font-bold text-sm",
                  role === UserRole.BUYER 
                    ? "border-neutral-900 bg-neutral-900 text-white shadow-lg shadow-neutral-900/20" 
                    : "border-neutral-100 text-neutral-400 hover:border-neutral-200"
                )}
              >
                <User size={18} /> Individual
              </button>
              <button
                type="button"
                onClick={() => setRole(UserRole.INSTITUTION)}
                className={clsx(
                  "flex items-center justify-center gap-2 py-3 rounded-2xl border-2 transition-all font-bold text-sm",
                  role === UserRole.INSTITUTION 
                    ? "border-neutral-900 bg-neutral-900 text-white shadow-lg shadow-neutral-900/20" 
                    : "border-neutral-100 text-neutral-400 hover:border-neutral-200"
                )}
              >
                <Building2 size={18} /> Institution
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-700 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input 
                  type="text" 
                  name="name"
                  required
                  className="input-field pl-12" 
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-700 ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input 
                  type="tel" 
                  name="phone"
                  required
                  className="input-field pl-12" 
                  placeholder="+977 98..."
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <input 
                type="email" 
                name="email"
                required
                className="input-field pl-12" 
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-700 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input 
                  type="password" 
                  name="password"
                  required
                  className="input-field pl-12" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-700 ml-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input 
                  type="password" 
                  name="confirmPassword"
                  required
                  className="input-field pl-12" 
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2">
            Create Account <ArrowRight size={20} />
          </button>

          <button 
            type="button"
            onClick={() => navigate("/dashboard")}
            className="w-full py-3 text-sm font-bold text-emerald-600 bg-emerald-50 rounded-2xl hover:bg-emerald-100 transition-colors border border-emerald-100"
          >
            Try Demo Account
          </button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest">
            <span className="bg-white px-4 text-neutral-400 font-bold">Or sign up with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="btn-secondary py-3 flex items-center justify-center gap-2 text-sm">
            <Chrome size={18} /> Google
          </button>
          <button className="btn-secondary py-3 flex items-center justify-center gap-2 text-sm">
            <Github size={18} /> GitHub
          </button>
        </div>

        <p className="text-center mt-10 text-sm text-neutral-500">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-neutral-900 hover:underline underline-offset-4">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
}
