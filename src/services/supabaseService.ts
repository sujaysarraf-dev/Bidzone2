import { supabase } from './supabase';
import { AuctionListing, UserProfile, Notification, Bid, AssetType, AuctionStatus, UserRole, UserStatus } from '../types';

// Helper to map DB row to AuctionListing
const mapAuction = (row: any): AuctionListing => ({
  id: row.id,
  title: row.title,
  description: row.description,
  assetType: row.asset_type as AssetType,
  basePrice: Number(row.base_price),
  reservePrice: Number(row.reserve_price),
  currentBid: Number(row.current_bid),
  bidCount: row.bid_count,
  startTime: row.start_time,
  endTime: row.end_time,
  status: row.status as AuctionStatus,
  location: {
    address: row.address,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
  },
  institutionId: row.institution_id,
  institutionName: row.institution_name,
  images: row.images || [],
  documents: row.documents || [],
  likesCount: row.likes_count || 0,
  sharesCount: row.shares_count || 0,
  createdAt: row.created_at,
});

// Helper to map DB row to UserProfile
const mapProfile = (row: any): UserProfile => ({
  uid: row.id,
  email: row.email,
  displayName: row.display_name,
  role: row.role as UserRole,
  status: row.status as UserStatus,
  institutionName: row.institution_name,
  phoneNumber: row.phone_number,
  photoURL: row.photo_url,
  isVerified: row.is_verified,
  createdAt: row.created_at,
});

export const auctionService = {
  async getAllAuctions(): Promise<AuctionListing[]> {
    const { data, error } = await supabase
      .from('auctions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(mapAuction);
  },

  async getAuctionById(id: string): Promise<AuctionListing | null> {
    const { data, error } = await supabase
      .from('auctions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return mapAuction(data);
  },

  async createAuction(auction: Omit<AuctionListing, 'id' | 'createdAt' | 'bidCount' | 'currentBid'>): Promise<AuctionListing> {
    const { data, error } = await supabase
      .from('auctions')
      .insert([{
        title: auction.title,
        description: auction.description,
        asset_type: auction.assetType,
        base_price: auction.basePrice,
        reserve_price: auction.reservePrice,
        current_bid: auction.basePrice,
        bid_count: 0,
        start_time: auction.startTime,
        end_time: auction.endTime,
        status: auction.status,
        address: auction.location.address,
        latitude: auction.location.latitude,
        longitude: auction.location.longitude,
        institution_id: auction.institutionId,
        institution_name: auction.institutionName,
        images: auction.images,
        documents: auction.documents,
      }])
      .select()
      .single();
    
    if (error) throw error;
    return mapAuction(data);
  },

  async getBidsByUserId(userId: string): Promise<Bid[]> {
    const { data, error } = await supabase
      .from('bids')
      .select('*')
      .eq('bidder_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(row => ({
      id: row.id,
      auctionId: row.auction_id,
      bidderId: row.bidder_id,
      bidderName: row.bidder_name,
      amount: row.amount,
      createdAt: row.created_at,
    }));
  },

  async placeBid(auctionId: string, bidderId: string, bidderName: string, amount: number): Promise<void> {
    // 1. Insert bid
    const { error: bidError } = await supabase
      .from('bids')
      .insert([{
        auction_id: auctionId,
        bidder_id: bidderId,
        bidder_name: bidderName,
        amount: amount,
      }]);
    
    if (bidError) throw bidError;

    // 2. Update auction current bid and count
    const { error: auctionError } = await supabase.rpc('increment_bid', {
      a_id: auctionId,
      new_amount: amount
    });

    // If RPC doesn't exist, we can do it manually (though RPC is safer for concurrency)
    if (auctionError) {
       const { data: currentAuction } = await supabase.from('auctions').select('bid_count').eq('id', auctionId).single();
       await supabase
        .from('auctions')
        .update({ 
          current_bid: amount,
          bid_count: (currentAuction?.bid_count || 0) + 1
        })
        .eq('id', auctionId);
    }
  },

  async deleteAuction(id: string): Promise<void> {
    const { error } = await supabase
      .from('auctions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async updateAuctionStatus(id: string, status: AuctionStatus): Promise<void> {
    const { error } = await supabase
      .from('auctions')
      .update({ status })
      .eq('id', id);
    
    if (error) throw error;
  },

  async likeAuction(auctionId: string, userId: string): Promise<boolean> {
    // 1. Check if already liked
    const { data: existingLike } = await supabase
      .from('likes')
      .select('*')
      .eq('auction_id', auctionId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      // Unlike
      await supabase.from('likes').delete().eq('id', existingLike.id);
      await supabase.rpc('decrement_likes', { a_id: auctionId });
      return false;
    } else {
      // Like
      await supabase.from('likes').insert([{ auction_id: auctionId, user_id: userId }]);
      await supabase.rpc('increment_likes', { a_id: auctionId });
      return true;
    }
  },

  async checkIfLiked(auctionId: string, userId: string): Promise<boolean> {
    const { data } = await supabase
      .from('likes')
      .select('*')
      .eq('auction_id', auctionId)
      .eq('user_id', userId)
      .single();
    return !!data;
  },

  async shareAuction(auctionId: string): Promise<void> {
    await supabase.rpc('increment_shares', { a_id: auctionId });
  }
};

export const profileService = {
  async getProfile(id: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return mapProfile(data);
  },

  async updateProfile(id: string, profile: Partial<UserProfile>): Promise<void> {
    const updateData: any = {};
    if (profile.displayName) updateData.display_name = profile.displayName;
    if (profile.phoneNumber) updateData.phone_number = profile.phoneNumber;
    if (profile.photoURL) updateData.photo_url = profile.photoURL;
    if (profile.institutionName) updateData.institution_name = profile.institutionName;
    if (profile.status) updateData.status = profile.status;
    if (profile.role) updateData.role = profile.role;

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;
  },

  async upsertProfile(profile: UserProfile): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: profile.uid,
        email: profile.email,
        display_name: profile.displayName,
        role: profile.role,
        status: profile.status,
        phone_number: profile.phoneNumber,
        photo_url: profile.photoURL,
        institution_name: profile.institutionName,
      }, { onConflict: 'id' });
    
    if (error) throw error;
  },

  async getAllProfiles(): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    
    if (error) throw error;
    return (data || []).map(mapProfile);
  }
};

export const notificationService = {
  async getNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(row => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      message: row.message,
      type: row.type as any,
      auctionId: row.auction_id,
      read: row.read,
      createdAt: row.created_at,
    }));
  },

  async markAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
    
    if (error) throw error;
  }
};
