/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Github, Chrome, Building2, User as UserIcon } from "lucide-react";
import { motion } from "motion/react";
import { store } from "../store";
import { UserRole } from "../types";
import { supabase } from "../services/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await store.login(email, UserRole.BUYER);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setIsLoading(true);
    try {
      await store.login("demo@bidzone.com", role);
      navigate("/dashboard");
    } catch (error) {
      console.error("Demo login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error("Google login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-neutral-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white border border-neutral-200 rounded-[2.5rem] p-8 md:p-12 shadow-sm"
      >
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6">B</div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
          <p className="text-neutral-500">Sign in to your Bidzone account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <input 
                type="email" 
                required
                className="input-field pl-12" 
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-bold text-neutral-700">Password</label>
              <a href="#" className="text-xs font-bold text-neutral-400 hover:text-neutral-900 transition-colors">Forgot?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <input 
                type="password" 
                required
                className="input-field pl-12" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2">
            Sign In <ArrowRight size={20} />
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button"
              onClick={() => handleDemoLogin(UserRole.BUYER)}
              className="py-3 px-4 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-2xl hover:bg-emerald-100 transition-colors border border-emerald-100 flex flex-col items-center gap-2"
            >
              <UserIcon size={16} /> Demo Buyer
            </button>
            <button 
              type="button"
              onClick={() => handleDemoLogin(UserRole.INSTITUTION)}
              className="py-3 px-4 text-xs font-bold text-blue-600 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors border border-blue-100 flex flex-col items-center gap-2"
            >
              <Building2 size={16} /> Demo Institution
            </button>
          </div>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest">
            <span className="bg-white px-4 text-neutral-400 font-bold">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="btn-secondary py-3 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            <Chrome size={18} /> Google
          </button>
          <button className="btn-secondary py-3 flex items-center justify-center gap-2 text-sm">
            <Github size={18} /> GitHub
          </button>
        </div>

        <p className="text-center mt-10 text-sm text-neutral-500">
          Don't have an account?{" "}
          <Link to="/signup" className="font-bold text-neutral-900 hover:underline underline-offset-4">Create one</Link>
        </p>
      </motion.div>
    </div>
  );
}
