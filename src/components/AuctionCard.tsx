/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AuctionListing } from "../types";
import { MapPin, Clock, TrendingUp, ArrowRight, Heart, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { ASSET_TYPE_COLORS } from "../constants";
import { formatDistanceToNow } from "date-fns";
import { motion } from "motion/react";

interface AuctionCardProps {
  auction: AuctionListing;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ auction }) => {
  const timeLeft = formatDistanceToNow(new Date(auction.endTime), { addSuffix: true });
  const isEndingSoon = new Date(auction.endTime).getTime() - Date.now() < 86400000; // Less than 24h

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={auction.images[0]} 
          alt={auction.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${ASSET_TYPE_COLORS[auction.assetType]}`}>
            {auction.assetType}
          </span>
          {isEndingSoon && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 animate-pulse">
              Ending Soon
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-1.5 text-neutral-400 text-xs mb-2">
          <MapPin size={12} />
          <span>{auction.location.address}</span>
        </div>
        
        <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-neutral-700 transition-colors">
          {auction.title}
        </h3>
        
        <p className="text-neutral-500 text-sm mb-4 line-clamp-2">
          {auction.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-neutral-50 rounded-xl">
          <div>
            <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block mb-1">Current Bid</span>
            <span className="font-bold text-neutral-900">Rs. {auction.currentBid.toLocaleString()}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block mb-1">Time Left</span>
            <span className="font-medium text-neutral-700 text-sm">{timeLeft}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-neutral-500">
              <TrendingUp size={14} className="text-emerald-500" />
              <span>{auction.bidCount}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-neutral-500">
              <Heart size={14} className="text-red-500" />
              <span>{auction.likesCount || 0}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-neutral-500">
              <Share2 size={14} className="text-blue-500" />
              <span>{auction.sharesCount || 0}</span>
            </div>
          </div>
          
          <Link 
            to={`/auctions/${auction.id}`}
            className="flex items-center gap-1 text-sm font-bold text-neutral-900 hover:gap-2 transition-all"
          >
            View
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default AuctionCard;
