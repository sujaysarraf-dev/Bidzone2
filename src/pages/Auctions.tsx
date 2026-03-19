/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from "react";
import { store } from "../store";
import AuctionCard from "../components/AuctionCard";
import { AuctionListing } from "../types";
import { Search, Filter, Map as MapIcon, Grid, List as ListIcon, ChevronDown, Plus, Minus, ExternalLink } from "lucide-react";
import { AssetType, AuctionStatus } from "../types";
import { clsx } from "clsx";
import { motion } from "motion/react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// Fix for default marker icons in Leaflet with React
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function Auctions() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [selectedType, setSelectedType] = useState<AssetType | "All">("All");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [auctions, setAuctions] = useState<AuctionListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      setLoading(true);
      try {
        const data = await store.getAuctions();
        setAuctions(data);
      } catch (error) {
        console.error("Failed to fetch auctions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();

    // Listen for store updates
    const handleUpdate = () => fetchAuctions();
    window.addEventListener('store-updated', handleUpdate);
    return () => window.removeEventListener('store-updated', handleUpdate);
  }, []);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearch(q);
  }, [searchParams]);

  const filteredAuctions = useMemo(() => {
    return auctions.filter(auction => {
      const matchesSearch = auction.title.toLowerCase().includes(search.toLowerCase()) || 
                           auction.description.toLowerCase().includes(search.toLowerCase()) ||
                           auction.location.address.toLowerCase().includes(search.toLowerCase());
      const matchesType = selectedType === "All" || auction.assetType === selectedType;
      return matchesSearch && matchesType;
    });
  }, [search, selectedType, auctions]);

  return (
    <div className="bg-neutral-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Browse Auctions</h1>
          <p className="text-neutral-500 max-w-2xl">
            Discover high-value assets from verified financial institutions. 
            Use filters to find exactly what you're looking for.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Category Navbar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-6 no-scrollbar border-b border-neutral-100 mb-6">
            <button
              onClick={() => setSelectedType("All")}
              className={clsx(
                "px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border",
                selectedType === "All" 
                  ? "bg-neutral-900 text-white border-neutral-900 shadow-lg shadow-neutral-900/20" 
                  : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-900 hover:text-neutral-900"
              )}
            >
              All Categories
            </button>
            {Object.values(AssetType).map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={clsx(
                  "px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border",
                  selectedType === type 
                    ? "bg-neutral-900 text-white border-neutral-900 shadow-lg shadow-neutral-900/20" 
                    : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-900 hover:text-neutral-900"
                )}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search by title, description, or location..." 
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 bg-neutral-100 p-1.5 rounded-2xl">
            <button 
              onClick={() => setViewMode("grid")}
              className={clsx(
                "p-2 rounded-lg transition-all",
                viewMode === "grid" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-700"
              )}
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={clsx(
                "p-2 rounded-lg transition-all",
                viewMode === "list" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-700"
              )}
            >
              <ListIcon size={18} />
            </button>
            <div className="w-px h-4 bg-neutral-200 mx-1"></div>
            <button 
              onClick={() => setViewMode("map")}
              className={clsx(
                "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all rounded-lg",
                viewMode === "map" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-700"
              )}
            >
              <MapIcon size={18} />
              <span className="hidden sm:inline">Map View</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mb-4"></div>
            <p className="text-neutral-500 font-medium">Loading auctions...</p>
          </div>
        ) : filteredAuctions.length > 0 ? (
          <>
            {viewMode === "map" ? (
              <div className="bg-neutral-100 rounded-[3rem] h-[600px] relative overflow-hidden border border-neutral-200 shadow-xl">
                <MapContainer 
                  center={[28.3949, 84.1240]} 
                  zoom={7} 
                  style={{ height: "100%", width: "100%", zIndex: 0 }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {filteredAuctions.map((auction) => (
                    <Marker 
                      key={auction.id} 
                      position={[auction.location.latitude, auction.location.longitude]}
                    >
                      <Popup className="custom-popup">
                        <div className="p-1 min-w-[200px]">
                          <img 
                            src={auction.images[0]} 
                            className="w-full h-24 object-cover rounded-lg mb-2" 
                            referrerPolicy="no-referrer"
                          />
                          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">{auction.assetType}</p>
                          <h4 className="font-bold text-sm mb-1">{auction.title}</h4>
                          <p className="text-xs text-neutral-500 mb-2">{auction.location.address}</p>
                          <div className="flex justify-between items-center">
                            <p className="font-bold text-neutral-900">Rs. {auction.currentBid.toLocaleString()}</p>
                            <button 
                              onClick={() => navigate(`/auctions/${auction.id}`)}
                              className="text-neutral-900 hover:text-emerald-600 transition-colors"
                            >
                              <ExternalLink size={16} />
                            </button>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>

                <div className="absolute top-8 left-8 z-[400] flex flex-col gap-2">
                  <div className="bg-white/90 backdrop-blur-sm p-4 rounded-3xl border border-neutral-200 shadow-xl max-w-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <h4 className="font-bold text-sm">Live Asset Map</h4>
                    </div>
                    <p className="text-[10px] text-neutral-500 leading-relaxed">
                      Currently viewing <strong>{filteredAuctions.length}</strong> active auctions across Nepal.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={clsx(
                "grid gap-8",
                viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              )}>
                {filteredAuctions.map(auction => (
                  <AuctionCard key={auction.id} auction={auction as AuctionListing} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-neutral-200">
            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-neutral-300" />
            </div>
            <h3 className="text-xl font-bold mb-2">No auctions found</h3>
            <p className="text-neutral-500">Try adjusting your search or filters to find what you're looking for.</p>
            <button 
              onClick={() => { setSearch(""); setSelectedType("All"); }}
              className="mt-6 text-neutral-900 font-bold underline underline-offset-4"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
