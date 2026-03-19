/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { store } from "../store";
import { AssetType, AuctionStatus } from "../types";
import { 
  ArrowLeft, 
  Upload, 
  MapPin, 
  Calendar, 
  DollarSign,
  Info
} from "lucide-react";
import { motion } from "motion/react";

export default function CreateAuction() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assetType: AssetType.REAL_ESTATE,
    basePrice: "",
    reservePrice: "",
    endTime: "",
    address: "",
    latitude: "27.7172",
    longitude: "85.3240",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const user = await store.getUser();
      await store.createAuction({
        title: formData.title,
        description: formData.description,
        assetType: formData.assetType,
        basePrice: Number(formData.basePrice),
        reservePrice: Number(formData.reservePrice),
        startTime: new Date().toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        status: AuctionStatus.PENDING, // Default to pending for admin review
        location: {
          address: formData.address,
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude),
        },
        institutionId: user?.uid || "inst-demo",
        institutionName: user?.displayName || "Demo Institution",
        images: ["https://picsum.photos/seed/new-auction/800/600"],
        documents: [{ name: "Property Document.pdf", url: "#" }],
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to create auction", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 mb-8 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] border border-neutral-200 shadow-sm overflow-hidden"
        >
          <div className="p-8 md:p-12 border-b border-neutral-100">
            <h1 className="text-3xl font-bold tracking-tight">Create New Auction</h1>
            <p className="text-neutral-500 mt-2">Fill in the details to list your financial asset for auction.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
            {/* Basic Info */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-neutral-900 font-bold">
                <Info size={20} />
                <h3>Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700">Auction Title</label>
                  <input 
                    required
                    type="text"
                    placeholder="e.g. Prime Commercial Land in Kathmandu"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700">Description</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Provide detailed information about the asset..."
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-neutral-700">Asset Type</label>
                    <select 
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                      value={formData.assetType}
                      onChange={e => setFormData({...formData, assetType: e.target.value as AssetType})}
                    >
                      {Object.values(AssetType).map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-neutral-700">End Date & Time</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                      <input 
                        required
                        type="datetime-local"
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                        value={formData.endTime}
                        onChange={e => setFormData({...formData, endTime: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Pricing */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-neutral-900 font-bold">
                <DollarSign size={20} />
                <h3>Pricing Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700">Base Price (NPR)</label>
                  <input 
                    required
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                    value={formData.basePrice}
                    onChange={e => setFormData({...formData, basePrice: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700">Reserve Price (NPR)</label>
                  <input 
                    required
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                    value={formData.reservePrice}
                    onChange={e => setFormData({...formData, reservePrice: e.target.value})}
                  />
                </div>
              </div>
            </section>

            {/* Location */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-neutral-900 font-bold">
                <MapPin size={20} />
                <h3>Location Details</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700">Full Address</label>
                  <input 
                    required
                    type="text"
                    placeholder="e.g. Durbar Marg, Kathmandu"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-neutral-700">Latitude</label>
                    <input 
                      type="text"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                      value={formData.latitude}
                      onChange={e => setFormData({...formData, latitude: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-neutral-700">Longitude</label>
                    <input 
                      type="text"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                      value={formData.longitude}
                      onChange={e => setFormData({...formData, longitude: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Media */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-neutral-900 font-bold">
                <Upload size={20} />
                <h3>Media & Documents</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-neutral-200 rounded-[2rem] p-8 text-center hover:border-neutral-900 transition-colors cursor-pointer">
                  <Upload className="mx-auto mb-4 text-neutral-400" size={32} />
                  <p className="text-sm font-bold">Upload Images</p>
                  <p className="text-xs text-neutral-400 mt-1">PNG, JPG up to 10MB</p>
                </div>
                <div className="border-2 border-dashed border-neutral-200 rounded-[2rem] p-8 text-center hover:border-neutral-900 transition-colors cursor-pointer">
                  <Upload className="mx-auto mb-4 text-neutral-400" size={32} />
                  <p className="text-sm font-bold">Upload Documents</p>
                  <p className="text-xs text-neutral-400 mt-1">PDF, DOC up to 20MB</p>
                </div>
              </div>
            </section>

            <div className="pt-8 border-t border-neutral-100">
              <button 
                disabled={loading}
                type="submit"
                className="w-full btn-primary py-4 text-lg shadow-xl shadow-emerald-500/20 disabled:opacity-50"
              >
                {loading ? "Creating Auction..." : "Launch Auction"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
