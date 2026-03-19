/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useParams, Link } from "react-router-dom";
import { store } from "../store";
import { ASSET_TYPE_COLORS } from "../constants";
import { 
  MapPin, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Info, 
  ArrowLeft, 
  Share2, 
  Heart,
  Calendar,
  Building2,
  User,
  History
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { clsx } from "clsx";

export default function AuctionDetails() {
  const { id } = useParams();
  const [auction, setAuction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [isBidding, setIsBidding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const fetchAuction = async () => {
    if (!id) return;
    try {
      const data = await store.getAuctionById(id);
      setAuction(data);
      
      const liked = await store.checkIfLiked(id);
      setIsLiked(liked);
    } catch (error) {
      console.error("Failed to fetch auction:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuction();

    // Listen for store updates
    const handleUpdate = () => fetchAuction();
    window.addEventListener('store-updated', handleUpdate);
    return () => window.removeEventListener('store-updated', handleUpdate);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Auction not found</h2>
        <Link to="/auctions" className="btn-primary">Back to Auctions</Link>
      </div>
    );
  }

  const handlePlaceBid = async () => {
    const amount = parseInt(bidAmount);
    if (isNaN(amount)) {
      setError("Please enter a valid amount");
      return;
    }

    setIsBidding(true);
    setError("");

    try {
      const result = await store.placeBid(auction.id, amount);
      if (result.success) {
        setShowSuccess(true);
        setBidAmount("");
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setError(result.message || "Failed to place bid");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsBidding(false);
    }
  };

  const timeLeft = formatDistanceToNow(new Date(auction.endTime), { addSuffix: true });

  const handleLike = async () => {
    if (!store.getUser()) {
      setError("Please login to like auctions");
      return;
    }
    const result = await store.likeAuction(auction.id);
    setIsLiked(result);
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      await store.shareAuction(auction.id);
      if (navigator.share) {
        await navigator.share({
          title: auction.title,
          text: auction.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="bg-neutral-50 min-h-screen pb-20">
      {/* Breadcrumbs & Actions */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-wrap items-center justify-between gap-4">
        <Link to="/auctions" className="flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-neutral-900 transition-colors">
          <ArrowLeft size={18} /> Back to Listings
        </Link>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleShare}
            disabled={isSharing}
            className="p-2 bg-white border border-neutral-200 rounded-xl text-neutral-500 hover:text-neutral-900 transition-all flex items-center gap-2"
          >
            <Share2 size={18} />
            {auction.sharesCount > 0 && <span className="text-xs font-bold">{auction.sharesCount}</span>}
          </button>
          <button 
            onClick={handleLike}
            className={clsx(
              "p-2 bg-white border border-neutral-200 rounded-xl transition-all flex items-center gap-2",
              isLiked ? "text-red-500 border-red-100 bg-red-50" : "text-neutral-500 hover:text-red-500"
            )}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
            {auction.likesCount > 0 && <span className="text-xs font-bold">{auction.likesCount}</span>}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Images & Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Image */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-neutral-200 rounded-[2.5rem] overflow-hidden shadow-sm"
          >
            <div className="aspect-video relative">
              <img 
                src={auction.images[0]} 
                alt={auction.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-6 left-6">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${ASSET_TYPE_COLORS[auction.assetType]}`}>
                  {auction.assetType}
                </span>
              </div>
            </div>
            {/* Thumbnails */}
            <div className="p-4 flex gap-4 overflow-x-auto">
              {auction.images.map((img, i) => (
                <button key={i} className="w-24 h-16 rounded-xl overflow-hidden border-2 border-transparent hover:border-neutral-900 transition-all flex-shrink-0">
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Description */}
          <div className="bg-white border border-neutral-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
            <h1 className="text-3xl font-bold tracking-tight mb-4">{auction.title}</h1>
            <div className="flex items-center gap-4 text-neutral-500 text-sm mb-8">
              <div className="flex items-center gap-1.5">
                <MapPin size={16} />
                <span>{auction.location.address}</span>
              </div>
              <div className="w-1 h-1 bg-neutral-300 rounded-full"></div>
              <div className="flex items-center gap-1.5">
                <Calendar size={16} />
                <span>Listed 2 days ago</span>
              </div>
            </div>

            <div className="prose prose-neutral max-w-none">
              <h3 className="text-lg font-bold mb-4">Description</h3>
              <p className="text-neutral-600 leading-relaxed">
                {auction.description}
              </p>
              <p className="text-neutral-600 leading-relaxed mt-4">
                This asset is being recovered by {auction.institutionId}. It has been thoroughly inspected and verified for legal compliance. 
                Potential bidders are encouraged to review all documentation before placing a bid.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-neutral-100">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block mb-1">Institution</span>
                <div className="flex items-center gap-2">
                  <Building2 size={16} className="text-neutral-900" />
                  <span className="font-bold text-sm">{auction.institutionId}</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block mb-1">Asset ID</span>
                <span className="font-bold text-sm">#BZ-{auction.id.slice(0, 6).toUpperCase()}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block mb-1">Condition</span>
                <span className="font-bold text-sm">Excellent</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block mb-1">Verified</span>
                <div className="flex items-center gap-1 text-emerald-600">
                  <ShieldCheck size={16} />
                  <span className="font-bold text-sm">Yes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bidding Card */}
        <div className="space-y-6">
          <div className="bg-white border border-neutral-200 rounded-[2.5rem] p-8 shadow-xl sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-emerald-600">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold uppercase tracking-wider">Live Auction</span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-500 text-sm">
                <Clock size={16} />
                <span>{timeLeft}</span>
              </div>
            </div>

            <div className="mb-8">
              <span className="text-neutral-500 text-sm block mb-1">Current Bid</span>
              <div className="flex items-baseline gap-2">
                <h2 className="text-4xl font-bold tracking-tight">Rs. {auction.currentBid.toLocaleString()}</h2>
                <span className="text-neutral-400 text-sm">NPR</span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-neutral-500">
                <TrendingUp size={14} className="text-emerald-500" />
                <span>{auction.bidCount} bids placed</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-neutral-400">Rs.</span>
                <input 
                  type="number" 
                  placeholder={`Min. ${(auction.currentBid + 10000).toLocaleString()}`}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl py-4 pl-12 pr-4 font-bold focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  disabled={isBidding}
                />
              </div>
              <button 
                onClick={handlePlaceBid}
                disabled={isBidding || !bidAmount}
                className={clsx(
                  "btn-primary w-full py-4 text-lg flex items-center justify-center gap-2",
                  (isBidding || !bidAmount) && "opacity-50 cursor-not-allowed"
                )}
              >
                {isBidding ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  "Place Bid"
                )}
              </button>
              
              {showSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-100 text-emerald-700 p-3 rounded-xl text-xs font-bold text-center"
                >
                  Bid placed successfully!
                </motion.div>
              )}

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-100 text-red-700 p-3 rounded-xl text-xs font-bold text-center"
                >
                  {error}
                </motion.div>
              )}

              <p className="text-[10px] text-center text-neutral-400 uppercase font-bold tracking-widest">
                By bidding, you agree to our Terms of Service
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-neutral-100">
              <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                <History size={16} /> Recent Bids
              </h4>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-neutral-100 rounded-full flex items-center justify-center">
                        <User size={12} className="text-neutral-500" />
                      </div>
                      <span className="font-medium">User ***{i}29</span>
                    </div>
                    <span className="font-bold">Rs. {(auction.currentBid - i * 50000).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-6 flex gap-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-emerald-900">Bidzone Protection</h4>
              <p className="text-xs text-emerald-700 mt-1">
                Your funds are held in escrow until the asset transfer is complete and verified.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
