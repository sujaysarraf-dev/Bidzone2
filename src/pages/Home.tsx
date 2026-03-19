/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Search, ArrowRight, Shield, Zap, Globe } from "lucide-react";
import { store } from "../store";
import { AuctionListing } from "../types";
import AuctionCard from "../components/AuctionCard";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredAuctions, setFeaturedAuctions] = useState<AuctionListing[]>([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchAuctions = async () => {
      const auctions = await store.getAuctions();
      setFeaturedAuctions(auctions.slice(0, 3));
    };
    fetchAuctions();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/auctions?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/auctions");
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4 overflow-hidden bg-neutral-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#4f46e5,transparent_50%)]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              The Future of <span className="text-emerald-400">Asset Recovery</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10">
              Bidzone aggregates financial asset auctions from top institutions, 
              providing a transparent, secure, and intelligent marketplace for buyers.
            </p>
            
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
              <div className="w-full relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                <input 
                  type="text" 
                  placeholder="Search real estate, vehicles..." 
                  className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-neutral-900 font-bold px-8 py-4 rounded-2xl transition-all whitespace-nowrap flex items-center justify-center">
                Browse All
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure & Verified</h3>
              <p className="text-neutral-500 text-sm">
                All listings are verified by participating financial institutions, ensuring legal compliance and transparency.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Real-time Bidding</h3>
              <p className="text-neutral-500 text-sm">
                Experience the thrill of live auctions with instant updates, outbid notifications, and countdown timers.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                <Globe size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Geolocation Discovery</h3>
              <p className="text-neutral-500 text-sm">
                Find auctions near you with our integrated map view and location-based search filters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="py-20 px-4 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Auctions</h2>
              <p className="text-neutral-500">Handpicked opportunities ending soon.</p>
            </div>
            <Link to="/auctions" className="flex items-center gap-2 text-neutral-900 font-bold hover:gap-3 transition-all">
              View All <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredAuctions.map(auction => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto bg-neutral-900 rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to start bidding?</h2>
            <p className="text-neutral-400 text-lg mb-10 max-w-xl mx-auto">
              Join thousands of buyers and institutions on the most advanced auction platform in Nepal.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="btn-primary bg-white text-neutral-900 hover:bg-neutral-100 px-10 py-4 text-lg flex items-center justify-center">
                Create Account
              </Link>
              <Link to="/login" className="text-white font-bold hover:text-emerald-400 transition-colors flex items-center gap-2">
                Institution Login <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
