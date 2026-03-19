/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, Bell, Search, Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { store } from "../store";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(store.getUser());

  useEffect(() => {
    const handleUpdate = () => setUser(store.getUser());
    window.addEventListener('store-updated', handleUpdate);
    return () => window.removeEventListener('store-updated', handleUpdate);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Auctions", path: "/auctions" },
    { name: "About", path: "/about" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    store.logout();
    navigate("/");
  };

  return (
    <header className="h-16 border-b border-neutral-200 bg-white/80 backdrop-blur-md flex items-center px-4 md:px-8 justify-between sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white font-bold">B</div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">Bidzone</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-neutral-900",
                isActive(link.path) ? "text-neutral-900" : "text-neutral-500"
              )}
            >
              {link.name}
            </Link>
          ))}
          {user && (
            <Link
              to="/dashboard"
              className={cn(
                "text-sm font-medium transition-colors hover:text-neutral-900 flex items-center gap-1.5",
                isActive("/dashboard") ? "text-neutral-900" : "text-neutral-500"
              )}
            >
              <LayoutDashboard size={14} /> Dashboard
            </Link>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden sm:flex items-center bg-neutral-100 rounded-full px-3 py-1.5 gap-2 border border-neutral-200 focus-within:ring-2 focus-within:ring-neutral-900/10 transition-all">
          <Search size={16} className="text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search auctions..." 
            className="bg-transparent border-none outline-none text-sm w-32 md:w-48"
          />
        </div>

        <button className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {user ? (
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-full">
              <div className="w-6 h-6 bg-neutral-900 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                {user.displayName[0]}
              </div>
              <span className="text-xs font-bold text-neutral-900">{user.displayName}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link to="/login" className="hidden md:block">
            <button className="btn-primary py-1.5 px-4 text-sm">Sign In</button>
          </Link>
        )}

        <button 
          className="md:hidden p-2 text-neutral-500 hover:bg-neutral-100 rounded-full transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-b border-neutral-200 p-4 flex flex-col gap-4 md:hidden animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-lg font-medium py-2",
                isActive(link.path) ? "text-neutral-900" : "text-neutral-500"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {user && (
            <Link
              to="/dashboard"
              className={cn(
                "text-lg font-medium py-2 flex items-center gap-2",
                isActive("/dashboard") ? "text-neutral-900" : "text-neutral-500"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <LayoutDashboard size={20} /> Dashboard
            </Link>
          )}
          <div className="pt-4 border-t border-neutral-100">
            {user ? (
              <button 
                onClick={handleLogout}
                className="w-full py-3 text-red-500 font-bold border border-red-100 rounded-xl hover:bg-red-50 transition-all flex items-center justify-center gap-2"
              >
                <LogOut size={18} /> Sign Out
              </button>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <button className="btn-primary w-full">Sign In</button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
